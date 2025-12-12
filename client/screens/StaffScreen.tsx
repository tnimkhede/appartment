import React from 'react';
import { StyleSheet, View, FlatList, Pressable, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { STAFF, Staff } from '@/data/mockData';

export default function StaffScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const getRoleIcon = (role: string): keyof typeof Feather.glyphMap => {
    switch (role.toLowerCase()) {
      case 'security guard': return 'shield';
      case 'housekeeping': return 'home';
      case 'maintenance': return 'tool';
      default: return 'user';
    }
  };

  const getLatestAttendance = (staff: Staff) => {
    if (staff.attendance.length === 0) return null;
    return staff.attendance[0];
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return colors.success;
      case 'absent': return colors.error;
      case 'leave': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const renderStaff = ({ item }: { item: Staff }) => {
    const latestAttendance = getLatestAttendance(item);

    return (
      <View style={[styles.staffCard, { backgroundColor: colors.backgroundDefault }]}>
        <View style={styles.staffHeader}>
          <View style={[styles.staffIcon, { backgroundColor: colors.primary + '20' }]}>
            <Feather name={getRoleIcon(item.role)} size={20} color={colors.primary} />
          </View>
          <View style={styles.staffInfo}>
            <ThemedText style={styles.staffName}>{item.name}</ThemedText>
            <ThemedText style={[styles.staffRole, { color: colors.textSecondary }]}>{item.role}</ThemedText>
          </View>
          {latestAttendance ? (
            <View style={[styles.statusBadge, { backgroundColor: getAttendanceColor(latestAttendance.status) + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: getAttendanceColor(latestAttendance.status) }]} />
              <ThemedText style={[styles.statusText, { color: getAttendanceColor(latestAttendance.status) }]}>
                {latestAttendance.status}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Feather name="phone" size={14} color={colors.textSecondary} />
            <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{item.phone}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <Feather name="clock" size={14} color={colors.textSecondary} />
            <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{item.shift}</ThemedText>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.success, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => Linking.openURL(`tel:${item.phone}`)}
          >
            <Feather name="phone" size={14} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Call</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  };

  const presentCount = STAFF.filter(s => getLatestAttendance(s)?.status === 'present').length;
  const absentCount = STAFF.filter(s => getLatestAttendance(s)?.status === 'absent').length;
  const leaveCount = STAFF.filter(s => getLatestAttendance(s)?.status === 'leave').length;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.summarySection, { backgroundColor: colors.backgroundDefault }]}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: colors.success + '20' }]}>
            <Feather name="check-circle" size={16} color={colors.success} />
          </View>
          <ThemedText style={styles.summaryValue}>{presentCount}</ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>Present</ThemedText>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: colors.error + '20' }]}>
            <Feather name="x-circle" size={16} color={colors.error} />
          </View>
          <ThemedText style={styles.summaryValue}>{absentCount}</ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>Absent</ThemedText>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: colors.warning + '20' }]}>
            <Feather name="calendar" size={16} color={colors.warning} />
          </View>
          <ThemedText style={styles.summaryValue}>{leaveCount}</ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>On Leave</ThemedText>
        </View>
      </View>

      <FlatList
        data={STAFF}
        keyExtractor={item => item.id}
        renderItem={renderStaff}
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
  summarySection: {
    flexDirection: 'row',
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  staffCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  staffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  staffIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
  },
  staffRole: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
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
});
