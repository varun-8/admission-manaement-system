import React, { useState } from 'react';
import { GraduationCap, Lock, Mail, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const passwordInputRef = React.useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(identifier.trim(), password);
      if (!res?.success) {
        setError(res?.message || 'Invalid email or password');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (email, pwd) => {
    setIdentifier(email);
    setPassword(pwd);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-800 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-8 sm:p-10 flex flex-col items-center relative z-10">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5">
          <GraduationCap className="w-9 h-9" />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight text-center">
          EDUMERGE CRM
        </h1>
        <p className="text-xs text-slate-500 mb-6 text-center max-w-xs leading-relaxed">
          Sign in to access the Lead Lifecycle & Counseling Management Portal
        </p>

        {/* Error Notification */}
        {error && (
          <div className="w-full p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold mb-5 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                type="email"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    passwordInputRef.current?.focus();
                  }
                }}
                placeholder="superadmin@gmail.com"
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
              <input
                ref={passwordInputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Demo Quick Fills */}
        <div className="mt-6 w-full pt-4 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
            Quick Fill Demo Credentials
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('superadmin@gmail.com', 'superadmin@123')}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Superadmin
            </button>
          </div>
        </div>

        {/* Security Footer */}
        <div className="mt-6 flex items-center gap-1.5 text-slate-400 text-xs font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Role-Based Access Control • Secured Session</span>
        </div>
      </div>
    </div>
  );
};

