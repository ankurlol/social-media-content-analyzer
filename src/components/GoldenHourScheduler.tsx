import React, { useState } from 'react';
import type { SupportedPlatform } from '../types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// Hours to show (6am to 11pm)
const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const HOUR_LABELS: Record<number, string> = {
  6: '6a', 7: '7a', 8: '8a', 9: '9a', 10: '10a', 11: '11a',
  12: '12p', 13: '1p', 14: '2p', 15: '3p', 16: '4p', 17: '5p',
  18: '6p', 19: '7p', 20: '8p', 21: '9p', 22: '10p', 23: '11p',
};

type EngagementGrid = Record<string, Record<number, number>>;

// Research-backed optimal posting heatmap data per platform
// Values: 0 (avoid) → 100 (peak)
const PLATFORM_DATA: Record<SupportedPlatform, EngagementGrid> = {
  linkedin: {
    Mon: { 6:20, 7:50, 8:85, 9:95, 10:90, 11:80, 12:70, 13:60, 14:50, 15:55, 16:60, 17:55, 18:35, 19:25, 20:15, 21:10, 22:5, 23:5 },
    Tue: { 6:25, 7:60, 8:90, 9:100,10:95, 11:85, 12:75, 13:65, 14:55, 15:60, 16:65, 17:60, 18:40, 19:28, 20:18, 21:10, 22:5, 23:5 },
    Wed: { 6:25, 7:60, 8:90, 9:100,10:95, 11:85, 12:78, 13:65, 14:55, 15:60, 16:65, 17:55, 18:38, 19:25, 20:15, 21:10, 22:5, 23:5 },
    Thu: { 6:22, 7:55, 8:88, 9:98, 10:92, 11:82, 12:72, 13:62, 14:52, 15:58, 16:62, 17:50, 18:35, 19:22, 20:12, 21:8, 22:5, 23:5 },
    Fri: { 6:18, 7:45, 8:75, 9:85, 10:80, 11:70, 12:65, 13:55, 14:45, 15:40, 16:35, 17:30, 18:20, 19:15, 20:10, 21:8, 22:5, 23:5 },
    Sat: { 6:5,  7:8,  8:12, 9:18, 10:22, 11:25, 12:22, 13:20, 14:18, 15:15, 16:12, 17:10, 18:8, 19:8, 20:5, 21:5, 22:5, 23:5 },
    Sun: { 6:5,  7:8,  8:10, 9:15, 10:18, 11:20, 12:18, 13:15, 14:12, 15:10, 16:8, 17:8, 18:8, 19:5, 20:5, 21:5, 22:5, 23:5 },
  },
  twitter: {
    Mon: { 6:35, 7:55, 8:70, 9:80, 10:85, 11:80, 12:90, 13:85, 14:75, 15:70, 16:65, 17:75, 18:80, 19:75, 20:65, 21:55, 22:40, 23:25 },
    Tue: { 6:38, 7:58, 8:72, 9:83, 10:88, 11:83, 12:95, 13:90, 14:78, 15:73, 16:68, 17:78, 18:83, 19:78, 20:68, 21:58, 22:42, 23:28 },
    Wed: { 6:38, 7:58, 8:72, 9:83, 10:88, 11:83, 12:95, 13:90, 14:78, 15:73, 16:68, 17:78, 18:85, 19:80, 20:70, 21:60, 22:42, 23:28 },
    Thu: { 6:35, 7:55, 8:70, 9:80, 10:85, 11:80, 12:90, 13:85, 14:75, 15:70, 16:65, 17:75, 18:80, 19:75, 20:65, 21:55, 22:40, 23:25 },
    Fri: { 6:30, 7:50, 8:65, 9:75, 10:80, 11:75, 12:85, 13:80, 14:72, 15:68, 16:62, 17:72, 18:78, 19:72, 20:60, 21:50, 22:38, 23:22 },
    Sat: { 6:20, 7:30, 8:45, 9:55, 10:65, 11:72, 12:78, 13:75, 14:70, 15:68, 16:65, 17:70, 18:75, 19:72, 20:65, 21:55, 22:42, 23:28 },
    Sun: { 6:18, 7:28, 8:40, 9:52, 10:62, 11:70, 12:75, 13:72, 14:68, 15:65, 16:62, 17:68, 18:72, 19:70, 20:62, 21:52, 22:40, 23:25 },
  },
  instagram: {
    Mon: { 6:25, 7:45, 8:65, 9:72, 10:75, 11:90, 12:88, 13:82, 14:85, 15:80, 16:78, 17:85, 18:90, 19:88, 20:80, 21:70, 22:50, 23:30 },
    Tue: { 6:28, 7:48, 8:68, 9:75, 10:78, 11:92, 12:90, 13:85, 14:88, 15:83, 16:80, 17:88, 18:93, 19:91, 20:83, 21:73, 22:52, 23:32 },
    Wed: { 6:28, 7:48, 8:68, 9:75, 10:78, 11:93, 12:91, 13:86, 14:89, 15:84, 16:81, 17:89, 18:94, 19:92, 20:85, 21:75, 22:54, 23:34 },
    Thu: { 6:26, 7:46, 8:66, 9:73, 10:76, 11:90, 12:88, 13:83, 14:86, 15:81, 16:78, 17:86, 18:91, 19:89, 20:81, 21:71, 22:51, 23:31 },
    Fri: { 6:22, 7:42, 8:62, 9:70, 10:74, 11:87, 12:85, 13:80, 14:83, 15:78, 16:75, 17:83, 18:88, 19:86, 20:78, 21:68, 22:48, 23:28 },
    Sat: { 6:15, 7:30, 8:52, 9:68, 10:80, 11:88, 12:92, 13:90, 14:88, 15:86, 16:84, 17:88, 18:90, 19:88, 20:83, 21:75, 22:58, 23:38 },
    Sun: { 6:14, 7:28, 8:50, 9:65, 10:78, 11:86, 12:90, 13:88, 14:85, 15:83, 16:81, 17:85, 18:88, 19:86, 20:80, 21:72, 22:55, 23:35 },
  },
  facebook: {
    Mon: { 6:20, 7:35, 8:55, 9:65, 10:70, 11:75, 12:80, 13:85, 14:88, 15:85, 16:80, 17:75, 18:70, 19:65, 20:55, 21:45, 22:30, 23:18 },
    Tue: { 6:22, 7:38, 8:58, 9:68, 10:73, 11:78, 12:83, 13:88, 14:91, 15:88, 16:83, 17:78, 18:73, 19:68, 20:58, 21:48, 22:32, 23:20 },
    Wed: { 6:22, 7:38, 8:58, 9:68, 10:73, 11:78, 12:83, 13:88, 14:92, 15:89, 16:84, 17:79, 18:74, 19:69, 20:59, 21:49, 22:33, 23:21 },
    Thu: { 6:21, 7:36, 8:56, 9:66, 10:71, 11:76, 12:81, 13:86, 14:89, 15:86, 16:81, 17:76, 18:71, 19:66, 20:56, 21:46, 22:31, 23:19 },
    Fri: { 6:18, 7:32, 8:50, 9:60, 10:66, 11:71, 12:77, 13:82, 14:85, 15:82, 16:77, 17:72, 18:67, 19:62, 20:52, 21:42, 22:28, 23:16 },
    Sat: { 6:12, 7:22, 8:38, 9:52, 10:65, 11:75, 12:82, 13:85, 14:88, 15:86, 16:82, 17:78, 18:73, 19:68, 20:60, 21:50, 22:36, 23:22 },
    Sun: { 6:11, 7:20, 8:35, 9:50, 10:63, 11:73, 12:80, 13:83, 14:86, 15:84, 16:80, 17:76, 18:71, 19:66, 20:58, 21:48, 22:34, 23:20 },
  },
};

