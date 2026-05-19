import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Mail, Lock, User, ShieldAlert, ArrowRight } from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MARKETER');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await authAPI.register(username, email, password, [role]);
        toast.success('Registration successful! Please login.');
        setIsRegister(false);
      } else {
        const user = await authAPI.login(email, password);
        toast.success(`Welcome back, ${user.username}!`);
        navigate('/');
      }
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Decorative Gradient Background Spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -z-10 animate-pulse duration-4000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl -z-10 animate-pulse duration-6000"></div>

      {/* Main Glass Container */}
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative z-10 flex flex-col gap-6">
        {/* Brand/Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-primary-600 text-white p-3 rounded-2xl shadow-xl shadow-primary-500/20 flex items-center justify-center">
            <TrendingUp className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight mt-2">RetailIQ</h2>
          <p className="text-xs text-slate-400 text-center font-medium">
            {isRegister 
              ? 'Create an analyst or marketing dashboard account' 
              : 'Sign in to access your segmentation suite'}
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="grid grid-cols-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800/80">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`py-2 px-4 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${!isRegister ? 'bg-primary-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`py-2 px-4 rounded-lg text-xs font-semibold tracking-wide uppercase transition-all duration-200 ${isRegister ? 'bg-primary-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Register
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g. JohnDoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-primary-500 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all duration-200"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@retailiq.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-primary-500 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-primary-500 rounded-xl py-3 pl-11 pr-4 text-white text-sm outline-none transition-all duration-200"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Access Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-primary-500 rounded-xl py-3 px-4 text-white text-sm outline-none transition-all duration-200"
              >
                <option value="MARKETER">MARKETER</option>
                <option value="ANALYST">ANALYST</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glow-btn bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white rounded-xl py-3.5 font-bold text-sm tracking-wide shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-all duration-300 mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : isRegister ? 'Register Account' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Demo Helper Alert */}
        {!isRegister && (
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex gap-3 items-start text-left">
            <ShieldAlert className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Developer / Demo Mode</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Use <span className="font-semibold text-white">admin@retailiq.com</span> / <span className="font-semibold text-white">admin123</span> to sign in instantly with fallback mock credentials.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
