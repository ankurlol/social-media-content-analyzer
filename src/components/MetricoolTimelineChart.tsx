import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  Check,
  ChevronDown,
  Sparkles,
  Eye,
} from 'lucide-react';

interface MetricoolTimelineChartProps {
  totalReach: number;
  totalReactions: number;
  totalComments: number;
  totalShares: number;
  isViralBoosted: boolean;
}

type MetricKey = 'reactions' | 'shares' | 'comments' | 'clicks' | 'profileClicks';

interface MetricConfig {
  key: MetricKey;
  label: string;
  sumLabel: string;
  color: string;
  glow: string;
  weight: number;
}

const METRICS: MetricConfig[] = [
  { key: 'reactions', label: 'Reactions / Likes', sumLabel: 'SUM Likes', color: '#6366f1', glow: 'rgba(99,102,241,', weight: 0.65 },
  { key: 'shares', label: 'Shares / Retweets', sumLabel: 'SUM Retweets', color: '#ec4899', glow: 'rgba(236,72,153,', weight: 0.15 },
  { key: 'comments', label: 'Comments / Replies', sumLabel: 'SUM Replies', color: '#22d3ee', glow: 'rgba(34,211,238,', weight: 0.12 },
  { key: 'clicks', label: 'Link Clicks', sumLabel: 'SUM Link Clicks', color: '#10b981', glow: 'rgba(16,185,129,', weight: 0.08 },
  { key: 'profileClicks', label: 'Profile Clicks', sumLabel: 'SUM Profile Clicks', color: '#f59e0b', glow: 'rgba(245,158,11,', weight: 0.05 },
];

