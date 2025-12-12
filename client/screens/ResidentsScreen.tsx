import React from 'react';
import { StyleSheet, View, FlatList, Pressable, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { UNITS, USERS, Unit } from '@/data/mockData';

export default function ResidentsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const renderUnit = ({ item }: { item: Unit }) => {
    const owner = USERS.find(u => u.id === item.ownerId);

    return (
      <View style={[styles.unitCard, { backgroundColor: colors.backgroundDefault }]}>
        <View style={styles.unitHeader}>
          <View style={[styles.unitBadge, { backgroundColor: colors.primary + '20' }]}>
            <ThemedText style={[styles.unitNumber, { color: colors.primary }]}>{item.number}</ThemedText>
          </View>
          <View style={styles.unitInfo}>
            <ThemedText style={styles.ownerName}>{owner?.name || 'Unknown'}</ThemedText>
            <ThemedText style={[styles.unitType, { color: colors.textSecondary }]}>
              Block {item.block} - Floor {item.floor} - {item.type}
            </ThemedText>
          </View>
        </View>

        <View style={styles.detailsSection}>
          {owner?.phone ? (
            <View style={styles.detailRow}>
              <Feather name="phone" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{owner.phone}</ThemedText>
            </View>
          ) : null}
          
          {item.familyMembers.length > 0 ? (
            <View style={styles.detailRow}>
              <Feather name="users" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
                {item.familyMembers.length} family member{item.familyMembers.length > 1 ? 's' : ''}
              </ThemedText>
            </View>
          ) : null}

          {item.vehicles.length > 0 ? (
            <View style={styles.detailRow}>
              <Feather name="truck" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
                {item.vehicles.length} vehicle{item.vehicles.length > 1 ? 's' : ''} - {item.vehicles[0].number}
              </ThemedText>
            </View>
          ) : null}

          {item.pets.length > 0 ? (
            <View style={styles.detailRow}>
              <Feather name="heart" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
                {item.pets.map(p => p.name).join(', ')}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => owner?.phone && Linking.openURL(`tel:${owner.phone}`)}
          >
            <Feather name="phone" size={14} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Call</ThemedText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.backgroundSecondary, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Feather name="file-text" size={14} color={theme.text} />
            <ThemedText style={styles.actionButtonTextSecondary}>Details</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
        <View style={styles.summaryContent}>
          <ThemedText style={styles.summaryValue}>{UNITS.length}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Total Units</ThemedText>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
        <View style={styles.summaryContent}>
          <ThemedText style={styles.summaryValue}>{USERS.filter(u => u.role === 'resident').length}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Residents</ThemedText>
        </View>
      </View>

      <FlatList
        data={UNITS}
        keyExtractor={item => item.id}
        renderItem={renderUnit}
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
  summaryCard: {
    flexDirection: 'row',
    margin: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  summaryContent: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 50,
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  unitCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  unitBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  unitNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  unitInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  unitType: {
    fontSize: 12,
    marginTop: 2,
  },
  detailsSection: {
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
  actionButtons: {
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
    fontSize: 13,
    fontWeight: '500',
  },
  actionButtonTextSecondary: {
    fontSize: 13,
    fontWeight: '500',
  },
});
