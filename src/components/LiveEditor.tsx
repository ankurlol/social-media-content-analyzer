import React from 'react';
import { Sparkles, Trash2, Clipboard, RefreshCw } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
          <span className="text-xs font-bold text-slate-800">Post Draft / Content Editor</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePaste}
            className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Paste
          </button>
          {text && (
            <button
              onClick={() => onChange('')}
              className="px-2.5 py-1 text-[11px] font-medium rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Editor Textarea */}
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or paste your social post draft here, or upload a PDF/Image on the left..."
        className="w-full min-h-[140px] flex-1 p-2.5 text-xs sm:text-sm text-slate-800 bg-transparent rounded-lg border border-transparent focus:border-slate-200 focus:outline-none resize-none placeholder:text-slate-400 leading-relaxed font-sans"
      />

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-3 font-mono">
          <span><strong className="text-slate-900 font-sans">{charCount}</strong> chars</span>
          <span><strong className="text-slate-900 font-sans">{wordCount}</strong> words</span>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !text.trim()}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 text-white font-bold text-xs shadow-md shadow-pink-500/20 transition-all active:scale-95 disabled:opacity-50"
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
