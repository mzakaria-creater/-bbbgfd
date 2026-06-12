-- =========================================================================
-- FINLUX GATEWAY - SUPABASE RPC TRANSACTION ALLOCATION ENGINE
-- =========================================================================
-- DESCRIPTION: Standard PostgreSQL & PL/pgSQL database functions for
-- transactional mobile wallet allocations in high-volume environments (e.g. Egypt).
-- Incorporates STRICT SELECT FOR UPDATE queue serialization to safeguard against
-- double-allocation and capacity overselling.
-- =========================================================================

----------------------------------------------------------------------------
-- 1) RPC FUNCTION: allocate_wallets
-- Locks matching wallets, verifies daily/monthly limits, and reserves capacity.
-- Returns the newly generated allocation ID if successful.
----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION allocate_wallets(
  p_amount NUMERIC,
  p_provider TEXT,
  p_duration_minutes INT DEFAULT 15
)
RETURNS UUID AS $$
DECLARE
  v_allocation_id UUID;
  v_wallet RECORD;
  v_remaining_amount NUMERIC := p_amount;
  v_allocated_amount NUMERIC;
  v_wallet_avail NUMERIC;
  v_temp_reserved NUMERIC;
BEGIN
  -- 1) Prevent negative or zero amounts
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Allocation amount must be greater than zero. Received: %', p_amount;
  END IF;

  -- 2) Pre-generate parent allocation record in 'Reserved' state
  INSERT INTO wallet_allocations (
    amount,
    status,
    fallback_used,
    created_at,
    expires_at
  ) VALUES (
    p_amount,
    'Reserved',
    'None',
    NOW(),
    NOW() + (p_duration_minutes || ' minutes')::INTERVAL
  ) RETURNING id INTO v_allocation_id;

  -- 3) Iterate and lock potential candidate wallets sequentially using SELECT FOR UPDATE
  -- We order by priority DESC to utilize preferred high-capacity lines first
  FOR v_wallet IN (
    SELECT id, daily_limit, monthly_limit, used_today, used_month, reserved_today
    FROM payment_wallets
    WHERE provider = p_provider AND status = 'active'
    ORDER BY priority DESC, id ASC
    FOR UPDATE -- <--- CRITICAL row-level lock shuts out parallel threads
  ) LOOP
    IF v_remaining_amount <= 0 THEN
      EXIT; -- Done!
    END IF;

    -- Calculate remaining safe capacity for this locked row (daily and monthly constraints)
    v_wallet_avail := LEAST(
      v_wallet.daily_limit - v_wallet.used_today - v_wallet.reserved_today,
      v_wallet.monthly_limit - v_wallet.used_month - v_wallet.reserved_today
    );

    IF v_wallet_avail > 0 THEN
      -- Allocate up to remaining or max wallet limit
      v_allocated_amount := LEAST(v_remaining_amount, v_wallet_avail);
      
      -- Insert item line link
      INSERT INTO wallet_allocation_items (
        allocation_id,
        wallet_id,
        allocated_amount
      ) VALUES (
        v_allocation_id,
        v_wallet.id,
        v_allocated_amount
      );

      -- Update the cached holding reserve in the locked wallet row immediately
      UPDATE payment_wallets
      SET reserved_today = reserved_today + v_allocated_amount,
          updated_at = NOW()
      WHERE id = v_wallet.id;

      v_remaining_amount := v_remaining_amount - v_allocated_amount;
    END IF;
  END LOOP;

  -- 4) If they could not accommodate the full balance, rollback and cancel
  IF v_remaining_amount > 0 THEN
    -- Throwing an exception rolls back the entire transactional block automatically
    RAISE EXCEPTION 'Insufficient capacity available on active % wallets. Missing EGP %', p_provider, v_remaining_amount;
  END IF;

  RETURN v_allocation_id;
END;
$$ LANGUAGE plpgsql;


