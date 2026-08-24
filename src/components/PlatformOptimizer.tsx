import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
} from 'lucide-react';
import type { PlatformScore, SupportedPlatform } from '../types';

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 0 0 1.65-1.64 1.65 1.65 0 0 0-3.3 0 1.64 1.64 0 0 0 1.65 1.64m1.39 9.74v-8.37H5.07v8.37h2.78z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

interface PlatformOptimizerProps {
  platformScores: Record<SupportedPlatform, PlatformScore>;
  postText: string;
}

const PLATFORM_CONFIG: Record<
  SupportedPlatform,
  { name: string; icon: React.ElementType; color: string; bgActive: string; borderActive: string }
> = {
  linkedin: {
    name: 'LinkedIn',
    icon: LinkedInIcon,
    color: 'text-indigo-400',
    bgActive: 'bg-indigo-500/15',
    borderActive: 'border-indigo-500/40 text-indigo-300',
  },
  twitter: {
    name: 'Twitter / X',
    icon: TwitterIcon,
    color: 'text-cyan-400',
    bgActive: 'bg-cyan-500/15',
    borderActive: 'border-cyan-500/40 text-cyan-300',
  },
  instagram: {
    name: 'Instagram',
    icon: InstagramIcon,
    color: 'text-pink-400',
    bgActive: 'bg-pink-500/15',
    borderActive: 'border-pink-500/40 text-pink-300',
  },
  facebook: {
    name: 'Facebook',
    icon: FacebookIcon,
    color: 'text-blue-400',
    bgActive: 'bg-blue-500/15',
    borderActive: 'border-blue-500/40 text-blue-300',
  },
};

export const PlatformOptimizer: React.FC<PlatformOptimizerProps> = ({
  platformScores,
  postText,
}) => {
  const [activePlatform, setActivePlatform] = useState<SupportedPlatform>('linkedin');
  const currentData = platformScores[activePlatform];
  const currentConfig = PLATFORM_CONFIG[activePlatform];

  const charPercent = Math.min(
    100,
    Math.round((currentData.characterCount / currentData.characterLimit) * 100)
  );

  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-6 shadow-xl shadow-black/30 space-y-6">
      {/* Selector Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <h3 className="text-base font-bold text-slate-200">
            Platform Distribution & Feed Simulator
          </h3>
          <p className="text-xs text-slate-400">
            Verify layout compliance against platform-specific algorithm limits.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/[0.06]">
          {(Object.keys(PLATFORM_CONFIG) as SupportedPlatform[]).map((p) => {
            const cfg = PLATFORM_CONFIG[p];
            const Icon = cfg.icon;
            const isSelected = activePlatform === p;
            const score = platformScores[p]?.score || 0;

            return (
              <button
                key={p}
                onClick={() => setActivePlatform(p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? `${cfg.bgActive} ${cfg.borderActive} border shadow-sm`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                <span className="hidden sm:inline">{cfg.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-white/10 font-bold' : 'bg-white/[0.04] text-slate-400'}`}>
                  {score}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mockup Preview */}
        <div className="lg:col-span-6 bg-black/30 border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between shadow-inner">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center font-bold text-sm text-white shadow-sm shadow-indigo-500/30">
                  YOU
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200">Your Channel Profile</span>
                    <span className="text-[11px] text-slate-400">· 1st</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Product Leader & Creator · Just now
                  </span>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </div>

            <div className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-wrap max-h-[260px] overflow-y-auto pr-1">
              {postText || 'Your post preview will appear here...'}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-white/[0.06] flex items-center justify-around text-slate-400 text-xs">
            <button className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
              <Heart className="w-4 h-4" /> <span>Like</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors">
              <MessageCircle className="w-4 h-4" /> <span>Comment</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              <Repeat2 className="w-4 h-4" /> <span>Repost</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
              <Send className="w-4 h-4" /> <span>Send</span>
            </button>
          </div>
        </div>

        {/* Details Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Channel Score</span>
              <span className="text-2xl font-black text-white font-mono">
                {currentData.score} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block">Character Load</span>
              <span
                className={`text-xs font-mono font-bold ${
                  currentData.status === 'too-long'
                    ? 'text-rose-400'
                    : 'text-slate-200'
                }`}
              >
                {currentData.characterCount} / {currentData.characterLimit}
              </span>
            </div>
          </div>

          <div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentData.status === 'too-long' ? 'bg-rose-500' : 'bg-gradient-to-r from-indigo-500 to-pink-500'
                }`}
                style={{ width: `${charPercent}%` }}
              />
            </div>
            {currentData.status === 'too-long' && (
              <p className="text-[11px] text-rose-400 font-medium mt-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Exceeds character limit for standard post.
              </p>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-slate-400">Optimal Hashtag Density:</span>
            <span className="font-bold text-indigo-400 font-mono">
              {currentData.hashtagRecommendation.suggestedCount} (Current: {currentData.hashtagRecommendation.currentCount})
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Algorithm Insights</span>
            </div>

            <ul className="space-y-2">
              {currentData.specificTips.map((tip, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 bg-white/[0.02] border border-white/[0.06] rounded-xl p-2.5 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
