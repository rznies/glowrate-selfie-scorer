import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Camera, Sparkles, Zap, Crown } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useGlow } from '@/contexts/GlowContext';
import { DAILY_CHALLENGES } from '@/mocks/glowData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profile, canScan, scansRemaining } = useGlow();
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim, glowAnim, floatAnim]);

  const handleSnapPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (canScan) {
      router.push('/camera');
    } else {
      router.push('/premium');
    }
  };

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.background, '#1a1a2e', Colors.background]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Glow</Text>
          <Text style={styles.logoAccent}>Rate</Text>
          <Sparkles color={Colors.accent} size={24} style={styles.sparkle} />
        </View>
        {profile.isPremium && (
          <View style={styles.premiumBadge}>
            <Crown color={Colors.accent} size={16} />
            <Text style={styles.premiumText}>PRO</Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile.totalScans}</Text>
          <Text style={styles.statLabel}>Total Scans</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile.averageScore || '-'}</Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{profile.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <View style={styles.centerContent}>
        <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
          <Text style={styles.callToAction}>Ready to glow? ✨</Text>
          <Text style={styles.subtitle}>
            Snap a selfie and get your AI glow score
          </Text>
        </Animated.View>

        <View style={styles.buttonContainer}>
          <Animated.View
            style={[
              styles.glowRing,
              {
                opacity: glowOpacity,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              onPress={handleSnapPress}
              activeOpacity={0.9}
              style={styles.snapButtonOuter}
            >
              <LinearGradient
                colors={canScan ? [...Colors.gradient.primary] : ['#555', '#333']}
                style={styles.snapButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Camera color="#fff" size={48} strokeWidth={2.5} />
                <Text style={styles.snapText}>SNAP</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {!profile.isPremium && (
          <View style={styles.scansInfo}>
            <Zap color={Colors.accent} size={18} />
            <Text style={styles.scansText}>
              {scansRemaining} free {scansRemaining === 1 ? 'scan' : 'scans'} left today
            </Text>
          </View>
        )}
      </View>

      <View style={styles.challengeSection}>
        <Text style={styles.sectionTitle}>Daily Challenges 🎯</Text>
        <View style={styles.challengeCard}>
          {DAILY_CHALLENGES.slice(0, 2).map((challenge) => (
            <View key={challenge.id} style={styles.challengeItem}>
              <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeReward}>{challenge.reward}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  logoAccent: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: Colors.primary,
  },
  sparkle: {
    marginLeft: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  premiumText: {
    color: Colors.accent,
    fontWeight: '700' as const,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  callToAction: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowRing: {
    position: 'absolute',
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: width * 0.275,
    backgroundColor: Colors.primary,
  },
  snapButtonOuter: {
    borderRadius: width * 0.22,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  snapButton: {
    width: width * 0.44,
    height: width * 0.44,
    borderRadius: width * 0.22,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  snapText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800' as const,
    letterSpacing: 2,
  },
  scansInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 32,
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scansText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  challengeSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  challengeCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  challengeEmoji: {
    fontSize: 28,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  challengeReward: {
    fontSize: 13,
    color: Colors.accent,
    marginTop: 2,
  },
});
