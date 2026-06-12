import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  Filter, 
  Download, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  Lock, 
  Terminal, 
  MoreVertical,
  Activity,
  Globe2,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [timeFilter, setTimeTab] = useState('1D');
  const [earnings, setEarnings] = useState(82400);
  const [liveVolume, setLiveVolume] = useState(4200000);
  const [successRate, setSuccessRate] = useState(99.2);
  const [complaintsCount, setComplaintsCount] = useState(14);
  const [logs, setLogs] = useState([
    { id: 1, type: 'fee', msg: 'Admin "Sara_W" updated fee matrix - Global Level', time: '2 mins ago', icon: <Clock className="w-4 h-4 text-emerald-600" /> },
    { id: 2, type: 'dispute', msg: 'Dispute #482 resolved automatically by system', time: '15 mins ago', icon: <AlertTriangle className="w-4 h-4 text-amber-600" /> },
    { id: 3, type: 'merchant', msg: 'New Merchant Onboarded: "Al-Riyadh Trading" (Saudi Node)', time: '1 hour ago', icon: <UserPlus className="w-4 h-4 text-primary" /> },
    { id: 4, type: 'security', msg: 'Login detected from new location: Admin "John_D" (Dubai, UAE)', time: '2 hours ago', icon: <Lock className="w-4 h-4 text-[#ba1a1a]" /> }
  ]);

  // Simulate real-time volume fluctuations to denote "Live Stream" dashboard feel
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveVolume(prev => prev + Math.floor(Math.random() * 850) - 250);
      // Small chance to fluctuate success decimal
      if (Math.random() > 0.7) {
        setSuccessRate(prev => {
          const delta = (Math.random() * 0.1 - 0.05);
          return Math.min(100, Math.max(95, parseFloat((prev + delta).toFixed(2))));
        });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const timeSegments = ['1D', '1W', '1M', '1Y'];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Executive Summary Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#1a1b1f] tracking-tight">{t("Executive Summary 📈")}</h1>
          <p className="text-on-surface-variant text-sm mt-1">{t("Real-time performance across global nodes.")}</p>
        </div>

        {/* iOS Style Segmented Control */}
        <div className="bg-surface-container-high p-1 rounded-xl flex items-center relative w-64 h-10 border border-outline-variant/30">
          <div 
            className="absolute h-8 bg-white rounded-lg shadow-sm w-[23%] transition-all duration-300"
            style={{ 
              left: `${4 + (timeSegments.indexOf(timeFilter) * 24.2)}%`
            }} 
          />
          {timeSegments.map((segment) => (
            <button 
              key={segment}
              onClick={() => {
                setTimeTab(segment);
                // Adjust numbers for demo interactive feel
                if (segment === '1D') { setEarnings(82400); setComplaintsCount(14); }
                else if (segment === '1W') { setEarnings(540200); setComplaintsCount(48); }
                else if (segment === '1M') { setEarnings(2450000); setComplaintsCount(120); }
                else if (segment === '1Y') { setEarnings(28400000); setComplaintsCount(642); }
              }}
              className="relative z-10 flex-1 text-center font-bold text-xs text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              {t(segment)}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Volume */}
        <div className="glass-card p-6 rounded-3xl shadow-sm flex flex-col justify-between border border-primary/10 min-h-[160px] relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <span className="text-3xl">💰</span>
            <span className="bg-emerald-500/10 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.5%
            </span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">{t("Total Volume")}</p>
            <h3 className="text-3xl font-extrabold text-on-surface mt-1">
              ${(liveVolume / 1000000).toFixed(2)}M
            </h3>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 translate-y-4 translate-x-4">
            <Globe2 className="w-24 h-24 text-primary" />
          </div>
        </div>

        {/* Success Rate */}
        <div className="glass-card p-6 rounded-3xl shadow-sm flex flex-col justify-between border border-primary/10 min-h-[160px] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-3xl">🛡️</span>
            <span className="bg-emerald-500/15 text-[#006c49] text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{t("Optimal")}</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">{t("Success Rate")}</p>
            <h3 className="text-3xl font-extrabold text-on-surface mt-1">{successRate}%</h3>
          </div>
        </div>

        {/* Active Complaints */}
        <div className="glass-card p-6 rounded-3xl shadow-sm flex flex-col justify-between border border-error-container/20 min-h-[160px] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-3xl">⚠️</span>
            <span className="bg-error-container text-on-error-container text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{t("Action Needed")}</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">{t("Active Complaints")}</p>
            <h3 className="text-3xl font-extrabold text-[#ba1a1a] mt-1">{complaintsCount}</h3>
          </div>
        </div>

        {/* Fee Revenue */}
        <div className="glass-card p-6 rounded-3xl shadow-sm flex flex-col justify-between border border-primary/10 min-h-[160px] relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-3xl">📊</span>
            <span className="bg-primary/10 text-primary text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{t("Daily Peak")}</span>
          </div>
          <div className="mt-4">
            <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">{t("Fee Revenue")}</p>
            <h3 className="text-3xl font-extrabold text-on-surface mt-1">
              ${(earnings).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h3>
          </div>
        </div>

      </div>

      {/* Main Analysis Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Merchant Performance Map Area */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-between min-h-[380px]">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-on-surface">{t("Merchant Performance Area")}</h2>
              <p className="text-xs text-on-surface-variant mt-1">{t("Operational nodes health index across global markets")}</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-surface-container hover:bg-surface-container-high p-2.5 rounded-xl transition-all">
                <Filter className="w-4 h-4 text-on-surface-variant" />
              </button>
              <button 
                onClick={() => alert(t("Downloading operational node charts CSV..."))}
                className="bg-surface-container hover:bg-surface-container-high p-2.5 rounded-xl transition-all"
              >
                <Download className="w-4 h-4 text-on-surface-variant" />
              </button>
            </div>
          </div>

          {/* Simple Visual Representation of Performance Bar Chart */}
          <div className="h-64 flex items-end justify-around gap-4 px-4 pt-4">
            {[60, 40, 80, 50, 90, 70, 62].map((height, idx) => {
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              const daysAr = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'];
              return (
                <div key={idx} className="group relative flex-1 flex flex-col justify-end items-center h-full">
                  <div className="bg-primary/10 rounded-t-xl w-full h-[95%] absolute bottom-0 max-w-[48px] group-hover:bg-primary/15 transition-all"></div>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.8 }}
                    className="bg-primary rounded-t-xl w-full max-w-[48px] absolute bottom-0 shadow-lg group-hover:scale-y-105 transition-all cursor-pointer"
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#2e303a] text-white text-[10px] px-2 py-1 rounded hidden group-hover:block whitespace-nowrap z-30">
                      {(height * 5.2).toFixed(1)}k txns
                    </div>
                  </motion.div>
                  <p className="font-semibold text-[11px] text-on-surface-variant absolute -bottom-6">
                    {useTranslation().language === 'ar' ? daysAr[idx] : days[idx]}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap gap-6 pt-4 border-t border-outline-variant/30">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-primary" />
              <span className="text-xs font-medium text-on-surface-variant">{t("Successful Settlement Pool")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-primary/20" />
              <span className="text-xs font-medium text-on-surface-variant">{t("Projected Over-counter Volume")}</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Live Feed Section */}
        <div className="glass-card rounded-3xl p-6 shadow-sm border border-outline-variant/30 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                {t("Activity Feed")} <span className="animate-ping w-2 h-2 rounded-full bg-emerald-500" />
              </h2>
              <Sparkles className="w-5 h-5 text-primary" />
            </div>

            <div className="flex flex-col gap-5">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4 border-b border-outline-variant/15 pb-4 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                    {log.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-on-surface leading-snug">{t(log.msg)}</p>
                    <p className="text-[10px] text-on-surface-variant mt-1 uppercase tracking-wider">{t(log.time)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              setLogs(prev => [
                {
                  id: Date.now(),
                  type: 'live',
                  msg: `System balance checked - dynamic limits active`,
                  time: 'Just now',
                  icon: <Activity className="w-4 h-4 text-primary" />
                },
                ...prev.slice(0, 3)
              ]);
            }}
            className="w-full py-3 mt-6 border border-outline bg-transparent hover:bg-surface-container font-semibold rounded-xl transition-all text-xs text-on-surface-variant"
          >
            {t("Load Simulated Event")}
          </button>
        </div>

      </div>
    </motion.div>
  );
}
