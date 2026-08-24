import React from 'react';
import type { StyleDNAProfile } from '../types';

interface StyleDNAProps {
  profile: StyleDNAProfile;
}

const AXES: { key: keyof StyleDNAProfile; label: string; color: string; description: string }[] = [
  { key: 'formality',    label: 'Formality',    color: '#6366f1', description: 'Formal vs casual vocabulary' },
  { key: 'emotion',      label: 'Emotion',      color: '#ec4899', description: 'Emotional word density' },
  { key: 'brevity',      label: 'Brevity',      color: '#22d3ee', description: 'Sentence conciseness' },
  { key: 'authority',    label: 'Authority',    color: '#a78bfa', description: 'Expert confidence signals' },
  { key: 'curiosity',    label: 'Curiosity',    color: '#fbbf24', description: 'Question & discovery framing' },
  { key: 'storytelling', label: 'Story',        color: '#34d399', description: 'Narrative & anecdote usage' },
];

const NUM_AXES = 6;
const CX = 120;
const CY = 120;
const R = 90;

function polarToCartesian(angle: number, radius: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: CX + radius * Math.cos(rad),
    y: CY + radius * Math.sin(rad),
  };
}

function buildPolygonPoints(values: number[], maxR: number): string {
  return values
    .map((v, i) => {
      const angle = (360 / NUM_AXES) * i;
      const r = (v / 100) * maxR;
      const p = polarToCartesian(angle, r);
      return `${p.x},${p.y}`;
    })
    .join(' ');
}

export const StyleDNA: React.FC<StyleDNAProps> = ({ profile }) => {
  const values = AXES.map(a => profile[a.key]);

  // Concentric rings at 25, 50, 75, 100
  const ringRadii = [R * 0.25, R * 0.5, R * 0.75, R];

  // Build axis lines and label positions
  const axisLines = AXES.map((_, i) => {
    const angle = (360 / NUM_AXES) * i;
    const outer = polarToCartesian(angle, R);
    return { x2: outer.x, y2: outer.y };
  });

  const labelPositions = AXES.map((ax, i) => {
    const angle = (360 / NUM_AXES) * i;
    const pos = polarToCartesian(angle, R + 20);
    return { ...pos, label: ax.label, color: ax.color };
  });

  const shapePath = buildPolygonPoints(values, R);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Writing Style DNA</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Your unique 6-dimensional content fingerprint — no two writers have the same shape.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] px-2 py-0.5 rounded-full border border-purple-500/40 text-purple-400 font-bold bg-purple-500/10">
            Unique Signature
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Radar */}
        <div className="shrink-0">
          <svg width="240" height="240" viewBox="0 0 240 240">
            {/* Background rings */}
            {ringRadii.map((r, i) => (
              <polygon
                key={i}
                points={buildPolygonPoints(Array(NUM_AXES).fill(r / R * 100), r)}
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
              />
            ))}

            {/* Axis lines */}
            {axisLines.map((line, i) => (
              <line
                key={i}
                x1={CX} y1={CY}
                x2={line.x2} y2={line.y2}
                stroke="#334155"
                strokeWidth="1"
              />
            ))}

            {/* Data polygon — filled */}
            <polygon
              points={shapePath}
              fill="rgba(99,102,241,0.15)"
              stroke="#6366f1"
              strokeWidth="2"
              strokeLinejoin="round"
            />

            {/* Data points */}
            {values.map((v, i) => {
              const angle = (360 / NUM_AXES) * i;
              const r = (v / 100) * R;
              const p = polarToCartesian(angle, r);
              return (
                <circle
                  key={i}
                  cx={p.x} cy={p.y}
                  r="4"
                  fill={AXES[i].color}
                  stroke="#0a0a0f"
                  strokeWidth="2"
                />
              );
            })}

            {/* Axis labels */}
            {labelPositions.map((lp, i) => (
              <text
                key={i}
                x={lp.x}
                y={lp.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontWeight="700"
                fill={lp.color}
                letterSpacing="0.5"
              >
                {lp.label.toUpperCase()}
              </text>
            ))}

            {/* Center dot */}
            <circle cx={CX} cy={CY} r="3" fill="#6366f1" />
          </svg>
        </div>

        {/* Dimension scores list */}
        <div className="flex-1 space-y-2.5 w-full">
          {AXES.map((ax) => {
            const v = profile[ax.key];
            return (
              <div key={ax.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: ax.color }}>
                    {ax.label}
                  </span>
                  <span className="text-xs font-black text-slate-300 font-mono">{v}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${v}%`,
                      backgroundColor: ax.color,
                      boxShadow: `0 0 6px ${ax.color}80`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-600">{ax.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
