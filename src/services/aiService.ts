import type { ContentVariant, ImprovementSuggestion } from '../types';

export interface AISettings {
  provider: 'gemini' | 'openai' | 'none';
  apiKey: string;
  model?: string;
}

const AI_STORAGE_KEY = 'smca_ai_settings';

export function getStoredAISettings(): AISettings {
  try {
    const data = localStorage.getItem(AI_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to read AI settings:', e);
  }
  return { provider: 'none', apiKey: '' };
}

export function saveAISettings(settings: AISettings): void {
  try {
    localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save AI settings:', e);
  }
}

/**
 * Calls AI LLM (Gemini / OpenAI) to generate hyper-personalized rewrite variants
 */
export async function generateAIEnhancements(
  text: string,
  settings: AISettings
): Promise<{ variants: ContentVariant[]; customCritique?: string }> {
  if (settings.provider === 'none' || !settings.apiKey) {
    throw new Error('No AI API key configured.');
  }

  if (settings.provider === 'gemini') {
    const model = settings.model || 'gemini-1.5-flash';
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an elite viral social media strategist. Analyze this draft post and generate 4 high-converting rewrite variants for LinkedIn and Twitter, plus a quick 2-sentence critique.
                  
Original Draft:
"""
${text}
"""

Return your response strictly in valid JSON with this format:
{
  "customCritique": "Critique here",
  "variants": [
    {
      "id": "variant-viral",
      "title": "Viral Hook Formula",
      "description": "Short description",
      "style": "viral-punchy",
      "content": "The full post text with spacing and emojis",
      "estimatedEngagementBoost": "+55% Reach"
    },
    {
      "id": "variant-leadership",
      "title": "Executive Storytelling",
      "description": "Short description",
      "style": "thought-leadership",
      "content": "The full post text",
      "estimatedEngagementBoost": "+70% Dwell Time"
    },
    {
      "id": "variant-scannable",
      "title": "High-Yield Bullet Breakdown",
      "description": "Short description",
      "style": "scannable-bullets",
      "content": "The full post text",
      "estimatedEngagementBoost": "+40% Saves"
    },
    {
      "id": "variant-discussion",
      "title": "Community Debate Starter",
      "description": "Short description",
      "style": "discussion-driver",
      "content": "The full post text",
      "estimatedEngagementBoost": "+85% Comments"
    }
  ]
}`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`Gemini API Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error('No content returned from Gemini.');
    
    return JSON.parse(candidateText);
  }

  if (settings.provider === 'openai') {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${settings.apiKey}`,
      },
      body: JSON.stringify({
        model: settings.model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an elite viral social media strategist. Respond strictly with valid JSON.',
          },
          {
            role: 'user',
            content: `Analyze this post draft and return 4 rewrite variants in JSON:
Draft: """${text}"""
JSON format: { "customCritique": string, "variants": [ { "id": string, "title": string, "description": string, "style": string, "content": string, "estimatedEngagementBoost": string } ] }`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(`OpenAI API Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('No content returned from OpenAI.');
    return JSON.parse(content);
  }

  throw new Error('Unsupported AI provider');
}
