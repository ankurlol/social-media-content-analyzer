import React, { useState } from 'react';
import { Check, Copy, Flame, Sparkles } from 'lucide-react';
import type { ImprovementSuggestion } from '../types';

interface ImprovementSuggestionsProps {
  suggestions: ImprovementSuggestion[];
  onApplyExample?: (example: string) => void;
}

export const ImprovementSuggestions: React.FC<ImprovementSuggestionsProps> = ({
  suggestions,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass border border-white/[0.06] rounded-2xl p-6 shadow-xl shadow-black/30 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">
              Actionable Improvement Checklist
            </h3>
            <p className="text-xs text-slate-400">
              High-impact changes to increase algorithm ranking and viewer retention.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-400 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          {suggestions.length} Action Items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((sug) => {
          const isHigh = sug.impact === 'High';
          const isMed = sug.impact === 'Medium';

          return (
            <div
              key={sug.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                isHigh
                  ? 'bg-rose-500/[0.04] border-rose-500/20 hover:border-rose-500/40'
                  : isMed
                  ? 'bg-amber-500/[0.04] border-amber-500/20 hover:border-amber-500/40'
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      isHigh
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : isMed
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-white/[0.05] text-slate-400 border-white/[0.08]'
                    }`}
                  >
                    {sug.impact} Impact · {sug.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-200 mb-1">
                  {sug.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {sug.description}
                </p>
              </div>

              {sug.actionableExample && (
                <div className="pt-2.5 border-t border-white/[0.06] flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-400" /> Example Fix:
                    </span>
                    <button
                      onClick={() => handleCopy(sug.id, sug.actionableExample!)}
                      className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {copiedId === sug.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === sug.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-300 font-mono italic">
                    "{sug.actionableExample}"
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
