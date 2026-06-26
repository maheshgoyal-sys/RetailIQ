import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  Sparkles, 
  Layers, 
  CheckCircle, 
  XCircle,
  Eye, 
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  List
} from 'lucide-react';
import { leadAPI, segmentAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [segments, setSegments] = useState([]);
  const [selectedSegment, setSelectedSegment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [search, setSearch] = useState('');
  const [generating, setGenerating] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'

  const user = authAPI.getUser();
  const isGuest = user?.isGuest === true;
  const canEdit = !isGuest;

  const fetchLeads = async () => {
    try {
      const data = await leadAPI.getLeads(selectedStatus, selectedSegment);
      setLeads(data);
    } catch (error) {
      toast.error('Failed to load leads');
    }
  };

  const fetchSegments = async () => {
    try {
      const data = await segmentAPI.getSegments();
      setSegments(data);
    } catch (error) {
      toast.error('Failed to load segments');
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchSegments();
  }, [selectedStatus, selectedSegment]);

  const handleGenerateLeads = async () => {
    if (!canEdit) {
      toast.error('Guest mode is read-only. Login to generate leads.');
      return;
    }
    setGenerating(true);
    const loader = toast.loading('Running ML Lead Scoring pipeline...');
    try {
      const res = await leadAPI.generateLeads();
      toast.success(res.message || 'Successfully generated new high-value leads!', { id: loader });
      fetchLeads();
    } catch (error) {
      toast.error('Failed to generate leads', { id: loader });
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    if (!canEdit) {
      toast.error('Guest mode is read-only. Login to change status.');
      return;
    }
    try {
      await leadAPI.updateLeadStatus(id, status.toLowerCase());
      toast.success(`Lead status updated to ${status}`);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  // Filters leads locally for immediate responsive search
  const getFilteredLeads = () => {
    return leads.filter(l => {
      const matchesSearch = l.customerName.toLowerCase().includes(search.toLowerCase()) || 
                            l.email.toLowerCase().includes(search.toLowerCase());
      const matchesSegment = selectedSegment ? l.segmentId === selectedSegment : true;
      const matchesStatus = selectedStatus ? l.status.toLowerCase() === selectedStatus.toLowerCase() : true;
      return matchesSearch && matchesSegment && matchesStatus;
    });
  };

  const filtered = getFilteredLeads();

  // Color classes helpers
  const getScoreColor = (score) => {
    if (score >= 85) return 'bg-purple-500';
    if (score >= 70) return 'bg-emerald-500';
    if (score >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getSegmentBadgeClass = (segmentName) => {
    const s = segmentName?.toLowerCase() || '';
    if (s.includes('high') || s.includes('premium')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (s.includes('regular') || s.includes('active')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s.includes('risk') || s.includes('watch')) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase() || '';
    if (s === 'converted') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s === 'contacted') return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s === 'rejected') return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  // Kanban Columns
  const kanbanColumns = ['new', 'contacted', 'converted', 'rejected'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Leads</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isGuest ? 'Guest mode is read-only. View sample leads and login for live scoring and campaign-ready actions.' : 'Nurture high-score leads generated from targeted high-value segments.'}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Toggles */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              title="Table view"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              title="Kanban Board view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          {/* Generate Leads Trigger */}
          <button
            onClick={handleGenerateLeads}
            disabled={generating || !canEdit}
            className={`glow-btn flex items-center gap-2 ${canEdit ? 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 transition-all duration-300 disabled:opacity-50`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{generating ? 'Scoring ML...' : canEdit ? 'Generate Leads' : 'Guest Read-Only'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between shadow-premium">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-800 text-sm outline-none transition-all duration-200"
          />
        </div>

        {/* Dynamic dropdown filters */}
        <div className="flex gap-3 w-full md:w-auto flex-wrap md:flex-nowrap">
          {/* Segment Filter */}
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2.5 px-4 text-slate-700 text-sm outline-none transition-all min-w-[150px] flex-1 md:flex-none"
          >
            <option value="">All Segments</option>
            {segments.map((s) => (
              <option key={s.id} value={s.id}>{s.segmentName}</option>
            ))}
          </select>

          {/* Status Filter (Table view only) */}
          {viewMode === 'table' && (
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2.5 px-4 text-slate-700 text-sm outline-none transition-all min-w-[130px] flex-1 md:flex-none"
            >
              <option value="">All status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
            </select>
          )}
        </div>
      </div>

      {/* DUAL VIEW IMPLEMENTATION */}

      {viewMode === 'table' ? (
        /* TABLE VIEW (Matches Screenshot 4) */
        <div className="glass-card rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Segment</th>
                  <th className="py-4 px-6">Lead Score</th>
                  <th className="py-4 px-6">Campaign</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">
                      No leads generated yet. Click "Generate Leads" to analyze high-value customers.
                    </td>
                  </tr>
                ) : (
                  filtered.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                      <td className="py-4 px-6 flex flex-col">
                        <span className="text-slate-900 font-bold">{l.customerName}</span>
                        <span className="text-xs text-slate-400 font-normal">{l.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-wide uppercase ${getSegmentBadgeClass(l.segmentName)}`}>
                          {l.segmentName}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full ${getScoreColor(l.leadScore)}`} style={{ width: `${l.leadScore}%` }}></div>
                          </div>
                          <span className="text-slate-900 font-bold text-xs">{l.leadScore}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-medium">{l.campaign || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-wide uppercase ${getStatusBadgeClass(l.status)}`}>
                          {l.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <select
                          value={l.status}
                          onChange={(e) => handleUpdateStatus(l.id, e.target.value)}
                          disabled={!canEdit}
                          className={`bg-white border border-slate-200 text-xs font-bold ${canEdit ? 'text-slate-700 cursor-pointer hover:border-slate-300' : 'text-slate-400 cursor-not-allowed'} py-1.5 px-3 rounded-lg outline-none transition-all`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN BOARD VIEW (Dual Interactive Mode) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {kanbanColumns.map((col) => {
            const columnLeads = filtered.filter(l => l.status.toLowerCase() === col.toLowerCase());
            return (
              <div key={col} className="bg-slate-100/50 border border-slate-200/40 rounded-3xl p-4 flex flex-col gap-4 min-h-[500px]">
                {/* Column Title */}
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{col}</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-white text-slate-500 border border-slate-200 rounded-md shadow-sm">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Column Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {columnLeads.map((l) => (
                    <div 
                      key={l.id} 
                      className="bg-white border border-slate-150 p-4 rounded-2xl shadow-sm hover:shadow-premium-hover transition-all text-left flex flex-col gap-3 group relative"
                    >
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-primary-600 transition-colors">{l.customerName}</h4>
                        <p className="text-[11px] text-slate-400 font-normal mt-0.5 truncate">{l.email}</p>
                      </div>

                      {/* Segment Badge */}
                      <span className={`self-start text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${getSegmentBadgeClass(l.segmentName)}`}>
                        {l.segmentName}
                      </span>

                      {/* Lead Score Progress Meter */}
                      <div className="space-y-1 mt-1">
                        <div className="flex justify-between text-[10px] font-extrabold text-slate-500">
                          <span>Lead Score</span>
                          <span className="text-slate-900">{l.leadScore}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                          <div className={`h-full ${getScoreColor(l.leadScore)}`} style={{ width: `${l.leadScore}%` }}></div>
                        </div>
                      </div>

                      {/* Actions footer for quick status moves */}
                      <div className="flex justify-between items-center pt-2.5 border-t border-slate-50 text-[10px] font-bold text-slate-400">
                        <span>Campaign: <span className="text-slate-600">{l.campaign || 'N/A'}</span></span>
                        <div className="relative group/menu">
                          <button className="text-[10px] bg-slate-50 hover:bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200 transition-all">
                            Move
                          </button>
                          <div className="absolute right-0 bottom-full mb-1 w-28 bg-white border border-slate-200 rounded-lg shadow-xl hidden group-hover/menu:flex flex-col z-20 overflow-hidden py-1">
                            {kanbanColumns.filter(c => c !== col).map(target => (
                              <button
                                key={target}
                                onClick={() => handleUpdateStatus(l.id, target)}
                                className="w-full text-left px-3 py-1.5 text-[10px] text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold uppercase tracking-wider"
                              >
                                To {target}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {columnLeads.length === 0 && (
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl py-12 text-center text-xs font-semibold text-slate-400 px-4">
                      Empty column
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
