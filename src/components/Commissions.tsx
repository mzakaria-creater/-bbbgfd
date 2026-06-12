import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Network, 
  TrendingUp, 
  Sliders, 
  PlusCircle, 
  Search, 
  Settings, 
  GitBranch, 
  ChevronRight, 
  Award, 
  AwardIcon, 
  CheckCircle, 
  Zap,
  Star
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function Commissions() {
  const { t } = useTranslation();
  const [logicType, setLogicType] = useState('Percentage');
  const [alphaRate, setAlphaRate] = useState(12.5);

  const [ledger, setLedger] = useState([
    { name: 'Global Retail Inc.', id: '8829-1', role: 'Master', type: 'Hybrid (2% + $5)', earnings: 14290.44, status: 'Active' },
    { name: 'Neo Shop Global', id: '9901-4', role: 'Merchant', type: 'Percentage (5%)', earnings: 8122.10, status: 'Review Needed' }
  ]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      
      {/* Header element */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface tracking-tight">{t("Multi-Level Commission Engine")}</h1>
          <p className="text-on-surface-variant text-sm mt-1">{t("Configure cumulative referral cuts and multi-tiered agent pool kickbacks.")}</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-5 py-2.5 bg-white border border-outline rounded-lg font-bold text-xs text-on-surface-variant hover:bg-surface-container transition-colors" onClick={() => alert(t("Spreadsheet logs exported!"))}>
            {t("Export Matrix Spread")}
          </button>
          
          <button 
            onClick={() => {
              const name = prompt(t("Enter Name of New Partner Node:"));
              if (name) {
                setLedger([...ledger, { name, id: '9841-' + Math.floor(Math.random() * 9), role: 'Merchant', type: 'Fixed (1.80%)', earnings: 0, status: 'Active' }]);
              }
            }}
            className="px-5 py-2.5 bg-primary hover:bg-[#002f9e] text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            {t("Add Referral Tier")}
          </button>
        </div>
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Hierarchy tree diagram (2/3 width) */}
        <section className="col-span-12 lg:col-span-8 bg-white border border-outline-variant p-6 rounded-xl shadow-sm space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-on-surface">{t("Hierarchy Configuration")}</h3>
            <span className="bg-emerald-500/10 text-emerald-800 text-xs px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">{t("Visual Tier Active")}</span>
          </div>

          <div className="space-y-6 relative">
            
            {/* Master Node */}
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0 animate-pulse">
                <Star className="w-6 h-6 fill-primary text-primary" />
              </div>

              <div className="flex-grow p-4 bg-surface rounded-xl flex items-center justify-between border border-primary/20">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{t("Master Merchant Elite")}</span>
                  <h4 className="font-bold text-on-surface text-base">{t("Global Enterprise Group")}</h4>
                </div>
                <div className="text-right pr-2">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase">{t("Base share slice")}</p>
                  <p className="font-mono text-primary font-extrabold text-lg">45.00%</p>
                </div>
              </div>
            </div>

            {/* Level 2 child nodes (indented with left bar representing tree) */}
            <div className="ml-6 space-y-4 border-l-2 border-dashed border-outline-variant pl-6">
              
              <div className="flex items-center gap-6 relative">
                {/* Node Line horizontal connector indicator */}
                <div className="absolute -left-6 top-1/2 w-6 h-[1px] bg-outline-variant" />
                
                <div className="w-10 h-10 bg-emerald-100 text-[#006c49] rounded-full flex items-center justify-center shrink-0">
                  <GitBranch className="w-5 h-5" />
                </div>

                <div className="flex-grow p-4 bg-white border border-outline-variant rounded-xl flex items-center justify-between border-l-4 border-l-[#006c49] shadow-xs">
                  <div>
                    <span className="text-[9px] font-bold text-[#006c49] uppercase tracking-widest">{t("Merchant Level 2")}</span>
                    <h4 className="font-bold text-on-surface text-sm">{t("Alpha Retail Systems")}</h4>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase">{t("Referral split")}</p>
                      <input 
                        type="number" 
                        value={alphaRate} 
                        onChange={(e)=>setAlphaRate(parseFloat(e.target.value) || 0)}
                        className="font-mono text-[#006c49] font-extrabold text-base bg-surface border-none rounded p-1 w-16 text-right"
                      />
                      <span className="font-mono text-sm text-[#006c49] font-bold">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-merchants level 3 */}
              <div className="ml-6 space-y-3 border-l-2 border-dashed border-outline-variant pl-6">
                
                <div className="flex items-center gap-4 relative">
                  <div className="absolute -left-6 top-1/2 w-6 h-[1px] bg-outline-variant" />
                  
                  <div className="w-8 h-8 bg-surface-container flex items-center justify-center rounded-full text-on-surface-variant shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-grow p-3 bg-white border border-outline-variant rounded-xl flex items-center justify-between shadow-xs">
                    <h5 className="font-semibold text-xs text-on-surface">{t("Branch Downtown #04")}</h5>
                    <p className="font-mono text-xs text-on-surface-variant font-bold">3.00% {t("fixed")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative">
                  <div className="absolute -left-6 top-1/2 w-6 h-[1px] bg-outline-variant" />
                  
                  <div className="w-8 h-8 bg-surface-container flex items-center justify-center rounded-full text-on-surface-variant shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div className="flex-grow p-3 bg-white border border-outline-variant rounded-xl flex items-center justify-between shadow-xs">
                    <h5 className="font-semibold text-xs text-on-surface">{t("Mobile Agent Team B")}</h5>
                    <p className="font-mono text-xs text-on-surface-variant font-bold">2.50% {t("fixed")}</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* Side rules and stats (1/3 width) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          
          <div className="bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-sm text-on-surface mb-3 flex items-center gap-1.5"><Settings className="w-4 h-4 text-primary" /> {t("Active Rules Manager")}</h3>
            
            <div className="space-y-4 text-xs font-semibold">
              <div className="p-3 bg-surface rounded-xl">
                <label className="block text-[10px] text-on-surface-variant uppercase tracking-wider mb-2">{t("Transaction category")}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-primary text-white py-2 rounded-lg font-bold">{t("Deposits")}</button>
                  <button className="bg-white border border-outline text-on-surface-variant py-2 rounded-lg font-bold">{t("Withdrawals")}</button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] text-on-surface-variant uppercase tracking-wider">{t("Logic Calculation")}</label>
                
                <div className="space-y-2">
                  <label 
                    onClick={() => setLogicType('Percentage')}
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${logicType === 'Percentage' ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}
                  >
                    <input type="radio" checked={logicType === 'Percentage'} readOnly className="text-primary focus:ring-primary h-4.5 w-4.5 shrink-0" />
                    <div>
                      <p className="font-bold text-on-surface">{t("Percentage Cut Share")}</p>
                      <p className="text-[10px] text-on-surface-variant font-normal">{t("Calculated dynamically out of final gateway processing fee.")}</p>
                    </div>
                  </label>

                  <label 
                    onClick={() => setLogicType('Fixed')}
                    className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${logicType === 'Fixed' ? 'border-primary bg-primary/5' : 'border-outline-variant'}`}
                  >
                    <input type="radio" checked={logicType === 'Fixed'} readOnly className="text-primary focus:ring-primary h-4.5 w-4.5 shrink-0" />
                    <div>
                      <p className="font-bold text-on-surface">{t("Flat markup fixed EGP")}</p>
                      <p className="text-[10px] text-on-surface-variant font-normal">{t("Flat rate added per verified transaction regardless of load.")}</p>
                    </div>
                  </label>
                </div>
              </div>

              <button 
                onClick={() => alert(t("Successfully re-compiled and distributed multi-tier commission tree with dynamic split of total volume configured."))}
                className="w-full mt-4 py-3 bg-primary hover:bg-[#002f9e] text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow"
              >
                <Zap className="w-4 h-4 text-white" /> {t("Compile Rule Matrix")}
              </button>
            </div>
          </div>

          {/* Cumulative card */}
          <div className="bg-[#191b25] text-white rounded-xl p-6 shadow-md relative overflow-hidden">
            <span className="text-[10px] font-bold text-outline uppercase tracking-wider">{t("Month-to-date Referrals")}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <h4 className="text-3xl font-extrabold">$2,402,110</h4>
              <span className="text-xs text-[#6cf8bb] font-bold">+14% {t("Growth")}</span>
            </div>
            <p className="text-xs text-outline mt-3 leading-relaxed">{t("Referral distributions process instantly in tandem with local depositor daily reconciliations.")}</p>
          </div>

        </aside>

        {/* Detailed commission entries ledger table */}
        <section className="col-span-12 bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-bold text-sm text-on-surface">{t("Earned Commissions Spreadsheet")}</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder={t("Search ledger...")}
                className="pl-8 pr-4 py-1.5 bg-surface border border-outline-variant rounded-lg text-xs outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto text-xs font-semibold">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low border-b border-outline-variant text-[10px] uppercase text-on-surface-variant font-bold">
                <tr>
                  <th className="px-6 py-4">{t("Merchant Node Entity")}</th>
                  <th className="px-6 py-4">{t("Hierarchy Allocation")}</th>
                  <th className="px-6 py-4">{t("Active Logic Template")}</th>
                  <th className="px-6 py-4">{t("Total Earnings (MTD)")}</th>
                  <th className="px-6 py-4">{t("Operation Status")}</th>
                  <th className="px-6 py-4 text-right">{t("Settings")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-medium">
                {ledger.map((row, idx) => (
                  <tr key={idx} className="hover:bg-surface-container-low/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                          {row.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{row.name}</p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">ID: #{row.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold ${row.role==='Master' ? 'bg-primary-container text-white': 'bg-surface-container text-on-surface-variant'}`}>
                        {t(row.role)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-on-surface font-semibold">{t(row.type)}</td>
                    
                    <td className="px-6 py-4 font-bold font-mono text-[#006c49]">
                      ${row.earnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 font-bold text-[11px] ${row.status==='Active' ? 'text-secondary': 'text-amber-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.status==='Active' ? 'bg-secondary': 'bg-amber-500 animate-pulse'}`} />
                        {t(row.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button className="p-1 px-1.5 hover:bg-surface-container rounded-lg"><Settings className="w-4 h-4 text-outline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>

    </motion.div>
  );
}
