import { ScoreBreakdown, Tip } from '@/types';

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

interface AIAnalysisResult {
  score: number;
  breakdown: ScoreBreakdown;
  tips: Tip[];
  roast: string;
}

const SYSTEM_PROMPT = `You are a fun, encouraging selfie analyzer for the GlowRate app. 
Analyze the selfie and provide:
1. An overall "glow score" from 1-10 (be generous but honest, most people should get 6-9)
2. Breakdown scores (1-10) for: smile, lighting, style, vibe
3. 3 helpful tips to improve (be positive and constructive)
4. A fun, complimentary "roast" comment (keep it positive and encouraging)

Respond in this exact JSON format:
{
  "score": 7.5,
  "breakdown": { "smile": 8, "lighting": 7, "style": 7.5, "vibe": 8 },
  "tips": [
    { "id": "1", "category": "lighting", "text": "Your tip here", "emoji": "💡" },
    { "id": "2", "category": "pose", "text": "Your tip here", "emoji": "📐" },
    { "id": "3", "category": "expression", "text": "Your tip here", "emoji": "😊" }
  ],
  "roast": "Your fun compliment here! 🔥"
}`;

export async function analyzeSelfiWithAI(imageBase64: string): Promise<AIAnalysisResult> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Please analyze this selfie and rate my glow!' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'low',
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No response from AI');
  }

  // Parse JSON from response (handle potential markdown code blocks)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Invalid AI response format');
  }

  return JSON.parse(jsonMatch[0]);
}

// Fallback to mock scoring if AI fails
export function getMockScore(): AIAnalysisResult {
  const baseScore = Math.random() * 3 + 6.5;
  const variance = () => (Math.random() - 0.5) * 1.5;
  
  const breakdown = {
    smile: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
    lighting: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
    style: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
    vibe: Math.round(Math.min(10, Math.max(5, baseScore + variance())) * 10) / 10,
  };
  
  return {
    score: Math.round(((breakdown.smile + breakdown.lighting + breakdown.style + breakdown.vibe) / 4) * 10) / 10,
    breakdown,
    tips: [
      { id: '1', category: 'lighting', text: 'Try natural window light for a softer glow!', emoji: '💡' },
      { id: '2', category: 'pose', text: 'Tilt your chin slightly for a defined look!', emoji: '📐' },
      { id: '3', category: 'expression', text: 'Your smile is your superpower!', emoji: '😊' },
    ],
    roast: "You're giving main character energy! 🌟",
  };
}
