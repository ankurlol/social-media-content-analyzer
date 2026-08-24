import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Wand2, RefreshCw, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ContentVariant } from '../types';

interface VariantGeneratorProps {
  variants: ContentVariant[];
  onSelectVariant: (content: string) => void;
  onGenerateWithAI: () => void;
  isGeneratingAI: boolean;
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
}

export const VariantGenerator: React.FC<VariantGeneratorProps> = ({
  variants,
  onSelectVariant,
  onGenerateWithAI,
  isGeneratingAI,
  hasApiKey,
  onOpenApiKeyModal,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#6366f1', '#ec4899', '#22d3ee'],
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="glass border border-white/[0.06] rounded-2xl p-6 shadow-xl shadow-black/30 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-200">
              A/B Rewrite Variants & Formulas
            </h3>
            <p className="text-xs text-slate-400">
              4 distinct optimization formulas generated specifically for your topic.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasApiKey ? (
            <button
              onClick={onGenerateWithAI}
              disabled={isGeneratingAI}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-40"
            >
              {isGeneratingAI ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>{isGeneratingAI ? 'Generating...' : 'AI Re-Generate'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.06] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Connect AI for Custom Rewrites</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-white/[0.12] transition-all shadow-lg shadow-black/20 group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <h4 className="text-sm font-bold text-slate-200">{variant.title}</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  {variant.estimatedEngagementBoost}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">{variant.description}</p>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                {variant.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] gap-2">
              <button
                onClick={() => onSelectVariant(variant.content)}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
              >
                <span>Load in Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleCopy(variant.id, variant.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.08] text-xs font-bold text-slate-200 transition-all active:scale-95"
              >
                {copiedId === variant.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
