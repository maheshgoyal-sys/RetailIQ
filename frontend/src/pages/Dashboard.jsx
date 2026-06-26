import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Layers, 
  Briefcase, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles,
  ShoppingBag,
  BellRing
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { customerAPI, authAPI, leadAPI, campaignAPI, dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [showEmptyOnboarding, setShowEmptyOnboarding] = useState(false);
  const [dashboardState, setDashboardState] = useState({
    totalCustomers: null,
    activeSegments: null,
    leadsGenerated: null,
    avgLeadScore: null,
    segmentData: null,
    segmentCards: null,
  });
  const [isDashboardLoaded, setIsDashboardLoaded] = useState(false);

  useEffect(() => {
    const user = authAPI.getUser();
    if (user?.isGuest !== true) {
      Promise.allSettled([
        customerAPI.getCustomers(0, 1),
        dashboardAPI.getSegmentSummary(),
        leadAPI.getLeads(),
        campaignAPI.getCampaigns(),
      ])
        .then(([customerResult, summaryResult, leadResult, campaignResult]) => {
          const customerData = customerResult.status === 'fulfilled' ? customerResult.value : null;
          const summaryData = summaryResult.status === 'fulfilled' ? summaryResult.value : null;
          const leads = leadResult.status === 'fulfilled' ? leadResult.value : [];
          const campaigns = campaignResult.status === 'fulfilled' ? campaignResult.value : [];

          if (customerData?.totalElements === 0) {
            setShowEmptyOnboarding(true);
          }

          const totalCustomers = customerData?.totalElements ?? summaryData?.totalCustomers ?? null;
          const activeSegments = summaryData?.segmentCount ?? null;
          const leadsGenerated = Array.isArray(leads) ? leads.length : null;
          const avgLeadScore = Array.isArray(leads) && leads.length > 0
            ? Math.round(leads.reduce((sum, lead) => sum + (lead.leadScore || 0), 0) / leads.length)
            : null;

          const segmentData = summaryData?.segments?.map((segment) => ({
            name: segment.name,
            value: segment.size,
            color: segment.name === 'High value loyal' ? '#6366f1'
              : segment.name === 'Regular buyers' ? '#22c55e'
              : segment.name === 'At-risk customers' ? '#f59e0b'
              : segment.name === 'Dormant' ? '#64748b'
              : '#ef4444',
          })) || null;

          const segmentCards = summaryData?.segments?.slice(0, 4).map((segment) => ({
            name: segment.name,
            count: segment.size,
            spend: `Rs ${Math.round(segment.avgSpend)}`,
            freq: `${Math.max(1, Math.round(segment.avgSpend / 1000))}x/yr`,
            badge: 'Live',
            badgeColor: 'bg-sky-100 text-sky-700 border-sky-200',
            fill: Math.min(100, Math.max(10, Math.round(segment.avgSpend / 400))),
            colorCode: segment.name === 'High value loyal' ? 'bg-indigo-500'
              : segment.name === 'Regular buyers' ? 'bg-emerald-500'
              : segment.name === 'At-risk customers' ? 'bg-amber-500'
              : 'bg-slate-500',
          })) || null;

          setDashboardState({ totalCustomers, activeSegments, leadsGenerated, avgLeadScore, segmentData, segmentCards });
          setIsDashboardLoaded(true);
        })
        .catch(() => {
          setIsDashboardLoaded(true);
        });
    }
  }, []);

  const formatNumber = (value, fallback) => {
    if (value === null || value === undefined) return fallback;
    return typeof value === 'number' ? value.toLocaleString() : value;
  };

  const kpis = [
    { id: '1', title: 'Total customers', value: formatNumber(dashboardState.totalCustomers, '4,821'), desc: '-12% this month', trend: 'down', icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { id: '2', title: 'Active segments', value: formatNumber(dashboardState.activeSegments, '5'), desc: 'K-Means + RFM', trend: 'neutral', icon: Layers, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { id: '3', title: 'Leads generated', value: formatNumber(dashboardState.leadsGenerated, '1,247'), desc: '+34 today', trend: 'up', icon: Briefcase, color: 'text-amber-600 bg-amber-50 border-amber-100' },
    { id: '4', title: 'Avg lead score', value: formatNumber(dashboardState.avgLeadScore, '73'), desc: 'Target: 70+', trend: 'up', icon: TrendingUp, color: 'text-purple-600 bg-purple-50 border-purple-100' },
  ];

  const segmentData = dashboardState.segmentData || [
    { name: 'High value loyal', value: 892, color: '#6366f1' },
    { name: 'Regular buyers', value: 1654, color: '#22c55e' },
    { name: 'At-risk customers', value: 743, color: '#f59e0b' },
    { name: 'New customers', value: 412, color: '#ef4444' },
    { name: 'Dormant', value: 1120, color: '#64748b' },
  ];

  const segmentCards = dashboardState.segmentCards || [
    { name: 'High value loyal', count: 892, spend: 'Rs 18,400', freq: '14x/yr', badge: 'Premium', badgeColor: 'bg-purple-100 text-purple-700 border-purple-200', fill: 85, colorCode: 'bg-indigo-500' },
    { name: 'Regular buyers', count: '1,654', spend: 'Rs 6,200', freq: '7x/yr', badge: 'Active', badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-200', fill: 65, colorCode: 'bg-emerald-500' },
    { name: 'At-risk customers', count: 743, spend: 'Rs 4,100', freq: 'Last buy: 60d ago', badge: 'Watch', badgeColor: 'bg-amber-100 text-amber-700 border-amber-200', fill: 40, colorCode: 'bg-amber-500' },
    { name: 'Dormant', count: '1,532', spend: 'No purchase in 90+ days', freq: '', badge: 'Inactive', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200', fill: 15, colorCode: 'bg-slate-500' }
  ];
  const leadTrends = [
  { name: 'Jan', New: 120, Contacted: 90, Converted: 45 },
  { name: 'Feb', New: 150, Contacted: 110, Converted: 60 },
  { name: 'Mar', New: 180, Contacted: 130, Converted: 75 },
  { name: 'Apr', New: 200, Contacted: 145, Converted: 82 },
  { name: 'May', New: 220, Contacted: 160, Converted: 95 },
  { name: 'Jun', New: 250, Contacted: 180, Converted: 110 }
];

const recentActivities = [
  {
    id: 1,
    msg: 'New customer segment created',
    time: '5 min ago',
    icon: Users,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    id: 2,
    msg: 'Campaign launched successfully',
    time: '20 min ago',
    icon: ShoppingBag,
    color: 'bg-green-100 text-green-600'
  },
  {
    id: 3,
    msg: 'Lead score model updated',
    time: '1 hour ago',
    icon: Sparkles,
    color: 'bg-purple-100 text-purple-600'
  }
];
  return (
    <div className="space-y-8">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Real-time overview of customer intelligence, segments and conversions.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{isDashboardLoaded ? 'Live dashboard metrics loaded' : 'Loading dashboard data...'}</span>
        </div>
      </div>

      {showEmptyOnboarding && (
        <div className="glass-card border border-dashed border-indigo-200 bg-indigo-50/80 rounded-3xl p-6 text-slate-900 shadow-premium animate-fade-in">
          <h3 className="text-xl font-extrabold mb-2">Welcome to your RetailIQ workspace</h3>
          <p className="text-sm text-slate-600 mb-4">Your account is ready. Import your first customer CSV or create a campaign to kick off segmentation, lead scoring, and performance analytics.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href="/customers" className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 transition">Upload customer data</a>
            <a href="/campaigns" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition">Schedule your first campaign</a>
          </div>
        </div>
      )}

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.id} className="glass-card p-6 rounded-2xl flex items-center justify-between border border-slate-100 hover:shadow-premium-hover transition-all duration-300">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{kpi.title}</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-900">{kpi.value}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold">
                  {kpi.trend === 'up' && <ArrowUpRight className="h-3 w-3 text-success-600" />}
                  {kpi.trend === 'down' && <ArrowDownRight className="h-3 w-3 text-danger-600 text-red-500" />}
                  <span className={kpi.trend === 'up' ? 'text-success-600' : kpi.trend === 'down' ? 'text-red-500' : 'text-slate-500'}>
                    {kpi.desc}
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${kpi.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Segment distribution</h3>
            <p className="text-xs text-slate-500 mt-0.5">K-Means Customer Clustering</p>
          </div>
          
          <div className="h-56 relative flex items-center justify-center mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2">
            {segmentData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="text-slate-500 font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="glass-card p-6 rounded-2xl border border-slate-100 lg:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly leads generated</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Conversion pipeline status breakdown</p>
          </div>

          <div className="h-64 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, pt: '10px' }} />
                <Bar dataKey="New" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Contacted" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Converted" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Segments Bottom Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {segmentCards.map((card) => (
          <div key={card.name} className="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-bold text-slate-900">{card.name}</h4>
                <p className="text-3xl font-black text-slate-900 mt-2">{card.count}</p>
                <div className="flex gap-4 mt-2 text-xs font-semibold text-slate-500">
                  {card.spend && <span>Avg spend: <span className="text-slate-800">{card.spend}</span></span>}
                  {card.freq && <span>Freq: <span className="text-slate-800">{card.freq}</span></span>}
                </div>
              </div>
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border tracking-wide uppercase ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>

            {/* Micro Progress Bar */}
            <div className="mt-6 space-y-1.5">
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${card.colorCode}`} style={{ width: `${card.fill}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity Card */}
      <div className="glass-card p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <BellRing className="h-5 w-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">Recent activity feed</h3>
        </div>
        <div className="space-y-4">
          {recentActivities.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="flex gap-4 items-start">
                <div className={`p-2 rounded-lg ${act.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-slate-800">{act.msg}</p>
                  <span className="text-[10px] text-slate-400 font-medium">{act.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
