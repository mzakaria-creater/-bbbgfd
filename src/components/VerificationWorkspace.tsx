import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Check, CheckCircle2, Download, FileText, Flag, RotateCw, Search, ShieldCheck, ZoomIn, ZoomOut } from 'lucide-react';

const initialTransactions = [
  { id: 'TXN-8842-9901', name: 'Z. Volkov', amount: '$12,450.00', risk: 'HIGH', wait: '04m 22s', score: 78, date: "May 14, '26", expected: "May 15, '26", merchant: 'Volkov Heavy Industries' },
  { id: 'TXN-7712-4431', name: 'Global Logistics Inc.', amount: '$2,100.00', risk: 'LOW', wait: '12m 45s', score: 18, date: "May 15, '26", expected: "May 15, '26", merchant: 'Global Logistics Inc.' },
  { id: 'TXN-9021-0012', name: 'Sarah Jenkins', amount: '$455.20', risk: 'MED', wait: '18m 10s', score: 49, date: "May 15, '26", expected: "May 15, '26", merchant: 'Jenkins Retail' },
  { id: 'TXN-1156-8822', name: 'CryptoNode Ltd.', amount: '$45,000.00', risk: 'HIGH', wait: '22m 05s', score: 91, date: "May 13, '26", expected: "May 15, '26", merchant: 'CryptoNode Ltd.' },
];

