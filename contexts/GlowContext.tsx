import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { ScanResult, UserProfile } from '@/types';
import { generateMockScore, getRandomTips, getRandomRoast } from '@/mocks/glowData';

const STORAGE_KEYS = {
  SCAN_HISTORY: 'glow_scan_history',
  USER_PROFILE: 'glow_user_profile',
};

const DEFAULT_PROFILE: UserProfile = {
  isPremium: false,
  dailyScansUsed: 0,
  dailyScansLimit: 3,
  lastScanDate: '',
  totalScans: 0,
  averageScore: 0,
  streak: 0,
};

export const [GlowProvider, useGlow] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const historyQuery = useQuery({
    queryKey: ['scanHistory'],
    queryFn: async (): Promise<ScanResult[]> => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
      return stored ? JSON.parse(stored) : [];
    },
  });

  const profileQuery = useQuery({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<UserProfile> => {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (stored) {
        const profile = JSON.parse(stored) as UserProfile;
        const today = new Date().toDateString();
        if (profile.lastScanDate !== today) {
          return { ...profile, dailyScansUsed: 0, lastScanDate: today };
        }
        return profile;
      }
      return DEFAULT_PROFILE;
    },
  });

  const saveScanMutation = useMutation({
    mutationFn: async (scan: ScanResult) => {
      const history = historyQuery.data || [];
      const updated = [scan, ...history].slice(0, 50);
      await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scanHistory'] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const current = profileQuery.data || DEFAULT_PROFILE;
      const updated = { ...current, ...updates };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });

  const history = useMemo(() => historyQuery.data || [], [historyQuery.data]);
  const profile = useMemo(() => profileQuery.data || DEFAULT_PROFILE, [profileQuery.data]);

  const canScan = useMemo(() => {
    if (profile.isPremium) return true;
    return profile.dailyScansUsed < profile.dailyScansLimit;
  }, [profile]);

  const scansRemaining = useMemo(() => {
    if (profile.isPremium) return Infinity;
    return Math.max(0, profile.dailyScansLimit - profile.dailyScansUsed);
  }, [profile]);

  const { mutate: saveScan } = saveScanMutation;
  const { mutate: updateProfile } = updateProfileMutation;

  const processSelfie = useCallback(async (imageUri: string): Promise<ScanResult> => {
    setIsProcessing(true);
    
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const { score, breakdown } = generateMockScore();
    const tips = getRandomTips(3);
    const roast = getRandomRoast();
    
    const scan: ScanResult = {
      id: Date.now().toString(),
      imageUri,
      score,
      breakdown,
      tips,
      roast,
      createdAt: new Date().toISOString(),
    };
    
    setCurrentScan(scan);
    saveScan(scan);
    
    const newTotalScans = profile.totalScans + 1;
    const newAverage = ((profile.averageScore * profile.totalScans) + score) / newTotalScans;
    
    updateProfile({
      dailyScansUsed: profile.dailyScansUsed + 1,
      lastScanDate: new Date().toDateString(),
      totalScans: newTotalScans,
      averageScore: Math.round(newAverage * 10) / 10,
    });
    
    setIsProcessing(false);
    return scan;
  }, [profile, saveScan, updateProfile]);

  const upgradeToPremium = useCallback(() => {
    updateProfile({ isPremium: true });
  }, [updateProfile]);

  const clearCurrentScan = useCallback(() => {
    setCurrentScan(null);
  }, []);

  return {
    history,
    profile,
    currentScan,
    isProcessing,
    canScan,
    scansRemaining,
    processSelfie,
    upgradeToPremium,
    clearCurrentScan,
    setCurrentScan,
    isLoading: historyQuery.isLoading || profileQuery.isLoading,
  };
});
