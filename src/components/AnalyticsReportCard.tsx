import React, { useState } from 'react';
import {
  Smile,
  MessageCircle,
  Share2,
  Bookmark,
  ThumbsUp,
  UserCheck,
  Percent,
  Calendar,
  Layers,
  ChevronDown,
  Activity,
  BarChart3,
  TrendingUp,
  Plus,
  Lock,
} from 'lucide-react';
import type { ProjectedAnalytics } from '../types';

interface AnalyticsReportCardProps {
  analytics: ProjectedAnalytics;
}

export const AnalyticsReportCard: React.FC<AnalyticsReportCardProps> = ({ analytics }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Last 30 days');
  const [selectedChannel, setSelectedChannel] = useState('All Channels');

  // Format large numbers with commas
  const fmt = (num: number) => num.toLocaleString('en-US');

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
      {/* Header bar with filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Social Media Analytics Report
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Algorithmic distribution simulation and projected audience response
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Channel Dropdown Filter */}
          <div className="relative inline-block">
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option>All Channels</option>
              <option>LinkedIn Feed</option>
              <option>Twitter / X</option>
              <option>Instagram</option>
              <option>Facebook</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Timeframe Filter */}
          <div className="relative inline-block">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl border border-slate-200 focus:outline-none cursor-pointer"
            >
              <option>Last 30 days</option>
              <option>Campaign Lifetime</option>
              <option>First 48 Hours</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        {/* Left Column: Engagement breakdown & KPI cards */}
        <div className="lg:col-span-5 space-y-6">
          {/* Engagement List */}
          <div className="bg-slate-50/70 rounded-2xl p-5 border border-slate-100 space-y-3.5">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Projected Engagement
            </h3>

            {/* Reactions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Smile className="w-4 h-4 text-pink-500" />
                <span>Reactions</span>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {fmt(analytics.reactions)}
              </span>
            </div>

            {/* Comments */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <MessageCircle className="w-4 h-4 text-pink-500" />
                <span>Comments</span>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {fmt(analytics.comments)}
              </span>
            </div>

            {/* Shares */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Share2 className="w-4 h-4 text-pink-500" />
                <span>Shares / Reposts</span>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {fmt(analytics.shares)}
              </span>
            </div>

            {/* Post Saves */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <Bookmark className="w-4 h-4 text-pink-500" />
                <span>Post Saves</span>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {fmt(analytics.postSaves)}
              </span>
            </div>

            {/* Page Likes */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-sm text-slate-700 font-medium">
                <ThumbsUp className="w-4 h-4 text-pink-500" />
                <span>Follower Growth</span>
              </div>
              <span className="text-sm font-bold text-slate-900 font-mono">
                {fmt(analytics.pageLikes)}
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
                  {fmt(analytics.totalReach)}
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
                  {analytics.engagementRate}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pie Chart & Demographic Breakdown */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Donut / Pie Visualization */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
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
                <span className="text-xs font-black text-slate-800">
                  {analytics.engagementRate}%
                </span>
                <span className="text-[9px] text-slate-400 font-medium uppercase">Active</span>
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

          {/* Countries / Demographics Breakdown */}
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
                    {fmt(item.reach)} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Floating Action Pill Bar matching reference screenshot */}
          <div className="flex items-center justify-center pt-2">
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200/80 shadow-md">
              <button
                className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-105 transition-transform"
                title="Security & Content Compliance"
              >
                <Lock className="w-4 h-4" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
                title="Reach Velocity Pulse"
              >
                <Activity className="w-4 h-4 text-sky-500" />
              </button>
              <button
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-600 to-rose-500 text-white flex items-center justify-center shadow-md shadow-pink-500/30 hover:scale-105 transition-transform"
                title="Viral Growth Potential"
              >
                <TrendingUp className="w-5 h-5" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-slate-100 text-amber-600 flex items-center justify-center hover:bg-slate-200 transition-colors"
                title="Analytics Metrics"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-105 transition-transform"
                title="Add New Target Filter"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
