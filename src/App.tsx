import React, { useEffect, useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { DocumentUploader } from './components/DocumentUploader';
import { LiveEditor } from './components/LiveEditor';
import { OverviewDashboard } from './components/OverviewDashboard';
import { AnalyticsReportCard } from './components/AnalyticsReportCard';
import { PlatformOptimizer } from './components/PlatformOptimizer';
import { DeepDiveMetrics } from './components/DeepDiveMetrics';
import { ImprovementSuggestions } from './components/ImprovementSuggestions';
import { VariantGenerator } from './components/VariantGenerator';
import { ApiKeyModal } from './components/ApiKeyModal';
import { SampleDataModal } from './components/SampleDataModal';
import { analyzeContent } from './services/analyzerService';
import {
  generateAIEnhancements,
  getStoredAISettings,
  saveAISettings,
  type AISettings,
} from './services/aiService';
import type { AnalysisResult, ExtractedDocument, ProcessingState } from './types';
import { SAMPLE_POSTS, type SamplePostItem } from './utils/samplePosts';
import confetti from 'canvas-confetti';
import { PieChart, LayoutGrid, Wand2, Compass, CheckCircle2 } from 'lucide-react';

type ActiveTab = 'analytics' | 'platforms' | 'variants' | 'deepdive' | 'suggestions';

export const App: React.FC = () => {
  const [text, setText] = useState<string>(SAMPLE_POSTS[0].text);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');

  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    stage: 'idle',
    progress: 0,
    statusMessage: '',
  });

  const [aiSettings, setAiSettings] = useState<AISettings>(getStoredAISettings());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);

  const debounceTimerRef = useRef<number | null>(null);

  // Perform content analysis
  const runAnalysis = (contentToAnalyze: string = text) => {
    if (!contentToAnalyze.trim()) {
      setAnalysisResult(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = analyzeContent(contentToAnalyze);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initial analysis on load
  useEffect(() => {
    runAnalysis(SAMPLE_POSTS[0].text);
  }, []);

  // Handle text changes with automatic debounced live analysis
  const handleTextChange = (newText: string) => {
    setText(newText);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      runAnalysis(newText);
    }, 350);
  };

  // Handle document extraction (from PDF or OCR)
  const handleDocumentExtracted = (doc: ExtractedDocument) => {
    setText(doc.text);
    runAnalysis(doc.text);
  };

  // Handle sample selection
  const handleSelectSample = (sample: SamplePostItem) => {
    setText(sample.text);
    runAnalysis(sample.text);
  };

  // Handle AI Key Save
  const handleSaveAISettings = (newSettings: AISettings) => {
    setAiSettings(newSettings);
    saveAISettings(newSettings);
  };

  // Trigger AI variant generation
  const handleGenerateWithAI = async () => {
    if (!aiSettings.apiKey || !text.trim()) return;

    setIsGeneratingAI(true);
    try {
      const aiResult = await generateAIEnhancements(text, aiSettings);
      if (aiResult.variants && analysisResult) {
        setAnalysisResult({
          ...analysisResult,
          variants: aiResult.variants,
        });
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate AI variants');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-slate-800 flex flex-col font-sans selection:bg-pink-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        hasApiKey={!!aiSettings.apiKey}
        analysisResult={analysisResult}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Social Media Content Analyzer
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Extract text from documents/scans, analyze viral factors, and view projected engagement reports.
            </p>
          </div>
        </div>

        {/* Input Split Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <DocumentUploader
              onDocumentExtracted={handleDocumentExtracted}
              processingState={processingState}
              setProcessingState={setProcessingState}
              onOpenSampleModal={() => setIsSampleModalOpen(true)}
            />
          </div>

          <div className="md:col-span-7">
            <LiveEditor
              text={text}
              onChange={handleTextChange}
              onAnalyze={() => runAnalysis(text)}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>

        {/* Results Area */}
        {analysisResult && (
          <div className="space-y-4 pt-1">
            {/* Top Score Summary Strip */}
            <OverviewDashboard result={analysisResult} />

            {/* Clean Tab Navigation */}
            <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <PieChart className="w-3.5 h-3.5 text-pink-400" />
                <span>Analytics Report</span>
              </button>

              <button
                onClick={() => setActiveTab('platforms')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'platforms'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-sky-400" />
                <span>Platform Previews</span>
              </button>

              <button
                onClick={() => setActiveTab('variants')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'variants'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                <span>A/B Rewrite Variants</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                  4
                </span>
              </button>

              <button
                onClick={() => setActiveTab('deepdive')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'deepdive'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Deep Metrics (Hook & CTA)</span>
              </button>

              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'suggestions'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Action Checklist</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
                  {analysisResult.suggestions.length}
                </span>
              </button>
            </div>

            {/* Active Tab Panel */}
            <div className="pt-1 animate-fadeIn">
              {activeTab === 'analytics' && (
                <AnalyticsReportCard analytics={analysisResult.analytics} />
              )}

              {activeTab === 'platforms' && (
                <PlatformOptimizer
                  platformScores={analysisResult.platformScores}
                  postText={text}
                />
              )}

              {activeTab === 'variants' && (
                <VariantGenerator
                  variants={analysisResult.variants}
                  onSelectVariant={(variantContent) => {
                    setText(variantContent);
                    runAnalysis(variantContent);
                  }}
                  onGenerateWithAI={handleGenerateWithAI}
                  isGeneratingAI={isGeneratingAI}
                  hasApiKey={!!aiSettings.apiKey}
                  onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
                />
              )}

              {activeTab === 'deepdive' && (
                <DeepDiveMetrics result={analysisResult} />
              )}

              {activeTab === 'suggestions' && (
                <ImprovementSuggestions
                  suggestions={analysisResult.suggestions}
                  onApplyExample={(ex) => handleTextChange(`${text}\n\n${ex}`)}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        settings={aiSettings}
        onSave={handleSaveAISettings}
      />

      <SampleDataModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectSample={handleSelectSample}
      />
    </div>
  );
};

export default App;
