import React, { useState } from 'react';
import { Cpu, Sparkles, Terminal, Code } from 'lucide-react';
import { segmentAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function RunMl() {
  const [algorithm, setAlgorithm] = useState('K_MEANS');
  const [k, setK] = useState(5);
  const [features, setFeatures] = useState({
    totalSpent: true,
    frequency: true,
    recency: true,
    age: false,
    cityTier: false,
  });
  const [running, setRunning] = useState(false);

  const user = authAPI.getUser();
  const isGuest = user?.isGuest === true;
  const canRun = !isGuest;

  const handleCheckboxChange = (key) => {
    setFeatures(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const getSelectedFeaturesList = () => {
    return Object.keys(features).filter(k => features[k]);
  };

  const handleRunSegmentation = async () => {
    if (!canRun) {
      toast.error('Guest mode is read-only. Login to run live segmentation.');
      return;
    }
    setRunning(true);
    const loader = toast.loading('Contacting API Gateway and invoking Python Flask service...');
    try {
      const selectedList = getSelectedFeaturesList();
      const res = await segmentAPI.runSegmentation(k, selectedList);
      toast.success(res.message || 'K-Means clustering completed! Customers re-assigned.', { id: loader });
    } catch (error) {
      toast.error('ML Segmentation call failed', { id: loader });
    } finally {
      setRunning(false);
    }
  };

  // Generate dynamic JSON representation matching Mockup 5 exactly
  const getJsonPreview = () => {
    const selectedList = getSelectedFeaturesList();
    return JSON.stringify({
      algorithm: algorithm,
      k: k,
      features: selectedList
    }, null, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Run ML model</h2>
          <p className="text-slate-500 text-sm mt-1">
            {isGuest ? 'Guest mode is read-only. Login to execute live ML segmentation on your own data.' : 'Configure hyper-parameters to execute K-Means clustering dynamically.'}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>GET /api/dashboard 200 OK</span>
        </div>
      </div>

      {/* Main Configurations Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Parameters Box */}
        <div className="glass-card p-6 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-6 text-left">
          {/* Header Section */}
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Run segmentation algorithm</h3>
            <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider mt-1">POST /api/ml/segment</p>
          </div>

          {/* Algorithm selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-primary-500 rounded-xl py-3 px-4 text-slate-800 text-sm outline-none font-semibold transition-all"
            >
              <option value="K_MEANS">K-Means Clustering</option>
              <option value="DBSCAN">DBSCAN Density Clustering</option>
              <option value="AGGLOMERATIVE">Hierarchical Clustering</option>
            </select>
          </div>

          {/* Clusters Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
              <span>Number of clusters (k) — {k}</span>
            </div>
            <input
              type="range"
              min="2"
              max="10"
              value={k}
              onChange={(e) => setK(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none"
            />
          </div>

          {/* Features check boxes */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Features to use</label>
            <div className="flex flex-col gap-2 mt-1">
              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={features.totalSpent}
                  onChange={() => handleCheckboxChange('totalSpent')}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 accent-primary-600"
                />
                <span>Total spent</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={features.frequency}
                  onChange={() => handleCheckboxChange('frequency')}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 accent-primary-600"
                />
                <span>Purchase frequency</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={features.recency}
                  onChange={() => handleCheckboxChange('recency')}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 accent-primary-600"
                />
                <span>Recency</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={features.age}
                  onChange={() => handleCheckboxChange('age')}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 accent-primary-600"
                />
                <span>Age</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={features.cityTier}
                  onChange={() => handleCheckboxChange('cityTier')}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500 accent-primary-600"
                />
                <span>City tier</span>
              </label>
            </div>
          </div>

          {/* Trigger button */}
          <button
            onClick={handleRunSegmentation}
            disabled={running || !canRun}
            className={`glow-btn ${canRun ? 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} rounded-xl py-3 font-bold text-sm tracking-wide shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 transition-all duration-300 mt-2 disabled:opacity-50`}
          >
            <Cpu className="h-5 w-5" />
            <span>{running ? 'Processing Segmentation Job...' : canRun ? 'Run segmentation' : 'Guest Read-Only'}</span>
          </button>
        </div>

        {/* REST API Call Console Code Preview Box */}
        <div className="glass-card bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 text-left shadow-2xl relative">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="h-5 w-5 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Spring Boot service call</span>
            </div>
            <Code className="h-4 w-4 text-slate-500" />
          </div>

          {/* Endpoint Headers Info */}
          <div className="space-y-1 font-mono text-xs text-slate-400">
            <p className="text-emerald-400 font-bold">POST <span className="text-white">/api/ml/segment</span></p>
            <p>Content-Type: <span className="text-amber-400">application/json</span></p>
            <p>Authorization: <span className="text-purple-400">Bearer &lt;jwt&gt;</span></p>
          </div>

          {/* Code Area */}
          <div className="bg-slate-950/80 rounded-2xl border border-slate-850 p-4 overflow-x-auto">
            <pre className="font-mono text-xs text-indigo-300 leading-relaxed">
              {getJsonPreview()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
