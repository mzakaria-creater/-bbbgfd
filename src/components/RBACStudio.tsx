import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  Users, 
  Clock, 
  HelpCircle, 
  Key, 
  ChevronRight, 
  Layers, 
  XSquare, 
  CheckCircle,
  Plus, 
  FolderLock
} from 'lucide-react';

export default function RBACStudio() {
  const [selectedRole, setSelectedRole] = useState('Super Admin');
  const [roles, setRoles] = useState([
    { name: 'Super Admin', desc: 'Full Global Access', active: true, users: 12 },
    { name: 'Ops Manager', desc: 'Regional Control', active: true, users: 240 },
    { name: 'Finance', desc: 'Treasury & Ledger', active: true, users: 48 },
    { name: 'Risk & Compliance', desc: 'KYC/AML Scope', active: true, users: 15 }
  ]);

  interface PermissionsType {
    [key: string]: {
      view: boolean;
      edit: boolean;
      approval: boolean;
      scope: string;
      sub: string;
    };
  }

  // Reactive state for the checkboxes matrix
  const [permissions, setPermissions] = useState<PermissionsType>({
    'Payment Methods': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Vodafone, Instapay, Orange' },
    'Merchant Routing': { view: true, edit: true, approval: false, scope: 'GLOBAL', sub: 'Account Assignments' },
    'Fees & Pricing': { view: true, edit: true, approval: true, scope: 'GLOBAL', sub: 'Global & Hybrid Models' },
    'Commissions': { view: true, edit: true, approval: false, scope: 'GLOBAL', sub: 'Multi-Level Referrals' }
  });

  const handleToggle = (module: string, flag: 'view' | 'edit' | 'approval') => {
    setPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [flag]: !prev[module][flag]
      }
    }));
  };

  const publishRules = () => {
    alert(`Successfully compiled and published RBAC Security Profile: "${selectedRole}". Enacting changes across API gateway proxies...`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1 gap-1">
            <span>Identity Engine</span>
            <span>/</span>
            <span className="text-primary font-bold">Permission Profiles</span>
          </nav>
          <h3 className="text-2xl font-bold text-on-surface">Manage Access Scopes</h3>
        </div>
        <button 
          onClick={() => {
            const roleName = prompt("Enter name for new customized system role:");
            if (roleName) {
              setRoles([...roles, { name: roleName, desc: 'Custom configured', active: true, users: 0 }]);
            }
          }}
          className="flex items-center gap-2 bg-primary hover:bg-[#002f9e] text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-all text-xs"
        >
          <Plus className="w-4 h-4" />
          Create New Role
        </button>
      </div>

      {/* Bento Layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Role Selector Bento Card */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-outline-variant rounded-xl shadow-sm p-6 overflow-hidden relative">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-base font-bold text-on-surface">System Roles</h4>
            <span className="bg-[#6cf8bb] text-[#002113] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">{roles.length} Active</span>
          </div>

          <div className="space-y-3">
            {roles.map((role) => {
              const active = selectedRole === role.name;
              return (
                <div 
                  key={role.name}
                  onClick={() => setSelectedRole(role.name)}
                  className={`p-4 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    active 
                    ? 'bg-surface-container-low border-l-4 border-primary shadow-sm' 
                    : 'border border-outline-variant/50 hover:bg-surface-container-lowest hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      <FolderLock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{role.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{role.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${active ? 'text-primary' : 'text-outline-variant'}`} />
                </div>
              );
            })}
          </div>

          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary opacity-5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Matrix Grid Bento Card */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-lowest">
            <div>
              <h4 className="text-base font-bold text-on-surface flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                Permissions Matrix: <span className="text-primary font-extrabold">{selectedRole}</span>
              </h4>
              <p className="text-xs text-on-surface-variant">Configuring global platform modules access scopes</p>
            </div>
            
            <div className="flex items-center gap-1 bg-surface-container rounded-lg p-1 border border-outline-variant">
              <button className="px-3 py-1 bg-white text-primary shadow-sm rounded-md text-[11px] font-bold">List View</button>
              <button className="px-3 py-1 text-on-surface-variant text-[11px] font-medium" onClick={() => alert("Module map visual is currently compiled offline.")}>Module Map</button>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low sticky top-0">
                <tr className="border-b border-outline-variant">
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-wider">Module / Feature</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant text-center uppercase tracking-wider">View</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant text-center uppercase tracking-wider">Edit</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant text-center uppercase tracking-wider">Approval</th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant text-center uppercase tracking-wider">Data Silo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {(Object.entries(permissions) as [string, { view: boolean; edit: boolean; approval: boolean; scope: string; sub: string }][]).map(([moduleName, perm]) => (
                  <tr key={moduleName} className="hover:bg-surface-container-lowest/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-on-surface">{moduleName}</span>
                        <span className="text-[10px] text-on-surface-variant font-medium">{perm.sub}</span>
                      </div>
                    </td>
                    
                    {/* View Switch */}
                    <td className="px-6 py-4 text-center">
                      <div 
                        onClick={() => handleToggle(moduleName, 'view')} 
                        className={`ios-toggle-container mx-auto ${perm.view ? 'bg-primary' : 'bg-outline-variant/60'}`}
                      >
                        <span className={`ios-toggle-dot ${perm.view ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    </td>
                    
                    {/* Edit Switch */}
                    <td className="px-6 py-4 text-center">
                      <div 
                        onClick={() => handleToggle(moduleName, 'edit')} 
                        className={`ios-toggle-container mx-auto ${perm.edit ? 'bg-primary' : 'bg-outline-variant/60'}`}
                      >
                        <span className={`ios-toggle-dot ${perm.edit ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    </td>
                    
                    {/* Approval Switch */}
                    <td className="px-6 py-4 text-center">
                      <div 
                        onClick={() => handleToggle(moduleName, 'approval')} 
                        className={`ios-toggle-container mx-auto ${perm.approval ? 'bg-primary' : 'bg-outline-variant/60'}`}
                      >
                        <span className={`ios-toggle-dot ${perm.approval ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className="bg-[#dfe3ff] text-[#001452] px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wide">
                        {perm.scope}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-surface-container-lowest border-t border-outline-variant flex justify-end gap-3">
            <button 
              onClick={() => {
                alert("Matrix states reset successfully.");
              }}
              className="px-6 py-2 border border-outline-variant rounded-full text-xs font-semibold text-on-surface hover:bg-surface-container transition-all"
            >
              Discard Changes
            </button>
            <button 
              onClick={publishRules}
              className="px-8 py-2 bg-primary hover:bg-[#002f9e] text-white rounded-full text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all animate-pulse"
            >
              Publish Role Scopes
            </button>
          </div>
        </div>

      </div>

      {/* Mini Stat Widget strip under */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-100/60 text-[#006c49] rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Security Health Profile</p>
            <p className="text-base font-bold text-on-surface">No Overlapping Scopes</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100/60 text-primary rounded-full flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Global Assigned Users</p>
            <p className="text-base font-bold text-on-surface">1,284 Administrators</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
          <div className="w-14 h-14 bg-amber-100/60 text-amber-800 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8" />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant font-medium">Last Security Audit</p>
            <p className="text-base font-bold text-on-surface">2 hours ago</p>
          </div>
        </div>
      </section>

      {/* Conflict Resolution Prompt Module */}
      <div className="bg-[#2e303a] text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#ba1a1a] rounded-2xl flex items-center justify-center text-white transform rotate-3">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <h5 className="font-bold text-sm">Conflict Avoidance Engine Active</h5>
            <p className="text-xs text-white/80 max-w-xl mt-1">Our automated security daemon has verified 3 potential multi-sig conflicts under 'Ops Manager' assignment scopes. Resolve now to maintain strict bank compliance rules.</p>
          </div>
        </div>
        <button 
          onClick={() => alert("Loading compliance override wizard...")}
          className="bg-white text-on-surface hover:bg-surface-container px-6 py-3 rounded-xl font-bold text-xs whitespace-nowrap tracking-wide active:scale-95 duration-100"
        >
          Resolve Conflicts
        </button>
      </div>
    </motion.div>
  );
}
