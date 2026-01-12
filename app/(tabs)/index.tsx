import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Sparkles, Zap, Crown, Trophy, TrendingUp, History, LucideIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useGlow } from '@/contexts/GlowContext';
import { DAILY_CHALLENGES } from '@/mocks/glowData';
import { useTheme } from '@/contexts/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { profile, canScan, scansRemaining } = useGlow();
  
  const handleSnapPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    if (canScan) {
      router.push('/camera');
    } else {
      router.push('/premium');
    }
  };

  const StatItem = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) => (
    <View style={styles.statItem}>
      <View style={[styles.statIconContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
        <Icon size={16} color={theme.colors.primary} />
      </View>
      <View>
        <Text variant="h2" weight="bold">{value}</Text>
        <Text variant="caption" color={theme.colors.textSecondary}>{label}</Text>
      </View>
    </View>
  );

  return (
    <Screen safeArea={false}>
      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + theme.spacing.xl, paddingBottom: 120 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.logoRow}>
              <Text variant="h1" weight="bold">GlowRate</Text>
              <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                <Text variant="caption" weight="bold" color="#000">BETA</Text>
              </View>
            </View>
            <Text variant="body" color={theme.colors.textSecondary}>
              Ready to check your vibe?
            </Text>
          </View>
          
          {profile.isPremium && (
            <View style={[styles.premiumBadge, { borderColor: theme.colors.accent }]}>
              <Crown color={theme.colors.accent} size={14} />
              <Text variant="caption" weight="bold" color={theme.colors.accent}>PRO</Text>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <StatItem 
                icon={History} 
                label="Scans" 
                value={profile.totalScans} 
              />
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <StatItem 
                icon={TrendingUp} 
                label="Avg Score" 
                value={profile.averageScore || '-'} 
              />
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              <StatItem 
                icon={Trophy} 
                label="Streak" 
                value={profile.streak} 
              />
            </View>
          </Card>
        </View>

        {/* Main Action Area */}
        <View style={styles.actionArea}>
          <TouchableOpacity
            onPress={handleSnapPress}
            activeOpacity={0.9}
            style={[
              styles.mainButton,
              { 
                backgroundColor: canScan ? theme.colors.primary : theme.colors.surfaceHighlight,
                shadowColor: canScan ? theme.colors.primary : 'transparent',
              }
            ]}
          >
            <Camera 
              color={canScan ? theme.colors.primaryForeground : theme.colors.textSecondary} 
              size={42} 
              strokeWidth={2}
            />
            <View style={styles.mainButtonText}>
              <Text 
                variant="h3" 
                weight="bold" 
                color={canScan ? theme.colors.primaryForeground : theme.colors.textSecondary}
              >
                SNAP
              </Text>
              {!canScan && (
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Limit reached
                </Text>
              )}
            </View>
          </TouchableOpacity>

          {!profile.isPremium && (
            <View style={[styles.limitBadge, { backgroundColor: theme.colors.surfaceHighlight }]}>
              <Zap size={14} color={theme.colors.warning} fill={theme.colors.warning} />
              <Text variant="caption" weight="medium">
                {scansRemaining} free {scansRemaining === 1 ? 'scan' : 'scans'} remaining
              </Text>
            </View>
          )}
        </View>

        {/* Challenges Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="h3" weight="semibold">Daily Goals</Text>
            <Text variant="caption" color={theme.colors.textTertiary}>Resets in 4h</Text>
          </View>
          
          <View style={styles.challengesList}>
            {DAILY_CHALLENGES.slice(0, 3).map((challenge) => (
              <Card key={challenge.id} style={styles.challengeCard}>
                <View style={styles.challengeLeft}>
                  <View style={[styles.emojiContainer, { backgroundColor: theme.colors.surfaceHighlight }]}>
                    <Text style={{ fontSize: 20 }}>{challenge.emoji}</Text>
                  </View>
                  <View>
                    <Text variant="body" weight="medium">{challenge.title}</Text>
                    <Text variant="caption" color={theme.colors.accent}>
                      {challenge.reward}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.checkbox, 
                  { 
                    borderColor: theme.colors.border,
                    backgroundColor: challenge.completed ? theme.colors.success : 'transparent',
                    borderWidth: challenge.completed ? 0 : 2
                  }
                ]}>
                  {challenge.completed && <Sparkles size={12} color="#000" />}
                </View>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
  statsGrid: {
    marginBottom: 40,
  },
  statsCard: {
    paddingVertical: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  divider: {
    width: 1,
    height: 32,
  },
  actionArea: {
    alignItems: 'center',
    marginBottom: 48,
  },
  mainButton: {
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: width * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 24,
  },
  mainButtonText: {
    alignItems: 'center',
  },
  limitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  challengesList: {
    gap: 12,
  },
  challengeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  challengeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
