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
import { EmotionHeatmap } from './components/EmotionHeatmap';
import { StyleDNA } from './components/StyleDNA';
import { GoldenHourScheduler } from './components/GoldenHourScheduler';
import { ViralWordCloud } from './components/ViralWordCloud';
import { NLPEntityInspector } from './components/NLPEntityInspector';
import { Dynamic3DHeroCard } from './components/Dynamic3DHeroCard';
import { ApiKeyModal } from './components/ApiKeyModal';
import { SampleDataModal } from './components/SampleDataModal';
import { AuthModal } from './components/AuthModal';
import { analyzeContentFull } from './services/analyzerService';
import {
  generateAIEnhancements,
  getStoredAISettings,
  saveAISettings,
  type AISettings,
} from './services/aiService';
import {
  getStoredUser,
  signOutUser,
  type UserAccount,
} from './services/authService';
import type { AnalysisResult, ExtractedDocument, ProcessingState } from './types';
import { SAMPLE_POSTS, type SamplePostItem } from './utils/samplePosts';
import confetti from 'canvas-confetti';
import {
  PieChart,
  LayoutGrid,
  Wand2,
  Compass,
  CheckCircle2,
  Flame,
  Activity,
  Calendar,
  Sparkles,
  Cpu,
  BarChart2,
  Zap,
  Globe2,
} from 'lucide-react';

type ActiveCategory = 'performance' | 'linguistics' | 'growth';

type ActiveTab =
  | 'analytics'
  | '3d-topology'
  | 'platforms'
  | 'deepdive'
  | 'linguistics'
  | 'emotion'
  | 'dna'
  | 'variants'
  | 'schedule'
  | 'wordcloud'
  | 'suggestions';

