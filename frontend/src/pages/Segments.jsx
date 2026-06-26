import React, { useState, useEffect } from 'react';
import { Layers, HelpCircle, ArrowUpRight, Send, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { segmentAPI, customerAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Segments() {
  const [segments, setSegments] = useState([]);
  const [expandedSegment, setExpandedSegment] = useState(null);
  const [segmentCustomers, setSegmentCustomers] = useState({});
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const navigate = useNavigate();

  const fetchSegments = async () => {
    try {
      const data = await segmentAPI.getSegments();
      setSegments(data);
    } catch (error) {
      toast.error('Failed to load segments');
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const toggleExpand = async (segName) => {
    if (expandedSegment === segName) {
      setExpandedSegment(null);
      return;
    }

    setExpandedSegment(segName);
    
    // Fetch customers in this segment
    setLoadingCustomers(true);
    try {
      // Fetch matching segment customers from database (max 10 for the UI list)
      const res = await customerAPI.getCustomers(0, 10, '', '', '', segName);
      setSegmentCustomers(prev => ({
        ...prev,
        [segName]: res.content
      }));
    } catch (error) {
      toast.error('Failed to load segment customers');
    } finally {
      setLoadingCustomers(false);
    }
  };

  const getSegmentBadgeClass = (segment) => {
    const s = segment?.toLowerCase() || '';
    if (s.includes('high') || s.includes('premium')) return 'bg-purple-100 text-purple-700 border-purple-200';
    if (s.includes('regular') || s.includes('active')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (s.includes('risk') || s.includes('watch')) return 'bg-amber-100 text-amber-700 border-amber-200';
    if (s.includes('new')) return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Segments</h2>
          <p className="text-slate-500 text-sm mt-1">Detailed customer sub-cohort insights generated via K-Means and RFM metrics.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>GET /api/dashboard 200 OK</span>
        </div>
      </div>

      {/* Segments Table */}
      <div className="glass-card rounded-2xl border border-slate-100 shadow-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                <th className="py-4 px-6">Segment</th>
                <th className="py-4 px-6">Customers</th>
                <th className="py-4 px-6">Avg Order Value</th>
                <th className="py-4 px-6">Avg Purchases/yr</th>
                <th className="py-4 px-6">Last Purchase (Avg)</th>
                <th className="py-4 px-6">Campaign Tip</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-semibold text-slate-700">
              {segments.map((seg) => {
                const isExpanded = expandedSegment === seg.segmentName;
                return (
                  <React.Fragment key={seg.id}>
                    {/* Parent segment row */}
                    <tr className="hover:bg-slate-50/30 transition-colors duration-150">
                      <td className="py-4 px-6">
                        <button
                          onClick={() => toggleExpand(seg.segmentName)}
                          className="flex items-center gap-2 text-left"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                          <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-wide uppercase ${getSegmentBadgeClass(seg.segmentName)}`}>
                            {seg.segmentName}
                          </span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-slate-900 font-bold">{seg.size.toLocaleString()}</td>
                      <td className="py-4 px-6 text-slate-900 font-bold">Rs {seg.avgSpend.toLocaleString()}</td>
                      <td className="py-4 px-6 text-slate-500">{seg.purchaseFrequency}</td>
                      <td className="py-4 px-6 text-slate-500">{seg.lastPurchaseAvg}</td>
                      <td className="py-4 px-6 text-slate-400 font-normal">{seg.campaignTip}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            toast.success(`Launching campaign pipeline for ${seg.segmentName}...`);
                            navigate('/campaigns', { state: { targetSegmentId: seg.id } });
                          }}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-all"
                        >
                          Launch campaign
                        </button>
                      </td>
                    </tr>

                    {/* Expandable customers list */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="7" className="bg-slate-50/50 p-6 border-y border-slate-100">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Users className="h-4 w-4 text-indigo-500" />
                                <span>Recent customers in this segment</span>
                              </h4>
                              <span className="text-[10px] text-slate-400 font-bold">Showing up to 10 customers</span>
                            </div>

                            {loadingCustomers ? (
                              <p className="text-xs text-slate-400 font-medium animate-pulse py-2">Loading customer list...</p>
                            ) : !segmentCustomers[seg.segmentName] || segmentCustomers[seg.segmentName].length === 0 ? (
                              <p className="text-xs text-slate-400 font-medium py-2">No customers are currently grouped under this segment. Run the ML pipeline to populate.</p>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {segmentCustomers[seg.segmentName].slice(0, 9).map((cust) => (
                                  <div key={cust.id} className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex flex-col justify-between hover:border-slate-200 transition-all">
                                    <div>
                                      <p className="font-bold text-slate-900 text-sm">{cust.name}</p>
                                      <p className="text-xs text-slate-400 font-normal mt-0.5">{cust.email}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-50 text-xs text-slate-500 font-semibold">
                                      <span>City: <span className="text-slate-800">{cust.city}</span></span>
                                      <span>Spend: <span className="text-slate-850 font-bold text-slate-900">Rs {cust.totalSpend}</span></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
