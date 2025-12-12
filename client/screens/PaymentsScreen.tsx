import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Pressable, Alert } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { UNITS, Bill } from '@/data/mockData';

export default function PaymentsScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { bills, payBill } = useData();
  const [selectedTab, setSelectedTab] = useState<'pending' | 'history'>('pending');
  const colors = isDark ? Colors.dark : Colors.light;

  const userUnit = UNITS.find(u => u.ownerId === user?.id);

  const userBills = useMemo(() => {
    if (user?.role === 'resident') {
      return bills.filter(b => b.unitId === userUnit?.id);
    }
    return bills;
  }, [bills, user, userUnit]);

  const pendingBills = userBills.filter(b => b.status !== 'paid');
  const paidBills = userBills.filter(b => b.status === 'paid');
  const totalPending = pendingBills.reduce((sum, b) => sum + b.amount, 0);

  const handlePay = (bill: Bill) => {
    Alert.alert(
      'Confirm Payment',
      `Pay $${bill.amount} for ${bill.description}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Pay Now', 
          onPress: () => {
            payBill(bill.id);
            Alert.alert('Success', 'Payment successful!');
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return colors.success;
      case 'pending': return colors.warning;
      case 'overdue': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const getTypeIcon = (type: string): keyof typeof Feather.glyphMap => {
    switch (type) {
      case 'maintenance': return 'home';
      case 'water': return 'droplet';
      case 'gas': return 'thermometer';
      case 'common': return 'users';
      default: return 'file-text';
    }
  };

  const renderBill = ({ item }: { item: Bill }) => (
    <View style={[styles.billCard, { backgroundColor: colors.backgroundDefault }]}>
      <View style={styles.billHeader}>
        <View style={[styles.typeIcon, { backgroundColor: colors.primary + '20' }]}>
          <Feather name={getTypeIcon(item.type)} size={18} color={colors.primary} />
        </View>
        <View style={styles.billInfo}>
          <ThemedText style={styles.billType}>{item.description}</ThemedText>
          <ThemedText style={[styles.billMonth, { color: colors.textSecondary }]}>{item.month}</ThemedText>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.billDetails}>
        <View style={styles.billRow}>
          <ThemedText style={[styles.billLabel, { color: colors.textSecondary }]}>Amount</ThemedText>
          <ThemedText style={styles.billAmount}>${item.amount.toLocaleString()}</ThemedText>
        </View>
        <View style={styles.billRow}>
          <ThemedText style={[styles.billLabel, { color: colors.textSecondary }]}>
            {item.status === 'paid' ? 'Paid On' : 'Due Date'}
          </ThemedText>
          <ThemedText style={[
            styles.billDate,
            { color: item.status === 'overdue' ? colors.error : theme.text }
          ]}>
            {item.status === 'paid' ? item.paidDate : item.dueDate}
          </ThemedText>
        </View>
      </View>

      {item.status !== 'paid' && user?.role === 'resident' ? (
        <Pressable
          style={({ pressed }) => [
            styles.payButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => handlePay(item)}
        >
          <Feather name="credit-card" size={16} color="#FFFFFF" />
          <ThemedText style={styles.payButtonText}>Pay Now</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {user?.role === 'resident' ? (
        <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
          <View style={styles.summaryContent}>
            <ThemedText style={styles.summaryLabel}>Total Pending</ThemedText>
            <ThemedText style={styles.summaryAmount}>${totalPending.toLocaleString()}</ThemedText>
            <ThemedText style={styles.summarySubtext}>{pendingBills.length} pending bills</ThemedText>
          </View>
          <View style={styles.summaryIcon}>
            <Feather name="credit-card" size={48} color="rgba(255,255,255,0.3)" />
          </View>
        </View>
      ) : null}

      <View style={[styles.tabContainer, { backgroundColor: colors.backgroundSecondary }]}>
        <Pressable
          style={[
            styles.tab,
            { backgroundColor: selectedTab === 'pending' ? colors.primary : 'transparent' }
          ]}
          onPress={() => setSelectedTab('pending')}
        >
          <ThemedText style={[
            styles.tabText,
            { color: selectedTab === 'pending' ? '#FFFFFF' : colors.textSecondary }
          ]}>
            Pending ({pendingBills.length})
          </ThemedText>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            { backgroundColor: selectedTab === 'history' ? colors.primary : 'transparent' }
          ]}
          onPress={() => setSelectedTab('history')}
        >
          <ThemedText style={[
            styles.tabText,
            { color: selectedTab === 'history' ? '#FFFFFF' : colors.textSecondary }
          ]}>
            History ({paidBills.length})
          </ThemedText>
        </Pressable>
      </View>

      <FlatList
        data={selectedTab === 'pending' ? pendingBills : paidBills}
        keyExtractor={item => item.id}
        renderItem={renderBill}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name={selectedTab === 'pending' ? 'check-circle' : 'file-text'} size={48} color={colors.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              {selectedTab === 'pending' ? 'No pending bills' : 'No payment history'}
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
  summaryCard: {
    margin: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryContent: {},
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  summaryAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  summarySubtext: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  summaryIcon: {},
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.md,
    padding: Spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  billCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  billHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  billInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  billType: {
    fontSize: 16,
    fontWeight: '600',
  },
  billMonth: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  billDetails: {
    gap: Spacing.sm,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billLabel: {
    fontSize: 14,
  },
  billAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  billDate: {
    fontSize: 14,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
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
