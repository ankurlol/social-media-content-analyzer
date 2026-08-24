import React, { useState } from 'react';
import {
  Anchor,
  Copy,
  Check,
  Hash,
  MousePointerClick,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import type { AnalysisResult } from '../types';

interface DeepDiveMetricsProps {
  result: AnalysisResult;
}

export const DeepDiveMetrics: React.FC<DeepDiveMetricsProps> = ({ result }) => {
  const { hookAnalysis, readability, callToAction, hashtags } = result;
  const [copiedHook, setCopiedHook] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  const handleCopyHook = () => {
    navigator.clipboard.writeText(hookAnalysis.suggestedAlternative);
    setCopiedHook(true);
    setTimeout(() => setCopiedHook(false), 2000);
  };

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(hashtags.suggested.join(' '));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* 1. Hook Analysis Card */}
      <div className="glass border border-white/[0.06] rounded-2xl p-5 shadow-xl shadow-black/30 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Anchor className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Hook & Opening Velocity</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-pink-500/10 text-pink-400 border border-pink-500/30 font-mono">
              {hookAnalysis.score}/100 ({hookAnalysis.type})
            </span>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Current Opening Line:
            </span>
            <p className="text-xs text-slate-300 italic font-mono">
              "{hookAnalysis.hookText}"
            </p>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {hookAnalysis.critique}
          </p>
        </div>

        {/* Suggested Alternative Hook */}
        <div className="p-3.5 bg-pink-500/[0.06] border border-pink-500/20 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-pink-300 flex items-center gap-1">
              Suggested Alternative Hook:
            </span>
            <button
              onClick={handleCopyHook}
              className="flex items-center gap-1 text-[11px] font-semibold text-pink-400 hover:text-pink-300 transition-colors"
            >
              {copiedHook ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedHook ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-pink-200 font-medium">
            {hookAnalysis.suggestedAlternative}
          </p>
        </div>
      </div>

      {/* 2. Call to Action (CTA) Card */}
      <div className="glass border border-white/[0.06] rounded-2xl p-5 shadow-xl shadow-black/30 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Call to Action (CTA) Impact</h3>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                callToAction.detected
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}
            >
              {callToAction.detected ? `Strength: ${callToAction.strength}` : 'Missing CTA'}
            </span>
          </div>

          {callToAction.detected ? (
            <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Detected Action Trigger:
              </span>
              <p className="text-xs font-bold text-purple-300">
                "{callToAction.ctaText}"
              </p>
            </div>
          ) : (
            <div className="p-3 bg-rose-500/[0.08] border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Missing explicit CTA. Readers are 70% less likely to comment without a prompt.</span>
            </div>
          )}

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-300 block">
              High-Engagement CTA Recommendations:
            </span>
            <ul className="space-y-1.5">
              {callToAction.suggestions.map((sug, idx) => (
                <li key={idx} className="text-xs text-slate-400 flex items-start gap-2">
                  <span className="text-purple-400 font-bold">•</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Readability & Scan Velocity */}
      <div className="glass border border-white/[0.06] rounded-2xl p-5 shadow-xl shadow-black/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">Readability & Scan Velocity</h3>
          </div>
          <span className="text-xs text-cyan-400 font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            {readability.gradeLevel}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">Flesch Ease</span>
            <span className="text-lg font-black text-white font-mono">{readability.fleschScore}</span>
            <span className="text-[10px] text-slate-500 block">/ 100</span>
          </div>

          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">Avg Words/Sent</span>
            <span className="text-lg font-black text-white font-mono">{readability.avgWordsPerSentence}</span>
            <span className="text-[10px] text-slate-500 block">Target: 10-14</span>
          </div>

          <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-400 block mb-0.5">Reading Time</span>
            <span className="text-lg font-black text-white font-mono">~{readability.readingTimeSeconds}s</span>
            <span className="text-[10px] text-slate-500 block">@ 200 WPM</span>
          </div>
        </div>
      </div>

      {/* 4. Hashtags */}
      <div className="glass border border-white/[0.06] rounded-2xl p-5 shadow-xl shadow-black/30 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Hash className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-200">Algorithmic Hashtags</h3>
            </div>
            <button
              onClick={handleCopyHashtags}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {copiedTags ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTags ? 'Copied' : 'Copy All'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">{hashtags.analysis}</p>

          <div>
            <div className="flex flex-wrap gap-1.5">
              {hashtags.suggested.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigator.clipboard.writeText(tag)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-medium transition-colors"
                  title="Click to copy"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
