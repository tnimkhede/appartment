import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { useData } from '@/context/DataContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { UNITS, VISITORS, STAFF } from '@/data/mockData';

export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { bills, tickets } = useData();
  const colors = isDark ? Colors.dark : Colors.light;

  const totalCollection = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + b.amount, 0);
  const pendingDues = bills.filter(b => b.status !== 'paid').reduce((sum, b) => sum + b.amount, 0);
  const openTickets = tickets.filter(t => t.status === 'open').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
  const visitorCount = VISITORS.length;
  const staffPresent = STAFF.filter(s => s.attendance.some(a => a.status === 'present')).length;

  const renderStatCard = (
    icon: keyof typeof Feather.glyphMap,
    label: string,
    value: string | number,
    color: string,
    subtitle?: string
  ) => (
    <View style={[styles.statCard, { backgroundColor: colors.backgroundDefault }]}>
      <View style={[styles.statIcon, { backgroundColor: color + '20' }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <ThemedText style={styles.statValue}>{value}</ThemedText>
      <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</ThemedText>
      {subtitle ? (
        <ThemedText style={[styles.statSubtitle, { color: colors.textSecondary }]}>{subtitle}</ThemedText>
      ) : null}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText style={styles.sectionTitle}>Financial Overview</ThemedText>
        <View style={styles.statsGrid}>
          {renderStatCard('dollar-sign', 'Total Collection', `$${totalCollection.toLocaleString()}`, colors.success)}
          {renderStatCard('alert-circle', 'Pending Dues', `$${pendingDues.toLocaleString()}`, colors.error)}
        </View>

        <ThemedText style={styles.sectionTitle}>Maintenance Tickets</ThemedText>
        <View style={styles.statsGrid}>
          {renderStatCard('alert-triangle', 'Open Tickets', openTickets, colors.warning)}
          {renderStatCard('check-circle', 'Resolved', resolvedTickets, colors.success)}
        </View>

        <ThemedText style={styles.sectionTitle}>Visitor Statistics</ThemedText>
        <View style={styles.statsGrid}>
          {renderStatCard('users', 'Total Visitors', visitorCount, colors.info, 'This month')}
          {renderStatCard('package', 'Deliveries', VISITORS.filter(v => v.type === 'delivery').length, colors.primary)}
        </View>

        <ThemedText style={styles.sectionTitle}>Staff & Operations</ThemedText>
        <View style={styles.statsGrid}>
          {renderStatCard('user-check', 'Staff Present', `${staffPresent}/${STAFF.length}`, colors.success)}
          {renderStatCard('home', 'Total Units', UNITS.length, colors.primary)}
        </View>

        <View style={[styles.chartPlaceholder, { backgroundColor: colors.backgroundDefault, borderColor: colors.border }]}>
          <Feather name="bar-chart-2" size={48} color={colors.textSecondary} />
          <ThemedText style={[styles.chartText, { color: colors.textSecondary }]}>
            Detailed analytics charts
          </ThemedText>
          <ThemedText style={[styles.chartSubtext, { color: colors.textSecondary }]}>
            Monthly trends and comparisons
          </ThemedText>
        </View>

        <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryValue}>{(totalCollection / (totalCollection + pendingDues) * 100).toFixed(0)}%</ThemedText>
              <ThemedText style={styles.summaryLabel}>Collection Rate</ThemedText>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            <View style={styles.summaryItem}>
              <ThemedText style={styles.summaryValue}>{(resolvedTickets / (openTickets + resolvedTickets) * 100).toFixed(0)}%</ThemedText>
              <ThemedText style={styles.summaryLabel}>Resolution Rate</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  chartPlaceholder: {
    padding: Spacing.xxl,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    marginTop: Spacing.xl,
  },
  chartText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: Spacing.md,
  },
  chartSubtext: {
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  summaryCard: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
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
  },
});
