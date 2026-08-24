export type SupportedPlatform = 'linkedin' | 'twitter' | 'instagram' | 'facebook';

export type ToneType =
  | 'Inspirational'
  | 'Thought Leadership'
  | 'Educational'
  | 'Conversational'
  | 'Promotional'
  | 'Urgent'
  | 'Humorous'
  | 'Neutral';

export type SentimentType = 'Positive' | 'Neutral' | 'Negative';

// Emotion categories for word-level heatmap
export type EmotionCategory =
  | 'neutral'
  | 'analytical'
  | 'curious'
  | 'excited'
  | 'authoritative'
  | 'positive'
  | 'negative'
  | 'urgent';

export interface EmotionWord {
  word: string;
  emotion: EmotionCategory;
  intensity: number; // 0 - 1
  isSpaceAfter: boolean;
}

// Style DNA - 6-axis writing fingerprint
export interface StyleDNAProfile {
  formality: number;      // 0-100: casual vs formal language
  emotion: number;        // 0-100: emotional intensity
  brevity: number;        // 0-100: short punchy vs long elaborate
  authority: number;      // 0-100: confident/expert tone
  curiosity: number;      // 0-100: question-heavy / exploratory
  storytelling: number;   // 0-100: narrative / anecdote-driven
}

// Word Cloud word with engagement weight
export interface WordCloudWord {
  word: string;
  frequency: number;
  engagementWeight: number; // 0-100
  category: 'hook' | 'topic' | 'action' | 'emotion' | 'generic';
}

// Open-Source NLP: Named Entity Recognition (NER)
export interface EntityTag {
  text: string;
  category: 'person' | 'organization' | 'place' | 'date' | 'value' | 'acronym';
}

// Open-Source NLP: Part-of-Speech (POS) Distribution
export interface POSBreakdown {
  nouns: number;
  verbs: number;
  adjectives: number;
  adverbs: number;
  totalTokens: number;
}

// Open-Source NLP: Syntax & Grammar Voice Analysis
export interface SyntaxAnalysis {
  activeSentences: number;
  passiveSentences: number;
  passiveExamples: string[];
  clauseComplexity: 'Concise' | 'Balanced' | 'Complex';
  presentTensePct: number;
  pastTensePct: number;
}

// Open-Source NLP: AFINN-165 Sentiment Details
export interface SentimentDetails {
  comparative: number;
  score: number;
  positiveWords: string[];
  negativeWords: string[];
}

export interface ReadabilityMetrics {
  fleschScore: number;
  gradeLevel: string;
  readingTimeSeconds: number;
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  avgWordsPerSentence: number;
  paragraphCount: number;
}

export interface HookAnalysis {
  hookText: string;
  score: number; // 0 - 100
  type: 'Question' | 'Statistic/Fact' | 'Bold Statement' | 'Story/Anecdote' | 'Generic/Weak';
  critique: string;
  suggestedAlternative: string;
}

export interface PlatformScore {
  platform: SupportedPlatform;
  score: number; // 0 - 100
  characterCount: number;
  characterLimit: number;
  status: 'optimal' | 'warning' | 'too-long' | 'too-short';
  specificTips: string[];
  hashtagRecommendation: {
    suggestedCount: string;
    currentCount: number;
  };
}

export interface ImprovementSuggestion {
  id: string;
  category: 'hook' | 'readability' | 'cta' | 'hashtags' | 'formatting' | 'engagement';
  impact: 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  actionableExample?: string;
}

export interface ContentVariant {
  id: string;
  title: string;
  description: string;
  style: 'viral-punchy' | 'thought-leadership' | 'scannable-bullets' | 'discussion-driver';
  content: string;
  estimatedEngagementBoost: string;
}

export interface ProjectedAnalytics {
  totalReach: number;
  engagementRate: number; // e.g. 4.2
  reactions: number;
  comments: number;
  shares: number;
  postSaves: number;
  pageLikes: number;
  countryBreakdown: { country: string; reach: number; percentage: number; color: string }[];
  pieSegments: { label: string; value: number; color: string; percentage: number }[];
}

export interface AnalysisResult {
  rawText: string;
  overallScore: number; // 0 - 100
  scoreBreakdown: {
    hook: number;
    clarity: number;
    cta: number;
    emotionalResonance: number;
    formatting: number;
  };
  tone: {
    primary: ToneType;
    secondary?: ToneType;
    confidence: number;
  };
  sentiment: {
    type: SentimentType;
    score: number; // -1 to 1
  };
  readability: ReadabilityMetrics;
  hookAnalysis: HookAnalysis;
  hashtags: {
    extracted: string[];
    suggested: string[];
    analysis: string;
  };
  callToAction: {
    detected: boolean;
    ctaText?: string;
    strength: 'Strong' | 'Moderate' | 'Weak' | 'None';
    suggestions: string[];
  };
  platformScores: Record<SupportedPlatform, PlatformScore>;
  suggestions: ImprovementSuggestion[];
  variants: ContentVariant[];
  analytics: ProjectedAnalytics;
  // Differentiating & Open Source NLP features
  emotionMap: EmotionWord[];
  styleDNA: StyleDNAProfile;
  wordCloud: WordCloudWord[];
  entities: EntityTag[];
  posBreakdown: POSBreakdown;
  syntax: SyntaxAnalysis;
  sentimentDetails: SentimentDetails;
  analyzedAt: string;
}

export interface ExtractedDocument {
  name: string;
  type: 'pdf' | 'image' | 'text';
  size: number;
  text: string;
  pageCount?: number;
  confidence?: number;
  previewUrl?: string;
}

export interface ProcessingState {
  isProcessing: boolean;
  stage: 'idle' | 'reading_file' | 'parsing_pdf' | 'running_ocr' | 'analyzing_nlp' | 'generating_variants' | 'completed' | 'error';
  progress: number; // 0 to 100
  statusMessage: string;
  errorMessage?: string;
}
