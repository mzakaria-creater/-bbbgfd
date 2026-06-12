import React from 'react';
import { motion } from 'motion/react';
import { Wallet, ShieldAlert, AlertTriangle, AlertCircle, MapPinOff, History, MapPin, FilePlus } from 'lucide-react';
import { ClientCard, RiskAlert, NoteEntry, TimelineItem, FooterButton } from './Shared';
import { useTranslation } from '../context/LanguageContext';

export default function PayIn() {
  const { t } = useTranslation();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="asymmetric-grid"
    >
      {/* Main Column */}
      <div className="space-y-6">
        
        {/* Financial Summary Bento */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="relative p-8 overflow-hidden md:col-span-2 glass-card rounded-[40px] min-h-[260px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet className="w-48 h-48 stroke-[1px] text-primary" />
            </div>
            <div className="z-10">
              <span className="px-3 py-1 bg-primary/30 border border-primary/40 rounded-full text-xs font-medium uppercase tracking-wider text-primary">{t("Pay-In Volume")}</span>
              <div className="flex items-baseline gap-4 mt-6">
                <h1 className="text-5xl font-bold tracking-tight text-on-surface">2,450,000.00</h1>
                <span className="text-2xl font-light text-primary">{t("EGP")}</span>
              </div>
            </div>
            <div className="flex items-end justify-between z-10 pt-8 mt-12 border-t border-white/10">
              <div className="flex items-center gap-12">
                <div className="space-y-1">
                  <span className="block text-xs uppercase tracking-widest text-white/40">{t("Total Collections")}</span>
                  <span className="text-xl font-light">1,240 <span className="text-sm opacity-60">{t("TXNs")}</span></span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="space-y-1">
                  <span className="block text-xs uppercase tracking-widest text-white/40">{t("Avg. Basket")}</span>
                  <span className="text-xl font-light text-secondary">1,975.00 <span className="text-sm opacity-60">{t("EGP")}</span></span>
                </div>
              </div>
              <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold hover:bg-white/90 transition-colors shadow-lg" onClick={() => alert(t("Spreadsheet logs exported!"))}>{t("Export CSV")}</button>
            </div>
          </div>

          <div className="p-8 shadow-xl glass-card-sm rounded-[32px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                 <p className="text-xs uppercase tracking-widest text-white/40">{t("Collection Rate")}</p>
                 <p className="text-3xl font-light text-primary">94.8<span className="text-lg text-white">%</span></p>
              </div>
              <div className="w-full h-1 overflow-hidden rounded-full bg-white/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '94.8%' }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-primary" 
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-full"></div>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold tracking-widest text-white/50 uppercase">{t("Network")}</p>
                 <p className="text-sm text-primary font-medium">{t("Optimal Status")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Client Info Grid */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ClientCard 
            title="Ahmad Al-Sayed"
            subtitle="Premium Merchant"
            avatar="/src/assets/images/regenerated_image_1778827021092.webp"
            icon={<div className="w-2 h-2 bg-primary rounded-full" />}
            details={[
              { label: 'Provider', value: 'Vodafone Cash' },
              { label: 'Wallet ID', value: '010 **** 9211', mono: true },
              { label: 'KYC Tier', value: 'Tier 3', highlight: true },
            ]}
          />
          <ClientCard 
            title="Nour Fashion Store"
            subtitle="SMB Growth"
            avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=128&h=128&auto=format&fit=crop"
            icon={<div className="w-2 h-2 bg-secondary rounded-full" />}
            details={[
              { label: 'Platform', value: 'Shopify Integration' },
              { label: 'Store URL', value: 'nourfashion.eg', mono: true },
              { label: 'Status', value: 'Verified', bold: true },
            ]}
          />
        </section>

        {/* Risk Profile */}
        <section className="relative p-8 overflow-hidden glass-card rounded-[32px]">
          <div className="absolute opacity-5 -right-12 -bottom-12">
            <AlertTriangle className="w-64 h-64 text-error" />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-error/20 rounded-2xl flex items-center justify-center border border-error/30">
              <ShieldAlert className="w-6 h-6 text-error" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-on-surface">{t("Collection Risk Audit")}</h2>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-error">{t("Threshold Alert")}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-white/40">{t("Failure Rate")}</p>
              <p className="text-5xl font-light text-error">5.2<span className="text-lg text-white">%</span></p>
            </div>
            <div className="space-y-4 md:col-span-2">
              <RiskAlert icon={<div className="w-2 h-2 bg-error rounded-full" />} title="Gateway Latency" desc="Vodafone Cash gateway experiencing 2.4s delay. Auto-routing enabled." />
              <RiskAlert icon={<div className="w-2 h-2 bg-primary rounded-full" />} title="Fraud Shield" desc="99.4% of transactions cleared through AI behavioral analysis." />
            </div>
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="p-8 glass-card-sm rounded-[32px] h-fit">
          <h3 className="flex items-center gap-3 mb-8 text-lg font-medium">
            <History className="w-5 h-5 text-primary" />
            {t("Activity Stream")}
          </h3>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />
            <div className="relative space-y-8">
              <TimelineItem status="completed" title="Batch Collection" time="10:45 AM" />
              <TimelineItem status="completed" title="Clearing Settled" time="09:30 AM" />
              <TimelineItem status="active" title="Reconciliation" time="In Progress" badge="Run Manual" />
              <TimelineItem status="pending" title="Ledger Update" time="12:00 PM" />
            </div>
          </div>
        </div>

        <div className="overflow-hidden transition-all glass-card-sm rounded-[32px] group relative h-[300px] flex flex-col justify-end p-6">
          <img 
            src="https://images.unsplash.com/photo-1541410945376-a7872f54c9d7?q=80&w=600&auto=format&fit=crop" 
            alt="Location"
            className="absolute inset-0 object-cover w-full h-full transition-all duration-700 opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/30 border border-primary/40 rounded-full mb-4 w-fit">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{t("Cairo HUB")}</span>
            </div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">{t("Node Traffic")}</h4>
            <p className="text-xl font-bold tracking-tight">{t("Active Ingress")}</p>
            <p className="text-sm text-white/40">{t("Secure Tunneling Active")}</p>
          </div>
        </div>
      </aside>
    </motion.div>
  );
}
