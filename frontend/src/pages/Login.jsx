import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Mail, Lock, User, ShieldAlert, ArrowRight, ArrowLeft, 
  Sun, Moon, Eye, EyeOff, CheckCircle, Sparkles, Smartphone, 
  Info, LockKeyhole, Unlock, ShieldCheck
} from 'lucide-react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

// --- STUNNING HIGH-FIDELITY SOCIAL BRAND LOGO ICONS ---

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.5-.63.72-1.18 1.86-1.04 2.97 1.1.09 2.2-.55 2.97-1.41z" />
    </svg>
  );
}

// --- STUNNING CUSTOM ILLUSTRATIONS IN SVGS ---

function WelcomeIllustration() {
  return (
    <svg className="w-48 h-48 mx-auto animate-bounce duration-5000 hover:scale-105 transition-transform" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="80" fill="url(#welcome-bg-grad)" fillOpacity="0.15" />
      <path d="M60 140 C60 100, 90 90, 100 90 C110 90, 140 100, 140 140" stroke="url(#welcome-primary)" strokeWidth="8" strokeLinecap="round" />
      <circle cx="100" cy="65" r="20" fill="url(#welcome-secondary)" />
      {/* Analytics nodes */}
      <circle cx="45" cy="100" r="10" fill="#3b82f6" className="animate-pulse" />
      <circle cx="155" cy="100" r="10" fill="#8b5cf6" className="animate-pulse delay-700" />
      <path d="M45 100 Q100 130 155 100" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M100 90 V140" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
      {/* Retail accents */}
      <rect x="85" y="110" width="30" height="20" rx="3" fill="#f59e0b" />
      <defs>
        <linearGradient id="welcome-bg-grad" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="welcome-primary" x1="60" y1="90" x2="140" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4f46e5" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="welcome-secondary" x1="80" y1="45" x2="120" y2="85" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ForgotPasswordIllustration() {
  return (
    <svg className="w-40 h-40 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="70" width="100" height="80" rx="16" fill="url(#lock-body)" fillOpacity="0.15" stroke="url(#lock-body)" strokeWidth="4" />
      <path d="M70 70 V50 C70 33.4 83.4 20 100 20 C116.6 20 130 33.4 130 50 V70" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
      <circle cx="100" cy="110" r="12" fill="#ef4444" />
      <path d="M100 122 V135" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
      {/* Floating question mark */}
      <g className="animate-bounce">
        <path d="M150 45 C150 35, 165 35, 165 45 C165 52, 155 55, 155 62" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
        <circle cx="155" cy="74" r="3" fill="#6366f1" />
      </g>
      <defs>
        <linearGradient id="lock-body" x1="50" y1="70" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function VerificationIllustration() {
  return (
    <svg className="w-40 h-40 mx-auto animate-pulse" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="40" y="60" width="120" height="90" rx="12" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="4" />
      <path d="M40 65 L100 110 L160 65" stroke="#3b82f6" strokeWidth="4" strokeLinejoin="round" />
      {/* Glowing secure badge */}
      <circle cx="100" cy="110" r="22" fill="#10b981" />
      <path d="M92 110 L97 115 L108 104" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Code signals */}
      <path d="M15 100 H30" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
      <path d="M170 100 H185" stroke="#8b5cf6" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function SetPasswordIllustration() {
  return (
    <svg className="w-40 h-40 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="60" y="50" width="80" height="110" rx="16" fill="url(#shield-grad)" stroke="#10b981" strokeWidth="4" />
      <path d="M80 105 L95 120 L120 90" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="30" r="10" fill="#3b82f6" />
      <path d="M90 30 H110" stroke="#3b82f6" strokeWidth="4" />
      <defs>
        <linearGradient id="shield-grad" x1="60" y1="50" x2="140" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PasswordChangedIllustration() {
  return (
    <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="60" fill="#10b981" fillOpacity="0.15" />
      <circle cx="100" cy="100" r="50" fill="url(#green-glow)" className="animate-pulse" />
      <path d="M80 100 L93 113 L122 83" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Decorative Sparkles */}
      <path d="M50 50 L56 56" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <path d="M150 50 L144 56" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <path d="M150 150 L144 144" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 150 L56 144" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <linearGradient id="green-glow" x1="50" y1="50" x2="150" y2="150" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AccountCreatedIllustration() {
  return (
    <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" fill="url(#flower-pot)" fillOpacity="0.1" />
      {/* Sunflower stalk */}
      <path d="M100 160 V90" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
      {/* Leaf */}
      <path d="M100 120 Q125 110 115 130 Z" fill="#10b981" />
      {/* Sunflower face */}
      <circle cx="100" cy="70" r="18" fill="#78350f" />
      {/* Petals */}
      <circle cx="100" cy="46" r="8" fill="#eab308" />
      <circle cx="100" cy="94" r="8" fill="#eab308" />
      <circle cx="76" cy="70" r="8" fill="#eab308" />
      <circle cx="124" cy="70" r="8" fill="#eab308" />
      <circle cx="83" cy="53" r="8" fill="#eab308" />
      <circle cx="117" cy="87" r="8" fill="#eab308" />
      <circle cx="83" cy="87" r="8" fill="#eab308" />
      <circle cx="117" cy="53" r="8" fill="#eab308" />
      {/* Sparkles */}
      <circle cx="150" cy="40" r="4" fill="#6366f1" className="animate-ping" />
      <circle cx="50" cy="130" r="3" fill="#3b82f6" className="animate-ping" />
      <defs>
        <linearGradient id="flower-pot" x1="30" y1="30" x2="170" y2="170" gradientUnits="userSpaceOnUse">
          <stop stopColor="#eab308" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// --- MAIN LOGIN COMPONENT ---

export default function Login() {
  const navigate = useNavigate();

  // Screen state machine: 'WELCOME' | 'CREATE_ACCOUNT' | 'LOGIN' | 'FORGOT_PASSWORD' | 'VERIFICATION' | 'SET_NEW_PASSWORD' | 'PASSWORD_CHANGED' | 'ACCOUNT_CREATED'
  const [screen, setScreen] = useState('WELCOME');
  const [screenStack, setScreenStack] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Form State
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreePolicy, setAgreePolicy] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);

  // OTP Verification Code state
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);

  // Toggle Password Visibilities
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Social Login popup modal state
  const [activeSocialPopup, setActiveSocialPopup] = useState(null); // 'google' | 'facebook' | 'apple'
  const [socialLoading, setSocialLoading] = useState(false);

  // Navigation history management
  const navigateTo = (newScreen) => {
    setScreenStack((prev) => [...prev, screen]);
    setScreen(newScreen);
  };

  const navigateBack = () => {
    if (screenStack.length > 0) {
      const prev = screenStack[screenStack.length - 1];
      setScreenStack((prevStack) => prevStack.slice(0, -1));
      setScreen(prev);
    } else {
      setScreen('WELCOME');
    }
  };

  // Auto redirect if already authenticated
  useEffect(() => {
    const user = authAPI.getUser();
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  // Handle standard registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreePolicy) {
      toast.error('Please agree with the privacy policy to proceed.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await authAPI.register(username, email, password, ['MARKETER']);
      toast.success('Account created successfully!');
      navigateTo('ACCOUNT_CREATED');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle standard login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await authAPI.login(email, password);
      toast.success(`Welcome back, ${user.username}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password submit
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.sendPasswordResetCode(email);
      toast.success(`Verification code sent to ${email}`);
      navigateTo('VERIFICATION');
    } catch (err) {
      toast.error('Failed to send verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit inputs
  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value !== '' && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Confirm OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const codeStr = verificationCode.join('');
    if (codeStr.length < 4) {
      toast.error('Please enter the complete 4-digit code.');
      return;
    }
    setLoading(true);
    try {
      await authAPI.verifyPasswordResetCode(email, codeStr);
      toast.success('Code verified successfully.');
      navigateTo('SET_NEW_PASSWORD');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle setting a new password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(email, password);
      toast.success('Password reset successfully!');
      navigateTo('PASSWORD_CHANGED');
    } catch (err) {
      toast.error('Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  // Guest login trigger
  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const guestUser = await authAPI.loginWithSocial('guest', 'guest@retailiq.com', 'Guest Analyst');
      toast.success('Logged in as Guest. Limited analyst privileges applied.', { icon: '🛡️' });
      navigate('/');
    } catch (err) {
      toast.error('Guest login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Simulated Social Login trigger
  const handleSocialSelect = async (provider, emailAddr, nameStr) => {
    setSocialLoading(true);
    try {
      const user = await authAPI.loginWithSocial(provider, emailAddr, nameStr);
      setActiveSocialPopup(null);
      toast.success(`Connected via ${provider.charAt(0).toUpperCase() + provider.slice(1)}! Welcome, ${user.username}.`);
      navigate('/');
    } catch (err) {
      toast.error('Social authorization failed.');
    } finally {
      setSocialLoading(false);
    }
  };

  // Quick helper to fill credentials in developer mode
  const fillDemoCredentials = () => {
    setEmail('admin@retailiq.com');
    setPassword('admin123');
    toast.success('Demo credentials loaded!');
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Decorative Blur Spheres (Only visible in dark mode for premium sci-fi glow) */}
      {isDarkMode && (
        <>
          <div className="absolute top-1/10 left-1/10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 animate-pulse duration-5000"></div>
          <div className="absolute bottom-1/10 right-1/10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 animate-pulse duration-7000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        </>
      )}

      {/* Main card wrapper simulating standard mobile UI from the blueprint mockup */}
      <div className={`w-full max-w-[400px] rounded-[36px] overflow-hidden border shadow-2xl relative transition-all duration-300 ${
        isDarkMode 
          ? 'bg-slate-900/60 border-slate-800 backdrop-blur-xl shadow-slate-950/50' 
          : 'bg-white border-slate-200 shadow-slate-200/50'
      }`}>
        
        {/* Mobile-style Top Status Bar Accent */}
        <div className={`px-6 pt-3 pb-1 flex justify-between items-center text-xs font-semibold select-none ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5" />
            <div className={`w-4 h-2 rounded-sm border ${isDarkMode ? 'border-slate-400' : 'border-slate-500'} flex items-center p-0.5`}>
              <div className={`w-full h-full rounded-2xs ${isDarkMode ? 'bg-slate-400' : 'bg-slate-500'}`}></div>
            </div>
          </div>
        </div>

        {/* Back and Theme Toggle Header Bar (Hidden only on WELCOME page unless specified) */}
        <div className="px-6 py-2 flex justify-between items-center z-20 relative">
          {screen !== 'WELCOME' ? (
            <button 
              onClick={navigateBack}
              className={`p-2 rounded-full transition-all duration-200 ${
                isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'
              }`}
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : (
            <div className="w-9 h-9"></div> // Spacer to keep title aligned
          )}

          {/* Theme Switcher Toggle button (styled as shown on the right-top in the pi screens) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full transition-all duration-200 ${
              isDarkMode ? 'hover:bg-slate-800 text-yellow-400' : 'hover:bg-slate-100 text-indigo-600'
            }`}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        {/* --- SCREEN 1: WELCOME --- */}
        {screen === 'WELCOME' && (
          <div className="px-8 pb-10 flex flex-col text-center gap-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight font-outfit">Welcome</h1>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Login or signup to continue</p>
            </div>

            <div className="py-4">
              <WelcomeIllustration />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="h-6 w-6 text-blue-500 animate-pulse" />
                <span className="text-2xl font-black tracking-wider text-blue-500 font-outfit">RetailIQ</span>
              </div>
              <p className={`text-xs max-w-xs mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                A Family of Smarter Customer Analytics & ML Segmentation Dashboards for Modern Teams
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <button
                onClick={() => navigateTo('CREATE_ACCOUNT')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-98 glow-btn"
              >
                Create Account
              </button>
              
              <button
                onClick={() => navigateTo('LOGIN')}
                className={`w-full rounded-2xl py-4 font-bold text-sm tracking-wide border-2 transition-all duration-300 transform active:scale-98 ${
                  isDarkMode 
                    ? 'border-slate-700 hover:border-slate-500 text-white' 
                    : 'border-slate-200 hover:border-slate-400 text-slate-800'
                }`}
              >
                Already have an account
              </button>
            </div>

            <button
              onClick={handleGuestLogin}
              disabled={loading}
              className={`text-xs font-semibold underline py-2 self-center hover:opacity-80 transition-opacity ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {loading ? 'Entering Guest Mode...' : 'Continue as a guest?'}
            </button>
          </div>
        )}

        {/* --- SCREEN 2: CREATE ACCOUNT (REGISTER) --- */}
        {screen === 'CREATE_ACCOUNT' && (
          <div className="px-8 pb-10 flex flex-col gap-5 animate-fade-in">
            <div>
              <h1 className="text-2xl font-black font-outfit">Create Account</h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Sign up to continue</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3.5">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={`w-full border rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold outline-none transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-blue-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider">Email Address</label>
                  <button type="button" className="text-[10px] text-blue-500 hover:underline">Mobile Number?</button>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold outline-none transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-blue-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border rounded-xl py-3.5 pl-11 pr-11 text-xs font-semibold outline-none transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-blue-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full border rounded-xl py-3.5 pl-11 pr-11 text-xs font-semibold outline-none transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-blue-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Privacy Checkbox */}
              <div className="flex items-start gap-2 pt-1">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agreePolicy}
                  onChange={(e) => setAgreePolicy(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="agree" className={`text-[11px] font-semibold select-none cursor-pointer leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  I agree with <span className="text-blue-500 hover:underline">privacy policy</span>
                </label>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-3.5 font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-98 disabled:opacity-50 mt-2 glow-btn"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            {/* Social Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>or sign up with</span>
              <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            </div>

            {/* Social Circles Row */}
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setActiveSocialPopup('google')}
                className={`py-3.5 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-white' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <GoogleIcon />
              </button>
              <button
                type="button"
                onClick={() => setActiveSocialPopup('apple')}
                className={`py-3.5 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-white' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <AppleIcon />
              </button>
              <button
                type="button"
                onClick={() => setActiveSocialPopup('facebook')}
                className={`py-3.5 rounded-xl border flex items-center justify-center transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-white' 
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                }`}
              >
                <FacebookIcon />
              </button>
            </div>

            {/* Bottom redirect link */}
            <div className={`text-xs font-semibold text-center mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Already have an account?{' '}
              <button onClick={() => navigateTo('LOGIN')} className="text-blue-500 hover:underline">Login</button>
            </div>
          </div>
        )}

        {/* --- SCREEN 3: LOGIN --- */}
        {screen === 'LOGIN' && (
          <div className="px-8 pb-10 flex flex-col gap-5 animate-fade-in">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black font-outfit">Login Account</h1>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Welcome Back!</p>
              </div>
              
              {/* Quick fill developer demo account helper badge */}
              <button 
                onClick={fillDemoCredentials}
                className="text-[9px] font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-full px-2.5 py-1 transition-all"
                title="Fill demo login credentials instantly"
              >
                Demo Fill
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider">Email Address</label>
                  <button type="button" className="text-[10px] text-blue-500 hover:underline">Mobile Number?</button>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold outline-none transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-blue-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border rounded-xl py-3.5 pl-11 pr-11 text-xs font-semibold outline-none transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-blue-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Keep logged / Forgot pass row */}
              <div className="flex justify-between items-center text-[11px] font-semibold">
                <div className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    id="keepLoggedIn"
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="keepLoggedIn" className={`cursor-pointer ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Keep me logged in</label>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('FORGOT_PASSWORD')}
                  className="text-blue-500 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-3.5 font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-98 disabled:opacity-50 mt-2 glow-btn"
              >
                {loading ? 'Signing In...' : 'Login'}
              </button>
            </form>

            {/* Social Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>or sign in with</span>
              <div className={`flex-1 h-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>
            </div>

            {/* Social Wide Buttons Stacks */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setActiveSocialPopup('google')}
                className={`w-full py-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-xs transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-white' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
                }`}
              >
                <GoogleIcon />
                <span>Continue With Google</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveSocialPopup('apple')}
                className={`w-full py-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-xs transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-white' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
                }`}
              >
                <AppleIcon />
                <span>Continue With Apple</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSocialPopup('facebook')}
                className={`w-full py-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-xs transition-all duration-200 ${
                  isDarkMode 
                    ? 'border-slate-800 bg-slate-900/40 hover:bg-slate-800 text-white' 
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm'
                }`}
              >
                <FacebookIcon />
                <span>Continue With Facebook</span>
              </button>
            </div>

            {/* Bottom redirect link */}
            <div className={`text-xs font-semibold text-center mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Don't have an account?{' '}
              <button onClick={() => navigateTo('CREATE_ACCOUNT')} className="text-blue-500 hover:underline">Sign Up</button>
            </div>
          </div>
        )}

        {/* --- SCREEN 4: FORGOT PASSWORD --- */}
        {screen === 'FORGOT_PASSWORD' && (
          <div className="px-8 pb-10 flex flex-col text-center gap-5 animate-fade-in">
            <div className="text-left space-y-1">
              <h1 className="text-2xl font-black font-outfit">Forgot Password?</h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No worries. We got you.</p>
            </div>

            <div className="py-2">
              <ForgotPasswordIllustration />
            </div>

            <p className={`text-xs font-semibold max-w-xs mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              We'll send you a 4-digit verification code to reset your account password.
            </p>

            <form onSubmit={handleSendCode} className="space-y-4 mt-1 text-left">
              {/* Email Address */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold uppercase tracking-wider">Email Address</label>
                  <button type="button" className="text-[10px] text-blue-500 hover:underline">Mobile Number?</button>
                </div>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full border rounded-xl py-3.5 pl-11 pr-4 text-xs font-semibold outline-none transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-blue-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-3.5 font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-98 disabled:opacity-50 mt-2 glow-btn"
              >
                {loading ? 'Sending code...' : 'Send Code'}
              </button>
            </form>

            {/* Bottom back redirect */}
            <button 
              type="button" 
              onClick={() => navigateTo('LOGIN')} 
              className="text-xs font-bold text-blue-500 hover:underline self-center py-2"
            >
              ← Back to log in?
            </button>
          </div>
        )}

        {/* --- SCREEN 5: VERIFICATION (OTP) --- */}
        {screen === 'VERIFICATION' && (
          <div className="px-8 pb-10 flex flex-col text-center gap-5 animate-fade-in">
            <div className="text-left space-y-1">
              <h1 className="text-2xl font-black font-outfit">Verification</h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Enter the code to continue.</p>
            </div>

            <div className="py-2">
              <VerificationIllustration />
            </div>

            <p className={`text-xs font-semibold max-w-xs mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              We sent a code to <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{email || 'youremail@outlook.com'}</span>
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-5 mt-1">
              {/* 4 Digit Boxes */}
              <div className="flex justify-center gap-3">
                {verificationCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    className={`w-14 h-14 text-center text-xl font-bold border rounded-2xl outline-none transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-blue-500 focus:bg-slate-900 text-white' 
                        : 'bg-slate-100 border-slate-200 focus:border-blue-600 focus:bg-white text-slate-900'
                    }`}
                  />
                ))}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-3.5 font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-98 disabled:opacity-50 mt-2 glow-btn"
              >
                {loading ? 'Verifying...' : 'Continue'}
              </button>
            </form>

            <div className={`text-xs font-semibold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Didn't receive the code?{' '}
              <button onClick={() => toast.success('New reset code resent!')} className="text-blue-500 hover:underline">Send Again</button>
            </div>

            {/* Bottom back redirect */}
            <button 
              type="button" 
              onClick={() => navigateTo('LOGIN')} 
              className="text-xs font-bold text-blue-500 hover:underline self-center py-2"
            >
              ← Back to log in?
            </button>
          </div>
        )}

        {/* --- SCREEN 6: SET NEW PASSWORD --- */}
        {screen === 'SET_NEW_PASSWORD' && (
          <div className="px-8 pb-10 flex flex-col text-center gap-5 animate-fade-in">
            <div className="text-left space-y-1">
              <h1 className="text-2xl font-black font-outfit">Set New Password</h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Create a unique password.</p>
            </div>

            <div className="py-2">
              <SetPasswordIllustration />
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4 text-left mt-1">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full border rounded-xl py-3.5 pl-11 pr-11 text-xs font-semibold outline-none transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-blue-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full border rounded-xl py-3.5 pl-11 pr-11 text-xs font-semibold outline-none transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-800 focus:border-blue-500 text-white' 
                        : 'bg-slate-50 border-slate-200 focus:border-blue-600 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              {/* Reset Password Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-3.5 font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-98 disabled:opacity-50 mt-2 glow-btn"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>

            {/* Bottom skip link */}
            <button
              onClick={() => navigateTo('LOGIN')}
              className={`text-xs font-bold underline py-2 self-center hover:opacity-80 transition-opacity ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Reset password later?
            </button>
          </div>
        )}

        {/* --- SCREEN 7: PASSWORD CHANGED! --- */}
        {screen === 'PASSWORD_CHANGED' && (
          <div className="px-8 pb-10 flex flex-col text-center gap-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl font-black font-outfit">Password Changed!</h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>No hassle anymore.</p>
            </div>

            <div className="py-4">
              <PasswordChangedIllustration />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Successfully!</h2>
              <p className={`text-xs max-w-xs mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Your password has been successfully reset. You can now login with your new credentials.
              </p>
            </div>

            <button
              onClick={() => navigateTo('LOGIN')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-98 mt-2 glow-btn"
            >
              Continue
            </button>
          </div>
        )}

        {/* --- SCREEN 8: ACCOUNT CREATED! --- */}
        {screen === 'ACCOUNT_CREATED' && (
          <div className="px-8 pb-10 flex flex-col text-center gap-6 animate-fade-in">
            <div className="space-y-1">
              <h1 className="text-2xl font-black font-outfit">Account Created!</h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Welcome to RetailIQ.</p>
            </div>

            <div className="py-4">
              <AccountCreatedIllustration />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight text-emerald-500">Successfully!</h2>
              <p className={`text-xs max-w-xs mx-auto leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Your new analyst profile has been registered successfully. Explore smart insights immediately.
              </p>
            </div>

            <button
              onClick={() => navigateTo('LOGIN')}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 font-bold text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-98 mt-2 glow-btn"
            >
              Continue
            </button>
          </div>
        )}

      </div>

      {/* --- PREMIUM BRANDED SOCIAL OAUTH LOGIN POPUP INTERFACES --- */}
      {activeSocialPopup && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          
          {/* Main Social Dialog Box */}
          <div className={`w-full max-w-[360px] rounded-3xl p-6 shadow-2xl relative border ${
            activeSocialPopup === 'google' 
              ? 'bg-white text-slate-800 border-slate-100' 
              : activeSocialPopup === 'facebook' 
              ? 'bg-slate-900 text-white border-blue-900/50' 
              : 'bg-black text-white border-slate-800'
          }`}>
            
            {/* Loading Indicator Overlay */}
            {socialLoading && (
              <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs rounded-3xl flex flex-col justify-center items-center gap-3 z-30">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-white text-xs font-semibold animate-pulse">Connecting account...</span>
              </div>
            )}

            {/* Branded Header */}
            <div className="flex flex-col items-center text-center gap-3 pt-2">
              {activeSocialPopup === 'google' && (
                <>
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shadow-sm">
                    <GoogleIcon />
                  </div>
                  <h3 className="text-lg font-black font-outfit">Sign in with Google</h3>
                  <p className="text-[11px] text-slate-500">to continue to <span className="font-bold text-blue-600">RetailIQ</span></p>
                </>
              )}

              {activeSocialPopup === 'facebook' && (
                <>
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md text-white">
                    <FacebookIcon />
                  </div>
                  <h3 className="text-lg font-black font-outfit text-white">Log in with Facebook</h3>
                  <p className="text-[11px] text-slate-400">RetailIQ is requesting access to your public profile.</p>
                </>
              )}

              {activeSocialPopup === 'apple' && (
                <>
                  <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center shadow-md text-white">
                    <AppleIcon />
                  </div>
                  <h3 className="text-lg font-black font-outfit text-white">Sign in with Apple ID</h3>
                  <p className="text-[11px] text-slate-400">Secure authorization via TouchID / FaceID</p>
                </>
              )}
            </div>

            {/* Profile Accounts List Selection (Highly Premium/Interactive) */}
            <div className="mt-6 space-y-2.5">
              
              {activeSocialPopup === 'google' && (
                <>
                  <button
                    onClick={() => handleSocialSelect('google', 'mahesh.goyal@gmail.com', 'Mahesh Goyal')}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 border border-slate-100 transition-colors text-left"
                  >
                    <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      M
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">Mahesh Goyal</p>
                      <p className="text-[10px] text-slate-500 truncate">mahesh.goyal@gmail.com</p>
                    </div>
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  </button>

                  <button
                    onClick={() => handleSocialSelect('google', 'demo.analyst@gmail.com', 'Demo Analyst')}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-100 border border-slate-100 transition-colors text-left"
                  >
                    <div className="w-9 h-9 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      D
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800">Demo Analyst</p>
                      <p className="text-[10px] text-slate-500 truncate">demo.analyst@gmail.com</p>
                    </div>
                  </button>
                </>
              )}

              {activeSocialPopup === 'facebook' && (
                <>
                  <button
                    onClick={() => handleSocialSelect('facebook', 'mahesh.goyal.fb@facebook.com', 'Mahesh Goyal (FB)')}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-slate-800 hover:bg-slate-700/80 border border-slate-800/80 transition-colors text-left"
                  >
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-sm">
                      MG
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white">Continue as Mahesh</p>
                      <p className="text-[10px] text-slate-400 truncate">mahesh.goyal.fb@facebook.com</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </button>
                </>
              )}

              {activeSocialPopup === 'apple' && (
                <div className="space-y-4">
                  {/* Mock biometric scanning UI */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center animate-pulse text-indigo-400">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white">Touch ID or Enter Password</p>
                      <p className="text-[10px] text-slate-500">Authenticate mahesh.goyal@icloud.com</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSocialSelect('apple', 'mahesh.goyal@icloud.com', 'Mahesh Goyal (Apple)')}
                    className="w-full py-3.5 rounded-xl bg-white text-black hover:bg-slate-100 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="h-4.5 w-4.5" />
                    <span>Authorize with Biometrics</span>
                  </button>
                </div>
              )}

            </div>

            {/* Cancel Button */}
            <button
              onClick={() => setActiveSocialPopup(null)}
              disabled={socialLoading}
              className={`w-full mt-4 py-3 rounded-xl font-bold text-xs text-center border transition-all ${
                activeSocialPopup === 'google'
                  ? 'border-slate-200 hover:bg-slate-50 text-slate-500'
                  : 'border-slate-800 hover:bg-slate-800 text-slate-400'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Mini custom animation classes injected dynamically inside style tag */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
