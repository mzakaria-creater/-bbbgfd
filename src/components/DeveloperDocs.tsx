import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, CircleX, Code2, Copy, Play, RotateCcw, Search, WalletCards } from 'lucide-react';

const samples: Record<string, string> = {
  'Node.js': `const ledger = require('sovereign-ledger');
const client = new ledger.Client({ apiKey: 'sk_test_51Mz...' });

const transaction = await client.transactions.create({
  amount: 2000,
  currency: 'usd',
  description: 'Premium Subscription',
  metadata: { order_id: '6732' }
});`,
  Python: `from sovereign_ledger import Client

client = Client(api_key="sk_test_51Mz...")
transaction = client.transactions.create(
    amount=2000,
    currency="usd",
    description="Premium Subscription"
)`,
  PHP: `$ledger = new SovereignLedger\\Client('sk_test_51Mz...');
$transaction = $ledger->transactions->create([
  'amount' => 2000,
  'currency' => 'usd',
  'description' => 'Premium Subscription'
]);`,
  Go: `client := ledger.NewClient("sk_test_51Mz...")
transaction, err := client.Transactions.Create(&ledger.TransactionParams{
  Amount: 2000,
  Currency: "usd",
  Description: "Premium Subscription",
})`,
};

export default function DeveloperDocs() {
  const [language, setLanguage] = useState('Node.js');
  const [apiKey, setApiKey] = useState('sk_test_••••••••');
  const [running, setRunning] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const runRequest = () => {
    setRunning(true);
    setResponse(null);
    window.setTimeout(() => {
      setResponse(`{\n  "id": "txn_812391023",\n  "status": "settled",\n  "amount": 2000,\n  "created": 167823412\n}`);
      setRunning(false);
    }, 650);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div><div className="flex items-center gap-2"><div className="w-9 h-9 bg-blue-700 text-white rounded-lg flex items-center justify-center"><WalletCards className="w-5 h-5" /></div><h1 className="text-3xl font-extrabold tracking-tight">OnTarget Developers</h1></div><p className="text-sm text-on-surface-variant mt-2">API reference, examples, and an interactive test console.</p></div>
        <label className="flex items-center gap-2 bg-white border border-outline-variant/40 rounded-xl px-4 py-2.5"><Search className="w-4 h-4 text-outline" /><input className="outline-none bg-transparent text-xs min-w-56" placeholder="Search documentation..." /></label>
      </div>

      <div className="grid grid-cols-12 rounded-2xl overflow-hidden border border-outline-variant shadow-xl min-h-[760px] bg-white">
        <aside className="col-span-12 lg:col-span-2 bg-[#eff4ff] border-r p-5">
          <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mb-3">Core Documentation</p>
          <nav className="space-y-1 text-xs"><button className="w-full text-left px-3 py-2 rounded-lg bg-blue-100 text-blue-800 font-bold">Dashboard</button><button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50">Quickstart</button></nav>
          <p className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mt-8 mb-3">API Reference</p>
          <nav className="space-y-1 text-xs"><button className="w-full text-left px-3 py-2 rounded-lg font-bold">Transactions</button>{['Create Transaction', 'List all', 'Retrieve', 'Refund'].map((item, index) => <button key={item} className={`w-full text-left ml-3 px-3 py-1.5 border-l ${index === 0 ? 'text-blue-700 font-bold' : 'text-on-surface-variant'}`}>{item}</button>)}<button className="w-full text-left px-3 py-2 rounded-lg">Webhooks</button><button className="w-full text-left px-3 py-2 rounded-lg">Wallets</button></nav>
        </aside>

        <main className="col-span-12 lg:col-span-6 xl:col-span-7 p-7 xl:p-12 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4"><span className="bg-blue-100 text-blue-800 text-[9px] font-bold px-2 py-1 rounded uppercase">Post</span><code className="text-xs text-on-surface-variant">/v1/transactions</code></div>
          <h2 className="text-4xl xl:text-5xl font-extrabold tracking-tight">Create a Transaction</h2>
          <p className="text-base text-on-surface-variant leading-relaxed mt-5 mb-10">Use this endpoint to initiate a new payment transaction across the OnTarget ecosystem. All transactions are processed in real time and require an idempotent key for safety.</p>
          <h3 className="font-bold text-lg border-l-4 border-blue-700 pl-3 mb-4">Request Parameters</h3>
          {[['amount', 'integer · required', 'A positive integer in the smallest currency unit. The minimum amount is 50 units.'], ['currency', 'string · required', 'Three-letter ISO currency code in lowercase. Must be a supported currency.'], ['description', 'string · optional', 'An arbitrary string attached to the object for display and reconciliation.']].map(row => <div key={row[0]} className="py-5 border-b flex flex-col sm:flex-row gap-3 sm:gap-10"><div className="sm:w-1/3"><code className="text-blue-700 font-bold text-xs">{row[0]}</code><p className="text-[9px] font-mono text-on-surface-variant mt-1">{row[1]}</p></div><p className="text-xs text-on-surface-variant flex-1 leading-relaxed">{row[2]}</p></div>)}
          <h3 className="font-bold text-lg border-l-4 border-blue-700 pl-3 mt-10 mb-4">Response Schema</h3>
          <div className="rounded-xl border p-5"><div className="flex justify-between border-b pb-3 mb-4 text-xs"><span className="font-bold">Returns a transaction object</span><code>application/json</code></div><div className="space-y-4"><div className="flex gap-3"><span className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center"><Check className="w-3 h-3" /></span><div><p className="text-xs font-bold">200 OK</p><p className="text-xs text-on-surface-variant">The transaction has been created and is processing.</p></div></div><div className="flex gap-3"><span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center"><CircleX className="w-3 h-3" /></span><div><p className="text-xs font-bold">402 Payment Required</p><p className="text-xs text-on-surface-variant">Parameters were valid but the payment attempt failed.</p></div></div></div></div>
        </main>

        <aside className="col-span-12 lg:col-span-4 xl:col-span-3 bg-[#0d1c32] text-white flex flex-col min-h-[650px]">
          <div className="flex items-center gap-1 p-3 border-b border-white/10 overflow-x-auto">{Object.keys(samples).map(item => <button key={item} onClick={() => setLanguage(item)} className={`px-3 py-1.5 rounded-md text-[10px] font-mono ${language === item ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40' : 'text-slate-500 hover:text-white'}`}>{item}</button>)}</div>
          <div className="relative p-5 flex-1 overflow-auto"><button onClick={() => navigator.clipboard?.writeText(samples[language])} className="absolute top-4 right-4 text-slate-400 hover:text-white"><Copy className="w-4 h-4" /></button><pre className="text-[11px] leading-relaxed text-blue-200 whitespace-pre-wrap font-mono">{samples[language]}</pre></div>
          <div className="p-5 border-t border-white/10 bg-white/5"><div className="flex justify-between mb-3"><span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Test Request</span><button onClick={() => { setResponse(null); setApiKey('sk_test_••••••••'); }} className="text-[9px] text-emerald-300 flex gap-1"><RotateCcw className="w-3 h-3" /> Reset</button></div><label className="text-[9px] text-slate-400 font-bold uppercase">API Key<input value={apiKey} onChange={e => setApiKey(e.target.value)} className="mt-1 w-full bg-[#0d1c32] border border-white/15 rounded-lg px-3 py-2 text-[10px] font-mono text-white outline-none" /></label><button onClick={runRequest} disabled={running} className="w-full bg-blue-600 mt-4 py-2.5 rounded-lg text-xs font-bold flex gap-2 justify-center items-center disabled:opacity-60"><Play className="w-3.5 h-3.5" /> {running ? 'Running...' : 'Run Request'}</button>{response && <div className="mt-4"><p className="text-[9px] text-emerald-300 mb-2">Response (200 OK)</p><pre className="bg-black/20 border border-white/10 rounded-lg p-3 text-[9px] text-slate-300 font-mono">{response}</pre></div>}</div>
        </aside>
      </div>
    </motion.div>
  );
}
