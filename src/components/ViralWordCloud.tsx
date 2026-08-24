import React, { useState } from 'react';
import type { WordCloudWord } from '../types';

interface ViralWordCloudProps {
  words: WordCloudWord[];
}

const CATEGORY_COLORS: Record<WordCloudWord['category'], string> = {
  hook:    '#ec4899',
  topic:   '#6366f1',
  action:  '#22d3ee',
  emotion: '#f59e0b',
  generic: '#475569',
};

const CATEGORY_LABELS: Record<WordCloudWord['category'], string> = {
  hook:    'Hook / Attention',
  topic:   'Core Topic',
  action:  'Action / CTA',
  emotion: 'Emotional',
  generic: 'Supporting',
};

export const ViralWordCloud: React.FC<ViralWordCloudProps> = ({ words }) => {
  const [hovered, setHovered] = useState<WordCloudWord | null>(null);

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
        Start typing to generate your viral word cloud...
      </div>
    );
  }

  // Sort by engagement weight descending and take top 35
  const sorted = [...words].sort((a, b) => b.engagementWeight - a.engagementWeight).slice(0, 35);

  // Calculate font size: min 12px, max 36px based on weight
  const maxWeight = sorted[0]?.engagementWeight ?? 100;
  const minWeight = sorted[sorted.length - 1]?.engagementWeight ?? 1;

  function getFontSize(weight: number): number {
    if (maxWeight === minWeight) return 20;
    const normalized = (weight - minWeight) / (maxWeight - minWeight);
    return Math.round(12 + normalized * 24);
  }

  function getOpacity(weight: number): number {
    if (maxWeight === minWeight) return 0.85;
    const normalized = (weight - minWeight) / (maxWeight - minWeight);
    return 0.4 + normalized * 0.6;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Viral Keyword Cloud</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Larger = higher algorithmic reach potential. Hover a word to see its impact score.
          </p>
        </div>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {Object.entries(CATEGORY_LABELS).filter(([k]) => sorted.some(w => w.category === k)).map(([cat, label]) => (
            <span
              key={cat}
              className="text-[10px] px-2 py-0.5 rounded-full font-bold border"
              style={{
                color: CATEGORY_COLORS[cat as WordCloudWord['category']],
                borderColor: CATEGORY_COLORS[cat as WordCloudWord['category']] + '40',
                backgroundColor: CATEGORY_COLORS[cat as WordCloudWord['category']] + '10',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Word Cloud */}
      <div className="p-5 rounded-2xl bg-[#0d0d14] border border-slate-800 min-h-[140px] flex flex-wrap gap-x-3 gap-y-2 items-center justify-center">
        {sorted.map((word, i) => (
          <span
            key={`${word.word}-${i}`}
            onMouseEnter={() => setHovered(word)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-default transition-all hover:scale-110 select-none font-bold"
            style={{
              fontSize: `${getFontSize(word.engagementWeight)}px`,
              color: CATEGORY_COLORS[word.category],
              opacity: getOpacity(word.engagementWeight),
              textShadow: hovered?.word === word.word
                ? `0 0 12px ${CATEGORY_COLORS[word.category]}`
                : 'none',
              transform: hovered?.word === word.word ? 'scale(1.15)' : 'scale(1)',
              display: 'inline-block',
            }}
          >
            {word.word}
          </span>
        ))}
      </div>

      {/* Hovered word detail */}
      {hovered ? (
        <div
          className="flex items-center justify-between p-3 rounded-xl border text-xs animate-fadeIn"
          style={{
            borderColor: CATEGORY_COLORS[hovered.category] + '40',
            backgroundColor: CATEGORY_COLORS[hovered.category] + '10',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="font-black text-base"
              style={{ color: CATEGORY_COLORS[hovered.category] }}
            >
              "{hovered.word}"
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
              style={{
                color: CATEGORY_COLORS[hovered.category],
                borderColor: CATEGORY_COLORS[hovered.category] + '40',
                backgroundColor: CATEGORY_COLORS[hovered.category] + '15',
              }}
            >
              {CATEGORY_LABELS[hovered.category]}
            </span>
          </div>
          <div className="text-right font-mono">
            <div className="text-slate-300 font-bold">
              {hovered.engagementWeight}% reach potential
            </div>
            <div className="text-slate-600">
              Appears {hovered.frequency}x in draft
            </div>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-slate-700 text-center">
          Hover any word to see its engagement potential score
        </p>
      )}
    </div>
  );
};
