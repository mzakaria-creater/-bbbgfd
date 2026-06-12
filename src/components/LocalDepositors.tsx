import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  Search, 
  Sliders, 
  UserPlus, 
  X, 
  MoreVertical, 
  UserSquare2, 
  Check, 
  FolderLock,
  Smartphone,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

export default function LocalDepositors() {
  const [showConfigpanel, setShowConfigpanel] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>({
    name: 'Khalid Ahmed',
    id: 'LD-882193',
    tier: 'Platinum Tier Depositor',
    limit: 15000,
    methods: { label: 'Vodafone Cash & InstaPay', vodafone: true, bank: false }
  });

  const [agentsList, setAgentsList] = useState([
    { name: 'Khalid Ahmed', initials: 'KA', id: 'LD-882193', tier: 'Platinum Tier Depositor', limitUsed: 12450, totalLimit: 15000, methods: ['Vodafone Cash', 'InstaPay'], commission: '2.1%', methodType: 'Hybrid Scale', status: 'Active' },
    { name: 'Yasmine Mansour', initials: 'YM', id: 'LD-884022', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJs128zzwXaookRHXqOhFskrhrVW-T2x_Py8uV63gnEafxnPLunhgG5ydr7I_BEqRRifrdjCnvFlk01gx4g_gkEZ2bhjkY1u1yF9eQ_fA3KUL3n3ZWv-UG1OlpdjyeoTSucQIkesFJV5gUOfmjpCAeMPyc2o6SkngDkA0YFciJF6Bnr6i1eG28XHGT9CqJGZVZRRjra6IM_ofzVpkEZ-Iiceyn1UzRqzWTDSlQ6rnBo8gFxiZ8GUQZXRPb9oQC9-eYnyRlCNGNoR0', limitUsed: 2100, totalLimit: 25000, methods: ['Orange Money', 'Bank Transfer'], commission: '1.5%', methodType: 'Global Base', status: 'Restricted' },
    { name: 'Omar Mahmoud', initials: 'OM', id: 'LD-911245', limitUsed: 8900, totalLimit: 10000, methods: ['InstaPay'], commission: '1.8%', methodType: 'Performance Plus', status: 'Active' }
  ]);

  const togglePanel = (agent: any) => {
    setSelectedAgent(agent);
    setShowConfigpanel(!showConfigpanel);
  };

  const saveEditedAgent = () => {
    setAgentsList(prev => 
      prev.map(item => item.id === selectedAgent.id ? { ...item, totalLimit: selectedAgent.limit } : item)
    );
    setShowConfigpanel(false);
    alert(`Successfully committed daily transaction bounds for agent: ${selectedAgent.name}`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 relative"
    >
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#191b25] tracking-tight">Local Depositor Management</h1>
          <p className="text-on-surface-variant text-sm mt-1">Configure, monitor, and scale your local agent network performance as part of core P2P settlements.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-colors border border-outline-variant/30">
            <Sliders className="w-3.5 h-3.5" /> Filter Agents
          </button>
          <button 
            onClick={() => {
              const name = prompt("Enter full name of new local depositor agent:");
              if (name) {
                const initials = name.split(' ').map(n=>n[0]).join('');
                const id = 'LD-' + Math.floor(Math.random() * 900000 + 100000);
                setAgentsList([...agentsList, { name, initials, id, tier: 'Standard Depositor', limitUsed: 0, totalLimit: 10000, methods: ['InstaPay'], commission: '1.5%', methodType: 'Global Base', status: 'Active' }]);
              }
            }}
            className="bg-primary hover:bg-[#002f9e] text-white px-6 py-2.5 rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 duration-100"
          >
            <UserPlus className="w-4 h-4" /> Register New Agent
          </button>
        </div>
      </div>

      {/* Stats Bento Layout */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Main Performance Graph representation */}
        <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant relative overflow-hidden h-72 flex flex-col justify-between">
          <div className="flex items-center justify-between z-10 relative mb-4">
            <div>
              <h3 className="text-base font-bold text-on-surface">Network Volume Growth</h3>
              <p className="text-xs text-on-surface-variant">Daily aggregated cash deposit volume across regional nodes.</p>
            </div>
            <div className="flex gap-1 bg-surface-container p-1 rounded-lg">
              <button className="px-3 py-1 rounded bg-white shadow-sm text-[10px] font-bold">1W</button>
              <button className="px-3 py-1 rounded text-[10px] font-semibold text-on-surface-variant hover:text-on-surface">1M</button>
            </div>
          </div>

          <div className="h-44 w-full flex items-end justify-between gap-1 px-4 relative z-10">
            {[40, 55, 45, 70, 65, 85, 95].map((val, idx) => (
              <div key={idx} className="flex-1 bg-primary/10 hover:bg-primary/20 transition-all rounded-t-lg h-full flex flex-col justify-end items-center relative group cursor-pointer">
                <div className="bg-primary rounded-t-lg w-full max-w-[36px]" style={{ height: `${val}%` }}></div>
                {idx === 6 && (
                  <div className="absolute -top-10 bg-[#191b25] text-white text-[9px] px-2 py-1 rounded font-bold whitespace-nowrap shadow z-20">Peak: $42.5k</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Total Active Agents side metrics */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-primary text-white p-6 rounded-2xl shadow-md flex flex-col justify-between h-1/2 relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <span className="material-symbols-outlined bg-white/20 p-2.5 rounded-full text-white">Groups</span>
              <span className="text-[10px] font-extrabold bg-white/25 px-2.5 py-1 rounded-full">+12.4% Optimal</span>
            </div>
            <div className="z-10 mt-2">
              <p className="text-[13px] opacity-80 uppercase tracking-widest font-medium">Total Active Agents</p>
              <h4 className="text-3xl font-extrabold leading-none mt-1">1,284</h4>
            </div>
          </div>

          <div className="bg-white border border-outline-variant p-6 rounded-2xl shadow-sm flex flex-col justify-between h-1/2">
            <div className="flex justify-between items-start">
              <span className="material-symbols-outlined bg-emerald-500/10 text-emerald-800 p-2.5 rounded-full">Trending_Up</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Average Commission Structure</p>
              <h4 className="text-2xl font-extrabold text-on-surface mt-1">1.85%</h4>
              <div className="w-full bg-surface-container rounded-full h-1 mt-3">
                <div className="bg-[#006c49] w-3/4 h-1 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Ledger Table */}
      <section className="bg-white border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
          <h3 className="font-bold text-base text-on-surface">Active Agent Ledger</h3>
          <p className="text-xs text-on-surface-variant">Click on any agent row to slide open configuration drawer.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-surface-container text-on-surface-variant font-bold uppercase text-[10px] tracking-widest border-b border-outline-variant">
              <tr>
                <th className="px-6 py-4">Agent Name &amp; Details</th>
                <th className="px-6 py-4">Assigned Methods</th>
                <th className="px-6 py-4">Daily Limit Usage</th>
                <th className="px-6 py-4">Commission Model</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/35 font-medium cursor-pointer">
              {agentsList.map((agent) => (
                <tr 
                  key={agent.id} 
                  onClick={() => togglePanel(agent)}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      {agent.img ? (
                        <img src={agent.img} className="w-10 h-10 rounded-full border" alt={agent.name} />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-primary text-xs">
                          {agent.initials}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-on-surface text-sm">{agent.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">ID: {agent.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex gap-1.5 flex-wrap">
                      {agent.methods.map((method, idx) => (
                        <span key={idx} className="bg-surface-container px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant tracking-wider">
                          {method}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-5 w-64">
                    <div className="flex items-center justify-between mb-1 text-[11px] font-bold">
                      <span className="text-[#191b25]">EGP {agent.limitUsed.toLocaleString()} / {agent.totalLimit.toLocaleString()}</span>
                      <span className="text-primary">{Math.round((agent.limitUsed / agent.totalLimit) * 100)}%</span>
                    </div>
                    <div className="w-full bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(100, (agent.limitUsed / agent.totalLimit) * 100)}%` }}></div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p className="font-mono text-on-surface font-extrabold text-sm">{agent.commission}</p>
                    <p className="text-[10px] text-on-surface-variant">{agent.methodType}</p>
                  </td>

                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 font-bold ${agent.status === 'Active' ? 'text-secondary' : 'text-[#ba1a1a]'}`}>
                      <span className={`w-2 h-2 rounded-full ${agent.status === 'Active' ? 'bg-secondary animate-pulse' : 'bg-[#ba1a1a]'}`}></span>
                      {agent.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right">
                    <button className="p-1 px-2 hover:bg-surface-container rounded-lg"><MoreVertical className="w-4 h-4 text-outline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Side Slide-Open Drawer (Agent Configuration) */}
      <AnimatePresence>
        {showConfigpanel && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-[#0a0118]/30 backdrop-blur-xs z-50" onClick={() => setShowConfigpanel(false)} />
            
            <motion.aside 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 h-screen w-[400px] bg-white border-l border-outline-variant shadow-2xl z-[60] p-6 flex flex-col justify-between"
            >
              <div className="space-y-6 overflow-y-auto pr-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-on-surface">Agent Configuration</h3>
                  <button className="p-1.5 hover:bg-surface-container rounded-full" onClick={() => setShowConfigpanel(false)}>
                    <X className="w-5 h-5 text-on-surface-variant" />
                  </button>
                </div>

                {/* Profile card preview inside slideout */}
                <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xl">
                    {selectedAgent.initials || 'KA'}
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{selectedAgent.name}</h4>
                    <p className="text-[11px] text-on-surface-variant uppercase tracking-widest font-extrabold">{selectedAgent.tier || 'Platinum Agent'}</p>
                  </div>
                </div>

                {/* Daily Volume settings */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">Daily EGP Volume Bounds</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold">EGP</span>
                    <input 
                      type="number" 
                      value={selectedAgent.limit || selectedAgent.totalLimit || 15000}
                      onChange={(e) => setSelectedAgent({ ...selectedAgent, limit: parseInt(e.target.value) })}
                      className="w-full pl-12 pr-4 py-3 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-semibold text-sm"
                    />
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-medium">Platform compliance standards request Plat tier limits under 35,000 EGP.</p>
                </div>

                {/* Authorized Methods checklist toggles */}
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">Settlement Channels Authorized</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3.5 bg-surface border border-outline-variant rounded-xl">
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <Smartphone className="w-4 h-4 text-primary" />
                        <span>Vodafone Cash Wallet</span>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-4.5 w-4.5" />
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-surface border border-outline-variant rounded-xl">
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <FolderLock className="w-4 h-4 text-[#ba1a1a]" />
                        <span>Bank Wire Settlements</span>
                      </div>
                      <input type="checkbox" className="rounded text-primary focus:ring-primary h-4.5 w-4.5" />
                    </div>
                  </div>
                </div>

                {/* Commission select structure */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wide">Multi-Level Share Logic</label>
                  <select className="w-full py-3 px-4 border border-outline-variant rounded-xl text-xs font-bold bg-white text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option>Performance Based Hybrid scale</option>
                    <option>Fixed Flat Global (1.50%)</option>
                    <option>Tiered Volume Cumulative scale</option>
                  </select>
                </div>
              </div>

              {/* Bottom Drawer Actions */}
              <div className="sticky bottom-0 pt-4 border-t border-outline-variant/30 bg-white grid grid-cols-2 gap-3">
                <button 
                  onClick={saveEditedAgent}
                  className="w-full bg-primary hover:bg-[#002f9e] text-white py-3 rounded-xl font-bold text-xs"
                >
                  Save Settings
                </button>
                <button 
                  onClick={() => {
                    alert(`Revoked active operational bounds for ${selectedAgent.name}. Status set offline.`);
                    setShowConfigpanel(false);
                  }}
                  className="w-full bg-[#f4f3f8] border border-[#ba1a1a]/20 text-[#ba1a1a] py-3 rounded-xl font-bold text-xs hover:bg-[#ba1a1a]/5"
                >
                  Revoke Scope
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Background soft pulse graphics */}
      <div className="absolute top-0 left-0 -z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      </div>
    </motion.div>
  );
}
