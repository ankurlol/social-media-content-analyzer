import React from 'react';
import { Sparkles, RefreshCw, Clipboard, Trash2 } from 'lucide-react';

interface LiveEditorProps {
  text: string;
  onChange: (newText: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const LiveEditor: React.FC<LiveEditorProps> = ({
  text,
  onChange,
  onAnalyze,
  isAnalyzing,
}) => {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) onChange(clipText);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col h-full glass rounded-2xl border border-white/[0.06] p-4 shadow-xl shadow-black/30">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06] mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-500/80" />
          <span className="text-xs font-bold text-slate-200">Post Draft / Content Editor</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePaste}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 border border-white/[0.06] transition-colors"
          >
            <Clipboard className="w-3 h-3 text-slate-400" />
            <span>Paste</span>
          </button>
          {text && (
            <button
              onClick={() => onChange('')}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Textarea */}
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or paste your social post draft here, or upload a PDF/Image document above..."
        className="w-full min-h-[140px] flex-1 p-2.5 text-xs sm:text-sm text-slate-100 bg-transparent rounded-lg border border-transparent focus:border-indigo-500/40 focus:outline-none resize-none placeholder:text-slate-500 leading-relaxed font-sans transition-all"
      />

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-white/[0.06] text-[11px] text-slate-400">
        <div className="flex items-center gap-3 font-mono">
          <span><strong className="text-slate-200 font-sans">{charCount}</strong> chars</span>
          <span><strong className="text-slate-200 font-sans">{wordCount}</strong> words</span>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !text.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Post'}</span>
        </button>
      </div>
    </div>
  );
};
