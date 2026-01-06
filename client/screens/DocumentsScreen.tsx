
import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { useData } from '@/context/DataContext';
import { Document } from '@/data/mockData';

type CategoryFilter = 'all' | 'rules' | 'minutes' | 'budget' | 'contract' | 'other';

export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { documents } = useData();
  const [filter, setFilter] = useState<CategoryFilter>('all');
  const colors = isDark ? Colors.dark : Colors.light;

  const filteredDocs = filter === 'all' ? documents : documents.filter(d => d.category === filter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rules': return colors.primary;
      case 'minutes': return colors.success;
      case 'budget': return colors.warning;
      case 'contract': return colors.error;
      default: return colors.info;
    }
  };

  const getCategoryIcon = (category: string): keyof typeof Feather.glyphMap => {
    switch (category) {
      case 'rules': return 'book';
      case 'minutes': return 'file-text';
      case 'budget': return 'dollar-sign';
      case 'contract': return 'file';
      default: return 'folder';
    }
  };

  const renderFilterChip = (label: string, value: CategoryFilter) => (
    <Pressable
      style={[
        styles.filterChip,
        {
          backgroundColor: filter === value ? colors.primary : colors.backgroundDefault,
          borderColor: filter === value ? colors.primary : colors.border,
        }
      ]}
      onPress={() => setFilter(value)}
    >
      <ThemedText style={[
        styles.filterChipText,
        { color: filter === value ? '#FFFFFF' : colors.textSecondary }
      ]}>
        {label}
      </ThemedText>
    </Pressable>
  );

  const renderDocument = ({ item }: { item: Document }) => {
    const categoryColor = getCategoryColor(item.category);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.documentCard,
          { backgroundColor: colors.backgroundDefault, opacity: pressed ? 0.8 : 1 }
        ]}
      >
        <View style={[styles.documentIcon, { backgroundColor: categoryColor + '20' }]}>
          <Feather name={getCategoryIcon(item.category)} size={20} color={categoryColor} />
        </View>
        <View style={styles.documentInfo}>
          <ThemedText style={styles.documentTitle}>{item.title}</ThemedText>
          <View style={styles.documentMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <ThemedText style={[styles.categoryText, { color: categoryColor }]}>
                {item.category}
              </ThemedText>
            </View>
            <ThemedText style={[styles.uploadDate, { color: colors.textSecondary }]}>
              {item.uploadedAt}
            </ThemedText>
          </View>
        </View>
        <View style={[styles.fileTypeBadge, { backgroundColor: colors.backgroundSecondary }]}>
          <ThemedText style={[styles.fileTypeText, { color: colors.textSecondary }]}>
            {item.fileType.toUpperCase()}
          </ThemedText>
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          data={[
            { label: 'All', value: 'all' },
            { label: 'Rules', value: 'rules' },
            { label: 'Minutes', value: 'minutes' },
            { label: 'Budget', value: 'budget' },
            { label: 'Contracts', value: 'contract' },
          ]}
          keyExtractor={item => item.value}
          renderItem={({ item }) => renderFilterChip(item.label, item.value as CategoryFilter)}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <FlatList
        data={filteredDocs}
        keyExtractor={item => item.id}
        renderItem={renderDocument}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="folder" size={48} color={colors.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              No documents found
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
    paddingVertical: Spacing.md,
  },
  filterList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  documentIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  uploadDate: {
    fontSize: 11,
  },
  fileTypeBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  fileTypeText: {
    fontSize: 10,
    fontWeight: '600',
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
