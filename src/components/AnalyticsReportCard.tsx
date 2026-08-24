import React, { useState } from 'react';
import {
  Smile,
  MessageCircle,
  Share2,
  Bookmark,
  ThumbsUp,
  UserCheck,
  Percent,
  ChevronDown,
  Activity,
  BarChart3,
  TrendingUp,
  Plus,
  Lock,
  CheckCircle,
  ShieldCheck,
  Zap,
  Target,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ProjectedAnalytics } from '../types';

interface AnalyticsReportCardProps {
  analytics: ProjectedAnalytics;
}

type ActiveFeatureModal = 'none' | 'security' | 'velocity' | 'viral' | 'metrics' | 'goal';

export const AnalyticsReportCard: React.FC<AnalyticsReportCardProps> = ({ analytics }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 days');
  const [selectedChannel, setSelectedChannel] = useState('All Channels');
  const [activeModal, setActiveModal] = useState<ActiveFeatureModal>('none');
  const [isViralBoosted, setIsViralBoosted] = useState(false);
  const [targetGoal, setTargetGoal] = useState<number>(50000);

  // Compute channel & timeframe multipliers
  let channelMultiplier = 1.0;
  if (selectedChannel === 'LinkedIn Feed') channelMultiplier = 0.92;
  else if (selectedChannel === 'Twitter / X') channelMultiplier = 1.35;
  else if (selectedChannel === 'Instagram') channelMultiplier = 1.15;
  else if (selectedChannel === 'Facebook') channelMultiplier = 0.85;

  let timeframeMultiplier = 1.0;
  if (selectedTimeframe === 'First 48 Hours') timeframeMultiplier = 0.35;
  else if (selectedTimeframe === 'Campaign Lifetime') timeframeMultiplier = 1.6;

  const viralMultiplier = isViralBoosted ? 1.45 : 1.0;
  const combinedMultiplier = channelMultiplier * timeframeMultiplier * viralMultiplier;

  const reach = Math.round(analytics.totalReach * combinedMultiplier);
  const engRate = Math.round((analytics.engagementRate * (isViralBoosted ? 1.25 : 1.0)) * 10) / 10;
  const totalEng = Math.round(reach * (engRate / 100));

  const reactions = Math.round(totalEng * 0.65);
  const comments = Math.round(totalEng * 0.18);
  const shares = Math.round(totalEng * 0.11);
  const postSaves = Math.round(totalEng * 0.06);
  const pageLikes = Math.max(40, Math.round(totalEng * 0.05));

  const fmt = (num: number) => num.toLocaleString('en-US');

  const handleToggleViralBoost = () => {
    const nextState = !isViralBoosted;
    setIsViralBoosted(nextState);
    if (nextState) {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#ec4899', '#22d3ee'],
      });
      setActiveModal('viral');
    }
  };

  return (
    <div className="glass rounded-2xl border border-white/[0.06] p-6 sm:p-8 shadow-xl shadow-black/30 space-y-6 relative overflow-hidden">
      {/* Header bar with interactive channel/timeframe selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Social Media Analytics Report
            </h2>
            {isViralBoosted && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 animate-pulse">
                +45% Viral Boost Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Algorithmic distribution simulation and projected audience response
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Channel Dropdown */}
          <div className="relative inline-block">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="appearance-none bg-black/40 hover:bg-white/[0.06] text-slate-200 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-white/[0.08] focus:outline-none cursor-pointer transition-colors"
            >
              <option value="All Channels" className="bg-[#13131a] text-slate-200">All Channels</option>
              <option value="LinkedIn Feed" className="bg-[#13131a] text-slate-200">LinkedIn Feed</option>
              <option value="Twitter / X" className="bg-[#13131a] text-slate-200">Twitter / X</option>
              <option value="Instagram" className="bg-[#13131a] text-slate-200">Instagram</option>
              <option value="Facebook" className="bg-[#13131a] text-slate-200">Facebook</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative inline-block">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="appearance-none bg-black/40 hover:bg-white/[0.06] text-slate-200 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-white/[0.08] focus:outline-none cursor-pointer transition-colors"
            >
              <option value="Last 30 days" className="bg-[#13131a] text-slate-200">Last 30 days</option>
              <option value="Campaign Lifetime" className="bg-[#13131a] text-slate-200">Campaign Lifetime</option>
              <option value="First 48 Hours" className="bg-[#13131a] text-slate-200">First 48 Hours</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Engagement breakdown & KPI cards */}
        <div className="lg:col-span-5 space-y-5">
          {/* Engagement List */}
          <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/[0.06] space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Projected Engagement
              </h3>
              <span className="text-[10px] font-semibold text-slate-500 font-mono">
                {selectedChannel} · {selectedTimeframe}
              </span>
            </div>

            {/* Reactions */}
            <div className="flex items-center justify-between hover:bg-white/[0.03] p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2.5 text-sm text-slate-300 font-medium">
                <Smile className="w-4 h-4 text-indigo-400" />
                <span>Reactions</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {fmt(reactions)}
              </span>
            </div>

            {/* Comments */}
            <div className="flex items-center justify-between hover:bg-white/[0.03] p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2.5 text-sm text-slate-300 font-medium">
                <MessageCircle className="w-4 h-4 text-pink-400" />
                <span>Comments</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {fmt(comments)}
              </span>
            </div>

            {/* Shares */}
            <div className="flex items-center justify-between hover:bg-white/[0.03] p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2.5 text-sm text-slate-300 font-medium">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Shares / Reposts</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {fmt(shares)}
              </span>
            </div>

            {/* Post Saves */}
            <div className="flex items-center justify-between hover:bg-white/[0.03] p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2.5 text-sm text-slate-300 font-medium">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>Post Saves</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {fmt(postSaves)}
              </span>
            </div>

            {/* Page Likes */}
            <div className="flex items-center justify-between hover:bg-white/[0.03] p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2.5 text-sm text-slate-300 font-medium">
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
                <span>Follower Growth</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {fmt(pageLikes)}
              </span>
            </div>
          </div>

          {/* 2 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Total Reach */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Total Reach</span>
                <span className="text-lg font-black text-white font-mono tracking-tight">
                  {fmt(reach)}
                </span>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0 border border-pink-500/20">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block">Eng. Rate</span>
                <span className="text-lg font-black text-white font-mono tracking-tight">
                  {engRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Donut Chart, Demographics, and Floating Action Pill */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Donut Visualization */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-5 bg-white/[0.02] rounded-2xl border border-white/[0.06]">
            {/* SVG Pie Chart */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Segment 1: Reactions (65%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#6366f1"
                  strokeWidth="24"
                  strokeDasharray="238.7"
                  strokeDashoffset="0"
                />
                {/* Segment 2: Comments (18%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#ec4899"
                  strokeWidth="24"
                  strokeDasharray="43 195.7"
                  strokeDashoffset="-155.1"
                />
                {/* Segment 3: Shares (11%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#22d3ee"
                  strokeWidth="24"
                  strokeDasharray="26 212.7"
                  strokeDashoffset="-198.1"
                />
                {/* Segment 4: Saves (6%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="24"
                  strokeDasharray="14.3 224.4"
                  strokeDashoffset="-224.4"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center bg-[#13131a] w-20 h-20 rounded-full border border-white/[0.08] shadow-lg">
                <span className="text-xs font-black text-white font-mono">
                  {engRate}%
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ACTIVE</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#6366f1]" />
                <span className="text-slate-300 font-medium">Reactions (65%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ec4899]" />
                <span className="text-slate-300 font-medium">Comments (18%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#22d3ee]" />
                <span className="text-slate-300 font-medium">Shares / Reposts (11%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#a855f7]" />
                <span className="text-slate-300 font-medium">Saves & Follows (6%)</span>
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Audience Geographies by Estimated Reach
            </h4>
            <div className="space-y-2">
              {analytics.countryBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-300 font-medium">{item.country}</span>
                  </div>
                  <span className="font-bold text-white font-mono">
                    {fmt(Math.round(reach * (item.percentage / 100)))} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Floating Action Pill Bar */}
          <div className="flex flex-col items-center justify-center pt-2 gap-3">
            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/[0.08] shadow-xl">
              {/* 1. Security / Content Safety Button */}
              <button
                onClick={() => setActiveModal(activeModal === 'security' ? 'none' : 'security')}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  activeModal === 'security'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 scale-105'
                    : 'bg-white/[0.06] text-emerald-400 hover:bg-white/[0.1]'
                }`}
                title="Content Safety & Compliance Audit"
              >
                <Lock className="w-4 h-4" />
              </button>

              {/* 2. Velocity Growth Button */}
              <button
                onClick={() => setActiveModal(activeModal === 'velocity' ? 'none' : 'velocity')}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  activeModal === 'velocity'
                    ? 'bg-cyan-600 text-white ring-2 ring-cyan-400 scale-105'
                    : 'bg-white/[0.06] text-cyan-400 hover:bg-white/[0.1]'
                }`}
                title="Reach Velocity Trajectory"
              >
                <Activity className="w-4 h-4" />
              </button>

              {/* 3. Viral Growth Multiplier Button */}
              <button
                onClick={handleToggleViralBoost}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isViralBoosted
                    ? 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white ring-4 ring-pink-500/50 scale-110 shadow-pink-500/40'
                    : 'bg-gradient-to-tr from-indigo-600 to-pink-600 text-white hover:scale-105 opacity-90 shadow-indigo-500/30'
                }`}
                title={isViralBoosted ? 'Viral Boost Active (Click to reset)' : 'Click to Simulate Viral Boost (+45% Reach)'}
              >
                <TrendingUp className="w-5 h-5" />
              </button>

              {/* 4. Detailed Metrics Benchmark Button */}
              <button
                onClick={() => setActiveModal(activeModal === 'metrics' ? 'none' : 'metrics')}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  activeModal === 'metrics'
                    ? 'bg-amber-600 text-white ring-2 ring-amber-400 scale-105'
                    : 'bg-white/[0.06] text-amber-400 hover:bg-white/[0.1]'
                }`}
                title="Benchmark Metrics Breakdown"
              >
                <BarChart3 className="w-4 h-4" />
              </button>

              {/* 5. Target Reach Goal Button */}
              <button
                onClick={() => setActiveModal(activeModal === 'goal' ? 'none' : 'goal')}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  activeModal === 'goal'
                    ? 'bg-purple-600 text-white ring-2 ring-purple-400 scale-105'
                    : 'bg-white/[0.06] text-purple-400 hover:bg-white/[0.1]'
                }`}
                title="Set Reach Campaign Target"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Feature Panel / Toast Display */}
            {activeModal !== 'none' && (
              <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 animate-fadeIn text-xs text-slate-300 relative shadow-2xl">
                <button
                  onClick={() => setActiveModal('none')}
                  className="absolute top-3 right-3 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {activeModal === 'security' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Content Compliance & Brand Safety Audit</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                      <div className="p-2 bg-black/40 rounded-lg border border-white/[0.06] text-center">
                        <span className="text-[10px] text-slate-400 block">Toxicity Risk</span>
                        <strong className="text-emerald-400">0.0% Clean</strong>
                      </div>
                      <div className="p-2 bg-black/40 rounded-lg border border-white/[0.06] text-center">
                        <span className="text-[10px] text-slate-400 block">Spam Score</span>
                        <strong className="text-emerald-400">Low (Pass)</strong>
                      </div>
                      <div className="p-2 bg-black/40 rounded-lg border border-white/[0.06] text-center">
                        <span className="text-[10px] text-slate-400 block">Brand Safety</span>
                        <strong className="text-emerald-400">100% Safe</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'velocity' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <Activity className="w-4 h-4" />
                      <span>Reach Velocity Growth Trajectory</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Projected impressions velocity across initial distribution milestones:
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                      <div className="p-2 bg-black/40 rounded-lg border border-white/[0.06] text-center">
                        <span className="text-[10px] text-slate-400 block">Hour 0 - 6</span>
                        <strong className="text-white">{fmt(Math.round(reach * 0.22))} views</strong>
                      </div>
                      <div className="p-2 bg-black/40 rounded-lg border border-white/[0.06] text-center">
                        <span className="text-[10px] text-slate-400 block">Hour 6 - 24</span>
                        <strong className="text-white">{fmt(Math.round(reach * 0.48))} views</strong>
                      </div>
                      <div className="p-2 bg-black/40 rounded-lg border border-white/[0.06] text-center">
                        <span className="text-[10px] text-slate-400 block">Day 2 - 7</span>
                        <strong className="text-white">{fmt(reach)} total</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'viral' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-pink-400 font-bold">
                      <TrendingUp className="w-4 h-4" />
                      <span>Viral Hook Optimization Mode</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {isViralBoosted
                        ? 'Simulated with high-velocity viral hook formulas. Estimated +45% reach and +25% comment spike applied.'
                        : 'Click the central graph button to apply simulated viral hook distribution.'}
                    </p>
                  </div>
                )}

                {activeModal === 'metrics' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <BarChart3 className="w-4 h-4" />
                      <span>Benchmark Metrics Breakdown</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                      <div className="p-2 bg-black/40 rounded-lg border border-white/[0.06]">
                        <span className="text-[10px] text-slate-400 block">Industry Average Eng.</span>
                        <strong className="text-slate-300">2.4%</strong>
                      </div>
                      <div className="p-2 bg-black/40 rounded-lg border border-white/[0.06]">
                        <span className="text-[10px] text-slate-400 block">Your Projected Eng.</span>
                        <strong className="text-pink-400">{engRate}% (+{Math.round((engRate - 2.4) * 10) / 10}%)</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'goal' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-400 font-bold">
                      <Target className="w-4 h-4" />
                      <span>Campaign Reach Goal Tracker</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-slate-400">Target:</span>
                      <input
                        type="number"
                        value={targetGoal}
                        onChange={(e) => setTargetGoal(Number(e.target.value))}
                        className="px-2 py-1 bg-black/50 border border-white/[0.1] rounded-lg text-xs font-mono font-bold text-white w-24 focus:outline-none focus:border-purple-500"
                      />
                      <span className="text-xs text-slate-300">
                        Current Projection: <strong className="text-purple-400">{Math.round((reach / targetGoal) * 100)}% of goal</strong>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
