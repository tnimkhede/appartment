```typescript
import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { useData } from '@/context/DataContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { Notice } from '@/data/mockData';

type FilterType = 'all' | 'notice' | 'event' | 'circular';

export default function NoticesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { notices } = useData();
  const [filter, setFilter] = useState<FilterType>('all');
  const colors = isDark ? Colors.dark : Colors.light;

  const filteredNotices = useMemo(() => {
    if (filter === 'all') return notices;
    return notices.filter(n => n.type === filter);
  }, [notices, filter]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'event': return colors.success;
      case 'notice': return colors.info;
      case 'circular': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string): keyof typeof Feather.glyphMap => {
    switch (type) {
      case 'event': return 'calendar';
      case 'notice': return 'bell';
      case 'circular': return 'file-text';
      default: return 'info';
    }
  };

  const renderFilterTab = (label: string, value: FilterType) => (
    <Pressable
      style={[
        styles.filterTab,
        { backgroundColor: filter === value ? colors.primary : colors.backgroundDefault }
      ]}
      onPress={() => setFilter(value)}
    >
      <ThemedText style={[
        styles.filterTabText,
        { color: filter === value ? '#FFFFFF' : colors.textSecondary }
      ]}>
        {label}
      </ThemedText>
    </Pressable>
  );

  const renderNotice = ({ item }: { item: Notice }) => (
    <Pressable
      style={({ pressed }) => [
        styles.noticeCard,
        { backgroundColor: colors.backgroundDefault, opacity: pressed ? 0.8 : 1 }
      ]}
      onPress={() => navigation.navigate('NoticeDetail', { noticeId: item.id })}
    >
      <View style={styles.noticeHeader}>
        <View style={[styles.typeIcon, { backgroundColor: getTypeColor(item.type) + '20' }]}>
          <Feather name={getTypeIcon(item.type)} size={18} color={getTypeColor(item.type)} />
        </View>
        <View style={styles.headerContent}>
          <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) + '20' }]}>
            <ThemedText style={[styles.typeText, { color: getTypeColor(item.type) }]}>
              {item.type}
            </ThemedText>
          </View>
          <ThemedText style={[styles.noticeDate, { color: colors.textSecondary }]}>
            {item.createdAt}
          </ThemedText>
        </View>
        {item.important ? (
          <View style={[styles.importantBadge, { backgroundColor: colors.error + '20' }]}>
            <Feather name="star" size={12} color={colors.error} />
          </View>
        ) : null}
      </View>

      <ThemedText style={styles.noticeTitle}>{item.title}</ThemedText>
      <ThemedText style={[styles.noticeContent, { color: colors.textSecondary }]} numberOfLines={3}>
        {item.content}
      </ThemedText>

      {item.type === 'event' && item.eventDate ? (
        <View style={[styles.eventDateBadge, { backgroundColor: colors.success + '10', borderColor: colors.success }]}>
          <Feather name="calendar" size={14} color={colors.success} />
          <ThemedText style={[styles.eventDateText, { color: colors.success }]}>
            Event Date: {item.eventDate}
          </ThemedText>
        </View>
      ) : null}

      {item.attachment ? (
        <View style={styles.attachmentInfo}>
          <Feather name="paperclip" size={14} color={colors.textSecondary} />
          <ThemedText style={[styles.attachmentText, { color: colors.textSecondary }]}>
            Attachment available
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.filterContainer, { backgroundColor: colors.backgroundSecondary }]}>
        {renderFilterTab('All', 'all')}
        {renderFilterTab('Notices', 'notice')}
        {renderFilterTab('Events', 'event')}
        {renderFilterTab('Circulars', 'circular')}
      </View>

      <FlatList
        data={filteredNotices}
        keyExtractor={item => item.id}
        renderItem={renderNotice}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="bell-off" size={48} color={colors.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              No notices found
            </ThemedText>
          </View>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: Spacing.sm,
    margin: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  noticeCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  typeIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginBottom: 2,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  noticeDate: {
    fontSize: 12,
  },
  importantBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  noticeContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  eventDateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  eventDateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  attachmentText: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl * 2,
    gap: Spacing.md,
  },
  emptyText: {
    fontSize: 16,
  },
});
