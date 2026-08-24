import React from 'react';
import { Sparkles, RefreshCw, Clipboard, Trash2, Flame, Briefcase, Zap, HelpCircle } from 'lucide-react';

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

  // Quick Enhancers
  const applyQuickEnhancer = (type: 'viral' | 'pro' | 'punchy' | 'question') => {
    if (!text.trim()) return;
    let modified = text.trim();

    if (type === 'viral') {
      const viralHooks = [
        "Most people get this completely wrong:\n\n",
        "Here is the brutal truth no one talks about:\n\n",
        "Stop making this costly mistake in 2026:\n\n",
      ];
      const hook = viralHooks[Math.floor(Math.random() * viralHooks.length)];
      modified = `${hook}${modified}`;
    } else if (type === 'pro') {
      modified = `Key strategic takeaways from our recent analysis:\n\n${modified}\n\nWhat frameworks are you applying to solve this?`;
    } else if (type === 'punchy') {
      // Shorten sentences to bullet points
      const sentences = modified.split(/(?<=[.!?])\s+/);
      modified = sentences.map(s => `• ${s.trim()}`).join('\n');
    } else if (type === 'question') {
      modified = `${modified}\n\nHave you experienced this in your workflow? Share your thoughts below.`;
    }

    onChange(modified);
  };

  return (
    <div className="flex flex-col h-full glass rounded-3xl border border-white/[0.08] p-5 shadow-2xl space-y-3 relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-sm shadow-indigo-500" />
          <span className="text-xs font-bold text-slate-200 tracking-tight">
            Live Post Draft & Synthesizer
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePaste}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-all"
          >
            <Clipboard className="w-3 h-3 text-slate-400" />
            <span>Paste</span>
          </button>
          {text && (
            <button
              onClick={() => onChange('')}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/20 transition-all"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* One-Click Quick Enhancer Toolbar */}
      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mr-1">
          Quick Magic:
        </span>
        <button
          onClick={() => applyQuickEnhancer('viral')}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-pink-300 transition-all active:scale-95"
          title="Inject viral curiosity hook"
        >
          <Flame className="w-3 h-3 text-pink-400" />
          <span>+ Viral Hook</span>
        </button>

        <button
          onClick={() => applyQuickEnhancer('pro')}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 transition-all active:scale-95"
          title="Make tone executive & strategic"
        >
          <Briefcase className="w-3 h-3 text-indigo-400" />
          <span>+ Executive</span>
        </button>

        <button
          onClick={() => applyQuickEnhancer('punchy')}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-300 transition-all active:scale-95"
          title="Convert to bullet points for scan velocity"
        >
          <Zap className="w-3 h-3 text-cyan-400" />
          <span>+ Bulletize</span>
        </button>

        <button
          onClick={() => applyQuickEnhancer('question')}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 transition-all active:scale-95"
          title="Append conversation driver question"
        >
          <HelpCircle className="w-3 h-3 text-amber-400" />
          <span>+ Discussion CTA</span>
        </button>
      </div>

      {/* Editor Textarea */}
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type or paste your social post draft here, or upload a PDF/Image document above..."
        className="w-full min-h-[145px] flex-1 p-3 text-xs sm:text-sm text-slate-100 bg-black/30 rounded-2xl border border-white/[0.04] focus:border-indigo-500/50 focus:outline-none resize-none placeholder:text-slate-500 leading-relaxed font-sans transition-all"
      />

      {/* Footer Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px] text-slate-400">
        <div className="flex items-center gap-3 font-mono">
          <span><strong className="text-slate-200 font-sans">{charCount}</strong> chars</span>
          <span><strong className="text-slate-200 font-sans">{wordCount}</strong> words</span>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isAnalyzing || !text.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
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
