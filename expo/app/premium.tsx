import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Crown,
  Infinity,
  BarChart3,
  Zap,
  Star,
  Check,
  Sparkles,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import { useGlow } from '@/contexts/GlowContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

const FEATURES = [
  { icon: Infinity, title: 'Unlimited Scans', description: 'No daily limits ever' },
  { icon: BarChart3, title: 'Detailed Reports', description: 'In-depth analysis & trends' },
  { icon: Zap, title: 'Priority Processing', description: 'Faster AI analysis' },
  { icon: Star, title: 'Exclusive Tips', description: 'Pro-level glow advice' },
];

export default function PremiumScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { upgradeToPremium, profile } = useGlow();

  const handleClose = () => {
    router.back();
  };

  const handlePurchase = async (type: 'monthly' | 'lifetime') => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    upgradeToPremium();
    router.back();
  };

  if (profile.isPremium) {
    return (
      <Screen>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X color={theme.colors.textPrimary} size={24} />
        </TouchableOpacity>
        <View style={styles.alreadyPremium}>
          <Crown color={theme.colors.accent} size={64} />
          <Text variant="h1" weight="bold" style={{ marginTop: 24, marginBottom: 12 }}>
            You are Premium! 👑
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} align="center">
            Enjoy unlimited scans and all premium features
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen safeArea={false}>
      <TouchableOpacity 
        style={[styles.closeButton, { top: insets.top + 16 }]} 
        onPress={handleClose}
      >
        <X color={theme.colors.textPrimary} size={24} />
      </TouchableOpacity>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 32 }
        ]}
      >
        <View style={styles.header}>
          <View style={[styles.crownBadge, { backgroundColor: theme.colors.surfaceHighlight }]}>
            <Crown color={theme.colors.accent} size={48} />
          </View>
          <Text variant="h1" weight="bold" align="center" style={{ marginBottom: 8 }}>
            GlowRate Pro
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} align="center">
            Unlock your full glow potential ✨
          </Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((feature, index) => (
            <Card key={index} style={styles.featureCard} padding="m" variant="outlined">
              <View style={[styles.featureIcon, { backgroundColor: theme.colors.surfaceHighlight }]}>
                <feature.icon color={theme.colors.primary} size={24} />
              </View>
              <View style={styles.featureContent}>
                <Text variant="body" weight="bold">{feature.title}</Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {feature.description}
                </Text>
              </View>
              <Check color={theme.colors.success} size={20} />
            </Card>
          ))}
        </View>

        <View style={styles.plans}>
          <TouchableOpacity 
            onPress={() => handlePurchase('monthly')}
            activeOpacity={0.9}
          >
            <Card style={styles.planCard} padding="l" variant="elevated">
              <View style={styles.planHeader}>
                <Text variant="h3" weight="semibold">Monthly</Text>
                <View style={styles.priceRow}>
                  <Text variant="h2" weight="bold">$7.99</Text>
                  <Text variant="body" color={theme.colors.textSecondary}>/mo</Text>
                </View>
              </View>
              <Text variant="caption" color={theme.colors.textSecondary}>
                Cancel anytime. Billed monthly.
              </Text>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => handlePurchase('lifetime')}
            activeOpacity={0.9}
          >
            <View style={[styles.bestBadge, { backgroundColor: theme.colors.accent }]}>
              <Sparkles color="#000" size={12} />
              <Text variant="label" weight="bold" color="#000" style={{ fontSize: 10 }}>
                BEST VALUE
              </Text>
            </View>
            <Card 
              style={[styles.planCard, { borderColor: theme.colors.accent, borderWidth: 2 }]} 
              padding="l"
            >
              <View style={styles.planHeader}>
                <Text variant="h3" weight="semibold">Lifetime</Text>
                <View style={styles.priceRow}>
                  <Text variant="h2" weight="bold">$29.99</Text>
                  <Text variant="body" color={theme.colors.textSecondary}>once</Text>
                </View>
              </View>
              <Text variant="caption" color={theme.colors.textSecondary}>
                One-time payment. Yours forever!
              </Text>
            </Card>
          </TouchableOpacity>
        </View>

        <Card style={styles.guarantee} padding="m">
          <Text variant="body" weight="bold" align="center" style={{ marginBottom: 4 }}>
            💯 Satisfaction Guaranteed
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary} align="center">
            Not happy? Contact us within 7 days for a full refund.
          </Text>
        </Card>

        <Text variant="caption" color={theme.colors.textTertiary} align="center" style={{ marginTop: 16 }}>
          Payment will be charged to your account. Subscription automatically
          renews unless cancelled 24 hours before the end of the current period.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  crownBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  features: {
    gap: 12,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  plans: {
    gap: 20,
    marginBottom: 24,
  },
  planCard: {
    borderRadius: 20,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  bestBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  guarantee: {
    marginTop: 8,
  },
  alreadyPremium: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
});
