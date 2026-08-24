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
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
                <Anchor className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Hook & Opening Analysis</h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-pink-50 text-pink-700 border border-pink-200">
              Score: {hookAnalysis.score}/100 ({hookAnalysis.type})
            </span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Current Opening Line:
            </span>
            <p className="text-xs text-slate-800 italic font-mono">
              "{hookAnalysis.hookText}"
            </p>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {hookAnalysis.critique}
          </p>
        </div>

        {/* Suggested Alternative Hook */}
        <div className="p-3.5 bg-pink-50/60 border border-pink-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-pink-900 flex items-center gap-1">
              ✨ Suggested Alternative Hook:
            </span>
            <button
              onClick={handleCopyHook}
              className="flex items-center gap-1 text-[11px] font-semibold text-pink-700 hover:text-pink-900 transition-colors"
            >
              {copiedHook ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copiedHook ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-pink-950 font-medium">
            {hookAnalysis.suggestedAlternative}
          </p>
        </div>
      </div>

      {/* 2. Call to Action (CTA) Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Call to Action (CTA) Impact</h3>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                callToAction.detected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              {callToAction.detected ? `Strength: ${callToAction.strength}` : 'Missing CTA'}
            </span>
          </div>

          {callToAction.detected ? (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Detected Action Trigger:
              </span>
              <p className="text-xs font-bold text-purple-700">
                "{callToAction.ctaText}"
              </p>
            </div>
          ) : (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Missing explicit CTA. Readers are 70% less likely to comment without a prompt.</span>
            </div>
          )}

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-700 block">
              High-Engagement CTA Recommendations:
            </span>
            <ul className="space-y-1.5">
              {callToAction.suggestions.map((sug, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="text-purple-600 font-bold">•</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Readability & Scan Velocity */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <FileCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Readability & Scan Velocity</h3>
          </div>
          <span className="text-xs text-teal-700 font-bold px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200">
            {readability.gradeLevel}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block mb-0.5">Flesch Ease</span>
            <span className="text-lg font-black text-slate-900">{readability.fleschScore}</span>
            <span className="text-[10px] text-slate-400 block">/ 100</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block mb-0.5">Avg Words/Sent</span>
            <span className="text-lg font-black text-slate-900">{readability.avgWordsPerSentence}</span>
            <span className="text-[10px] text-slate-400 block">Target: 10-14</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] text-slate-500 block mb-0.5">Reading Time</span>
            <span className="text-lg font-black text-slate-900">~{readability.readingTimeSeconds}s</span>
            <span className="text-[10px] text-slate-400 block">@ 200 WPM</span>
          </div>
        </div>
      </div>

      {/* 4. Hashtags */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
                <Hash className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Dynamic Hashtags</h3>
            </div>
            <button
              onClick={handleCopyHashtags}
              className="flex items-center gap-1 text-xs font-semibold text-pink-600 hover:text-pink-700 transition-colors"
            >
              {copiedTags ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTags ? 'Copied' : 'Copy All'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-600">{hashtags.analysis}</p>

          <div>
            <div className="flex flex-wrap gap-1.5">
              {hashtags.suggested.map((tag) => (
                <button
                  key={tag}
                  onClick={() => navigator.clipboard.writeText(tag)}
                  className="px-2.5 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 text-xs font-mono font-medium transition-colors"
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