export const MetricoolTimelineChart: React.FC<MetricoolTimelineChartProps> = ({
  totalReach,
  totalReactions,
  totalComments,
  totalShares,
  isViralBoosted,
}) => {
  const [activeMetrics, setActiveMetrics] = useState<Set<MetricKey>>(
    new Set(['reactions', 'shares', 'comments'])
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'line' | 'bar'>('line');

  const DAYS_COUNT = 30;

  // Generate 30-day time-series simulation data with a realistic organic velocity curve (peaks at day 2-4, steady decay, evergreen tail)
  const daysData = Array.from({ length: DAYS_COUNT }, (_, i) => {
    const day = i + 1;
    // Log-normal distribution decay curve
    const baseFactor = Math.max(
      0.02,
      Math.exp(-0.5 * Math.pow((Math.log(day) - 0.7) / 0.85, 2)) / (day * 0.85 * Math.sqrt(2 * Math.PI))
    );

    const boost = isViralBoosted ? (day <= 7 ? 1.55 : 1.2) : 1.0;
    const randomNoise = 0.9 + Math.sin(day * 2.5) * 0.1;

    const dayEngagementFactor = baseFactor * boost * randomNoise;

    const baseEng = (totalReactions + totalComments + totalShares) * 0.18;
    const reactions = Math.round(baseEng * 0.65 * dayEngagementFactor * 10);
    const shares = Math.round(baseEng * 0.18 * dayEngagementFactor * 10);
    const comments = Math.round(baseEng * 0.14 * dayEngagementFactor * 10);
    const clicks = Math.round(baseEng * 0.08 * dayEngagementFactor * 10);
    const profileClicks = Math.round(baseEng * 0.05 * dayEngagementFactor * 10);

    return {
      day,
      dateLabel: `Oct ${day}`,
      reactions,
      shares,
      comments,
      clicks,
      profileClicks,
    };
  });

  const toggleMetric = (key: MetricKey) => {
    const next = new Set(activeMetrics);
    if (next.has(key)) {
      if (next.size > 1) next.delete(key);
    } else {
      next.add(key);
    }
    setActiveMetrics(next);
  };

  // Find max value across active metrics for SVG scaling
  const maxVal = Math.max(
    10,
    ...daysData.flatMap(d =>
      Array.from(activeMetrics).map(k => d[k])
    )
  );

  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 25;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  const getX = (index: number) => paddingX + (index / (DAYS_COUNT - 1)) * plotWidth;
  const getY = (value: number) => svgHeight - paddingY - (value / maxVal) * plotHeight;

  // Build SVG path strings
  const getPath = (key: MetricKey) => {
    return daysData
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)} ${getY(d[key]).toFixed(1)}`)
      .join(' ');
  };

  const getAreaPath = (key: MetricKey) => {
    const line = getPath(key);
    return `${line} L ${getX(DAYS_COUNT - 1).toFixed(1)} ${(svgHeight - paddingY).toFixed(1)} L ${getX(0).toFixed(1)} ${(svgHeight - paddingY).toFixed(1)} Z`;
  };

  const activeDayData = hoveredDay !== null ? daysData[hoveredDay] : daysData[daysData.length - 1];

  return (
    <div className="space-y-4">
      {/* Top Controls Bar (Sprout Social / Metricool Header) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-200">
                Timeline Performance & Evolution Curve
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                Sprout / Metricool Spec
              </span>
            </div>
            <p className="text-xs text-slate-400">
              30-day simulated interaction lifecycle, initial velocity curve & long-tail reach.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Chart view mode toggle */}
          <div className="flex items-center p-1 bg-black/40 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setViewMode('line')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'line'
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Curve
            </button>
            <button
              onClick={() => setViewMode('bar')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'bar'
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bars
            </button>
          </div>

          {/* Metricool "Add Metric" Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-white/[0.06] border border-white/[0.08] text-xs font-bold text-slate-200 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Select Metrics ({activeMetrics.size})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 glass border border-white/[0.1] rounded-2xl p-2 shadow-2xl z-30 space-y-1 animate-fadeIn">
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Metricool Dimension Picker
                </div>
                {METRICS.map(m => {
                  const isChecked = activeMetrics.has(m.key);
                  return (
                    <button
                      key={m.key}
                      onClick={() => toggleMetric(m.key)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-white/[0.06] text-xs transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: m.color }}
                        />
                        <span className="text-slate-200 font-medium font-mono text-[11px]">
                          {m.sumLabel}
                        </span>
                      </div>
                      {isChecked && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metric Legend Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {METRICS.map(m => {
          const isSelected = activeMetrics.has(m.key);
          return (
            <button
              key={m.key}
              onClick={() => toggleMetric(m.key)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                isSelected
                  ? 'bg-white/[0.06] text-white shadow-sm'
                  : 'text-slate-500 bg-transparent border-transparent hover:border-white/[0.06] opacity-60'
              }`}
              style={isSelected ? { borderColor: `${m.color}60` } : {}}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: m.color, boxShadow: isSelected ? `0 0 8px ${m.color}` : 'none' }}
              />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main SVG Timeline Chart with Crosshair */}
      <div className="relative bg-black/40 rounded-2xl border border-white/[0.06] p-3 overflow-hidden">
        {/* SVG Visualization */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto cursor-crosshair select-none"
          onMouseLeave={() => setHoveredDay(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;
            const clampedX = Math.max(paddingX, Math.min(svgWidth - paddingX, mouseX));
            const dayIndex = Math.round(((clampedX - paddingX) / plotWidth) * (DAYS_COUNT - 1));
            setHoveredDay(dayIndex);
          }}
        >
          <defs>
            {METRICS.map(m => (
              <linearGradient key={m.key} id={`gradient-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={m.color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={m.color} stopOpacity="0.0" />
              </linearGradient>
            ))}
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = svgHeight - paddingY - ratio * plotHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="#1e1e2e"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#475569"
                  fontFamily="monospace"
                >
                  {Math.round(maxVal * ratio)}
                </text>
              </g>
            );
          })}

          {/* X Axis Day Labels */}
          {[0, 5, 10, 15, 20, 25, 29].map((dayIdx) => {
            const x = getX(dayIdx);
            return (
              <text
                key={dayIdx}
                x={x}
                y={svgHeight - 8}
                textAnchor="middle"
                fontSize="9"
                fill="#64748b"
                fontFamily="monospace"
              >
                {daysData[dayIdx]?.dateLabel}
              </text>
            );
          })}

          {/* Render Active Metrics (Lines / Area or Bars) */}
          {viewMode === 'line' ? (
            <>
              {Array.from(activeMetrics).map(key => {
                const metric = METRICS.find(m => m.key === key)!;
                return (
                  <g key={key}>
                    {/* Area fill */}
                    <path
                      d={getAreaPath(key)}
                      fill={`url(#gradient-${key})`}
                    />
                    {/* Smooth stroke line */}
                    <path
                      d={getPath(key)}
                      fill="none"
                      stroke={metric.color}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}
            </>
          ) : (
            /* Bar mode */
            <g>
              {daysData.map((d, i) => {
                const x = getX(i) - 4;
                return Array.from(activeMetrics).map((key, kIdx) => {
                  const metric = METRICS.find(m => m.key === key)!;
                  const barH = (d[key] / maxVal) * plotHeight;
                  const y = svgHeight - paddingY - barH;
                  return (
                    <rect
                      key={`${i}-${key}`}
                      x={x + kIdx * 3}
                      y={y}
                      width="2.5"
                      height={barH}
                      fill={metric.color}
                      rx="1"
                      opacity="0.85"
                    />
                  );
                });
              })}
            </g>
          )}

          {/* Hover Crosshair */}
          {hoveredDay !== null && (
            <g>
              <line
                x1={getX(hoveredDay)}
                y1={paddingY}
                x2={getX(hoveredDay)}
                y2={svgHeight - paddingY}
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {Array.from(activeMetrics).map(key => {
                const metric = METRICS.find(m => m.key === key)!;
                const d = daysData[hoveredDay];
                return (
                  <circle
                    key={key}
                    cx={getX(hoveredDay)}
                    cy={getY(d[key])}
                    r="4"
                    fill={metric.color}
                    stroke="#0a0a0f"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          )}
        </svg>

        {/* Floating Tooltip Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Selected Day:</span>
            <span className="text-indigo-300 font-bold font-sans">
              {activeDayData.dateLabel} (Day {activeDayData.day})
            </span>
          </div>

          <div className="flex items-center gap-3">
            {Array.from(activeMetrics).map(key => {
              const metric = METRICS.find(m => m.key === key)!;
              return (
                <div key={key} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: metric.color }} />
                  <span className="text-slate-400 text-[11px]">{metric.label.split('/')[0]}:</span>
                  <strong className="text-white text-[11px]">{activeDayData[key].toLocaleString()}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
