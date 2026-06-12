import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../context/LanguageContext';

export function ClientCard({ title, subtitle, avatar, icon, details }: any) {
  const { t } = useTranslation();
  return (
    <div className="p-6 transition-all duration-300 glass-card-sm rounded-[32px] group hover:bg-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 overflow-hidden rounded-2xl border border-white/20">
            <img src={avatar} alt={title} className="object-cover w-full h-full" />
          </div>
          <div>
            <h3 className="font-semibold text-on-surface">{t(title)}</h3>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">{t(subtitle)}</span>
          </div>
        </div>
        <div className="transition-transform group-hover:scale-110">
          {icon}
        </div>
      </div>
      <div className="space-y-3">
        {details.map((d: any, i: number) => (
          <div key={i} className={`flex justify-between text-sm py-2 ${i !== details.length - 1 ? 'border-b border-white/5' : ''}`}>
            <span className="text-white/40">{t(d.label)}</span>
            <span className={`
              ${d.mono ? 'font-mono' : 'font-medium'} 
              ${d.highlight ? 'text-primary font-bold' : 'text-on-surface'}
              ${d.bold ? 'font-bold' : ''}
            `}>{t(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RiskAlert({ icon, title, desc }: any) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center space-x-4 p-4 glass-card-sm rounded-2xl">
      {icon}
      <div className="flex-1">
        <p className="text-sm font-medium">{t(title)}</p>
        <p className="text-xs text-white/40">{t(desc)}</p>
      </div>
    </div>
  );
}

export function NoteEntry({ initials, name, role, time, content, system }: any) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold border ${system ? 'bg-primary/20 text-primary border-primary/20' : 'bg-white/10 text-white/60 border-white/10'}`}>
        {initials}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm font-semibold text-on-surface">
            {t(name)} {role && <span className="ml-2 text-xs font-normal text-white/30">{t(role)}</span>}
          </span>
          <span className="text-xs text-white/40">{t(time)}</span>
        </div>
        <p className={`text-sm text-white/60 leading-relaxed ${system ? 'italic' : ''}`}>
          {t(content)}
        </p>
      </div>
    </div>
  );
}

export function TimelineItem({ status, title, time, badge }: any) {
  const { t } = useTranslation();
  const isCompleted = status === 'completed';
  const isActive = status === 'active';
  
  return (
    <div className={`flex gap-6 items-start ${status === 'pending' ? 'opacity-40' : ''}`}>
      <div className="relative z-10 pt-1">
        {isCompleted ? (
          <div className="w-2 h-2 bg-secondary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        ) : isActive ? (
          <div className="w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)] animate-pulse" />
        ) : (
          <div className="w-2 h-2 bg-white/20 rounded-full" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
           <div>
              <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-on-surface'}`}>{t(title)}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">{t(time)}</p>
           </div>
        </div>
        {badge && (
          <div className="mt-2 text-[10px] font-medium text-primary uppercase tracking-widest px-2 py-0.5 bg-primary/10 border border-primary/20 rounded w-fit">
            {t(badge)}
          </div>
        )}
      </div>
    </div>
  );
}

export function FooterButton({ icon, label }: any) {
  const { t } = useTranslation();
  return (
    <button className="flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors hover:bg-white/10 rounded-2xl text-white/60">
      {icon}
      {t(label)}
    </button>
  );
}
