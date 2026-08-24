import type {
  AnalysisResult,
  ContentVariant,
  HookAnalysis,
  ImprovementSuggestion,
  PlatformScore,
  ProjectedAnalytics,
  ReadabilityMetrics,
  SentimentType,
  SupportedPlatform,
  ToneType,
} from '../types';

// Common English Stopwords for accurate keyword extraction
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t', 'as', 'at',
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can\'t', 'cannot', 'could',
  'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for',
  'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll',
  'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d',
  'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me',
  'more', 'most', 'mustn\'t', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re', 'they\'ve', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll',
  'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
  'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t', 'you', 'you\'d',
  'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves', 'just', 'like', 'get', 'also', 'one',
  'make', 'way', 'even', 'new', 'want', 'know', 'see', 'use', 'post', 'check', 'thanks', 'guys'
]);

const INSPIRATIONAL_WORDS = [
  'transform', 'breakthrough', 'journey', 'growth', 'mastery', 'believe', 'vision',
  'achieve', 'overcome', 'inspire', 'passion', 'empower', 'dream', 'unleash', 'courage',
  'mindset', 'unstoppable', 'potential', 'leadership', 'triumph', 'greatness'
];

const THOUGHT_LEADERSHIP_WORDS = [
  'framework', 'strategy', 'paradigm', 'perspective', 'lessons', 'industry', 'insights',
  'future', 'fundamental', 'principle', 'architecture', 'efficiency', 'scale', 'playbook',
  'methodology', 'execution', 'velocity', 'leverage', 'system'
];

const PROMOTIONAL_WORDS = [
  'discount', 'launch', 'deal', 'offer', 'exclusive', 'free', 'buy', 'order',
  'limited', 'bonus', 'save', 'special', 'join now', 'coupon', 'sale', 'pricing',
  'early-bird', 'available now', 'pre-order', 'register'
];

const URGENCY_WORDS = [
  'now', 'today', 'hurry', 'deadline', 'running out', 'last chance', 'instant',
  'don\'t miss', 'ending soon', 'fast', 'quick', 'immediately', 'critical', 'urgent'
];

const CTA_PATTERNS = [
  /(?:comment|drop|share)\s+(?:below|your|down|a|an)/i,
  /(?:link in|link is in)\s+(?:bio|comments|first comment)/i,
  /(?:what do you think|let me know|agree\?|your thoughts\?|how do you)/i,
  /(?:dm|message)\s+(?:me|us)/i,
  /(?:click|visit|check out|register|sign up|grab|download|try it)/i,
  /(?:follow|save this|repost|retweet)/i,
];

/**
 * Extracts top distinctive keywords from raw text
 */
function extractTopKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w));

  const frequency: Record<string, number> = {};
  words.forEach(w => {
    frequency[w] = (frequency[w] || 0) + 1;
  });

  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0]);

  return sorted.slice(0, 8);
}

/**
 * Converts a string into a PascalCase hashtag
 */