----------------------------------------------------------------------------
-- 2) RPC FUNCTION: confirm_wallet_allocation
-- Transitions a payment reservation from Pending -> Paid.
-- Deducts reserve buffers and locks permanent spend limits securely.
----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION confirm_wallet_allocation(
  p_allocation_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_alloc_status TEXT;
  v_item RECORD;
BEGIN
  -- Lock parent record to isolate states
  SELECT status INTO v_alloc_status
  FROM wallet_allocations
  WHERE id = p_allocation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Allocation record with ID % not found', p_allocation_id;
  END IF;

  -- Guard states: Only Reserved records can be confirmed
  IF v_alloc_status = 'Confirmed' THEN
    RETURN TRUE; -- Idempotence: already processed
  ELSIF v_alloc_status != 'Reserved' THEN
    RAISE EXCEPTION 'Cannot confirm allocation in % state', v_alloc_status;
  END IF;

  -- Iterate through items, lock respective wallets, convert reserves to hard spend limits
  FOR v_item IN (
    SELECT wallet_id, allocated_amount
    FROM wallet_allocation_items
    WHERE allocation_id = p_allocation_id
    FOR UPDATE
  ) LOOP
    UPDATE payment_wallets
    SET reserved_today = GREATEST(0, reserved_today - v_item.allocated_amount),
        used_today = used_today + v_item.allocated_amount,
        used_month = used_month + v_item.allocated_amount,
        updated_at = NOW()
    WHERE id = v_item.wallet_id;
  END LOOP;

  -- Update final status on parent
  UPDATE wallet_allocations
  SET status = 'Confirmed',
      updated_at = NOW()
  WHERE id = p_allocation_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


----------------------------------------------------------------------------
-- 3) RPC FUNCTION: release_wallet_allocation
-- Forfeits or times out a pending reservation.
-- Drops reserve holds immediately to reclaim node resources.
----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION release_wallet_allocation(
  p_allocation_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_alloc_status TEXT;
  v_item RECORD;
BEGIN
  -- Lock parent record
  SELECT status INTO v_alloc_status
  FROM wallet_allocations
  WHERE id = p_allocation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Allocation record with ID % not found', p_allocation_id;
  END IF;

  -- If already released, returned to catalog
  IF v_alloc_status IN ('Cancelled', 'Expired', 'Rejected') THEN
    RETURN TRUE;
  ELSIF v_alloc_status = 'Confirmed' THEN
    RAISE EXCEPTION 'Cannot release capacity for already confirmed settlement Ledger';
  END IF;

  -- Iterate, lock, and decrement reserved capacity
  FOR v_item IN (
    SELECT wallet_id, allocated_amount
    FROM wallet_allocation_items
    WHERE allocation_id = p_allocation_id
    FOR UPDATE
  ) LOOP
    UPDATE payment_wallets
    SET reserved_today = GREATEST(0, reserved_today - v_item.allocated_amount),
        updated_at = NOW()
    WHERE id = v_item.wallet_id;
  END LOOP;

  -- Set terminal failure state
  UPDATE wallet_allocations
  SET status = 'Cancelled',
      updated_at = NOW()
  WHERE id = p_allocation_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;


----------------------------------------------------------------------------
-- 4) ADMINISTRATIVE SCHEDULED FUNCTION: reset_wallet_daily_limits
-- Triggered automatically at midnight Cairo Time (or UTC) via pg_cron or scheduled webhooks.
-- Resets standard daily limit bounds for pristine rolling balance calculations.
----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION reset_wallet_daily_limits()
RETURNS VOID AS $$
BEGIN
  UPDATE payment_wallets
  SET used_today = 0.00,
      reserved_today = 0.00, -- Fail-safe flush of any left-over dead reservoirs
      updated_at = NOW();
      
  -- Create system audit log trace
  INSERT INTO system_audit_logs (
    event_type,
    message,
    severity
  ) VALUES (
    'DAILY_LIMIT_RESET',
    'Automated scheduled daily spend limit flush completed successfully across all nodes.',
    'info'
  );
END;
$$ LANGUAGE plpgsql;


----------------------------------------------------------------------------
-- 5) ADMINISTRATIVE SCHEDULED FUNCTION: reset_wallet_monthly_limits
-- Triggered automatically on the 1st day of each month.
-- Resets standard monthly limit bounds.
----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION reset_wallet_monthly_limits()
RETURNS VOID AS $$
BEGIN
  UPDATE payment_wallets
  SET used_month = 0.00,
      updated_at = NOW();
      
  -- Create system audit log trace
  INSERT INTO system_audit_logs (
    event_type,
    message,
    severity
  ) VALUES (
    'MONTHLY_LIMIT_RESET',
    'Automated scheduled monthly limit flush completed successfully across all merchant channels.',
    'info'
  );
END;
$$ LANGUAGE plpgsql;
