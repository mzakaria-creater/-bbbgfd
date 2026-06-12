import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageProvider, useTranslation } from './context/LanguageContext';

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

function BaseLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { language, langDir, toggleLanguage, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifications = [
    { id: 1, title: t("Disbursement Alert"), desc: t("Payout batch approved for Delta Group"), time: t("5 mins ago"), unread: true },
    { id: 2, title: t("High Risk Alert"), desc: t("L8 Business Governance audit required for TRX-9021"), time: t("30 mins ago"), unread: true },
    { id: 3, title: t("Audit Alert"), desc: t("Compliance key updated for AML checking"), time: t("2 hours ago"), unread: false }
  ];

  const navItems = [
    { to: '/', label: 'Admin Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/payment-methods', label: 'Payment Methods', icon: <CreditCard className="w-4 h-4" /> },
    { to: '/treasury', label: 'Treasury Hub', icon: <DollarSign className="w-4 h-4" /> },
    { to: '/operator-cockpit', label: 'Operator Cockpit', icon: <History className="w-4 h-4" /> },
    { to: '/local-depositors', label: 'Local Depositors', icon: <Users className="w-4 h-4" /> },
    { to: '/disputes', label: 'Complaints / Disputes', icon: <ShieldAlert className="w-4 h-4" /> },
    { to: '/rbac', label: 'RBAC perms Studio', icon: <Key className="w-4 h-4" /> },
    { to: '/commissions', label: 'Commission Engine', icon: <GitBranch className="w-4 h-4" /> },
    { to: '/merchant-portal', label: 'Merchant Dashboard', icon: <UserCheck className="w-4 h-4" /> }
  ];

  return (
    <div dir={langDir} className="min-h-screen bg-[#faf9fe] text-[#1a1b1f] flex flex-col font-sans transition-all duration-300">
      
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
      
      {/* Dynamic Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full h-16 bg-[#faf9fe]/80 backdrop-blur-xl border-b border-outline-variant/30 flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto left-0 right-0 shadow-xs shadow-primary/5">
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
          
          {/* Dual language picker */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest transition-colors border border-outline-variant/30 font-bold text-xs"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>

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
                      <p className="text-[10px] text-on-surface-variant truncate font-semibold">{t("Global Administrator")}</p>
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

      {/* Main Core View Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-12 py-8 flex gap-8">
        
        {/* Desktop Sidebar (1/4 width) */}
        <aside className="hidden lg:flex flex-col gap-2 p-4 h-[calc(100vh-10rem)] w-72 bg-surface-container-low border border-outline-variant/50 rounded-3xl sticky top-24">
          <div className="mb-6 px-2">
            <h2 className="text-base font-extrabold text-primary">{t("Admin Control Suite")}</h2>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-extrabold opacity-70">{t("P2P Network Core")}</p>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar">
            {navItems.map((item) => {
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
                    <span>{t(item.label)}</span>
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
                    {navItems.map((item) => {
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
                          <span>{t(item.label)}</span>
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
      <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 py-6 border-t border-outline-variant/30 flex flex-col md:flex-row items-center justify-between text-xs text-on-surface-variant font-bold gap-4">
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
      <Router>
        <BaseLayout>
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/treasury" element={<TreasuryHub />} />
            <Route path="/operator-cockpit" element={<OperatorCockpit />} />
            <Route path="/local-depositors" element={<LocalDepositors />} />
            <Route path="/disputes" element={<Disputes />} />
            <Route path="/rbac" element={<RBACStudio />} />
            <Route path="/commissions" element={<Commissions />} />
            <Route path="/merchant-portal" element={<MerchantPortal />} />
          </Routes>
        </BaseLayout>
      </Router>
    </LanguageProvider>
  );
}
