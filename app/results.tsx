import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Share2,
  Camera,
  Sparkles,
  Smile,
  Sun,
  Palette,
  Zap,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useGlow } from '@/contexts/GlowContext';

const { width } = Dimensions.get('window');

const CONFETTI_COLORS = ['#FF6B9D', '#FF9F43', '#FFD93D', '#A855F7', '#6BCB77'];

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotation: Animated.Value;
  color: string;
  size: number;
}

const getScoreEmoji = (score: number): string => {
  if (score >= 9.5) return '👑';
  if (score >= 9) return '🔥';
  if (score >= 8) return '✨';
  if (score >= 7) return '💫';
  if (score >= 6) return '🌟';
  return '💪';
};

const getScoreMessage = (score: number): string => {
  if (score >= 9.5) return 'LEGENDARY GLOW!';
  if (score >= 9) return 'ABSOLUTELY FIRE!';
  if (score >= 8) return 'Looking Amazing!';
  if (score >= 7) return 'Solid Vibes!';
  if (score >= 6) return 'Nice Glow!';
  return 'Keep Glowing!';
};

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'smile':
      return <Smile color={Colors.accent} size={20} />;
    case 'lighting':
      return <Sun color={Colors.secondary} size={20} />;
    case 'style':
      return <Palette color={Colors.purple} size={20} />;
    case 'vibe':
      return <Zap color={Colors.mint} size={20} />;
    default:
      return <Sparkles color={Colors.primary} size={20} />;
  }
};

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { currentScan, clearCurrentScan } = useGlow();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const scoreAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!currentScan) {
      router.replace('/');
      return;
    }

    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scoreAnim, {
        toValue: currentScan.score,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start(() => {
      if (currentScan.score >= 8) {
        triggerConfetti();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    });
  }, [currentScan, fadeAnim, scaleAnim, scoreAnim, router]);

  const triggerConfetti = () => {
    setShowConfetti(true);
    const pieces: ConfettiPiece[] = [];
    
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: new Animated.Value(Math.random() * width),
        y: new Animated.Value(-50),
        rotation: new Animated.Value(0),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 10 + 5,
      });
    }
    
    setConfettiPieces(pieces);
    
    pieces.forEach((piece) => {
      Animated.parallel([
        Animated.timing(piece.y, {
          toValue: Dimensions.get('window').height + 100,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
        Animated.timing(piece.rotation, {
          toValue: Math.random() * 10,
          duration: 3000 + Math.random() * 2000,
          useNativeDriver: true,
        }),
      ]).start();
    });

    setTimeout(() => setShowConfetti(false), 5000);
  };

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

  if (!currentScan) {
    return null;
  }

  const displayScore = scoreAnim.interpolate({
    inputRange: [0, 10],
    outputRange: ['0.0', '10.0'],
  });

  const breakdownItems = [
    { key: 'smile', label: 'Smile', value: currentScan.breakdown.smile, color: Colors.accent },
    { key: 'lighting', label: 'Lighting', value: currentScan.breakdown.lighting, color: Colors.secondary },
    { key: 'style', label: 'Style', value: currentScan.breakdown.style, color: Colors.purple },
    { key: 'vibe', label: 'Vibe', value: currentScan.breakdown.vibe, color: Colors.mint },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.background, '#1a1a2e', Colors.background]}
        style={StyleSheet.absoluteFill}
      />

      {showConfetti && confettiPieces.map((piece) => (
        <Animated.View
          key={piece.id}
          style={[
            styles.confetti,
            {
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                { rotate: piece.rotation.interpolate({
                  inputRange: [0, 10],
                  outputRange: ['0deg', '3600deg'],
                })},
              ],
            },
          ]}
        />
      ))}

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
          <X color={Colors.text} size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
          <Share2 color={Colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        <Animated.View 
          style={[
            styles.scoreSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.imageWrapper}>
            <LinearGradient
              colors={[...Colors.gradient.primary]}
              style={styles.imageBorder}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Image source={{ uri: currentScan.imageUri }} style={styles.resultImage} />
            </LinearGradient>
          </View>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreEmoji}>{getScoreEmoji(currentScan.score)}</Text>
            <View style={styles.scoreRow}>
              <Animated.Text style={styles.scoreValue}>
                {Platform.OS === 'web' ? currentScan.score.toFixed(1) : displayScore}
              </Animated.Text>
              <Text style={styles.scoreMax}>/10</Text>
            </View>
            <Text style={styles.scoreMessage}>{getScoreMessage(currentScan.score)}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.roastCard, { opacity: fadeAnim }]}>
          <Text style={styles.roastText}>{currentScan.roast}</Text>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score Breakdown 📊</Text>
          <View style={styles.breakdownGrid}>
            {breakdownItems.map((item) => (
              <View key={item.key} style={styles.breakdownCard}>
                <CategoryIcon category={item.key} />
                <Text style={styles.breakdownValue}>{item.value}</Text>
                <Text style={styles.breakdownLabel}>{item.label}</Text>
                <View style={styles.breakdownBar}>
                  <View 
                    style={[
                      styles.breakdownFill,
                      { 
                        width: `${item.value * 10}%`,
                        backgroundColor: item.color,
                      },
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tips to Glow Up 💡</Text>
          {currentScan.tips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <Text style={styles.tipEmoji}>{tip.emoji}</Text>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetake}>
            <Camera color={Colors.primary} size={22} />
            <Text style={styles.retakeText}>Take Another</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <LinearGradient
              colors={[...Colors.gradient.primary]}
              style={styles.shareGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Share2 color="#fff" size={22} />
              <Text style={styles.shareText}>Share Results</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  confetti: {
    position: 'absolute',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  scoreSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageWrapper: {
    marginBottom: 24,
  },
  imageBorder: {
    padding: 4,
    borderRadius: width * 0.35,
  },
  resultImage: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    borderWidth: 4,
    borderColor: Colors.background,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  scoreValue: {
    fontSize: 72,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  scoreMax: {
    fontSize: 28,
    color: Colors.textMuted,
    marginLeft: 4,
  },
  scoreMessage: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.primary,
    marginTop: 8,
  },
  roastCard: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  roastText: {
    fontSize: 18,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 16,
  },
  breakdownGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  breakdownCard: {
    width: '47%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  breakdownValue: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    marginTop: 8,
  },
  breakdownLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  breakdownBar: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.cardLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  breakdownFill: {
    height: '100%',
    borderRadius: 3,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.card,
    paddingVertical: 18,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  retakeText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  shareButton: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  shareGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
  },
  shareText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#fff',
  },
});
