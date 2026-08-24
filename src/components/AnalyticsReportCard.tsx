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
  const [isSettingGoal, setIsSettingGoal] = useState(false);

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
        colors: ['#db2777', '#be123c', '#f43f5e'],
      });
      setActiveModal('viral');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 relative">
      {/* Header bar with interactive channel/timeframe selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Social Media Analytics Report
            </h2>
            {isViralBoosted && (
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-300 animate-pulse">
                +45% Viral Boost Active
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Algorithmic distribution simulation and projected audience response
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Channel Dropdown */}
          <div className="relative inline-block">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-slate-200 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="All Channels">All Channels</option>
              <option value="LinkedIn Feed">LinkedIn Feed</option>
              <option value="Twitter / X">Twitter / X</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Timeframe Dropdown */}
          <div className="relative inline-block">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-slate-200 focus:outline-none cursor-pointer transition-colors"
            >
              <option value="Last 30 days">Last 30 days</option>
              <option value="Campaign Lifetime">Campaign Lifetime</option>
              <option value="First 48 Hours">First 48 Hours</option>
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
          <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Projected Engagement
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">
                {selectedChannel} · {selectedTimeframe}
              </span>
            </div>

            {/* Reactions */}
            <div className="flex items-center justify-between hover:bg-white/60 p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Smile className="w-4 h-4 text-pink-500" />
                <span>Reactions</span>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {fmt(reactions)}
              </span>
            </div>

            {/* Comments */}
            <div className="flex items-center justify-between hover:bg-white/60 p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <MessageCircle className="w-4 h-4 text-pink-500" />
                <span>Comments</span>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {fmt(comments)}
              </span>
            </div>

            {/* Shares */}
            <div className="flex items-center justify-between hover:bg-white/60 p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Share2 className="w-4 h-4 text-pink-500" />
                <span>Shares / Reposts</span>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {fmt(shares)}
              </span>
            </div>

            {/* Post Saves */}
            <div className="flex items-center justify-between hover:bg-white/60 p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Bookmark className="w-4 h-4 text-pink-500" />
                <span>Post Saves</span>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {fmt(postSaves)}
              </span>
            </div>

            {/* Page Likes */}
            <div className="flex items-center justify-between hover:bg-white/60 p-1.5 rounded-lg transition-colors">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <ThumbsUp className="w-4 h-4 text-pink-500" />
                <span>Follower Growth</span>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {fmt(pageLikes)}
              </span>
            </div>
          </div>

          {/* 2 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Total Reach */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Total Reach</span>
                <span className="text-lg font-black text-slate-900 font-mono tracking-tight">
                  {fmt(reach)}
                </span>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500 block">Eng. Rate</span>
                <span className="text-lg font-black text-slate-900 font-mono tracking-tight">
                  {engRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Donut Chart, Demographics, and Floating Action Pill */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Donut Visualization */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-5 bg-slate-50/50 rounded-2xl border border-slate-100">
            {/* SVG Pie Chart */}
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Segment 1: Reactions (65%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#be123c"
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
                  stroke="#e11d48"
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
                  stroke="#f472b6"
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
                  stroke="#fce7f3"
                  strokeWidth="24"
                  strokeDasharray="14.3 224.4"
                  strokeDashoffset="-224.4"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center bg-white w-20 h-20 rounded-full shadow-sm">
                <span className="text-xs font-black text-slate-800 font-mono">
                  {engRate}%
                </span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">ACTIVE</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#be123c]" />
                <span className="text-slate-600 font-medium">Reactions (65%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#e11d48]" />
                <span className="text-slate-600 font-medium">Comments (18%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#f472b6]" />
                <span className="text-slate-600 font-medium">Shares / Reposts (11%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#fce7f3] border border-pink-300" />
                <span className="text-slate-600 font-medium">Saves & Follows (6%)</span>
              </div>
            </div>
          </div>

          {/* Demographics */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                    <span className="text-slate-700 font-medium">{item.country}</span>
                  </div>
                  <span className="font-bold text-slate-900 font-mono">
                    {fmt(Math.round(reach * (item.percentage / 100)))} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Floating Action Pill Bar */}
          <div className="flex flex-col items-center justify-center pt-2 gap-3">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200/90 shadow-md">
              {/* 1. Security / Content Safety Button */}
              <button
                onClick={() => setActiveModal(activeModal === 'security' ? 'none' : 'security')}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  activeModal === 'security'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 scale-105'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
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
                    ? 'bg-sky-600 text-white ring-2 ring-sky-400 scale-105'
                    : 'bg-slate-100 text-sky-600 hover:bg-slate-200'
                }`}
                title="Reach Velocity Trajectory"
              >
                <Activity className="w-4 h-4" />
              </button>

              {/* 3. Viral Growth Multiplier Button */}
              <button
                onClick={handleToggleViralBoost}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isViralBoosted
                    ? 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white ring-4 ring-pink-300 scale-110'
                    : 'bg-gradient-to-tr from-pink-600 to-rose-500 text-white hover:scale-105 opacity-90'
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
                    : 'bg-slate-100 text-amber-600 hover:bg-slate-200'
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
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
                title="Set Reach Campaign Target"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Interactive Feature Panel / Toast Display */}
            {activeModal !== 'none' && (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 animate-fadeIn text-xs text-slate-700 relative">
                <button
                  onClick={() => setActiveModal('none')}
                  className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {activeModal === 'security' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Content Compliance & Brand Safety Audit</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-500 block">Toxicity Risk</span>
                        <strong className="text-emerald-600">0.0% Clean</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-500 block">Spam Score</span>
                        <strong className="text-emerald-600">Low (Pass)</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-500 block">Brand Safety</span>
                        <strong className="text-emerald-600">100% Safe</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'velocity' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sky-700 font-bold">
                      <Activity className="w-4 h-4" />
                      <span>Reach Velocity Growth Trajectory</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Projected impressions velocity across initial distribution milestones:
                    </p>
                    <div className="grid grid-cols-3 gap-2 pt-1 font-mono">
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-500 block">Hour 0 - 6</span>
                        <strong className="text-slate-900">{fmt(Math.round(reach * 0.22))} views</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-500 block">Hour 6 - 24</span>
                        <strong className="text-slate-900">{fmt(Math.round(reach * 0.48))} views</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200 text-center">
                        <span className="text-[10px] text-slate-500 block">Day 2 - 7</span>
                        <strong className="text-slate-900">{fmt(reach)} total</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'viral' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-pink-700 font-bold">
                      <TrendingUp className="w-4 h-4" />
                      <span>Viral Hook Optimization Mode</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      {isViralBoosted
                        ? 'Simulated with high-velocity viral hook formulas. Estimated +45% reach and +25% comment spike applied.'
                        : 'Click the pink graph button to apply simulated viral hook distribution.'}
                    </p>
                  </div>
                )}

                {activeModal === 'metrics' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-amber-700 font-bold">
                      <BarChart3 className="w-4 h-4" />
                      <span>Benchmark Metrics Breakdown</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Industry Average Eng.</span>
                        <strong className="text-slate-700">2.4%</strong>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 block">Your Projected Eng.</span>
                        <strong className="text-pink-600">{engRate}% (+{Math.round((engRate - 2.4) * 10) / 10}%)</strong>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'goal' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-purple-700 font-bold">
                      <Target className="w-4 h-4" />
                      <span>Campaign Reach Goal Tracker</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs text-slate-600">Target:</span>
                      <input
                        type="number"
                        value={targetGoal}
                        onChange={(e) => setTargetGoal(Number(e.target.value))}
                        className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold w-24"
                      />
                      <span className="text-xs text-slate-500">
                        Current Projection: <strong className="text-purple-700">{Math.round((reach / targetGoal) * 100)}% of goal</strong>
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
