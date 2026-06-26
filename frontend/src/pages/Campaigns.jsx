import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Plus, 
  Layers, 
  BarChart, 
  Percent, 
  Mail, 
  MessageSquare, 
  Bell, 
  Calendar, 
  X, 
  CheckCircle,
  Play
} from 'lucide-react';
import { campaignAPI, segmentAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [segments, setSegments] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = authAPI.getUser();
  const isGuest = user?.isGuest === true;
  const canEdit = !isGuest;

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSegment, setFormSegment] = useState('');
  const [formChannel, setFormChannel] = useState('EMAIL');
  const [formMessage, setFormMessage] = useState('');
  const [formSchedule, setFormSchedule] = useState('');

  const fetchCampaigns = async () => {
    try {
      const data = await campaignAPI.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      toast.error('Failed to load campaigns');
    }
  };

  const fetchSegments = async () => {
    try {
      const data = await segmentAPI.getSegments();
      setSegments(data);
      if (data.length > 0) setFormSegment(data[0].id);
    } catch (error) {
      toast.error('Failed to load segments');
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchSegments();
  }, []);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    if (!canEdit) {
      toast.error('Guest mode is read-only. Login to schedule campaigns.');
      return;
    }
    const segmentName = segments.find(s => s.id === formSegment)?.segmentName || 'Target Segment';
    const payload = {
      name: formName,
      targetSegmentId: formSegment,
      targetSegmentName: segmentName,
      channel: formChannel,
      message: formMessage,
      scheduledAt: formSchedule || new Date().toISOString().split('T')[0]
    };

    try {
      await campaignAPI.createCampaign(payload);
      toast.success('Campaign scheduled successfully!');
      setModalOpen(false);
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to schedule campaign');
    }
  };

  const handleSendCampaign = async (id, name) => {
    if (!canEdit) {
      toast.error('Guest mode is read-only. Login to send campaigns.');
      return;
    }
    const loader = toast.loading(`Dispatching queue for ${name}...`);
    try {
      await campaignAPI.sendCampaign(id);
      toast.success('Campaign dispatched successfully! Processing open rates.', { id: loader });
      fetchCampaigns();
    } catch (error) {
      toast.error('Failed to execute campaign send', { id: loader });
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case 'EMAIL': return Mail;
      case 'SMS': return MessageSquare;
      case 'PUSH': return Bell;
      default: return Send;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'SENT': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'SCHEDULED': return 'bg-sky-100 text-sky-700 border-sky-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Campaigns</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isGuest ? 'Guest mode is read-only. View seeded campaign examples and login to schedule or send live campaigns.' : 'Design, execute, and monitor conversions of targeted retail campaigns.'}
          </p>
        </div>
        <button
          onClick={() => canEdit ? setModalOpen(true) : toast.error('Guest mode is read-only. Login to create campaigns.')}
          disabled={!canEdit}
          className={`glow-btn flex items-center gap-2 ${canEdit ? 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} px-4 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 transition-all duration-300 self-start sm:self-auto`}
        >
          <Plus className="h-4 w-4" />
          <span>New Campaign</span>
        </button>
      </div>

      {/* Campaigns Listing */}
      <div className="grid grid-cols-1 gap-6">
        {campaigns.map((camp) => {
          const Icon = getChannelIcon(camp.channel);
          return (
            <div key={camp.id} className="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col md:flex-row justify-between gap-6 hover:shadow-premium-hover transition-all duration-300">
              
              {/* Campaign details */}
              <div className="flex-1 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{camp.name}</h3>
                    <div className="flex gap-3 mt-1 flex-wrap text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-slate-400" />
                        <span>Cohort: <span className="text-slate-800 uppercase text-[10px] bg-slate-100 px-2 py-0.5 rounded-md">{camp.targetSegmentName}</span></span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>Date: <span className="text-slate-800">{camp.scheduledAt}</span></span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm font-medium text-slate-650 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100/50 leading-relaxed italic">
                  "{camp.message}"
                </p>
              </div>

              {/* Campaign Stats / Action */}
              <div className="flex items-center md:items-end justify-between md:flex-col gap-4 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                
                <span className={`text-[10px] font-black px-3 py-1 rounded-full border tracking-wide uppercase self-start md:self-auto ${getStatusClass(camp.status)}`}>
                  {camp.status}
                </span>

                {camp.status === 'SENT' ? (
                  <div className="flex gap-6 w-full justify-between md:justify-end text-xs font-bold text-slate-700">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                        <Send className="h-3 w-3" /> Sent Size
                      </span>
                      <span className="text-lg font-black text-slate-900 mt-1 block">{camp.sentCount.toLocaleString()}</span>
                    </div>
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
                        <Percent className="h-3 w-3" /> Open Rate
                      </span>
                      <span className="text-lg font-black text-emerald-600 mt-1 block">{camp.openRate}%</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSendCampaign(camp.id, camp.name)}
                    disabled={!canEdit}
                    className={`glow-btn w-full flex items-center justify-center gap-2 ${canEdit ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} rounded-xl py-2 px-4 text-xs font-bold shadow-md shadow-indigo-500/10 transition-all duration-200`}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>{canEdit ? 'Launch Send Queue' : 'Guest Read-Only'}</span>
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Creation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white border border-slate-100 w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-scale-in text-left flex flex-col gap-5 my-8">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-xl font-extrabold text-slate-900">Create Targeted Campaign</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Diwali Premium Offer"
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Target Cohort</label>
                  <select
                    value={formSegment}
                    onChange={(e) => setFormSegment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2.5 px-3 text-slate-800 text-sm outline-none transition-all font-semibold"
                  >
                    {segments.map((s) => (
                      <option key={s.id} value={s.id}>{s.segmentName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Channel</label>
                  <select
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2.5 px-3 text-slate-800 text-sm outline-none transition-all font-semibold"
                  >
                    <option value="EMAIL">EMAIL</option>
                    <option value="SMS">SMS</option>
                    <option value="PUSH">PUSH</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Message Draft</label>
                <textarea
                  required
                  rows="3"
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  placeholder="Draft your message. Use {name} template variable for personalized customer names."
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Schedule Dispatch Date</label>
                <input
                  type="date"
                  required
                  value={formSchedule}
                  onChange={(e) => setFormSchedule(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200/80 focus:border-primary-500 rounded-xl py-2 px-3 text-slate-800 text-sm outline-none transition-all font-semibold"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="glow-btn px-6 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 transition-all duration-200"
                >
                  Schedule Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
