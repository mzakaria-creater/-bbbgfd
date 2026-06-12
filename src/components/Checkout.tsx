import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Clipboard, Clock3, CloudUpload, Phone, ShieldCheck, WalletCards } from 'lucide-react';

export default function Checkout() {
  const [arabic, setArabic] = useState(false);
  const [seconds, setSeconds] = useState(899);
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [proof, setProof] = useState('');
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} dir={arabic ? 'rtl' : 'ltr'} onMouseMove={event => { const rect = event.currentTarget.getBoundingClientRect(); setTilt({ x: ((event.clientY - rect.top) / rect.height - .5) * -8, y: ((event.clientX - rect.left) / rect.width - .5) * 8 }); }} onMouseLeave={() => setTilt({ x: 0, y: 0 })} className="relative min-h-[850px] -m-2 md:-m-4 xl:-m-6 rounded-2xl overflow-hidden bg-[#080f20] text-[#dae2fd] [perspective:1400px]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden"><div className="absolute -top-36 -left-28 w-96 h-96 bg-[#4446d2]/25 rounded-full blur-[100px]" style={{ transform: `translate3d(${tilt.y * 4}px,${tilt.x * 4}px,0)` }} /><div className="absolute bottom-10 -right-28 w-80 h-80 bg-[#4edea3]/15 rounded-full blur-[90px]" style={{ transform: `translate3d(${tilt.y * -5}px,${tilt.x * -5}px,0)` }} /><div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.3)_1px,transparent_1px)] bg-[size:48px_48px] [transform:rotateX(68deg)_translateY(55%)] [transform-origin:bottom]" /></div>
      <header className="sticky top-0 z-10 bg-[#0b1326]/70 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-5 py-4">
        <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#c0c1ff] to-[#4446d2] flex items-center justify-center"><WalletCards className="w-5 h-5 text-white" /></div><span className="font-extrabold text-xl text-[#c0c1ff]">OnTarget</span></div>
        <div className="flex items-center gap-1 text-xs"><button onClick={() => setArabic(false)} className={`px-3 py-1.5 rounded-lg font-bold ${!arabic ? 'text-[#c0c1ff] bg-white/5' : 'text-slate-500'}`}>English</button><span className="text-slate-700">/</span><button onClick={() => setArabic(true)} className={`px-3 py-1.5 rounded-lg font-bold ${arabic ? 'text-[#c0c1ff] bg-white/5' : 'text-slate-500'}`}>العربية</button></div>
      </header>
      <main className="relative max-w-md mx-auto px-4 pt-9 pb-32 space-y-6 [transform-style:preserve-3d]" style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <section className="text-center transition-transform duration-200 [transform:translateZ(45px)]"><p className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{text('Amount Due', 'المبلغ المطلوب')}</p><div className="flex items-baseline justify-center gap-2 mt-2"><span className="text-slate-400 text-sm">EGP</span><span className="text-4xl font-extrabold tracking-tight drop-shadow-[0_12px_24px_rgba(192,193,255,.25)]">250.00</span></div><span className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[#c0c1ff] text-xs font-bold shadow-[0_12px_30px_rgba(0,0,0,.35)]"><Clock3 className="w-4 h-4" /> {time}</span></section>
        <section className="relative bg-gradient-to-br from-[#26304a]/95 to-[#11192d]/95 backdrop-blur-xl rounded-2xl p-6 border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.15)] transition-transform duration-200 [transform:translateZ(70px)] [transform-style:preserve-3d]">
          <div className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[#c0c1ff]/80 to-transparent" />
          <div className="flex justify-between items-center mb-5"><div className="flex items-center gap-3"><div className="w-11 h-11 rounded-full bg-[#e60000] flex items-center justify-center"><WalletCards className="w-5 h-5 text-white" /></div><div><h3 className="font-bold">Vodafone Cash</h3><p className="text-[10px] text-slate-400">{text('Instant Wallet Transfer', 'تحويل محفظة فوري')}</p></div></div><span className="px-2 py-1 rounded-full bg-emerald-900 text-emerald-300 text-[9px] font-bold uppercase">{text('Active', 'نشط')}</span></div>
          <div className="bg-[#0d1529]/90 rounded-xl p-4 border border-white/5 shadow-[inset_0_3px_12px_rgba(0,0,0,.45),0_10px_25px_rgba(0,0,0,.25)] [transform:translateZ(18px)]"><p className="text-[9px] uppercase tracking-wider text-slate-400">{text('Merchant Number', 'رقم التاجر')}</p><div className="flex justify-between items-center mt-2"><span dir="ltr" className="text-xl font-bold tracking-widest">0101 234 5678</span><button onClick={copyNumber} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 shadow-lg active:[transform:translateZ(0)_scale(.94)] [transform:translateZ(12px)]"><Clipboard className="w-4 h-4 text-[#c0c1ff]" /></button></div></div>
        </section>
        <section className="space-y-4 [transform:translateZ(38px)]"><label className="block text-xs text-slate-400">{text('Sender Number', 'رقم المرسل')}<span className="relative block mt-2"><input dir="ltr" className="w-full bg-[#2d3449]/40 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#c0c1ff] text-sm shadow-[inset_0_3px_12px_rgba(0,0,0,.3),0_14px_30px_rgba(0,0,0,.25)]" placeholder="01X XXXX XXXX" /><Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /></span></label>
          <div><p className="text-xs text-slate-400 mb-2">{text('Upload Payment Proof', 'رفع إثبات الدفع')}</p><input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={event => setProof(event.target.files?.[0]?.name || '')} /><button onClick={() => inputRef.current?.click()} className="w-full border-2 border-dashed border-white/15 rounded-2xl p-8 bg-gradient-to-br from-white/[0.06] to-transparent hover:border-[#c0c1ff]/50 transition-all shadow-[0_22px_45px_rgba(0,0,0,.28)] hover:[transform:translateY(-4px)_translateZ(18px)]"><CloudUpload className="w-9 h-9 text-[#c0c1ff] mx-auto mb-2 drop-shadow-[0_8px_12px_rgba(192,193,255,.35)]" /><p className="text-xs">{proof || text('Tap to browse or drag & drop', 'اضغط لاختيار إثبات الدفع')}</p><p className="text-[9px] text-slate-500 mt-1">JPG, PNG, or PDF (Max 5MB)</p></button></div>
        </section>
        <div className="flex justify-center items-center gap-3 py-3"><span className={`w-3 h-3 rounded-full ${paid ? 'bg-emerald-400' : 'bg-emerald-400 animate-pulse'}`} /><p className="text-xs text-slate-400">{paid ? text('Payment submitted for verification', 'تم إرسال الدفع للتحقق') : text('Waiting for Confirmation', 'في انتظار التأكيد')}</p></div>
      </main>
      <nav className="absolute bottom-0 inset-x-0 bg-[#222a3d]/80 backdrop-blur-xl border-t border-white/10 px-6 pb-7 pt-4"><button onClick={() => setPaid(true)} className="max-w-md mx-auto w-full bg-gradient-to-br from-[#e1e0ff] via-[#9fa1ff] to-[#4446d2] text-[#1000a9] font-extrabold py-4 rounded-xl flex items-center justify-center gap-3 active:scale-[0.97] transition-transform shadow-[0_14px_0_#292b91,0_24px_45px_rgba(68,70,210,.4),inset_0_1px_0_rgba(255,255,255,.8)] active:translate-y-2 active:shadow-[0_6px_0_#292b91,0_12px_24px_rgba(68,70,210,.3)]"><ShieldCheck className="w-5 h-5" /> {paid ? text('Payment Submitted', 'تم إرسال الدفع') : text('I Have Paid', 'لقد دفعت')}</button></nav>
      {copied && <div className="absolute bottom-28 left-1/2 -translate-x-1/2 bg-[#171f33] border border-[#c0c1ff]/20 px-5 py-3 rounded-full text-xs flex items-center gap-2 shadow-xl"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> {text('Copied to clipboard', 'تم نسخ الرقم')}</div>}
    </motion.div>
  );
}
