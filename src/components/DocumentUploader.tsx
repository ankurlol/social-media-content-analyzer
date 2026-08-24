import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { extractTextFromPDF } from '../services/pdfParser';
import { extractTextFromImage } from '../services/ocrService';
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

  return (
    <div className="w-full h-full flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
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
        className={`group cursor-pointer rounded-xl border-2 border-dashed transition-all p-5 text-center flex flex-col items-center justify-center min-h-[170px] ${
          isDragOver
            ? 'border-pink-500 bg-pink-50/40'
            : 'border-slate-200 hover:border-pink-300 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        {processingState.isProcessing ? (
          <div className="flex flex-col items-center space-y-3 max-w-xs w-full">
            <Loader2 className="w-6 h-6 text-pink-600 animate-spin" />
            <div className="space-y-1 w-full text-center">
              <p className="text-xs font-semibold text-slate-800">{processingState.statusMessage}</p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-pink-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${processingState.progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : activeFile && processingState.stage === 'completed' ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800 truncate max-w-[200px]">
                {activeFile.name}
              </span>
              <button
                onClick={handleReset}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Ready for analysis</span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center group-hover:scale-105 transition-transform text-pink-600">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">
                <span className="text-pink-600 underline decoration-pink-300">Upload Document</span> or Drag & Drop
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                PDFs, Screenshots, or Scanned Images
              </p>
            </div>
          </div>
        )}

        {processingState.stage === 'error' && (
          <div className="mt-3 p-2 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-rose-700 text-xs text-left">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>{processingState.errorMessage || 'Extraction error'}</span>
          </div>
        )}
      </div>
    </div>
  );
};
