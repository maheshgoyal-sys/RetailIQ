import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Menu, TrendingUp } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Segments from './pages/Segments';
import Leads from './pages/Leads';
import Campaigns from './pages/Campaigns';
import RunMl from './pages/RunMl';
import { authAPI } from './services/api';

// Route Guard to verify JWT authentication
function PrivateRoute({ children }) {
  const user = authAPI.getUser();
  const [isOpen, setIsOpen] = useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth >= 768 : false;
  });

  return user ? (
    <div className="flex bg-slate-50 min-h-screen relative overflow-hidden">
      {/* Sidebar overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />
      
      <div className={`flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ${isOpen ? 'md:pl-64' : 'md:pl-0'}`}>
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors mr-1 cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className={`flex items-center gap-3 ${isOpen ? 'md:hidden' : ''}`}>
              <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="font-bold text-slate-800 text-lg">RetailIQ</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen">
          {children}
        </main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast Alert Config */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#0f172a', /* Slate 900 */
            color: '#fff',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '600',
            border: '1px solid rgba(255,255,255,0.08)',
            padding: '12px 18px',
          },
          success: {
            iconTheme: {
              primary: '#22c55e', /* Success Emerald */
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
        <Route path="/segments" element={<PrivateRoute><Segments /></PrivateRoute>} />
        <Route path="/leads" element={<PrivateRoute><Leads /></PrivateRoute>} />
        <Route path="/campaigns" element={<PrivateRoute><Campaigns /></PrivateRoute>} />
        <Route path="/run-ml" element={<PrivateRoute><RunMl /></PrivateRoute>} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
