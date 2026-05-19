import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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
  return user ? (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {children}
      </main>
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
