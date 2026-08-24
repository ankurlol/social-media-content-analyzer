import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Link2,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ArrowRight,
  Globe,
  Sparkles,
} from 'lucide-react';
import { extractTextFromPDF } from '../services/pdfParser';
import { extractTextFromImage } from '../services/ocrService';
import {
  extractPostFromUrl,
  detectPlatformFromUrl,
  SAMPLE_POST_URLS,
  type ExtractedUrlPost,
} from '../services/urlExtractorService';
import type { ExtractedDocument, ProcessingState } from '../types';

interface DocumentUploaderProps {
  onDocumentExtracted: (doc: ExtractedDocument) => void;
  processingState: ProcessingState;
  setProcessingState: React.Dispatch<React.SetStateAction<ProcessingState>>;
  onOpenSampleModal: () => void;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onDocumentExtracted,
  processingState,
  setProcessingState,
}) => {
  const [ingestionMode, setIngestionMode] = useState<'upload' | 'url'>('upload');
  const [postUrl, setPostUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setActiveFile(file);
    const fileType = file.type;
    const isPDF = fileType === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = fileType.startsWith('image/') || /\.(png|jpe?g|webp|bmp)$/i.test(file.name);

    if (!isPDF && !isImage) {
      setProcessingState({
        isProcessing: false,
        stage: 'error',
        progress: 0,
        statusMessage: 'Invalid file format',
        errorMessage: 'Please upload a PDF or an Image file (PNG, JPG, WEBP).',
      });
      return;
    }

    try {
      if (isPDF) {
        setProcessingState({
          isProcessing: true,
          stage: 'parsing_pdf',
          progress: 20,
          statusMessage: 'Parsing PDF layout...',
        });

        const result = await extractTextFromPDF(file, (pct, current, total) => {
          setProcessingState({
            isProcessing: true,
            stage: 'parsing_pdf',
            progress: pct,
            statusMessage: `Extracting page ${current} of ${total}...`,
          });
        });

        if (!result.text || result.text.trim().length === 0) {
          throw new Error('No readable text found in PDF.');
        }

        const extractedDoc: ExtractedDocument = {
          name: file.name,
          type: 'pdf',
          size: file.size,
          text: result.text,
          pageCount: result.pageCount,
        };

        setProcessingState({
          isProcessing: false,
          stage: 'completed',
          progress: 100,
          statusMessage: 'PDF text extracted',
        });

        onDocumentExtracted(extractedDoc);
      } else if (isImage) {
        setProcessingState({
          isProcessing: true,
          stage: 'running_ocr',
          progress: 15,
          statusMessage: 'Running OCR engine...',
        });

        const result = await extractTextFromImage(file, (pct, status) => {
          setProcessingState({
            isProcessing: true,
            stage: 'running_ocr',
            progress: pct,
            statusMessage: status,
          });
        });

        if (!result.text || result.text.trim().length === 0) {
          throw new Error('No readable text detected in image.');
        }

        const extractedDoc: ExtractedDocument = {
          name: file.name,
          type: 'image',
          size: file.size,
          text: result.text,
          confidence: result.confidence,
          previewUrl: URL.createObjectURL(file),
        };

        setProcessingState({
          isProcessing: false,
          stage: 'completed',
          progress: 100,
          statusMessage: `OCR completed (${Math.round(result.confidence)}% accuracy)`,
        });

        onDocumentExtracted(extractedDoc);
      }
    } catch (error) {
      console.error('Extraction error:', error);
      setProcessingState({
        isProcessing: false,
        stage: 'error',
        progress: 0,
        statusMessage: 'Extraction failed',
        errorMessage: error instanceof Error ? error.message : 'Could not extract text.',
      });
    }
  };

  const handleUrlFetch = async (targetUrl: string = postUrl) => {
    if (!targetUrl.trim()) return;

    setProcessingState({
      isProcessing: true,
      stage: 'reading_file',
      progress: 30,
      statusMessage: 'Fetching post from URL...',
    });

    try {
      const extracted = await extractPostFromUrl(targetUrl, (msg) => {
        setProcessingState(prev => ({
          ...prev,
          statusMessage: msg,
          progress: Math.min(90, prev.progress + 20),
        }));
      });

      const extractedDoc: ExtractedDocument = {
        name: extracted.title || targetUrl,
        type: 'text',
        size: extracted.text.length,
        text: extracted.text,
      };

      setProcessingState({
        isProcessing: false,
        stage: 'completed',
        progress: 100,
        statusMessage: `Post extracted from ${extracted.platform.toUpperCase()}`,
      });

      onDocumentExtracted(extractedDoc);
    } catch (err) {
      console.error('URL Extraction failed:', err);
      setProcessingState({
        isProcessing: false,
        stage: 'error',
        progress: 0,
        statusMessage: 'URL Extraction Failed',
        errorMessage: err instanceof Error ? err.message : 'Could not fetch URL content.',
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setProcessingState({
      isProcessing: false,
      stage: 'idle',
      progress: 0,
      statusMessage: '',
    });
  };

  const detectedPlatform = postUrl.trim() ? detectPlatformFromUrl(postUrl) : null;

  return (
    <div className="w-full h-full flex flex-col justify-between glass rounded-3xl border border-white/[0.08] p-5 shadow-2xl space-y-4">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-1.5 p-1 bg-black/40 rounded-xl border border-white/[0.06]">
          <button
            onClick={() => setIngestionMode('upload')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              ingestionMode === 'upload'
                ? 'bg-indigo-600/30 border border-indigo-500/50 text-white shadow-sm'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload File</span>
          </button>

          <button
            onClick={() => setIngestionMode('url')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              ingestionMode === 'url'
                ? 'bg-pink-600/30 border border-pink-500/50 text-white shadow-sm'
                : 'text-slate-400 hover:text-white border border-transparent'
            }`}
          >
            <Link2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Insert Post Link</span>
          </button>
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.06] font-mono">
          PDF / OCR / URL
        </span>
      </div>

      {/* Mode 1: File Upload (PDF / OCR) */}
      {ingestionMode === 'upload' && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => !processingState.isProcessing && fileInputRef.current?.click()}
            className={`group cursor-pointer rounded-2xl border-2 border-dashed transition-all p-5 text-center flex flex-col items-center justify-center min-h-[170px] ${
              isDragOver
                ? 'border-indigo-500 bg-indigo-500/10'
                : 'border-white/[0.08] hover:border-indigo-500/50 bg-black/20 hover:bg-black/40'
            }`}
          >
            {processingState.isProcessing ? (
              <div className="flex flex-col items-center space-y-3 max-w-xs w-full">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                <div className="space-y-1.5 w-full text-center">
                  <p className="text-xs font-semibold text-slate-200">{processingState.statusMessage}</p>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 h-1.5 rounded-full transition-all duration-300 shadow-sm shadow-indigo-500/50"
                      style={{ width: `${processingState.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : activeFile && processingState.stage === 'completed' ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                    {activeFile.name}
                  </span>
                  <button
                    onClick={handleReset}
                    className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-white/[0.08]"
                    title="Remove"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Ready for live analysis</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-105 transition-transform text-indigo-400 shadow-lg shadow-indigo-500/10">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    <span className="text-indigo-400 underline decoration-indigo-400/40">Upload Document</span> or Drag & Drop
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Multi-Page PDF, Screenshots, or Scanned Images
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Mode 2: Insert Post Link (URL) */}
      {ingestionMode === 'url' && (
        <div className="space-y-3.5 flex flex-col justify-between h-full min-h-[170px]">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Paste Social Post URL:</span>
              {detectedPlatform && (
                <span className="text-[10px] px-2 py-0.2 rounded-full font-mono font-bold uppercase bg-pink-500/10 text-pink-400 border border-pink-500/30">
                  {detectedPlatform}
                </span>
              )}
            </label>

            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="url"
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlFetch(postUrl)}
                  placeholder="https://www.linkedin.com/posts/... or twitter.com/..."
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-black/40 border border-white/[0.08] text-xs text-white focus:border-pink-500/60 focus:outline-none font-mono"
                />
                <Globe className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => handleUrlFetch(postUrl)}
                disabled={processingState.isProcessing || !postUrl.trim()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition-all active:scale-95 disabled:opacity-40 flex items-center gap-1.5 shrink-0"
              >
                {processingState.isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
                <span>{processingState.isProcessing ? 'Fetching...' : 'Fetch'}</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Preset URLs */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
              Quick Test URLs:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_POST_URLS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setPostUrl(sample.url);
                    handleUrlFetch(sample.url);
                  }}
                  className="px-2.5 py-1 rounded-xl text-[10px] font-semibold bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-slate-300 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-pink-400" />
                  <span>{sample.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {processingState.stage === 'error' && (
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs text-left">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{processingState.errorMessage || 'Extraction error'}</span>
        </div>
      )}
    </div>
  );
};
