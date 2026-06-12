import React from 'react';
import { motion } from 'motion/react';
import { Wallet, ShieldAlert, AlertTriangle, AlertCircle, History, MapPin, Building2 } from 'lucide-react';
import { ClientCard, RiskAlert, NoteEntry, TimelineItem, FooterButton } from './Shared';
import { useTranslation } from '../context/LanguageContext';

export default function PayOut() {
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
              <Building2 className="w-48 h-48 stroke-[1px] text-secondary" />
            </div>
            <div className="z-10">
              <span className="px-3 py-1 bg-secondary/30 border border-secondary/40 rounded-full text-xs font-medium uppercase tracking-wider text-secondary">{t("Pay-Out Threshold")}</span>
              <div className="flex items-baseline gap-4 mt-6">
                <h1 className="text-5xl font-bold tracking-tight text-on-surface">1,115,000.00</h1>
                <span className="text-2xl font-light text-secondary">{t("EGP")}</span>
              </div>
            </div>
            <div className="flex items-end justify-between z-10 pt-8 mt-12 border-t border-white/10">
              <div className="flex items-center gap-12">
                <div className="space-y-1">
                  <span className="block text-xs uppercase tracking-widest text-white/40">{t("Queue Depth")}</span>
                  <span className="text-xl font-light">42 <span className="text-sm opacity-60">{t("Payouts")}</span></span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="space-y-1">
                  <span className="block text-xs uppercase tracking-widest text-white/40">{t("Approved Volume")}</span>
                  <span className="text-xl font-light text-primary">825,000.00 <span className="text-sm opacity-60">{t("EGP")}</span></span>
                </div>
              </div>
              <button className="px-6 py-3 bg-secondary text-white rounded-2xl font-bold hover:bg-secondary/90 transition-colors shadow-lg" onClick={() => alert(t("Processing batch..."))}>{t("Process Batch")}</button>
            </div>
          </div>

          <div className="p-8 shadow-xl glass-card-sm rounded-[32px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                 <p className="text-xs uppercase tracking-widest text-white/40">{t("Treasury Health")}</p>
                 <p className="text-3xl font-light text-secondary">82.1<span className="text-lg text-white">%</span></p>
              </div>
              <div className="w-full h-1 overflow-hidden rounded-full bg-white/20">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '82.1%' }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-secondary" 
                />
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white rounded-full"></div>
              </div>
              <div className="text-right">
                 <p className="text-xs font-bold tracking-widest text-white/50 uppercase">{t("Balance")}</p>
                 <p className="text-sm text-secondary font-medium">{t("Re-funding Needed")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Client Info Grid */}
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ClientCard 
            title="Global Logistics Ltd."
            subtitle="Enterprise Disbursement"
            avatar="https://images.unsplash.com/photo-1549463324-41e779a101f3?q=80&w=128&h=128&auto=format&fit=crop"
            icon={<div className="w-2 h-2 bg-secondary rounded-full" />}
            details={[
              { label: 'Bank', value: 'CIB Egypt' },
              { label: 'IBAN', value: 'EG42 0001 **** 8822', mono: true },
              { label: 'Compliance', value: 'Tier 1 Clear', bold: true },
            ]}
          />
          <ClientCard 
            title="Suez Supply Chain"
            subtitle="Corporate Partner"
            avatar="https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?q=80&w=128&h=128&auto=format&fit=crop"
            icon={<div className="w-2 h-2 bg-primary rounded-full" />}
            details={[
              { label: 'Ref ID', value: 'SSC-9912-A', mono: true },
              { label: 'Method', value: 'Swift Transfer' },
              { label: 'Priority', value: 'Critical', highlight: true },
            ]}
          />
        </section>

        {/* Risk Profile */}
        <section className="relative p-8 overflow-hidden glass-card rounded-[32px]">
          <div className="absolute opacity-5 -right-12 -bottom-12">
            <AlertTriangle className="w-64 h-64 text-pink-500" />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center border border-pink-400/30">
              <ShieldAlert className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-on-surface">{t("Disbursement Security Audit")}</h2>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-pink-300">{t("Approval Required")}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-widest text-white/40">{t("Audit Score")}</p>
              <p className="text-5xl font-light text-pink-400">92<span className="text-lg text-white">/100</span></p>
            </div>
            <div className="space-y-4 md:col-span-2">
              <RiskAlert icon={<div className="w-2 h-2 bg-pink-500 rounded-full" />} title="Sanction Check" desc="All recipients cleared against OFAC and local AML databases." />
              <RiskAlert icon={<div className="w-2 h-2 bg-secondary rounded-full" />} title="Approval Multi-Sig" desc="3 of 4 compliance officers have digitally signed the current batch." />
            </div>
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <aside className="space-y-6">
        <div className="p-8 glass-card-sm rounded-[32px] h-fit">
          <h3 className="flex items-center gap-3 mb-8 text-lg font-medium">
            <History className="w-5 h-5 text-secondary" />
            {t("Payout Status")}
          </h3>
          <div className="relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />
            <div className="relative space-y-8">
              <TimelineItem status="completed" title="Batch Created" time="08:00 AM" />
              <TimelineItem status="completed" title="Funds Allocated" time="09:15 AM" />
              <TimelineItem status="active" title="Pending Sign-off" time="In Progress" badge="Manager Action" />
              <TimelineItem status="pending" title="Bank Release" time="EOD" />
            </div>
          </div>
        </div>

        <div className="overflow-hidden transition-all glass-card-sm rounded-[32px] group relative h-[300px] flex flex-col justify-end p-6">
          <img 
            src="https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=600&auto=format&fit=crop" 
            alt="Disbursement"
            className="absolute inset-0 object-cover w-full h-full transition-all duration-700 opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 px-3 py-1 bg-secondary/30 border border-secondary/40 rounded-full mb-4 w-fit">
              <MapPin className="w-3 h-3 text-secondary" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">{t("Treasury Vault")}</span>
            </div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-widest text-white/50">{t("Liquidity Hub")}</h4>
            <p className="text-xl font-bold tracking-tight">{t("CIB Integrated")}</p>
            <p className="text-sm text-white/40">{t("H2H Connectivity Status: Green")}</p>
          </div>
        </div>
      </aside>
    </motion.div>
  );
}
