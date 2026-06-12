import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  PlusCircle, 
  Search, 
  Paperclip, 
  AtSign, 
  ArrowRight,
  TrendingDown,
  User,
  ExternalLink,
  MessageSquare,
  Upload
} from 'lucide-react';

export default function Disputes() {
  const [filterTab, setFilterTab] = useState('All');
  const [noteText, setNoteText] = useState('');
  
  const [activeTickets, setActiveLedger] = useState<any[]>(() => {
    const saved = localStorage.getItem('finlux_disputes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const defaults = [
      { id: '#TK-48291', time: 'Created 2m ago', tx: 'TXN-0019283', merchant: 'Global Retail Inc.', status: 'Open', agent: 'Sarah K.', priority: 'High', value: 2500, desc: 'Customer claims 2,500 EGP was sent but balance on profile did not reflect it.', attachment: '' },
      { id: '#TK-48285', time: 'Created 1h ago', tx: 'TXN-0019124', merchant: 'Neo Shop Global', status: 'Under Review', agent: 'Omar D.', priority: 'Medium', value: 1200, desc: 'Dual transaction confirmation screenshot uploaded by merchant client.', attachment: '' },
      { id: '#TK-48190', time: 'Created 4h ago', tx: 'TXN-0018872', merchant: 'Cairo Goods Ltd.', status: 'Resolved', agent: 'Laila S.', priority: 'Low', value: 15000, desc: 'Instapay delay outside standard operational hours. Cleared manually.', attachment: '' }
    ];
    localStorage.setItem('finlux_disputes', JSON.stringify(defaults));
    return defaults;
  });

  const [selectedTicketId, setSelectedTicketId] = useState('#TK-48291');
  const selectedTicket = activeTickets.find(t => t.id === selectedTicketId) || activeTickets[0] || {
    id: '#TK-00000', time: 'N/A', tx: 'N/A', merchant: 'System', status: 'Closed', agent: 'N/A', priority: 'Low', value: 0, desc: 'No ticket selected.', attachment: ''
  };

  const [logs, setLogs] = useState<Record<string, any[]>>({
    '#TK-48291': [
      { author: 'Automated System', msg: 'Complaint Logged: Customer claims payment was sent but not credited to balance.', time: '2 hours ago', icon: '⚡', bg: 'bg-primary/10' },
      { author: 'Omar D. (Compliance)', msg: 'Omar D. has taken ownership of the investigation.', time: '45 mins ago', icon: '📝', bg: 'bg-amber-100/60' }
    ],
    '#TK-48285': [
      { author: 'Automated System', msg: 'Multiple confirmation traces triggered. Checking duplicate hash values.', time: '1 hour ago', icon: '⚡', bg: 'bg-primary/10' }
    ],
    '#TK-48190': [
      { author: 'Laila S. (Ops)', msg: 'Manual processing finished. Verified bank receipt. Ticket marked resolved.', time: '3 hours ago', icon: '✅', bg: 'bg-emerald-100/60' }
    ]
  });

  const updateLocalStorage = (newTickets: any[]) => {
    setActiveLedger(newTickets);
    localStorage.setItem('finlux_disputes', JSON.stringify(newTickets));
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    const newLog = {
      author: 'You (Finance Officer)',
      msg: noteText,
      time: 'Just now',
      icon: '💬',
      bg: 'bg-surface-container'
    };
    const ticketId = selectedTicket.id;
    const currentTicketLogs = logs[ticketId] || [];
    setLogs({
      ...logs,
      [ticketId]: [...currentTicketLogs, newLog]
    });
    setNoteText('');
  };

  const createDispute = () => {
    const tx = prompt("Enter the Transaction ID for this dispute:");
    if (tx) {
      const desc = prompt("Enter a brief description of the complaint:") || "No description provided.";
      const mName = prompt("Enter Merchant Name:") || "Global Retail Inc.";
      const egpVal = parseFloat(prompt("Enter Transaction value (EGP):") || "1000");
      const id = '#TK-' + Math.floor(Math.random() * 90000 + 10000);
      const newDispute = {
        id,
        time: 'Created Just now',
        tx,
        merchant: mName,
        status: 'Open',
        agent: 'Unassigned',
        priority: 'Medium',
        value: egpVal,
        desc,
        attachment: ''
      };
      const updated = [newDispute, ...activeTickets];
      updateLocalStorage(updated);
      setSelectedTicketId(id);
    }
  };

  const closeTicket = (id: string) => {
    const updated = activeTickets.map(t => {
      if (t.id === id) {
        return { ...t, status: 'Resolved' };
      }
      return t;
    });
    updateLocalStorage(updated);
    
    // add log entry programmatically
    const currentLogs = logs[id] || [];
    setLogs({
      ...logs,
      [id]: [...currentLogs, { author: 'Compliance Admin', msg: 'Ticket manually closed and resolved based on P2P ledger audits.', time: 'Just now', icon: '✅', bg: 'bg-emerald-50' }]
    });
    alert(`Dispute Ticket ${id} has been closed/resolved successfully!`);
  };

  const changeStatus = (id: string, nextStatus: string) => {
    const updated = activeTickets.map(t => {
      if (t.id === id) {
        return { ...t, status: nextStatus };
      }
      return t;
    });
    updateLocalStorage(updated);
    // Add log
    const currentLogs = logs[id] || [];
    setLogs({
      ...logs,
      [id]: [...currentLogs, { author: 'Compliance Admin', msg: `Ticket status set to ${nextStatus}.`, time: 'Just now', icon: '⚙️', bg: 'bg-amber-50' }]
    });
  };

  // Handle uploading supporting logo / screenshot for dispute
  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>, ticketId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const updated = activeTickets.map(t => {
          if (t.id === ticketId) {
            return { ...t, attachment: base64 };
          }
          return t;
        });
        updateLocalStorage(updated);
        alert("Supporting ticket logo / document photo uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered tickets
  const filteredTickets = activeTickets.filter(t => {
    if (filterTab === 'All') return true;
    if (filterTab === 'Critical') return t.priority === 'High';
    if (filterTab === 'Merchant Only') return t.merchant === 'Global Retail Inc.' || t.merchant === 'Neo Shop Global';
    return true;
  });

  const getLogsForSelected = () => {
    return logs[selectedTicket.id] || [
      { author: 'System Sentinel', msg: 'No external notes added to this dispute ticket.', time: 'N/A', icon: '🛡️', bg: 'bg-gray-100' }
    ];
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Quick Stats Panel Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Open Disputes</p>
          <h3 className="text-3xl font-extrabold text-[#003ec7]">24</h3>
          <p className="text-[#006c49] text-xs flex items-center gap-1 mt-1 font-semibold">
            <span className="material-symbols-outlined text-sm">trending_up</span> +3% from yesterday
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Under Review</p>
          <h3 className="text-3xl font-extrabold text-amber-600">12</h3>
          <p className="text-on-surface-variant text-xs flex items-center gap-1 mt-1">
            <Clock className="w-3.5 h-3.5" /> Avg. 4h action threshold
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-outline-variant shadow-sm">
          <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Resolved Today</p>
          <h3 className="text-3xl font-extrabold text-[#006c49]">86</h3>
          <p className="text-[#006c49] text-xs flex items-center gap-1 mt-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> 98% resolution audit
          </p>
        </div>

        <div 
          onClick={createDispute}
          className="bg-primary hover:bg-[#002f9e] rounded-2xl p-6 border border-primary shadow-lg flex flex-col justify-center items-center text-white cursor-pointer active:scale-95 transition-transform"
        >
          <PlusCircle className="w-8 h-8 mb-1" />
          <p className="font-bold text-sm tracking-wide">Raise Dispute Ticket</p>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Ticket List Area (2/3 width) */}
        <section className="lg:col-span-8 bg-white rounded-2xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant flex items-center justify-between bg-surface-container-lowest">
            <h2 className="text-base font-bold text-on-surface">Recent Disputes Queue</h2>
            <div className="flex gap-1 bg-surface-container-high p-1 rounded-xl">
              {['All', 'Critical', 'Merchant Only'].map((tab) => (
                <button 
                  key={tab}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filterTab === tab ? 'bg-white text-primary shadow-xs' : 'text-on-surface-variant hover:text-on-surface'}`}
                  onClick={() => setFilterTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low text-on-surface-variant font-bold uppercase text-[10px] tracking-widest border-b border-outline-variant">
                  <th className="p-4 pl-6">Ticket ID</th>
                  <th className="p-4">Transaction Source</th>
                  <th className="p-4">Triage Status</th>
                  <th className="p-4">Assigned Agent</th>
                  <th className="p-4">Priority Scope</th>
                  <th className="p-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-medium">
                {filteredTickets.map((ticket, index) => {
                  const isSelected = selectedTicket.id === ticket.id;
                  return (
                    <tr 
                      key={index} 
                      onClick={() => setSelectedTicketId(ticket.id)}
                      className={`hover:bg-surface-container-low/50 transition-colors cursor-pointer group ${isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}
                    >
                      <td className="p-4 pl-6">
                        <p className="font-bold text-primary font-mono text-xs">{ticket.id}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">{ticket.time}</p>
                      </td>

                      <td className="p-4">
                        <p className="text-on-surface font-semibold text-xs">{ticket.tx}</p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5">Mch: {ticket.merchant}</p>
                      </td>

                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          ticket.status === 'Open' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 
                          ticket.status === 'Resolved' ? 'bg-[#x-green] bg-emerald-100 text-[#002113]' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-bold">
                          <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-extrabold text-[9px] text-primary">
                            {ticket.agent ? ticket.agent[0] : 'U'}
                          </div>
                          <span className="text-[11px]">{ticket.agent || 'Unassigned'}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 font-bold ${ticket.priority === 'High' ? 'text-[#ba1a1a]' : 'text-on-surface-variant'}`}>
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          {ticket.priority}
                        </span>
                      </td>

                      <td className="p-4 pr-6 text-right">
                        <button className="w-8 h-8 rounded-full hover:bg-primary/5 flex items-center justify-center text-primary ml-auto">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Detail Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Dispute Context Details Card */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] bg-primary/10 text-primary px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                  Active Audit View
                </span>
                <h3 className="font-bold text-on-surface text-base mt-1">
                  Ticket {selectedTicket.id}
                </h3>
              </div>
              
              <div className="flex gap-1.5">
                {selectedTicket.status !== 'Resolved' && (
                  <button 
                    onClick={() => closeTicket(selectedTicket.id)}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-all shadow-sm"
                  >
                    Resolve & Close
                  </button>
                )}
              </div>
            </div>

            <div className="p-3 bg-surface rounded-xl space-y-2 text-xs">
              <p className="font-bold text-on-surface">Complaint / Logged Info:</p>
              <p className="text-on-surface-variant italic leading-relaxed text-xs">
                "{selectedTicket.desc || 'No further description details verified yet.'}"
              </p>
            </div>

            {/* Quick Status Setter Option */}
            <div className="flex items-center gap-2 justify-between pt-2 border-t border-outline-variant/30">
              <span className="text-xs text-on-surface-variant font-bold">Admin Triage Status:</span>
              <select 
                value={selectedTicket.status}
                onChange={(e) => changeStatus(selectedTicket.id, e.target.value)}
                className="bg-surface border border-outline-variant rounded-lg p-1 text-xs text-on-surface font-bold"
              >
                <option value="Open">Open</option>
                <option value="Under Review">Under Review</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Supporting Screenshot / Logo Upload */}
            <div className="pt-2 border-t border-outline-variant/30 space-y-2">
              <span className="text-xs text-on-surface-variant font-bold block">Attach Supporting Screenshot / Logo Note:</span>
              <div className="flex items-center gap-3">
                {selectedTicket.attachment ? (
                  <div className="w-12 h-12 rounded border border-outline bg-background overflow-hidden relative group">
                    <img src={selectedTicket.attachment} referrerPolicy="no-referrer" alt="screenshot logo" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => {
                        const updated = activeTickets.map(t => t.id === selectedTicket.id ? { ...t, attachment: '' } : t);
                        updateLocalStorage(updated);
                      }}
                      className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">No files uploaded.</div>
                )}
                
                <label className="px-3 py-1.5 bg-surface border border-outline-variant hover:bg-surface-container rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer select-none">
                  <Upload className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span>Upload Image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleAttachmentUpload(e, selectedTicket.id)}
                    className="hidden" 
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Timeline and notes */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-on-surface">Dispute Timeline</h3>
                <span className="text-primary font-bold text-[10px] uppercase">ISO Certified</span>
              </div>

              <div className="space-y-4 relative pl-3 border-l-2 border-dashed border-outline-variant/60 ml-2 max-h-[220px] overflow-y-auto pr-1">
                {getLogsForSelected().map((log, index) => (
                  <div key={index} className="relative">
                    {/* Node Dot */}
                    <div className="absolute -left-[20px] top-1 w-3 h-3 bg-primary rounded-full border-2 border-white" />
                    
                    <div className="bg-surface-container-lowest p-3.5 border border-outline-variant/55 rounded-xl">
                      <p className="text-xs font-bold text-on-surface pb-1 flex items-center gap-1.5">
                        <span>{log.icon}</span> {log.author}
                      </p>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed italic">"{log.msg}"</p>
                      <span className="text-[9px] text-outline block mt-2 text-right">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inline Note Composer */}
            <div className="pt-4 border-t border-outline-variant/35 mt-6 space-y-3">
              <div className="relative">
                <textarea 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Record an internal compliance audit file node..."
                  className="w-full bg-surface border border-outline-variant rounded-xl p-3.5 text-xs min-h-[90px] outline-none focus:ring-2 focus:ring-primary focus:bg-white resize-none"
                />
                
                <div className="flex justify-between items-center mt-2.5">
                  <div className="flex gap-1.5 text-on-surface-variant">
                    <Paperclip className="w-4 h-4 hover:text-primary cursor-pointer" onClick={() => alert("File payload bound to session.")} />
                    <AtSign className="w-4 h-4 hover:text-primary cursor-pointer" onClick={() => setNoteText(prev => prev + '@OmarD ')} />
                  </div>
                  <button 
                    onClick={addNote}
                    className="bg-primary hover:bg-[#002f9e] text-white px-4 py-1.5 rounded-lg font-bold text-xs"
                  >
                    Post Note Action
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Linked transaction snapshot */}
          <div className="bg-[#dfe3ff] text-[#001452] rounded-2xl p-6 border shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold tracking-widest uppercase">Linked Ingress TXN</span>
              <ExternalLink className="w-4 h-4 text-primary" />
            </div>
            
            <h4 className="text-3xl font-extrabold tracking-tight">{(selectedTicket.value || 5250).toLocaleString()} EGP</h4>
            
            <div className="space-y-2 mt-4 text-xs font-semibold text-on-primary-fixed-variant">
              <div className="flex justify-between">
                <span className="opacity-80">Merchant Partner ID:</span>
                <span className="font-mono">{selectedTicket.merchant}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Associated Trans:</span>
                <span className="font-mono">{selectedTicket.tx}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Classification:</span>
                <span className="font-mono text-[#006c49]">Reconciled</span>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </motion.div>
  );
}