function toPascalHashtag(str: string): string {
  return '#' + str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Calculates Flesch Reading Ease score
 */
function calculateFleschScore(totalWords: number, totalSentences: number, totalSyllables: number): number {
  if (totalWords === 0 || totalSentences === 0) return 60;
  const score = 206.835 - (1.015 * (totalWords / totalSentences)) - (84.6 * (totalSyllables / totalWords));
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Approximates syllable count
 */
function countSyllables(word: string): number {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  if (cleanWord.length <= 3) return 1;
  const match = cleanWord.replace(/(?:[^laeiouy]|ed|es|e)$/, '').match(/[aeiouy]{1,2}/g);
  return match ? match.length : 1;
}

/**
 * Calculates readability metrics
 */
function computeReadability(text: string): ReadabilityMetrics {
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const characterCount = text.length;

  const sentences = text
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  const sentenceCount = Math.max(1, sentences.length);

  const paragraphs = text
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  const paragraphCount = Math.max(1, paragraphs.length);

  let totalSyllables = 0;
  for (const word of words) {
    totalSyllables += countSyllables(word);
  }

  const fleschScore = calculateFleschScore(wordCount, sentenceCount, totalSyllables);
  
  let gradeLevel = 'Grade 7-8 (Conversational)';
  if (fleschScore >= 80) gradeLevel = 'Grade 5-6 (Very Easy)';
  else if (fleschScore >= 60) gradeLevel = 'Grade 7-8 (Standard Social)';
  else if (fleschScore >= 50) gradeLevel = 'Grade 9-10 (Fairly Complex)';
  else if (fleschScore >= 30) gradeLevel = 'College Level (Dense)';
  else gradeLevel = 'Academic / Graduate';

  const readingTimeSeconds = Math.max(1, Math.round((wordCount / 200) * 60));
  const avgWordsPerSentence = Math.round((wordCount / sentenceCount) * 10) / 10;

  return {
    fleschScore,
    gradeLevel,
    readingTimeSeconds,
    wordCount,
    characterCount,
    sentenceCount,
    avgWordsPerSentence,
    paragraphCount,
  };
}

/**
 * Evaluates the hook / opening line with personalized suggestions
 */
function analyzeHook(text: string, keywords: string[]): HookAnalysis {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const firstLine = lines[0] || '';
  const topTopic = keywords[0] ? keywords[0].toUpperCase() : 'THIS';

  let hookType: HookAnalysis['type'] = 'Generic/Weak';
  let score = 45;
  let critique = 'The opening line starts passively without creating intrigue or scroll-stopping tension.';
  let suggestedAlternative = `90% of people get ${topTopic} wrong. Here is what actually works:`;

  if (firstLine.includes('?') || /^(why|how|what|are you|is it|who|have you)/i.test(firstLine)) {
    hookType = 'Question';
    score = 82;
    critique = 'Curiosity-driven hook. Open questions engage the subconscious and compel readers to seek the answer.';
    suggestedAlternative = `Ever wondered why most approaches to ${topTopic} fail? Here is the single reason:`;
  } else if (/\b\d+[%kM$]?\b/.test(firstLine) || /statistic|proven|study|research|survey|percent/i.test(firstLine)) {
    hookType = 'Statistic/Fact';
    score = 92;
    critique = 'High-credibility statistical hook. Specific numbers and concrete metrics immediately establish authority.';
    suggestedAlternative = `In 2026, 84% of top performers focus on this one ${topTopic} metric:`;
  } else if (/^(stop|never|always|the secret|the biggest|unpopular opinion|warning|nobody talks about|hard truth)/i.test(firstLine)) {
    hookType = 'Bold Statement';
    score = 94;
    critique = 'Bold, counter-intuitive hook. Provocative claims halt fast scrolling and drive spirited discussion.';
    suggestedAlternative = `Unpopular opinion: Traditional advice about ${topTopic} is completely broken.`;
  } else if (/^(when I|3 years ago|last week|I failed|I learned|in 202|it started with|after \d+)/i.test(firstLine)) {
    hookType = 'Story/Anecdote';
    score = 88;
    critique = 'Storytelling narrative hook. Personal vulnerability and transformation build high dwell time.';
    suggestedAlternative = `When I first started dealing with ${topTopic}, I made a huge mistake. Here is what happened:`;
  }

  if (firstLine.length > 110) {
    score = Math.max(30, score - 15);
    critique += ' (Caution: Opening line is too long. Keep it under 80 characters so it fits before the "See More" cut-off).';
  }

  return {
    hookText: firstLine || '(Empty line)',
    score,
    type: hookType,
    critique,
    suggestedAlternative,
  };
}

/**
 * Detects tone and sentiment
 */
function analyzeToneAndSentiment(text: string): {
  tone: { primary: ToneType; secondary?: ToneType; confidence: number };
  sentiment: { type: SentimentType; score: number };
} {
  const lower = text.toLowerCase();
  
  let inspirationalScore = 0;
  let thoughtLeadershipScore = 0;
  let promotionalScore = 0;
  let urgencyScore = 0;

  INSPIRATIONAL_WORDS.forEach(w => { if (lower.includes(w)) inspirationalScore += 1; });
  THOUGHT_LEADERSHIP_WORDS.forEach(w => { if (lower.includes(w)) thoughtLeadershipScore += 1; });
  PROMOTIONAL_WORDS.forEach(w => { if (lower.includes(w)) promotionalScore += 1; });
  URGENCY_WORDS.forEach(w => { if (lower.includes(w)) urgencyScore += 1; });

  const toneScores: { tone: ToneType; score: number }[] = [
    { tone: 'Inspirational', score: inspirationalScore },
    { tone: 'Thought Leadership', score: thoughtLeadershipScore },
    { tone: 'Promotional', score: promotionalScore },
    { tone: 'Urgent', score: urgencyScore },
  ];

  toneScores.sort((a, b) => b.score - a.score);

  let primary: ToneType = 'Conversational';
  let secondary: ToneType | undefined;
  let confidence = 70;

  if (toneScores[0].score > 0) {
    primary = toneScores[0].tone;
    confidence = Math.min(95, 65 + toneScores[0].score * 8);
    if (toneScores[1].score > 0) {
      secondary = toneScores[1].tone;
    }
  } else if (text.includes('?') || text.includes('!')) {
    primary = 'Conversational';
  } else {
    primary = 'Educational';
  }

  const posWords = ['great', 'best', 'awesome', 'win', 'success', 'growth', 'love', 'valuable', 'super', 'effective', 'excited', 'empower', 'benefit', 'opportunity', 'solution'];
  const negWords = ['fail', 'bad', 'loss', 'mistake', 'poor', 'hate', 'terrible', 'struggle', 'difficult', 'pain', 'risk', 'problem', 'burnout', 'crisis', 'waste'];
  
  let posCount = 0;
  let negCount = 0;
  posWords.forEach(w => { if (lower.includes(w)) posCount++; });
  negWords.forEach(w => { if (lower.includes(w)) negCount++; });

  let sentimentType: SentimentType = 'Neutral';
  let sentimentScore = 0;

  if (posCount > negCount) {
    sentimentType = 'Positive';
    sentimentScore = Math.min(1, 0.3 + (posCount - negCount) * 0.15);
  } else if (negCount > posCount) {
    sentimentType = 'Negative';
    sentimentScore = Math.max(-1, -0.3 - (negCount - posCount) * 0.15);
  }

  return {
    tone: { primary, secondary, confidence },
    sentiment: { type: sentimentType, score: sentimentScore },
  };
}

/**
 * Extracts and recommends dynamic hashtags based on actual text keywords
 */
function analyzeHashtags(text: string, keywords: string[]): { extracted: string[]; suggested: string[]; analysis: string } {
  const extractedMatches = text.match(/#[a-zA-Z0-9_]+/g) || [];
  const extracted = Array.from(new Set(extractedMatches.map(h => h.trim())));

  const dynamicTags = new Set<string>();

  keywords.forEach(kw => {
    if (kw.length >= 3) {
      dynamicTags.add(toPascalHashtag(kw));
    }
  });

  const lower = text.toLowerCase();
  if (lower.includes('tech') || lower.includes('software') || lower.includes('code') || lower.includes('dev')) {
    ['#TechTrends', '#SoftwareEngineering', '#Innovation'].forEach(t => dynamicTags.add(t));
  }
  if (lower.includes('ai') || lower.includes('model') || lower.includes('data') || lower.includes('machine')) {
    ['#ArtificialIntelligence', '#MachineLearning', '#FutureOfWork'].forEach(t => dynamicTags.add(t));
  }
  if (lower.includes('lead') || lower.includes('team') || lower.includes('manage') || lower.includes('hire')) {
    ['#Leadership', '#Management', '#CompanyCulture'].forEach(t => dynamicTags.add(t));
  }
  if (lower.includes('market') || lower.includes('brand') || lower.includes('sale') || lower.includes('customer')) {
    ['#MarketingStrategy', '#BrandGrowth', '#CustomerSuccess'].forEach(t => dynamicTags.add(t));
  }
  if (lower.includes('product') || lower.includes('feature') || lower.includes('launch') || lower.includes('app')) {
    ['#ProductManagement', '#ProductLaunch', '#UserExperience'].forEach(t => dynamicTags.add(t));
  }

  if (dynamicTags.size < 4) {
    ['#GrowthStrategy', '#SocialMediaTips', '#Insights'].forEach(t => dynamicTags.add(t));
  }

  const suggested = Array.from(dynamicTags)
    .filter(t => !extracted.map(e => e.toLowerCase()).includes(t.toLowerCase()))
    .slice(0, 8);

  let analysis = '';
  if (extracted.length === 0) {
    analysis = 'No hashtags detected in your draft. Adding 3-5 specific hashtags can increase organic discovery by 30-40%.';
  } else if (extracted.length > 8) {
    analysis = `Detected ${extracted.length} hashtags. Excessive hashtags clutter feed appearance and trigger spam filters on LinkedIn and X.`;
  } else {
    analysis = `Well-balanced hashtag density (${extracted.length} tags detected).`;
  }

  return { extracted, suggested, analysis };
}

/**
 * Evaluates Call to Action
 */
function analyzeCTA(text: string, keywords: string[]): AnalysisResult['callToAction'] {
  let detected = false;
  let ctaText: string | undefined;

  for (const pattern of CTA_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      detected = true;
      ctaText = match[0];
      break;
    }
  }

  const strength = detected ? (text.length > 150 && text.includes('?') ? 'Strong' : 'Moderate') : 'None';
  const topic = keywords[0] ? `about ${keywords[0]}` : '';

  const suggestions = [
    `Ask an open question ${topic}: "What has been your biggest win or obstacle with this?"`,
    'Prompt readers to bookmark: "Save this post for your next project or campaign."',
    'Drive distribution: "Repost this to share the insight with your network."',
  ];

  return {
    detected,
    ctaText,
    strength,
    suggestions,
  };
}

/**
 * Generates platform-specific score audits
 */
function evaluatePlatforms(text: string, hashtagCount: number): Record<SupportedPlatform, PlatformScore> {
  const len = text.length;

  // LinkedIn: 800 - 1500 chars optimal, 3-5 tags
  let liScore = 75;
  const liTips: string[] = [];
  let liStatus: PlatformScore['status'] = 'optimal';

  if (len < 250) {
    liScore -= 20;
    liStatus = 'too-short';
    liTips.push(`Length is ${len} chars. LinkedIn rewards deeper storytelling with 800-1,500 characters for high dwell time.`);
  } else if (len > 3000) {
    liScore -= 25;
    liStatus = 'too-long';
    liTips.push(`Length (${len} chars) is very long. Consider converting into a multi-slide PDF Carousel or Article.`);
  } else {
    liScore += 15;
    liTips.push(`Great post length (${len} chars) for LinkedIn feed retention.`);
  }

  if (hashtagCount >= 3 && hashtagCount <= 5) {
    liScore += 10;
  } else {
    liTips.push(`Currently has ${hashtagCount} hashtags. Aim for exactly 3-5 focused hashtags placed at the very end.`);
  }

  if (text.includes('\n\n')) {
    liScore += 5;
  } else {
    liTips.push('Add blank line breaks between sentences to optimize readability for mobile LinkedIn apps.');
  }

  // Twitter/X: 280 chars max (or thread), 1-2 tags
  let twScore = 80;
  const twTips: string[] = [];
  let twStatus: PlatformScore['status'] = 'optimal';

  if (len > 280) {
    twScore -= 35;
    twStatus = 'too-long';
    twTips.push(`Post length (${len} chars) exceeds the 280-character single tweet limit. Split into a Thread or trim down.`);
  } else if (len < 50) {
    twScore -= 15;
    twStatus = 'too-short';
    twTips.push('Very brief. Add a punchy takeaway or question to stimulate replies.');
  } else {
    twScore += 15;
    twTips.push(`Fits perfectly within Twitter's single-tweet window (${len}/280 chars).`);
  }

  if (hashtagCount > 2) {
    twScore -= 10;
    twTips.push('Reduce to 1-2 hashtags to avoid looking like promotional spam.');
  }

  // Instagram: Visual caption, 125 char cutoff, 5-15 tags
  let igScore = 72;
  const igTips: string[] = [];
  let igStatus: PlatformScore['status'] = 'optimal';

  const first125 = text.slice(0, 125);
  if (first125.includes('?') || first125.includes('!') || first125.includes(':')) {
    igScore += 12;
    igTips.push('Opening hook is strong before Instagram\'s 125-character "...more" caption cut-off.');
  } else {
    igTips.push('Ensure your most captivating line is within the first 125 characters before the caption truncates.');
  }

  if (hashtagCount >= 5 && hashtagCount <= 15) {
    igScore += 10;
  } else {
    igTips.push('Add 5-12 hashtags in caption or first comment to expand Explore page distribution.');
  }

  // Facebook
  let fbScore = 70;
  const fbTips: string[] = [];
  let fbStatus: PlatformScore['status'] = 'optimal';

  if (text.includes('?')) {
    fbScore += 15;
    fbTips.push('Questions generate comment threads, which algorithmically boosts Facebook group/page reach.');
  } else {
    fbTips.push('Add an open-ended conversational question to invite comments from friends and followers.');
  }

  return {
    linkedin: {
      platform: 'linkedin',
      score: Math.min(100, Math.max(20, liScore)),
      characterCount: len,
      characterLimit: 3000,
      status: liStatus,
      specificTips: liTips,
      hashtagRecommendation: { suggestedCount: '3 - 5 hashtags', currentCount: hashtagCount },
    },
    twitter: {
      platform: 'twitter',
      score: Math.min(100, Math.max(20, twScore)),
      characterCount: len,
      characterLimit: 280,
      status: twStatus,
      specificTips: twTips,
      hashtagRecommendation: { suggestedCount: '1 - 2 hashtags', currentCount: hashtagCount },
    },
    instagram: {
      platform: 'instagram',
      score: Math.min(100, Math.max(20, igScore)),
      characterCount: len,
      characterLimit: 2200,
      status: igStatus,
      specificTips: igTips,
      hashtagRecommendation: { suggestedCount: '5 - 15 hashtags', currentCount: hashtagCount },
    },
    facebook: {
      platform: 'facebook',
      score: Math.min(100, Math.max(20, fbScore)),
      characterCount: len,
      characterLimit: 63206,
      status: fbStatus,
      specificTips: fbTips,
      hashtagRecommendation: { suggestedCount: '1 - 3 hashtags', currentCount: hashtagCount },
    },
  };
}

/**
 * Computes estimated performance metrics and audience breakdown (Analytics Report)
 */
function computeProjectedAnalytics(score: number, breakdown: AnalysisResult['scoreBreakdown']): ProjectedAnalytics {
  const baseMultiplier = score / 100;
  const totalReach = Math.round(18000 + baseMultiplier * 32000);
  const engagementRate = Math.round((1.8 + baseMultiplier * 3.8) * 10) / 10;
  const totalEngagements = Math.round(totalReach * (engagementRate / 100));

  const reactions = Math.round(totalEngagements * 0.65);
  const comments = Math.round(totalEngagements * (0.14 + (breakdown.cta / 100) * 0.08));
  const shares = Math.round(totalEngagements * (0.08 + (breakdown.hook / 100) * 0.06));
  const postSaves = Math.round(totalEngagements * (0.05 + (breakdown.clarity / 100) * 0.04));
  const pageLikes = Math.max(60, totalEngagements - (reactions + comments + shares + postSaves));

  const countryBreakdown = [
    { country: 'United States', reach: Math.round(totalReach * 0.42), percentage: 42, color: '#e11d48' },
    { country: 'United Kingdom', reach: Math.round(totalReach * 0.28), percentage: 28, color: '#be123c' },
    { country: 'Germany', reach: Math.round(totalReach * 0.14), percentage: 14, color: '#f43f5e' },
    { country: 'Canada', reach: Math.round(totalReach * 0.09), percentage: 9, color: '#fb7185' },
    { country: 'Australia & APAC', reach: Math.round(totalReach * 0.07), percentage: 7, color: '#fda4af' },
  ];

  const pieSegments = [
    { label: 'Reactions', value: reactions, color: '#be123c', percentage: 65 },
    { label: 'Comments', value: comments, color: '#e11d48', percentage: 18 },
    { label: 'Shares', value: shares, color: '#fb7185', percentage: 11 },
    { label: 'Post Saves', value: postSaves, color: '#fecdd3', percentage: 6 },
  ];

  return {
    totalReach,
    engagementRate,
    reactions,
    comments,
    shares,
    postSaves,
    pageLikes,
    countryBreakdown,
    pieSegments,
  };
}

/**
 * Generates dynamic improvement suggestions
 */
function generateSuggestions(
  readability: ReadabilityMetrics,
  hook: HookAnalysis,
  cta: AnalysisResult['callToAction'],
  hashtags: { extracted: string[]; suggested: string[] },
  text: string,
  keywords: string[]
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];
  const topicTag = hashtags.suggested.slice(0, 3).join(' ');

  // 1. Hook
  if (hook.score < 80) {
    suggestions.push({
      id: 'sug-hook',
      category: 'hook',
      impact: 'High',
      title: 'Upgrade Opening Hook Line',
      description: 'Your first sentence determines whether 80% of readers stop scrolling. Replace passive introductions with a high-tension statement or question.',
      actionableExample: hook.suggestedAlternative,
    });
  }

  // 2. CTA
  if (!cta.detected || cta.strength === 'Weak') {
    const mainKw = keywords[0] || 'this';
    suggestions.push({
      id: 'sug-cta',
      category: 'cta',
      impact: 'High',
      title: 'Include an Explicit Call to Action (CTA)',
      description: 'Posts with an explicit question or next-step direction receive up to 3.8x more comments and shares.',
      actionableExample: `What is your biggest challenge when it comes to ${mainKw}? Let's discuss below.`,
    });
  }

  // 3. Spacing / Layout
  if (readability.paragraphCount <= 2 && readability.wordCount > 50) {
    suggestions.push({
      id: 'sug-formatting',
      category: 'formatting',
      impact: 'Medium',
      title: 'Break Down Dense Text Paragraphs',
      description: 'Mobile readers experience cognitive fatigue from blocks of text. Limit paragraphs to 1-2 punchy sentences with blank line breaks in between.',
      actionableExample: 'Add line breaks and bullet points for fast scanning.',
    });
  }

  // 4. Hashtags
  if (hashtags.extracted.length === 0) {
    suggestions.push({
      id: 'sug-hashtags',
      category: 'hashtags',
      impact: 'Medium',
      title: 'Add Categorization Hashtags',
      description: 'Hashtags index your post into search categories and topical feeds. Add 3 to 5 relevant tags at the end.',
      actionableExample: topicTag || '#Innovation #Strategy #Growth',
    });
  }

  // 5. Readability
  if (readability.avgWordsPerSentence > 16) {
    suggestions.push({
      id: 'sug-readability',
      category: 'readability',
      impact: 'Medium',
      title: 'Reduce Sentence Length',
      description: `Your average sentence length is ${readability.avgWordsPerSentence} words. Aim for 10-14 words per sentence to maintain high reading velocity.`,
    });
  }

  return suggestions;
}

/**
 * Intelligently generates 4 distinct, bespoke rewrite variants dynamically adapted to the user's exact content!
 */
function generateDynamicVariants(
  rawText: string,
  keywords: string[],
  hashtags: { suggested: string[] }
): ContentVariant[] {
  const sentences = rawText
    .replace(/\n+/g, ' ')
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 10);

  const topKeyword = keywords[0] || 'this topic';
  const secondKeyword = keywords[1] || 'strategy';
  const tagString = hashtags.suggested.slice(0, 4).join(' ');

  const takeaway1 = sentences[0] || 'Focus on the core bottleneck first.';
  const takeaway2 = sentences[1] || sentences[0] || 'Eliminate unnecessary friction.';
  const takeaway3 = sentences[2] || 'Measure what actually moves the needle.';

  return [
    {
      id: 'variant-viral',
      title: 'Viral & Punchy Hook Formula',
      description: 'Engineered for maximum curiosity, pattern-interruption, and fast shares.',
      style: 'viral-punchy',
      estimatedEngagementBoost: '+45% Reach',
      content: `90% of people get ${topTopicFormatting(topKeyword)} completely wrong.\n\nHere is the exact framework to fix it:\n\n1. ${takeaway1}\n2. ${takeaway2}\n3. ${takeaway3}\n\nThe result: 10x better execution with half the effort.\n\nAgree or disagree? Let me know below.\n\n${tagString}`,
    },
    {
      id: 'variant-leadership',
      title: 'Thought Leadership & Storytelling',
      description: 'Optimized for executive authority, personal branding, and high LinkedIn dwell time.',
      style: 'thought-leadership',
      estimatedEngagementBoost: '+60% Dwell Time',
      content: `A few years ago, I thought mastering ${topKeyword} was about doing more.\n\nI was wrong. It was about doing the right things with relentless clarity.\n\nHere are 3 lessons learned the hard way:\n\n1. ${takeaway1}\n2. ${takeaway2}\n3. ${takeaway3}\n\nWhen you stop overcomplicating the process, momentum takes care of itself.\n\nSave this post if you are refining your ${secondKeyword} this quarter.\n\n${tagString}`,
    },
    {
      id: 'variant-scannable',
      title: 'Scannable Bullets & Key Takeaways',
      description: 'Clean visual hierarchy designed for rapid consumption on mobile devices.',
      style: 'scannable-bullets',
      estimatedEngagementBoost: '+35% Saves & Reposts',
      content: `Quick Breakdown on ${topKeyword.charAt(0).toUpperCase() + topKeyword.slice(1)}:\n\n- Point 1: ${takeaway1}\n- Point 2: ${takeaway2}\n- Point 3: ${takeaway3}\n\nBottom Line:\nExecution always beats complex planning.\n\nRepost this to share the insight with your network.\n\n${tagString}`,
    },
    {
      id: 'variant-discussion',
      title: 'Community Discussion Driver',
      description: 'Formulated specifically to stimulate comments, debates, and peer interaction.',
      style: 'discussion-driver',
      estimatedEngagementBoost: '+80% Comments',
      content: `Quick question for everyone in my network regarding ${topKeyword}:\n\n"${takeaway1}"\n\nWhat has been your personal experience with this? What works best for you?\n\nDrop your perspective in the comments below - looking forward to reading every reply.\n\n${tagString}`,
    },
  ];
}

