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
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Actionable Improvement Checklist
            </h3>
            <p className="text-xs text-slate-500">
              High-impact changes to increase algorithm ranking and viewer retention.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-700 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200">
          {suggestions.length} Tips
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
                  ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                  : isMed
                  ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      isHigh
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : isMed
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-slate-200 text-slate-700 border-slate-300'
                    }`}
                  >
                    {sug.impact} Impact · {sug.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {sug.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sug.description}
                </p>
              </div>

              {sug.actionableExample && (
                <div className="pt-2 border-t border-slate-200/80 flex flex-col space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" /> Example Fix:
                    </span>
                    <button
                      onClick={() => handleCopy(sug.id, sug.actionableExample!)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === sug.id ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedId === sug.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-mono italic">
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
