import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Briefcase, 
  Send, 
  Cpu, 
  LogOut,
  TrendingUp,
  X
} from 'lucide-react';
import { authAPI } from '../services/api';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const user = authAPI.getUser();

  const handleLogout = () => {
    authAPI.logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customers', label: 'Customers', icon: Users },
    { to: '/segments', label: 'Segments', icon: Layers },
    { to: '/leads', label: 'Leads', icon: Briefcase },
    { to: '/campaigns', label: 'Campaigns', icon: Send },
    { to: '/run-ml', label: 'Run ML', icon: Cpu },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col border-r border-slate-800 shadow-premium
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 text-white p-2 rounded-xl shadow-lg shadow-primary-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">RetailIQ</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Segmentation Suite</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white md:hidden transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* User Card */}
      {user && (
        <div className="p-4 mx-4 my-4 bg-slate-800/40 rounded-2xl border border-slate-800 flex flex-col gap-1">
          <p className="text-xs text-slate-500 font-medium">Logged in as</p>
          <p className="text-sm font-semibold text-white truncate">{user.username}</p>
          <div className="flex gap-1.5 mt-1">
            {user.roles?.map((role) => (
              <span key={role} className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary-900/50 text-primary-300 border border-primary-800/40">
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/15' 
                  : 'hover:bg-slate-800/70 hover:text-white text-slate-400'}
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200"
        >
          <LogOut className="h-5 w-5 text-slate-500" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
