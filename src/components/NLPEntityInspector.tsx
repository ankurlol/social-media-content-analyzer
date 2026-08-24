import React from 'react';
import {
  Tag,
  Cpu,
  Layers,
  AlertCircle,
  CheckCircle2,
  Smile,
  Frown,
  Activity,
  FileCode,
  Zap,
} from 'lucide-react';
import type { EntityTag, POSBreakdown, SyntaxAnalysis, SentimentDetails } from '../types';

interface NLPEntityInspectorProps {
  entities: EntityTag[];
  posBreakdown: POSBreakdown;
  syntax: SyntaxAnalysis;
  sentimentDetails: SentimentDetails;
  rawText: string;
}

const CATEGORY_COLORS: Record<EntityTag['category'], { text: string; bg: string; border: string; label: string }> = {
  person:       { text: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)', label: 'Person' },
  organization: { text: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.3)', label: 'Organization' },
  place:        { text: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)', label: 'Place / Location' },
  date:         { text: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)', label: 'Date / Time' },
  value:        { text: '#f472b6', bg: 'rgba(244,114,182,0.1)', border: 'rgba(244,114,182,0.3)', label: 'Currency / Value' },
  acronym:      { text: '#22d3ee', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.3)', label: 'Acronym' },
};

export const NLPEntityInspector: React.FC<NLPEntityInspectorProps> = ({
  entities,
  posBreakdown,
  syntax,
  sentimentDetails,
  rawText,
}) => {
  const nounPct = Math.round((posBreakdown.nouns / posBreakdown.totalTokens) * 100);
  const verbPct = Math.round((posBreakdown.verbs / posBreakdown.totalTokens) * 100);
  const adjPct = Math.round((posBreakdown.adjectives / posBreakdown.totalTokens) * 100);
  const advPct = Math.round((posBreakdown.adverbs / posBreakdown.totalTokens) * 100);

  const totalSentences = (syntax.activeSentences + syntax.passiveSentences) || 1;
  const activePct = Math.round((syntax.activeSentences / totalSentences) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-200">
              Computational Linguistics & Entity Inspector
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-bold">
              Compromise NLP + AFINN-165
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time entity extraction, POS tagging, voice syntax and lexical valence analysis.
          </p>
        </div>
      </div>

      {/* Grid: 4 Core NLP Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Named Entity Recognition (NER) */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 shadow-lg shadow-black/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Tag className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Named Entity Recognition (NER)</h4>
            </div>
            <span className="text-xs text-slate-400 font-mono font-bold">
              {entities.length} Detected
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Identified people, companies, acronyms and temporal anchors parsed by the open-source rule engine:
          </p>

          {entities.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {entities.map((ent, idx) => {
                const config = CATEGORY_COLORS[ent.category];
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold border transition-transform hover:scale-105"
                    style={{
                      color: config.text,
                      backgroundColor: config.bg,
                      borderColor: config.border,
                    }}
                  >
                    <span>{ent.text}</span>
                    <span
                      className="text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-md font-bold"
                      style={{ backgroundColor: `${config.text}20` }}
                    >
                      {config.label}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-black/30 border border-white/[0.04] text-center text-xs text-slate-500">
              No named entities detected yet. Mention a company, person, date, or acronym in your draft.
            </div>
          )}
        </div>

        {/* 2. Part-of-Speech (POS) Breakdown */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 shadow-lg shadow-black/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Part-of-Speech (POS) Spectrum</h4>
            </div>
            <span className="text-xs text-purple-400 font-mono font-bold">
              {posBreakdown.totalTokens} Tokens
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${nounPct}%` }}
                className="bg-indigo-500 transition-all duration-500"
                title={`Nouns: ${nounPct}%`}
              />
              <div
                style={{ width: `${verbPct}%` }}
                className="bg-pink-500 transition-all duration-500"
                title={`Verbs: ${verbPct}%`}
              />
              <div
                style={{ width: `${adjPct}%` }}
                className="bg-cyan-500 transition-all duration-500"
                title={`Adjectives: ${adjPct}%`}
              />
              <div
                style={{ width: `${advPct}%` }}
                className="bg-amber-500 transition-all duration-500"
                title={`Adverbs: ${advPct}%`}
              />
            </div>
          </div>

          {/* POS Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
            <div className="p-2.5 bg-black/30 rounded-xl border border-white/[0.04] text-center">
              <span className="text-[10px] text-indigo-400 font-bold block">Nouns</span>
              <span className="text-base font-black text-white">{posBreakdown.nouns}</span>
              <span className="text-[9px] text-slate-500 block">({nounPct}%)</span>
            </div>

            <div className="p-2.5 bg-black/30 rounded-xl border border-white/[0.04] text-center">
              <span className="text-[10px] text-pink-400 font-bold block">Verbs</span>
              <span className="text-base font-black text-white">{posBreakdown.verbs}</span>
              <span className="text-[9px] text-slate-500 block">({verbPct}%)</span>
            </div>

            <div className="p-2.5 bg-black/30 rounded-xl border border-white/[0.04] text-center">
              <span className="text-[10px] text-cyan-400 font-bold block">Adjectives</span>
              <span className="text-base font-black text-white">{posBreakdown.adjectives}</span>
              <span className="text-[9px] text-slate-500 block">({adjPct}%)</span>
            </div>

            <div className="p-2.5 bg-black/30 rounded-xl border border-white/[0.04] text-center">
              <span className="text-[10px] text-amber-400 font-bold block">Adverbs</span>
              <span className="text-base font-black text-white">{posBreakdown.adverbs}</span>
              <span className="text-[9px] text-slate-500 block">({advPct}%)</span>
            </div>
          </div>
        </div>

        {/* 3. Voice & Syntax Health */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 shadow-lg shadow-black/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Activity className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">Voice & Syntactic Health</h4>
            </div>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold font-mono border ${
                syntax.passiveSentences === 0
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              {activePct}% Active Voice
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono">
            <div className="p-2.5 bg-black/30 rounded-xl border border-white/[0.04] text-center">
              <span className="text-[10px] text-slate-400 block">Active Voice</span>
              <span className="text-base font-black text-emerald-400">{syntax.activeSentences}</span>
            </div>
            <div className="p-2.5 bg-black/30 rounded-xl border border-white/[0.04] text-center">
              <span className="text-[10px] text-slate-400 block">Passive Voice</span>
              <span className={`text-base font-black ${syntax.passiveSentences > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                {syntax.passiveSentences}
              </span>
            </div>
            <div className="p-2.5 bg-black/30 rounded-xl border border-white/[0.04] text-center">
              <span className="text-[10px] text-slate-400 block">Complexity</span>
              <span className="text-base font-black text-cyan-400">{syntax.clauseComplexity}</span>
            </div>
          </div>

          {syntax.passiveExamples.length > 0 ? (
            <div className="p-3 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Passive sentence detected:</span>
              </div>
              <p className="text-xs text-amber-200/90 font-mono italic">
                "{syntax.passiveExamples[0]}"
              </p>
              <p className="text-[11px] text-slate-400">
                Tip: Switch to active voice (Subject + Action Verb) to increase reader velocity.
              </p>
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Clean active syntax. No passive drag detected.</span>
            </div>
          )}
        </div>

        {/* 4. AFINN-165 Lexical Valence Analysis */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 shadow-lg shadow-black/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                <Smile className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">AFINN-165 Valence Scoring</h4>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold font-mono bg-pink-500/10 text-pink-400 border border-pink-500/30">
              Comparative: {sentimentDetails.comparative > 0 ? `+${sentimentDetails.comparative}` : sentimentDetails.comparative}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Positive triggers */}
            <div className="p-3 bg-emerald-500/[0.04] border border-emerald-500/20 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <Smile className="w-3.5 h-3.5" /> Positive Triggers
                </span>
                <span className="font-mono font-bold text-emerald-400">
                  {sentimentDetails.positiveWords.length}
                </span>
              </div>
              {sentimentDetails.positiveWords.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {sentimentDetails.positiveWords.map((w, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded font-mono">
                      {w}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">None detected</p>
              )}
            </div>

            {/* Negative triggers */}
            <div className="p-3 bg-rose-500/[0.04] border border-rose-500/20 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-400 flex items-center gap-1">
                  <Frown className="w-3.5 h-3.5" /> Negative Triggers
                </span>
                <span className="font-mono font-bold text-rose-400">
                  {sentimentDetails.negativeWords.length}
                </span>
              </div>
              {sentimentDetails.negativeWords.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {sentimentDetails.negativeWords.map((w, i) => (
                    <span key={i} className="text-[11px] px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded font-mono">
                      {w}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">None detected (Clean)</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
