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
  MessageSquare
} from 'lucide-react';

export default function Disputes() {
  const [filterTab, setFilterTab] = useState('All');
  const [noteText, setNoteText] = useState('');
  const [logs, setLogs] = useState([
    { author: 'Automated System', msg: 'Complaint Logged: Customer claims payment was sent but not credited to balance.', time: '2 hours ago', icon: '⚡', bg: 'bg-primary/10' },
    { author: 'Omar D. (Compliance)', msg: 'Omar D. has taken ownership of the investigation.', time: '45 mins ago', icon: '📝', bg: 'bg-amber-100/60' }
  ]);

  const [activeTickets, setActiveLedger] = useState([
    { id: '#TK-48291', time: 'Created 2m ago', tx: 'TXN-0019283', merchant: 'Vodafone Cash', status: 'Open', agent: 'Sarah K.', priority: 'High' },
    { id: '#TK-48285', time: 'Created 1h ago', tx: 'TXN-0019124', merchant: 'InstaPay', status: 'Under Review', agent: 'Omar D.', priority: 'Medium' },
    { id: '#TK-48190', time: 'Created 4h ago', tx: 'TXN-0018872', merchant: 'Orange Money', status: 'Resolved', agent: 'Laila S.', priority: 'Low' }
  ]);

  const addNote = () => {
    if (!noteText.trim()) return;
    const newLog = {
      author: 'You (Finance Officer)',
      msg: noteText,
      time: 'Just now',
      icon: '💬',
      bg: 'bg-surface-container'
    };
    setLogs([...logs, newLog]);
    setNoteText('');
  };

  const createDispute = () => {
    const tx = prompt("Enter the Transaction ID for this dispute:");
    if (tx) {
      const id = '#TK-' + Math.floor(Math.random() * 90000 + 10000);
      const newDispute = {
        id,
        time: 'Created Just now',
        tx,
        merchant: 'InstaPay Egypt',
        status: 'Open',
        agent: 'Unassigned',
        priority: 'Medium'
      };
      setActiveLedger([newDispute, ...activeTickets]);
    }
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
                {activeTickets.map((ticket, index) => (
                  <tr key={index} className="hover:bg-surface-container-low/30 transition-colors cursor-pointer group">
                    <td className="p-4 pl-6">
                      <p className="font-bold text-primary font-mono text-xs">{ticket.id}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{ticket.time}</p>
                    </td>

                    <td className="p-4">
                      <p className="text-on-surface font-semibold text-xs">{ticket.tx}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">Wallet: {ticket.merchant}</p>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        ticket.status === 'Open' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 
                        ticket.status === 'Resolved' ? 'bg-[#6cf8bb] text-[#002113]' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 font-bold">
                        <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center font-extrabold text-[9px] text-primary">
                          {ticket.agent[0]}
                        </div>
                        <span className="text-[11px]">{ticket.agent}</span>
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
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right Detail Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          
          {/* Timeline and notes */}
          <div className="bg-white rounded-2xl border border-outline-variant shadow-sm p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-sm text-on-surface">Dispute Timeline</h3>
                <span className="text-primary font-bold text-[10px] uppercase">ISO Certified</span>
              </div>

              <div className="space-y-4 relative pl-3 border-l-2 border-dashed border-outline-variant/60 ml-2">
                {logs.map((log, index) => (
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
            
            <h4 className="text-3xl font-extrabold tracking-tight">5,250.00 EGP</h4>
            
            <div className="space-y-2 mt-4 text-xs font-semibold text-on-primary-fixed-variant">
              <div className="flex justify-between">
                <span className="opacity-80">Merchant Partner ID:</span>
                <span className="font-mono">MCH-8821</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Disbursement Channel:</span>
                <span className="font-mono">POS-CAI-01</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Classification:</span>
                <span className="font-mono text-[#006c49]">Deposit</span>
              </div>
            </div>
          </div>

        </aside>

      </div>
    </motion.div>
  );
}
