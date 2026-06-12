import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  HelpCircle, 
  CheckCircle2, 
  Search, 
  X, 
  TrendingUp, 
  Sliders, 
  ArrowUpRight, 
  Sparkles, 
  FileText, 
  RefreshCcw,
  Check,
  Download
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function TreasuryHub() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab2] = useState('All Payouts');
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const [payouts, setPayouts] = useState([
    { id: '#TRX-98210', merchant: 'Luxury Goods Co.', type: 'Main Merchant', bank: 'Chase Bank •••• 4492', method: 'Wire Transfer', amount: 45000, status: 'PENDING', date: 'Oct 24, 14:22' },
    { id: '#TRX-98155', merchant: 'Apex Global Ltd', type: 'Enterprise Account', bank: 'Vodafone Cash •••• 0101', method: 'P2P Wallet', amount: 12400, status: 'PAID', date: 'Oct 24, 09:15' },
    { id: '#TRX-98104', merchant: 'Swift Tech', type: 'Master Merchant', bank: 'HSBC Int •••• 8812', method: 'SWIFT Payout', amount: 220000, status: 'APPROVED', date: 'Oct 23, 18:30' }
  ]);

  const exportCSV = () => {
    const filteredDataset = payouts.filter(row => {
      if (activeTab === 'Pending (24)') return row.status === 'PENDING';
      if (activeTab === 'Approved (18)') return row.status === 'APPROVED' || row.status === 'PAID';
      return true;
    });

    const headers = ['Request ID', 'Merchant', 'Type', 'Account Destination', 'Method', 'Amount (USD)', 'Status', 'Date'];
    const csvContent = [
      headers.join(','),
      ...filteredDataset.map(row => [
        row.id,
        `"${row.merchant.replace(/"/g, '""')}"`,
        `"${row.type.replace(/"/g, '""')}"`,
        `"${row.bank.replace(/"/g, '""')}"`,
        `"${row.method.replace(/"/g, '""')}"`,
        row.amount,
        row.status,
        `"${row.date.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `treasury_filtered_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const approveRequest = (id: string, action: 'APPROVED' | 'PAID') => {
    setPayouts(prev => 
      prev.map(row => row.id === id ? { ...row, status: action } : row)
    );
    alert(t("Successfully authorized settlement"));
  };

  const createPayout = () => {
    const amountStr = prompt(t("Enter payout amount in USD:"));
    const amount = parseFloat(amountStr || '0');
    if (amount > 0) {
      const id = '#TRX-' + Math.floor(Math.random() * 90000 + 10000);
      const newPayout = {
        id,
        merchant: 'Al-Baraka Retail Group',
        type: 'Standard Merchant',
        bank: 'CIB Egypt •••• 9211',
        method: 'Local Bank Wire',
        amount,
        status: 'PENDING',
        date: 'Just now'
      };
      setPayouts([newPayout, ...payouts]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">{t("Treasury & Withdrawal Hub")}</h1>
          <p className="text-on-surface-variant text-sm mt-1">{t("Manage liquidity payout distributions and review active merchant cash-out parameters.")}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder={t("Search request ID or bank...")}
              className="pl-9 pr-4 py-2 border-none bg-surface-container rounded-full text-xs font-semibold focus:ring-2 focus:ring-primary w-64 outline-none"
            />
          </div>
          <button className="p-2.5 bg-surface-container hover:bg-surface-container-high rounded-full transition-colors">
            <RefreshCcw className="w-4 h-4 text-on-surface-variant" />
          </button>
        </div>
      </div>

      {/* Dynamic Summary Bento Box Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Available Pool */}
        <div className="glass-card p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-4 right-4 opacity-10 group-hover:scale-110 transition-transform">
            <Building2 className="w-16 h-16 text-primary" />
          </div>
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">{t("Available Liquidity Pool")}</p>
          <h3 className="text-2xl font-extrabold text-[#003ec7]">$1,284,402.10</h3>
          <div className="mt-3 flex items-center gap-1 text-[11px] text-[#006c49] font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t("+4.2% optimized capacity limits")}</span>
          </div>
        </div>

        {/* Pending Card */}
        <div className="glass-card p-6 rounded-2xl shadow-sm border-l-4 border-primary">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">{t("Pending Signatures")}</p>
          <h3 className="text-2xl font-extrabold text-on-surface">24</h3>
          <p className="text-xs text-on-surface-variant mt-2 font-medium">{t("Reconciliation bounds satisfied")}</p>
        </div>

        {/* Scheduled Card */}
        <div className="glass-card p-6 rounded-2xl shadow-sm">
          <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">{t("Scheduled for Payout Today")}</p>
          <h3 className="text-2xl font-extrabold text-on-surface">{t("12 batch items")}</h3>
          
          <div className="w-full bg-surface-container rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-primary h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>

        {/* Quick action card */}
        <div className="bg-primary-container hover:bg-opacity-95 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between h-inherit min-h-[150px]">
          <div>
            <p className="text-[11px] text-white/80 font-bold uppercase tracking-wider mb-1">{t("Operator Action")}</p>
            <h4 className="text-base font-bold text-white">{t("Transfer Treasury Ingress")}</h4>
          </div>
          <button 
            onClick={createPayout}
            className="w-full py-2.5 bg-white text-primary rounded-xl font-extrabold text-xs shadow hover:bg-opacity-95 transition-all text-center"
          >
            {t("Initiate Cash-Out Wire")}
          </button>
        </div>

      </section>

      {/* Main Table view layout block */}
      <div className="bg-white rounded-2xl shadow-sm border border-outline-variant/35 overflow-hidden">
        
        {/* Navigation tabs row */}
        <div className="px-6 pt-4 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-6">
            {['All Payouts', 'Pending (24)', 'Approved (18)'].map((tab) => (
              <button 
                key={tab}
                className={`pb-4 font-bold text-xs cursor-pointer transition-all ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
                onClick={() => setActiveTab2(tab)}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 pb-2">
            <button className="p-1 px-2 border border-outline-variant/60 hover:bg-surface-container rounded-lg text-on-surface-variant text-xs font-bold" onClick={() => alert("Bulk verification triggered...")}>
              {t("Filter Properties")}
            </button>
            <button 
              onClick={exportCSV}
              className="flex items-center gap-1.5 p-1 px-3 bg-primary hover:bg-[#002f9e] text-white rounded-lg text-xs font-bold shadow-xs transition-all duration-150"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>{t("Export Data")}</span>
            </button>
          </div>
        </div>

        {/* Payout records data table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-surface-container-low text-on-surface-variant font-bold uppercase text-[10px] tracking-widest border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4">{t("Request ID")}</th>
                <th className="px-6 py-4">{t("Merchant / Source")}</th>
                <th className="px-6 py-4">{t("Destination Account")}</th>
                <th className="px-6 py-4">{t("Cash Out Pool (USD)")}</th>
                <th className="px-6 py-4">{t("Status")}</th>
                <th className="px-6 py-4">{t("Timestamp")}</th>
                <th className="px-6 py-4 text-right">{t("Verification Action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40 font-medium">
              {payouts.map((row) => (
                <tr key={row.id} className="hover:bg-surface-container-low/20 transition-all group">
                  <td className="px-6 py-5 font-mono font-bold text-primary text-xs">{row.id}</td>
                  <td className="px-6 py-5">
                    <p className="font-bold text-on-surface">{row.merchant}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">{row.type}</p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-on-surface font-semibold">{row.bank}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase mt-0.5">{row.method}</p>
                  </td>

                  <td className="px-6 py-5 font-bold font-mono">
                    ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-6 py-5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center gap-1.5 w-fit ${
                      row.status === 'PENDING' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                      row.status === 'APPROVED' ? 'bg-[#dfe3ff] text-[#001452]' : 'bg-[#6cf8bb] text-[#002113]'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${row.status === 'PENDING' ? 'bg-[#ba1a1a]' : row.status === 'APPROVED' ? 'bg-primary animate-pulse' : 'bg-secondary'}`} />
                      {row.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-on-surface-variant font-medium">{row.date}</td>

                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {row.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => approveRequest(row.id, 'APPROVED')} 
                            className="px-3 py-1.5 bg-[#006c49] text-white rounded font-bold text-[10px]"
                          >
                            {t("APPROVE")}
                          </button>
                          <button 
                            onClick={() => approveRequest(row.id, 'PAID')} 
                            className="px-3 py-1.5 bg-primary text-white rounded font-bold text-[10px]"
                          >
                            {t("DISBURSE")}
                          </button>
                        </>
                      )}
                      {row.status === 'APPROVED' && (
                        <button 
                          onClick={() => approveRequest(row.id, 'PAID')} 
                          className="px-3 py-1.5 bg-primary text-white rounded font-bold text-[10px]"
                        >
                          {t("MARK AS PAID")}
                        </button>
                      )}
                      {row.status === 'PAID' && (
                        <span className="text-secondary font-bold text-[10px] uppercase flex items-center gap-1 pr-2">
                          <Check className="w-3.5 h-3.5" /> {t("Disbursed")}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </motion.div>
  );
}
