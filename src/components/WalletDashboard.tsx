import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  XOctagon,
  Trash2, 
  Plus, 
  RefreshCw, 
  Database,
  Lock,
  Unlock,
  Sliders,
  Copy,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpDown,
  Edit2,
  DollarSign,
  Briefcase,
  Play,
  Pause,
  Ban
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { 
  isSupabaseConfigured, 
  fetchSupabaseWallets, 
  saveSupabaseWallet, 
  deleteSupabaseWallet,
  seedSupabaseIfNeeded
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
  priority: number;
  last_used?: string;
}

export default function WalletDashboard() {
  const { t } = useTranslation();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [providerFilter, setProviderFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'priority' | 'used_today' | 'daily_limit' | 'provider'>('priority');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Modal Editing States
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Wallet Form fields
  const [newWalletNum, setNewWalletNum] = useState('');
  const [newWalletProvider, setNewWalletProvider] = useState('Vodafone Cash');
  const [newWalletOwner, setNewWalletOwner] = useState('');
  const [newWalletLabel, setNewWalletLabel] = useState('');
  const [newWalletPriority, setNewWalletPriority] = useState('5');
  const [newWalletDailyLimit, setNewWalletDailyLimit] = useState('60000');
  const [newWalletMonthlyLimit, setNewWalletMonthlyLimit] = useState('200000');

  // Wallets State - Shared with WalletAllocationEngine using the exact same localStorage key
  const [wallets, setWallets] = useState<Wallet[]>(() => {
    const saved = localStorage.getItem('finlux_allocation_wallets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
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

  // Supabase state managers
  const [supabaseLoading, setSupabaseLoading] = useState(false);

  const pullFromSupabase = async (forceSeed = false) => {
    if (!isSupabaseConfigured) return;
    setSupabaseLoading(true);
    try {
      if (forceSeed) {
        await seedSupabaseIfNeeded(wallets);
      }
      const { data, error } = await fetchSupabaseWallets();
      if (!error && data) {
        setWallets(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSupabaseLoading(false);
    }
  };

  useEffect(() => {
    if (isSupabaseConfigured) {
      const initSupabase = async () => {
        setSupabaseLoading(true);
        await seedSupabaseIfNeeded(wallets);
        await pullFromSupabase();
      };
      initSupabase();
    }
  }, []);

  // Sync to local fallback key
  useEffect(() => {
    localStorage.setItem('finlux_allocation_wallets', JSON.stringify(wallets));
  }, [wallets]);

  // Handle simple toggle pause/activate
  const toggleWalletStatus = async (id: string, currentStatus: 'active' | 'paused' | 'disabled') => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    const target = wallets.find(w => w.id === id);
    if (!target) return;
    const updated = { ...target, status: nextStatus };
    if (isSupabaseConfigured) {
      setSupabaseLoading(true);
      await saveSupabaseWallet(updated);
      await pullFromSupabase();
    } else {
      setWallets(prev => prev.map(w => w.id === id ? updated : w));
    }
  };

  // Explicitly set to disabled, paused or active
  const updateWalletStatus = async (id: string, newStatus: Wallet['status']) => {
    const target = wallets.find(w => w.id === id);
    if (!target) return;
    const updated = { ...target, status: newStatus };
    if (isSupabaseConfigured) {
      setSupabaseLoading(true);
      await saveSupabaseWallet(updated);
      await pullFromSupabase();
    } else {
      setWallets(prev => prev.map(w => w.id === id ? updated : w));
    }
  };

  const deleteWalletItem = async (id: string) => {
    if (window.confirm("Are you sure you want to deactivate and remove this mobile wallet completely?")) {
      if (isSupabaseConfigured) {
        setSupabaseLoading(true);
        await deleteSupabaseWallet(id);
        await pullFromSupabase();
      } else {
        setWallets(prev => prev.filter(w => w.id !== id));
      }
    }
  };

  // Reset daily statistics (Operational Rollover)
  const resetDailyMetrics = async () => {
    if (window.confirm("Prepare Daily Rollover? This will zero out used today statistics for all active channels.")) {
      if (isSupabaseConfigured) {
        setSupabaseLoading(true);
        for (const w of wallets) {
          await saveSupabaseWallet({ ...w, used_today: 0, reserved_today: 0 });
        }
        await pullFromSupabase();
      } else {
        setWallets(prev => prev.map(w => ({
          ...w,
          used_today: 0,
          reserved_today: 0
        })));
      }
    }
  };

  // Create Wallet Submission
  const handleCreateWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWalletNum.trim() || !newWalletOwner.trim()) {
      alert("Please provide the wallet telephone digits and custodian legal name.");
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
      await saveSupabaseWallet(newW);
      await pullFromSupabase();
    } else {
      setWallets(prev => [...prev, newW]);
    }

    setNewWalletNum('');
    setNewWalletOwner('');
    setNewWalletLabel('');
    setShowAddModal(false);
    alert("New high-capacity PSP payment wallet deployed successfully!");
  };

  // Edit Wallet Submission
  const handleUpdateWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWallet) return;

    setWallets(prev => prev.map(w => {
      if (w.id === editingWallet.id) {
        return editingWallet;
      }
      return w;
    }));
    setEditingWallet(null);
    alert("Wallet configuration modified successfully.");
  };

  // Quick simulation increment to verify progress bar changes (interactive testing)
  const simulateCreditTx = (id: string, value: number) => {
    setWallets(prev => prev.map(w => {
      if (w.id === id) {
        const nextToday = Math.min(w.daily_limit, w.used_today + value);
        const nextMonth = Math.min(w.monthly_limit, w.used_month + value);
        return {
          ...w,
          used_today: nextToday,
          used_month: nextMonth
        };
      }
      return w;
    }));
  };

  // Sorting Handler
  const requestSort = (field: typeof sortField) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortField === field && sortDirection === 'desc') {
      direction = 'asc';
    }
    setSortField(field);
    setSortDirection(direction);
  };

  // Filter & Filter Logic
  const filteredWallets = wallets.filter(wallet => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      wallet.wallet_number.includes(query) ||
      wallet.owner_name.toLowerCase().includes(query) ||
      wallet.label.toLowerCase().includes(query);
    
    const matchesProvider = providerFilter === 'ALL' || wallet.provider === providerFilter;
    const matchesStatus = statusFilter === 'ALL' || wallet.status === statusFilter;

    return matchesSearch && matchesProvider && matchesStatus;
  }).sort((a, b) => {
    let factor = sortDirection === 'asc' ? 1 : -1;
    if (sortField === 'provider') {
      return a.provider.localeCompare(b.provider) * factor;
    }
    if (sortField === 'used_today') {
      return (a.used_today - b.used_today) * factor;
    }
    if (sortField === 'daily_limit') {
      return (a.daily_limit - b.daily_limit) * factor;
    }
    return (a.priority - b.priority) * factor;
  });

  // Calculate Quick Stats
  const statsTotalLimit = wallets.reduce((acc, curr) => acc + curr.daily_limit, 0);
  const statsTotalUsedToday = wallets.reduce((acc, curr) => acc + curr.used_today, 0);
  const statsTotalUsedMonth = wallets.reduce((acc, curr) => acc + curr.used_month, 0);
  const activeCount = wallets.filter(w => w.status === 'active').length;
  const pausedCount = wallets.filter(w => w.status === 'paused').length;
  const disabledCount = wallets.filter(w => w.status === 'disabled').length;

  return (
    <div className="space-y-6" id="wallet-dashboard-root">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-3.5 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-700">
            {t("Node Operations Matrix")}
          </span>
          <h2 className="text-2xl font-black text-on-surface mt-2 flex items-center gap-2">
            <span>🛡️</span>
            <span>{t("Mobile Wallet Control Hub")}</span>
          </h2>
          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed max-w-2xl">
            {t("Manage and monitor local payment nodes in real-time. Toggle status, verify continuous compliance limits, perform daily resets, and keep processing systems online.")}
          </p>
        </div>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            type="button"
            onClick={resetDailyMetrics}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-3xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-slate-600" />
            <span>{t("Daily Rollover Reset")}</span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#003ec7] hover:bg-[#002ba1] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t("Provision New Wallet")}</span>
          </button>
        </div>
      </div>

      {/* Aggregate Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat Card 1: Active Lines */}
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{t("Operational Channels")}</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900">{activeCount}</span>
              <span className="text-xs text-[#006c49] font-bold">/ {wallets.length} {t("Allocated")}</span>
            </div>
            <div className="flex gap-2 text-[10px] text-slate-500 font-medium">
              <span className="text-amber-600 font-semibold">{pausedCount} {t("Paused")}</span>
              <span>•</span>
              <span className="text-red-600 font-semibold">{disabledCount} {t("Disabled")}</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl">
            <Smartphone className="w-6 h-6 text-indigo-600" />
          </div>
        </div>

        {/* Stat Card 2: Today Pool Cap */}
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{t("Daily Inflow Today")}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold tracking-tight text-slate-900 font-mono">
                {statsTotalUsedToday.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-bold">EGP</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-tight select-none">
              {(statsTotalUsedToday / Math.max(1, statsTotalLimit) * 100).toFixed(1)}% {t("of daily cap space filled")}
            </p>
          </div>
          <div className="p-3 bg-[#0d593a]/10 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-[#0d593a]" />
          </div>
        </div>

        {/* Stat Card 3: Monthly Statistics */}
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{t("Sum Monthly Throughput")}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-semibold tracking-tight text-slate-900 font-mono">
                {statsTotalUsedMonth.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-bold">EGP</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              {t("P2P System Monthly Velocity")}
            </p>
          </div>
          <div className="p-3 bg-purple-50 rounded-2xl">
            <Briefcase className="w-6 h-6 text-purple-600" />
          </div>
        </div>

        {/* Stat Card 4: System Saturation */}
        <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/50 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">{t("Saturated / Limits Met")}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-rose-655 font-mono">
                {wallets.filter(w => w.used_today >= w.daily_limit * 0.95).length}
              </span>
              <span className="text-xs text-slate-400 font-bold">{t("Fully Loaded")}</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium h-4">
              {wallets.filter(w => w.used_today >= w.daily_limit * 0.95).length > 0 
                ? t("⚠️ Overflow routing triggered") 
                : t("✅ Safe capacity headroom available")}
            </p>
          </div>
          <div className="p-3 bg-[#ffdad6] rounded-2xl">
            {wallets.filter(w => w.used_today >= w.daily_limit * 0.95).length > 0 ? (
              <Flame className="w-6 h-6 text-[#93000a] animate-bounce" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-[#0d593a]" />
            )}
          </div>
        </div>

      </div>

      {/* Filter and Search Box */}
      <div className="bg-white/84 p-4 rounded-2xl border border-slate-200/50 shadow-3xs flex flex-col md:flex-row gap-4 justify-between items-center text-xs font-semibold text-slate-600">
        
        {/* Left SEARCH search box */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t("Search by wallet number, legal owner, name, or metadata tags...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 outline-none font-medium focus:border-indigo-400 text-slate-800 transition-all shadow-3xs"
          />
        </div>

        {/* Filters and sorting */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Provider Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t("Operator:")}</span>
            <select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold outline-none text-slate-800"
            >
              <option value="ALL">ALL PROVIDERS</option>
              <option value="Vodafone Cash">Vodafone Cash</option>
              <option value="Etisalat Cash">Etisalat Cash</option>
              <option value="Orange Cash">Orange Cash</option>
              <option value="WE Pay eg">WE Pay Egypt</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t("Status:")}</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 font-bold outline-none text-slate-800"
            >
              <option value="ALL">ALL STATES</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          {/* Reset Filters */}
          {(searchQuery || providerFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setProviderFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold"
            >
              {t("Clear Filters")}
            </button>
          )}

        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden min-w-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left ltr:text-left rtl:text-right border-collapse">
            <thead className="bg-slate-50/70 border-b border-slate-100/80 text-[10px] font-black text-slate-400 uppercase tracking-widest select-none">
              <tr>
                <th className="p-4 pl-6 cursor-pointer hover:bg-slate-100/50" onClick={() => requestSort('provider')}>
                  <div className="flex items-center gap-1">
                    <span>{t("Mobile line / operator")}</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="p-4">{t("Custodian legal owner")}</th>
                <th className="p-4 text-center cursor-pointer hover:bg-slate-100/50" onClick={() => requestSort('priority')}>
                  <div className="flex items-center justify-center gap-1">
                    <span>{t("Queue priority")}</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="p-4 cursor-pointer hover:bg-slate-100" onClick={() => requestSort('used_today')}>
                  <div className="flex items-center gap-1">
                    <span>{t("Daily limits & today usage")}</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="p-4">{t("Monthly throughput metrics")}</th>
                <th className="p-4">{t("Status status")}</th>
                <th className="p-4 text-right pr-6">{t("Node management controls")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-705 font-bold">
              {filteredWallets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <div className="max-w-sm mx-auto space-y-2">
                      <Smartphone className="w-12 h-12 text-slate-300 mx-auto" />
                      <h4 className="font-extrabold text-sm text-slate-600">{t("No Match Found")}</h4>
                      <p className="text-slate-400 text-xs font-medium leading-relaxed">
                        {t("No payment wallets match the selected queries. Create a new wallet or clear the filters above to view inventory.")}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWallets.map(w => {
                  const dailyPct = Math.min(100, (w.used_today / w.daily_limit) * 100);
                  const monthlyPct = Math.min(100, (w.used_month / w.monthly_limit) * 100);

                  return (
                    <tr 
                      key={w.id} 
                      className={`hover:bg-slate-50/40 transition-colors ${
                        w.status === 'paused' ? 'bg-amber-50/10' : 
                        w.status === 'disabled' ? 'bg-red-50/10' : ''
                      }`}
                    >
                      {/* Column 1: Provider / Number */}
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            w.provider.includes("Vodafone") ? 'bg-red-50 text-red-650' : 
                            w.provider.includes("Etisalat") ? 'bg-emerald-50 text-emerald-650' :
                            w.provider.includes("Orange") ? 'bg-orange-50 text-orange-650' :
                            'bg-indigo-50 text-indigo-650'
                          }`}>
                            {w.provider.substring(0, 1)}
                          </div>
                          <div>
                            <div className="font-mono text-sm font-black text-slate-900 select-all tracking-tight flex items-center gap-1.5 focus:blur-none">
                              {w.wallet_number}
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(w.wallet_number);
                                  alert(t("Wallet number copied!"));
                                }}
                                className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-slate-400 hover:text-slate-650 transition-all p-0.5"
                                title="Copy Number"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider mt-0.5">
                              {w.provider} EG
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Legal Custodian owner */}
                      <td className="p-4">
                        <div className="text-slate-900 font-black">{w.owner_name}</div>
                        <div className="text-[10px] font-semibold text-slate-400 mt-0.5 max-w-[160px] truncate leading-tight">
                          {w.label}
                        </div>
                      </td>

                      {/* Column 3: Priority */}
                      <td className="p-4 text-center">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-bold font-mono border border-slate-200/50">
                          {w.priority}
                        </span>
                      </td>

                      {/* Column 4: Daily Limits Progress Bar */}
                      <td className="p-4 min-w-[180px]">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500">
                            <span className={dailyPct >= 90 ? 'text-red-600 font-black flex items-center gap-0.5' : ''}>
                              {dailyPct >= 90 && <Flame className="w-3 h-3" />}
                              {dailyPct.toFixed(0)}% Utilized
                            </span>
                            <span className="font-mono font-bold text-slate-700">
                              {w.used_today.toLocaleString()} / {w.daily_limit.toLocaleString()} EGP
                            </span>
                          </div>

                          {/* Target Limit Progress bar */}
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-150">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                w.status === 'disabled' ? 'bg-slate-400' :
                                dailyPct >= 95 ? 'bg-red-500' :
                                dailyPct >= 80 ? 'bg-amber-400' : 
                                'bg-[#0d593a]'
                              }`}
                              style={{ width: `${dailyPct}%` }}
                            />
                          </div>

                          {/* Quick simulate transaction buttons */}
                          {w.status === 'active' && (
                            <div className="flex items-center gap-1.5 pt-1 font-semibold text-[9px] text-[#006c49]">
                              <span>Simulate Deposit:</span>
                              <button 
                                onClick={() => simulateCreditTx(w.id, 5000)}
                                className="px-1.5 py-0.2 ml-1 bg-slate-100 hover:bg-slate-200 hover:text-[#003823] border border-slate-200 rounded font-bold"
                              >
                                +5K
                              </button>
                              <button
                                onClick={() => simulateCreditTx(w.id, 15000)}
                                className="px-1.5 py-0.2 bg-slate-100 hover:bg-slate-200 hover:text-[#003823] border border-slate-200 rounded font-bold"
                              >
                                +15K
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Column 5: Monthly Throughput Metrics Progress */}
                      <td className="p-4 min-w-[180px]">
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-500">
                            <span>{monthlyPct.toFixed(0)}% Month Space</span>
                            <span className="font-mono font-bold text-slate-700">
                              {w.used_month.toLocaleString()} / {w.monthly_limit.toLocaleString()} EGP
                            </span>
                          </div>

                          {/* Target Limit Monthly Progress bar */}
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-150">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                w.status === 'disabled' ? 'bg-slate-400' :
                                monthlyPct >= 90 ? 'bg-red-500' :
                                'bg-indigo-500'
                              }`}
                              style={{ width: `${monthlyPct}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Column 6: Status Badges */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`px-2.5 py-0.7 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            w.status === 'active' ? 'bg-[#cbf2e2] text-[#003823] border border-[#006c49]/10' :
                            w.status === 'paused' ? 'bg-[#ffebd1] text-[#7a4b00] border border-amber-500/10' :
                            'bg-[#ffdad6] text-[#ba1a1a] border border-red-500/10'
                          }`}>
                            {w.status === 'active' && '● Active'}
                            {w.status === 'paused' && '⏸ Paused'}
                            {w.status === 'disabled' && '✕ Disabled'}
                          </span>
                        </div>
                      </td>

                      {/* Column 7: Administrative Action Buttons */}
                      <td className="p-4 pr-6 text-right whitespace-nowrap shrink-0">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          {/* Pause/Play Administrative Controls */}
                          {w.status === 'active' ? (
                            <button
                              type="button"
                              onClick={() => toggleWalletStatus(w.id, 'active')}
                              className="p-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg transition-colors cursor-pointer"
                              title="Pause mobile line"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateWalletStatus(w.id, 'active')}
                              className="p-1.5 bg-[#cbf2e2] hover:bg-[#a6ebd0] border border-emerald-305 text-[#003823] rounded-lg transition-colors cursor-pointer"
                              title="Turn line active"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}

                          {/* Disable state */}
                          {w.status !== 'disabled' ? (
                            <button
                              type="button"
                              onClick={() => updateWalletStatus(w.id, 'disabled')}
                              className="p-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-650 rounded-lg transition-colors cursor-pointer"
                              title="Disable immediately"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateWalletStatus(w.id, 'paused')}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 border text-slate-500 rounded-lg transition-colors cursor-pointer"
                              title="Standby state"
                            >
                              <Pause className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit configuration details */}
                          <button
                            type="button"
                            onClick={() => setEditingWallet(w)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-150 border border-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                            title="Configure Limits & Labels"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => deleteWalletItem(w.id)}
                            className="p-1.5 bg-slate-50 hover:bg-rose-50 hover:text-red-600 border border-slate-200 hover:border-red-200 text-slate-400 rounded-lg transition-colors cursor-pointer"
                            title="Deregister node"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Edit Wallet Configuration */}
      <AnimatePresence>
        {editingWallet && (
          <div className="fixed inset-0 bg-[#0c0c1b]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 font-semibold text-xs"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="text-sm font-extrabold text-[#0c0c1b] tracking-tight">
                  ⚙️ {t("Edit Wallet Limits & Priority")}
                </h3>
                <button 
                  onClick={() => setEditingWallet(null)}
                  className="p-1 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <XOctagon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateWallet} className="space-y-4 text-slate-600 font-bold">
                <div className="grid grid-cols-2 gap-3 pb-2 bg-slate-50 p-2.5 rounded-xl border">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Number:</span>
                    <span className="font-mono text-sm text-[#0c0c1b] font-black">{editingWallet.wallet_number}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider">Telecom:</span>
                    <span className="font-sans text-xs text-[#0c0c1b] font-black block">{editingWallet.provider}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Custodian Owner Legal Name")}</label>
                  <input
                    type="text"
                    value={editingWallet.owner_name}
                    onChange={(e) => setEditingWallet({ ...editingWallet, owner_name: e.target.value })}
                    className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-250 outline-none text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Internal Admin Label")}</label>
                  <input
                    type="text"
                    value={editingWallet.label}
                    onChange={(e) => setEditingWallet({ ...editingWallet, label: e.target.value })}
                    className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-250 outline-none text-slate-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wide mb-1">{t("Priority (1-10)")}</label>
                    <input
                      type="number"
                      value={editingWallet.priority}
                      min="1"
                      max="10"
                      onChange={(e) => setEditingWallet({ ...editingWallet, priority: Number(e.target.value) })}
                      className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-250 outline-none text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wide mb-1">{t("Daily Limit")}</label>
                    <input
                      type="number"
                      value={editingWallet.daily_limit}
                      onChange={(e) => setEditingWallet({ ...editingWallet, daily_limit: Number(e.target.value) })}
                      className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-250 outline-none text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wide mb-1">{t("Monthly Limit")}</label>
                    <input
                      type="number"
                      value={editingWallet.monthly_limit}
                      onChange={(e) => setEditingWallet({ ...editingWallet, monthly_limit: Number(e.target.value) })}
                      className="w-full bg-slate-50/60 p-2.5 rounded-xl border border-slate-250 outline-none text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="col-span-1">
                    <label className="block text-[10px] text-slate-405 uppercase tracking-wide mb-1">{t("Current Used Today")}</label>
                    <input
                      type="number"
                      value={editingWallet.used_today}
                      onChange={(e) => setEditingWallet({ ...editingWallet, used_today: Number(e.target.value) })}
                      className="w-full bg-slate-50/60 p-2.5 rounded-xl border outline-none text-slate-800 font-mono"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] text-slate-405 uppercase tracking-wide mb-1">{t("Current Used Month")}</label>
                    <input
                      type="number"
                      value={editingWallet.used_month}
                      onChange={(e) => setEditingWallet({ ...editingWallet, used_month: Number(e.target.value) })}
                      className="w-full bg-slate-50/60 p-2.5 rounded-xl border outline-none text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#003ec7] hover:bg-[#002ba1] text-white rounded-xl font-bold uppercase tracking-wider text-[11px] transition-colors shadow"
                >
                  {t("Save Wallet Changes")}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Provision New Wallet */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-[#0c0c1b]/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 font-semibold text-xs"
            >
              <div className="flex justify-between items-center pb-2 border-b">
                <h3 className="text-sm font-extrabold text-[#0c0c1b] tracking-tight">
                  📱 {t("Deploy Mobile P2P Inflow Channel")}
                </h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-650 cursor-pointer"
                >
                  <XOctagon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateWallet} className="space-y-3.5 text-slate-600 font-black">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Telecom Provider")}</label>
                  <select
                    value={newWalletProvider}
                    onChange={(e) => setNewWalletProvider(e.target.value)}
                    className="w-full bg-slate-50/60 p-2.5 rounded-xl border outline-none text-xs text-slate-800 font-bold"
                  >
                    <option value="Vodafone Cash">Vodafone Cash</option>
                    <option value="Etisalat Cash">Etisalat Cash</option>
                    <option value="Orange Cash">Orange Cash</option>
                    <option value="WE Pay eg">WE Pay Egypt</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Wallet Number (digits)")}</label>
                  <input
                    type="text"
                    value={newWalletNum}
                    onChange={(e) => setNewWalletNum(e.target.value)}
                    placeholder="e.g. 01011112222"
                    className="w-full bg-slate-50/60 p-2.5 rounded-xl border outline-none placeholder-slate-300 font-mono text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Custodian Owner Legal Name")}</label>
                  <input
                    type="text"
                    value={newWalletOwner}
                    onChange={(e) => setNewWalletOwner(e.target.value)}
                    placeholder="e.g. Omar Salem"
                    className="w-full bg-slate-50/60 p-2.5 rounded-xl border outline-none placeholder-slate-300 text-slate-800"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Internal Admin Label")}</label>
                  <input
                    type="text"
                    value={newWalletLabel}
                    onChange={(e) => setNewWalletLabel(e.target.value)}
                    placeholder="e.g. Backdoor Float Limit line #8"
                    className="w-full bg-slate-50/60 p-2.5 rounded-xl border outline-none placeholder-slate-300 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Priority Order")}</label>
                    <input
                      type="number"
                      value={newWalletPriority}
                      onChange={(e) => setNewWalletPriority(e.target.value)}
                      placeholder="5"
                      min="1"
                      max="10"
                      className="w-full bg-slate-50/60 p-2.5 rounded-xl border outline-none text-slate-800 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Daily Cap Bounds")}</label>
                    <input
                      type="number"
                      value={newWalletDailyLimit}
                      onChange={(e) => setNewWalletDailyLimit(e.target.value)}
                      placeholder="60000"
                      className="w-full bg-slate-50/60 p-2.5 rounded-xl border outline-none text-slate-800 font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-wide">{t("Monthly Cap Bounds")}</label>
                    <input
                      type="number"
                      value={newWalletMonthlyLimit}
                      onChange={(e) => setNewWalletMonthlyLimit(e.target.value)}
                      placeholder="200000"
                      className="w-full bg-slate-50/60 p-2.5 rounded-xl border outline-none text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider text-[11px] transition-colors"
                >
                  {t("Deploy Line to Live Production")}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
