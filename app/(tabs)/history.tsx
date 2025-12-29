import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Clock, TrendingUp, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useGlow } from '@/contexts/GlowContext';
import { ScanResult } from '@/types';

const getScoreColor = (score: number): string => {
  if (score >= 9) return Colors.accent;
  if (score >= 7.5) return Colors.success;
  if (score >= 6) return Colors.secondary;
  return Colors.coral;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { history, profile, setCurrentScan } = useGlow();

  const handleItemPress = (scan: ScanResult) => {
    setCurrentScan(scan);
    router.push('/results');
  };

  const renderItem = ({ item }: { item: ScanResult }) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      <View style={styles.itemContent}>
        <View style={styles.scoreContainer}>
          <Text style={[styles.score, { color: getScoreColor(item.score) }]}>
            {item.score}
          </Text>
          <Text style={styles.scoreMax}>/10</Text>
        </View>
        <Text style={styles.roastPreview} numberOfLines={1}>
          {item.roast}
        </Text>
        <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text>
      </View>
      <View style={styles.breakdownMini}>
        <View style={styles.miniStat}>
          <Text style={styles.miniLabel}>😊</Text>
          <Text style={styles.miniValue}>{item.breakdown.smile}</Text>
        </View>
        <View style={styles.miniStat}>
          <Text style={styles.miniLabel}>💡</Text>
          <Text style={styles.miniValue}>{item.breakdown.lighting}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Clock color={Colors.textMuted} size={64} />
      </View>
      <Text style={styles.emptyTitle}>No scans yet!</Text>
      <Text style={styles.emptySubtitle}>
        Take your first selfie to see your glow score history here
      </Text>
    </View>
  );

  const bestScore = history.length > 0
    ? Math.max(...history.map(s => s.score))
    : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={[Colors.background, '#1a1a2e', Colors.background]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Text style={styles.title}>History</Text>
        <Text style={styles.subtitle}>Your glow journey ✨</Text>
      </View>

      {history.length > 0 && (
        <View style={styles.statsOverview}>
          <View style={styles.overviewCard}>
            <TrendingUp color={Colors.success} size={20} />
            <Text style={styles.overviewValue}>{profile.averageScore}</Text>
            <Text style={styles.overviewLabel}>Avg Score</Text>
          </View>
          <View style={styles.overviewCard}>
            <Star color={Colors.accent} size={20} />
            <Text style={styles.overviewValue}>{bestScore}</Text>
            <Text style={styles.overviewLabel}>Best Score</Text>
          </View>
          <View style={styles.overviewCard}>
            <Clock color={Colors.primary} size={20} />
            <Text style={styles.overviewValue}>{history.length}</Text>
            <Text style={styles.overviewLabel}>Total</Text>
          </View>
        </View>
      )}

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsOverview: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  overviewValue: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  overviewLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    flexGrow: 1,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: Colors.cardLight,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  score: {
    fontSize: 28,
    fontWeight: '800' as const,
  },
  scoreMax: {
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 2,
  },
  roastPreview: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  breakdownMini: {
    gap: 8,
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniLabel: {
    fontSize: 14,
  },
  miniValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
