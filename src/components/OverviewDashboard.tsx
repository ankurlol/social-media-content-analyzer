import React, { useEffect, useRef } from 'react';
import { Award, Zap, Volume2, Smile, Clock, Sparkles, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { AnalysisResult } from '../types';

interface OverviewDashboardProps {
  result: AnalysisResult;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ result }) => {
  const { overallScore, scoreBreakdown, tone, sentiment, readability } = result;
  const prevScoreRef = useRef<number>(overallScore);

  useEffect(() => {
    if (overallScore >= 85 && prevScoreRef.current < 85) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#ec4899', '#22d3ee', '#a855f7'],
      });
    }
    prevScoreRef.current = overallScore;
  }, [overallScore]);

  // Tier calculation
  let tier = { label: 'Rookie Draft', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  if (overallScore >= 85) {
    tier = { label: 'Viral Tier (Elite)', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' };
  } else if (overallScore >= 70) {
    tier = { label: 'High Performer', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
  } else if (overallScore >= 50) {
    tier = { label: 'Rising Reach', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
  }

  // SVG Circular progress params
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 border border-white/[0.06] space-y-5 relative overflow-hidden shadow-xl shadow-black/40">
      {/* Background glow orb */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner with Score Ring + Metadata Badges */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06] relative z-10">
        <div className="flex items-center gap-4">
          {/* Animated Circular Score Ring */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="#1e1e2e"
                strokeWidth="4.5"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                stroke="url(#scoreGradient)"
                strokeWidth="4.5"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-lg font-black text-white leading-none font-mono tracking-tight">
                {overallScore}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                PTS
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-1.5">
                Engagement Power
                {overallScore >= 85 && <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />}
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.color}`}>
                {tier.label}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live algorithmic rating synthesized across hook velocity, tone clarity & platform signals.
            </p>
          </div>
        </div>

        {/* Quick Attribute Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tone: <strong className="text-white">{tone.primary}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 font-medium">
            <Smile className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sentiment: <strong className="text-white">{sentiment.type}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-300 font-medium">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Read: <strong className="text-white">~{readability.readingTimeSeconds}s</strong></span>
          </div>
        </div>
      </div>

      {/* Progress Bars Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1 relative z-10">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-400">Hook Punch</span>
            <span className="text-indigo-400 font-mono font-bold">{scoreBreakdown.hook}%</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-1.5 rounded-full transition-all duration-500 shadow-sm shadow-indigo-500/50"
              style={{ width: `${scoreBreakdown.hook}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-400">Readability</span>
            <span className="text-pink-400 font-mono font-bold">{scoreBreakdown.clarity}%</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-400 h-1.5 rounded-full transition-all duration-500 shadow-sm shadow-pink-500/50"
              style={{ width: `${scoreBreakdown.clarity}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-400">CTA Power</span>
            <span className="text-cyan-400 font-mono font-bold">{scoreBreakdown.cta}%</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-400 h-1.5 rounded-full transition-all duration-500 shadow-sm shadow-cyan-500/50"
              style={{ width: `${scoreBreakdown.cta}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-400">Emotion</span>
            <span className="text-amber-400 font-mono font-bold">{scoreBreakdown.emotionalResonance}%</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-1.5 rounded-full transition-all duration-500 shadow-sm shadow-amber-500/50"
              style={{ width: `${scoreBreakdown.emotionalResonance}%` }}
            />
          </div>
        </div>

        <div className="space-y-1.5 col-span-2 sm:col-span-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-400">Layout</span>
            <span className="text-emerald-400 font-mono font-bold">{scoreBreakdown.formatting}%</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full transition-all duration-500 shadow-sm shadow-emerald-500/50"
              style={{ width: `${scoreBreakdown.formatting}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
