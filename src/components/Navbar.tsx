import React from 'react';
import { Zap, Key, FlaskConical, Download } from 'lucide-react';
import type { AnalysisResult } from '../types';
import { generateMarkdownReport, downloadFile } from '../utils/exportUtils';

interface NavbarProps {
  onOpenApiKeyModal: () => void;
  onOpenSampleModal: () => void;
  hasApiKey: boolean;
  analysisResult: AnalysisResult | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApiKeyModal,
  onOpenSampleModal,
  hasApiKey,
  analysisResult,
}) => {
  const handleExport = () => {
    if (!analysisResult) return;
    const md = generateMarkdownReport(analysisResult);
    downloadFile(md, `socialsense-report-${Date.now()}.md`);
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black text-white tracking-tight">SocialSense</span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-indigo-500/40 text-indigo-400 bg-indigo-500/10"
            >
              AI
            </span>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSampleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition-all"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load Samples</span>
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              hasApiKey
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border-white/[0.06]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{hasApiKey ? 'AI Connected' : 'Connect AI'}</span>
          </button>

          <button
            onClick={handleExport}
            disabled={!analysisResult}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
