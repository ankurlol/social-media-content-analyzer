import React, { useState } from 'react';
import { X, Key, ShieldCheck, ExternalLink } from 'lucide-react';
import type { AISettings } from '../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'none'>(
    settings.provider || 'gemini'
  );
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [model, setModel] = useState(settings.model || '');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      provider: apiKey.trim() ? provider : 'none',
      apiKey: apiKey.trim(),
      model: model.trim() || undefined,
    });
    onClose();
  };

  const handleRemove = () => {
    setApiKey('');
    onSave({
      provider: 'none',
      apiKey: '',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">AI Integration</h3>
              <p className="text-xs text-slate-400">
                Connect your free-tier API key for bespoke AI rewrites.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Select Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  provider === 'gemini'
                    ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300 font-bold'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05]'
                }`}
              >
                <div className="text-xs font-bold">Google Gemini</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Free tier available</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  provider === 'openai'
                    ? 'bg-pink-500/15 border-pink-500/50 text-pink-300 font-bold'
                    : 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:bg-white/[0.05]'
                }`}
              >
                <div className="text-xs font-bold">OpenAI</div>
                <div className="text-[10px] text-slate-500 mt-0.5">GPT-4o mini</div>
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300">
                API Key
              </label>
              {provider === 'gemini' ? (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Get Free Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-pink-400 hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Get OpenAI Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/[0.1] text-sm text-white focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-start gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Your API key is stored strictly in your local browser session and never sent to any external proxy.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
            {settings.apiKey && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors mr-auto"
              >
                Disconnect
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-lg shadow-indigo-500/20 transition-all"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
