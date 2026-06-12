import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, 
  TrendingUp, 
  Smartphone, 
  Building2, 
  ShieldAlert, 
  AlertTriangle, 
  BarChart, 
  Download, 
  Activity, 
  MoreVertical,
  CheckCircle,
  HelpCircle,
  Clock,
  Play
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function OperatorCockpit() {
  const { t } = useTranslation();
  const [activeLedger, setActiveLedger] = useState([
    { id: 'TRX-88219', timestamp: '14:22:10', merchant: 'E-Shop Global', tier: 'Gaming Tier-1', method: 'Vodafone Cash', acc: 'Ops 01', amount: 2400, commission: 48, rate: '2%', status: 'Settled' },
    { id: 'TRX-88218', timestamp: '14:21:45', merchant: 'QuickPay Solutions', tier: 'E-Commerce Low', method: 'Bank Transfer', acc: 'CIB Settl', amount: 15000, commission: 300, rate: '2%', status: 'In Progress' },
    { id: 'TRX-88217', timestamp: '14:19:33', merchant: 'Al-Baraka Retail', tier: 'Local Direct', method: 'Vodafone Cash', acc: 'Ops 01', amount: 450, commission: 9, rate: '2%', status: 'Settled' }
  ]);

  const [activeAccounts, setActiveAccounts] = useState([
    { name: 'Vodafone Cash - Ops 01', number: '010 **** 5432', used: 42500, limit: 50000, status: 'Active', priority: 'High', icon: <Smartphone className="w-5 h-5 text-primary" /> },
    { name: 'CIB Enterprise - Settl', number: 'IBAN **** 9811', used: 120000, limit: 1000000, status: 'Active', priority: 'Medium', icon: <Building2 className="w-5 h-5 text-primary" /> },
    { name: 'InstaPay - Float 04', number: 'User ID: nova_44', used: 0, limit: 25000, status: 'Maintenance', priority: 'Low', icon: <TrendingUp className="w-5 h-5 text-outline" /> }
  ]);

  const [disputeQueue, setDisputeQueue] = useState([
    { id: 'TXN #882190', label: 'CRITICAL', title: 'Incomplete Credit', desc: 'Merchant "E-Shop Global" reporting no funds arrived for Vodafone Cash txn...', time: '2h ago', comments: 2 },
    { id: 'TXN #882204', label: 'PENDING', title: 'Incorrect Amount', desc: 'Difference of 5 EGP in reported deposit vs actual balance shift...', time: '4h ago', comments: 0 }
  ]);

  const exportLedgerCSV = () => {
    const headers = ['Request ID', 'Timestamp', 'Merchant', 'Tier', 'Method', 'Account Unit', 'Amount (EGP)', 'Commission (EGP)', 'Rate', 'Status'];
    const csvContent = [
      headers.join(','),
      ...activeLedger.map(row => [
        row.id,
        row.timestamp,
        `"${row.merchant.replace(/"/g, '""')}"`,
        `"${row.tier.replace(/"/g, '""')}"`,
        `"${row.method.replace(/"/g, '""')}"`,
        `"${row.acc.replace(/"/g, '""')}"`,
        row.amount,
        row.commission,
        row.rate,
        row.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ingress_ledger_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Simulate gateway streaming ledger updates periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Add a simulated settled transaction at the top
      const randomAmount = Math.floor(Math.random() * 5000) + 150;
      const ids = ['TRX-88301', 'TRX-88302', 'TRX-88303', 'TRX-88304'];
      const randomId = ids[Math.floor(Math.random() * ids.length)] + Math.floor(Math.random() * 90);
      const merchants = ['Twitch Interactive', 'Steam Games MiddleEast', 'Egypt Fashion Portal', 'Suez Maritime Inc'];
      const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
      
      const newEntry = {
        id: randomId,
        timestamp: new Date().toTimeString().split(' ')[0],
        merchant: randomMerchant,
        tier: 'API Node Ingress',
        method: Math.random() > 0.4 ? 'Vodafone Cash' : 'InstaPay',
        acc: 'Ops 01',
        amount: randomAmount,
        commission: Math.floor(randomAmount * 0.02),
        rate: '2%',
        status: 'Settled'
      };

      setActiveLedger(prev => [newEntry, ...prev.slice(0, 3)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const approvePending = (id: string) => {
    setActiveLedger(prev => 
      prev.map(item => item.id === id ? { ...item, status: 'Settled' } : item)
    );
    alert(t("Manually authorized transaction"));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      
      {/* Cockpit Status Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface">{t("Operator Cockpit")}</h1>
          <p className="text-on-surface-variant text-sm mt-1">{t("Real-time gateway monitoring & payment account management.")}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{t("System Status")}</span>
            <div className="flex items-center gap-2 text-secondary mt-1">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span className="text-xs font-bold uppercase">{t("Optimal Ingress Live")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Side: Summary Metrics & Accounts */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Stats strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 rounded-2xl shadow-sm">
              <p className="text-on-surface-variant font-bold text-xs uppercase tracking-wider mb-2">{t("Total Volume (24h)")}</p>
              <h4 className="text-2xl font-extrabold text-primary">EGP 1,240,500</h4>
              <div className="mt-2 flex items-center gap-1 text-secondary text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{t("+12.4% Optimal")}</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl shadow-sm">
              <p className="text-on-surface-variant font-bold text-xs uppercase tracking-wider mb-2">{t("Active Accounts Pool")}</p>
              <h4 className="text-2xl font-extrabold text-on-surface">18 / 24</h4>
              <div className="mt-3 w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div className="bg-primary h-full w-3/4 rounded-full"></div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl shadow-sm">
              <p className="text-on-surface-variant font-bold text-xs uppercase tracking-wider mb-2">{t("Dispute queue depth")}</p>
              <h4 className="text-2xl font-extrabold text-[#ba1a1a]">4 {t("Tickets Pending")}</h4>
              <div className="mt-2 flex items-center gap-1 text-[#ba1a1a] text-xs font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{t("Critical allocation focus")}</span>
              </div>
            </div>
          </div>

          {/* Assigned Accounts Core Table */}
          <div className="glass-card rounded-2xl shadow-sm overflow-hidden border border-outline-variant/30">
            <div className="p-6 flex justify-between items-center border-b border-outline-variant/30 bg-surface-container-lowest">
              <h3 className="font-bold text-base text-on-surface">{t("Assigned Accounts")}</h3>
              <div className="flex gap-2">
                <button className="p-1.5 text-on-surface-variant hover:bg-surface-container rounded-lg" onClick={() => alert("Sorting assigned limits...")}>
                  <Terminal className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container text-on-surface-variant text-[11px] font-bold tracking-wider uppercase border-b border-outline-variant/30">
                  <tr>
                    <th className="px-6 py-4">{t("Account Label")}</th>
                    <th className="px-6 py-4">{t("Daily Limit Usage")}</th>
                    <th className="px-6 py-4">{t("Status")}</th>
                    <th className="px-6 py-4">{t("Priority")}</th>
                    <th className="px-6 py-4 text-right">{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/35 text-xs">
                  {activeAccounts.map((acc, index) => (
                    <tr key={index} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary">
                            {acc.icon}
                          </div>
                          <div>
                            <p className="font-bold text-on-surface">{acc.name}</p>
                            <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">{acc.number}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="w-44">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span>{Math.round((acc.used / acc.limit) * 100)}% Used</span>
                            <span>{acc.used.toLocaleString()} / {(acc.limit / 1000).toFixed(0)}k</span>
                          </div>
                          <div className="w-[180px] bg-surface-container rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${acc.used / acc.limit > 0.8 ? 'bg-[#ba1a1a]' : 'bg-primary'}`} 
                              style={{ width: `${(acc.used / acc.limit) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${acc.status === 'Active' ? 'bg-[#6cf8bb] text-[#002113]' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                          {acc.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-semibold text-primary">{t(acc.priority)}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-on-surface-variant hover:text-primary"><MoreVertical className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Side: Dispute Queue Triage & Live Heatmap */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          
          {/* Dispute Triage queue */}
          <div className="glass-card rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h3 className="font-bold text-sm text-on-surface">{t("Dispute Ticket Queue")}</h3>
              <span className="bg-[#ba1a1a] text-white px-2 py-0.5 rounded-full text-[10px] font-bold">2 {t("NEW")}</span>
            </div>

            <div className="p-4 space-y-4">
              {disputeQueue.map((ticket, index) => (
                <div key={index} className="p-4 rounded-xl border border-outline-variant/30 bg-surface-container-lowest hover:shadow-md transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-mono font-bold text-on-surface-variant">{ticket.id}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${ticket.label === 'CRITICAL' ? 'bg-red-100 text-[#ba1a1a]' : 'bg-indigo-100 text-primary'}`}>
                      {t(ticket.label)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface">{t(ticket.title)}</h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-1">{t(ticket.desc)}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-3 text-primary font-bold text-xs text-center border-t border-outline-variant/30 hover:bg-surface-container-low transition-colors">
              {t("Open Complete Dispute Workspace")}
            </button>
          </div>

          {/* Visual Heatmap simulator */}
          <div className="glass-card rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden min-h-[190px]">
            <div className="p-6">
              <h3 className="font-bold text-sm text-on-surface">{t("Live Ingress Load Peak")}</h3>
              <p className="text-[11px] text-on-surface-variant mt-1">{t("Multi-threaded API request flow rates")}</p>
              
              <div className="h-24 flex items-end justify-between gap-1.5 mt-6 px-1">
                {[15, 23, 42, 59, 31, 79, 94, 62, 45, 12, 50, 64].map((bar, idx) => (
                  <div key={idx} className="flex-1 bg-primary/20 h-full rounded-t-sm flex flex-col justify-end">
                    <div className="bg-primary rounded-t-sm w-full animate-pulse" style={{ height: `${bar}%`, animationDelay: `${idx * 0.1}s` }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic Streaming Transaction Ledger */}
      <div className="col-span-12">
        <div className="glass-card rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/30 bg-surface-container-lowest">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-base text-on-surface tracking-tight">{t("System Live Ingress Ledger")}</h3>
              <span className="bg-[#dfe3ff] text-[#001452] px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest animate-pulse">{t("STREAMING")}</span>
            </div>

            <button 
              onClick={exportLedgerCSV}
              className="flex items-center gap-1.5 bg-primary hover:bg-[#002f9e] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-white" />
              {t("Export Data")}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-surface-container-low text-on-surface-variant font-bold uppercase text-[10px] tracking-widest border-b border-outline-variant/30">
                <tr>
                  <th className="px-6 py-4">{t("Timestamp")}</th>
                  <th className="px-6 py-4">{t("Merchant Entity")}</th>
                  <th className="px-6 py-4">{t("Method & Account")}</th>
                  <th className="px-6 py-4">{t("Amount (EGP)")}</th>
                  <th className="px-6 py-4">{t("Settle Kickback")}</th>
                  <th className="px-6 py-4">{t("Status")}</th>
                  <th className="px-6 py-4 text-right">{t("Triage")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/35 font-medium">
                {activeLedger.map((row) => (
                  <tr key={row.id} className="hover:bg-surface-container-lowest transition-all group">
                    <td className="px-6 py-5 font-mono text-[11px] text-on-surface-variant">{row.timestamp}</td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-on-surface">{row.merchant}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{row.tier}</p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-on-surface font-semibold">{row.method}</p>
                      <p className="text-[10px] text-on-surface-variant">Account: {row.acc}</p>
                    </td>

                    <td className="px-6 py-5 font-bold font-mono text-primary">
                      EGP {row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-5 text-on-surface-variant text-[11px]">
                      EGP {row.commission.toFixed(2)} ({row.rate})
                    </td>

                    <td className="px-6 py-5">
                      {row.status === 'Settled' ? (
                        <div className="flex items-center gap-1 text-secondary font-bold text-[10px] uppercase tracking-wider">
                          <CheckCircle className="w-3.5 h-3.5 text-secondary" />
                          <span>{t("Delivered")}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-600 font-bold text-[10px] uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                          <span>{t("Verification")}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-5 text-right">
                      {row.status === 'In Progress' ? (
                        <button 
                          onClick={() => approvePending(row.id)}
                          className="bg-primary hover:bg-[#002f9e] text-white px-3 py-1.5 rounded-lg font-bold text-[11px] shadow-sm transform active:scale-95 duration-100"
                        >
                          {t("Verify Action")}
                        </button>
                      ) : (
                        <button 
                          onClick={() => alert(`Details for TRX ${row.id} parsed locally.`)}
                          className="border border-outline-variant/60 hover:bg-surface-container px-3 py-1.5 rounded-lg text-on-surface-variant font-bold text-[11px] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {t("Inspect File")}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