export default function VerificationWorkspace() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [selected, setSelected] = useState(initialTransactions[0]);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(85);
  const visible = useMemo(() => transactions.filter(item => `${item.id} ${item.name} ${item.amount}`.toLowerCase().includes(query.toLowerCase())), [transactions, query]);
  const conflict = selected.date !== selected.expected;
  const removeSelected = (message: string) => {
    const remaining = transactions.filter(item => item.id !== selected.id);
    setTransactions(remaining);
    if (remaining[0]) setSelected(remaining[0]);
    alert(message);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div><p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary">OnTarget Ledger</p><h1 className="text-3xl font-extrabold tracking-tight">Admin Verification Workspace</h1><p className="text-sm text-on-surface-variant mt-1">Deep proof review and transaction queue operations.</p></div>
        <div className="flex gap-2"><span className="px-3 py-2 rounded-lg bg-surface-container-low text-xs font-bold">System Health: 99.8%</span><span className="px-3 py-2 rounded-lg bg-blue-100 text-blue-800 text-xs font-bold">Queue: {transactions.length} Requests</span></div>
      </div>

      <div className="grid grid-cols-12 min-h-[720px] rounded-2xl overflow-hidden border border-outline-variant shadow-xl bg-white">
        <aside className="col-span-12 lg:col-span-3 xl:col-span-2 bg-[#eff4ff] border-r border-outline-variant/30 flex flex-col">
          <div className="p-4 border-b border-outline-variant/30"><h2 className="font-extrabold text-xs uppercase tracking-wider mb-3">Pending Verification</h2><label className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-lg"><Search className="w-4 h-4 text-outline" /><input value={query} onChange={e => setQuery(e.target.value)} className="bg-transparent outline-none text-xs min-w-0 w-full" placeholder="Filter ID or amount" /></label></div>
          <div className="p-3 space-y-2 overflow-y-auto">
            {visible.map(item => <button key={item.id} onClick={() => setSelected(item)} className={`w-full text-left p-3 rounded-xl transition-all ${selected.id === item.id ? 'bg-white border-l-4 border-blue-600 shadow-sm' : 'bg-white/50 hover:bg-white'}`}>
              <div className="flex justify-between gap-2 mb-2"><span className={`text-[9px] font-extrabold px-2 py-0.5 rounded ${item.risk === 'HIGH' ? 'bg-red-100 text-red-800' : item.risk === 'LOW' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{item.risk} RISK</span><span className="text-[9px] text-on-surface-variant">{item.wait}</span></div>
              <p className="font-bold text-xs">{item.id}</p><div className="flex justify-between items-end gap-2 mt-2"><span className="text-[10px] text-on-surface-variant truncate">{item.name}</span><span className="text-xs font-extrabold text-blue-700">{item.amount}</span></div>
            </button>)}
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-6 xl:col-span-7 bg-[#0d1c32] flex flex-col relative min-h-[640px]">
          <div className="px-5 py-3 flex justify-between items-center border-b border-white/10 text-slate-300"><div className="flex gap-4 items-center"><button onClick={() => setZoom(Math.min(120, zoom + 5))}><ZoomIn className="w-4 h-4" /></button><button onClick={() => setZoom(Math.max(50, zoom - 5))}><ZoomOut className="w-4 h-4" /></button><RotateCw className="w-4 h-4" /><span className="text-[10px]">{zoom}% Zoom</span></div><div className="flex gap-2 text-[10px] items-center">IMAGE_PROOF_01.JPG <Download className="w-4 h-4" /></div></div>
          <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(circle_at_center,_#1a2b45_0%,_#0d1c32_100%)] overflow-auto">
            <div style={{ transform: `scale(${zoom / 100})` }} className="transition-transform origin-center w-[440px] min-h-[570px] bg-[#fffefa] shadow-2xl p-12 text-[#172033] relative">
              <div className="flex justify-between border-b-2 border-blue-700 pb-5"><div><p className="text-blue-700 font-black text-xl">SOVEREIGN BANK</p><p className="text-[9px] uppercase tracking-widest">Payment confirmation</p></div><FileText className="w-9 h-9 text-blue-700" /></div>
              <p className="text-[10px] text-gray-500 mt-8">Transaction reference</p><p className="font-mono font-bold">{selected.id}</p>
              <div className="mt-10 space-y-6 text-xs"><div><p className="text-gray-500">Sender</p><p className="font-bold text-base">{selected.name}</p></div><div><p className="text-gray-500">Merchant destination</p><p className="font-bold">{selected.merchant}</p></div><div><p className="text-gray-500">Settlement date</p><p className="font-bold">{selected.date}</p></div></div>
              <div className="absolute bottom-12 left-12 right-12 border-t pt-5 flex justify-between items-end"><div><p className="text-gray-500 text-[10px]">Total amount</p><p className="text-2xl font-black text-blue-700">{selected.amount}</p></div><span className="text-[9px] font-bold text-emerald-700 border border-emerald-600 px-2 py-1 rotate-[-8deg]">PAYMENT SENT</span></div>
              <div className="absolute top-[31%] left-[9%] w-[42%] h-[12%] border-2 border-blue-500 bg-blue-500/10"><span className="absolute -top-5 left-0 bg-blue-600 text-white text-[8px] px-1">OCR: SENDER_NAME</span></div>
              <div className={`absolute top-[56%] left-[9%] w-[35%] h-[10%] border-2 ${conflict ? 'border-red-500 bg-red-500/10' : 'border-emerald-500 bg-emerald-500/10'}`}><span className={`absolute -top-5 left-0 text-white text-[8px] px-1 ${conflict ? 'bg-red-600' : 'bg-emerald-600'}`}>OCR: DATE</span></div>
              <div className="absolute bottom-[7%] left-[8%] w-[48%] h-[13%] border-2 border-blue-500 bg-blue-500/10"><span className="absolute -top-5 left-0 bg-blue-600 text-white text-[8px] px-1">OCR: TOTAL_AMOUNT</span></div>
            </div>
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2"><span className="bg-[#0d1c32] text-white px-4 py-2 rounded-full text-[10px] font-bold flex gap-2 items-center"><span className="w-2 h-2 bg-emerald-400 rounded-full" /> Metadata Matched</span>{conflict && <span className="bg-red-600 text-white px-4 py-2 rounded-full text-[10px] font-bold">1 Conflict Detected</span>}</div>
        </section>

        <aside className="col-span-12 lg:col-span-3 bg-[#f8f9ff] flex flex-col">
          <div className="p-5 border-b"><h2 className="font-extrabold text-lg">Verification Ledger</h2><p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Transaction Analysis</p></div>
          <div className="p-5 space-y-6 flex-1 overflow-y-auto">
            <div><div className="flex justify-between text-xs font-bold mb-2"><span>Risk Assessment</span><span className={selected.score > 70 ? 'text-red-600' : 'text-emerald-700'}>Score: {selected.score}/100</span></div><div className="h-1.5 bg-surface-container-high rounded-full"><div className={`h-full rounded-full ${selected.score > 70 ? 'bg-red-600' : 'bg-emerald-500'}`} style={{ width: `${selected.score}%` }} /></div></div>
            <div><h3 className="font-bold text-xs mb-3">Field Comparison</h3><div className="rounded-xl overflow-hidden border bg-white text-[10px]"><div className="grid grid-cols-3 bg-surface-container-high p-2 font-bold"><span>FIELD</span><span>SYSTEM</span><span>PROOF</span></div>{[['Sender', selected.name, selected.name], ['Amount', selected.amount, selected.amount], ['Date', selected.expected, selected.date]].map(row => <div key={row[0]} className={`grid grid-cols-3 p-2 border-t ${row[1] !== row[2] ? 'bg-red-50 text-red-700' : ''}`}><span>{row[0]}</span><span className="font-bold">{row[1]}</span><span className="font-bold">{row[2]}</span></div>)}</div></div>
            <div><h3 className="font-bold text-xs mb-3">Merchant Destination</h3><div className="p-3 bg-white border border-blue-600 rounded-lg"><p className="text-xs font-bold">{selected.merchant}</p><p className="text-[9px] text-on-surface-variant mt-1">Merchant ID: M-774211</p></div></div>
            <div><h3 className="font-bold text-xs mb-3">Audit Logs</h3><div className="border-l-2 pl-3 space-y-4 text-[10px]"><div><p className="font-bold">OCR Analysis Completed</p><p className="text-on-surface-variant">Today at 10:42 AM · AI Validator</p></div><div><p className="font-bold">Queue Entry</p><p className="text-on-surface-variant">Today at 10:38 AM · Gateway</p></div></div></div>
          </div>
          <div className="p-4 bg-[#eff4ff] border-t grid grid-cols-2 gap-2"><button onClick={() => removeSelected(`Approved ${selected.id}`)} className="col-span-2 bg-blue-700 text-white py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2"><ShieldCheck className="w-4 h-4" /> Approve Settlement</button><button className="bg-white border py-2.5 rounded-lg text-xs font-bold flex justify-center gap-1"><AlertTriangle className="w-4 h-4" /> Mismatch</button><button onClick={() => removeSelected(`Flagged ${selected.id} as suspicious`)} className="bg-red-600 text-white py-2.5 rounded-lg text-xs font-bold flex justify-center gap-1"><Flag className="w-4 h-4" /> Suspicious</button></div>
        </aside>
      </div>
    </motion.div>
  );
}
