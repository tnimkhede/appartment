import React from 'react';
import { StyleSheet, View, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { useTheme } from '@/hooks/useTheme';
import { useAuth, getRoleColor, getRoleLabel } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';

export default function DashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const headerHeight = useHeaderHeight();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { units, visitors, tickets, bills, notices, polls } = useData();
  const colors = isDark ? Colors.dark : Colors.light;

  if (!user) return null;

  const userUnit = units.find(u => u.ownerId === user.id);
  const userBills = bills.filter(b => b.unitId === userUnit?.id);
  const pendingBills = userBills.filter(b => b.status !== 'paid');
  const pendingAmount = pendingBills.reduce((sum, b) => sum + b.amount, 0);
  const userTickets = tickets.filter(t => t.unitId === userUnit?.id || user.role === 'maintenance' || user.role === 'management');
  const openTickets = userTickets.filter(t => t.status !== 'resolved');
  const activeVisitors = VISITORS.filter(v => !v.checkOutTime);
  const upcomingEvents = notices.filter(n => n.type === 'event');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const roleColor = getRoleColor(user.role, isDark);

  const renderQuickAction = (icon: keyof typeof Feather.glyphMap, label: string, onPress: () => void, color?: string) => (
    <Pressable
      style={({ pressed }) => [
        styles.quickAction,
        { backgroundColor: colors.backgroundDefault, opacity: pressed ? 0.7 : 1 }
      ]}
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: (color || colors.primary) + '20' }]}>
        <Feather name={icon} size={20} color={color || colors.primary} />
      </View>
      <ThemedText style={styles.quickActionLabel}>{label}</ThemedText>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight + Spacing.lg, paddingBottom: tabBarHeight + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <ThemedText style={[styles.greeting, { color: colors.textSecondary }]}>{getGreeting()}</ThemedText>
            <ThemedText style={styles.userName}>{user.name}</ThemedText>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + '20' }]}>
            <ThemedText style={[styles.roleText, { color: roleColor }]}>{getRoleLabel(user.role)}</ThemedText>
          </View>
        </View>

        {user.role === 'resident' && pendingAmount > 0 ? (
          <Pressable
            style={({ pressed }) => [
              styles.alertBanner,
              { backgroundColor: colors.warning + '20', borderColor: colors.warning, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => navigation.navigate('PaymentsTab')}
          >
            <Feather name="alert-triangle" size={20} color={colors.warning} />
            <View style={styles.alertContent}>
              <ThemedText style={styles.alertTitle}>Payment Due</ThemedText>
              <ThemedText style={[styles.alertText, { color: colors.textSecondary }]}>
                Total pending: ${pendingAmount.toLocaleString()}
              </ThemedText>
            </View>
            <Feather name="chevron-right" size={20} color={colors.warning} />
          </Pressable>
        ) : null}

        <View style={styles.statsGrid}>
          {user.role === 'resident' ? (
            <>
              <Card style={styles.statCard} onPress={() => navigation.navigate('PaymentsTab')}>
                <View style={[styles.statIcon, { backgroundColor: colors.error + '20' }]}>
                  <Feather name="credit-card" size={20} color={colors.error} />
                </View>
                <ThemedText style={styles.statValue}>${pendingAmount.toLocaleString()}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Pending Bills</ThemedText>
              </Card>
              <Card style={styles.statCard} onPress={() => navigation.navigate('TicketsTab')}>
                <View style={[styles.statIcon, { backgroundColor: colors.warning + '20' }]}>
                  <Feather name="alert-circle" size={20} color={colors.warning} />
                </View>
                <ThemedText style={styles.statValue}>{openTickets.length}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Open Tickets</ThemedText>
              </Card>
            </>
          ) : null}

          {user.role === 'security' ? (
            <>
              <Card style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
                  <Feather name="users" size={20} color={colors.success} />
                </View>
                <ThemedText style={styles.statValue}>{activeVisitors.length}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Active Visitors</ThemedText>
              </Card>
              <Card style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: colors.info + '20' }]}>
                  <Feather name="package" size={20} color={colors.info} />
                </View>
                <ThemedText style={styles.statValue}>{VISITORS.filter(v => v.type === 'delivery').length}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Deliveries Today</ThemedText>
              </Card>
            </>
          ) : null}

          {user.role === 'maintenance' ? (
            <>
              <Card style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: colors.error + '20' }]}>
                  <Feather name="alert-circle" size={20} color={colors.error} />
                </View>
                <ThemedText style={styles.statValue}>{tickets.filter(t => t.status === 'open').length}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Open Tickets</ThemedText>
              </Card>
              <Card style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: colors.warning + '20' }]}>
                  <Feather name="clock" size={20} color={colors.warning} />
                </View>
                <ThemedText style={styles.statValue}>{tickets.filter(t => t.status === 'in-progress').length}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>In Progress</ThemedText>
              </Card>
            </>
          ) : null}

          {user.role === 'management' ? (
            <>
              <Card style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: colors.success + '20' }]}>
                  <Feather name="dollar-sign" size={20} color={colors.success} />
                </View>
                <ThemedText style={styles.statValue}>${bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0).toLocaleString()}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Collected</ThemedText>
              </Card>
              <Card style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: colors.error + '20' }]}>
                  <Feather name="alert-triangle" size={20} color={colors.error} />
                </View>
                <ThemedText style={styles.statValue}>{tickets.filter(t => t.status === 'open').length}</ThemedText>
                <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Open Issues</ThemedText>
              </Card>
            </>
          ) : null}

          <Card style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="calendar" size={20} color={colors.primary} />
            </View>
            <ThemedText style={styles.statValue}>{upcomingEvents.length}</ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>Upcoming Events</ThemedText>
          </Card>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
          <View style={styles.quickActionsGrid}>
            {user.role === 'resident' ? (
              <>
                {renderQuickAction('plus-circle', 'New Ticket', () => navigation.navigate('CreateTicket'))}
                {renderQuickAction('calendar', 'Book Facility', () => navigation.navigate('FacilitiesTab'))}
                {renderQuickAction('bell', 'Notices', () => navigation.navigate('NoticesScreen'))}
                {renderQuickAction('phone', 'Emergency', () => navigation.navigate('EmergencyScreen'), colors.error)}
              </>
            ) : null}
            {user.role === 'security' ? (
              <>
                {renderQuickAction('user-plus', 'Check In', () => navigation.navigate('VisitorEntry'))}
                {renderQuickAction('package', 'Delivery', () => navigation.navigate('DeliveryLog'))}
                {renderQuickAction('truck', 'Vehicles', () => navigation.navigate('VehicleLog'))}
                {renderQuickAction('phone', 'Emergency', () => navigation.navigate('EmergencyScreen'), colors.error)}
              </>
            ) : null}
            {user.role === 'maintenance' ? (
              <>
                {renderQuickAction('list', 'All Tickets', () => navigation.navigate('TicketsTab'))}
                {renderQuickAction('check-circle', 'Resolved', () => navigation.navigate('TicketsTab', { filter: 'resolved' }))}
                {renderQuickAction('phone', 'Emergency', () => navigation.navigate('EmergencyScreen'), colors.error)}
              </>
            ) : null}
            {user.role === 'management' ? (
              <>
                {renderQuickAction('users', 'Residents', () => navigation.navigate('ResidentsScreen'))}
                {renderQuickAction('briefcase', 'Staff', () => navigation.navigate('StaffScreen'))}
                {renderQuickAction('bar-chart-2', 'Reports', () => navigation.navigate('ReportsScreen'))}
                {renderQuickAction('file-text', 'Notices', () => navigation.navigate('NoticesScreen'))}
                {renderQuickAction('settings', 'Settings', () => navigation.navigate('MoreTab'))}
              </>
            ) : null}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Recent Notices</ThemedText>
            <Pressable onPress={() => navigation.navigate('NoticesScreen')}>
              <ThemedText style={[styles.seeAll, { color: colors.primary }]}>See All</ThemedText>
            </Pressable>
          </View>
          {notices.slice(0, 3).map(notice => (
            <Pressable
              key={notice.id}
              style={({ pressed }) => [
                styles.noticeItem,
                { backgroundColor: colors.backgroundDefault, opacity: pressed ? 0.8 : 1 }
              ]}
              onPress={() => navigation.navigate('NoticeDetail', { noticeId: notice.id })}
            >
              <View style={[
                styles.noticeIcon,
                { backgroundColor: notice.type === 'event' ? colors.success + '20' : colors.info + '20' }
              ]}>
                <Feather
                  name={notice.type === 'event' ? 'calendar' : 'bell'}
                  size={16}
                  color={notice.type === 'event' ? colors.success : colors.info}
                />
              </View>
              <View style={styles.noticeContent}>
                <ThemedText style={styles.noticeTitle} numberOfLines={1}>{notice.title}</ThemedText>
                <ThemedText style={[styles.noticeDate, { color: colors.textSecondary }]}>{notice.createdAt}</ThemedText>
              </View>
              {notice.important ? (
                <View style={[styles.importantBadge, { backgroundColor: colors.error + '20' }]}>
                  <Feather name="star" size={12} color={colors.error} />
                </View>
              ) : null}
            </Pressable>
          ))}
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
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
  },
  roleBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  alertText: {
    fontSize: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: Spacing.lg,
  },
  statIcon: {
    width: 40,
    height: 40,
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
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  quickAction: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  noticeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  noticeIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeContent: {
    flex: 1,
  },
  noticeTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  noticeDate: {
    fontSize: 12,
    marginTop: 2,
  },
  importantBadge: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
