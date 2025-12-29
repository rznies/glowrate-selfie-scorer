import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import Colors from '@/constants/colors';
import { useGlow } from '@/contexts/GlowContext';

const FEATURES = [
  { icon: Infinity, title: 'Unlimited Scans', description: 'No daily limits ever' },
  { icon: BarChart3, title: 'Detailed Reports', description: 'In-depth analysis & trends' },
  { icon: Zap, title: 'Priority Processing', description: 'Faster AI analysis' },
  { icon: Star, title: 'Exclusive Tips', description: 'Pro-level glow advice' },
];

export default function PremiumScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={[Colors.background, '#1a1a2e', Colors.background]}
          style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X color={Colors.text} size={24} />
        </TouchableOpacity>
        <View style={styles.alreadyPremium}>
          <Crown color={Colors.accent} size={64} />
          <Text style={styles.alreadyTitle}>You are Premium! 👑</Text>
          <Text style={styles.alreadySubtitle}>
            Enjoy unlimited scans and all premium features
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.background, '#1a1a2e', '#0f0f1a']}
        style={StyleSheet.absoluteFill}
      />

      <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
        <X color={Colors.text} size={24} />
      </TouchableOpacity>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
      >
        <View style={styles.header}>
          <View style={styles.crownContainer}>
            <LinearGradient
              colors={[...Colors.gradient.gold]}
              style={styles.crownGradient}
            >
              <Crown color="#000" size={48} />
            </LinearGradient>
          </View>
          <Text style={styles.title}>GlowRate Pro</Text>
          <Text style={styles.subtitle}>
            Unlock your full glow potential ✨
          </Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <feature.icon color={Colors.accent} size={24} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Check color={Colors.success} size={20} />
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          <TouchableOpacity 
            style={styles.planCard}
            onPress={() => handlePurchase('monthly')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(168, 85, 247, 0.2)', 'rgba(255, 107, 157, 0.2)']}
              style={styles.planGradient}
            >
              <View style={styles.planHeader}>
                <Text style={styles.planName}>Monthly</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.currency}>$</Text>
                  <Text style={styles.price}>7.99</Text>
                  <Text style={styles.period}>/mo</Text>
                </View>
              </View>
              <Text style={styles.planDescription}>
                Cancel anytime. Billed monthly.
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.planCard, styles.bestValue]}
            onPress={() => handlePurchase('lifetime')}
            activeOpacity={0.9}
          >
            <View style={styles.bestBadge}>
              <Sparkles color="#000" size={12} />
              <Text style={styles.bestText}>BEST VALUE</Text>
            </View>
            <LinearGradient
              colors={[...Colors.gradient.gold]}
              style={styles.planGradient}
            >
              <View style={styles.planHeader}>
                <Text style={[styles.planName, styles.darkText]}>Lifetime</Text>
                <View style={styles.priceRow}>
                  <Text style={[styles.currency, styles.darkText]}>$</Text>
                  <Text style={[styles.price, styles.darkText]}>29.99</Text>
                  <Text style={[styles.period, styles.darkText]}>once</Text>
                </View>
              </View>
              <Text style={[styles.planDescription, styles.darkText]}>
                One-time payment. Yours forever!
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.guarantee}>
          <Text style={styles.guaranteeTitle}>💯 Satisfaction Guaranteed</Text>
          <Text style={styles.guaranteeText}>
            Not happy? Contact us within 7 days for a full refund.
          </Text>
        </View>

        <Text style={styles.legal}>
          Payment will be charged to your account. Subscription automatically
          renews unless cancelled 24 hours before the end of the current period.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  crownContainer: {
    marginBottom: 20,
  },
  crownGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  features: {
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: {
    flex: 1,
    marginLeft: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  featureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  plans: {
    gap: 16,
    marginBottom: 24,
  },
  planCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  bestValue: {
    borderColor: Colors.accent,
  },
  bestBadge: {
    position: 'absolute',
    top: -1,
    right: 20,
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
  },
  bestText: {
    fontSize: 10,
    fontWeight: '800' as const,
    color: '#000',
  },
  planGradient: {
    padding: 24,
  },
  planHeader: {
    marginBottom: 8,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  price: {
    fontSize: 48,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  period: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  planDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  darkText: {
    color: '#000',
  },
  guarantee: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guaranteeTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  guaranteeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  legal: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  alreadyPremium: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  alreadyTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  alreadySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
