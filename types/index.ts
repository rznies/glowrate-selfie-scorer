export interface ScoreBreakdown {
  smile: number;
  lighting: number;
  style: number;
  vibe: number;
}

export interface Tip {
  id: string;
  category: 'pose' | 'lighting' | 'style' | 'expression';
  text: string;
  emoji: string;
}

export interface ScanResult {
  id: string;
  imageUri: string;
  score: number;
  breakdown: ScoreBreakdown;
  tips: Tip[];
  roast: string;
  createdAt: string;
}

export interface UserProfile {
  isPremium: boolean;
  dailyScansUsed: number;
  dailyScansLimit: number;
  lastScanDate: string;
  totalScans: number;
  averageScore: number;
  streak: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  emoji: string;
  completed: boolean;
  reward: string;
}
