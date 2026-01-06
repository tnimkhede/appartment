
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Alert, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { Visitor } from '@/data/mockData'; // Visitor type is still needed

type EntryType = 'visitor' | 'delivery' | 'service';

export default function VisitorEntryScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { visitors, addVisitor, checkOutVisitor, units } = useData(); // Added 'units' here
  const colors = isDark ? Colors.dark : Colors.light;

  const [entryType, setEntryType] = useState<EntryType>('visitor');
  const [visitorName, setVisitorName] = useState('');
  const [phone, setPhone] = useState('');
  const [unitNumber, setUnitNumber] = useState('');
  const [purpose, setPurpose] = useState('');
  const [showActiveVisitors, setShowActiveVisitors] = useState(false);

  const activeVisitors = visitors.filter(v => !v.checkOutTime);

  const handleCheckIn = () => {
    if (!visitorName || !phone || !unitNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const unit = units.find(u => u.number.toLowerCase() === unitNumber.toLowerCase());
    if (!unit) {
      Alert.alert('Error', 'Unit not found. Please check the unit number.');
      return;
    }

    addVisitor({
      name: visitorName,
      phone,
      unitId: unit.id,
      purpose: purpose || entryType,
      checkInTime: new Date().toISOString(),
      preApproved: false,
      type: entryType,
    });

    Alert.alert('Success', `${entryType === 'visitor' ? 'Visitor' : entryType === 'delivery' ? 'Delivery' : 'Service personnel'} checked in successfully!`);

    setVisitorName('');
    setPhone('');
    setUnitNumber('');
    setPurpose('');
  };

  const handleCheckOut = (visitor: Visitor) => {
    Alert.alert(
      'Check Out',
      `Check out ${visitor.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Check Out', onPress: () => {
            checkOutVisitor(visitor.id);
            Alert.alert('Success', 'Visitor checked out successfully');
          }
        }
      ]
    );
  };

  const renderEntryTypeTab = (type: EntryType, label: string, icon: keyof typeof Feather.glyphMap) => (
    <Pressable
      style={[
        styles.typeTab,
        {
          backgroundColor: entryType === type ? colors.primary : colors.backgroundDefault,
          borderColor: entryType === type ? colors.primary : colors.border,
        }
      ]}
      onPress={() => setEntryType(type)}
    >
      <Feather name={icon} size={18} color={entryType === type ? '#FFFFFF' : colors.textSecondary} />
      <ThemedText style={[
        styles.typeTabText,
        { color: entryType === type ? '#FFFFFF' : colors.textSecondary }
      ]}>
        {label}
      </ThemedText>
    </Pressable>
  );

  const renderActiveVisitor = ({ item }: { item: Visitor }) => {
    const unit = units.find(u => u.id === item.unitId);
    const checkInTime = new Date(item.checkInTime);
    const timeString = checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={[styles.visitorCard, { backgroundColor: colors.backgroundDefault }]}>
        <View style={[styles.visitorIcon, { backgroundColor: colors.success + '20' }]}>
          <Feather
            name={item.type === 'visitor' ? 'user' : item.type === 'delivery' ? 'package' : 'tool'}
            size={18}
            color={colors.success}
          />
        </View>
        <View style={styles.visitorInfo}>
          <ThemedText style={styles.visitorName}>{item.name}</ThemedText>
          <ThemedText style={[styles.visitorMeta, { color: colors.textSecondary }]}>
            {unit?.number} - In at {timeString}
          </ThemedText>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.checkOutButton,
            { backgroundColor: colors.error, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => handleCheckOut(item)}
        >
          <Feather name="log-out" size={14} color="#FFFFFF" />
          <ThemedText style={styles.checkOutText}>Out</ThemedText>
        </Pressable>
      </View>
    );
  };

  if (showActiveVisitors) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => setShowActiveVisitors(false)}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </Pressable>
          <ThemedText style={styles.headerTitle}>Active Visitors ({activeVisitors.length})</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <FlatList
          data={activeVisitors}
          keyExtractor={item => item.id}
          renderItem={renderActiveVisitor}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xl }
          ]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="users" size={48} color={colors.textSecondary} />
              <ThemedText style={[styles.emptyText, { color: colors.textSecondary }]}>
                No active visitors
              </ThemedText>
            </View>
          }
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.activeVisitorsCard,
            { backgroundColor: colors.success + '10', borderColor: colors.success, opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => setShowActiveVisitors(true)}
        >
          <View style={[styles.activeIconWrapper, { backgroundColor: colors.success + '20' }]}>
            <Feather name="users" size={20} color={colors.success} />
          </View>
          <View style={styles.activeContent}>
            <ThemedText style={[styles.activeTitle, { color: colors.success }]}>
              Active Visitors: {activeVisitors.length}
            </ThemedText>
            <ThemedText style={[styles.activeSubtitle, { color: colors.textSecondary }]}>
              Tap to view and check out
            </ThemedText>
          </View>
          <Feather name="chevron-right" size={20} color={colors.success} />
        </Pressable>

        <View style={styles.entryTypeTabs}>
          {renderEntryTypeTab('visitor', 'Visitor', 'user')}
          {renderEntryTypeTab('delivery', 'Delivery', 'package')}
          {renderEntryTypeTab('service', 'Service', 'tool')}
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              {entryType === 'visitor' ? 'Visitor' : entryType === 'delivery' ? 'Delivery Person' : 'Service Person'} Name *
            </ThemedText>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.backgroundDefault, color: theme.text }]}
              placeholder="Enter name"
              placeholderTextColor={colors.textSecondary}
              value={visitorName}
              onChangeText={setVisitorName}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Phone Number *</ThemedText>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.backgroundDefault, color: theme.text }]}
              placeholder="Enter phone number"
              placeholderTextColor={colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Unit Number *</ThemedText>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.backgroundDefault, color: theme.text }]}
              placeholder="e.g., A-101"
              placeholderTextColor={colors.textSecondary}
              value={unitNumber}
              onChangeText={setUnitNumber}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Purpose (Optional)</ThemedText>
            <TextInput
              style={[styles.input, { borderColor: colors.border, backgroundColor: colors.backgroundDefault, color: theme.text }]}
              placeholder={entryType === 'visitor' ? 'e.g., Family visit' : entryType === 'delivery' ? 'e.g., Amazon package' : 'e.g., AC repair'}
              placeholderTextColor={colors.textSecondary}
              value={purpose}
              onChangeText={setPurpose}
            />
          </View>

          <Button onPress={handleCheckIn}>
            Check In {entryType === 'visitor' ? 'Visitor' : entryType === 'delivery' ? 'Delivery' : 'Service'}
          </Button>
        </View>
      </KeyboardAwareScrollViewCompat>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  activeVisitorsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: Spacing.xl,
  },
  activeIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  activeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeSubtitle: {
    fontSize: 12,
  },
  entryTypeTabs: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  typeTabText: {
    fontSize: 12,
    fontWeight: '600',
  },
  form: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  listContent: {
    padding: Spacing.lg,
  },
  visitorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  visitorIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visitorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  visitorName: {
    fontSize: 14,
    fontWeight: '600',
  },
  visitorMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  checkOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  checkOutText: {
    color: '#FFFFFF',
    fontSize: 12,
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
