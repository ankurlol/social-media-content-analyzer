import React from 'react';
import { X, FileText, ArrowRight } from 'lucide-react';
import { SAMPLE_POSTS, type SamplePostItem } from '../utils/samplePosts';

interface SampleDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSample: (sample: SamplePostItem) => void;
}

export const SampleDataModal: React.FC<SampleDataModalProps> = ({
  isOpen,
  onClose,
  onSelectSample,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ready-Made Samples</h3>
              <p className="text-xs text-slate-500">
                Select a draft to test text parsing, scoring, and analytics reports.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {SAMPLE_POSTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => {
                onSelectSample(sample);
                onClose();
              }}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/50 border border-slate-200 hover:border-pink-300 cursor-pointer transition-all flex flex-col justify-between group space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                  {sample.title}
                </h4>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200">
                  {sample.category}
                </span>
              </div>

              <p className="text-xs text-slate-600">{sample.description}</p>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-mono line-clamp-2 italic">
                "{sample.text}"
              </div>

              <div className="flex items-center justify-end pt-1">
                <span className="text-xs font-bold text-pink-600 group-hover:text-pink-700 flex items-center gap-1">
                  <span>Load Sample</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
