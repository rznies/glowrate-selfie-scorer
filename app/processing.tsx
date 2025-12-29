import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useGlow } from '@/contexts/GlowContext';

const { width } = Dimensions.get('window');

const LOADING_MESSAGES = [
  'Analyzing your glow... ✨',
  'Checking smile power... 😊',
  'Measuring vibe levels... 🔥',
  'Calculating style points... 💅',
  'Almost there... 🌟',
];

export default function ProcessingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { processSelfie } = useGlow();

  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const messageIndex = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 2500,
      useNativeDriver: false,
    }).start();

    const messageInterval = setInterval(() => {
      messageIndex.setValue((messageIndex as any)._value + 1);
    }, 500);

    const processImage = async () => {
      if (imageUri) {
        await processSelfie(imageUri);
        router.replace('/results');
      }
    };

    processImage();

    return () => {
      clearInterval(messageInterval);
    };
  }, [imageUri, processSelfie, router, spinAnim, pulseAnim, progressAnim, messageIndex]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const currentMessageIndex = Math.floor((messageIndex as any)._value || 0) % LOADING_MESSAGES.length;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.background, '#1a1a2e', '#0a0a14']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Animated.View
            style={[
              styles.glowRing,
              {
                transform: [{ rotate: spin }, { scale: pulseAnim }],
              },
            ]}
          >
            <LinearGradient
              colors={[...Colors.gradient.primary, ...Colors.gradient.secondary]}
              style={styles.gradientRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          {imageUri && (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          )}
        </View>

        <Animated.View style={[styles.sparkleContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.sparkle}>✨</Text>
        </Animated.View>

        <Text style={styles.title}>AI Magic in Progress</Text>
        <Text style={styles.message}>
          {LOADING_MESSAGES[currentMessageIndex]}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
              <LinearGradient
                colors={[...Colors.gradient.primary]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
        </View>

        <View style={styles.funFacts}>
          <Text style={styles.funFactTitle}>Did you know? 💡</Text>
          <Text style={styles.funFactText}>
            Smiling in photos can increase your perceived attractiveness by up to 40%!
          </Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  imageContainer: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  glowRing: {
    position: 'absolute',
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: width * 0.275,
    padding: 4,
  },
  gradientRing: {
    flex: 1,
    borderRadius: width * 0.275,
    opacity: 0.6,
  },
  previewImage: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.225,
    borderWidth: 4,
    borderColor: Colors.card,
  },
  sparkleContainer: {
    position: 'absolute',
    top: '25%',
  },
  sparkle: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
    minHeight: 28,
  },
  progressContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 48,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  funFacts: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  funFactTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  funFactText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
