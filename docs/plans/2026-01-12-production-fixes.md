# GlowRate Production Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Transform GlowRate from a prototype into a production-ready app by fixing critical issues, adding real AI scoring, and improving code quality.

**Architecture:** Fix TypeScript violations, consolidate duplicate code, integrate OpenAI Vision API for real selfie analysis, add proper error handling with user feedback, and unify the styling system.

**Tech Stack:** React Native, Expo, TypeScript, tRPC, OpenAI Vision API, AsyncStorage

**Scope Exclusions:** Payment integration, user authentication (per user request)

---

## Phase 1: Code Quality & TypeScript Fixes

### Task 1: Fix TypeScript Violations in Processing Screen

**Files:**
- Modify: `app/processing.tsx`

**Step 1: Identify the issue**

The file uses `@ts-ignore` to access private `_value` property of Animated.Value:
```typescript
// Line 72-73
// @ts-ignore
messageIndex.setValue(messageIndex._value + 1);

// Line 102-103
// @ts-ignore
const currentMessageIndex = Math.floor(messageIndex._value || 0) % LOADING_MESSAGES.length;
```

**Step 2: Replace with proper state management**

Replace the Animated.Value hack with React state for message cycling:

```typescript
// Add to imports (if not present)
import React, { useEffect, useRef, useState } from 'react';

// Replace line 39
// OLD: const messageIndex = useRef(new Animated.Value(0)).current;
// NEW: Remove this line entirely

// Add state for message index after other useState calls (around line 27)
const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
```

**Step 3: Update the message cycling logic**

Replace lines 71-74:
```typescript
// OLD:
// const messageInterval = setInterval(() => {
//   // @ts-ignore
//   messageIndex.setValue(messageIndex._value + 1);
// }, 800);

// NEW:
const messageInterval = setInterval(() => {
  setCurrentMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
}, 800);
```

**Step 4: Update the render usage**

Replace line 102-103:
```typescript
// OLD:
// // @ts-ignore
// const currentMessageIndex = Math.floor(messageIndex._value || 0) % LOADING_MESSAGES.length;

// NEW: Remove these lines - currentMessageIndex is now state
```

**Step 5: Remove messageIndex from useEffect dependency array**

Update line 90:
```typescript
// OLD: }, [imageUri, processSelfie, router, spinAnim, pulseAnim, progressAnim, messageIndex]);
// NEW: 
}, [imageUri, processSelfie, router, spinAnim, pulseAnim, progressAnim]);
```

**Step 6: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors in `app/processing.tsx`

**Step 7: Commit**

```bash
git add app/processing.tsx
git commit -m "fix: remove @ts-ignore violations in processing screen"
```

---

### Task 2: Fix `any` Types in Button Component

**Files:**
- Modify: `components/ui/Button.tsx`

**Step 1: Fix the handlePress type**

