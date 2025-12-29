import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Share,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Share2,
  Camera,
  Smile,
  Sun,
  Palette,
  Zap,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useGlow } from '@/contexts/GlowContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

const { width } = Dimensions.get('window');

const getScoreEmoji = (score: number): string => {
  if (score >= 9.5) return '👑';
  if (score >= 9) return '🔥';
  if (score >= 8) return '✨';
  if (score >= 7) return '💫';
  if (score >= 6) return '🌟';
  return '💪';
};

const getScoreMessage = (score: number): string => {
  if (score >= 9.5) return 'LEGENDARY';
  if (score >= 9) return 'ABSOLUTE FIRE';
  if (score >= 8) return 'AMAZING';
  if (score >= 7) return 'SOLID VIBES';
  if (score >= 6) return 'NICE GLOW';
  return 'KEEP GLOWING';
};

export default function ResultsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { currentScan, clearCurrentScan } = useGlow();
  
  // Simple state for animation substitute
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!currentScan) {
      router.replace('/');
      return;
    }
    
    // Trigger "animation" by setting visible after mount
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (currentScan.score >= 8) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentScan, router]);

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: `I just got a ${currentScan?.score}/10 on GlowRate! 🔥 ${currentScan?.roast}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleClose = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearCurrentScan();
    router.replace('/');
  };

  const handleRetake = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    clearCurrentScan();
    router.replace('/camera');
  };

  if (!currentScan) return null;

  const breakdownItems = [
    { key: 'smile', label: 'Smile', value: currentScan.breakdown.smile, icon: Smile, color: theme.colors.accent },
    { key: 'lighting', label: 'Lighting', value: currentScan.breakdown.lighting, icon: Sun, color: theme.colors.warning },
    { key: 'style', label: 'Style', value: currentScan.breakdown.style, icon: Palette, color: theme.colors.secondary },
    { key: 'vibe', label: 'Vibe', value: currentScan.breakdown.vibe, icon: Zap, color: theme.colors.success },
  ];

  return (
    <Screen safeArea={false}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + theme.spacing.m, paddingBottom: insets.bottom + theme.spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Nav Bar */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={handleClose} style={styles.iconButton}>
            <X color={theme.colors.textPrimary} size={24} />
          </TouchableOpacity>
          <Text variant="body" weight="bold">RESULT</Text>
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <Share2 color={theme.colors.textPrimary} size={24} />
          </TouchableOpacity>
        </View>

        {/* Main Score Section */}
        <View style={[styles.mainSection, { opacity: isVisible ? 1 : 0 }]}>
          <View style={[styles.imageContainer, { borderColor: theme.colors.border }]}>
            <Image source={{ uri: currentScan.imageUri }} style={styles.image} />
            <View style={[styles.scoreBadge, { backgroundColor: theme.colors.primary }]}>
              <Text variant="h1" weight="bold" color={theme.colors.primaryForeground}>
                {currentScan.score.toFixed(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.verdictContainer}>
            <Text style={{ fontSize: 32 }}>{getScoreEmoji(currentScan.score)}</Text>
            <Text variant="h2" weight="bold" align="center" style={{ textTransform: 'uppercase' }}>
              {getScoreMessage(currentScan.score)}
            </Text>
          </View>
        </View>

        {/* Roast Card */}
        <Card style={styles.roastCard}>
          <Text variant="body" align="center" style={{ fontStyle: 'italic' }}>
            &quot;{currentScan.roast}&quot;
          </Text>
        </Card>

        {/* Breakdown Grid */}
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: theme.spacing.m }}>
            Breakdown
          </Text>
          <View style={styles.grid}>
            {breakdownItems.map((item) => (
              <Card key={item.key} style={styles.gridItem} padding="s">
                <View style={styles.gridHeader}>
                  <item.icon size={16} color={item.color} />
                  <Text variant="h3" weight="bold">{item.value}</Text>
                </View>
                <Text variant="caption" color={theme.colors.textSecondary}>{item.label}</Text>
                <View style={[styles.progressBar, { backgroundColor: theme.colors.surfaceHighlight }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { width: `${item.value * 10}%`, backgroundColor: item.color }
                    ]} 
                  />
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text variant="h3" weight="semibold" style={{ marginBottom: theme.spacing.m }}>
            Glow Up Tips
          </Text>
          {currentScan.tips.map((tip) => (
            <Card key={tip.id} style={styles.tipCard}>
              <Text style={{ fontSize: 24 }}>{tip.emoji}</Text>
              <Text variant="body" style={{ flex: 1 }}>{tip.text}</Text>
            </Card>
          ))}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button 
            label="Share Result" 
            variant="primary" 
            fullWidth 
            icon={<Share2 size={20} color={theme.colors.primaryForeground} />}
            onPress={handleShare}
            style={{ marginBottom: theme.spacing.s }}
          />
          <Button 
            label="Scan Again" 
            variant="secondary" 
            fullWidth 
            icon={<Camera size={20} color={theme.colors.textPrimary} />}
            onPress={handleRetake}
          />
        </View>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconButton: {
    padding: 8,
  },
  mainSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    borderWidth: 1,
    padding: 8,
    marginBottom: 24,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  scoreBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#09090B', // Matching bg
  },
  verdictContainer: {
    alignItems: 'center',
    gap: 8,
  },
  roastCard: {
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  section: {
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '48%', // approximate
    padding: 12,
    gap: 8,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
  },
  actions: {
    marginTop: 8,
  },
});
