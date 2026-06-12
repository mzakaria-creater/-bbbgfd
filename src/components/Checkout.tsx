import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clipboard, Clock3, CloudUpload, Phone, ShieldCheck, WalletCards } from 'lucide-react';

export default function Checkout() {
  const [arabic, setArabic] = useState(false);
  const [seconds, setSeconds] = useState(899);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [proof, setProof] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds(value => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const copyNumber = async () => {
    await navigator.clipboard?.writeText('01012345678');
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const text = (en: string, ar: string) => arabic ? ar : en;
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} dir={arabic ? 'rtl' : 'ltr'} className="relative min-h-[850px] -m-2 md:-m-4 xl:-m-6 rounded-2xl overflow-hidden bg-[#0b1326] text-[#dae2fd]">
      <header className="sticky top-0 z-10 bg-[#0b1326]/70 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-5 py-4">
        <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c0c1ff] to-[#4446d2] flex items-center justify-center"><WalletCards className="w-5 h-5 text-white" /></div><span className="font-extrabold text-xl text-[#c0c1ff]">OnTarget</span></div>
        <div className="flex items-center gap-1 text-xs"><button onClick={() => setArabic(false)} className={`px-3 py-1.5 rounded-lg font-bold ${!arabic ? 'text-[#c0c1ff] bg-white/5' : 'text-slate-500'}`}>English</button><span className="text-slate-700">/</span><button onClick={() => setArabic(true)} className={`px-3 py-1.5 rounded-lg font-bold ${arabic ? 'text-[#c0c1ff] bg-white/5' : 'text-slate-500'}`}>العربية</button></div>
      </header>
      <main className="max-w-md mx-auto px-4 pt-9 pb-32 space-y-6">
        <section className="text-center"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{text('Amount Due', 'المبلغ المطلوب')}</p><div className="flex items-baseline justify-center gap-2 mt-2"><span className="text-slate-400 text-sm">EGP</span><span className="text-4xl font-extrabold tracking-tight">250.00</span></div><span className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[#c0c1ff] text-xs font-bold"><Clock3 className="w-4 h-4" /> {time}</span></section>
        <section className="bg-[#171f33]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center mb-5"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-[#e60000] flex items-center justify-center"><WalletCards className="w-5 h-5 text-white" /></div><div><h3 className="font-bold">Vodafone Cash</h3><p className="text-[10px] text-slate-400">{text('Instant Wallet Transfer', 'تحويل محفظة فوري')}</p></div></div><span className="px-2 py-1 rounded-full bg-emerald-900 text-emerald-300 text-[9px] font-bold uppercase">{text('Active', 'نشط')}</span></div>
          <div className="bg-[#131b2e] rounded-xl p-4"><p className="text-[9px] uppercase tracking-wider text-slate-400">{text('Merchant Number', 'رقم التاجر')}</p><div className="flex justify-between items-center mt-2"><span dir="ltr" className="text-xl font-bold tracking-widest">0101 234 5678</span><button onClick={copyNumber} className="p-2 rounded-lg hover:bg-white/10"><Clipboard className="w-4 h-4 text-[#c0c1ff]" /></button></div></div>
        </section>
        <section className="space-y-4"><label className="block text-xs text-slate-400">{text('Sender Number', 'رقم المرسل')}<span className="relative block mt-2"><input dir="ltr" className="w-full bg-[#2d3449]/40 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#c0c1ff] text-sm" placeholder="01X XXXX XXXX" /><Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /></span></label>
          <div><p className="text-xs text-slate-400 mb-2">{text('Upload Payment Proof', 'رفع إثبات الدفع')}</p><input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={event => setProof(event.target.files?.[0]?.name || '')} /><button onClick={() => inputRef.current?.click()} className="w-full border-2 border-dashed border-white/15 rounded-2xl p-8 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#c0c1ff]/50 transition-all"><CloudUpload className="w-9 h-9 text-[#c0c1ff] mx-auto mb-2" /><p className="text-xs">{proof || text('Tap to browse or drag & drop', 'اضغط لاختيار إثبات الدفع')}</p><p className="text-[9px] text-slate-500 mt-1">JPG, PNG, or PDF (Max 5MB)</p></button></div>
        </section>
        <div className="flex justify-center items-center gap-3 py-3"><span className={`w-3 h-3 rounded-full ${paid ? 'bg-emerald-400' : 'bg-emerald-400 animate-pulse'}`} /><p className="text-xs text-slate-400">{paid ? text('Payment submitted for verification', 'تم إرسال الدفع للتحقق') : text('Waiting for Confirmation', 'في انتظار التأكيد')}</p></div>
      </main>
      <nav className="absolute bottom-0 inset-x-0 bg-[#222a3d]/90 backdrop-blur-xl border-t border-white/10 px-6 pb-7 pt-4"><button onClick={() => setPaid(true)} className="max-w-md mx-auto w-full bg-gradient-to-br from-[#c0c1ff] to-[#4446d2] text-[#1000a9] font-extrabold py-4 rounded-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-transform shadow-lg"><ShieldCheck className="w-5 h-5" /> {paid ? text('Payment Submitted', 'تم إرسال الدفع') : text('I Have Paid', 'لقد دفعت')}</button></nav>
      {copied && <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-[#171f33] border border-[#c0c1ff]/20 px-5 py-3 rounded-full text-xs flex items-center gap-2 shadow-xl"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {text('Copied to clipboard', 'تم نسخ الرقم')}</div>}
    </motion.div>
  );
}