Replace line 35:
```typescript
// OLD: const handlePress = (e: any) => {
// NEW:
import { GestureResponderEvent } from 'react-native';
// ... in the function:
const handlePress = (e: GestureResponderEvent) => {
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors in `components/ui/Button.tsx`

**Step 3: Commit**

```bash
git add components/ui/Button.tsx
git commit -m "fix: replace any type with GestureResponderEvent in Button"
```

---

### Task 3: Fix `any` Type in Home Screen StatItem

**Files:**
- Modify: `app/(tabs)/index.tsx`

**Step 1: Import LucideIcon type**

Add to imports:
```typescript
import { LucideIcon } from 'lucide-react-native';
```

**Step 2: Fix StatItem type**

Replace line 38:
```typescript
// OLD: const StatItem = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) => (
// NEW:
const StatItem = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) => (
```

**Step 3: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors in `app/(tabs)/index.tsx`

**Step 4: Commit**

```bash
git add app/(tabs)/index.tsx
git commit -m "fix: replace any type with LucideIcon in StatItem"
```

---

## Phase 2: Remove Console Logs & Improve Error Handling

### Task 4: Add Error Toast/Alert Utility

**Files:**
- Create: `lib/toast.ts`

**Step 1: Create toast utility**

```typescript
import { Alert, Platform } from 'react-native';

export const showError = (title: string, message?: string) => {
  if (Platform.OS === 'web') {
    // Web fallback
    console.error(`${title}: ${message}`);
    return;
  }
  
  Alert.alert(
    title,
    message,
    [{ text: 'OK', style: 'default' }],
    { cancelable: true }
  );
};

export const showSuccess = (title: string, message?: string) => {
  if (Platform.OS === 'web') {
    console.log(`${title}: ${message}`);
    return;
  }
  
  Alert.alert(
    title,
    message,
    [{ text: 'OK', style: 'default' }],
    { cancelable: true }
  );
};
```

**Step 2: Commit**

```bash
git add lib/toast.ts
git commit -m "feat: add toast/alert utility for user feedback"
```

---

### Task 5: Replace Console.log in Camera Screen

**Files:**
- Modify: `app/camera.tsx`

**Step 1: Import toast utility**

Add to imports:
```typescript
import { showError } from '@/lib/toast';
```

**Step 2: Replace console.log with user feedback**

Replace line 52:
```typescript
// OLD: console.log('Error taking picture:', error);
// NEW:
showError('Camera Error', 'Failed to take picture. Please try again.');
```

**Step 3: Run app to verify**

Test by triggering a camera error (if possible) or visually verify the import works.

**Step 4: Commit**

```bash
git add app/camera.tsx
git commit -m "fix: show user-facing error instead of console.log in camera"
```

---

### Task 6: Replace Console.log in Results Screen

**Files:**
- Modify: `app/results.tsx`

**Step 1: Import toast utility**

Add to imports:
```typescript
import { showError } from '@/lib/toast';
```

**Step 2: Replace console.log with user feedback**

Replace line 84:
```typescript
// OLD: console.log('Error sharing:', error);
// NEW:
showError('Share Failed', 'Unable to share your result. Please try again.');
```

**Step 3: Commit**

```bash
git add app/results.tsx
git commit -m "fix: show user-facing error instead of console.log in results"
```

---

## Phase 3: Consolidate Duplicate Code

### Task 7: Remove Duplicate Mock Data from Backend

**Files:**
- Modify: `backend/trpc/routes/glow.ts`
- Reference: `mocks/glowData.ts`

**Step 1: Import from mocks instead of duplicating**

Replace lines 4-66 in `backend/trpc/routes/glow.ts`:

```typescript
import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { TIPS_POOL, ROASTS, generateMockScore, getRandomTips, getRandomRoast } from "@/mocks/glowData";

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
```

**Step 2: Run TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 3: Commit**

```bash
git add backend/trpc/routes/glow.ts
git commit -m "refactor: remove duplicate mock data, import from mocks/"
```

---

## Phase 4: Unify Styling System

### Task 8: Migrate Profile Screen to Theme System

**Files:**
- Modify: `app/(tabs)/profile.tsx`

**Step 1: Replace Colors import with useTheme**

At the top of the file, change:
```typescript
// OLD: import Colors from '@/constants/colors';
// NEW:
import { useTheme } from '@/contexts/ThemeContext';
```

**Step 2: Add theme hook inside component**

After line 29 (`const { profile } = useGlow();`), add:
```typescript
const theme = useTheme();
```

**Step 3: Create color mapping**

Add after the theme hook:
```typescript
// Map old Colors to theme colors
const Colors = {
  primary: theme.colors.primary,
  secondary: theme.colors.secondary,
  accent: theme.colors.accent,
  background: theme.colors.background,
  card: theme.colors.surface,
  cardLight: theme.colors.surfaceHighlight,
  text: theme.colors.textPrimary,
  textSecondary: theme.colors.textSecondary,
  textMuted: theme.colors.textTertiary,
  border: theme.colors.border,
  success: theme.colors.success,
  warning: theme.colors.warning,
  error: theme.colors.error,
  gradient: {
    primary: [theme.colors.primary, theme.colors.secondary] as const,
    secondary: [theme.colors.secondary, theme.colors.primary] as const,
    gold: [theme.colors.accent, theme.colors.warning] as const,
    fire: [theme.colors.error, theme.colors.warning, theme.colors.accent] as const,
  },
};
```

**Step 4: Run app to verify**

Run: `bun run start`
Verify: Profile screen looks correct with new theme colors

**Step 5: Commit**

```bash
git add app/(tabs)/profile.tsx
git commit -m "refactor: migrate profile screen to unified theme system"
```

---

## Phase 5: Add Real AI Scoring (OpenAI Vision)

### Task 9: Create AI Service Module

**Files:**
- Create: `lib/ai-scoring.ts`

**Step 1: Create the AI scoring service**

```typescript
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
```

**Step 2: Commit**

```bash
git add lib/ai-scoring.ts
git commit -m "feat: add OpenAI Vision AI scoring service"
```

---

### Task 10: Create Image to Base64 Utility

**Files:**
- Create: `lib/image-utils.ts`

**Step 1: Create the utility**

```typescript
import * as FileSystem from 'expo-file-system';

export async function imageUriToBase64(uri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    throw new Error(`Failed to convert image to base64: ${error}`);
  }
}

