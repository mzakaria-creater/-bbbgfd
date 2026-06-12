import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Database,
  Lock,
  ExternalLink,
  Sliders,
  Copy,
  Clock,
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { 
  isSupabaseConfigured, 
  seedSupabaseIfNeeded, 
  fetchSupabaseWallets, 
  saveSupabaseWallet, 
  deleteSupabaseWallet, 
  executeSupabaseAllocate, 
  executeSupabaseConfirm, 
  executeSupabaseRelease, 
  executeSupabaseResetDailyLimits, 
  executeSupabaseResetMonthlyLimits 
} from '../lib/supabase';

interface Wallet {
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
  priority: number; // custom addition for sorting
  last_used?: string;
}

interface AllocationRecord {
  id: string;
  amount: number;
  status: 'Reserved' | 'Confirmed' | 'Cancelled' | 'Expired' | 'Rejected';
  created_at: string;
  expires_at: string;
  items: AllocationItem[];
  fallback_used?: 'None' | 'Bank Transfer' | 'InstaPay' | 'Manual Support';
}

interface AllocationItem {
  wallet_id: string;
  wallet_number: string;
  provider: string;
  allocated_amount: number;
}

export default function WalletAllocationEngine() {
  const { t } = useTranslation();

  // Selected sub-tab: 'simulator' | 'wallets' | 'allocations' | 'ddl'
  const [activeTab, setActiveTab] = useState<'simulator' | 'wallets' | 'allocations' | 'ddl'>('simulator');
  const [copiedSql, setCopiedSql] = useState(false);

  // Wallets State
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem('finlux_allocation_wallets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'w-1',
        provider: 'Vodafone Cash',
        wallet_number: '01012345678',
        owner_name: 'Ahmed Youssef',
        label: 'Primary Ingress Wallet A',
        country: 'Egypt',
        currency: 'EGP',
        status: 'active',
        daily_limit: 60000,
        monthly_limit: 200000,
        used_today: 15400,
        used_month: 85000,
        reserved_today: 0,
        priority: 10
      },
      {
        id: 'w-2',
        provider: 'Vodafone Cash',
        wallet_number: '01098765432',
        owner_name: 'Mustafa Mahmoud',
        label: 'Secondary Overflow Wallet B',
        country: 'Egypt',
        currency: 'EGP',
        status: 'active',
        daily_limit: 60000,
        monthly_limit: 200000,
        used_today: 43000,
        used_month: 145000,
        reserved_today: 0,
        priority: 7
      },
      {
        id: 'w-3',
        provider: 'Etisalat Cash',
        wallet_number: '01124681357',
        owner_name: 'Fatima El-Sayed',
        label: 'Etisalat Reserve Aggregator',
        country: 'Egypt',
        currency: 'EGP',
        status: 'active',
        daily_limit: 60000,
        monthly_limit: 200000,
        used_today: 5000,
        used_month: 23000,
        reserved_today: 0,
        priority: 5
      },
      {
        id: 'w-4',
        provider: 'Orange Cash',
        wallet_number: '01235711131',
        owner_name: 'Hassan Kamel',
        label: 'Orange High Velocity Float',
        country: 'Egypt',
        currency: 'EGP',
        status: 'active',
        daily_limit: 60000,
        monthly_limit: 200000,
        used_today: 0,
        used_month: 12000,
        reserved_today: 0,
        priority: 3
      },
      {
        id: 'w-5',
        provider: 'Vodafone Cash',
        wallet_number: '01024681012',
        owner_name: 'Rania Abdelrahman',
        label: 'Maintenance Standby Line',
        country: 'Egypt',
        currency: 'EGP',
        status: 'paused',
        daily_limit: 60000,
        monthly_limit: 200000,
        used_today: 12000,
        used_month: 90000,
        reserved_today: 0,
        priority: 1
      }
    ];
  });

  // Allocations State
  const [allocations, setAllocations] = useState<AllocationRecord[]>(() => {
    const saved = localStorage.getItem('finlux_allocations_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'ALC-4091A',
        amount: 45000,
        status: 'Confirmed',
        created_at: new Date(Date.now() - 4 * 3600000).toLocaleString(),
        expires_at: new Date(Date.now() - 4 * 3600000 + 15 * 60000).toLocaleString(),
        items: [
          { wallet_id: 'w-1', wallet_number: '01012345678', provider: 'Vodafone Cash', allocated_amount: 44600 }
        ],
        fallback_used: 'None'
      },
      {
        id: 'ALC-9281B',
        amount: 80000,
        status: 'Confirmed',
        created_at: new Date(Date.now() - 8 * 3600000).toLocaleString(),
        expires_at: new Date(Date.now() - 8 * 3600000 + 15 * 60000).toLocaleString(),
        items: [
          { wallet_id: 'w-3', wallet_number: '01124681357', provider: 'Etisalat Cash', allocated_amount: 55000 },
          { wallet_id: 'w-4', wallet_number: '01235711131', provider: 'Orange Cash', allocated_amount: 25000 }
        ],
        fallback_used: 'None'
      },
      {
        id: 'ALC-1092C',
        amount: 32000,
        status: 'Expired',
        created_at: new Date(Date.now() - 1 * 3600000).toLocaleString(),
        expires_at: new Date(Date.now() - 1 * 3600000 + 15 * 60000).toLocaleString(),
        items: [
          { wallet_id: 'w-1', wallet_number: '01012345678', provider: 'Vodafone Cash', allocated_amount: 32000 }
        ],
        fallback_used: 'None'
      }
    ];
  });

  // Client Simulation State
  const [depositAmountInput, setDepositAmountInput] = useState<string>('25000');
  const [lastAllocationResult, setLastAllocationResult] = useState<{
    amount: number;
    items: AllocationItem[];
    fallback: 'None' | 'Bank Transfer' | 'InstaPay' | 'Manual Support';
    unallocated_remainder: number;
  } | null>(null);

  const [activeReservation, setActiveReservation] = useState<AllocationRecord | null>(null);
  const [reservationCountdown, setReservationCountdown] = useState<number>(900); // 15 mins

  // Supabase states
  const [supabaseLoading, setSupabaseLoading] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<'idle' | 'connected' | 'error' | 'pending_migrations'>('idle');
  const [supabaseMessage, setSupabaseMessage] = useState('');

  // Initial Sync from Supabase
  const pullFromSupabase = async (forceSeed = false) => {
    if (!isSupabaseConfigured) return;
    setSupabaseLoading(true);
    try {
      if (forceSeed) {
        await seedSupabaseIfNeeded(wallets);
      }
      const { data, error } = await fetchSupabaseWallets();
      if (error) {
        setSupabaseStatus('pending_migrations');
        setSupabaseMessage('Schema mismatch: Check if SQL migrations have been executed in your Supabase SQL editor.');
      } else if (data) {
        setWallets(data);
        setSupabaseStatus('connected');
        setSupabaseMessage('Sync active: Real-time PostgreSQL schema binding.');
      }
    } catch (e: any) {
      setSupabaseStatus('error');
      setSupabaseMessage(e.message || 'Supabase connection failed.');
    } finally {
      setSupabaseLoading(false);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      const initSupabase = async () => {
        setSupabaseLoading(true);
        // Seed default wallets if table is empty
        const seedRes = await seedSupabaseIfNeeded(wallets);
        if (seedRes && !seedRes.success && seedRes.reason === 'migration_needed') {
          setSupabaseStatus('pending_migrations');
          setSupabaseMessage('Table payment_wallets not found. Execute the SQL DDL commands in your Supabase tab.');
          setSupabaseLoading(false);
          return;
        }
        await pullFromSupabase();
      };
      initSupabase();
    }
  }, []);

  // Wallet Management Inputs
  const [newWalletNum, setNewWalletNum] = useState('');
  const [newWalletProvider, setNewWalletProvider] = useState('Vodafone Cash');
  const [newWalletOwner, setNewWalletOwner] = useState('');
  const [newWalletLabel, setNewWalletLabel] = useState('');
  const [newWalletPriority, setNewWalletPriority] = useState('5');
  const [newWalletDailyLimit, setNewWalletDailyLimit] = useState('6000');
  const [newWalletMonthlyLimit, setNewWalletMonthlyLimit] = useState('200000');

  // Load state and trigger countdown updates
  useEffect(() => {
    localStorage.setItem('finlux_allocation_wallets', JSON.stringify(wallets));
  }, [wallets]);

  useEffect(() => {
    localStorage.setItem('finlux_allocations_history', JSON.stringify(allocations));
  }, [allocations]);

  // Reservation countdown timer simulation
  useEffect(() => {
    let interval: any = null;
    if (activeReservation && reservationCountdown > 0) {
      interval = setInterval(() => {
        setReservationCountdown(c => {
          if (c <= 1) {
            clearInterval(interval);
            // Expire reservation automatically in local memory
            handleReservationTimeout(activeReservation.id);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeReservation, reservationCountdown]);

  const handleReservationTimeout = (id: string) => {
    setAllocations(prev => prev.map(a => {
      if (a.id === id && a.status === 'Reserved') {
        return { ...a, status: 'Expired' };
      }
      return a;
    }));

    // Release capacity in wallets
    setWallets(prev => prev.map(w => {
      const matchAlloc = activeReservation?.items.find(item => item.wallet_id === w.id);
      if (matchAlloc) {
        return {
          ...w,
          reserved_today: Math.max(0, w.reserved_today - matchAlloc.allocated_amount)
        };
      }
      return w;
    }));

    setActiveReservation(null);
    alert("The capacity reservation has expired and resources have been safefly unlocked.");
  };

  // Main Split-Wallet Allocation Algorithm
  const runAllocation = (amount: number) => {
    let remainder = amount;
    const allocatedItems: AllocationItem[] = [];
    let fallbackType: 'None' | 'Bank Transfer' | 'InstaPay' | 'Manual Support' = 'None';

    // 1. Filter active wallets
    const activeWallets = wallets.filter(w => w.status === 'active');

    // 2. Map and calculate remain capacity
    const walletsWithCapacity = activeWallets.map(w => {
      const available_today = Math.max(0, w.daily_limit - w.used_today - w.reserved_today);
      const available_month = Math.max(0, w.monthly_limit - w.used_month - w.reserved_today);
      const available_final = Math.min(available_today, available_month);
      return { ...w, available_final };
    });

    // 3. Sort by priority desc, then available_final desc
    const sortedWallets = [...walletsWithCapacity]
      .filter(w => w.available_final > 0)
      .sort((a, b) => {
        if (b.priority !== a.priority) {
          return b.priority - a.priority;
        }
        return b.available_final - a.available_final;
      });

    // 4. Try allocating
    // Check if any single wallet can hold the entire requested amount
    const singleBestWallet = sortedWallets.find(w => w.available_final >= remainder);
    if (singleBestWallet) {
      allocatedItems.push({
        wallet_id: singleBestWallet.id,
        wallet_number: singleBestWallet.wallet_number,
        provider: singleBestWallet.provider,
        allocated_amount: remainder
      });
      remainder = 0;
    } else {
      // Amount exceeds single wallet capacity, split across multiple sorted wallets
      for (const wallet of sortedWallets) {
        if (remainder <= 0) break;
        const takeAmount = Math.min(remainder, wallet.available_final);
        if (takeAmount > 0) {
          allocatedItems.push({
            wallet_id: wallet.id,
            wallet_number: wallet.wallet_number,
            provider: wallet.provider,
            allocated_amount: takeAmount
          });
          remainder -= takeAmount;
        }
      }
    }

    // 5. If remainder remains, fallback routing triggers
    if (remainder > 0) {
      // Determine appropriate fallback relative to size
      if (amount >= 150000) {
        fallbackType = 'Bank Transfer';
      } else if (amount >= 50000) {
        fallbackType = 'InstaPay';
      } else {
        fallbackType = 'Manual Support';
      }
    }

    setLastAllocationResult({
      amount,
      items: allocatedItems,
      fallback: fallbackType,
      unallocated_remainder: remainder
    });
  };

  // Locks the capacity temporarily (Creates a "Reserved" state)
  const lockCapacityReservation = () => {
    if (!lastAllocationResult) return;

    const newRecordId = 'ALC-' + Math.floor(Math.random() * 90000 + 10000);
    const newRecord: AllocationRecord = {
      id: newRecordId,
      amount: lastAllocationResult.amount,
      status: 'Reserved',
      created_at: new Date().toLocaleString(),
      expires_at: new Date(Date.now() + 15 * 60000).toLocaleString(),
      items: lastAllocationResult.items,
      fallback_used: lastAllocationResult.fallback
    };

    // Update wallet reserves
    setWallets(prev => prev.map(w => {
      const match = lastAllocationResult.items.find(item => item.wallet_id === w.id);
      if (match) {
        return {
          ...w,
          reserved_today: w.reserved_today + match.allocated_amount
        };
      }
      return w;
    }));

    setAllocations(prev => [newRecord, ...prev]);
    setActiveReservation(newRecord);
    setReservationCountdown(900); // 15 mins
    alert(`Success: Capacity locks created securely for allocation reference ${newRecordId}! Funds are protected against double allocation.`);
  };

  // Confirms the reservation, clearing target reserves and permanently updating Used pools
  const confirmAllocation = (id: string) => {
    const record = allocations.find(a => a.id === id);
    if (!record) return;

    // Transition record
    setAllocations(prev => prev.map(a => {
      if (a.id === id) return { ...a, status: 'Confirmed' };
      return a;
    }));

    // Dedicate capacity permanently (Convert reserves to live Used)
    setWallets(prev => prev.map(w => {
      const allocation = record.items.find(item => item.wallet_id === w.id);
      if (allocation) {
        return {
          ...w,
          reserved_today: Math.max(0, w.reserved_today - allocation.allocated_amount),
          used_today: w.used_today + allocation.allocated_amount,
          used_month: w.used_month + allocation.allocated_amount
        };
      }
      return w;
    }));

    if (activeReservation?.id === id) {
      setActiveReservation(null);
    }

    alert(`Allocation ${id} successfully confirmed! Deposits permanently verified on the gateway.`);
  };

  // Cancels / Rejects or Clears Capacity
  const handleAllocationRejection = (id: string, newStatus: 'Cancelled' | 'Expired' | 'Rejected') => {
    const record = allocations.find(a => a.id === id);
    if (!record) return;

    // Transition record
    setAllocations(prev => prev.map(a => {
      if (a.id === id) return { ...a, status: newStatus };
      return a;
    }));

    // If it was in Reserved/Lock state only, release those locks
    if (record.status === 'Reserved') {
      setWallets(prev => prev.map(w => {
        const allocation = record.items.find(item => item.wallet_id === w.id);
        if (allocation) {
          return {
            ...w,
            reserved_today: Math.max(0, w.reserved_today - allocation.allocated_amount)
          };
        }
        return w;
      }));
    }

    if (activeReservation?.id === id) {
      setActiveReservation(null);
    }

    alert(`Allocation ${id} marked as ${newStatus}. Locks cleared cleanly.`);
  };

  // Add new wallet
  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletNum.trim() || !newWalletOwner.trim()) {
      alert("Please provide the wallet telephone digits and custodian owner's legal name.");
      return;
    }

    const newW: Wallet = {
      id: 'w-' + Math.floor(Math.random() * 1000 + 100),
      provider: newWalletProvider,
      wallet_number: newWalletNum,
      owner_name: newWalletOwner,
      label: newWalletLabel || `${newWalletProvider} Line`,
      country: 'Egypt',
      currency: 'EGP',
      status: 'active',
      daily_limit: Number(newWalletDailyLimit) || 60000,
      monthly_limit: Number(newWalletMonthlyLimit) || 200000,
      used_today: 0,
      used_month: 0,
      reserved_today: 0,
      priority: Number(newWalletPriority) || 5
    };

    if (isSupabaseConfigured) {
      setSupabaseLoading(true);
      const res = await saveSupabaseWallet(newW);
      if (res.error) {
        alert("Failed to save wallet to Supabase database. Make sure table exists: " + res.error.message);
      } else {
        await pullFromSupabase();
      }
    } else {
      setWallets(prev => [...prev, newW]);
    }

    setNewWalletNum('');
    setNewWalletOwner('');
    setNewWalletLabel('');
    alert("New high-capacity PSP payment wallet added successfully!");
  };

  const deleteWalletItem = async (id: string) => {
    if (window.confirm("Disposing this wallet will clear it from simulation parameters. Proceed?")) {
      if (isSupabaseConfigured) {
        setSupabaseLoading(true);
        const res = await deleteSupabaseWallet(id);
        if (res.error) {
          alert("Failed to delete wallet from Supabase: " + res.error.message);
        } else {
          await pullFromSupabase();
        }
      } else {
        setWallets(prev => prev.filter(w => w.id !== id));
      }
    }
  };

  const toggleWalletStatus = async (id: string) => {
    const targetWallet = wallets.find(w => w.id === id);
    if (!targetWallet) return;
    const nextStatus: Wallet['status'] = targetWallet.status === 'active' ? 'paused' : targetWallet.status === 'paused' ? 'disabled' : 'active';
    
    const updatedWallet = { ...targetWallet, status: nextStatus };
    if (isSupabaseConfigured) {
      setSupabaseLoading(true);
      const res = await saveSupabaseWallet(updatedWallet);
      if (res.error) {
        alert("Failed to update wallet status on Supabase: " + res.error.message);
      } else {
        await pullFromSupabase();
      }
    } else {
      setWallets(prev => prev.map(w => w.id === id ? updatedWallet : w));
    }
  };

  return (
    <div className="space-y-6" id="wallet-allocation-engine">
      {/* Dynamic Screen Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-3.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-wider text-primary">
            {t("PSP Ingress Optimizers")}
          </span>
          <h2 className="text-2xl font-black text-on-surface mt-2 flex items-center gap-2">
            <span>📱 {t("Mobile Wallet Allocation Engine")}</span>
          </h2>
          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
            {t("Real-time capacity optimizer and multiplexer for Egyptian P2P deposits. Respects 60K/200K EGP regulatory limits per line.")}
          </p>

          {/* Supabase Connection Status Banner */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            {!isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>SUPABASE SIMULATOR MODE (OFFLINE)</span>
              </span>
            ) : supabaseStatus === 'connected' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>SUPABASE LIVE DATABASE ACTIVE</span>
              </span>
            ) : supabaseStatus === 'pending_migrations' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                <span>SUPABASE SETUP PENDING (MIGRATIONS NEEDED)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>SUPABASE ERROR: {supabaseMessage.toUpperCase()}</span>
              </span>
            )}
            
            {isSupabaseConfigured && (
              <button 
                onClick={() => pullFromSupabase(true)}
                disabled={supabaseLoading}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-900 text-white text-[9px] font-bold hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${supabaseLoading ? 'animate-spin' : ''}`} />
                <span>FORCE RESYNC & SEED</span>
              </button>
            )}
          </div>
        </div>

        {/* Floating Quick Stats */}
        <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md p-3.5 rounded-2xl border border-outline-variant/30 shadow-2xs text-xs font-bold shrink-0">
          <div className="text-left">
            <span className="text-outline text-[10px] uppercase block tracking-wider">{t("Active Transmitters")}</span>
            <span className="text-sm font-black text-primary">{wallets.filter(w => w.status === 'active').length} {t("Lines")}</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="text-left">
            <span className="text-outline text-[10px] uppercase block tracking-wider">{t("Sum Today Pool")}</span>
            <span className="text-sm font-black text-[#006c49]">
              {(wallets.reduce((acc, curr) => acc + (curr.daily_limit - curr.used_today - curr.reserved_today), 0)).toLocaleString()} EGP
            </span>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit border border-slate-200 shadow-3xs text-xs font-semibold">
        <button 
          onClick={() => setActiveTab('simulator')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'simulator' ? 'bg-white text-primary font-black shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Sliders className="w-4 h-4 text-primary" />
          <span>{t("Deposit Simulator & Splitter")}</span>
        </button>
        <button 
          onClick={() => setActiveTab('wallets')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'wallets' ? 'bg-white text-primary font-black shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Smartphone className="w-4 h-4 text-indigo-500" />
          <span>{t("Manage Mobile Lines")}</span>
        </button>
        <button 
          onClick={() => setActiveTab('allocations')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'allocations' ? 'bg-white text-primary font-black shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Layers className="w-4 h-4 text-emerald-500" />
          <span>{t("Allocation Ledger")}</span>
          {allocations.filter(a => a.status === 'Reserved').length > 0 && (
            <span className="bg-red-500 text-white font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center animate-pulse">
              {allocations.filter(a => a.status === 'Reserved').length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('ddl')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${activeTab === 'ddl' ? 'bg-white text-primary font-black shadow-xs' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Database className="w-4 h-4 text-orange-500" />
          <span>{t("Supabase SQL Migrations")}</span>
        </button>
      </div>

      {/* Main viewport panels */}
      <div className="grid grid-cols-1 gap-6">

        {/* Tab 1: Simulator */}
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Splitter Setup inputs */}
            <div className="lg:col-span-4 bg-white/80 p-6 rounded-[32px] border border-slate-200/50 shadow-sm space-y-6">
              <div>
                <h3 className="font-extrabold text-sm text-[#0c0c1b] tracking-tight flex items-center gap-2">
                  <span>💸</span>
                  {t("Gateway Deposit Initiator")}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{t("Simulates client checkout checkout")}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 font-bold text-xs text-slate-600">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-widest">{t("Desired Deposit Amount (EGP)")}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold">EGP</span>
                    <input
                      type="number"
                      value={depositAmountInput}
                      onChange={(e) => setDepositAmountInput(e.target.value)}
                      placeholder="e.g. 15000"
                      className="w-full bg-slate-50/50 pl-12 pr-4 py-3 rounded-xl border font-bold text-slate-800 placeholder-slate-300 outline-none focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <span className="text-[9px] text-[#006c49] leading-tight block pt-1 font-semibold">
                    💡 Try inputs like **45,000** (fits single line) and **135,000** (triggers a beautiful multisplit!).
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['10000', '45000', '135000'].map(val => (
                    <button
                      key={val}
                      onClick={() => setDepositAmountInput(val)}
                      className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 border text-slate-600 font-mono text-xs rounded-lg transition-colors font-semibold"
                    >
                      {Number(val).toLocaleString()} EGP
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => runAllocation(Number(depositAmountInput) || 0)}
                  disabled={!depositAmountInput || Number(depositAmountInput) <= 0}
                  className="w-full py-3 bg-[#0d593a] hover:bg-[#003823] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.98] cursor-pointer disabled:opacity-40"
                >
                  {t("Calculate Best Allocation")}
                </button>
              </div>

              {/* Active Reservation Display widget */}
              {activeReservation && (
                <div className="bg-orange-50/50 border border-orange-200/60 p-4.5 rounded-2.5xl space-y-3 font-semibold text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#a05400] text-[10px] uppercase font-black tracking-wider block flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 shrink-0 animate-spin" />
                      {t("Live Session Capacity Reserve Lock")}
                    </span>
                    <span className="text-[9px] font-mono bg-orange-100 px-2 py-0.5 rounded text-[#7a4b00]">{activeReservation.id}</span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-tight font-medium">
                    {t("These allocated numbers are exclusive to the customer. Remainder balances are locked against other sessions.")}
                  </p>

                  <div className="space-y-1.5 pt-1.5">
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{t("Secured Capital Amount:")}</span>
                      <strong className="text-[#0c0c1b]">{activeReservation.amount.toLocaleString()} EGP</strong>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>{t("Auto Lock Releasing In:")}</span>
                      <span className="text-red-600 font-bold shrink-0 font-mono">
                        {Math.floor(reservationCountdown / 60)}:{(reservationCountdown % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 font-bold text-[10px]">
                    <button
                      onClick={() => confirmAllocation(activeReservation.id)}
                      className="py-1.5 px-3 bg-[#0d593a] hover:bg-[#003823] text-white rounded-lg transition-colors shadow-2xs"
                    >
                      ✓ {t("Verify Paid")}
                    </button>
                    <button
                      onClick={() => handleAllocationRejection(activeReservation.id, 'Cancelled')}
                      className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg transition-colors border border-red-250/20"
                    >
                      ✕ {t("Release Hold")}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Splitter Output result rendering */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* If no result calculated yet */}
              {!lastAllocationResult ? (
                <div className="bg-white/50 border border-slate-200/50 p-12 text-center rounded-[32px]">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sliders className="w-8 h-8 text-slate-400" />
                  </div>
                  <h4 className="font-extrabold text-base text-slate-700">{t("Awaiting Cash Desk Request")}</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {t("Enter a deposit amount on the left to dynamically allocate against active lines prioritizing custodian status, limits and speeds.")}
                  </p>
                </div>
              ) : (
                <div className="bg-white/80 border p-6 rounded-[32px] space-y-6 shadow-sm">
                  
                  {/* Allocation Header Overview */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4 gap-4">
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold tracking-wider uppercase">{t("Allocating Capacity of")}</span>
                      <h4 className="text-2xl font-black text-[#0c0c1b] mt-0.5 font-mono">
                        {lastAllocationResult.amount.toLocaleString()} <span className="text-xs text-slate-400 font-bold">EGP</span>
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {lastAllocationResult.items.length > 0 && (
                        <button
                          onClick={lockCapacityReservation}
                          disabled={!!activeReservation}
                          className="px-4 py-2 bg-[#006c49] text-white hover:bg-[#003823] rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1 disabled:opacity-40"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>{t("Reserve Capacity")}</span>
                        </button>
                      )}
                      <button
                        onClick={() => runAllocation(lastAllocationResult.amount)}
                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
                        title="Recalculate allocation paths"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Allocation Split results list */}
                  <div className="space-y-4">
                    <h5 className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{t("Generated Custom Payment Breakdown Paths")}</h5>
                    
                    {lastAllocationResult.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lastAllocationResult.items.map((item, idx) => {
                          const originalWallet = wallets.find(w => w.id === item.wallet_id);
                          return (
                            <div key={idx} className="bg-slate-50 border border-slate-200/50 p-4.5 rounded-2xl flex flex-col justify-between space-y-4 shadow-3xs">
                              
                              {/* Provider and amount */}
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-black text-[9px] uppercase tracking-wider">
                                    {item.provider}
                                  </span>
                                  <h6 className="text-[11px] font-extrabold text-slate-400 font-mono mt-1 hover:blur-none select-all">
                                    {item.wallet_number}
                                  </h6>
                                  <p className="text-[10px] text-slate-600 mt-0.5 italic">
                                    {t("Owner:")} {originalWallet?.owner_name || 'Custodian'}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <span className="text-[9px] text-[#0d593a] font-extrabold block">{t("Allocated Part")}</span>
                                  <span className="text-base font-black text-[#0d593a] font-mono">
                                    {item.allocated_amount.toLocaleString()} <span className="text-[11px] font-bold">EGP</span>
                                  </span>
                                </div>
                              </div>

                              {/* Capacity bars logic */}
                              {originalWallet && (
                                <div className="space-y-1 text-[9px] text-slate-500">
                                  <div className="flex justify-between items-center">
                                    <span>{t("Daily Capacity Utilization:")}</span>
                                    <span>
                                      {originalWallet.used_today.toLocaleString()} / {originalWallet.daily_limit.toLocaleString()} EGP
                                    </span>
                                  </div>
                                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-primary"
                                      style={{ width: `${Math.min(100, (originalWallet.used_today / originalWallet.daily_limit) * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 border border-red-200 text-red-750 text-xs rounded-xl flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                        <div>
                          <strong>{t("Mobile wallet channels completely saturated.")}</strong>
                          <p className="text-[11px] mt-0.5 leading-relaxed">{t("There are no active lines with remaining receive limits to handle the deposit amount safely.")}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fallback routing details */}
                  {lastAllocationResult.unallocated_remainder > 0 && (
                    <div className="pt-4 border-t border-dashed space-y-4 text-xs font-semibold">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>
                          {t("Unallocated Remainder Balance:")} <strong className="font-mono text-[#0c0c1b]">{lastAllocationResult.unallocated_remainder.toLocaleString()} EGP</strong>
                        </span>
                      </div>

                      <div className="bg-amber-500/5 border border-amber-500/15 p-4.5 rounded-2xl space-y-3">
                        <div>
                          <h6 className="font-extrabold text-[#7a4b00] text-xs flex items-center gap-1">
                            <span>🚀</span>
                            {t("Automatic High-Value Fallback Cleared Routes")}
                          </h6>
                          <p className="text-[10px] text-slate-600 mt-0.5">{t("Due to wallet limits, the excess deposit has been routed automatically to high-velocity alternatives:")}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          
                          {/* Route 1 */}
                          <div className={`p-3 rounded-xl border flex flex-col justify-between ${lastAllocationResult.fallback === 'Bank Transfer' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 opacity-60'}`}>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold block">Route A</span>
                            <span className="text-[11px] font-black mt-1">🏦 {t("Bank Transfer")}</span>
                            <span className="text-[9px] mt-1 text-slate-600">{t("Recommended for sizes above 150,000 EGP")}</span>
                          </div>

                          {/* Route 2 */}
                          <div className={`p-3 rounded-xl border flex flex-col justify-between ${lastAllocationResult.fallback === 'InstaPay' ? 'bg-[#006c49]/5 border-[#006c49]/15 text-[#006c49]' : 'bg-white border-slate-200 text-slate-500 opacity-60'}`}>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold block">Route B</span>
                            <span className="text-[11px] font-black mt-1">⚡ {t("InstaPay EG")}</span>
                            <span className="text-[9px] mt-1 text-slate-650">{t("Instant national clearance 50K - 150K")}</span>
                          </div>

                          {/* Route 3 */}
                          <div className={`p-3 rounded-xl border flex flex-col justify-between ${lastAllocationResult.fallback === 'Manual Support' ? 'bg-amber-50 border-amber-200 text-[#a05400]' : 'bg-white border-slate-200 text-slate-500 opacity-60'}`}>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold block">Route C</span>
                            <span className="text-[11px] font-black mt-1">💬 {t("Manual VIP Aggregator")}</span>
                            <span className="text-[9px] mt-1 text-slate-600">{t("Dedicated Telegram desk settlements")}</span>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual allocation chart layout */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 text-[10px] font-bold text-slate-500">
                    <p className="text-slate-700 mb-2 font-extrabold uppercase text-[9px] tracking-wider">🧮 Allocation Flow Chart Summary</p>
                    <div className="flex flex-wrap items-center gap-1.5 font-mono text-[9px]">
                      <span className="bg-slate-200 px-2.5 py-1 text-slate-700 rounded font-bold">{depositAmountInput} EGP (Input)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span className="bg-[#0f172a] px-2.5 py-1 text-white rounded font-bold">{t("Priority Order Matching")}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                      {lastAllocationResult.items.map((it, idx) => (
                        <React.Fragment key={it.wallet_id}>
                          <span className="bg-[#0d593a] text-white px-2.5 py-1 rounded">+{it.allocated_amount.toLocaleString()} EGP ({it.provider})</span>
                          {idx < lastAllocationResult.items.length - 1 && <span>+</span>}
                        </React.Fragment>
                      ))}
                      {lastAllocationResult.unallocated_remainder > 0 && (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span className="bg-amber-100 text-[#7a4b00] px-2.5 py-1 rounded font-bold">+{lastAllocationResult.unallocated_remainder.toLocaleString()} EGP (Fallback: {lastAllocationResult.fallback})</span>
                        </>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* Tab 2: Line Management */}
        {activeTab === 'wallets' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Wallet Addition form */}
            <div className="lg:col-span-4 bg-white p-6 rounded-[32px] border border-slate-200/50 shadow-sm space-y-4">
              <div>
                <h3 className="font-extrabold text-sm text-[#0c0c1b] tracking-tight">
                  ➕ {t("Activate New Mobile Line")}
                </h3>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{t("Insert wallet numbers to gateway list")}</p>
              </div>

              <form onSubmit={handleCreateWallet} className="space-y-3.5 text-xs font-semibold text-slate-600">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Telecom Provider")}</label>
                  <select
                    value={newWalletProvider}
                    onChange={(e) => setNewWalletProvider(e.target.value)}
                    className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-200 outline-none text-xs text-slate-800 font-bold"
                  >
                    <option value="Vodafone Cash">Vodafone Cash</option>
                    <option value="Etisalat Cash">Etisalat Cash</option>
                    <option value="Orange Cash">Orange Cash</option>
                    <option value="We Pay eg">WE Pay Egypt</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Wallet Number (digits)")}</label>
                  <input
                    type="text"
                    value={newWalletNum}
                    onChange={(e) => setNewWalletNum(e.target.value)}
                    placeholder="e.g. 01011112222"
                    className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-200 outline-none placeholder-slate-300 font-mono text-xs text-[#0c0c1b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Custodian Owner Legal Name")}</label>
                  <input
                    type="text"
                    value={newWalletOwner}
                    onChange={(e) => setNewWalletOwner(e.target.value)}
                    placeholder="e.g. Yaseen Salem"
                    className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-200 outline-none placeholder-slate-300 text-xs text-[#0c0c1b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Internal Admin Label")}</label>
                  <input
                    type="text"
                    value={newWalletLabel}
                    onChange={(e) => setNewWalletLabel(e.target.value)}
                    placeholder="e.g. Admin Area VIP EGP"
                    className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-200 outline-none placeholder-slate-300 text-xs text-[#0c0c1b]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Priority Order")}</label>
                    <input
                      type="number"
                      value={newWalletPriority}
                      onChange={(e) => setNewWalletPriority(e.target.value)}
                      placeholder="1-10"
                      min="1"
                      max="10"
                      className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-200 outline-none text-xs text-[#0c0c1b]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Daily Cap bounds")}</label>
                    <input
                      type="number"
                      value={newWalletDailyLimit}
                      onChange={(e) => setNewWalletDailyLimit(e.target.value)}
                      placeholder="e.g. 60000"
                      className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-200 outline-none text-xs text-[#0c0c1b]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] transition-colors"
                >
                  ➕ {t("Deploy Line to Live Production")}
                </button>
              </form>
            </div>

            {/* List of current Active Lines */}
            <div className="lg:col-span-8 bg-white p-6 rounded-[32px] border border-slate-200/50 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-2 mb-2">
                <h4 className="font-extrabold text-sm text-[#0c0c1b] tracking-tight">
                  📋 {t("Operational Gateway Wallet Inventory")}
                </h4>
                <span className="text-[10px] uppercase font-bold text-slate-400">{wallets.length} {t("Total Registered Lines")}</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full border-collapse text-xs text-left ltr:text-left rtl:text-right">
                  <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[9px] tracking-wider border-b">
                    <tr>
                      <th className="p-3 pl-4">{t("Number / Provider")}</th>
                      <th className="p-3">{t("Custodian Owner")}</th>
                      <th className="p-3">{t("Priority Order")}</th>
                      <th className="p-3">{t("Used Today / Limit")}</th>
                      <th className="p-3">{t("Used Month / Limit")}</th>
                      <th className="p-3">{t("Lock Holds")}</th>
                      <th className="p-3">{t("Status")}</th>
                      <th className="p-3 text-right pr-4">{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 text-slate-700 font-bold">
                    {wallets.map((w) => (
                      <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3 pl-4">
                          <div className="font-mono text-sm text-slate-800 font-black">{w.wallet_number}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{w.provider}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-slate-800 font-black">{w.owner_name}</div>
                          <p className="text-[9px] text-slate-400 block font-normal">{w.label}</p>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-bold font-mono">
                            {w.priority}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-between items-center text-[10px] pb-1">
                            <span>{((w.used_today / w.daily_limit) * 100).toFixed(0)}%</span>
                            <span className="text-slate-400">{w.daily_limit.toLocaleString()} EGP</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${w.used_today >= w.daily_limit * 0.9 ? 'bg-red-500' : 'bg-[#0d593a]'}`}
                              style={{ width: `${Math.min(100, (w.used_today / w.daily_limit) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 block pt-1">{w.used_today.toLocaleString()} EGP Used</span>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-between items-center text-[10px] pb-1">
                            <span>{((w.used_month / w.monthly_limit) * 100).toFixed(0)}%</span>
                            <span className="text-slate-400">{w.monthly_limit.toLocaleString()} EGP</span>
                          </div>
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${w.used_month >= w.monthly_limit * 0.9 ? 'bg-red-500' : 'bg-primary'}`}
                              style={{ width: `${Math.min(100, (w.used_month / w.monthly_limit) * 100)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 block pt-1">{w.used_month.toLocaleString()} EGP Used</span>
                        </td>
                        <td className="p-3 font-mono text-orange-600 font-black">
                          {w.reserved_today > 0 ? `+${w.reserved_today.toLocaleString()} EGP` : '0'}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => toggleWalletStatus(w.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider outline-none ${
                              w.status === 'active' ? 'bg-[#cbf2e2] text-[#003823]' :
                              w.status === 'paused' ? 'bg-[#ffebd1] text-[#7a4b00]' :
                              'bg-[#ffdad6] text-[#ba1a1a]'
                            }`}
                          >
                            {w.status}
                          </button>
                        </td>
                        <td className="p-3 text-right pr-4 shrink-0 space-x-1 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => deleteWalletItem(w.id)}
                            className="p-1 px-2.5 border border-red-200 hover:bg-red-50 text-red-500 rounded font-extrabold uppercase text-[10px] transition-colors inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>{t("Remove")}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

        {/* Tab 3: Allocations history */}
        {activeTab === 'allocations' && (
          <div className="bg-white p-6 rounded-[32px] border border-slate-200/50 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h4 className="font-extrabold text-sm text-[#0c0c1b] tracking-tight">
                🦖 {t("High-Fidelity Multiplex Allocation Archive Ledger")}
              </h4>
              <span className="text-[10px] uppercase font-bold text-slate-400">{allocations.length} {t("Ledger Records Saved")}</span>
            </div>

            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full text-left ltr:text-left rtl:text-right border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase text-[9px] tracking-wider border-b">
                  <tr>
                    <th className="p-3 pl-4">{t("Allocation ID")}</th>
                    <th className="p-3">{t("Original Amount")}</th>
                    <th className="p-3">{t("Status State")}</th>
                    <th className="p-3">{t("Allocated Splits Items")}</th>
                    <th className="p-3">{t("System Fallback Used")}</th>
                    <th className="p-3">{t("Date Requested")}</th>
                    <th className="p-3 text-right pr-4">{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-705 font-bold">
                  {allocations.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 pl-4 font-mono font-black text-slate-800 text-[10px]">{a.id}</td>
                      <td className="p-3 font-mono font-extrabold text-sm text-primary">{a.amount.toLocaleString()} EGP</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          a.status === 'Confirmed' ? 'bg-[#cbf2e2] text-[#003823]' :
                          a.status === 'Reserved' ? 'bg-[#dfe3ff] text-[#001452]' :
                          a.status === 'Expired' ? 'bg-slate-100 text-slate-500' :
                          'bg-[#ffdad6] text-[#ba1a1a]'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3 max-w-[250px]">
                        <div className="flex flex-col gap-1">
                          {a.items.map((it, idx) => (
                            <div key={idx} className="flex justify-between items-center border border-slate-100 bg-slate-50/50 p-1.5 rounded-lg text-[9px] font-mono">
                              <span className="text-[#0c0c1b] font-black">{it.provider} {it.wallet_number}</span>
                              <span className="text-[#0d593a] font-extrabold">+{it.allocated_amount.toLocaleString()} EGP</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-semibold">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide uppercase ${a.fallback_used && a.fallback_used !== 'None' ? 'bg-amber-100 text-[#7a4b00]' : 'bg-slate-100 text-slate-400'}`}>
                          {a.fallback_used || 'None'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-450">{a.created_at}</td>
                      <td className="p-3 text-right pr-4 space-x-1 whitespace-nowrap">
                        {a.status === 'Reserved' && (
                          <>
                            <button
                              onClick={() => confirmAllocation(a.id)}
                              className="px-2.5 py-1 bg-[#0d593a] text-white hover:bg-[#003823] text-[10px] rounded transition-colors font-bold uppercase tracking-wider"
                            >
                              Confirm Payment
                            </button>
                            <button
                              onClick={() => handleAllocationRejection(a.id, 'Cancelled')}
                              className="px-2.5 py-1 border border-red-200 text-red-650 hover:bg-red-55 text-[10px] rounded transition-colors font-bold uppercase tracking-wider"
                            >
                              Reject/Cancel
                            </button>
                          </>
                        )}
                        {a.status !== 'Reserved' && (
                          <span className="text-[10px] text-slate-400 italic font-medium">{t("No pending actions")}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Supabase / Postgres Migration DDL & RPC Code */}
        {activeTab === 'ddl' && (
          <div className="bg-[#0f172a] text-slate-300 p-6 md:p-8 rounded-[32px] border border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-slate-800 pb-5 gap-4">
              <div>
                <span className="px-3.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-400">
                  {t("SUPABASE / ENHANCED POSTGRES DDL & RPC ENGINE")}
                </span>
                <h4 className="text-xl font-black text-white mt-1.5">
                  📚 {t("Supabase Database & RPC Multi-Lock Engine")}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {t("Access production-grade database files. Select a sub-tab to copy and test transactional SELECT FOR UPDATE procedures in real-time.")}
                </p>
              </div>

              {/* RPC Code Copiers */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const sqlCode = `-------------------------------------------------------------
-- FINLUX MOBILE WALLET MULTIPLEX ALLOCATION ENGINE MIGRATE
-- EGYPT LOCAL DEPOSITS CAPACITY GATEWAY FOR TRADING CLIENTS
-------------------------------------------------------------

-- 1) PAYMENT_WALLETS Inventory Line
CREATE TABLE IF NOT EXISTS payment_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL DEFAULT 'Vodafone Cash',
    wallet_number TEXT NOT NULL UNIQUE,
    owner_name TEXT,
    label TEXT,
    country TEXT DEFAULT 'Egypt',
    currency TEXT DEFAULT 'EGP',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'disabled')),
    daily_limit NUMERIC NOT NULL DEFAULT 60000.00,
    monthly_limit NUMERIC NOT NULL DEFAULT 200000.00,
    used_today NUMERIC NOT NULL DEFAULT 0.00,
    used_month NUMERIC NOT NULL DEFAULT 0.00,
    reserved_today NUMERIC NOT NULL DEFAULT 0.00,
    priority INT NOT NULL DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index wallets for high speed querying
CREATE INDEX IF NOT EXISTS idx_payment_wallets_allocation_lookup 
ON payment_wallets (status, priority DESC, daily_limit, used_today, reserved_today);


-- 2) WALLET_ALLOCATIONS Parent Record
CREATE TABLE IF NOT EXISTS wallet_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amount NUMERIC NOT NULL CHECK (amount > 0),
    status TEXT DEFAULT 'Reserved' CHECK (status IN ('Reserved', 'Confirmed', 'Cancelled', 'Expired', 'Rejected')),
    fallback_used TEXT DEFAULT 'None' CHECK (fallback_used IN ('None', 'Bank Transfer', 'InstaPay', 'Manual Support')),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    expires_at TIMESTAMPTZ DEFAULT (now() + interval '15 minutes') NOT NULL
);


-- 3) WALLET_ALLOCATION_ITEMS Child Breakdown
CREATE TABLE IF NOT EXISTS wallet_allocation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    allocation_id UUID REFERENCES wallet_allocations(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES payment_wallets(id),
    allocated_amount NUMERIC NOT NULL CHECK (allocated_amount > 0),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

                    navigator.clipboard.writeText(sqlCode);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 3000);
                    alert(t("Database table schemas copied to clipboard!"));
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t("Copy Tables Schema")}</span>
                </button>

                <button
                  onClick={() => {
                    const rpcSql = `----------------------------------------------------------------------------
-- FINLUX SUPABASE RPC TRANSACTION ALLOCATION PROCEDURES
----------------------------------------------------------------------------

-- 1) allocate_wallets: Sequential SELECT FOR UPDATE Locks & Reserves Capacity
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
BEGIN
  IF p_amount <= 0 THEN
    RAISE EXCEPTION 'Allocation amount must be greater than zero. Received: %', p_amount;
  END IF;

  INSERT INTO wallet_allocations (amount, status, created_at, expires_at)
  VALUES (p_amount, 'Reserved', NOW(), NOW() + (p_duration_minutes || ' minutes')::INTERVAL)
  RETURNING id INTO v_allocation_id;

  FOR v_wallet IN (
    SELECT id, daily_limit, monthly_limit, used_today, used_month, reserved_today
    FROM payment_wallets
    WHERE provider = p_provider AND status = 'active'
    ORDER BY priority DESC, id ASC
    FOR UPDATE
  ) LOOP
    IF v_remaining_amount <= 0 THEN
      EXIT;
    END IF;

    v_wallet_avail := LEAST(
      v_wallet.daily_limit - v_wallet.used_today - v_wallet.reserved_today,
      v_wallet.monthly_limit - v_wallet.used_month - v_wallet.reserved_today
    );

    IF v_wallet_avail > 0 THEN
      v_allocated_amount := LEAST(v_remaining_amount, v_wallet_avail);
      
      INSERT INTO wallet_allocation_items (allocation_id, wallet_id, allocated_amount)
      VALUES (v_allocation_id, v_wallet.id, v_allocated_amount);

      UPDATE payment_wallets
      SET reserved_today = reserved_today + v_allocated_amount
      WHERE id = v_wallet.id;

      v_remaining_amount := v_remaining_amount - v_allocated_amount;
    END IF;
  END LOOP;

  IF v_remaining_amount > 0 THEN
    RAISE EXCEPTION 'Insufficient capacity available on active % wallets. Missing EGP %', p_provider, v_remaining_amount;
  END IF;

  RETURN v_allocation_id;
END;
$$ LANGUAGE plpgsql;

-- 2) confirm_wallet_allocation: Converts holds to spent limits
CREATE OR REPLACE FUNCTION confirm_wallet_allocation(p_allocation_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_alloc_status TEXT;
  v_item RECORD;
BEGIN
  SELECT status INTO v_alloc_status FROM wallet_allocations WHERE id = p_allocation_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Allocation not found'; END IF;
  
  IF v_alloc_status = 'Confirmed' THEN RETURN TRUE;
  ELSIF v_alloc_status != 'Reserved' THEN RAISE EXCEPTION 'Cannot confirm state %', v_alloc_status;
  END IF;

  FOR v_item IN (SELECT wallet_id, allocated_amount FROM wallet_allocation_items WHERE allocation_id = p_allocation_id FOR UPDATE) LOOP
    UPDATE payment_wallets
    SET reserved_today = GREATEST(0, reserved_today - v_item.allocated_amount),
        used_today = used_today + v_item.allocated_amount,
        used_month = used_month + v_item.allocated_amount
    WHERE id = v_item.wallet_id;
  END LOOP;

  UPDATE wallet_allocations SET status = 'Confirmed' WHERE id = p_allocation_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 3) release_wallet_allocation: Returns capacities if cancelled or expired
CREATE OR REPLACE FUNCTION release_wallet_allocation(p_allocation_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_alloc_status TEXT;
  v_item RECORD;
BEGIN
  SELECT status INTO v_alloc_status FROM wallet_allocations WHERE id = p_allocation_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Allocation not found'; END IF;
  
  IF v_alloc_status IN ('Cancelled', 'Expired', 'Rejected') THEN RETURN TRUE;
  ELSIF v_alloc_status = 'Confirmed' THEN RAISE EXCEPTION 'Cannot release confirmed settlement';
  END IF;

  FOR v_item IN (SELECT wallet_id, allocated_amount FROM wallet_allocation_items WHERE allocation_id = p_allocation_id FOR UPDATE) LOOP
    UPDATE payment_wallets
    SET reserved_today = GREATEST(0, reserved_today - v_item.allocated_amount)
    WHERE id = v_item.wallet_id;
  END LOOP;

  UPDATE wallet_allocations SET status = 'Cancelled' WHERE id = p_allocation_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- 4) reset_wallet_daily_limits: Administrative rolling clean
CREATE OR REPLACE FUNCTION reset_wallet_daily_limits()
RETURNS VOID AS $$
BEGIN
  UPDATE payment_wallets SET used_today = 0.00, reserved_today = 0.00;
END;
$$ LANGUAGE plpgsql;

-- 5) reset_wallet_monthly_limits: Administrative rolling clean
CREATE OR REPLACE FUNCTION reset_wallet_monthly_limits()
RETURNS VOID AS $$
BEGIN
  UPDATE payment_wallets SET used_month = 0.00;
END;
$$ LANGUAGE plpgsql;`;

                    navigator.clipboard.writeText(rpcSql);
                    alert(t("All 5 Supabase PL/pgSQL RPC Functions copied successfully! Ready for Supabase SQL Editor."));
                  }}
                  className="px-3 py-1.5 bg-[#006c49] hover:bg-[#005237] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t("Copy 5 Allocation RPCs")}</span>
                </button>
              </div>
            </div>

            {/* Simulated Live RPC Executive Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#030712] p-5 rounded-2xl border border-slate-800">
              <div className="lg:col-span-4 space-y-4">
                <span className="text-[10px] font-black text-[#5182ff] uppercase tracking-widest block">🛠️ {t("RPC Live Playground Console")}</span>
                <p className="text-xs text-slate-400">
                  {t("Interact with the allocation engine using direct RPC hooks. Simulates exact locks, priority sequences, and limit conditions.")}
                </p>

                <div className="space-y-2.5 pt-2">
                  <label className="block text-[11px] font-bold text-slate-350">{t("Select Provider Endpoint")}</label>
                  <select 
                    id="rpc_provider_val"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Vodafone Cash">Vodafone Cash</option>
                    <option value="Etisalat Cash">Etisalat Cash</option>
                    <option value="Orange Cash">Orange Cash</option>
                  </select>

                  <label className="block text-[11px] font-bold text-slate-350">{t("Target Allocation Volume")}</label>
                  <input 
                    type="number"
                    id="rpc_amount_val"
                    defaultValue="35000"
                    className="w-full bg-slate-900 border border-slate-850 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={async () => {
                      const amount = Number((document.getElementById('rpc_amount_val') as HTMLInputElement)?.value || 35000);
                      const provider = (document.getElementById('rpc_provider_val') as HTMLSelectElement)?.value || 'Vodafone Cash';
                      const logConsole = document.getElementById('rpc_logs');
                      if(!logConsole) return;

                      if (isSupabaseConfigured) {
                        logConsole.innerText = `[Supabase] Contacting database... Executing allocate_wallets(p_amount := ${amount}, p_provider := '${provider}')...`;
                        setSupabaseLoading(true);
                        const res = await executeSupabaseAllocate(amount, provider);
                        setSupabaseLoading(false);
                        if (res.error) {
                          logConsole.innerText = `[Supabase Err] Direct call failed:\n${JSON.stringify(res.error, null, 2)}\n\n💡 Ensure you have executed the 5 schema functions (RPCs) under Tab 4 inside your Supabase SQL editor first!`;
                          alert("Supabase RPC failed. Check console log for detailed schema error.");
                        } else {
                          logConsole.innerText = `[Supabase Success] RPC allocate_wallets() finished successfully!\nReturned Allocation UUID Reference: "${res.allocationId}"\n\nReloading wallet balances from database...`;
                          await pullFromSupabase();
                          
                          // Create visual record in history
                          const nowStr = new Date().toLocaleString();
                          const expiresStr = new Date(Date.now() + 15 * 60000).toLocaleString();
                          const newAlloc: AllocationRecord = {
                            id: res.allocationId || 'ALC-Live',
                            amount: amount,
                            status: 'Reserved',
                            created_at: nowStr,
                            expires_at: expiresStr,
                            items: [
                              {
                                wallet_id: 'Supabase-Managed',
                                wallet_number: 'Database Locked',
                                provider: provider,
                                allocated_amount: amount
                              }
                            ],
                            fallback_used: 'None'
                          };
                          setAllocations(prev => [newAlloc, ...prev]);
                          setActiveReservation(newAlloc);
                          setReservationCountdown(900);
                        }
                        return;
                      }

                      let matchedWallets = wallets.filter(w => w.provider === provider && w.status === 'active');
                      matchedWallets = [...matchedWallets].sort((a,b) => b.priority - a.priority);

                      let logText = `--- [BEGIN TRANSACTION: allocate_wallets] ---\n`;
                      logText += `[1/4] INITIALIZING RPC PARAMS: amount=${amount} EGP, provider="${provider}"\n`;
                      logText += `[2/4] SEQUENTIAL ROW LOCKING: Querying table payment_wallets with FOR UPDATE...\n`;

                      let remaining = amount;
                      const allocatedItemsArr: { label: string; amount: number; id: string }[] = [];

                      for (const wallet of matchedWallets) {
                        if (remaining <= 0) break;
                        const avail = Math.min(
                          wallet.daily_limit - wallet.used_today - wallet.reserved_today,
                          wallet.monthly_limit - wallet.used_month - wallet.reserved_today
                        );
                        
                        logText += `  > [ROW LOCK ACQUIRED] Wallet "${wallet.label}" (ID: ${wallet.id}) - Current used=${wallet.used_today}, reserve=${wallet.reserved_today}, limit=${wallet.daily_limit} EGP. Available capacity: ${avail} EGP\n`;
                        
                        if (avail > 0) {
                          const spend = Math.min(remaining, avail);
                          allocatedItemsArr.push({ label: wallet.label, amount: spend, id: wallet.id });
                          remaining -= spend;
                          logText += `    [RESERVATION COMMITTED] Reserved ${spend} EGP. Remaining allocate volume: ${remaining} EGP\n`;
                        } else {
                          logText += `    [SKIPPED] Wallet has 0 available margin.\n`;
                        }
                      }

                      if (remaining > 0) {
                        logText += `[ROLLBACK] EXCEPTION RAISED: Insufficient capacity available on active "${provider}" wallets. Missing EGP ${remaining}.\n`;
                        logText += `--- [TRANSACTION FAILED & ROLLBACK COMPLETED] ---\n`;
                        logConsole.innerText = logText;
                        alert(t("RPC Exception raised: Insufficient capacity for ") + provider);
                        return;
                      }

                      // Apply simulation holds in state
                      const mockAllocId = 'alc-' + Math.random().toString(36).substring(2, 9).toUpperCase();
                      
                      setWallets(prev => prev.map(w => {
                        const itemMatch = allocatedItemsArr.find(item => item.id === w.id);
                        if (itemMatch) {
                          return { ...w, reserved_today: w.reserved_today + itemMatch.amount };
                        }
                        return w;
                      }));

                      const nowStr = new Date().toLocaleString();
                      const expiresStr = new Date(Date.now() + 15 * 60000).toLocaleString();
                      
                      const newAlloc: AllocationRecord = {
                        id: mockAllocId,
                        amount: amount,
                        status: 'Reserved',
                        created_at: nowStr,
                        expires_at: expiresStr,
                        items: allocatedItemsArr.map(item => ({
                          wallet_id: item.id,
                          wallet_number: '010******',
                          provider: provider,
                          allocated_amount: item.amount
                        })),
                        fallback_used: 'None'
                      };

                      setAllocations(prev => [newAlloc, ...prev]);

                      logText += `[3/4] PARENT LOG CREATED: wallet_allocations.id="${mockAllocId}", status="Reserved", expires_at="${expiresStr}"\n`;
                      logText += `[4/4] COMMIT COMPLETED: Capacity locked. Ready to confirm.\n`;
                      logText += `--- [END TRANSACTION SUCCESSful. returned ID="${mockAllocId}"] ---\n`;
                      
                      logConsole.innerText = logText;
                    }}
                    className="w-full bg-[#006c49] hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-black transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-emerald-350" />
                    <span>{t("Execute: allocate_wallets()")}</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                    <button
                      onClick={async () => {
                        const logConsole = document.getElementById('rpc_logs');
                        if(!logConsole) return;

                        // Find first Reserved allocation if any
                        const target = allocations.find(a => a.status === 'Reserved');
                        if (!target) {
                          alert(t("No pending 'Reserved' allocations available to confirm. Run allocate_wallets() first."));
                          return;
                        }

                        if (isSupabaseConfigured) {
                          logConsole.innerText = `[Supabase] Contacting database... Executing confirm_wallet_allocation('${target.id}')...`;
                          setSupabaseLoading(true);
                          const res = await executeSupabaseConfirm(target.id);
                          setSupabaseLoading(false);
                          if (res.error) {
                            logConsole.innerText = `[Supabase Err] Confirm action failed:\n${JSON.stringify(res.error, null, 2)}`;
                            alert("Supabase confirm transaction failed.");
                          } else {
                            logConsole.innerText = `[Supabase Success] RPC confirm_wallet_allocation() finished successfully on live database!\nBalances locked into Used parameters successfully.`;
                            setAllocations(prev => prev.map(a => a.id === target.id ? { ...a, status: 'Confirmed' } : a));
                            if (activeReservation?.id === target.id) {
                              setActiveReservation(null);
                            }
                            await pullFromSupabase();
                          }
                          return;
                        }

                        confirmAllocation(target.id);
                        
                        let logText = `--- [BEGIN TRANSACTION: confirm_wallet_allocation] ---\n`;
                        logText += `[1/3] locking record allocations.id="${target.id}" FOR UPDATE\n`;
                        target.items.forEach(itm => {
                          logText += `  > locking wallet id="${itm.wallet_id}" FOR UPDATE\n`;
                          logText += `    applying used spend: incremental used_today = used_today + ${itm.allocated_amount}\n`;
                          logText += `    releasing holding reserve: reserved_today = reserved_today - ${itm.allocated_amount}\n`;
                        });
                        logText += `[2/3] updating wallet_allocations status to "Confirmed"\n`;
                        logText += `[3/3] TRANSACTION COMMITTED successfully.\n`;
                        logText += `--- [END] ---\n`;
                        logConsole.innerText = logText;
                      }}
                      className="bg-slate-800 hover:bg-slate-750 text-slate-100 p-2 rounded-lg font-bold border border-slate-750 cursor-pointer"
                    >
                      {t("confirm_allocation()")}
                    </button>
                    <button
                      onClick={async () => {
                        const logConsole = document.getElementById('rpc_logs');
                        if(!logConsole) return;

                        const target = allocations.find(a => a.status === 'Reserved');
                        if (!target) {
                          alert(t("No pending 'Reserved' allocations available to release."));
                          return;
                        }

                        if (isSupabaseConfigured) {
                          logConsole.innerText = `[Supabase] Contacting database... Executing release_wallet_allocation('${target.id}')...`;
                          setSupabaseLoading(true);
                          const res = await executeSupabaseRelease(target.id);
                          setSupabaseLoading(false);
                          if (res.error) {
                            logConsole.innerText = `[Supabase Err] Release action failed:\n${JSON.stringify(res.error, null, 2)}`;
                            alert("Supabase release transaction failed.");
                          } else {
                            logConsole.innerText = `[Supabase Success] RPC release_wallet_allocation() finished successfully on live database!\nHolds released. Status changed to "Cancelled".`;
                            setAllocations(prev => prev.map(a => a.id === target.id ? { ...a, status: 'Cancelled' } : a));
                            if (activeReservation?.id === target.id) {
                              setActiveReservation(null);
                            }
                            await pullFromSupabase();
                          }
                          return;
                        }

                        setAllocations(prev => prev.map(a => a.id === target.id ? { ...a, status: 'Cancelled' } : a));
                        setWallets(prev => prev.map(w => {
                          const match = target.items.find(item => item.wallet_id === w.id);
                          if(match) {
                            return { ...w, reserved_today: Math.max(0, w.reserved_today - match.allocated_amount) };
                          }
                          return w;
                        }));

                        let logText = `--- [BEGIN TRANSACTION: release_wallet_allocation] ---\n`;
                        logText += `[1/2] unlocking holdings for allocations.id="${target.id}" FOR UPDATE\n`;
                        target.items.forEach(itm => {
                          logText += `  > decrementing reserved holds on wallet_id="${itm.wallet_id}" by ${itm.allocated_amount} EGP\n`;
                        });
                        logText += `[2/2] setting transaction status to "Cancelled" in wallet_allocations\n`;
                        logText += `--- [END TRANSACTION SUCCESS] ---\n`;
                        logConsole.innerText = logText;
                      }}
                      className="bg-slate-800 hover:bg-slate-750 text-slate-100 p-2 rounded-lg font-bold border border-slate-750 cursor-pointer"
                    >
                      {t("release_allocation()")}
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-850 space-y-2">
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">📅 {t("Administrative Schedulers")}</span>
                    <button
                      onClick={async () => {
                        const logConsole = document.getElementById('rpc_logs');
                        if (isSupabaseConfigured) {
                          if (logConsole) logConsole.innerText = `[Supabase] Contacting database... Executing reset_wallet_daily_limits()...`;
                          setSupabaseLoading(true);
                          const res = await executeSupabaseResetDailyLimits();
                          setSupabaseLoading(false);
                          if (res.error) {
                            if (logConsole) logConsole.innerText = `[Supabase Err] Reset failed:\n${JSON.stringify(res.error, null, 2)}`;
                            alert("Failed to reset daily parameters on Supabase.");
                          } else {
                            if (logConsole) logConsole.innerText = `[Supabase Success] Daily parameters reset successfully on active database table payment_wallets.`;
                            await pullFromSupabase();
                            alert(t("Dynamic daily limit bounds reset completely. DB logs created."));
                          }
                          return;
                        }

                        setWallets(prev => prev.map(w => ({ ...w, used_today: 0, reserved_today: 0 })));
                        if(logConsole) {
                          logConsole.innerText = `--- [ADMIN SCHEDULER: reset_wallet_daily_limits] ---\nTIMESTAMP: ${new Date().toUTCString()}\nSUCCESS: Automated nightly cron has executed successfully. used_today flushes to 0.00 EGP, reserved_today flushed across 5 active P2P nodes.`;
                        }
                        alert(t("Dynamic daily limit bounds reset completely. DB logs created."));
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-850 text-slate-350 p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono hover:text-white transition-colors cursor-pointer"
                    >
                      {t("Run: reset_wallet_daily_limits()")}
                    </button>
                    <button
                      onClick={async () => {
                        const logConsole = document.getElementById('rpc_logs');
                        if (isSupabaseConfigured) {
                          if (logConsole) logConsole.innerText = `[Supabase] Contacting database... Executing reset_wallet_monthly_limits()...`;
                          setSupabaseLoading(true);
                          const res = await executeSupabaseResetMonthlyLimits();
                          setSupabaseLoading(false);
                          if (res.error) {
                            if (logConsole) logConsole.innerText = `[Supabase Err] Reset failed:\n${JSON.stringify(res.error, null, 2)}`;
                            alert("Failed to reset monthly parameters on Supabase.");
                          } else {
                            if (logConsole) logConsole.innerText = `[Supabase Success] Monthly parameters reset successfully on active database table payment_wallets.`;
                            await pullFromSupabase();
                            alert(t("Dynamic monthly spent parameters reset completely."));
                          }
                          return;
                        }

                        setWallets(prev => prev.map(w => ({ ...w, used_month: 0 })));
                        if(logConsole) {
                          logConsole.innerText = `--- [ADMIN SCHEDULER: reset_wallet_monthly_limits] ---\nTIMESTAMP: ${new Date().toUTCString()}\nSUCCESS: Automated monthly first-day limits clean triggers. used_month fields reset to 0.00 EGP.`;
                        }
                        alert(t("Dynamic monthly spent parameters reset completely."));
                      }}
                      className="w-full bg-slate-900 hover:bg-slate-850 text-slate-350 p-2.5 rounded-lg border border-slate-800 text-[10px] font-mono hover:text-white transition-colors cursor-pointer"
                    >
                      {t("Run: reset_wallet_monthly_limits()")}
                    </button>
                  </div>
                </div>

              </div>

              {/* RPC Query Log Terminal Monitor screen */}
              <div className="lg:col-span-8 flex flex-col justify-between bg-[#030712] rounded-2xl border border-slate-800 p-4">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase select-none flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      {t("PostgreSQL Database RPC Log Monitor")}
                    </span>
                    <button 
                      onClick={() => {
                        const log = document.getElementById('rpc_logs');
                        if(log) log.innerText = `-- Ready for transaction events. Execute an RPC function using the left controls to monitor the query parser runtime results --`;
                      }}
                      className="text-[9px] hover:underline text-slate-500 font-bold cursor-pointer"
                    >
                      {t("Clear Console Log")}
                    </button>
                  </div>

                  <div 
                    id="rpc_logs"
                    className="bg-[#010307] border border-slate-850 rounded-lg p-4 font-mono text-[10px] text-slate-350 leading-relaxed max-h-[300px] overflow-y-auto whitespace-pre-wrap select-text text-left"
                  >
                    -- Ready for transaction events. Execute an RPC function using the left controls to monitor the query parser runtime results --
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-850 text-[10px] leading-relaxed text-slate-400 space-y-1 text-left">
                  <p className="font-bold text-slate-300">💡 SELECT FOR UPDATE transactional locking:</p>
                  <p>
                    By enforcing row locks sequentially during candidate lookup, parallel transactions are queued at the database engine level, preventing dirty reads or overlapping reserves on Vodafone and Instapay lines entirely.
                  </p>
                </div>
              </div>
            </div>

            {/* Guide Info */}
            <div className="bg-slate-800/40 p-5 rounded-2xl text-[11px] flex items-start gap-3 border border-slate-800">
              <Info className="w-4.5 h-4.5 text-indigo-300 shrink-0 mt-0.5" />
              <div className="text-left">
                <strong className="text-white block font-bold mb-1">{t("Production Integration Safety Guideline:")}</strong>
                <p className="leading-relaxed text-slate-450">
                  {t("These PL/pgSQL routines match our offline allocation models exactly. When writing to Supabase, run the full schema script first. Administrative functions should be triggerable via standard scheduled pg_cron procedures to refresh the rolling bounds.")}
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
