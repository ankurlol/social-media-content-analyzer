import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Zap,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  DEMO_RECRUITER_USER,
  signInWithCredentials,
  signInWithProvider,
  type UserAccount,
} from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerSuccess = (user: UserAccount) => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#ec4899', '#22d3ee'],
    });
    onSuccess(user);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const user = signInWithCredentials(email, password);
    triggerSuccess(user);
  };

  const handleDemoLogin = () => {
    triggerSuccess(DEMO_RECRUITER_USER);
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    const user = signInWithProvider(provider);
    triggerSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-600 text-white shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {mode === 'signin' ? 'Welcome Back' : 'Create Creator Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'signin'
                  ? 'Access full analytics, history & AI exports'
                  : 'Start optimizing high-engagement social copy'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Recruiter Demo Access Banner */}
        <button
          onClick={handleDemoLogin}
          type="button"
          className="w-full p-3 rounded-2xl bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 hover:from-indigo-500/25 hover:to-pink-500/25 border border-indigo-500/40 flex items-center justify-between text-left transition-all group shadow-lg shadow-indigo-500/5"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                1-Click Recruiter Demo Access
              </span>
              <span className="text-[10px] text-indigo-300">
                Evaluate full features with pre-configured Pro Tier
              </span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Mode Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/[0.06]">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); }}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'signin'
                ? 'bg-white/[0.1] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white/[0.1] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* OAuth Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-xs font-semibold text-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.1s.7 5.4 1.9 7.8l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] text-xs font-semibold text-slate-200 transition-colors"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-white/[0.06]" />
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
            Or with email
          </span>
          <div className="flex-1 h-[1px] bg-white/[0.06]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ankur Sharma"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/[0.08] text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/[0.08] text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-2xl bg-black/40 border border-white/[0.08] text-xs text-white focus:border-indigo-500 focus:outline-none font-mono"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create Free Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local storage encrypted session · 100% Client-Side Privacy</span>
        </div>
      </div>
    </div>
  );
};