export async function compressImage(uri: string): Promise<string> {
  // For now, just return the original URI
  // In future, implement actual compression
  return uri;
}
```

**Step 2: Install expo-file-system if needed**

Run: `bun add expo-file-system`

**Step 3: Commit**

```bash
git add lib/image-utils.ts package.json bun.lock
git commit -m "feat: add image utility for base64 conversion"
```

---

### Task 11: Update Backend to Use AI Scoring

**Files:**
- Modify: `backend/trpc/routes/glow.ts`

**Step 1: Update the route to use AI**

```typescript
import * as z from "zod";
import { createTRPCRouter, publicProcedure } from "../create-context";
import { analyzeSelfiWithAI, getMockScore } from "@/lib/ai-scoring";

export const glowRouter = createTRPCRouter({
  processSelfie: publicProcedure
    .input(z.object({ 
      imageUri: z.string().optional(),
      imageBase64: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { imageBase64 } = input;
      
      let result;
      
      // Try AI scoring if base64 image provided and API key exists
      if (imageBase64 && process.env.EXPO_PUBLIC_OPENAI_API_KEY) {
        try {
          result = await analyzeSelfiWithAI(imageBase64);
        } catch (error) {
          console.error('AI scoring failed, falling back to mock:', error);
          result = getMockScore();
        }
      } else {
        // Fallback to mock scoring
        await new Promise(resolve => setTimeout(resolve, 1500));
        result = getMockScore();
      }

      return {
        id: Date.now().toString(),
        ...result,
        createdAt: new Date().toISOString(),
      };
    }),
});
```

**Step 2: Commit**

```bash
git add backend/trpc/routes/glow.ts
git commit -m "feat: integrate AI scoring with mock fallback"
```

---

### Task 12: Update GlowContext to Send Base64

**Files:**
- Modify: `contexts/GlowContext.tsx`

**Step 1: Import image utility**

Add to imports:
```typescript
import { imageUriToBase64 } from '@/lib/image-utils';
```

**Step 2: Update processSelfie function**

Replace the processSelfie function (around line 94):
```typescript
const processSelfie = useCallback(async (imageUri: string): Promise<ScanResult> => {
  setIsProcessing(true);
  
  try {
    // Convert image to base64 for AI analysis
    let imageBase64: string | undefined;
    try {
      imageBase64 = await imageUriToBase64(imageUri);
    } catch (error) {
      console.warn('Could not convert image to base64, using mock scoring');
    }
    
    const result = await processSelfieMutation.mutateAsync({ 
      imageUri,
      imageBase64,
    });
    
    const scan: ScanResult = {
      ...result,
      imageUri,
      tips: result.tips as ScanResult['tips'], 
    };
    
    setCurrentScan(scan);
    saveScan(scan);
    
    const newTotalScans = profile.totalScans + 1;
    const newAverage = ((profile.averageScore * profile.totalScans) + scan.score) / newTotalScans;
    
    updateProfile({
      dailyScansUsed: profile.dailyScansUsed + 1,
      lastScanDate: new Date().toDateString(),
      totalScans: newTotalScans,
      averageScore: Math.round(newAverage * 10) / 10,
    });
    
    return scan;
  } finally {
    setIsProcessing(false);
  }
}, [profile, saveScan, updateProfile, processSelfieMutation]);
```

**Step 3: Commit**

```bash
git add contexts/GlowContext.tsx
git commit -m "feat: send base64 image data to backend for AI scoring"
```

---

### Task 13: Create Environment Variables Template

**Files:**
- Create: `.env.example`
- Update: `.gitignore`

**Step 1: Create .env.example**

```bash
# OpenAI API Key for AI selfie analysis
# Get your key at: https://platform.openai.com/api-keys
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-api-key-here

# Rork API Base URL (provided by Rork)
EXPO_PUBLIC_RORK_API_BASE_URL=https://your-rork-url.com
```

**Step 2: Update .gitignore**

Add to .gitignore:
```
# Environment files
.env
.env.local
.env.*.local
```

**Step 3: Commit**

```bash
git add .env.example .gitignore
git commit -m "docs: add environment variables template"
```

---

## Phase 6: Add Accessibility

### Task 14: Add Accessibility Labels to Button Component

**Files:**
- Modify: `components/ui/Button.tsx`

**Step 1: Add accessibility props**

Update the TouchableOpacity (around line 86):
```typescript
<TouchableOpacity 
  style={[containerStyle, style]} 
  onPress={handlePress}
  activeOpacity={0.8}
  disabled={disabled || loading}
  accessibilityRole="button"
  accessibilityLabel={label}
  accessibilityState={{ 
    disabled: disabled || loading,
    busy: loading,
  }}
  {...props}
>
```

**Step 2: Commit**

```bash
git add components/ui/Button.tsx
git commit -m "a11y: add accessibility labels to Button component"
```

---

### Task 15: Add Accessibility to Camera Screen Controls

**Files:**
- Modify: `app/camera.tsx`

**Step 1: Add accessibility to capture button**

Find the capture button TouchableOpacity and add:
```typescript
<TouchableOpacity 
  style={[styles.captureButton, { borderColor: theme.colors.primary }]} 
  onPress={handleCapture}
  accessibilityRole="button"
  accessibilityLabel="Take photo"
>
```

**Step 2: Add accessibility to other controls**

```typescript
// Close button
accessibilityRole="button"
accessibilityLabel="Close camera"

// Gallery button
accessibilityRole="button"
accessibilityLabel="Choose from gallery"

// Flip camera button
accessibilityRole="button"
accessibilityLabel="Switch camera"

// Retake button
accessibilityRole="button"
accessibilityLabel="Retake photo"
```

**Step 3: Commit**

```bash
git add app/camera.tsx
git commit -m "a11y: add accessibility labels to camera controls"
```

---

## Phase 7: Fix Package.json & Cleanup

### Task 16: Fix Package Name and Add Scripts

**Files:**
- Modify: `package.json`

**Step 1: Update package name**

```json
{
  "name": "glowrate-selfie-scorer",
  ...
}
```

**Step 2: Add useful scripts**

```json
{
  "scripts": {
    "start": "bunx rork start -p 3q6f3uwks57qzm5ouiwf2 --tunnel",
    "start-web": "bunx rork start -p 3q6f3uwks57qzm5ouiwf2 --web --tunnel",
    "start-web-dev": "DEBUG=expo* bunx rork start -p 3q6f3uwks57qzm5ouiwf2 --web --tunnel",
    "lint": "expo lint",
    "typecheck": "tsc --noEmit",
    "check": "npm run typecheck && npm run lint"
  },
}
```

**Step 3: Commit**

```bash
git add package.json
git commit -m "chore: fix package name and add typecheck script"
```

---

### Task 17: Add Entertainment Disclaimer

**Files:**
- Modify: `app/(tabs)/index.tsx`

**Step 1: Add disclaimer text below the main button**

After the `limitBadge` View (around line 147), add:
```typescript
<Text 
  variant="caption" 
  color={theme.colors.textTertiary} 
  align="center"
  style={{ marginTop: theme.spacing.m, paddingHorizontal: theme.spacing.xl }}
>
  For entertainment purposes only. Results are AI-generated.
</Text>
```

**Step 2: Commit**

```bash
git add app/(tabs)/index.tsx
git commit -m "docs: add entertainment disclaimer to home screen"
```

---

## Final Verification

### Task 18: Run Full Check

**Step 1: TypeScript check**

Run: `npx tsc --noEmit`
Expected: No errors

**Step 2: Lint check**

Run: `bun run lint`
Expected: No critical errors

**Step 3: Start the app**

Run: `bun run start`
Expected: App starts without crashes

**Step 4: Manual testing checklist**

- [ ] Home screen loads correctly
- [ ] Camera opens and captures photos
- [ ] Processing screen shows animation
- [ ] Results screen displays scores
- [ ] History shows past scans
- [ ] Profile page displays correctly
- [ ] Error alerts appear instead of console.log
- [ ] Disclaimer visible on home screen

**Step 5: Final commit**

```bash
git add -A
git commit -m "chore: production fixes complete"
```

---

## Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| 1 | Tasks 1-3 | TypeScript fixes |
| 2 | Tasks 4-6 | Error handling |
| 3 | Task 7 | Code consolidation |
| 4 | Task 8 | Theme unification |
| 5 | Tasks 9-13 | AI integration |
| 6 | Tasks 14-15 | Accessibility |
| 7 | Tasks 16-18 | Cleanup & verification |

**Total Tasks:** 18
**Estimated Time:** 2-3 hours with subagent execution
