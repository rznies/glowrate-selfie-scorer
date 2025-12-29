import { Tip, DailyChallenge } from '@/types';

export const TIPS_POOL: Tip[] = [
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
];

export const ROASTS: string[] = [
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

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { id: '1', title: 'Golden Hour Glow', description: 'Take a selfie during golden hour', emoji: '🌅', completed: false, reward: '+50 Glow Points' },
  { id: '2', title: 'Smile Streak', description: 'Get a smile score of 8+', emoji: '😁', completed: false, reward: '+30 Glow Points' },
  { id: '3', title: 'Style Icon', description: 'Rock an accessory in your selfie', emoji: '👒', completed: false, reward: '+40 Glow Points' },
  { id: '4', title: 'Vibe Check', description: 'Score 9+ overall', emoji: '🔥', completed: false, reward: '+100 Glow Points' },
];

export const generateMockScore = (): { score: number; breakdown: { smile: number; lighting: number; style: number; vibe: number } } => {
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

export const getRandomTips = (count: number = 3): Tip[] => {
  const shuffled = [...TIPS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getRandomRoast = (): string => {
  return ROASTS[Math.floor(Math.random() * ROASTS.length)];
};