export const App: React.FC = () => {
  const [text, setText] = useState<string>(SAMPLE_POSTS[0].text);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false);
  
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>('performance');
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');

  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    stage: 'idle',
    progress: 0,
    statusMessage: '',
  });

  const [aiSettings, setAiSettings] = useState<AISettings>(getStoredAISettings());
  const [user, setUser] = useState<UserAccount | null>(getStoredUser());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const debounceTimerRef = useRef<number | null>(null);

  // Perform full content analysis
  const runAnalysis = (contentToAnalyze: string = text) => {
    if (!contentToAnalyze.trim()) {
      setAnalysisResult(null);
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = analyzeContentFull(contentToAnalyze);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Initial analysis on mount
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
    }, 300);
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

  const handleSignOut = () => {
    signOutUser();
    setUser(null);
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
          colors: ['#6366f1', '#ec4899', '#22d3ee'],
        });
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate AI variants');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  interface CategoryTabItem {
    id: ActiveTab;
    label: string;
    icon: React.ElementType;
    color: string;
    badge?: string | number;
  }

  interface CategoryHubItem {
    id: ActiveCategory;
    label: string;
    icon: React.ElementType;
    tabs: CategoryTabItem[];
  }

  const CATEGORIES: CategoryHubItem[] = [
    {
      id: 'performance',
      label: 'Performance & Analytics',
      icon: BarChart2,
      tabs: [
        { id: 'analytics', label: 'Sprout / Metricool Analytics', icon: PieChart, color: 'text-indigo-400' },
        { id: '3d-topology', label: '3D Audience Lattice', icon: Globe2, color: 'text-cyan-400', badge: 'Three.js 3D' },
        { id: 'platforms', label: 'Feed Simulator', icon: LayoutGrid, color: 'text-sky-400' },
        { id: 'deepdive', label: 'Hook & CTA Metrics', icon: Compass, color: 'text-teal-400' },
      ],
    },
    {
      id: 'linguistics',
      label: 'Computational Linguistics',
      icon: Cpu,
      tabs: [
        { id: 'linguistics', label: 'NER & Syntax Inspector', icon: Cpu, color: 'text-cyan-400', badge: 'Compromise' },
        { id: 'emotion', label: 'Emotion Heatmap', icon: Flame, color: 'text-pink-400', badge: 'Unique' },
        { id: 'dna', label: 'Style DNA Radar', icon: Activity, color: 'text-purple-400', badge: 'Unique' },
      ],
    },
    {
      id: 'growth',
      label: 'Growth & Optimization',
      icon: Zap,
      tabs: [
        { id: 'variants', label: 'A/B Rewrite Formulas', icon: Wand2, color: 'text-rose-400', badge: 4 },
        { id: 'schedule', label: 'Golden Hour Grid', icon: Calendar, color: 'text-cyan-400', badge: 'Unique' },
        { id: 'wordcloud', label: 'Viral Word Cloud', icon: Sparkles, color: 'text-amber-400', badge: 'Unique' },
        { id: 'suggestions', label: 'Action Checklist', icon: CheckCircle2, color: 'text-emerald-400', badge: analysisResult?.suggestions.length },
      ],
    },
  ];

  const currentCategoryObj = CATEGORIES.find(c => c.id === activeCategory)!;

  const handleCategorySelect = (catId: ActiveCategory) => {
    setActiveCategory(catId);
    const cat = CATEGORIES.find(c => c.id === catId)!;
    setActiveTab(cat.tabs[0].id);
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 flex flex-col font-sans selection:bg-pink-500 selection:text-white relative">
      {/* Dynamic ambient background glow orbs */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-40 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 left-1/3 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <Navbar
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenSampleModal={() => setIsSampleModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        hasApiKey={!!aiSettings.apiKey}
        analysisResult={analysisResult}
        user={user}
        onSignOut={handleSignOut}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 relative z-10">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Social Media Content Intelligence Suite
              </h1>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-300 shadow-sm">
                3D WEBGL PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Three.js 3D audience lattices, open-source Compromise NLP & Metricool time-series intelligence.
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
          <div className="space-y-5 pt-1">
            {/* Top Score Summary Strip */}
            <OverviewDashboard result={analysisResult} />

            {/* Categorized Hub Navigation Controller */}
            <div className="space-y-3">
              {/* Category Segmented Pill Bar */}
              <div className="flex items-center gap-2 p-1.5 bg-black/50 border border-white/[0.08] rounded-2xl w-fit">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isCatActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isCatActive
                          ? 'bg-gradient-to-r from-indigo-600/30 to-pink-600/30 border border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-Tabs Row for the Selected Category */}
              <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-2 overflow-x-auto scrollbar-thin">
                {currentCategoryObj.tabs.map((t) => {
                  const Icon = t.icon;
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap border ${
                        isActive
                          ? 'bg-white/[0.08] text-white border-white/[0.15] shadow-md'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border-transparent'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${t.color}`} />
                      <span>{t.label}</span>
                      {t.badge !== undefined && (
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                            t.badge === 'Three.js 3D'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                              : t.badge === 'Compromise'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                              : t.badge === 'Unique'
                              ? 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white'
                              : 'bg-white/[0.1] text-slate-300'
                          }`}
                        >
                          {t.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Tab Panel */}
            <div className="pt-1 animate-fadeIn">
              {activeTab === 'analytics' && (
                <AnalyticsReportCard analytics={analysisResult.analytics} />
              )}

              {activeTab === '3d-topology' && (
                <Dynamic3DHeroCard
                  totalReach={analysisResult.analytics.totalReach}
                  engagementScore={analysisResult.overallScore}
                />
              )}

              {activeTab === 'platforms' && (
                <PlatformOptimizer
                  platformScores={analysisResult.platformScores}
                  postText={text}
                />
              )}

              {activeTab === 'deepdive' && (
                <DeepDiveMetrics result={analysisResult} />
              )}

              {activeTab === 'linguistics' && (
                <div className="glass rounded-3xl border border-white/[0.08] p-6 shadow-2xl">
                  <NLPEntityInspector
                    entities={analysisResult.entities}
                    posBreakdown={analysisResult.posBreakdown}
                    syntax={analysisResult.syntax}
                    sentimentDetails={analysisResult.sentimentDetails}
                    rawText={text}
                  />
                </div>
              )}

              {activeTab === 'emotion' && (
                <div className="glass rounded-3xl border border-white/[0.08] p-6 shadow-2xl">
                  <EmotionHeatmap emotionMap={analysisResult.emotionMap} text={text} />
                </div>
              )}

              {activeTab === 'dna' && (
                <div className="glass rounded-3xl border border-white/[0.08] p-6 shadow-2xl">
                  <StyleDNA profile={analysisResult.styleDNA} />
                </div>
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

              {activeTab === 'schedule' && (
                <div className="glass rounded-3xl border border-white/[0.08] p-6 shadow-2xl">
                  <GoldenHourScheduler />
                </div>
              )}

              {activeTab === 'wordcloud' && (
                <div className="glass rounded-3xl border border-white/[0.08] p-6 shadow-2xl">
                  <ViralWordCloud words={analysisResult.wordCloud} />
                </div>
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />
    </div>
  );
};

export default App;
