import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  Users, 
  Clock, 
  Key, 
  ChevronRight, 
  CheckCircle,
  Plus, 
  FolderLock,
  Lock,
  Globe,
  Settings,
  X,
  AlertTriangle
} from 'lucide-react';
import { usePermissions, RolePermissions, PermissionItem } from '../context/PermissionsContext';
import { useTranslation } from '../context/LanguageContext';

export default function RBACStudio() {
  const { t } = useTranslation();
  const {
    selectedRole,
    setSelectedRole,
    roles,
    setRoles,
    rolePermissions,
    updatePermission,
    updateDataSilo
  } = usePermissions();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'matrix' | 'conflict'>('matrix');

  // New role parameters
  const handleAddNewRole = () => {
    const roleName = prompt("Enter name for the new security role:");
    if (!roleName) return;
    
    const cleanName = roleName.trim();
    if (roles.find(r => r.name.toLowerCase() === cleanName.toLowerCase())) {
      alert("A role with this name already exists.");
      return;
    }

    setRoles(prev => [
      ...prev,
      { name: cleanName, desc: 'Custom System Operator Workspace', active: true, users: 0 }
    ]);
    setSelectedRole(cleanName);
    alert(`Successfully generated security schema rules for "${cleanName}".`);
  };

  const handleToggle = (pageName: string, flag: 'view' | 'edit' | 'approval') => {
    const currentVal = rolePermissions[selectedRole]?.[pageName]?.[flag] ?? false;
    updatePermission(selectedRole, pageName, flag, !currentVal);
  };

  const cycleScope = (pageName: string) => {
    const currentScope = rolePermissions[selectedRole]?.[pageName]?.scope || 'GLOBAL';
    const scopes: ('GLOBAL' | 'REGIONAL' | 'READ-ONLY' | 'SILOED')[] = ['GLOBAL', 'REGIONAL', 'READ-ONLY', 'SILOED'];
    const nextIdx = (scopes.indexOf(currentScope) + 1) % scopes.length;
    updateDataSilo(selectedRole, pageName, scopes[nextIdx]);
  };

  // Filter permission items
  const activePerms: RolePermissions = rolePermissions[selectedRole] || {};
  const permList: [string, PermissionItem][] = Object.entries(activePerms) as [string, PermissionItem][];
  const filteredPerms = permList.filter(([pageName]) => 
    pageName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Dynamic statistics
  const totalEnabledViews = permList.filter(([_, value]) => value.view).length;
  const totalEnabledEdits = permList.filter(([_, value]) => value.edit).length;
  const totalEnabledApprovals = permList.filter(([_, value]) => value.approval).length;

  const getSiloBadgeColor = (scope: string) => {
    switch (scope) {
      case 'GLOBAL': return 'bg-emerald-100/80 text-[#006c49] border-emerald-200/50';
      case 'REGIONAL': return 'bg-blue-100/80 text-blue-800 border-blue-200/50';
      case 'READ-ONLY': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'SILOED': return 'bg-red-50 text-red-800 border-red-200/40';
      default: return 'bg-indigo-50 text-indigo-700';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 text-left"
    >
      {/* Breadcrumb & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 gap-1">
            <span>{t("Identity Engine")}</span>
            <span>/</span>
            <span className="text-primary font-bold">{t("Compliance Profiles")}</span>
          </nav>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t("RBAC & Permissions Studio")}</h3>
          <p className="text-xs text-slate-500 mt-1">Configuring secure access scopes across global operations</p>
        </div>
        <button 
          onClick={handleAddNewRole}
          className="flex items-center gap-2 bg-primary hover:bg-[#002f9e] text-white px-5 py-2.5 rounded-xl font-bold shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {t("Create New Role")}
        </button>
      </div>

      {/* Grid containing Roles lists and main Table mapping */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Roles list Card (Left bento block) */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">{t("System Roles")}</h4>
              <span className="bg-[#6cf8bb]/20 text-[#006c49] px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest">{roles.length} {t("Active")}</span>
            </div>
            
            <p className="text-xs text-slate-400 mb-4">Click any system or custom role to view and map live permission parameters across the sandbox.</p>

            <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
              {roles.map((role) => {
                const active = selectedRole === role.name;
                return (
                  <div 
                    key={role.name}
                    id={`role_btn_${role.name.replace(/\s+/g, '_')}`}
                    onClick={() => setSelectedRole(role.name)}
                    className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer transition-all border ${
                      active 
                      ? 'bg-neutral-900 text-white border-neutral-950 shadow-md scale-[1.01]' 
                      : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <FolderLock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`text-xs font-black ${active ? 'text-white' : 'text-slate-800'}`}>{role.name}</p>
                        <p className={`text-[10px] ${active ? 'text-slate-400' : 'text-slate-400'}`}>{role.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded ${active ? 'bg-white/10 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        {role.users} {t("Users")}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 bg-slate-50/50 p-3 rounded-2xl">
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider block mb-1">Audit Sandbox</span>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Live updates propagate immediately with zero restarts. Try toggling <span className="font-bold text-slate-800">"View"</span> or <span className="font-bold text-slate-800">"Edit"</span> and then switch tabs using the sidebar.
            </p>
          </div>
        </div>

        {/* Dynamic Permissions Matrix Grid (Right bento block) */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200/80 rounded-3xl shadow-xs overflow-hidden flex flex-col justify-between">
          
          {/* Controls Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Key className="w-4.5 h-4.5 text-primary" />
                <span>SPECIFICATIONS FOR:</span> 
                <span className="text-primary font-black px-2 pb-0.5 pt-0.5 bg-primary/10 rounded">{selectedRole}</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 font-semibold">Configuring 11 system-wide operational segments and action permissions.</p>
            </div>

            {/* Filter Input */}
            <div className="relative w-full sm:w-auto">
              <input 
                type="text"
                placeholder={t("Filter pages...")}
                value={searchQuery}
                id="rbac_search_input"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 px-3.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary font-bold placeholder-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Matrix table list view */}
          <div className="flex-1 overflow-x-auto min-h-[380px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">{t("System Page / Component")}</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">{t("View Page")}</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">{t("Edit Data")}</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">{t("Approve Exec")}</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">{t("Data Silo Scope")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPerms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-xs font-bold text-slate-400">
                      No system pages match your search term.
                    </td>
                  </tr>
                ) : (
                  filteredPerms.map(([pageName, item]) => (
                    <tr key={pageName} className="hover:bg-slate-50/70 transition-all">
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-slate-800">{t(pageName)}</span>
                          <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{t(item.sub)}</span>
                        </div>
                      </td>

                      {/* View check */}
                      <td className="px-4 py-3.5 text-center">
                        <button 
                          onClick={() => handleToggle(pageName, 'view')}
                          id={`toggle_view_${pageName.replace(/\s+/g, '_')}`}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:ring-2 focus:ring-primary/20 ${item.view ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${item.view ? 'translate-x-4.5' : 'translate-x-0'}`} />
                        </button>
                      </td>

                      {/* Edit check */}
                      <td className="px-4 py-3.5 text-center">
                        <button 
                          onClick={() => handleToggle(pageName, 'edit')}
                          id={`toggle_edit_${pageName.replace(/\s+/g, '_')}`}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:ring-2 focus:ring-primary/20 ${item.edit ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${item.edit ? 'translate-x-4.5' : 'translate-x-0'}`} />
                        </button>
                      </td>

                      {/* Approval check */}
                      <td className="px-4 py-3.5 text-center">
                        <button 
                          onClick={() => handleToggle(pageName, 'approval')}
                          id={`toggle_approval_${pageName.replace(/\s+/g, '_')}`}
                          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors focus:ring-2 focus:ring-primary/20 ${item.approval ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                          <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs transform transition-transform duration-200 ${item.approval ? 'translate-x-4.5' : 'translate-x-0'}`} />
                        </button>
                      </td>

                      {/* Data Silo click rotation */}
                      <td className="px-4 py-3.5 text-center">
                        <button 
                          onClick={() => cycleScope(pageName)}
                          id={`btn_scope_${pageName.replace(/\s+/g, '_')}`}
                          className={`px-2.5 py-0.5 border text-[9px] font-black uppercase tracking-wider rounded-md cursor-pointer transition-all hover:scale-105 active:scale-95 ${getSiloBadgeColor(item.scope)}`}
                        >
                          {item.scope}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Quick Apply / Reset Rule Actions */}
          <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500">
            <span>
              Total Scopes Configured: <strong className="text-slate-800">{filteredPerms.length} Modules</strong>
            </span>
            <div className="flex gap-2 w-full sm:w-auto">
              <button 
                onClick={() => {
                  if (confirm("Reset current grid rules to default sandbox parameters?")) {
                    localStorage.removeItem('finlux_role_permissions');
                    window.location.reload();
                  }
                }}
                className="px-4.5 py-2 border border-slate-200 hover:border-slate-300 text-slate-600 font-bold bg-white rounded-xl text-xs flex-1 sm:flex-none cursor-pointer"
              >
                Reset Layout Settings
              </button>
              <button 
                onClick={() => alert(`Operational permissions for "${selectedRole}" deployed across core gateways.`)}
                className="px-6 py-2 bg-primary hover:bg-[#002f9e] text-white font-bold rounded-xl text-xs flex-1 sm:flex-none shadow-sm cursor-pointer"
              >
                Apply & Compile
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Dynamic Statistics Bar based on live selections */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Permitted Page Views</p>
            <p className="text-base font-black text-slate-800">{totalEnabledViews} / 11 Pages Accessible</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dynamic Administrators</p>
            <p className="text-base font-black text-slate-800">
              {roles.find(r => r.name === selectedRole)?.users ?? 0} Live Assignments
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center gap-4 shadow-2xs">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Security State Code</p>
            <p className="text-base font-black text-slate-800">
              {selectedRole === 'Super Admin' ? 'Audit Safe' : 'Co-Sign Enforced'}
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Conflict Audit avoidance card */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-neutral-950 transform rotate-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h5 className="font-extrabold text-sm">{t("Automated Conflict Auditor")}</h5>
            <p className="text-xs text-neutral-400 max-w-xl mt-1">
              Any toggles changed above are compiled into central access tables safely. If <span className="text-white font-bold">"Approval"</span> is granted but <span className="text-white font-bold">"Edit"</span> is off, the conflict engine auto-generates dual-administrator co-signature triggers.
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => alert("Verification Scan complete: 0 unlogged overlaps detected.")}
          className="bg-white text-neutral-950 hover:bg-neutral-100 px-5 py-3 rounded-xl font-bold text-xs whitespace-nowrap active:scale-[0.98] transition-all z-10 cursor-pointer"
        >
          {t("Audit Security Rules")}
        </button>
      </div>

    </motion.div>
  );
}
