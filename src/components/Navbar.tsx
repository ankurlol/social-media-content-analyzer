import React, { useState } from 'react';
import {
  Zap,
  Key,
  FlaskConical,
  Download,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import type { AnalysisResult } from '../types';
import type { UserAccount } from '../services/authService';
import { generateMarkdownReport, downloadFile } from '../utils/exportUtils';

interface NavbarProps {
  onOpenApiKeyModal: () => void;
  onOpenSampleModal: () => void;
  onOpenAuthModal: () => void;
  hasApiKey: boolean;
  analysisResult: AnalysisResult | null;
  user: UserAccount | null;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApiKeyModal,
  onOpenSampleModal,
  onOpenAuthModal,
  hasApiKey,
  analysisResult,
  user,
  onSignOut,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleExport = () => {
    if (!analysisResult) return;
    const md = generateMarkdownReport(analysisResult);
    downloadFile(md, `socialsense-report-${Date.now()}.md`);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-white tracking-tight">SocialSense</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md border border-indigo-500/40 text-indigo-400 bg-indigo-500/10">
              PRO
            </span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSampleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Samples</span>
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              hasApiKey
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border-white/[0.06]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{hasApiKey ? 'AI Connected' : 'Connect AI'}</span>
          </button>

          <button
            onClick={handleExport}
            disabled={!analysisResult}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* User Account / Sign In Window Trigger */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all"
              >
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-[10px] font-black text-white">
                  {getInitials(user.name)}
                </div>
                <span className="text-xs font-semibold text-slate-200 hidden md:inline truncate max-w-[110px]">
                  {user.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 glass border border-white/[0.1] rounded-2xl p-3 shadow-2xl z-50 space-y-3 animate-fadeIn">
                  <div className="pb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-600 flex items-center justify-center text-xs font-black text-white shadow-md shadow-indigo-500/20">
                        {getInitials(user.name)}
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-xs font-bold text-white block truncate">
                          {user.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-slate-400 text-[11px]">Plan Tier:</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                        {user.plan}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/[0.04]">
                      <span className="text-slate-400 text-[11px]">Role:</span>
                      <span className="text-slate-200 text-[11px] font-medium truncate max-w-[120px]">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onSignOut();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.1] text-white transition-all shadow-sm"
            >
              <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
