import React from 'react';
import { StyleSheet, View, FlatList, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { Poll } from '@/data/mockData';

export default function PollsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { polls, votePoll } = useData();
  const colors = isDark ? Colors.dark : Colors.light;

  const handleVote = (poll: Poll, optionId: string) => {
    if (!user) return;
    
    if (poll.votedBy.includes(user.id)) {
      Alert.alert('Already Voted', 'You have already voted in this poll.');
      return;
    }

    Alert.alert(
      'Confirm Vote',
      'Your vote cannot be changed after submission.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Vote', 
          onPress: () => {
            votePoll(poll.id, optionId, user.id);
            Alert.alert('Success', 'Your vote has been recorded!');
          }
        }
      ]
    );
  };

  const renderPoll = ({ item }: { item: Poll }) => {
    const totalVotes = item.options.reduce((sum, o) => sum + o.votes, 0);
    const hasVoted = user ? item.votedBy.includes(user.id) : false;
    const isExpired = new Date(item.endsAt) < new Date();

    return (
      <View style={[styles.pollCard, { backgroundColor: colors.backgroundDefault }]}>
        <View style={styles.pollHeader}>
          <View style={[styles.pollIcon, { backgroundColor: colors.primary + '20' }]}>
            <Feather name="bar-chart-2" size={20} color={colors.primary} />
          </View>
          <View style={styles.pollMeta}>
            {isExpired ? (
              <View style={[styles.statusBadge, { backgroundColor: colors.textSecondary + '20' }]}>
                <ThemedText style={[styles.statusText, { color: colors.textSecondary }]}>Ended</ThemedText>
              </View>
            ) : (
              <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                <ThemedText style={[styles.statusText, { color: colors.success }]}>Active</ThemedText>
              </View>
            )}
            <ThemedText style={[styles.pollDate, { color: colors.textSecondary }]}>
              Ends: {item.endsAt}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={styles.pollQuestion}>{item.question}</ThemedText>

        <View style={styles.optionsContainer}>
          {item.options.map(option => {
            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
            const canVote = !hasVoted && !isExpired;

            return (
              <Pressable
                key={option.id}
                style={({ pressed }) => [
                  styles.optionItem,
                  { 
                    backgroundColor: colors.backgroundSecondary,
                    opacity: canVote && pressed ? 0.7 : 1 
                  }
                ]}
                onPress={() => canVote && handleVote(item, option.id)}
                disabled={!canVote}
              >
                <View style={[styles.progressBar, { width: `${percentage}%`, backgroundColor: colors.primary + '30' }]} />
                <View style={styles.optionContent}>
                  <ThemedText style={styles.optionText}>{option.text}</ThemedText>
                  <View style={styles.optionStats}>
                    <ThemedText style={[styles.voteCount, { color: colors.textSecondary }]}>
                      {option.votes} votes
                    </ThemedText>
                    <ThemedText style={[styles.percentage, { color: colors.primary }]}>
                      {percentage}%
                    </ThemedText>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.pollFooter}>
          <View style={styles.footerItem}>
            <Feather name="users" size={14} color={colors.textSecondary} />
            <ThemedText style={[styles.footerText, { color: colors.textSecondary }]}>
              {totalVotes} total votes
            </ThemedText>
          </View>
          {item.isAnonymous ? (
            <View style={styles.footerItem}>
              <Feather name="eye-off" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.footerText, { color: colors.textSecondary }]}>
                Anonymous
              </ThemedText>
            </View>
          ) : null}
          {hasVoted ? (
            <View style={[styles.votedBadge, { backgroundColor: colors.success + '20' }]}>
              <Feather name="check" size={12} color={colors.success} />
              <ThemedText style={[styles.votedText, { color: colors.success }]}>Voted</ThemedText>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={polls}
        keyExtractor={item => item.id}
        renderItem={renderPoll}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="check-square" size={48} color={colors.textSecondary} />
            <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
              No active polls
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
  listContent: {
    padding: Spacing.lg,
  },
  pollCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  pollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  pollIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pollMeta: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  pollDate: {
    fontSize: 12,
  },
  pollQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  optionItem: {
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    borderRadius: BorderRadius.sm,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  optionText: {
    fontSize: 14,
    flex: 1,
  },
  optionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  voteCount: {
    fontSize: 12,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
  pollFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  footerText: {
    fontSize: 12,
  },
  votedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
    gap: Spacing.xs,
  },
  votedText: {
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
