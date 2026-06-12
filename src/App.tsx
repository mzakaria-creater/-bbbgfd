import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CreditCard, 
  History, 
  Users, 
  ShieldAlert, 
  Settings, 
  GitBranch, 
  UserCheck, 
  Bell, 
  Globe, 
  Key, 
  ShieldCheck, 
  DollarSign, 
  ChevronRight,
  Sparkles,
  HelpCircle,
  Menu,
  X,
  Smartphone,
  Sliders,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider, useTranslation } from './context/LanguageContext';
import { PermissionsProvider, usePermissions } from './context/PermissionsContext';
import PermissionGuard from './components/PermissionGuard';

// Import our rich 9 high-fidelity P2P operational screens
import AdminDashboard from './components/AdminDashboard';
import PaymentMethods from './components/PaymentMethods';
import TreasuryHub from './components/TreasuryHub';
import OperatorCockpit from './components/OperatorCockpit';
import LocalDepositors from './components/LocalDepositors';
import Disputes from './components/Disputes';
import RBACStudio from './components/RBACStudio';
import Commissions from './components/Commissions';
import MerchantPortal from './components/MerchantPortal';
import WalletAllocationEngine from './components/WalletAllocationEngine';
import WalletDashboard from './components/WalletDashboard';

function BaseLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { language, langDir, toggleLanguage, t } = useTranslation();
  const { selectedRole, checkPermission } = usePermissions();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // 4K Glossy Desktop Landscape states
  const [viewportWidth, setViewportWidth] = useState<'classic' | 'panoramic' | '4k-ultra' | 'mobile'>(() => {
    return (localStorage.getItem('finlux_viewport_width') as any) || '4k-ultra';
  });
  const [glossyLuster, setGlossyLuster] = useState<'glossy' | 'matte'>(() => {
    return (localStorage.getItem('finlux_glossy_luster') as any) || 'glossy';
  });
  const [displayScale, setDisplayScale] = useState<number>(() => {
    return Number(localStorage.getItem('finlux_display_scale')) || 95;
  });

  const [remixStyle, setRemixStyle] = useState<'classic' | 'obsidian-velvet' | 'cyber-emerald' | 'glassmorphic-aurora'>(() => {
    return (localStorage.getItem('finlux_remix_style') as any) || 'classic';
  });

  const saveRemixStyle = (val: 'classic' | 'obsidian-velvet' | 'cyber-emerald' | 'glassmorphic-aurora') => {
    setRemixStyle(val);
    localStorage.setItem('finlux_remix_style', val);
  };

  useEffect(() => {
    const root = document.documentElement;
    const styleVariables = [
      '--color-surface',
      '--color-surface-container-lowest',
      '--color-surface-container-low',
      '--color-surface-container',
      '--color-surface-container-high',
      '--color-surface-container-highest',
      '--color-primary',
      '--color-primary-container',
      '--color-secondary',
      '--color-secondary-container',
      '--color-on-surface',
      '--color-on-surface-variant',
      '--color-outline',
      '--color-outline-variant'
    ];
    styleVariables.forEach(v => root.style.removeProperty(v));

    if (remixStyle === 'obsidian-velvet') {
      root.style.setProperty('--color-surface', '#07080f');
      root.style.setProperty('--color-surface-container-lowest', '#0d0e1a');
      root.style.setProperty('--color-surface-container-low', '#121424');
      root.style.setProperty('--color-surface-container', '#181a2f');
      root.style.setProperty('--color-surface-container-high', '#20223f');
      root.style.setProperty('--color-surface-container-highest', '#282a4f');
      root.style.setProperty('--color-primary', '#a78bfa');
      root.style.setProperty('--color-primary-container', '#6d28d9');
      root.style.setProperty('--color-secondary', '#fbbf24');
      root.style.setProperty('--color-secondary-container', '#451a03');
      root.style.setProperty('--color-on-surface', '#f3f4f6');
      root.style.setProperty('--color-on-surface-variant', '#9ca3af');
      root.style.setProperty('--color-outline', '#6b7280');
      root.style.setProperty('--color-outline-variant', '#374151');
    } else if (remixStyle === 'cyber-emerald') {
      root.style.setProperty('--color-surface', '#020617');
      root.style.setProperty('--color-surface-container-lowest', '#0f172a');
      root.style.setProperty('--color-surface-container-low', '#1e293b');
      root.style.setProperty('--color-surface-container', '#273549');
      root.style.setProperty('--color-surface-container-high', '#334155');
      root.style.setProperty('--color-surface-container-highest', '#475569');
      root.style.setProperty('--color-primary', '#10b981');
      root.style.setProperty('--color-primary-container', '#064e3b');
      root.style.setProperty('--color-secondary', '#38bdf8');
      root.style.setProperty('--color-secondary-container', '#0c4a6e');
      root.style.setProperty('--color-on-surface', '#f0fdf4');
      root.style.setProperty('--color-on-surface-variant', '#cbd5e1');
      root.style.setProperty('--color-outline', '#94a3b8');
      root.style.setProperty('--color-outline-variant', '#475569');
    } else if (remixStyle === 'glassmorphic-aurora') {
      root.style.setProperty('--color-surface', '#fafafc');
      root.style.setProperty('--color-surface-container-lowest', '#ffffff');
      root.style.setProperty('--color-surface-container-low', '#f3f4f6');
      root.style.setProperty('--color-surface-container', '#e5e7eb');
      root.style.setProperty('--color-surface-container-high', '#d1d5db');
      root.style.setProperty('--color-surface-container-highest', '#9ca3af');
      root.style.setProperty('--color-primary', '#f43f5e');
      root.style.setProperty('--color-primary-container', '#ffe4e6');
      root.style.setProperty('--color-secondary', '#06b6d4');
      root.style.setProperty('--color-secondary-container', '#ecfeff');
      root.style.setProperty('--color-on-surface', '#0f172a');
      root.style.setProperty('--color-on-surface-variant', '#475569');
      root.style.setProperty('--color-outline', '#94a3b8');
      root.style.setProperty('--color-outline-variant', '#cbd5e1');
    }
  }, [remixStyle]);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const useMobileLayout = isMobile || viewportWidth === 'mobile';

  const saveViewportWidth = (val: 'classic' | 'panoramic' | '4k-ultra' | 'mobile') => {
    setViewportWidth(val);
    localStorage.setItem('finlux_viewport_width', val);
  };

  const saveGlossyLuster = (val: 'glossy' | 'matte') => {
    setGlossyLuster(val);
    localStorage.setItem('finlux_glossy_luster', val);
  };

  const saveDisplayScale = (val: number) => {
    const clamped = Math.max(75, Math.min(125, val));
    setDisplayScale(clamped);
    localStorage.setItem('finlux_display_scale', clamped.toString());
  };

  const notifications = [
    { id: 1, title: t("Disbursement Alert"), desc: t("Payout batch approved for Delta Group"), time: t("5 mins ago"), unread: true },
    { id: 2, title: t("High Risk Alert"), desc: t("L8 Business Governance audit required for TRX-9021"), time: t("30 mins ago"), unread: true },
    { id: 3, title: t("Audit Alert"), desc: t("Compliance key updated for AML checking"), time: t("2 hours ago"), unread: false }
  ];

  const navItems = [
    { to: '/', label: 'Admin Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/payment-methods', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
    { to: '/wallet-allocation', label: 'Wallet Allocation', icon: <Smartphone className="w-4 h-4" /> },
    { to: '/wallet-dashboard', label: 'Wallet Dashboard', icon: <Sliders className="w-4 h-4" /> },
    { to: '/treasury', label: 'Treasury Hub', icon: <DollarSign className="w-4 h-4" /> },
    { to: '/operator-cockpit', label: 'Operator Cockpit', icon: <History className="w-4 h-4" /> },
    { to: '/local-depositors', label: 'Local Depositors', icon: <Users className="w-4 h-4" /> },
    { to: '/disputes', label: 'Complaints / Disputes', icon: <ShieldAlert className="w-4 h-4" /> },
    { to: '/rbac', label: 'RBAC perms Studio', icon: <Key className="w-4 h-4" /> },
    { to: '/commissions', label: 'Commission Engine', icon: <GitBranch className="w-4 h-4" /> },
    { to: '/merchant-portal', label: 'Merchant Dashboard', icon: <UserCheck className="w-4 h-4" /> }
  ];

  // Dynamic width classes based on 4K Landscape Setup
  const widthBoundClass = 
    isMobile ? 'max-w-full' :
    viewportWidth === 'classic' ? 'max-w-7xl' : 
    viewportWidth === 'panoramic' ? 'max-w-[1550px]' : 
    viewportWidth === 'mobile' ? 'max-w-[420px]' :
    'max-w-[1880px]';

  if (useMobileLayout) {
    const bottomTabs = [
      { to: '/', label: 'Dash', permission: 'Admin Dashboard', icon: <LayoutDashboard className="w-5 h-5 mb-0.5" /> },
      { to: '/wallet-allocation', label: 'Allocation', permission: 'Wallet Allocation', icon: <Smartphone className="w-5 h-5 mb-0.5" /> },
      { to: '/wallet-dashboard', label: 'Control', permission: 'Wallet Dashboard', icon: <Sliders className="w-5 h-5 mb-0.5" /> },
      { to: '/treasury', label: 'Treasury', permission: 'Treasury Hub', icon: <DollarSign className="w-5 h-5 mb-0.5" /> }
    ].filter(tab => checkPermission(tab.permission, 'view'));

    const mobileContent = (
      <div 
        dir={langDir} 
        className="h-full text-[#1a1b1f] flex flex-col font-sans transition-all duration-300 relative bg-[#faf9fe]"
      >
        <header className="sticky top-0 z-40 w-full h-14 bg-white/85 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-sm font-black tracking-tight text-primary">FinLux Go</span>
            <span className="px-1.5 py-0.5 bg-[#6cf8bb]/20 text-[#006c49] text-[8px] font-black uppercase tracking-wider rounded">
              {t("LIVE")}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[9px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer"
              title="Toggle English (Light) / العربية (Dark)"
            >
              {language === 'en' ? (
                <>
                  <Sun className="w-3 h-3 text-amber-500" />
                  <span>EN ☀️</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-indigo-500" />
                  <span>عربي 🌙</span>
                </>
              )}
            </button>

            <button 
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative p-1.5 text-slate-500 hover:text-primary transition-colors cursor-pointer"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
            </button>

            <div 
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="w-7 h-7 rounded-full overflow-hidden border border-primary cursor-pointer"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxpdqQHuBGY4S81eTh3qg8_ouYgfYnlpGkTdpBna1uGxcB7ZgyV4XTsB90RVKY78z1b83W2HY9mOgmUK7A6cOK67UhAHxU_MslDFkvLyyZUaci1p68mekimlVeG4wruYxMkEdVm2AHPCxZz4-igmq0gyZyVDctmR3E1GeWPuxlkMA_HUUxCBvVVCAYzsd14dF9xvPUHLOOAOX5_ItXB3L37eRNv9BSyGxSbUgUXtFMbisfGkhzlRcbmi91VCupdkvwfgAjhicY6TM" 
                alt="User" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </header>

        <AnimatePresence>
          {notificationsOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 left-4 right-4 bg-white border border-outline-variant/50 rounded-2xl shadow-xl z-50 overflow-hidden text-left"
            >
              <div className="p-3 bg-slate-50 border-b flex justify-between items-center text-xs font-black">
                <span>Recent Alerts</span>
                <button onClick={() => setNotificationsOpen(false)} className="text-[10px] text-primary">Close</button>
              </div>
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 text-[10px] font-semibold">
                    <p className="font-bold text-slate-800">{n.title}</p>
                    <p className="text-slate-500 line-clamp-1">{n.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {profileOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-14 left-4 right-4 bg-white border border-outline-variant/40 rounded-2xl shadow-xl z-50 overflow-hidden text-left font-bold text-xs"
            >
              <div className="p-3 bg-slate-50 border-b flex items-center gap-2">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxpdqQHuBGY4S81eTh3qg8_ouYgfYnlpGkTdpBna1uGxcB7ZgyV4XTsB90RVKY78z1b83W2HY9mOgmUK7A6cOK67UhAHxU_MslDFkvLyyZUaci1p68mekimlVeG4wruYxMkEdVm2AHPCxZz4-igmq0gyZyVDctmR3E1GeWPuxlkMA_HUUxCBvVVCAYzsd14dF9xvPUHLOOAOX5_ItXB3L37eRNv9BSyGxSbUgUXtFMbisfGkhzlRcbmi91VCupdkvwfgAjhicY6TM" alt="User" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-slate-950">Alex Sterling</h4>
                  <p className="text-[10px] text-primary font-bold">{t(selectedRole)}</p>
                </div>
              </div>
              <div className="p-2 space-y-1">
                <button onClick={() => { alert(t("Opening settings...")); setProfileOpen(false); }} className="w-full text-left p-2 hover:bg-slate-50 rounded-lg flex items-center gap-2 text-slate-700">
                  <Settings className="w-3.5 h-3.5" /> <span>{t("Settings")}</span>
                </button>
                <button onClick={() => { 
                  const conf = window.confirm(t("Sign Out?"));
                  if(conf) { alert(t("Session ended.")); setProfileOpen(false); }
                }} className="w-full text-left p-2 hover:bg-red-50 text-red-650 rounded-lg flex items-center gap-2">
                  <ShieldAlert className="w-3.5 h-3.5" /> <span>{t("Sign Out")}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <div className="fixed inset-0 z-50 bg-[#0e0c24]/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
              <motion.aside 
                initial={{ x: langDir === 'rtl' ? '100%' : '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: langDir === 'rtl' ? '100%' : '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed left-0 rtl:left-auto rtl:right-0 top-0 bottom-0 max-w-xs w-[80%] bg-[#faf9fe] h-screen border-r rtl:border-r-0 rtl:border-l border-outline-variant z-50 p-5 flex flex-col justify-between text-left rtl:text-right"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white font-extrabold transform rotate-2">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-black text-primary">FinLux Options</span>
                    </div>
                    <button className="p-1 rounded-full hover:bg-slate-100" onClick={() => setMobileMenuOpen(false)}>
                      <X className="w-5 h-5 text-on-surface" />
                    </button>
                  </div>

                  <nav className="space-y-0.5 overflow-y-auto max-h-[72vh] hide-scrollbar">
                    {navItems
                      .filter((item) => checkPermission(item.label, 'view'))
                      .map((item) => {
                        const active = location.pathname === item.to;
                        return (
                          <NavLink 
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 p-3 rounded-xl font-bold text-xs transition-all ${
                              active 
                              ? 'bg-white text-[#003ec7] shadow-xs border-l-4 border-primary' 
                              : 'text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                          >
                            {item.icon}
                            <span className="truncate">{t(item.label)}</span>
                          </NavLink>
                        );
                      })}
                  </nav>
                </div>

                <button 
                  onClick={() => {
                    alert(t("Emergency Ledger Block Activated."));
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#ffdad6] text-[#ba1a1a] py-3.5 rounded-xl text-xs font-black uppercase tracking-wider"
                >
                  🔒 {t("Emergency Lock")}
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto p-4 pb-26 bg-[#faf9fe]">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </main>

        <div className="absolute bottom-4 left-4 right-4 h-16 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-lg flex justify-around items-center px-1 z-40 select-none">
          {bottomTabs.map((tab) => {
            const active = location.pathname === tab.to;
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all w-16 relative ${
                  active ? 'text-primary scale-110 font-extrabold' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.icon}
                <span className="text-[9px] font-bold tracking-tight mt-0.5">{t(tab.label)}</span>
                {active && (
                  <motion.div 
                    layoutId="activeTabIndicator" 
                    className="absolute -bottom-1 w-4 h-1 bg-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </NavLink>
            );
          })}

          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all w-16 text-slate-400 hover:text-slate-650 ${
              mobileMenuOpen ? 'text-primary scale-110 font-bold' : ''
            }`}
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-bold tracking-tight">{t("More")}</span>
          </button>
        </div>

      </div>
    );

    if (isMobile) {
      return (
        <div className="w-full h-screen overflow-hidden flex flex-col bg-[#faf9fe]">
          {mobileContent}
        </div>
      );
    } else {
      return (
        <div 
          dir={langDir}
          className={`min-h-screen text-[#1a1b1f] flex flex-col font-sans transition-all duration-300 relative ${
            glossyLuster === 'glossy' 
              ? 'bg-gradient-to-br from-[#f6f5fa] via-[#faf9fe] to-[#f0eef7]' 
              : 'bg-[#faf9fe]'
          }`}
        >
          <div className="w-full bg-[#101115] text-slate-300 py-1.5 px-6 text-[11px] font-mono flex justify-between items-center border-b border-[#20222a] z-50">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
              </span>
              <span className="font-extrabold uppercase text-slate-200">📱 Mobile App Simulator Mode</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => saveViewportWidth('4k-ultra')}
                className="px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded text-[10px] font-extrabold transition-all cursor-pointer"
              >
                🖥️ Exit Simulator (Widescreen)
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center py-8 px-4 z-10 relative">
            <div className="absolute top-[20%] left-[30%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[80px]" />
            <div className="absolute bottom-[20%] right-[30%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[80px]" />

            <div className="w-full max-w-[390px] h-[812px] bg-[#18181f] rounded-[3.5rem] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] relative border border-slate-700/50 flex flex-col ring-4 ring-neutral-800/10">
              
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#0a0a0f] rounded-2xl z-50 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 absolute left-3" />
                <div className="w-10 h-1 bg-slate-800 rounded-full" />
              </div>

              <div className="w-full h-8 bg-white flex items-end justify-between px-6 pb-1 text-[10px] font-bold text-[#1a1b1f] z-40 select-none rounded-t-[2.7rem] border-b border-slate-50">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="flex items-end gap-0.5 h-2">
                    <div className="w-0.5 h-1 bg-slate-950 rounded-xs" />
                    <div className="w-0.5 h-1.5 bg-slate-950 rounded-xs" />
                    <div className="w-0.5 h-2 bg-slate-950 rounded-xs" />
                  </div>
                  <span className="text-[9px]">5G</span>
                  <div className="w-5 h-2.5 border border-slate-950 rounded-2xs p-0.3 flex items-center">
                    <div className="h-full w-full bg-[#0d593a] rounded-3xs" />
                  </div>
                </div>
              </div>

              <div className="flex-grow rounded-[2.7rem] overflow-hidden bg-[#faf9fe] relative flex flex-col border border-slate-200">
                <div className="absolute inset-0 overflow-hidden">
                  {mobileContent}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // 4K Glossy Desktop Landscape states

  return (
    <div 
      dir={langDir} 
      className={`min-h-screen text-[#1a1b1f] flex flex-col font-sans transition-all duration-300 relative ${
        glossyLuster === 'glossy' 
          ? 'bg-gradient-to-br from-[#f6f5fa] via-[#faf9fe] to-[#f0eef7]' 
          : 'bg-[#faf9fe]'
      }`}
    >
      
      {/* 4K Landscape Atmospheric Neon Glow Spheres (Ambient drift under frosted panels) */}
      {glossyLuster === 'glossy' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[5%] left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/8 to-indigo-300/10 blur-[90px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-secondary/8 to-teal-200/5 blur-[110px] animate-pulse" style={{ animationDuration: '9s' }} />
          <div className="absolute top-[40%] right-[25%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-purple-400/5 to-pink-500/5 blur-[80px] animate-pulse" style={{ animationDuration: '14s' }} />
        </div>
      )}

      {/* Glossy Luster Light Reflective Specular Overlay (Gloss design overlay) */}
      {glossyLuster === 'glossy' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/80 to-white/0 pointer-events-none z-50 shadow-[0_1px_15px_rgba(255,255,255,0.8)]" />
      )}

      {/* 4K ULTRA-DESK MASTER PRESENTER HUD */}
      <div className="w-full bg-[#101115] text-slate-300 py-1.5 px-4 md:px-8 text-[11px] font-mono flex flex-wrap justify-between items-center gap-3 border-b border-[#20222a] z-50 shadow-sm relative">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
          </span>
          <span className="font-bold tracking-wider text-slate-100 uppercase">🖥️ Widescreen 4K Console Mode Active</span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400 hidden sm:inline">Format: <strong className="text-primary-container font-extrabold">3840×2160 (60Hz) Optimal</strong></span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-emerald-400 font-semibold uppercase text-[10px] tracking-widest hidden md:inline">Glossy Luster Rendering on High-DPI screens</span>
        </div>

        {/* Viewport & Glossy Configuration HUD Controller */}
        <div className="flex items-center gap-4 text-xs font-sans">
          
          {/* Panoramic Selector */}
          <div className="flex items-center gap-1 bg-slate-800/60 p-0.5 rounded-lg border border-slate-700">
            <button 
              onClick={() => saveViewportWidth('classic')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${viewportWidth === 'classic' ? 'bg-primary text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
              title="Classic 1280px Grid"
            >
              Classic
            </button>
            <button 
              onClick={() => saveViewportWidth('panoramic')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${viewportWidth === 'panoramic' ? 'bg-primary text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
              title="Wide HD 1550px"
            >
              HD Wide
            </button>
            <button 
              onClick={() => saveViewportWidth('4k-ultra')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${viewportWidth === '4k-ultra' ? 'bg-primary text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
              title="Ultra 4K 1880px Canvas"
            >
              4K Ultra-Wide
            </button>
            <button 
              onClick={() => saveViewportWidth('mobile')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${viewportWidth === 'mobile' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
              title="Interactive Smartphone Simulator Mode"
            >
              📱 Mobile App
            </button>
          </div>

          {/* Luster Gloss Toggle */}
          <div className="flex items-center gap-1 bg-slate-800/60 p-0.5 rounded-lg border border-slate-700">
            <button 
              onClick={() => saveGlossyLuster('glossy')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 ${glossyLuster === 'glossy' ? 'bg-[#006c49] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
              title="High gloss frosted glass finish with colorful reflections"
            >
              <Sparkles className="w-2.5 h-2.5" />
              Glossy Glass
            </button>
            <button 
              onClick={() => saveGlossyLuster('matte')}
              className={`px-2.5 py-0.5 rounded text-[10px] font-medium transition-all ${glossyLuster === 'matte' ? 'bg-slate-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
              title="Standard flat background design"
            >
              Matte
            </button>
          </div>

          {/* Remix Theme Selector */}
          <div className="flex items-center gap-1 bg-slate-800/60 p-0.5 rounded-lg border border-slate-700">
            <button 
              onClick={() => saveRemixStyle('classic')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${remixStyle === 'classic' ? 'bg-[#003ec7] text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
              title="Classic defaults"
            >
              Classic
            </button>
            <button 
              onClick={() => saveRemixStyle('obsidian-velvet')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${remixStyle === 'obsidian-velvet' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
              title="Obsidian Velvet: Premium deep violet & gold accents"
            >
              ✦ Obsidian
            </button>
            <button 
              onClick={() => saveRemixStyle('cyber-emerald')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${remixStyle === 'cyber-emerald' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
              title="Cyber Emerald: Terminal matrix view"
            >
              ⚡ Cyber
            </button>
            <button 
              onClick={() => saveRemixStyle('glassmorphic-aurora')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${remixStyle === 'glassmorphic-aurora' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}
              title="Aurora Glass: Dynamic vibrant neon palette"
            >
              ✨ Aurora
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Scale Tuner */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Density Scale:</span>
            <div className="flex items-center gap-1.5 bg-slate-800/60 px-2 py-1 rounded-md border border-slate-700/60">
              <button 
                onClick={() => saveDisplayScale(displayScale - 5)}
                className="hover:text-white font-extrabold pr-1 cursor-pointer"
                title="Decrease Scale"
              >
                -
              </button>
              <span className="text-slate-100 font-bold">{displayScale}%</span>
              <button 
                onClick={() => saveDisplayScale(displayScale + 5)}
                className="hover:text-white font-extrabold pl-1 cursor-pointer"
                title="Increase Scale"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Click capture overlays when dropdowns are open */}
      {(notificationsOpen || profileOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          onClick={() => {
            setNotificationsOpen(false);
            setProfileOpen(false);
          }}
        />
      )}
      
      {/* Dynamic Top Navigation Bar with Glossy Glassmorphic class matching */}
      <header className={`sticky top-0 z-40 w-full h-16 transition-all duration-300 ${
        glossyLuster === 'glossy' 
          ? 'bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-xs' 
          : 'bg-[#faf9fe]/80 backdrop-blur-xl border-b border-outline-variant/30'
      } flex items-center justify-between px-6 md:px-12 ${widthBoundClass} mx-auto left-0 right-0 shadow-xs`}>
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-1.5 hover:bg-surface-container rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5 text-on-surface" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold shadow-md transform rotate-2">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-primary">{t("FinLux P2P")}</span>
          </div>
        </div>

        {/* Action Widgets */}
        <div className="flex items-center gap-3">
          
          {/* Dual Translation & Dark Mode Theme Switcher */}
          <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-full border border-outline-variant/30 relative select-none">
            <button 
              onClick={() => {
                if (language !== 'en') {
                  toggleLanguage();
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-300 font-bold text-xs cursor-pointer ${
                language === 'en' 
                  ? 'bg-white text-primary shadow-xs' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="English with Sunlight Workspace"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>English (☀️)</span>
            </button>
            <button 
              onClick={() => {
                if (language !== 'ar') {
                  toggleLanguage();
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full transition-all duration-300 font-bold text-xs cursor-pointer ${
                language === 'ar' 
                  ? 'bg-indigo-950/60 text-indigo-400 border border-indigo-500/20 shadow-xs' 
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Arabic with Ambient Dark Mode theme"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>العربية (🌙)</span>
            </button>
          </div>

          <div className="h-6 w-px bg-outline-variant/45 hidden sm:block" />

          {/* Dynamic Active Lock status */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6cf8bb]/15 border border-[#6cf8bb]/40 text-[#006c49] text-[10px] font-bold uppercase tracking-wider">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#006c49] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#006c49]"></span>
            </span>
            <span>{t("Secured Node")}</span>
          </div>

          {/* Notification Dropdown & Bell Icon */}
          <div className="relative">
            <button 
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              className="relative p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-all duration-200"
              aria-label={t("Notifications")}
            >
              <Bell className="w-5 h-5 block" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-[#faf9fe]"></span>
            </button>

            {/* Dropdown Container */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 bg-white border border-outline-variant/50 rounded-2xl shadow-xl z-50 overflow-hidden text-left rtl:text-right"
                >
                  <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
                    <span className="font-bold text-sm text-on-surface">{t("Notifications")}</span>
                    <button 
                      onClick={() => alert(t("All notifications marked as read!"))}
                      className="text-[10px] text-primary hover:underline font-bold"
                    >
                      {t("Mark all as read")}
                    </button>
                  </div>
                  <div className="divide-y divide-outline-variant/20 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3.5 hover:bg-surface-container-low transition-colors duration-150 text-left rtl:text-right">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-bold ${n.unread ? 'text-primary' : 'text-on-surface-variant'}`}>
                            {n.title}
                          </span>
                          {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
                        </div>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-2">{n.desc}</p>
                        <span className="text-[9px] text-outline font-bold mt-1.5 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-outline-variant/30 text-center bg-surface-container-low">
                    <button 
                      onClick={() => alert(t("Opening all custom system alerts..."))}
                      className="text-xs text-primary hover:underline font-bold"
                    >
                      {t("View All System Alerts")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-6 w-px bg-outline-variant/45 block" />

          {/* User profile dropdown trigger */}
          <div className="relative">
            <div 
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary hover:border-primary/80 transition-all cursor-pointer shadow-xs"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxpdqQHuBGY4S81eTh3qg8_ouYgfYnlpGkTdpBna1uGxcB7ZgyV4XTsB90RVKY78z1b83W2HY9mOgmUK7A6cOK67UhAHxU_MslDFkvLyyZUaci1p68mekimlVeG4wruYxMkEdVm2AHPCxZz4-igmq0gyZyVDctmR3E1GeWPuxlkMA_HUUxCBvVVCAYzsd14dF9xvPUHLOOAOX5_ItXB3L37eRNv9BSyGxSbUgUXtFMbisfGkhzlRcbmi91VCupdkvwfgAjhicY6TM" 
                alt="User Avatar"
                className="object-cover w-full h-full"
              />
            </div>

            <AnimatePresence>
              {profileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-64 bg-white border border-outline-variant/50 rounded-2xl shadow-xl z-50 overflow-hidden text-left rtl:text-right"
                >
                  <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-outline-variant">
                      <img 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxpdqQHuBGY4S81eTh3qg8_ouYgfYnlpGkTdpBna1uGxcB7ZgyV4XTsB90RVKY78z1b83W2HY9mOgmUK7A6cOK67UhAHxU_MslDFkvLyyZUaci1p68mekimlVeG4wruYxMkEdVm2AHPCxZz4-igmq0gyZyVDctmR3E1GeWPuxlkMA_HUUxCBvVVCAYzsd14dF9xvPUHLOOAOX5_ItXB3L37eRNv9BSyGxSbUgUXtFMbisfGkhzlRcbmi91VCupdkvwfgAjhicY6TM" 
                        alt="User Profile" 
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-extrabold text-on-surface truncate">{t("Alex Sterling")}</p>
                      <p className="text-[10px] text-primary truncate font-bold">{t(selectedRole)}</p>
                    </div>
                  </div>

                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => { alert(t("Opening Profile Settings...")); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-[#faf9fe] rounded-lg transition-colors text-left rtl:text-right"
                    >
                      <Settings className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span>{t("Profile Settings")}</span>
                    </button>
                    <button 
                      onClick={() => { alert(t("Opening Active Sessions...")); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-[#faf9fe] rounded-lg transition-colors text-left rtl:text-right"
                    >
                      <History className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span>{t("Active Sessions")}</span>
                    </button>
                    <button 
                      onClick={() => { alert(t("Opening Node Security Settings...")); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-on-surface-variant hover:bg-[#faf9fe] rounded-lg transition-colors text-left rtl:text-right"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-on-surface-variant" />
                      <span>{t("Node Security Settings")}</span>
                    </button>
                  </div>

                  <div className="p-2 border-t border-outline-variant/30 bg-surface-container-low">
                    <button 
                      onClick={() => {
                        const confKeys = window.confirm(t("Sign Out Securely") + "?");
                        if (confKeys) {
                          alert(t("Logging user session out safely. Session caches cleared."));
                          setProfileOpen(false);
                        }
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-[#93000a] hover:bg-[#ffdad6]/50 rounded-lg transition-colors text-left rtl:text-right"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-[#93000a]" />
                      <span>{t("Sign Out Securely")}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </header>

      {/* Main Core View Area - Supports dynamic widths and layouts of our landscape workspace */}
      <div 
        className={`flex-1 ${widthBoundClass} w-full mx-auto px-4 md:px-12 py-8 flex gap-8 z-10 transition-all duration-300`}
        style={{ 
          transform: `scale(${displayScale / 100})`, 
          transformOrigin: 'top center',
          marginBottom: `${(100 - displayScale) * -0.5}vh` // adjust screen offset for high fidelity scale bounds
        }}
      >
        
        {/* Desktop Sidebar (1/4 width) styled with glossy parameters */}
        <aside className={`hidden lg:flex flex-col gap-2 p-4 h-[calc(100vh-12rem)] w-72 sticky top-24 transition-all duration-300 ${
          glossyLuster === 'glossy' 
            ? 'bg-white/50 backdrop-blur-xl border border-white/40 shadow-xs' 
            : 'bg-surface-container-low border border-outline-variant/50'
        } rounded-3xl`}>
          <div className="mb-6 px-2">
            <h2 className="text-base font-extrabold text-primary">{t("Admin Control Suite")}</h2>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-extrabold opacity-70">{t("P2P Network Core")}</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar">
            {navItems
              .filter((item) => checkPermission(item.label, 'view'))
              .map((item) => {
                const active = location.pathname === item.to;
                return (
                  <NavLink 
                    key={item.to}
                    to={item.to}
                    className={`flex items-center justify-between p-3 rounded-lg font-bold text-xs transition-all ${
                      active 
                      ? 'bg-[#ffffff] text-[#003ec7] shadow-xs border-r-4 border-primary' 
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="flex items-center gap-1.5">
                        {t(item.label)}
                      </span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${active ? 'text-primary' : 'text-outline-variant'}`} />
                  </NavLink>
                );
              })}
          </nav>

          <div className="mt-auto pt-4 border-t border-outline-variant/30 space-y-2">
            <button 
              onClick={() => {
                const conf = window.confirm(t("WARNING: Activating emergency ledger isolation stops all outward bank wire webhooks immediately. Resume only post compliance audits. Proceed?"));
                if (conf) {
                  alert(t("Emergency Block Activated. Settlement logs locked safely."));
                }
              }}
              className="w-full bg-error-container hover:bg-[#ffdad6] text-[#93000a] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {t("Emergency Lock")}
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Sidebar Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backing */}
              <div 
                className="fixed inset-0 z-50 bg-[#0e0c24]/50 backdrop-blur-xs lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              />
              
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="fixed left-0 top-0 bottom-0 max-w-xs w-full bg-[#faf9fe] h-screen border-r border-outline-variant z-50 p-6 flex flex-col justify-between lg:hidden"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-lg font-bold text-primary">{t("FinLux Workspace")}</span>
                    </div>
                    <button className="p-1" onClick={() => setMobileMenuOpen(false)}>
                      <X className="w-5 h-5 text-on-surface" />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {navItems
                      .filter((item) => checkPermission(item.label, 'view'))
                      .map((item) => {
                        const active = location.pathname === item.to;
                        return (
                          <NavLink 
                            key={item.to}
                            to={item.to}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 p-3.5 rounded-xl font-bold text-xs transition-all ${
                              active 
                              ? 'bg-[#ffffff] text-[#003ec7] shadow border-l-4 border-primary' 
                              : 'text-on-surface-variant hover:bg-surface-container-high'
                            }`}
                          >
                            {item.icon}
                            <span className="flex items-center gap-1.5 truncate">
                              {t(item.label)}
                            </span>
                          </NavLink>
                        );
                      })}
                  </nav>
                </div>

                <button 
                  onClick={() => {
                    alert(t("Emergency Ledger Block Activated."));
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-[#ffdad6] text-[#93000a] py-3.5 rounded-xl text-xs font-bold"
                >
                  {t("Emergency Block Active")}
                </button>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Reactive Contents Route render */}
        <div className="flex-grow min-w-0">
          <AnimatePresence mode="wait">
            {children}
          </AnimatePresence>
        </div>

      </div>

      {/* Global Status Bar Footer */}
      <footer className={`w-full ${widthBoundClass} mx-auto px-6 md:px-12 py-6 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between text-xs text-on-surface-variant font-bold gap-4 z-10 bg-transparent`}>
        <span>{t("© 2026 FinLux P2P Solutions Node Operations. London & Cairo Nodes Optimal.")}</span>
        <div className="flex items-center gap-4">
          <span className="hover:text-primary cursor-pointer" onClick={() => alert(t("Loading documentation index..."))}>{t("ISO documentation")}</span>
          <span>•</span>
          <span className="hover:text-primary cursor-pointer" onClick={() => alert(t("Sandbox operational keys active."))}>{t("API keys API")}</span>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <PermissionsProvider>
        <Router>
          <BaseLayout>
            <Routes>
              <Route path="/" element={<PermissionGuard pageName="Admin Dashboard"><AdminDashboard /></PermissionGuard>} />
              <Route path="/payment-methods" element={<PermissionGuard pageName="Payment Methods"><PaymentMethods /></PermissionGuard>} />
              <Route path="/wallet-allocation" element={<PermissionGuard pageName="Wallet Allocation"><WalletAllocationEngine /></PermissionGuard>} />
              <Route path="/wallet-dashboard" element={<PermissionGuard pageName="Wallet Dashboard"><WalletDashboard /></PermissionGuard>} />
              <Route path="/treasury" element={<PermissionGuard pageName="Treasury Hub"><TreasuryHub /></PermissionGuard>} />
              <Route path="/operator-cockpit" element={<PermissionGuard pageName="Operator Cockpit"><OperatorCockpit /></PermissionGuard>} />
              <Route path="/local-depositors" element={<PermissionGuard pageName="Local Depositors"><LocalDepositors /></PermissionGuard>} />
              <Route path="/disputes" element={<PermissionGuard pageName="Complaints / Disputes"><Disputes /></PermissionGuard>} />
              <Route path="/rbac" element={<PermissionGuard pageName="RBAC perms Studio"><RBACStudio /></PermissionGuard>} />
              <Route path="/commissions" element={<PermissionGuard pageName="Commission Engine"><Commissions /></PermissionGuard>} />
              <Route path="/merchant-portal" element={<PermissionGuard pageName="Merchant Dashboard"><MerchantPortal /></PermissionGuard>} />
            </Routes>
          </BaseLayout>
        </Router>
      </PermissionsProvider>
    </LanguageProvider>
  );
}
