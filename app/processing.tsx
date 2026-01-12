import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGlow } from '@/contexts/GlowContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

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
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const { processSelfie } = useGlow();

  const spinAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

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
      setCurrentMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 800);

    const processImage = async () => {
      if (imageUri) {
        // Simulate waiting for animation
        await new Promise(resolve => setTimeout(resolve, 2000));
        await processSelfie(imageUri);
        router.replace('/results');
      }
    };

    processImage();

    return () => {
      clearInterval(messageInterval);
    };
  }, [imageUri, processSelfie, router, spinAnim, pulseAnim, progressAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Screen safeArea={false}>
      <View style={[styles.content, { paddingTop: insets.top }]}>
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
              colors={[theme.colors.primary, theme.colors.secondary]}
              style={styles.gradientRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </Animated.View>
          {imageUri && (
            <Image 
              source={{ uri: imageUri }} 
              style={[styles.previewImage, { borderColor: theme.colors.surface }]} 
            />
          )}
        </View>

        <Animated.View style={[styles.sparkleContainer, { transform: [{ scale: pulseAnim }] }]}>
          <Text style={styles.sparkle}>✨</Text>
        </Animated.View>

        <View style={styles.textContainer}>
          <Text variant="h2" weight="bold" align="center" style={{ marginBottom: 12 }}>
            AI Magic in Progress
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} align="center" style={{ minHeight: 28 }}>
            {LOADING_MESSAGES[currentMessageIndex]}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: theme.colors.surfaceHighlight }]}>
            <Animated.View style={[styles.progressFill, { width: progressWidth, backgroundColor: theme.colors.primary }]} />
          </View>
        </View>

        <Card style={styles.funFacts} padding="l" variant="elevated">
          <Text variant="body" weight="bold" style={{ marginBottom: 8 }}>
            Did you know? 💡
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} style={{ lineHeight: 22 }}>
            Smiling in photos can increase your perceived attractiveness by up to 40%!
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 48,
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
  },
  sparkleContainer: {
    position: 'absolute',
    top: '25%',
  },
  sparkle: {
    fontSize: 48,
  },
  textContainer: {
    marginBottom: 40,
    alignItems: 'center',
    width: '100%',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 48,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  funFacts: {
    width: '100%',
  },
});
