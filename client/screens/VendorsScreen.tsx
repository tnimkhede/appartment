import React from 'react';
import { StyleSheet, View, FlatList, Pressable, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { VENDORS, Vendor } from '@/data/mockData';

export default function VendorsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const getCategoryIcon = (category: string): keyof typeof Feather.glyphMap => {
    switch (category.toLowerCase()) {
      case 'plumbing': return 'droplet';
      case 'electrical': return 'zap';
      case 'housekeeping': return 'home';
      case 'landscaping': return 'sun';
      default: return 'briefcase';
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Feather
          key={i}
          name={i <= rating ? 'star' : 'star'}
          size={12}
          color={i <= rating ? colors.warning : colors.textSecondary}
        />
      );
    }
    return stars;
  };

  const renderVendor = ({ item }: { item: Vendor }) => (
    <View style={[styles.vendorCard, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.vendorHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: colors.primary + '20' }]}>
          <Feather name={getCategoryIcon(item.category)} size={20} color={colors.primary} />
        </View>
        <View style={styles.vendorInfo}>
          <ThemedText style={styles.vendorName}>{item.name}</ThemedText>
          <ThemedText style={[styles.vendorCategory, { color: colors.textSecondary }]}>
            {item.category}
          </ThemedText>
        </View>
        <View style={styles.ratingContainer}>
          <View style={styles.starsRow}>{renderStars(item.rating)}</View>
          <ThemedText style={[styles.ratingText, { color: colors.textSecondary }]}>
            {item.rating.toFixed(1)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.vendorDetails}>
        <View style={styles.detailRow}>
          <Feather name="phone" size={14} color={colors.textSecondary} />
          <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
            {item.phone}
          </ThemedText>
        </View>
        {item.email ? (
          <View style={styles.detailRow}>
            <Feather name="mail" size={14} color={colors.textSecondary} />
            <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
              {item.email}
            </ThemedText>
          </View>
        ) : null}
        {item.contractEnd ? (
          <View style={styles.detailRow}>
            <Feather name="calendar" size={14} color={colors.textSecondary} />
            <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
              Contract ends: {item.contractEnd}
            </ThemedText>
          </View>
        ) : null}
      </View>

      <View style={styles.vendorActions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => Linking.openURL(`tel:${item.phone}`)}
        >
          <Feather name="phone" size={16} color="#FFFFFF" />
          <ThemedText style={styles.actionButtonText}>Call</ThemedText>
        </Pressable>
        {item.email ? (
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.backgroundSecondary, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => Linking.openURL(`mailto:${item.email}`)}
          >
            <Feather name="mail" size={16} color={theme.text} />
            <ThemedText style={styles.actionButtonTextSecondary}>Email</ThemedText>
          </Pressable>
        ) : null}
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={VENDORS}
        keyExtractor={item => item.id}
        renderItem={renderVendor}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: Spacing.lg,
  },
  vendorCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  vendorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vendorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
  },
  vendorCategory: {
    fontSize: 13,
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    marginTop: 2,
  },
  vendorDetails: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: 13,
  },
  vendorActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '500',
  },
});
