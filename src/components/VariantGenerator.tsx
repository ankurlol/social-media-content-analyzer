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
      colors: ['#db2777', '#be123c', '#9333ea'],
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
            <Wand2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              A/B Rewrite Variants & Content Formulas
            </h3>
            <p className="text-xs text-slate-500">
              4 distinct optimization formulas generated specifically for your topic.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasApiKey ? (
            <button
              onClick={onGenerateWithAI}
              disabled={isGeneratingAI}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all disabled:opacity-50"
            >
              {isGeneratingAI ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              )}
              <span>{isGeneratingAI ? 'Generating...' : 'AI Re-Generate'}</span>
            </button>
          ) : (
            <button
              onClick={onOpenApiKeyModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Connect AI for Custom Rewrites</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all shadow-sm group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-pink-600" />
                  <h4 className="text-sm font-bold text-slate-900">{variant.title}</h4>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {variant.estimatedEngagementBoost}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-3">{variant.description}</p>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto">
                {variant.content}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 gap-2">
              <button
                onClick={() => onSelectVariant(variant.content)}
                className="flex items-center gap-1 text-xs text-pink-600 hover:text-pink-800 font-semibold transition-colors"
              >
                <span>Load in Editor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleCopy(variant.id, variant.content)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all active:scale-95 shadow-sm"
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
