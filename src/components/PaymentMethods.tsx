import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Building2, 
  CreditCard, 
  PlusCircle, 
  Globe, 
  ChevronRight, 
  BarChart2, 
  MessageSquare, 
  CheckCircle, 
  TrendingUp, 
  Sliders, 
  DollarSign, 
  Upload, 
  Trash2, 
  ArrowRightLeft,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function PaymentMethods() {
  const { t } = useTranslation();
  
  // 1. Tab switching: 'methods' | 'pools' | 'routing'
  const [currentTab, setCurrentTab] = useState<'methods' | 'pools' | 'routing'>('methods');

  // --- STORES & COMPONENT DATA STATE ---
  
  // Custom Pools
  const [pools, setPools] = useState<any[]>(() => {
    const saved = localStorage.getItem('finlux_pm_pools');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      { id: 'pool-1', name: 'High-Priority Ingress Pool', description: 'Primary high-speed pool for active deposits', enabled: true, status: 'Active' },
      { id: 'pool-2', name: 'VIP Settlement Pool', description: 'Safely reserves client disbursements with zero latency', enabled: true, status: 'Active' },
      { id: 'pool-3', name: 'Standard Retail Float', description: 'Regular P2P automated queue limits', enabled: true, status: 'Active' }
    ];
  });

  // MENA Region Payment Methods
  const [methods, setMethods] = useState<any[]>(() => {
    const saved = localStorage.getItem('finlux_pm_methods');
    const baseMethods = [
      { id: 'method-1', name: 'Vodafone Cash', region: 'Egypt (EG)', logoEmoji: '📱', type: 'Pay-In', enabled: true, logoUrl: '' },
      { id: 'method-2', name: 'InstaPay Egypt', region: 'Egypt (EG)', logoEmoji: '🏦', type: 'Pay-In', enabled: true, logoUrl: '' },
      { id: 'method-3', name: 'STC Pay', region: 'Saudi Arabia (KSA)', logoEmoji: '🪙', type: 'Pay-In', enabled: true, logoUrl: '' },
      { id: 'method-4', name: 'Fawry Pay', region: 'Egypt (EG)', logoEmoji: '⚡', type: 'Pay-In', enabled: true, logoUrl: '' },
      { id: 'method-5', name: 'BenefitPay', region: 'Bahrain (BH)', logoEmoji: '🇧🇭', type: 'Pay-Out', enabled: true, logoUrl: '' },
      { id: 'method-6', name: 'KNET Gateway', region: 'Kuwait (KW)', logoEmoji: '🇰🇼', type: 'Pay-Out', enabled: true, logoUrl: '' },
      { id: 'method-local-depositor', name: 'Local Depositor', region: 'Egypt (EG)', logoEmoji: '👥', type: 'Pay-In', enabled: true, logoUrl: '' }
    ];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.some((m: any) => m.id === 'method-local-depositor')) {
          parsed.push({ id: 'method-local-depositor', name: 'Local Depositor', region: 'Egypt (EG)', logoEmoji: '👥', type: 'Pay-In', enabled: true, logoUrl: '' });
        }
        return parsed;
      } catch (e) {}
    }
    return baseMethods;
  });

  // Accounts linked to methods & pools
  const [accounts, setAccounts] = useState<any[]>(() => {
    const saved = localStorage.getItem('finlux_pm_accounts');
    const baseAccounts = [
      { id: 'acc-1', methodId: 'method-1', label: 'Vodafone Cash Primary #7742', identifier: '01023456789', pool: 'High-Priority Ingress Pool', used: 24500, limit: 30000, status: 'Active', logoUrl: '' },
      { id: 'acc-2', methodId: 'method-1', label: 'V-wallet backup', identifier: '01053429988', pool: 'Standard Retail Float', used: 2000, limit: 30000, status: 'Active', logoUrl: '' },
      { id: 'acc-3', methodId: 'method-2', label: 'CIB corporate instapay', identifier: 'cib_instapay_99@cib', pool: 'VIP Settlement Pool', used: 120000, limit: 250000, status: 'Active', logoUrl: '' },
      { id: 'acc-4', methodId: 'method-3', label: 'STC Admin pay-out area', identifier: '+966509998811', pool: 'VIP Settlement Pool', used: 45000, limit: 250000, status: 'Active', logoUrl: '' },
      { id: 'acc-ld-1', methodId: 'method-local-depositor', label: 'Khalid Ahmed (Local Depositor)', identifier: 'LD-882193', pool: 'High-Priority Ingress Pool', used: 12450, limit: 15000, status: 'Active', logoUrl: '' },
      { id: 'acc-ld-2', methodId: 'method-local-depositor', label: 'Yasmine Mansour (Local Depositor)', identifier: 'LD-884022', pool: 'Standard Retail Float', used: 2100, limit: 25000, status: 'Active', logoUrl: '' },
      { id: 'acc-ld-3', methodId: 'method-local-depositor', label: 'Omar Mahmoud (Local Depositor)', identifier: 'LD-911245', pool: 'VIP Settlement Pool', used: 8900, limit: 10000, status: 'Active', logoUrl: '' }
    ];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.some((a: any) => a.id === 'acc-ld-1')) {
          parsed.push({ id: 'acc-ld-1', methodId: 'method-local-depositor', label: 'Khalid Ahmed (Local Depositor)', identifier: 'LD-882193', pool: 'High-Priority Ingress Pool', used: 12450, limit: 15000, status: 'Active', logoUrl: '' });
        }
        if (!parsed.some((a: any) => a.id === 'acc-ld-2')) {
          parsed.push({ id: 'acc-ld-2', methodId: 'method-local-depositor', label: 'Yasmine Mansour (Local Depositor)', identifier: 'LD-884022', pool: 'Standard Retail Float', used: 2100, limit: 25000, status: 'Active', logoUrl: '' });
        }
        if (!parsed.some((a: any) => a.id === 'acc-ld-3')) {
          parsed.push({ id: 'acc-ld-3', methodId: 'method-local-depositor', label: 'Omar Mahmoud (Local Depositor)', identifier: 'LD-911245', pool: 'VIP Settlement Pool', used: 8900, limit: 10000, status: 'Active', logoUrl: '' });
        }
        return parsed;
      } catch (e) {}
    }
    return baseAccounts;
  });

  // Merchant pool custom fee config
  const [merchantConfigs, setMerchantConfigs ] = useState<any[]>(() => {
    const saved = localStorage.getItem('finlux_pm_merchantConfigs');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      { id: 'fee-1', merchantName: 'Luxury Goods Co.', methodId: 'method-1', poolId: 'pool-1', feePercent: 1.2, feeFixed: 3.0, direction: 'Pay-In' },
      { id: 'fee-2', merchantName: 'Luxury Goods Co.', methodId: 'method-2', poolId: 'pool-2', feePercent: 0.8, feeFixed: 5.0, direction: 'Pay-In' },
      { id: 'fee-3', merchantName: 'Apex Global Ltd', methodId: 'method-3', poolId: 'pool-2', feePercent: 1.5, feeFixed: 2.0, direction: 'Pay-Out' },
      { id: 'fee-4', merchantName: 'Swift Tech', methodId: 'method-4', poolId: 'pool-3', feePercent: 2.0, feeFixed: 1.5, direction: 'Pay-In' }
    ];
  });

  // Keep synced
  useEffect(() => {
    localStorage.setItem('finlux_pm_pools', JSON.stringify(pools));
  }, [pools]);

  useEffect(() => {
    localStorage.setItem('finlux_pm_methods', JSON.stringify(methods));
  }, [methods]);

  useEffect(() => {
    localStorage.setItem('finlux_pm_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('finlux_pm_merchantConfigs', JSON.stringify(merchantConfigs));
  }, [merchantConfigs]);

  // Account specific high-fidelity payments and transaction ledger storage
  const [accountTransactions, setAccountTransactions] = useState<any[]>(() => {
    const saved = localStorage.getItem('finlux_account_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      // Khalid Ahmed (LD-882193) base transactions under method Local Depositor
      {
        id: 'TXN-LD-101',
        accountId: 'acc-ld-1',
        type: 'Deposit',
        amount: 5400,
        status: 'Approved',
        photo: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=350',
        timestamp: '2026-06-12 10:15',
        declineReason: ''
      },
      {
        id: 'TXN-LD-102',
        accountId: 'acc-ld-1',
        type: 'Payout',
        amount: 2500,
        status: 'In Progress',
        photo: '',
        timestamp: '2026-06-12 11:30',
        declineReason: ''
      },
      {
        id: 'TXN-LD-103',
        accountId: 'acc-ld-1',
        type: 'Deposit',
        amount: 8000,
        status: 'Declined',
        photo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=350',
        timestamp: '2026-06-12 12:05',
        declineReason: 'Insufficient Funds'
      },
      // Yasmine Mansour (LD-884022) transactions
      {
        id: 'TXN-LD-201',
        accountId: 'acc-ld-2',
        type: 'Deposit',
        amount: 15400,
        status: 'In Progress',
        photo: '',
        timestamp: '2026-06-12 09:20',
        declineReason: ''
      },
      {
        id: 'TXN-LD-202',
        accountId: 'acc-ld-2',
        type: 'Payout',
        amount: 5000,
        status: 'Declined',
        photo: '',
        timestamp: '2026-06-12 11:10',
        declineReason: 'Invalid Recipient Details'
      },
      // Omar Mahmoud (LD-911245) transactions
      {
        id: 'TXN-LD-301',
        accountId: 'acc-ld-3',
        type: 'Deposit',
        amount: 12000,
        status: 'Approved',
        photo: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&q=80&w=350',
        timestamp: '2026-06-12 08:30',
        declineReason: ''
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('finlux_account_transactions', JSON.stringify(accountTransactions));
  }, [accountTransactions]);

  // Account Ledger Modal Control States
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [selectedLedgerAccount, setSelectedLedgerAccount] = useState<any>(null);

  // New Transaction Creation form states
  const [newTxType, setNewTxType] = useState<'Deposit' | 'Payout'>('Deposit');
  const [newTxAmount, setNewTxAmount] = useState('');
  const [newTxStatus, setNewTxStatus] = useState<'Pending' | 'In Progress' | 'Approved' | 'Declined'>('Pending');
  const [newTxDeclineReason, setNewTxDeclineReason] = useState('Insufficient Funds');
  const [newTxPhoto, setNewTxPhoto] = useState('');
  const [lightboxPhoto, setLightboxPhoto] = useState('');

  // Decline Reasons databases as requested
  const depositDeclineReasons = [
    'Insufficient Funds',
    'Invalid Payment Method',
    'Suspected Fraud',
    'Compliance Issue',
    'Technical Error',
    'Account Closed or Frozen',
    'Payment Method Expired'
  ];

  const payoutDeclineReasons = [
    'Invalid Recipient Details',
    'Insufficient Balance',
    'Compliance Violation',
    'Suspicious Activity',
    'Account Not Verified',
    'Transaction Limit Exceeded',
    'System Error',
    'Bank Rejection'
  ];

  // Available MENA countries list
  const menaCountries = [
    { code: 'EG', name: 'Egypt (EG)' },
    { code: 'KSA', name: 'Saudi Arabia (KSA)' },
    { code: 'UAE', name: 'United Arab Emirates (UAE)' },
    { code: 'KW', name: 'Kuwait (KW)' },
    { code: 'BH', name: 'Bahrain (BH)' },
    { code: 'OM', name: 'Oman (OM)' },
    { code: 'JO', name: 'Jordan (JO)' }
  ];

  // --- MODALS / OPENS ---
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [showAddPool, setShowAddPool] = useState(false);
  const [showAddMerchantConfig, setShowAddMerchantConfig] = useState(false);

  // --- POOL EDIT/CRUD STATES ---
  const [showEditPool, setShowEditPool] = useState(false);
  const [editPoolId, setEditPoolId] = useState<string | null>(null);
  const [editPoolName, setEditPoolName] = useState('');
  const [editPoolDesc, setEditPoolDesc] = useState('');
  const [editPoolStatus, setEditPoolStatus] = useState('Active');

  // --- ACCOUNT EDIT/CRUD STATES ---
  const [showEditAccount, setShowEditAccount] = useState(false);
  const [editAccountId, setEditAccountId] = useState<string | null>(null);
  const [editAccLabel, setEditAccLabel] = useState('');
  const [editAccIdent, setEditAccIdent] = useState('');
  const [editAccMethodId, setEditAccMethodId] = useState('method-1');
  const [editAccPool, setEditAccPool] = useState('High-Priority Ingress Pool');
  const [editAccLimit, setEditAccLimit] = useState(50000);
  const [editAccStatus, setEditAccStatus] = useState('Active');

  // --- FORM STATES ---
  // Method Form
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodCountry, setNewMethodCountry] = useState('Egypt (EG)');
  const [newMethodType, setNewMethodType] = useState('Pay-In');
  const [newMethodEmoji, setNewMethodEmoji] = useState('📱');
  const [uploadedLogo, setUploadedLogo] = useState('');

  // Account Form
  const [newAccLabel, setNewAccLabel] = useState('');
  const [newAccIdent, setNewAccIdent] = useState('');
  const [newAccMethodId, setNewAccMethodId] = useState('method-1');
  const [newAccPool, setNewAccPool] = useState('High-Priority Ingress Pool');
  const [newAccLimit, setNewAccLimit] = useState(50000);

  // Pool Form
  const [newPoolName, setNewPoolName] = useState('');
  const [newPoolDesc, setNewPoolDesc] = useState('');

  // Merchant connection Form
  const [newMergName, setNewMergName] = useState('Luxury Goods Co.');
  const [newMergMethod, setNewMergMethod] = useState('method-1');
  const [newMergPool, setNewMergPool] = useState('pool-1');
  const [newMergPercent, setNewMergPercent] = useState('1.5');
  const [newMergFixed, setNewMergFixed] = useState('2.5');
  const [newMergDirection, setNewMergDirection] = useState('Pay-In');

  // --- LOGO FILE READER UPLOADER ---
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(t("File exceeds 5MB size limit."));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedLogo(reader.result as string);
        alert(t("Logo uploaded custom base64 successfully!"));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- SUBMISSIONS ---
  const submitMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodName.trim()) {
      alert(t("Please enter method name."));
      return;
    }
    const id = 'method-' + Date.now();
    const created = {
      id,
      name: newMethodName,
      region: newMethodCountry,
      logoEmoji: newMethodEmoji,
      type: newMethodType,
      enabled: true,
      logoUrl: uploadedLogo
    };
    setMethods([...methods, created]);
    setShowAddMethod(false);
    // Reset Form
    setNewMethodName('');
    setUploadedLogo('');
    alert(t("Successfully added MENA Payment Method!"));
  };

  const submitAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccLabel.trim() || !newAccIdent.trim()) {
      alert(t("Please fill in label and wallet handle."));
      return;
    }
    const id = 'acc-' + Date.now();
    const created = {
      id,
      methodId: newAccMethodId,
      label: newAccLabel,
      identifier: newAccIdent,
      pool: newAccPool,
      used: 0,
      limit: Number(newAccLimit) || 30000,
      status: 'Active'
    };
    setAccounts([...accounts, created]);
    setShowAddAccount(false);
    setNewAccLabel('');
    setNewAccIdent('');
    alert(t("Successfully linked Account to Method and connected to Pool!"));
  };

  const submitPool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoolName.trim()) return;
    const id = 'pool-' + Date.now();
    setPools([...pools, { id, name: newPoolName, description: newPoolDesc, enabled: true, status: 'Active' }]);
    setShowAddPool(false);
    setNewPoolName('');
    setNewPoolDesc('');
    alert(t("A new Accounts Pool deployed!"));
  };

  // --- CRUD & TOGGLE OPERATIONS FOR POOLS ---
  const togglePoolStatus = (id: string) => {
    setPools(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStatus = p.status === 'Active' ? 'Inactive' : 'Active';
          return { ...p, status: nextStatus, enabled: nextStatus === 'Active' };
        }
        return p;
      })
    );
  };

  const startEditPool = (pool: any) => {
    setEditPoolId(pool.id);
    setEditPoolName(pool.name);
    setEditPoolDesc(pool.description);
    setEditPoolStatus(pool.status || 'Active');
    setShowEditPool(true);
  };

  const saveEditPool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPoolName.trim()) return;

    // Shift linked accounts if pool's name is being renamed
    const target = pools.find(p => p.id === editPoolId);
    if (target && target.name !== editPoolName) {
      setAccounts(prev => 
        prev.map(a => a.pool === target.name ? { ...a, pool: editPoolName } : a)
      );
    }

    setPools(prev =>
      prev.map(p => p.id === editPoolId ? { 
        ...p, 
        name: editPoolName, 
        description: editPoolDesc, 
        status: editPoolStatus, 
        enabled: editPoolStatus === 'Active' 
      } : p)
    );
    setShowEditPool(false);
    setEditPoolId(null);
    alert(t("Pool updated successfully!"));
  };

  const deletePool = (id: string, name: string) => {
    if (window.confirm(t("Are you sure you want to delete this pool? All linked accounts will be unassigned."))) {
      setPools(prev => prev.filter(p => p.id !== id));
      setAccounts(prev => prev.map(a => a.pool === name ? { ...a, pool: 'Unassigned' } : a));
      alert(t("Pool removed."));
    }
  };

  // --- CRUD & TOGGLE OPERATIONS FOR ACCOUNTS ---
  const toggleAccountStatus = (id: string) => {
    setAccounts(prev =>
      prev.map(a => {
        if (a.id === id) {
          const nextStatus = a.status === 'Active' ? 'Inactive' : 'Active';
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const startEditAccount = (acc: any) => {
    setEditAccountId(acc.id);
    setEditAccLabel(acc.label);
    setEditAccIdent(acc.identifier);
    setEditAccMethodId(acc.methodId || 'method-1');
    setEditAccPool(acc.pool || 'Unassigned');
    setEditAccLimit(acc.limit || 50000);
    setEditAccStatus(acc.status || 'Active');
    setShowEditAccount(true);
  };

  const saveEditAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAccLabel.trim() || !editAccIdent.trim()) return;

    setAccounts(prev =>
      prev.map(a => a.id === editAccountId ? { 
        ...a, 
        label: editAccLabel, 
        identifier: editAccIdent, 
        methodId: editAccMethodId, 
        pool: editAccPool, 
        limit: Number(editAccLimit) || 50000, 
        status: editAccStatus 
      } : a)
    );
    setShowEditAccount(false);
    setEditAccountId(null);
    alert(t("Account saved."));
  };

  const assignAccountPool = (accountId: string, poolName: string) => {
    setAccounts(prev =>
      prev.map(a => a.id === accountId ? { ...a, pool: poolName } : a)
    );
    alert(t("Account pool assignment has been successfully updated!"));
  };

  const deleteAccount = (id: string) => {
    if (window.confirm(t("Are you sure you want to unlink and delete this endpoint account?"))) {
      setAccounts(prev => prev.filter(a => a.id !== id));
      alert(t("Account deleted."));
    }
  };

  const submitMerchantConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const id = 'fee-' + Date.now();
    const created = {
      id,
      merchantName: newMergName,
      methodId: newMergMethod,
      poolId: newMergPool,
      feePercent: parseFloat(newMergPercent) || 0,
      feeFixed: parseFloat(newMergFixed) || 0,
      direction: newMergDirection
    };
    setMerchantConfigs([...merchantConfigs, created]);
    setShowAddMerchantConfig(false);
    alert(t("Created customized Merchant Fee configuration for this Pool!"));
  };

  // Toggle active methods
  const toggleMethodEnabled = (id: string) => {
    setMethods(prev => 
      prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m)
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">{t("Payment Infrastructure Manager")}</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            {t("Configure MENA local wallets, bind account addresses to pools, and map different merchant processing fees.")}
          </p>
        </div>

        {/* Action button grouping based on current tab */}
        <div className="flex gap-2">
          {currentTab === 'methods' && (
            <button 
              onClick={() => setShowAddMethod(true)}
              className="flex items-center gap-1.5 bg-primary hover:bg-[#002f9e] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow active:scale-95 text-xs"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              {t("Add MENA Method")}
            </button>
          )}

          {currentTab === 'pools' && (
            <>
              <button 
                onClick={() => setShowAddPool(true)}
                className="flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant/60 text-on-surface px-4 py-2.5 rounded-xl font-bold transition-all text-xs"
              >
                <PlusCircle className="w-4.5 h-4.5 text-primary" />
                {t("Add Pool")}
              </button>
              <button 
                onClick={() => setShowAddAccount(true)}
                className="flex items-center gap-1.5 bg-primary hover:bg-[#002f9e] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow active:scale-95 text-xs"
              >
                <PlusCircle className="w-4.5 h-4.5" />
                {t("Add Account")}
              </button>
            </>
          )}

          {currentTab === 'routing' && (
            <button 
              onClick={() => setShowAddMerchantConfig(true)}
              className="flex items-center gap-1.5 bg-primary hover:bg-[#002f9e] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow active:scale-95 text-xs"
            >
              <PlusCircle className="w-4.5 h-4.5" />
              {t("Link Merchant Fee")}
            </button>
          )}
        </div>
      </div>

      {/* Tabs Control Row */}
      <div className="border-b border-outline-variant/40 flex justify-between items-center">
        <div className="flex gap-6">
          <button 
            onClick={() => setCurrentTab('methods')}
            className={`pb-4 text-xs font-black uppercase tracking-wider relative transition-all ${
              currentTab === 'methods' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t("MENA Payment Channels")}
            {currentTab === 'methods' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>

          <button 
            onClick={() => setCurrentTab('pools')}
            className={`pb-4 text-xs font-black uppercase tracking-wider relative transition-all ${
              currentTab === 'pools' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t("Treasury Pools & Accounts Console")}
            {currentTab === 'pools' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          
          <button 
            onClick={() => setCurrentTab('routing')}
            className={`pb-4 text-xs font-black uppercase tracking-wider relative transition-all ${
              currentTab === 'routing' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {t("Merchant Fee Maps")}
            {currentTab === 'routing' && (
              <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        <span className="text-[10px] bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider mb-2">
          {t("System Online")}
        </span>
      </div>

      {/* --- TAB 1 CONTENT: METHODS & ACCOUNTS & POOLS --- */}
      {currentTab === 'methods' && (
        <div className="space-y-8">
          
          {/* Active MENA Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {methods.map((method) => {
              const connectedAccounts = accounts.filter(a => a.methodId === method.id);
              
              return (
                <div key={method.id} className="glass-card rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {/* iOS Switch */}
                    <div 
                      onClick={() => toggleMethodEnabled(method.id)}
                      className={`ios-toggle-container ${method.enabled ? 'bg-emerald-500' : 'bg-outline-variant/60'}`}
                    >
                      <span className={`ios-toggle-dot ${method.enabled ? 'translate-x-5' : 'translate-x-[2px]'}`} />
                    </div>
                  </div>

                   <div className="flex items-center gap-4 mb-4">
                    {/* Custom Logo Display (Real uploaded image vs default fallback) */}
                    <div className="relative group/logo w-12 h-12">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow border border-outline-variant/30 overflow-hidden bg-background">
                        {method.logoUrl ? (
                          <img src={method.logoUrl} alt={method.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{method.logoEmoji}</span>
                        )}
                      </div>
                      <label className="absolute -bottom-1 -right-1 bg-white border border-outline shadow p-1 rounded-md cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs">
                        <Upload className="w-2.5 h-2.5 text-on-surface-variant" />
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                const base64 = reader.result as string;
                                setMethods(prev => prev.map(m => m.id === method.id ? { ...m, logoUrl: base64 } : m));
                                alert(t("Method logo updated successfully!"));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden" 
                        />
                      </label>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">{method.name}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Globe className="w-3 h-3 text-on-surface-variant" />
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase">{method.region}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 border-t border-b border-outline-variant/20 py-3">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-on-surface-variant">{t("Integration Route:")}</span>
                      <span className={`font-bold ${method.type === 'Pay-In' ? 'text-primary' : 'text-amber-600'}`}>{method.type}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-on-surface-variant">{t("Linked Accounts:")}</span>
                      <span className="text-on-surface">{connectedAccounts.length}</span>
                    </div>
                  </div>

                  {connectedAccounts.length > 0 ? (
                    <div className="space-y-2 mb-4">
                      {connectedAccounts.slice(0, 2).map(acc => (
                        <div key={acc.id} className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1 text-[11px] font-semibold">
                          <div className="flex justify-between">
                            <span className="text-on-surface">{acc.label}</span>
                            <span className="text-primary">{acc.identifier}</span>
                          </div>
                          <div className="flex justify-between text-[10px] text-outline">
                            <span>{t("Connected Pool:")}</span>
                            <span className="text-on-surface-variant truncate max-w-[140px]">{acc.pool}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-xs text-outline py-4">{t("No active accounts connected to pools")}</p>
                  )}

                  <button 
                    onClick={() => {
                      setNewAccMethodId(method.id);
                      setShowAddAccount(true);
                    }}
                    className="w-full py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary rounded-xl font-bold text-xs transition-colors"
                  >
                    + {t("Add Account")}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Connected Pools Workspace Section */}
          <div className="glass-card rounded-2xl border border-outline-variant/30 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/30 bg-surface-container-lowest flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base text-on-surface">{t("System Treasury Account Pools")}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{t("Aggregation pools containing multiple transactional provider endpoints.")}</p>
              </div>
              <button 
                onClick={() => setShowAddPool(true)}
                className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary/15 transition-colors"
              >
                <PlusCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-outline-variant/20 text-xs">
              {pools.map(pool => {
                const pooledAccounts = accounts.filter(a => a.pool === pool.name);
                return (
                  <div key={pool.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-surface-container-low/20 transition-colors">
                    <div className="space-y-1 md:max-w-md">
                      <h4 className="font-bold text-sm text-on-surface">{pool.name}</h4>
                      <p className="text-xs text-on-surface-variant">{pool.description}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[10px] font-bold text-outline uppercase tracking-wider block mr-3">
                        {pooledAccounts.length} {t("Pooled Accounts")}
                      </span>
                      {pooledAccounts.map(acc => (
                        <span key={acc.id} className="px-2.5 py-1 bg-[#1e1b4b] text-[#a78bfa] border border-[#4338ca] rounded-lg text-[10px] font-mono font-bold">
                          {acc.identifier}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 2 CONTENT: TREASURY POOLS & ACCOUNTS MANAGER CONSOLE --- */}
      {currentTab === 'pools' && (
        <div className="space-y-8">
          
          {/* Pools Workspace Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-on-surface">{t("Custom Account Pools")}</h3>
                <p className="text-xs text-on-surface-variant">{t("Manage local disbursement & collection pools, change dynamic routing states.")}</p>
              </div>
              <button 
                onClick={() => setShowAddPool(true)}
                className="flex items-center gap-1 bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#002f9e] transition-colors"
              >
                + {t("Create New Pool")}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pools.map(pool => {
                const pooledAccounts = accounts.filter(a => a.pool === pool.name);
                const unassignedAccounts = accounts.filter(a => a.pool !== pool.name);

                return (
                  <div key={pool.id} className="glass-card rounded-2xl p-6 border border-outline-variant/30 bg-surface-container-lowest flex flex-col relative overflow-hidden">
                    {/* Top actions/status */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-on-surface">{pool.name}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pool.status === 'Active' ? 'bg-emerald-500/10 text-emerald-800' : 'bg-rose-500/10 text-rose-800'}`}>
                            {pool.status === 'Active' ? t("Active") : t("Inactive")}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1">{pool.description}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Edit Button */}
                        <button 
                          onClick={() => startEditPool(pool)}
                          className="p-1.5 hover:bg-surface-container-low text-on-surface-variant hover:text-primary rounded-lg transition-colors border border-outline-variant/20"
                          title={t("Edit Pool")}
                        >
                          <Sliders className="w-4 h-4" />
                        </button>

                        {/* Power/Toggle Button */}
                        <button 
                          onClick={() => togglePoolStatus(pool.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${pool.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-700 hover:bg-emerald-500/20' : 'bg-rose-500/10 border-rose-500/25 text-rose-700 hover:bg-rose-500/20'}`}
                          title={pool.status === 'Active' ? t("Deactivate Pool") : t("Activate Pool")}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button 
                          onClick={() => deletePool(pool.id, pool.name)}
                          className="p-1.5 hover:bg-rose-500/10 hover:text-rose-600 rounded-lg transition-colors border border-rose-500/20 text-rose-500"
                          title={t("Delete Pool")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Inside Accounts Header */}
                    <div className="mt-4 pt-4 border-t border-outline-variant/20 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[11px] font-black uppercase text-on-surface-variant tracking-wider">
                            {t("Pooled Accounts")} ({pooledAccounts.length})
                          </span>
                        </div>

                        {pooledAccounts.length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto mb-4 pr-1">
                            {pooledAccounts.map(acc => {
                              const method = methods.find(m => m.id === acc.methodId);
                              return (
                                <div key={acc.id} className="p-2.5 rounded-xl bg-surface border border-outline-variant/30 flex items-center justify-between text-xs font-semibold">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">{method?.logoEmoji || '📱'}</span>
                                    <div>
                                      <p className="text-on-surface text-[11px] font-bold line-clamp-1">{acc.label}</p>
                                      <p className="text-primary font-mono text-[10px]">{acc.identifier}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${acc.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                                      {acc.status}
                                    </span>
                                    <button 
                                      onClick={() => assignAccountPool(acc.id, 'Unassigned')}
                                      className="text-[10px] font-extrabold text-rose-600 hover:text-rose-800 hover:underline px-1.5 py-1"
                                    >
                                      {t("Unassign")}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-6 text-center border border-dashed border-outline-variant/30 rounded-xl mb-4 bg-surface-container-low/20">
                            <p className="text-xs text-outline font-semibold mb-0.5">{t("No accounts assigned")}</p>
                            <p className="text-[10px] text-on-surface-variant">{t("Select an account below to assign it to this pool")}</p>
                          </div>
                        )}
                      </div>

                      {/* Quick Assign Account Form Input */}
                      {unassignedAccounts.length > 0 ? (
                        <div className="bg-surface p-2.5 rounded-xl border border-outline-variant/40 mt-auto">
                          <label className="text-[10px] font-bold uppercase text-outline block mb-1">{t("Assign Account to this Pool")}</label>
                          <div className="flex gap-2">
                            <select 
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  assignAccountPool(e.target.value, pool.name);
                                  e.target.value = ""; // clear selection
                                }
                              }}
                              className="flex-1 text-[11px] p-1.5 bg-background border border-outline-variant rounded-lg font-semibold text-on-surface"
                            >
                              <option value="" disabled>{t("Choose account to assign...")}</option>
                              {unassignedAccounts.map(acc => (
                                <option key={acc.id} value={acc.id}>
                                  {acc.label} ({acc.identifier}) {acc.pool !== 'Unassigned' && acc.pool !== 'None' ? `[Moves from ${acc.pool}]` : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Accounts Operational Ledger */}
          <div className="glass-card rounded-2xl border border-outline-variant/30 overflow-hidden bg-white mt-12">
            <div className="p-6 border-b border-outline-variant/20 bg-surface-container-lowest flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-on-surface">{t("Operational Accounts Manager")}</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">{t("Add, modify, assign pools or toggle active status of local wallet and bank accounts.")}</p>
              </div>
              <button 
                onClick={() => setShowAddAccount(true)}
                className="flex items-center gap-1 bg-primary hover:bg-[#002f9e] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all"
              >
                + {t("Add New Account")}
              </button>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f8fafc] text-on-surface-variant font-bold uppercase text-[10px] tracking-widest border-b border-outline-variant/30">
                  <tr>
                    <th className="px-6 py-4">{t("Account details")}</th>
                    <th className="px-6 py-4">{t("Integration Channel")}</th>
                    <th className="px-6 py-4">{t("Assigned Treasury Pool")}</th>
                    <th className="px-6 py-4">{t("Daily Limit Cap")}</th>
                    <th className="px-6 py-4">{t("Account Status")}</th>
                    <th className="px-6 py-4 text-right">{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {accounts.map(acc => {
                    const method = methods.find(m => m.id === acc.methodId);
                    return (
                      <tr key={acc.id} className="hover:bg-surface-container-low/20 transition-all font-semibold">
                        {/* Account details */}
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-3">
                            <div className="relative group/acc">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 border border-outline-variant/60 flex items-center justify-center text-xs font-bold overflow-hidden shadow-sm">
                                {acc.logoUrl ? (
                                  <img src={acc.logoUrl} alt="account logo" className="w-full h-full object-cover" />
                                ) : (
                                  <span>{acc.label?.[0] || 'A'}</span>
                                )}
                              </div>
                              <label className="absolute -bottom-1 -right-1 bg-white border border-outline-variant rounded p-0.5 cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs">
                                <Upload className="w-2.5 h-2.5 text-on-surface-variant" />
                                <input 
                                  type="file" 
                                  accept="image/*" 
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        const base64 = reader.result as string;
                                        setAccounts(prev => prev.map(item => 
                                          item.id === acc.id ? { ...item, logoUrl: base64 } : item
                                        ));
                                        alert(t("Account brand logo uploaded successfully!"));
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }} 
                                  className="hidden" 
                                />
                              </label>
                            </div>

                            <div>
                              <p className="font-bold text-on-surface text-xs">{acc.label}</p>
                              <p className="text-primary font-mono text-[11px] mt-0.5">{acc.identifier}</p>
                            </div>
                          </div>
                        </td>

                        {/* Integration Channel */}
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{method?.logoEmoji || '📱'}</span>
                            <span className="text-on-surface font-semibold text-xs">{method?.name || t("Unknown channel")}</span>
                          </div>
                        </td>

                        {/* Assigned Treasury Pool */}
                        <td className="px-6 py-4.5">
                          <select 
                            value={acc.pool || 'Unassigned'}
                            onChange={(e) => assignAccountPool(acc.id, e.target.value)}
                            className="bg-surface-container-low border border-outline-variant/30 text-xs rounded-lg p-1.5 focus:ring-1 focus:ring-primary outline-none font-semibold text-on-surface"
                          >
                            <option value="Unassigned">{t("Unassigned / None")}</option>
                            {pools.map(p => (
                              <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                        </td>

                        {/* Limit */}
                        <td className="px-6 py-4.5">
                          <span className="font-mono text-on-surface">EGP {acc.limit.toLocaleString()}</span>
                        </td>

                        {/* Status (Switch) */}
                        <td className="px-6 py-4.5">
                          <div className="flex items-center gap-2">
                            <div 
                              onClick={() => toggleAccountStatus(acc.id)}
                              className={`ios-toggle-container ${acc.status === 'Active' ? 'bg-emerald-500' : 'bg-outline-variant/60'}`}
                            >
                              <span className={`ios-toggle-dot ${acc.status === 'Active' ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                            </div>
                            <span className={`text-[10px] font-bold ${acc.status === 'Active' ? 'text-emerald-700' : 'text-outline'}`}>
                              {acc.status}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4.5 text-right space-x-2 rtl:space-x-reverse whitespace-nowrap">
                          <button 
                            onClick={() => {
                              setSelectedLedgerAccount(acc);
                              setNewTxType('Deposit');
                              setNewTxAmount('');
                              setNewTxStatus('Pending');
                              setNewTxDeclineReason('Insufficient Funds');
                              setNewTxPhoto('');
                              setShowLedgerModal(true);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] bg-[#0f172a] text-[#f8fafc] hover:bg-slate-800 px-2.5 py-1.5 rounded-lg transition-all font-bold uppercase tracking-wider shadow-xs"
                          >
                            <span>📂 {t("Ledger & TXNs")}</span>
                          </button>
                          <button 
                            onClick={() => startEditAccount(acc)}
                            className="inline-flex items-center text-[11px] text-primary hover:bg-primary/10 border border-primary/20 px-2.5 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider"
                          >
                            {t("Edit")}
                          </button>
                          <button 
                            onClick={() => deleteAccount(acc.id)}
                            className="inline-flex items-center text-[11px] text-rose-500 hover:bg-rose-50 border border-rose-200 px-2.5 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-wider"
                          >
                            {t("Delete")}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* --- TAB 3 CONTENT: MERCHANT FEE & POOL CONNECTIONS --- */}
      {currentTab === 'routing' && (
        <div className="space-y-6">
          
          {/* Informational Hero Card */}
          <div className="bg-primary/10 border border-primary/20 p-5 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-bold text-primary">{t("Active Pool Router & Fees Matrix")}</p>
                <p className="text-xs text-on-surface-variant">{t("Connected merchants leverage designated accounts pooling structures to enforce strict dynamic fee rules.")}</p>
              </div>
            </div>
          </div>

          {/* Unified Router Matrix Table */}
          <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-surface-container-low text-on-surface-variant font-bold uppercase text-[10px] tracking-widest border-b border-outline-variant/30">
                  <tr>
                    <th className="px-6 py-4">{t("Merchant Partner")}</th>
                    <th className="px-6 py-4">{t("Assigned Payment Channel")}</th>
                    <th className="px-6 py-4">{t("Account Binding Pool")}</th>
                    <th className="px-6 py-4">{t("Process Direction")}</th>
                    <th className="px-6 py-4">{t("Configured Pool Fees")}</th>
                    <th className="px-6 py-4 text-right">{t("Router Audit")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30 font-medium text-xs">
                  {merchantConfigs.map((config) => {
                    const method = methods.find(m => m.id === config.methodId);
                    
                    return (
                      <tr key={config.id} className="hover:bg-surface-container-low/20 transition-all">
                        <td className="px-6 py-5">
                          <p className="font-extrabold text-on-surface">{config.merchantName}</p>
                          <span className="text-[9px] text-[#006c49] font-bold uppercase bg-[#6cf8bb]/15 border border-[#6cf8bb]/30 px-2 py-0.2 rounded mt-1 inline-block">
                            {t("Verified Client")}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <span>{method ? (method.logoUrl ? <img src={method.logoUrl} className="w-6 h-6 object-cover rounded" /> : method.logoEmoji) : '📱'}</span>
                            <span className="font-bold text-on-surface">{method ? method.name : 'Unknown'}</span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span className="px-2.5 py-1 bg-white text-primary border border-white rounded-lg text-[10px] font-bold font-mono">
                            {config.poolId ? (pools.find(p => p.id === config.poolId)?.name || config.poolId) : 'Main Ingress Pool'}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-flex items-center gap-1.5 ${
                            config.direction === 'Pay-In' ? 'bg-[#dfe3ff] text-[#001452]' : 'bg-amber-100 text-amber-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.direction === 'Pay-In' ? 'bg-primary' : 'bg-amber-500'}`} />
                            {config.direction}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-mono text-primary font-bold">{config.feePercent}% + EGP {config.feeFixed}</p>
                        </td>

                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => {
                              const proceed = window.confirm(t("Audit/Update routing rule details for this merchant pool ratio?"));
                              if (proceed) {
                                alert(t("Audit verification logs stored. State active."));
                              }
                            }}
                            className="bg-primary hover:bg-[#002f9e] text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-sm"
                          >
                            {t("Audit Mode")}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* --- DIALOG MODALS --- */}

      {/* 1. Add MENA Method Modal */}
      <AnimatePresence>
        {showAddMethod && (
          <div className="fixed inset-0 z-50 bg-[#0c0c1b]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-outline-variant text-left rtl:text-right"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-on-surface">{t("Link New MENA Payment Method")}</h3>
                <button onClick={() => setShowAddMethod(false)} className="text-on-surface-variant hover:text-on-surface text-sm">✕</button>
              </div>

              <form onSubmit={submitMethod} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Method Title Name")}</label>
                  <input 
                    type="text" 
                    value={newMethodName}
                    onChange={(e) => setNewMethodName(e.target.value)}
                    placeholder="e.g. Fawry Pay, BenefitPay"
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Country Region")}</label>
                    <select 
                      value={newMethodCountry}
                      onChange={(e) => setNewMethodCountry(e.target.value)}
                      className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    >
                      {menaCountries.map(c => (
                        <option key={c.code} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Interface Direction")}</label>
                    <select 
                      value={newMethodType}
                      onChange={(e) => setNewMethodType(e.target.value)}
                      className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="Pay-In">Pay-In [Deposit]</option>
                      <option value="Pay-Out">Pay-Out [Disbursement]</option>
                    </select>
                  </div>
                </div>

                {/* Emoji Indicator Option */}
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Fallback Representation Emoji")}</label>
                  <div className="flex gap-2">
                    {['📱', '🏦', '⚡', '💳', '🪙', '💼', '💰'].map(em => (
                      <button 
                        key={em}
                        type="button"
                        onClick={() => setNewMethodEmoji(em)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg border transition-all ${newMethodEmoji === em ? 'bg-primary/20 border-primary' : 'bg-surface border-outline-variant'}`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>

                {/* LOGO FILE UPLOAD INPUT */}
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Brand Payment Logo")}</label>
                  <div className="border border-dashed border-outline-variant/60 rounded-xl p-4 bg-surface-container-lowest flex flex-col items-center justify-center text-center">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload}
                      className="hidden" 
                      id="method-logo-upload" 
                    />
                    <label htmlFor="method-logo-upload" className="cursor-pointer flex flex-col items-center justify-center">
                      <Upload className="w-6 h-6 text-primary mb-1" />
                      <span className="text-[11px] text-on-surface-variant font-bold">{t("Click to upload brand SVG/PNG")}</span>
                      <span className="text-[9px] text-outline mt-0.5">{t("Max Size 5MB")}</span>
                    </label>

                    {uploadedLogo && (
                      <div className="mt-2 flex items-center gap-2">
                        <img src={uploadedLogo} alt="Logo preview" className="w-10 h-10 object-contain border rounded p-1 bg-white" />
                        <span className="text-[9px] text-emerald-600 font-extrabold">{t("Ready")}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddMethod(false)}
                    className="flex-1 py-2.5 border border-outline-variant rounded-xl font-bold text-xs"
                  >
                    {t("Cancel")}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-primary hover:bg-[#002f9e] text-white rounded-xl font-bold text-xs transition-transform active:scale-95"
                  >
                    {t("Create Method")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Add Account Modal */}
      <AnimatePresence>
        {showAddAccount && (
          <div className="fixed inset-0 z-50 bg-[#0c0c1b]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-outline-variant text-left ltr:text-left rtl:text-right"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-on-surface">{t("Link Operational Account Endpoint")}</h3>
                <button onClick={() => setShowAddAccount(false)} className="text-on-surface-variant hover:text-on-surface text-sm">✕</button>
              </div>

              <form onSubmit={submitAccount} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Method Payment Association")}</label>
                  <select 
                    value={newAccMethodId}
                    onChange={(e) => setNewAccMethodId(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  >
                    {methods.map(m => (
                      <option key={m.id} value={m.id}>{m.name} [{m.region}]</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Account Label Reference")}</label>
                  <input 
                    type="text" 
                    value={newAccLabel}
                    onChange={(e) => setNewAccLabel(e.target.value)}
                    placeholder="e.g. CIB Cash settlement 02"
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Account Number / Wallet Handle Identifier")}</label>
                  <input 
                    type="text" 
                    value={newAccIdent}
                    onChange={(e) => setNewAccIdent(e.target.value)}
                    placeholder="e.g. 010123456 or swift handle"
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Bound Accounts Pooling Location")}</label>
                  <select 
                    value={newAccPool}
                    onChange={(e) => setNewAccPool(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  >
                    {pools.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Threshold Daily Limitation (EGP)")}</label>
                  <input 
                    type="number" 
                    value={newAccLimit}
                    onChange={(e) => setNewAccLimit(Number(e.target.value))}
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddAccount(false)}
                    className="flex-1 py-2.5 border border-outline-variant rounded-xl font-bold text-xs"
                  >
                    {t("Cancel")}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-primary hover:bg-[#002f9e] text-white rounded-xl font-bold text-xs"
                  >
                    {t("Link Account")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Add Custom Pool Modal */}
      <AnimatePresence>
        {showAddPool && (
          <div className="fixed inset-0 z-50 bg-[#0c0c1b]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-outline-variant text-left rtl:text-right"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-on-surface">{t("Deploy Custom Account Pool")}</h3>
                <button onClick={() => setShowAddPool(false)} className="text-on-surface-variant hover:text-on-surface text-sm">✕</button>
              </div>

              <form onSubmit={submitPool} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Pool Name Title")}</label>
                  <input 
                    type="text" 
                    value={newPoolName}
                    onChange={(e) => setNewPoolName(e.target.value)}
                    placeholder="e.g. Egypt Retail Collection Pool"
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Context Description")}</label>
                  <textarea 
                    value={newPoolDesc}
                    onChange={(e) => setNewPoolDesc(e.target.value)}
                    placeholder="Provide operational rules context here..."
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none h-20 resize-none animate-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddPool(false)}
                    className="flex-1 py-2.5 border border-outline-variant rounded-xl font-bold text-xs"
                  >
                    {t("Cancel")}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-primary hover:bg-[#002f9e] text-white rounded-xl font-bold text-xs"
                  >
                    {t("Deploy Pool")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Add Merchant Config Modal */}
      <AnimatePresence>
        {showAddMerchantConfig && (
          <div className="fixed inset-0 z-50 bg-[#0c0c1b]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-outline-variant text-left rtl:text-right"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-on-surface">{t("Link Merchant Fee Router Configuration")}</h3>
                <button onClick={() => setShowAddMerchantConfig(false)} className="text-on-surface-variant hover:text-on-surface text-sm">✕</button>
              </div>

              <form onSubmit={submitMerchantConfig} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Merchant Partner Entity")}</label>
                  <select 
                    value={newMergName}
                    onChange={(e) => setNewMergName(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Luxury Goods Co.">Luxury Goods Co.</option>
                    <option value="Apex Global Ltd">Apex Global Ltd</option>
                    <option value="Swift Tech">Swift Tech</option>
                    <option value="Global Retail Group">Global Retail Group</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Payment Channel Method")}</label>
                    <select 
                      value={newMergMethod}
                      onChange={(e) => setNewMergMethod(e.target.value)}
                      className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    >
                      {methods.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Directed Active Pool")}</label>
                    <select 
                      value={newMergPool}
                      onChange={(e) => setNewMergPool(e.target.value)}
                      className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    >
                      {pools.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Fee Percentage (%)")}</label>
                    <input 
                      type="text" 
                      value={newMergPercent}
                      onChange={(e) => setNewMergPercent(e.target.value)}
                      className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Fee Fixed Markup (EGP)")}</label>
                    <input 
                      type="text" 
                      value={newMergFixed}
                      onChange={(e) => setNewMergFixed(e.target.value)}
                      className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Assigned Direction Type")}</label>
                  <select 
                    value={newMergDirection}
                    onChange={(e) => setNewMergDirection(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none font-sans"
                  >
                    <option value="Pay-In">Pay-In [Inbound Deposit]</option>
                    <option value="Pay-Out">Pay-Out [Outbound Division]</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddMerchantConfig(false)}
                    className="flex-1 py-2.5 border border-outline-variant rounded-xl font-bold text-xs"
                  >
                    {t("Cancel")}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-primary hover:bg-[#002f9e] text-white rounded-xl font-bold text-xs"
                  >
                    {t("Create Map")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Edit Custom Pool Modal */}
      <AnimatePresence>
        {showEditPool && (
          <div className="fixed inset-0 z-50 bg-[#0c0c1b]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-outline-variant text-left rtl:text-right"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-on-surface">{t("Edit Treasury Pool Details")}</h3>
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditPool(false);
                    setEditPoolId(null);
                  }} 
                  className="text-on-surface-variant hover:text-on-surface text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={saveEditPool} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Pool Name Title")}</label>
                  <input 
                    type="text" 
                    value={editPoolName}
                    onChange={(e) => setEditPoolName(e.target.value)}
                    placeholder="e.g. VIP Disbursement Pool"
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Context Description")}</label>
                  <textarea 
                    value={editPoolDesc}
                    onChange={(e) => setEditPoolDesc(e.target.value)}
                    placeholder="Provide operational rules context here..."
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none h-20 resize-none animate-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Pool Operational Status")}</label>
                  <select 
                    value={editPoolStatus}
                    onChange={(e) => setEditPoolStatus(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Active">{t("Active [Accepting Transports]")}</option>
                    <option value="Inactive">{t("Inactive [Block Routing]")}</option>
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowEditPool(false);
                      setEditPoolId(null);
                    }}
                    className="flex-1 py-2.5 border border-outline-variant rounded-xl font-bold text-xs"
                  >
                    {t("Cancel")}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-primary hover:bg-[#002f9e] text-white rounded-xl font-bold text-xs"
                  >
                    {t("Save Changes")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Edit Account Modal */}
      <AnimatePresence>
        {showEditAccount && (
          <div className="fixed inset-0 z-50 bg-[#0c0c1b]/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-outline-variant text-left ltr:text-left rtl:text-right"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-extrabold text-on-surface">{t("Edit Account details")}</h3>
                <button 
                  type="button"
                  onClick={() => {
                    setShowEditAccount(false);
                    setEditAccountId(null);
                  }} 
                  className="text-on-surface-variant hover:text-on-surface text-sm"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={saveEditAccount} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Method Payment Association")}</label>
                  <select 
                    value={editAccMethodId}
                    onChange={(e) => setEditAccMethodId(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  >
                    {methods.map(m => (
                      <option key={m.id} value={m.id}>{m.name} [{m.region}]</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Account Label Reference")}</label>
                  <input 
                    type="text" 
                    value={editAccLabel}
                    onChange={(e) => setEditAccLabel(e.target.value)}
                    placeholder="e.g. CIB Cash settlement 02"
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Account Number / Wallet Handle Identifier")}</label>
                  <input 
                    type="text" 
                    value={editAccIdent}
                    onChange={(e) => setEditAccIdent(e.target.value)}
                    placeholder="e.g. 010123456 or swift handle"
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Bound Accounts Pooling Location")}</label>
                  <select 
                    value={editAccPool}
                    onChange={(e) => setEditAccPool(e.target.value)}
                    className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                  >
                    <option value="Unassigned">{t("Unassigned / None")}</option>
                    {pools.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Threshold Limitation (EGP)")}</label>
                    <input 
                      type="number" 
                      value={editAccLimit}
                      onChange={(e) => setEditAccLimit(Number(e.target.value))}
                      className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold tracking-wider text-outline uppercase mb-1.5">{t("Operational Status")}</label>
                    <select 
                      value={editAccStatus}
                      onChange={(e) => setEditAccStatus(e.target.value)}
                      className="w-full p-2.5 bg-surface border border-outline-variant rounded-xl text-xs font-semibold focus:ring-1 focus:ring-primary outline-none"
                    >
                      <option value="Active">{t("Active")}</option>
                      <option value="Inactive">{t("Inactive")}</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowEditAccount(false);
                      setEditAccountId(null);
                    }}
                    className="flex-1 py-2.5 border border-outline-variant rounded-xl font-bold text-xs"
                  >
                    {t("Cancel")}
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-primary hover:bg-[#002f9e] text-white rounded-xl font-bold text-xs"
                  >
                    {t("Save Changes")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. High-Fidelity Account Ledger & Transactions Studio Modal */}
      <AnimatePresence>
        {showLedgerModal && selectedLedgerAccount && (
          <div className="fixed inset-0 z-50 bg-[#0c0c1b]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[32px] max-w-5xl w-full p-8 border border-outline-variant text-left ltr:text-left rtl:text-right shadow-2xl relative my-8"
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => {
                  setShowLedgerModal(false);
                  setSelectedLedgerAccount(null);
                  setNewTxPhoto('');
                }} 
                className="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface text-lg font-bold bg-slate-100 hover:bg-slate-200 p-2 rounded-full w-8 h-8 flex items-center justify-center transition-colors shadow-2xs"
              >
                ✕
              </button>

              <div className="mb-6">
                <span className="px-3.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black uppercase tracking-wider text-primary">
                  {t("Ledger & P2P Settlements Room")}
                </span>
                <h3 className="text-2xl font-black text-on-surface mt-2 flex items-center gap-2">
                  <span>📂 {selectedLedgerAccount.label}</span>
                  <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">ID: {selectedLedgerAccount.identifier}</span>
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 flex items-center gap-1.5">
                  <span className="font-bold">{t("Connected Method")}:</span> 
                  <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-800 font-extrabold text-[11px]">{methods.find((m: any) => m.id === selectedLedgerAccount.methodId)?.name || 'Local Depositor'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-bold">{t("Assigned Pool")}:</span> 
                  <span className="text-primary font-bold">{selectedLedgerAccount.pool || t("Unassigned")}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Create Transaction Form */}
                <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200/60 p-6 rounded-[24px] space-y-4">
                  <h4 className="font-bold text-sm text-[#0c0c1b] tracking-tight border-b pb-2 flex items-center gap-2">
                    <span>⚡ {t("Trigger New Settlement TXN")}</span>
                  </h4>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newTxAmount || isNaN(Number(newTxAmount)) || Number(newTxAmount) <= 0) {
                        alert(t("Please specify a valid EGP amount bounds."));
                        return;
                      }
                      const newTx = {
                        id: 'TXN-LD-' + Math.floor(Math.random() * 900000 + 100000),
                        accountId: selectedLedgerAccount.id,
                        type: newTxType,
                        amount: Number(newTxAmount),
                        status: newTxStatus,
                        photo: newTxPhoto,
                        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
                        declineReason: newTxStatus === 'Declined' ? newTxDeclineReason : ''
                      };
                      setAccountTransactions(prev => [newTx, ...prev]);
                      setNewTxAmount('');
                      setNewTxPhoto('');
                      alert(t("Settlement ledger transaction successfully authorized!"));
                    }} 
                    className="space-y-4 text-xs font-semibold"
                  >
                    {/* Type Choice */}
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        {t("Transaction Type")}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setNewTxType('Deposit');
                            setNewTxDeclineReason(depositDeclineReasons[0]);
                          }}
                          className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${newTxType === 'Deposit' ? 'bg-primary border-primary text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                        >
                          📥 {t("Deposit (Pay-In)")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewTxType('Payout');
                            setNewTxDeclineReason(payoutDeclineReasons[0]);
                          }}
                          className={`py-2 px-3 rounded-xl font-bold border transition-all text-center ${newTxType === 'Payout' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                        >
                          📤 {t("Payout (Pay-Out)")}
                        </button>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        {t("Amount (EGP)")}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-extrabold text-slate-400">EGP</span>
                        <input
                          type="number"
                          value={newTxAmount}
                          onChange={(e) => setNewTxAmount(e.target.value)}
                          placeholder="e.g. 15000"
                          className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl font-bold placeholder-slate-300 outline-none"
                        />
                      </div>
                    </div>

                    {/* Status selection */}
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
                        {t("Execution Status")}
                      </label>
                      <select
                        value={newTxStatus}
                        onChange={(e: any) => setNewTxStatus(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-200 focus:border-primary rounded-xl font-bold outline-none text-xs"
                      >
                        <option value="Pending">{t("Pending")}</option>
                        <option value="In Progress">{t("In Progress")}</option>
                        <option value="Approved">{t("Approved")}</option>
                        <option value="Declined">{t("Declined")}</option>
                      </select>
                    </div>

                    {/* Conditional Decline Reason based on selected status */}
                    <AnimatePresence mode="wait">
                      {newTxStatus === 'Declined' && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-1"
                        >
                          <label className="block text-[10px] font-bold text-[#ba1a1a] uppercase tracking-wider">
                            🚨 {t("Decline Failure Reason")}
                          </label>
                          <select
                            value={newTxDeclineReason}
                            onChange={(e) => setNewTxDeclineReason(e.target.value)}
                            className="w-full p-2.5 bg-white border border-[#ba1a1a]/40 focus:border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a] text-[#93000a] rounded-xl font-bold outline-none text-xs"
                          >
                            {newTxType === 'Deposit' 
                              ? depositDeclineReasons.map(r => <option key={r} value={r}>{r}</option>)
                              : payoutDeclineReasons.map(r => <option key={r} value={r}>{r}</option>)
                            }
                          </select>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Receipt image upload */}
                    <div>
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                        📷 {t("Upload Proof Photo (Receipt)")}
                      </label>
                      
                      {!newTxPhoto ? (
                        <div className="border border-dashed border-slate-300 hover:border-primary rounded-xl p-4 text-center cursor-pointer bg-white transition-all hover:bg-slate-50 relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setNewTxPhoto(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                          <p className="text-[10px] font-bold text-slate-500">{t("Click or Drop receipt image proof")}</p>
                          <p className="text-[9px] text-[#006c49]/80 font-semibold mt-0.5">{t("Highly recommended for rapid compliance loops")}</p>
                        </div>
                      ) : (
                        <div className="border border-slate-200 bg-white p-3 rounded-xl space-y-2 relative">
                          <p className="text-[10px] text-[#006c49] font-bold flex items-center gap-1">
                            <span>✓</span> {t("Receipt upload active")}
                          </p>
                          <div className="relative aspect-video w-full max-h-36 rounded-lg bg-slate-50 border overflow-hidden">
                            <img src={newTxPhoto} alt="Uploaded Proof Photo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <button
                              type="button"
                              onClick={() => setNewTxPhoto('')}
                              className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full text-[10px] hover:bg-red-700 font-bold transition-all w-5 h-5 flex items-center justify-center shrink-0"
                              title="Delete Photo"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#0d593a] hover:bg-[#003823] text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors shadow-md mt-4"
                    >
                      {t("Verify & Commit Transaction")}
                    </button>
                  </form>
                </div>

                {/* Right Side: Ledger Table */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between border-b pb-2 mb-3">
                      <h4 className="font-extrabold text-sm text-[#0c0c1b] tracking-tight">
                        📋 {t("Operational Settled Settlement Ledger")}
                      </h4>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {accountTransactions.filter((tx: any) => tx.accountId === selectedLedgerAccount.id).length} {t("Records Listed")}
                      </span>
                    </div>

                    {/* Interactive table */}
                    <div className="overflow-x-auto border border-slate-100 rounded-2xl bg-white max-h-[380px] overflow-y-auto">
                      <table className="w-full text-left ltr:text-left rtl:text-right border-collapse text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-black uppercase text-[9px] tracking-wider border-b sticky top-0 z-10">
                          <tr>
                            <th className="p-3 pl-4">{t("TXN ID")}</th>
                            <th className="p-3">{t("Type")}</th>
                            <th className="p-3">{t("Amount")}</th>
                            <th className="p-3">{t("Status & Failure Remarks")}</th>
                            <th className="p-3">{t("Date")}</th>
                            <th className="p-3 text-right pr-4">{t("Proof Photo")}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-bold text-slate-700">
                          {accountTransactions.filter((tx: any) => tx.accountId === selectedLedgerAccount.id).length > 0 ? (
                            accountTransactions.filter((tx: any) => tx.accountId === selectedLedgerAccount.id).map((tx: any) => (
                              <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-3 pl-4 font-mono text-[10px] text-slate-800 font-extrabold">{tx.id}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase ${tx.type === 'Deposit' ? 'bg-[#e2f1e8] text-[#07532f]' : 'bg-[#e8eaf6] text-[#283593]'}`}>
                                    {tx.type}
                                  </span>
                                </td>
                                <td className="p-3 font-mono text-primary font-black text-sm">{tx.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold">EGP</span></td>
                                <td className="p-3">
                                  <div className="space-y-1">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                      tx.status === 'Approved' ? 'bg-[#cbf2e2] text-[#003823]' :
                                      tx.status === 'Pending' ? 'bg-[#ffebd1] text-[#7a4b00]' :
                                      tx.status === 'In Progress' ? 'bg-[#dfe3ff] text-[#001452]' :
                                      'bg-[#ffdad6] text-[#ba1a1a]'
                                    }`}>
                                      <span className={`w-1.5 h-1.5 rounded-full ${
                                        tx.status === 'Approved' ? 'bg-secondary animate-pulse' :
                                        tx.status === 'Pending' ? 'bg-orange-500' :
                                        tx.status === 'In Progress' ? 'bg-blue-600 animate-bounce' :
                                        'bg-red-600'
                                      }`} />
                                      {tx.status}
                                    </span>
                                    {tx.status === 'Declined' && (
                                      <p className="text-[10px] text-red-600 font-bold italic block break-words max-w-[150px]">{t("Reason")}: {tx.declineReason}</p>
                                    )}
                                  </div>
                                </td>
                                <td className="p-3 text-[10px] font-semibold text-slate-400 font-mono whitespace-nowrap">{tx.timestamp}</td>
                                <td className="p-3 text-right pr-4">
                                  {tx.photo ? (
                                    <button
                                      type="button"
                                      onClick={() => setLightboxPhoto(tx.photo)}
                                      className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline bg-primary/5 hover:bg-primary/10 px-2 py-1 rounded transition-colors border border-primary/10"
                                    >
                                      <img src={tx.photo} alt="mini" className="w-5 h-5 object-cover rounded shadow-xs border inline-block" referrerPolicy="no-referrer" />
                                      <span>{t("Receipt")}</span>
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic font-medium">{t("No upload")}</span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                                <span className="block text-2xl mb-1">📭</span>
                                {t("No transaction history recorded for this account block.")}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Operational Status Guidelines presentation */}
                  <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl text-[10px] font-semibold text-slate-500 space-y-1.5 leading-relaxed">
                    <p className="font-extrabold uppercase text-[9px] text-[#0c0c1b] tracking-wider mb-1 flex items-center gap-1.5">
                      <span>📖</span> {t("Compliance & Audit Status Playbook Guidelines")}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-[9px]">
                      <div>
                        <strong className="text-slate-700">{t("Deposit Transaction Guidelines:")}</strong>
                        <ul className="list-disc leading-tight pl-3 mt-1 space-y-1">
                          <li><strong>Pending:</strong> Submitted, awaiting agent verification.</li>
                          <li><strong>In Progress:</strong> Processing actively by payment gateway.</li>
                          <li><strong>Approved:</strong> Cleared and credited safely.</li>
                          <li><strong>Declined:</strong> Rejected with decline remark listed on row bounds.</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-slate-700">{t("Payout Transaction Guidelines:")}</strong>
                        <ul className="list-disc leading-tight pl-3 mt-1 space-y-1">
                          <li><strong>Pending:</strong> Requested, awaiting compliance release key.</li>
                          <li><strong>In Progress:</strong> Money clearing with local banking network.</li>
                          <li><strong>Approved:</strong> Funds successfully disbursed, proof file attached.</li>
                          <li><strong>Declined:</strong> Reclaimed or blocked by recipient institution.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Lightbox full image previewer */}
      {lightboxPhoto && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer" 
          onClick={() => setLightboxPhoto('')}
        >
          <div 
            className="relative max-w-2xl w-full flex flex-col items-center" 
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute -top-12 right-0 flex items-center gap-2">
              <button 
                onClick={() => setLightboxPhoto('')}
                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 text-xs font-bold w-10 h-10 flex items-center justify-center transition-all shadow-xs"
                title="Close"
              >
                ✕
              </button>
            </div>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-white/10 p-3 rounded-2xl shadow-2xl relative w-full flex flex-col items-center"
            >
              <img 
                src={lightboxPhoto} 
                alt={t("Audit High-Fidelity Receipt Proof")} 
                className="max-w-full max-h-[60vh] object-contain rounded-xl shadow border border-white/5" 
                referrerPolicy="no-referrer"
              />
              <div className="w-full mt-3 flex justify-between items-center text-xs text-white/60 font-semibold px-2">
                <span>🛡️ {t("Secure Ledger Audit Cryptographic Proof Asset")}</span>
                <span className="text-[10px] text-slate-400">Click anywhere outside to close</span>
              </div>
            </motion.div>
          </div>
        </div>
      )}

    </motion.div>
  );
}
