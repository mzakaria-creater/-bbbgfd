import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Check, ChevronLeft, MessageSquareText, RefreshCw, Search, Signal, Wifi } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

const messages = [
  { id: 'SMS-90182', sender: 'Orange Money', preview: 'You received EGP 2,450.00 from 0122••••91', body: 'You received EGP 2,450.00 from 0122••••91. Your current balance is EGP 18,725.40. Transaction ID: OM-84920176.', amount: 'EGP 2,450.00', time: '10:42 AM', status: 'Matched', transaction: 'OM-84920176' },
  { id: 'SMS-90181', sender: 'Orange Money', preview: 'You received EGP 780.00 from 0128••••05', body: 'You received EGP 780.00 from 0128••••05. Your current balance is EGP 16,275.40. Transaction ID: OM-84919834.', amount: 'EGP 780.00', time: '10:18 AM', status: 'Matched', transaction: 'OM-84919834' },
  { id: 'SMS-90180', sender: 'Orange', preview: 'Your monthly bundle was renewed successfully', body: 'Your monthly bundle was renewed successfully. Enjoy more minutes and megabytes with Orange.', amount: '—', time: '9:55 AM', status: 'Ignored', transaction: '—' },
  { id: 'SMS-90179', sender: 'Orange Money', preview: 'You received EGP 5,200.00 from 0115••••44', body: 'You received EGP 5,200.00 from 0115••••44. Your current balance is EGP 15,495.40. Transaction ID: OM-84918711.', amount: 'EGP 5,200.00', time: '9:31 AM', status: 'Review', transaction: 'OM-84918711' },
  { id: 'SMS-90178', sender: 'Orange Money', preview: 'You sent EGP 1,000.00 to 0120••••72', body: 'You sent EGP 1,000.00 to 0120••••72. Your current balance is EGP 10,295.40. Transaction ID: OM-84917562.', amount: '- EGP 1,000.00', time: '8:46 AM', status: 'Matched', transaction: 'OM-84917562' },
];

export default function OrangeSmsReader() {
  const { t, langDir } = useTranslation();
  const [selected, setSelected] = useState(messages[0]);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => messages.filter(message => `${message.sender} ${message.preview} ${message.id}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#f16e00] text-xs font-extrabold uppercase tracking-[0.18em] mb-2"><span className="w-2 h-2 rounded-full bg-[#f16e00] animate-pulse" /> {t('Live Orange feed')}</div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t('Orange SMS Reader')}</h1>
          <p className="text-sm text-on-surface-variant mt-1">{t('Monitor wallet alerts and reconcile incoming Orange Money transfers.')}</p>
        </div>
        <button className="bg-[#191b25] hover:bg-black text-white px-5 py-3 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg"><RefreshCw className="w-4 h-4" /> {t('Sync messages')}</button>
      </div>

      <div className="grid grid-cols-12 gap-7">
        <section className="col-span-12 xl:col-span-8 bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-outline-variant flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div><h2 className="font-bold">{t('Reader inbox')}</h2><p className="text-xs text-on-surface-variant mt-0.5">{t('5 messages received today')}</p></div>
            <label className="flex items-center gap-2 bg-surface-container-low px-4 py-2.5 rounded-xl border border-outline-variant/50 min-w-64">
              <Search className="w-4 h-4 text-outline" /><input value={query} onChange={e => setQuery(e.target.value)} placeholder={t('Search SMS or ID')} className="bg-transparent outline-none text-xs w-full" />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className={`w-full text-xs ${langDir === 'rtl' ? 'text-right' : 'text-left'}`}>
              <thead className="bg-surface-container text-[10px] uppercase tracking-widest text-on-surface-variant">
                <tr><th className="px-5 py-4">{t('Message')}</th><th className="px-5 py-4">{t('Amount')}</th><th className="px-5 py-4">{t('Received')}</th><th className="px-5 py-4">{t('Status')}</th></tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {filtered.map(message => <tr key={message.id} onClick={() => setSelected(message)} className={`cursor-pointer transition-colors ${selected.id === message.id ? 'bg-orange-50' : 'hover:bg-surface-container-low/60'}`}>
                  <td className="px-5 py-4 min-w-72"><div className="flex gap-3 items-center"><div className="w-10 h-10 rounded-xl bg-[#f16e00] text-white flex items-center justify-center shrink-0"><MessageSquareText className="w-5 h-5" /></div><div><p className="font-bold text-sm">{t(message.sender)}</p><p className="text-on-surface-variant truncate max-w-sm mt-0.5">{t(message.preview)}</p><p className="text-[9px] font-mono text-outline mt-1">{message.id}</p></div></div></td>
                  <td className="px-5 py-4 font-bold whitespace-nowrap">{message.amount}</td><td className="px-5 py-4 whitespace-nowrap text-on-surface-variant">{message.time}</td>
                  <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full font-bold ${message.status === 'Matched' ? 'bg-emerald-100 text-emerald-800' : message.status === 'Review' ? 'bg-amber-100 text-amber-800' : 'bg-surface-container-high text-on-surface-variant'}`}>{t(message.status)}</span></td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </section>

        <section className="col-span-12 xl:col-span-4 flex justify-center">
          <div className="w-[310px] h-[635px] bg-[#111216] rounded-[50px] p-[9px] shadow-[0_28px_60px_rgba(17,18,22,0.3)] border border-black relative">
            <div className="absolute left-[-3px] top-32 w-[3px] h-20 bg-[#2d2e34] rounded-l-md" /><div className="absolute right-[-3px] top-40 w-[3px] h-24 bg-[#2d2e34] rounded-r-md" />
            <div className="h-full bg-[#f7f7f8] rounded-[42px] overflow-hidden relative">
              <div className="h-12 px-7 pt-3 flex justify-between text-[10px] font-bold"><span>10:42</span><div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-7 rounded-full bg-black" /><div className="flex gap-1"><Signal className="w-3 h-3" /><Wifi className="w-3 h-3" /></div></div>
              <div className="px-4 pb-3 border-b border-black/10 flex items-center justify-between"><ChevronLeft className="w-5 h-5 text-[#f16e00]" /><span className="font-bold text-sm">Orange Money</span><div className="w-5" /></div>
              <div className="p-4">
                <p className="text-center text-[10px] text-gray-500 mb-5">{t('Today')} {selected.time}</p>
                <div className="flex gap-2 items-end"><div className="w-7 h-7 rounded-full bg-[#f16e00] text-white flex items-center justify-center text-[11px] font-black">O</div><div className="bg-[#e6e6e9] rounded-[18px] p-3 text-[12px] leading-relaxed max-w-[220px]">{t(selected.body)}</div></div>
                <div className="mt-8 bg-white rounded-2xl border border-black/10 p-4 shadow-sm"><div className="flex justify-between items-center"><span className="text-[10px] text-gray-500 uppercase font-bold">{t('Detected transfer')}</span><Check className="w-4 h-4 text-emerald-600" /></div><p className="text-xl font-extrabold mt-2">{selected.amount}</p><p className="text-[10px] font-mono text-gray-500 mt-1">{selected.transaction}</p></div>
              </div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-black rounded-full" />
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