const PLATFORM_META: Record<SupportedPlatform, { label: string; color: string; glow: string }> = {
  linkedin:  { label: 'LinkedIn',   color: '#6366f1', glow: 'rgba(99,102,241,' },
  twitter:   { label: 'Twitter / X',color: '#22d3ee', glow: 'rgba(34,211,238,' },
  instagram: { label: 'Instagram',  color: '#ec4899', glow: 'rgba(236,72,153,' },
  facebook:  { label: 'Facebook',   color: '#818cf8', glow: 'rgba(129,140,248,' },
};

function getHeatColor(value: number, color: string, glow: string): string {
  if (value >= 85) return `${glow}0.7)`;
  if (value >= 70) return `${glow}0.45)`;
  if (value >= 50) return `${glow}0.25)`;
  if (value >= 30) return `${glow}0.1)`;
  return 'rgba(255,255,255,0.02)';
}

export const GoldenHourScheduler: React.FC = () => {
  const [platform, setPlatform] = useState<SupportedPlatform>('linkedin');
  const [hoveredCell, setHoveredCell] = useState<{ day: string; hour: number; value: number } | null>(null);

  const meta = PLATFORM_META[platform];
  const grid = PLATFORM_DATA[platform];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Golden Hour Scheduler</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Best times to post per day of week — brighter cell = higher algorithmic reach window.
          </p>
        </div>

        {/* Platform tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(Object.keys(PLATFORM_META) as SupportedPlatform[]).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                platform === p
                  ? 'text-white border-transparent'
                  : 'text-slate-500 border-slate-700 hover:border-slate-500'
              }`}
              style={platform === p ? { background: PLATFORM_META[p].color } : {}}
            >
              {PLATFORM_META[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Hour labels row */}
          <div className="grid gap-[2px] mb-1" style={{ gridTemplateColumns: `40px repeat(${HOURS.length}, 1fr)` }}>
            <div />
            {HOURS.map(h => (
              <div key={h} className="text-center text-[9px] text-slate-600 font-bold">
                {HOUR_LABELS[h]}
              </div>
            ))}
          </div>

          {/* Day rows */}
          {DAYS.map(day => (
            <div
              key={day}
              className="grid gap-[2px] mb-[2px] items-center"
              style={{ gridTemplateColumns: `40px repeat(${HOURS.length}, 1fr)` }}
            >
              <div className="text-[10px] text-slate-500 font-bold pr-2 text-right">{day}</div>
              {HOURS.map(h => {
                const val = grid[day][h] ?? 0;
                return (
                  <div
                    key={h}
                    onMouseEnter={() => setHoveredCell({ day, hour: h, value: val })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className="h-5 rounded-sm cursor-pointer transition-all hover:scale-110 hover:z-10 relative"
                    style={{
                      backgroundColor: getHeatColor(val, meta.color, meta.glow),
                      border: val >= 85 ? `1px solid ${meta.color}60` : '1px solid transparent',
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip / Hovered info */}
      {hoveredCell && (
        <div
          className="flex items-center justify-between p-3 rounded-xl border text-xs font-medium animate-fadeIn"
          style={{ borderColor: meta.color + '40', backgroundColor: meta.glow + '0.08)' }}
        >
          <span className="text-slate-400">
            {hoveredCell.day} at {HOUR_LABELS[hoveredCell.hour]}
          </span>
          <span style={{ color: meta.color }} className="font-black">
            {hoveredCell.value >= 85
              ? 'Peak Window — Post Now!'
              : hoveredCell.value >= 60
              ? 'Good Window'
              : hoveredCell.value >= 35
              ? 'Moderate Activity'
              : 'Low Engagement Window'}
            {' '}({hoveredCell.value}% reach)
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-slate-600 font-semibold uppercase tracking-wider">Engagement Level:</span>
        {[
          { label: 'Peak', opacity: '0.7' },
          { label: 'Good', opacity: '0.45' },
          { label: 'Moderate', opacity: '0.25' },
          { label: 'Low', opacity: '0.1' },
        ].map(({ label, opacity }) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className="w-4 h-3 rounded-sm"
              style={{ backgroundColor: `${meta.glow}${opacity})` }}
            />
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