function topTopicFormatting(topic: string): string {
  return topic.toUpperCase();
}

/**
 * Main analysis coordinator
 */
export function analyzeContent(rawText: string): AnalysisResult {
  const trimmed = rawText.trim();
  if (!trimmed) {
    throw new Error('Please provide text to analyze.');
  }

  const keywords = extractTopKeywords(trimmed);
  const readability = computeReadability(trimmed);
  const hookAnalysis = analyzeHook(trimmed, keywords);
  const { tone, sentiment } = analyzeToneAndSentiment(trimmed);
  const hashtags = analyzeHashtags(trimmed, keywords);
  const callToAction = analyzeCTA(trimmed, keywords);
  const platformScores = evaluatePlatforms(trimmed, hashtags.extracted.length);

  const hookScoreWeight = (hookAnalysis.score / 100) * 25;
  const clarityScoreWeight = (Math.min(100, readability.fleschScore + 20) / 100) * 20;
  const ctaScoreWeight = (callToAction.detected ? 85 : 35) / 100 * 20;
  const emotionWeight = ((sentiment.type === 'Positive' ? 85 : 70) / 100) * 20;
  const formattingWeight = (readability.paragraphCount > 1 ? 90 : 50) / 100 * 15;

  const overallScore = Math.round(
    hookScoreWeight + clarityScoreWeight + ctaScoreWeight + emotionWeight + formattingWeight
  );

  const scoreBreakdown = {
    hook: Math.round(hookAnalysis.score),
    clarity: Math.round(Math.min(100, readability.fleschScore + 20)),
    cta: callToAction.detected ? 88 : 40,
    emotionalResonance: sentiment.type === 'Positive' ? 85 : 68,
    formatting: readability.paragraphCount > 1 ? 88 : 55,
  };

  const suggestions = generateSuggestions(readability, hookAnalysis, callToAction, hashtags, trimmed, keywords);
  const variants = generateDynamicVariants(trimmed, keywords, hashtags);
  const analytics = computeProjectedAnalytics(overallScore, scoreBreakdown);

  return {
    rawText: trimmed,
    overallScore: Math.max(10, Math.min(99, overallScore)),
    scoreBreakdown,
    tone,
    sentiment,
    readability,
    hookAnalysis,
    hashtags,
    callToAction,
    platformScores,
    suggestions,
    variants,
    analytics,
    analyzedAt: new Date().toISOString(),
  };
}
