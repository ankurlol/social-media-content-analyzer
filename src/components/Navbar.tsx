import React from 'react';
import { Sparkles, FileText, Download, Key } from 'lucide-react';
import type { AnalysisResult } from '../types';
import { downloadFile, generateMarkdownReport } from '../utils/exportUtils';

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
  const handleExportMarkdown = () => {
    if (!analysisResult) return;
    const markdown = generateMarkdownReport(analysisResult);
    downloadFile(markdown, `social-analysis-${Date.now()}.md`, 'text/markdown');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 flex items-center justify-center shadow-md shadow-pink-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-base text-slate-900 tracking-tight">SocialSense</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-200">
              REPORT AI
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSampleModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-pink-600" />
            <span>Load Samples</span>
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
              hasApiKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">{hasApiKey ? 'AI Connected' : 'Connect AI'}</span>
          </button>

          {analysisResult && (
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
