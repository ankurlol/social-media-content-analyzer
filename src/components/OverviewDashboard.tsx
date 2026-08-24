import React from 'react';
import { Award, Zap, Volume2, Smile, Clock, BookOpen, TrendingUp } from 'lucide-react';
import type { AnalysisResult } from '../types';

interface OverviewDashboardProps {
  result: AnalysisResult;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ result }) => {
  const { overallScore, scoreBreakdown, tone, sentiment, readability } = result;

  let scoreBadgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let scoreText = 'Viral Potential';

  if (overallScore < 55) {
    scoreBadgeColor = 'text-rose-700 bg-rose-50 border-rose-200';
    scoreText = 'Needs Work';
  } else if (overallScore < 75) {
    scoreBadgeColor = 'text-amber-700 bg-amber-50 border-amber-200';
    scoreText = 'Good Reach';
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Top Banner with Score + Pill Badges */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex flex-col items-center justify-center shadow-md shadow-pink-500/20">
            <span className="text-2xl font-black">{overallScore}</span>
            <span className="text-[9px] font-bold uppercase opacity-80">Score</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">Post Engagement Score</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scoreBadgeColor}`}>
                {scoreText}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluated on hook strength, clarity, CTA impact, and platform algorithms.
            </p>
          </div>
        </div>

        {/* Quick Attribute Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-pink-600" />
            <span>Tone: <strong className="text-slate-900">{tone.primary}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 font-medium">
            <Smile className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sentiment: <strong className="text-slate-900">{sentiment.type}</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Read: <strong className="text-slate-900">~{readability.readingTimeSeconds}s</strong></span>
          </div>
        </div>
      </div>

      {/* Progress Bars Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-500">Hook Punch</span>
            <span className="text-slate-900 font-mono">{scoreBreakdown.hook}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-pink-600 h-1.5 rounded-full" style={{ width: `${scoreBreakdown.hook}%` }} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-500">Readability</span>
            <span className="text-slate-900 font-mono">{scoreBreakdown.clarity}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${scoreBreakdown.clarity}%` }} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-500">CTA Power</span>
            <span className="text-slate-900 font-mono">{scoreBreakdown.cta}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${scoreBreakdown.cta}%` }} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-500">Emotion</span>
            <span className="text-slate-900 font-mono">{scoreBreakdown.emotionalResonance}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${scoreBreakdown.emotionalResonance}%` }} />
          </div>
        </div>

        <div className="space-y-1 col-span-2 sm:col-span-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-500">Layout</span>
            <span className="text-slate-900 font-mono">{scoreBreakdown.formatting}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${scoreBreakdown.formatting}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};
