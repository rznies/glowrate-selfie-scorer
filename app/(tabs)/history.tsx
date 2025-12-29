import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, ChevronRight } from 'lucide-react-native';

import { useGlow } from '@/contexts/GlowContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Screen } from '@/components/ui/Screen';
import { Text } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import { ScanResult } from '@/types';

export default function HistoryScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { history, setCurrentScan } = useGlow();

  const handlePressScan = (scan: ScanResult) => {
    setCurrentScan(scan);
    router.push('/results');
  };

  const renderItem = ({ item }: { item: ScanResult }) => {
    const date = new Date(item.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const getScoreColor = (score: number) => {
      if (score >= 9) return theme.colors.primary;
      if (score >= 7) return theme.colors.success;
      if (score >= 5) return theme.colors.warning;
      return theme.colors.textSecondary;
    };

    return (
      <TouchableOpacity 
        onPress={() => handlePressScan(item)}
        activeOpacity={0.7}
      >
        <Card style={styles.historyCard} padding="s">
          <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
          
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={[styles.scoreBadge, { backgroundColor: theme.colors.surfaceHighlight }]}>
                <Text variant="h3" weight="bold" color={getScoreColor(item.score)}>
                  {item.score.toFixed(1)}
                </Text>
              </View>
              <View style={styles.dateContainer}>
                <Calendar size={12} color={theme.colors.textTertiary} />
                <Text variant="caption" color={theme.colors.textTertiary}>{date}</Text>
              </View>
            </View>
            
            <Text 
              variant="body" 
              numberOfLines={1} 
              color={theme.colors.textSecondary}
              style={{ marginTop: 4 }}
            >
              {item.roast}
            </Text>
          </View>

          <ChevronRight size={20} color={theme.colors.textTertiary} />
        </Card>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { backgroundColor: theme.colors.surfaceHighlight }]}>
        <Calendar size={32} color={theme.colors.textSecondary} />
      </View>
      <Text variant="h3" weight="semibold" style={{ marginTop: 16 }}>
        No History Yet
      </Text>
      <Text variant="body" color={theme.colors.textSecondary} align="center" style={{ marginTop: 8 }}>
        Snap your first selfie to start tracking your glow up journey!
      </Text>
    </View>
  );

  return (
    <Screen safeArea={false}>
      <View style={[styles.header, { paddingTop: insets.top + theme.spacing.l }]}>
        <Text variant="h1" weight="bold">History</Text>
      </View>
      
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  listContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#333',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
