import React from 'react';
import type { EmotionWord, EmotionCategory } from '../types';

const EMOTION_COLORS: Record<EmotionCategory, { bg: string; text: string; label: string }> = {
  neutral:      { bg: 'rgba(148,163,184,0.0)',  text: '#94a3b8', label: 'Neutral' },
  analytical:   { bg: 'rgba(99,102,241,0.25)',  text: '#a5b4fc', label: 'Analytical' },
  curious:      { bg: 'rgba(234,179,8,0.25)',   text: '#fde047', label: 'Curious' },
  excited:      { bg: 'rgba(249,115,22,0.3)',   text: '#fb923c', label: 'Excited' },
  authoritative:{ bg: 'rgba(168,85,247,0.3)',   text: '#d8b4fe', label: 'Authoritative' },
  positive:     { bg: 'rgba(34,197,94,0.25)',   text: '#86efac', label: 'Positive' },
  negative:     { bg: 'rgba(239,68,68,0.25)',   text: '#fca5a5', label: 'Negative' },
  urgent:       { bg: 'rgba(236,72,153,0.3)',   text: '#f9a8d4', label: 'Urgent' },
};

// Lexicons for emotion detection
const EMOTION_LEXICON: Record<EmotionCategory, string[]> = {
  neutral: [],
  analytical: [
    'framework', 'strategy', 'data', 'metric', 'measure', 'analysis', 'research',
    'study', 'insight', 'system', 'process', 'model', 'structure', 'logic', 'evidence',
    'statistics', 'proven', 'methodology', 'benchmark', 'evaluate', 'optimize',
  ],
  curious: [
    'why', 'how', 'what', 'wonder', 'curious', 'discover', 'explore', 'question',
    'think', 'imagine', 'ever', 'perhaps', 'might', 'could', 'idea', 'guess',
  ],
  excited: [
    'amazing', 'incredible', 'wow', 'launch', 'excited', 'thrilled', 'love', 'fantastic',
    'awesome', 'brilliant', 'game-changer', 'revolutionary', 'breakthrough', 'finally',
    'announcing', 'celebrate', 'proud',
  ],
  authoritative: [
    'proven', 'expert', 'mastery', 'years', 'experience', 'leadership', 'built',
    'founded', 'led', 'created', 'established', 'managed', 'delivered', 'scaled',
    'achieved', 'awarded', 'certified',
  ],
  positive: [
    'great', 'good', 'success', 'win', 'growth', 'benefit', 'solution', 'opportunity',
    'improve', 'better', 'best', 'excellent', 'effective', 'valuable', 'perfect',
    'happy', 'grateful', 'thankful', 'trust', 'safe',
  ],
  negative: [
    'fail', 'mistake', 'problem', 'struggle', 'difficult', 'bad', 'loss', 'risk',
    'danger', 'wrong', 'broken', 'crisis', 'waste', 'terrible', 'horrible', 'avoid',
    'fear', 'threat', 'burnout', 'pain',
  ],
  urgent: [
    'now', 'today', 'hurry', 'deadline', 'limited', 'last', 'immediate', 'urgent',
    'critical', 'must', 'stop', 'warning', 'alert', 'breaking', 'ending', 'running out',
  ],
};

function detectEmotion(word: string): { emotion: EmotionCategory; intensity: number } {
  const lower = word.toLowerCase().replace(/[^a-z]/g, '');
  if (lower.length < 3) return { emotion: 'neutral', intensity: 0 };

  for (const [category, words] of Object.entries(EMOTION_LEXICON)) {
    if (category === 'neutral') continue;
    const match = words.find(w => lower === w || lower.startsWith(w) || w.startsWith(lower));
    if (match) {
      const intensity = Math.min(1, 0.5 + (match.length / lower.length) * 0.5);
      return { emotion: category as EmotionCategory, intensity };
    }
  }
  return { emotion: 'neutral', intensity: 0 };
}

export function buildEmotionMap(text: string): EmotionWord[] {
  if (!text.trim()) return [];

  // Split preserving punctuation and spaces
  const tokens = text.match(/\S+|\s+/g) || [];
  const result: EmotionWord[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (/^\s+$/.test(token)) continue;

    const isSpaceAfter = i + 1 < tokens.length && /^\s+$/.test(tokens[i + 1]);
    const { emotion, intensity } = detectEmotion(token);

    result.push({
      word: token,
      emotion,
      intensity,
      isSpaceAfter,
    });
  }
  return result;
}

interface EmotionHeatmapProps {
  emotionMap: EmotionWord[];
  text: string;
}

export const EmotionHeatmap: React.FC<EmotionHeatmapProps> = ({ emotionMap, text }) => {
  if (!text.trim() || emotionMap.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
        Start typing to see the emotion heatmap...
      </div>
    );
  }

  // Count emotions for the legend
  const counts: Partial<Record<EmotionCategory, number>> = {};
  for (const w of emotionMap) {
    if (w.emotion !== 'neutral') {
      counts[w.emotion] = (counts[w.emotion] || 0) + 1;
    }
  }
  const emotionEntries = Object.entries(counts)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 5);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Emotion Heatmap</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Every word colored by its emotional signal — how your reader feels word-by-word.
          </p>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full border border-indigo-500/40 text-indigo-400 font-bold shrink-0 bg-indigo-500/10">
          {emotionMap.filter(w => w.emotion !== 'neutral').length} emotional words
        </span>
      </div>

      {/* Heatmap Word Cloud */}
      <div className="p-4 rounded-2xl bg-[#0d0d14] border border-slate-800 leading-loose text-sm font-mono min-h-[100px] max-h-[220px] overflow-y-auto">
        {emotionMap.map((ew, i) => {
          const style = EMOTION_COLORS[ew.emotion];
          return (
            <span key={i}>
              <span
                className="rounded px-0.5 transition-all cursor-default"
                style={{
                  backgroundColor: style.bg,
                  color: ew.emotion === 'neutral' ? '#64748b' : style.text,
                  fontWeight: ew.intensity > 0.6 ? 600 : 400,
                  fontSize: ew.emotion !== 'neutral' ? `${0.8 + ew.intensity * 0.3}rem` : '0.875rem',
                }}
                title={ew.emotion !== 'neutral' ? `${EMOTION_COLORS[ew.emotion].label} (${Math.round(ew.intensity * 100)}%)` : ''}
              >
                {ew.word}
              </span>
              {ew.isSpaceAfter ? ' ' : ''}
            </span>
          );
        })}
      </div>

      {/* Legend */}
      {emotionEntries.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {emotionEntries.map(([cat, count]) => {
            const style = EMOTION_COLORS[cat as EmotionCategory];
            return (
              <div
                key={cat}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-semibold"
                style={{
                  backgroundColor: style.bg,
                  borderColor: style.text + '40',
                  color: style.text,
                }}
              >
                <span>{style.label}</span>
                <span className="opacity-70">·</span>
                <span>{count} words</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
