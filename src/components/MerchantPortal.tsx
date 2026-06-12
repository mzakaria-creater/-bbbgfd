import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Search, 
  Smartphone, 
  CreditCard, 
  Globe2, 
  Calendar, 
  CheckCircle2, 
  Lock, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldAlert, 
  MoreVertical,
  Plus,
  Upload
} from 'lucide-react';

export default function MerchantPortal() {
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('25000');
  const [payoutDestination, setPayoutDestination] = useState('Chase Bank •••• 4492');

  const [merchants, setMerchants] = useState<any[]>(() => {
    const saved = localStorage.getItem('finlux_merchants');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const defaults = [
      { id: 'MCH-8821', name: 'Global Retail Inc.', balance: 450221.50, influx: 1284500, fees: 25690, limit: 1000000, logoUrl: '', monthlyLimit: 10000000, ledger: [
        { id: '#TRX-88219', method: 'Vodafone Cash', type: 'credit', value: 2500, status: 'Completed', time: '2 mins ago', bg: 'bg-red-50' },
        { id: '#TRX-88218', method: 'InstaPay', type: 'debit', value: 1200, status: 'Pending', time: '15 mins ago', bg: 'bg-indigo-50' },
        { id: '#TRX-88217', method: 'Bank Transfer', type: 'credit', value: 15000, status: 'Completed', time: '1 hour ago', bg: 'bg-emerald-50' }
      ]},
      { id: 'MCH-9901', name: 'Neo Shop Global', balance: 128450.00, influx: 680200, fees: 13600, limit: 500000, logoUrl: '', monthlyLimit: 5000000, ledger: [
        { id: '#TRX-99011', method: 'InstaPay', type: 'credit', value: 5000, status: 'Completed', time: '10 mins ago', bg: 'bg-indigo-50' },
        { id: '#TRX-99012', method: 'Vodafone Cash', type: 'debit', value: 850, status: 'Completed', time: '40 mins ago', bg: 'bg-red-50' }
      ]},
      { id: 'MCH-4412', name: 'OnTarget Egyptian Trade', balance: 78620.00, influx: 240500, fees: 4810, limit: 200000, logoUrl: '', monthlyLimit: 2000000, ledger: [
        { id: '#TRX-44121', method: 'KNET Gateway', type: 'credit', value: 12000, status: 'Completed', time: '2 hours ago', bg: 'bg-teal-50' }
      ]},
      { id: 'MCH-3041', name: 'Cairo Goods Ltd.', balance: 312000.00, influx: 915800, fees: 18300, limit: 800000, logoUrl: '', monthlyLimit: 8000000, ledger: [
        { id: '#TRX-30411', method: 'Fawry Pay', type: 'credit', value: 4500, status: 'Completed', time: '5 mins ago', bg: 'bg-amber-50' },
        { id: '#TRX-30412', method: 'Orange Money', type: 'credit', value: 19000, status: 'Completed', time: '12 mins ago', bg: 'bg-orange-50' }
      ]}
    ];
    localStorage.setItem('finlux_merchants', JSON.stringify(defaults));
    return defaults;
  });

  const [activeMerchantId, setActiveMerchantId] = useState('MCH-8821');
  const activeMerchant = merchants.find(m => m.id === activeMerchantId) || merchants[0];

  const saveMerchantsState = (newValue: any[]) => {
    setMerchants(newValue);
    localStorage.setItem('finlux_merchants', JSON.stringify(newValue));
  };

  const dispatchPayoutRequest = () => {
    const val = parseFloat(payoutAmount) || 0;
    if (val <= 0) {
      alert("Please specify a valid numeric amount to cash out.");
      return;
    }
    if (val > activeMerchant.balance) {
      alert("Insufficient funds in available cash out pool ledger.");
      return;
    }

    const updatedLedger = [
      {
        id: '#TRX-' + Math.floor(Math.random()*9000 + 1000),
        method: 'Cashed-Out ' + payoutDestination.split(' •••• ')[0],
        type: 'debit',
        value: val,
        status: 'Pending',
        time: 'Just now',
        bg: 'bg-indigo-50'
      },
      ...activeMerchant.ledger
    ];

    const updatedMerchants = merchants.map(m => {
      if (m.id === activeMerchantId) {
        return {
          ...m,
          balance: m.balance - val,
          ledger: updatedLedger
        };
      }
      return m;
    });

    saveMerchantsState(updatedMerchants);
    setShowPayoutModal(false);
    alert(`Successfully compiled payout request of EGP ${val.toLocaleString()}. Your funds bounds have been reserved.`);
  };

  const handleMerchantLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const updated = merchants.map(m => {
          if (m.id === activeMerchantId) {
            return { ...m, logoUrl: base64 };
          }
          return m;
        });
        saveMerchantsState(updated);
        alert("Merchant brand logo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const raiseDisputeForTrx = (trx: any) => {
    const complaintDesc = prompt(`Describe the dispute for transaction ${trx.id} (${trx.method}):`) || "Dispatched dispute due to client payment audit conflict.";
    const id = '#TK-' + Math.floor(Math.random() * 90000 + 10000);
    const newDispute = {
      id,
      time: 'Created Just now',
      tx: trx.id,
      merchant: activeMerchant.name,
      status: 'Open',
      agent: 'Unassigned',
      priority: 'High',
      value: trx.value,
      desc: complaintDesc,
      attachment: ''
    };

    const savedDisputesStr = localStorage.getItem('finlux_disputes');
    let disputes = [];
    if (savedDisputesStr) {
      try {
        disputes = JSON.parse(savedDisputesStr);
      } catch (e) {}
    }
    disputes = [newDispute, ...disputes];
    localStorage.setItem('finlux_disputes', JSON.stringify(disputes));

    alert(`Successfully raised Dispute Ticket ${id} for Transaction ${trx.id}! Admin has been alerted.`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      
      {/* isolated header profile context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          {/* Merchant Dynamic Logo Upload */}
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-outline-variant/60 flex items-center justify-center font-bold text-primary overflow-hidden shadow-sm">
              {activeMerchant.logoUrl ? (
                <img src={activeMerchant.logoUrl} alt="merchant brand" className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-primary" />
              )}
            </div>
            
            <label className="absolute -bottom-1 -right-1 bg-white border border-outline shadow p-1 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <Upload className="w-3.5 h-3.5 text-on-surface-variant" />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleMerchantLogoUpload} 
                className="hidden" 
              />
            </label>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-[#191b25] tracking-tight">Merchant Portal Dashboard</h2>
              {/* Selector Dropdown */}
              <select
                value={activeMerchantId}
                onChange={(e) => setActiveMerchantId(e.target.value)}
                className="bg-surface-container-high border border-outline-variant text-[#191b25] text-xs font-bold py-1.5 px-3 rounded-lg focus:ring-1 focus:ring-primary outline-none inline-block shadow-sm"
              >
                {merchants.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <p className="text-on-surface-variant font-semibold text-xs mt-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-primary" /> Strictly isolated data context representing <strong className="text-primary font-bold">ID: {activeMerchant.id}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-high rounded-full px-5 py-2 border border-outline-variant/30">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-on-surface-variant">Last 30 Days: Oct 01 - Oct 30</span>
        </div>
      </div>

      {/* Bento Grid Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Main merchant volume bento pane */}
        <div className="md:col-span-2 bg-primary text-white p-6 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between h-48">
          <div className="relative z-10">
            <p className="text-[11px] text-white/80 font-bold uppercase tracking-widest">Total Transaction Influx</p>
            <h3 className="text-3xl font-extrabold tracking-tight mt-2">{(activeMerchant.influx || 0).toLocaleString()}.00 EGP</h3>
          </div>
          
          <div className="relative z-10 flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-1 rounded-full w-fit">
            <TrendingUp className="w-3.5 h-3.5" /> +12.5% vs past cyclic parameters
          </div>

          <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
            <Globe2 className="w-48 h-48" />
          </div>
        </div>

        {/* Current Balance */}
        <div className="bg-white border border-outline-variant/60 p-6 rounded-2xl flex flex-col justify-between h-48 shadow-xs hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Available Balance</p>
              <CheckCircle2 className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="text-xl font-extrabold text-[#191b25] mt-3">
              EGP {(activeMerchant.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>

          <button 
            onClick={() => setShowPayoutModal(true)}
            className="w-full py-2.5 bg-primary hover:bg-[#002f9e] text-white rounded-xl font-bold text-xs"
          >
            Disburse Balance
          </button>
        </div>

        {/* Aggregate Fees */}
        <div className="bg-white border border-outline-variant/60 p-6 rounded-2xl flex flex-col justify-between h-48 shadow-xs hover:shadow-md transition-shadow">
          <div>
            <div className="flex justify-between items-start">
              <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Aggregated Processing Fees</p>
              <span className="text-xs font-bold text-amber-700">%</span>
            </div>
            <h3 className="text-xl font-extrabold text-[#191b25] mt-3">{(activeMerchant.fees || 0).toLocaleString()}.00 EGP</h3>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold">
            <span className="w-2 h-2 rounded-full bg-secondary"></span> Avg rate: 2.0% + 5 EGP
          </div>
        </div>

      </div>

      {/* Ledger and methods structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ledger */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between overflow-hidden">
          <div>
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
              <h4 className="text-base font-extrabold text-on-surface">Sandbox isolated P2P Ledger (Live Sync)</h4>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Direct Merchant Logs</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr className="text-on-surface-variant font-bold text-[10px] tracking-wider uppercase">
                    <th className="p-4 pl-6">ID Code</th>
                    <th className="p-4">Disbursement Method</th>
                    <th className="p-4">Value (EGP)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-medium">
                  {activeMerchant.ledger.map((row: any, idx: number) => (
                    <tr key={idx} className="hover:bg-surface-container-low/20 transition-colors">
                      <td className="p-4 pl-6">
                        <p className="font-bold text-on-surface">{row.id}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{row.time}</p>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-100`}>
                            {row.method[0]}
                          </div>
                          <span>{row.method}</span>
                        </div>
                      </td>

                      <td className="p-4 font-mono font-bold text-on-surface text-xs">
                        {row.type === 'credit' ? '+' : '-'} {row.value.toLocaleString()}.00 EGP
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          row.status === 'Completed' ? 'bg-[#6cf8bb] text-[#002113]' : 'bg-[#dfe3ff] text-[#001452]'
                        }`}>
                          {row.status}
                        </span>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => raiseDisputeForTrx(row)}
                          className="px-3 py-1 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] rounded-lg font-bold text-[10px] transition-all inline-flex items-center gap-1 shadow-2xs"
                        >
                          <ShieldAlert className="w-3 h-3" />
                          <span>Dispute</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="p-4 bg-surface border-t border-outline-variant/30 text-center">
            <button className="text-primary font-bold hover:underline" onClick={() => alert("Loading historical client logs...")}>View Interactive Audit Ledger</button>
          </div>
        </div>

        {/* Dynamic routing limits */}
        <aside className="space-y-6">
          
          <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-on-surface">Configured Routing Methods</h4>
            
            <div className="space-y-2 text-xs font-semibold text-on-surface-variant">
              <div className="flex justify-between items-center p-3.5 bg-surface rounded-xl border border-outline-variant/40">
                <span className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-[#ba1a1a]" /> Vodafone Cash</span>
                <span className="font-bold text-primary">3 Accounts active</span>
              </div>

              <div className="flex justify-between items-center p-3.5 bg-surface rounded-xl border border-outline-variant/40">
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-primary" /> InstaPay Jordan/Egypt</span>
                <span className="font-bold text-primary">5 Accounts active</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-bold text-sm text-on-surface">Daily Sandboxed Limits</h4>
            
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Daily Transaction limit utilized</span>
                  <span className="text-primary font-bold">72%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '72%' }} />
                </div>
                <p className="text-right text-[10px] text-on-surface-variant pt-1 font-bold">{(activeMerchant.limit * 0.72).toLocaleString()} / {activeMerchant.limit.toLocaleString()} EGP daily limit</p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Monthly Accumulative bounds</span>
                  <span className="text-secondary font-bold">45%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: '45%' }} />
                </div>
                <p className="text-right text-[10px] text-on-surface-variant pt-1 font-bold">{(activeMerchant.monthlyLimit * 0.45).toLocaleString()} / {activeMerchant.monthlyLimit.toLocaleString()} EGP cyclic limit</p>
              </div>
            </div>
          </div>

        </aside>

      </div>

      {/* Disbursment Cashout Modal */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-[#0c0c1b]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 border border-outline-variant"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-on-surface">Draft Payout Instruction</h3>
              <button 
                onClick={() => setShowPayoutModal(false)} 
                className="text-on-surface-variant hover:text-on-surface font-extrabold"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Verify the destination before committing available merchant pool balances. Disbursing funds initiates an automated webhook callback.
            </p>

            <div className="space-y-3 font-semibold text-xs text-on-surface">
              <div>
                <label className="block text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Destination Target</label>
                <select 
                  value={payoutDestination}
                  onChange={(e) => setPayoutDestination(e.target.value)}
                  className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold"
                >
                  <option>Chase Bank •••• 4492</option>
                  <option>Instapay ID: alex_payout_egy</option>
                  <option>CIB Egypt •••• 9211</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">Amount (EGP)</label>
                <input 
                  type="number"
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full p-3 bg-surface border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-bold"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button 
                onClick={() => setShowPayoutModal(false)}
                className="flex-grow py-3 border border-outline rounded-xl font-bold text-xs text-on-surface-variant hover:bg-surface"
              >
                Cancel
              </button>
              <button 
                onClick={dispatchPayoutRequest}
                className="flex-grow py-3 bg-[#006c49] text-white rounded-xl font-bold text-xs"
              >
                Confirm Transfer
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
}
