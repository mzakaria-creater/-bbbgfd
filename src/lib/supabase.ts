import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and Anon key from Vite environment variables
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Only initialize if BOTH key and URL are specified to avoid app crashes
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface DbWallet {
  id: string;
  provider: string;
  wallet_number: string;
  owner_name: string;
  label: string;
  country: string;
  currency: string;
  status: 'active' | 'paused' | 'disabled';
  daily_limit: number;
  monthly_limit: number;
  used_today: number;
  used_month: number;
  reserved_today: number;
  priority: number;
  last_used?: string;
}

export interface DbAllocationItem {
  wallet_id: string;
  wallet_number: string;
  provider: string;
  allocated_amount: number;
}

export interface DbAllocationRecord {
  id: string;
  amount: number;
  status: 'Reserved' | 'Confirmed' | 'Cancelled' | 'Expired' | 'Rejected';
  created_at: string;
  expires_at: string;
  items: DbAllocationItem[];
  fallback_used?: 'None' | 'Bank Transfer' | 'InstaPay' | 'Manual Support';
}

/**
 * Sync Local Wallets database to Supabase once as seed data if empty
 */
export async function seedSupabaseIfNeeded(localWallets: DbWallet[]) {
  if (!supabase) return;
  try {
    const { data: existing, error } = await supabase
      .from('payment_wallets')
      .select('id')
      .limit(1);

    if (error) {
      console.warn('Could not read table payment_wallets. May need migrations.', error.message);
      return { success: false, reason: 'migration_needed', error };
    }

    if (!existing || existing.length === 0) {
      // Seed table with provided wallets
      const { error: insertError } = await supabase
        .from('payment_wallets')
        .insert(localWallets.map(w => ({
          id: w.id.startsWith('w-') ? undefined : w.id, // don't push arbitrary strings if UUID is enforced, or generate new
          provider: w.provider,
          wallet_number: w.wallet_number,
          owner_name: w.owner_name,
          label: w.label,
          country: w.country,
          currency: w.currency,
          status: w.status,
          daily_limit: w.daily_limit,
          monthly_limit: w.monthly_limit,
          used_today: w.used_today,
          used_month: w.used_month,
          reserved_today: w.reserved_today,
          priority: w.priority
        })));
      if (insertError) {
        console.error('Err seeding Supabase wallets:', insertError);
      } else {
        console.log('Successfully seeded Supabase payment_wallets inventory table!');
      }
    }
    return { success: true };
  } catch (err: any) {
    console.error('Supabase connection or seeding failed:', err);
    return { success: false, reason: 'connection_failed', error: err };
  }
}

/**
 * Fetch all wallets from Supabase
 */
export async function fetchSupabaseWallets(): Promise<{ data: DbWallet[] | null; error: any }> {
  if (!supabase) return { data: null, error: 'Supabase client not initialized' };
  try {
    const { data, error } = await supabase
      .from('payment_wallets')
      .select('*')
      .order('priority', { ascending: false });

    if (error) return { data: null, error };
    return { data: data as DbWallet[], error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

/**
 * Add or update wallet in Supabase
 */
export async function saveSupabaseWallet(wallet: DbWallet): Promise<{ success: boolean; error: any }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    // Check if ID is UUID before upsert or let Postgres handle ID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(wallet.id);
    const dbPayload = {
      provider: wallet.provider,
      wallet_number: wallet.wallet_number,
      owner_name: wallet.owner_name,
      label: wallet.label,
      country: wallet.country,
      currency: wallet.currency,
      status: wallet.status,
      daily_limit: wallet.daily_limit,
      monthly_limit: wallet.monthly_limit,
      used_today: wallet.used_today,
      used_month: wallet.used_month,
      reserved_today: wallet.reserved_today,
      priority: wallet.priority,
    };

    let error;
    if (isUuid) {
      const { error: upsertErr } = await supabase
        .from('payment_wallets')
        .upsert({ id: wallet.id, ...dbPayload });
      error = upsertErr;
    } else {
      // Find by wallet number first
      const { data: found } = await supabase
        .from('payment_wallets')
        .select('id')
        .eq('wallet_number', wallet.wallet_number)
        .maybeSingle();

      if (found) {
        const { error: updateErr } = await supabase
          .from('payment_wallets')
          .update(dbPayload)
          .eq('id', found.id);
        error = updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('payment_wallets')
          .insert(dbPayload);
        error = insertErr;
      }
    }

    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Delete a wallet from Supabase
 */
export async function deleteSupabaseWallet(walletId: string): Promise<{ success: boolean; error: any }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const { error } = await supabase
      .from('payment_wallets')
      .delete()
      .eq('id', walletId);

    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Execute RPC function for allocating wallets
 */
export async function executeSupabaseAllocate(
  amount: number,
  provider: string,
  durationMinutes: number = 15
): Promise<{ success: boolean; allocationId: string | null; error: any }> {
  if (!supabase) return { success: false, allocationId: null, error: 'Supabase client not initialized' };
  try {
    const { data: allocationId, error } = await supabase.rpc('allocate_wallets', {
      p_amount: amount,
      p_provider: provider,
      p_duration_minutes: durationMinutes
    });

    if (error) return { success: false, allocationId: null, error };
    return { success: true, allocationId, error: null };
  } catch (err: any) {
    return { success: false, allocationId: null, error: err };
  }
}

/**
 * Confirm allocation in Supabase
 */
export async function executeSupabaseConfirm(allocationId: string): Promise<{ success: boolean; error: any }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const { data, error } = await supabase.rpc('confirm_wallet_allocation', {
      p_allocation_id: allocationId
    });

    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Release/Cancel allocation in Supabase
 */
export async function executeSupabaseRelease(allocationId: string): Promise<{ success: boolean; error: any }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const { data, error } = await supabase.rpc('release_wallet_allocation', {
      p_allocation_id: allocationId
    });

    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Reset daily limit parameters via RPC admin trigger
 */
export async function executeSupabaseResetDailyLimits(): Promise<{ success: boolean; error: any }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const { error } = await supabase.rpc('reset_wallet_daily_limits');
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}

/**
 * Reset monthly limit parameters via RPC admin trigger
 */
export async function executeSupabaseResetMonthlyLimits(): Promise<{ success: boolean; error: any }> {
  if (!supabase) return { success: false, error: 'Supabase client not initialized' };
  try {
    const { error } = await supabase.rpc('reset_wallet_monthly_limits');
    if (error) return { success: false, error };
    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err };
  }
}
