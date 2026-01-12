import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Crown,
  Zap,
  Star,
  TrendingUp,
  Camera,
  ChevronRight,
  Sparkles,
  Shield,
  Bell,
  HelpCircle,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { useGlow } from '@/contexts/GlowContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { profile } = useGlow();
  const theme = useTheme();

  // Create local Colors mapping for compatibility
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

  const styles = createStyles(Colors);

  const handleUpgradePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/premium');
  };

  const statsData = [
    { icon: Camera, label: 'Total Scans', value: profile.totalScans, color: Colors.primary },
    { icon: Star, label: 'Avg Score', value: profile.averageScore || '-', color: Colors.accent },
    { icon: TrendingUp, label: 'Day Streak', value: profile.streak, color: Colors.success },
    { icon: Zap, label: 'Glow Points', value: profile.totalScans * 10, color: Colors.secondary },
  ];

  const menuItems = [
    { icon: Bell, label: 'Notifications', subtitle: 'Manage alerts' },
    { icon: Shield, label: 'Privacy', subtitle: 'Your data settings' },
    { icon: HelpCircle, label: 'Help & Support', subtitle: 'Get assistance' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.background, '#1a1a2e', Colors.background]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[...Colors.gradient.primary]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>✨</Text>
            </LinearGradient>
            {profile.isPremium && (
              <View style={styles.crownBadge}>
                <Crown color={Colors.accent} size={16} fill={Colors.accent} />
              </View>
            )}
          </View>
          <Text style={styles.username}>Glow User</Text>
          <Text style={styles.memberStatus}>
            {profile.isPremium ? '👑 Premium Member' : '🌟 Free Member'}
          </Text>
        </View>

        {!profile.isPremium && (
          <TouchableOpacity
            style={styles.upgradeCard}
            onPress={handleUpgradePress}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[...Colors.gradient.gold]}
              style={styles.upgradeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.upgradeContent}>
                <View style={styles.upgradeHeader}>
                  <Crown color="#000" size={28} />
                  <View style={styles.upgradeTextContainer}>
                    <Text style={styles.upgradeTitle}>Unlock Premium</Text>
                    <Text style={styles.upgradeSubtitle}>
                      Unlimited scans & detailed reports
                    </Text>
                  </View>
                </View>
                <ChevronRight color="#000" size={24} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.statsGrid}>
          {statsData.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <stat.icon color={stat.color} size={24} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.dailyScansCard}>
          <View style={styles.dailyHeader}>
            <Sparkles color={Colors.primary} size={20} />
            <Text style={styles.dailyTitle}>Daily Scans</Text>
          </View>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: profile.isPremium
                      ? '100%'
                      : `${(profile.dailyScansUsed / profile.dailyScansLimit) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {profile.isPremium
                ? '∞ Unlimited'
                : `${profile.dailyScansUsed}/${profile.dailyScansLimit} used`}
            </Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} activeOpacity={0.7}>
              <View style={styles.menuIconContainer}>
                <item.icon color={Colors.textSecondary} size={22} />
              </View>
              <View style={styles.menuContent}>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight color={Colors.textMuted} size={20} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>GlowRate v1.0.0</Text>
          <Text style={styles.footerSubtext}>Master your glow, one selfie at a time</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(Colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    title: {
      fontSize: 32,
      fontWeight: '800' as const,
      color: Colors.text,
    },
    profileCard: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      fontSize: 48,
    },
    crownBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: Colors.card,
      borderRadius: 16,
      padding: 6,
      borderWidth: 2,
      borderColor: Colors.accent,
    },
    username: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: Colors.text,
      marginTop: 16,
    },
    memberStatus: {
      fontSize: 14,
      color: Colors.textSecondary,
      marginTop: 4,
    },
    upgradeCard: {
      marginHorizontal: 16,
      borderRadius: 20,
      overflow: 'hidden',
      marginBottom: 24,
    },
    upgradeGradient: {
      padding: 20,
    },
    upgradeContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    upgradeHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    upgradeTextContainer: {
      flex: 1,
    },
    upgradeTitle: {
      fontSize: 18,
      fontWeight: '800' as const,
      color: '#000',
    },
    upgradeSubtitle: {
      fontSize: 13,
      color: 'rgba(0,0,0,0.7)',
      marginTop: 2,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 12,
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      width: '47%',
      backgroundColor: Colors.card,
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
      gap: 8,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    statValue: {
      fontSize: 28,
      fontWeight: '700' as const,
      color: Colors.text,
    },
    statLabel: {
      fontSize: 13,
      color: Colors.textSecondary,
    },
    dailyScansCard: {
      marginHorizontal: 16,
      backgroundColor: Colors.card,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    dailyHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 16,
    },
    dailyTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: Colors.text,
    },
    progressContainer: {
      gap: 8,
    },
    progressBar: {
      height: 8,
      backgroundColor: Colors.cardLight,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: Colors.primary,
      borderRadius: 4,
    },
    progressText: {
      fontSize: 13,
      color: Colors.textSecondary,
      textAlign: 'right',
    },
    menuSection: {
      paddingHorizontal: 16,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: Colors.text,
      marginBottom: 12,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Colors.card,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    menuIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: Colors.cardLight,
      justifyContent: 'center',
      alignItems: 'center',
    },
    menuContent: {
      flex: 1,
      marginLeft: 12,
    },
    menuLabel: {
      fontSize: 15,
      fontWeight: '600' as const,
      color: Colors.text,
    },
    menuSubtitle: {
      fontSize: 13,
      color: Colors.textMuted,
      marginTop: 2,
    },
    footer: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingBottom: 100,
    },
    footerText: {
      fontSize: 13,
      color: Colors.textMuted,
    },
    footerSubtext: {
      fontSize: 12,
      color: Colors.textMuted,
      marginTop: 4,
    },
  });
}
