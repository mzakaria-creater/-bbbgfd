import React from 'react';
import { ShieldAlert, Key, ArrowRight, UserCheck } from 'lucide-react';
import { usePermissions } from '../context/PermissionsContext';
import { NavLink } from 'react-router-dom';

interface PermissionGuardProps {
  pageName: string;
  children: React.ReactNode;
}

export default function PermissionGuard({ pageName, children }: PermissionGuardProps) {
  const { checkPermission, selectedRole, rolePermissions } = usePermissions();

  const isAllowed = checkPermission(pageName, 'view');
  
  if (!isAllowed) {
    const activePerms = rolePermissions[selectedRole];
    const item = activePerms?.[pageName];
    const scope = item ? item.scope : 'SILOED';

    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-6 bg-white border border-outline-variant rounded-3xl shadow-sm text-center max-w-2xl mx-auto my-12 relative overflow-hidden">
        {/* Neon warning background bubble */}
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Lock Badge */}
        <div className="w-20 h-20 bg-red-100 text-[#ba1a1a] rounded-3xl flex items-center justify-center mb-6 shadow-md transform rotate-3 hover:rotate-0 transition-transform duration-300">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <span className="bg-red-100 text-[#ba1a1a] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
          🔐 L9 Compliance Intercept
        </span>

        <h4 className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
          Security Access Required
        </h4>
        
        <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
          Your active operational role <strong className="text-primary font-bold">"{selectedRole}"</strong> is not authorized to inspect the <strong className="font-bold text-slate-800">{pageName}</strong> ledger module under active central bank rules.
        </p>

        {/* Audited specifications row */}
        <div className="w-full mt-6 grid grid-cols-2 gap-4 text-xs font-semibold bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Intercept Reason</span>
            <span className="text-slate-800">No Read Privilege</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Assigned Scope</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wide bg-slate-200 text-slate-700`}>
              {scope}
            </span>
          </div>
        </div>

        {/* Elevating button CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center justify-center w-full">
          <NavLink 
            to="/rbac"
            className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-[#002f9e] text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Key className="w-4 h-4" />
            <span>Elevate Privileges in RBAC Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
          
          <button 
            type="button"
            onClick={() => alert(`System auditor log submitted. Your identity details are recorded as ${selectedRole}`)}
            className="w-full sm:w-auto px-5 py-3 border border-outline-variant hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all text-center"
          >
            File Operational Exception
          </button>
        </div>

        {/* Terminal logs code footer */}
        <div className="mt-6 border-t border-slate-100 pt-4 w-full flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>AUDIT_CODE: 403_FORBIDDEN</span>
          <span>GATEWAY: LON-CAI-VPN-7</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
