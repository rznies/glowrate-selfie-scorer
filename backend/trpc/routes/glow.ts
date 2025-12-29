import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";

// Mock data constants moved from frontend
const TIPS_POOL = [
  { id: '1', category: 'pose', text: 'Try tilting your chin slightly down for a more defined jawline!', emoji: '📐' },
  { id: '2', category: 'pose', text: 'The 3/4 angle is your friend - show that profile!', emoji: '🎯' },
  { id: '3', category: 'lighting', text: 'Golden hour lighting would make you absolutely glow!', emoji: '🌅' },
  { id: '4', category: 'lighting', text: 'Try facing a window for that natural soft light ✨', emoji: '💡' },
  { id: '5', category: 'style', text: 'A pop of color near your face draws attention!', emoji: '🎨' },
  { id: '6', category: 'style', text: 'Accessories can level up any selfie game!', emoji: '💎' },
  { id: '7', category: 'expression', text: 'That genuine smile is your superpower - use it!', emoji: '😊' },
  { id: '8', category: 'expression', text: 'Smize! Smile with your eyes for extra charm', emoji: '👁️' },
  { id: '9', category: 'pose', text: 'Relax those shoulders - confidence is key!', emoji: '💪' },
  { id: '10', category: 'lighting', text: 'Avoid harsh overhead lights - they create shadows', emoji: '🚫' },
  { id: '11', category: 'style', text: 'Messy hair? Call it "effortlessly chic"!', emoji: '💇' },
  { id: '12', category: 'expression', text: 'Think of something funny right before the shot!', emoji: '😂' },
] as const;

const ROASTS = [
  "You're giving main character energy! 🌟",
  "The algorithm could never compete with this face! 🔥",
  "Serving looks and taking names! 💅",
  "This selfie just broke the internet (in a good way)! 📱",
  "Even your phone is blushing from this pic! 😊",
  "You woke up like this? Unfair advantage! 😴",
  "Someone call a firefighter because this pic is FIRE! 🚒",
  "This is the face of someone who knows their angles! 📐",
  "Beauty gurus are taking notes rn! 📝",
  "The camera said: I'm obsessed! 📸",
  "Plot twist: you're the beauty standard now! 👑",
  "This pic has more glow than my skincare routine! ✨",
];

const generateMockScore = () => {
  const baseScore = Math.random() * 3 + 6.5;
  const variance = () => (Math.random() - 0.5) * 1.5;
  
  const breakdown = {
    smile: Math.min(10, Math.max(5, baseScore + variance())),
    lighting: Math.min(10, Math.max(5, baseScore + variance())),
    style: Math.min(10, Math.max(5, baseScore + variance())),
    vibe: Math.min(10, Math.max(5, baseScore + variance())),
  };
  
  const score = (breakdown.smile + breakdown.lighting + breakdown.style + breakdown.vibe) / 4;
  
  return {
    score: Math.round(score * 10) / 10,
    breakdown: {
      smile: Math.round(breakdown.smile * 10) / 10,
      lighting: Math.round(breakdown.lighting * 10) / 10,
      style: Math.round(breakdown.style * 10) / 10,
      vibe: Math.round(breakdown.vibe * 10) / 10,
    },
  };
};

const getRandomTips = (count: number = 3) => {
  const shuffled = [...TIPS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const getRandomRoast = () => {
  return ROASTS[Math.floor(Math.random() * ROASTS.length)];
};

export const glowRouter = createTRPCRouter({
  processSelfie: publicProcedure
    .input(z.object({ imageUri: z.string().optional() }))
    .mutation(async ({ input }) => {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { score, breakdown } = generateMockScore();
      const tips = getRandomTips(3);
      const roast = getRandomRoast();

      return {
        id: Date.now().toString(),
        score,
        breakdown,
        tips,
        roast,
        createdAt: new Date().toISOString(),
      };
    }),
});
