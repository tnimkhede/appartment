import React, { useState, useMemo } from 'react';
import { StyleSheet, View, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { UNITS, PRIORITY_LEVELS, Ticket } from '@/data/mockData';

type FilterType = 'all' | 'open' | 'in-progress' | 'resolved';

export default function TicketsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { tickets, updateTicket } = useData();
  const [filter, setFilter] = useState<FilterType>('all');
  const colors = isDark ? Colors.dark : Colors.light;

  const userUnit = UNITS.find(u => u.ownerId === user?.id);

  const filteredTickets = useMemo(() => {
    let result = tickets;
    
    if (user?.role === 'resident') {
      result = result.filter(t => t.unitId === userUnit?.id);
    }
    
    if (filter !== 'all') {
      result = result.filter(t => t.status === filter);
    }
    
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [tickets, filter, user, userUnit]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return colors.error;
      case 'in-progress': return colors.warning;
      case 'resolved': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    const level = PRIORITY_LEVELS.find(p => p.value === priority);
    return level?.color || colors.textSecondary;
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

  const renderTicket = ({ item }: { item: Ticket }) => {
    const unit = UNITS.find(u => u.id === item.unitId);
    
    return (
      <Pressable
        style={({ pressed }) => [
          styles.ticketCard,
          { backgroundColor: colors.backgroundDefault, opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={() => navigation.navigate('TicketDetail', { ticketId: item.id })}
      >
        <View style={styles.ticketHeader}>
          <View style={styles.ticketCategory}>
            <Feather 
              name={item.category === 'plumbing' ? 'droplet' : item.category === 'electrical' ? 'zap' : item.category === 'elevator' ? 'arrow-up-circle' : 'tool'} 
              size={16} 
              color={colors.primary} 
            />
            <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
            <ThemedText style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.replace('-', ' ')}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.ticketSubject}>{item.subject}</ThemedText>
        <ThemedText style={[styles.ticketDesc, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </ThemedText>

        <View style={styles.ticketFooter}>
          <View style={styles.ticketMeta}>
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
            <ThemedText style={[styles.metaText, { color: colors.textSecondary }]}>
              {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
            </ThemedText>
          </View>
          {user?.role !== 'resident' && unit ? (
            <ThemedText style={[styles.metaText, { color: colors.textSecondary }]}>
              Unit: {unit.number}
            </ThemedText>
          ) : null}
          <ThemedText style={[styles.metaText, { color: colors.textSecondary }]}>
            {item.createdAt}
          </ThemedText>
        </View>

        {user?.role === 'maintenance' && item.status !== 'resolved' ? (
          <View style={styles.actionButtons}>
            {item.status === 'open' ? (
              <Pressable
                style={[styles.actionBtn, { backgroundColor: colors.warning + '20' }]}
                onPress={() => updateTicket(item.id, { status: 'in-progress', assignedTo: user.id })}
              >
                <ThemedText style={[styles.actionBtnText, { color: colors.warning }]}>Start Work</ThemedText>
              </Pressable>
            ) : null}
            {item.status === 'in-progress' ? (
              <Pressable
                style={[styles.actionBtn, { backgroundColor: colors.success + '20' }]}
                onPress={() => updateTicket(item.id, { status: 'resolved' })}
              >
                <ThemedText style={[styles.actionBtnText, { color: colors.success }]}>Mark Resolved</ThemedText>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.filterContainer, { backgroundColor: colors.backgroundSecondary }]}>
        {renderFilterTab('All', 'all')}
        {renderFilterTab('Open', 'open')}
        {renderFilterTab('In Progress', 'in-progress')}
        {renderFilterTab('Resolved', 'resolved')}
      </View>

      <FlatList
        data={filteredTickets}
        keyExtractor={item => item.id}
        renderItem={renderTicket}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl + 60 }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={colors.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              No tickets found
            </ThemedText>
          </View>
        }
      />

      {user?.role === 'resident' ? (
        <Pressable
          style={({ pressed }) => [
            styles.fab,
            { backgroundColor: colors.primary, bottom: tabBarHeight + Spacing.lg, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => navigation.navigate('CreateTicket')}
        >
          <Feather name="plus" size={24} color="#FFFFFF" />
        </Pressable>
      ) : null}
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
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  ticketCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ticketCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
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
  ticketSubject: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  ticketDesc: {
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  ticketFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metaText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  actionBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
  },
  actionBtnText: {
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
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
