```
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
import { TICKET_CATEGORIES, PRIORITY_LEVELS } from '@/data/mockData';

export default function CreateTicketScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { addTicket, units } = useData();
  const colors = isDark ? Colors.dark : Colors.light;

  const [category, setCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const userUnit = UNITS.find(u => u.ownerId === user?.id);

  const handleSubmit = () => {
    if (!category || !subject || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    addTicket({
      unitId: userUnit?.id || '',
      createdBy: user?.id || '',
      category: category as any,
      subject,
      description,
      priority: priority as any,
      status: 'open',
    });

    Alert.alert('Success', 'Ticket created successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  const isValid = category && subject && description;

  return (
    <ThemedView style={styles.container}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
      >
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Category *</ThemedText>
            <View style={styles.optionsGrid}>
              {TICKET_CATEGORIES.map(cat => (
                <Pressable
                  key={cat.value}
                  style={[
                    styles.optionChip,
                    { 
                      backgroundColor: category === cat.value ? colors.primary : colors.backgroundDefault,
                      borderColor: category === cat.value ? colors.primary : colors.border,
                    }
                  ]}
                  onPress={() => setCategory(cat.value)}
                >
                  <ThemedText style={[
                    styles.optionText,
                    { color: category === cat.value ? '#FFFFFF' : theme.text }
                  ]}>
                    {cat.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Subject *</ThemedText>
            <TextInput
              style={[
                styles.input,
                { borderColor: colors.border, backgroundColor: colors.backgroundDefault, color: theme.text }
              ]}
              placeholder="Brief description of the issue"
              placeholderTextColor={colors.textSecondary}
              value={subject}
              onChangeText={setSubject}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Description *</ThemedText>
            <TextInput
              style={[
                styles.textArea,
                { borderColor: colors.border, backgroundColor: colors.backgroundDefault, color: theme.text }
              ]}
              placeholder="Provide detailed information about the issue..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Priority</ThemedText>
            <View style={styles.priorityOptions}>
              {PRIORITY_LEVELS.map(level => (
                <Pressable
                  key={level.value}
                  style={[
                    styles.priorityChip,
                    { 
                      backgroundColor: priority === level.value ? level.color + '20' : colors.backgroundDefault,
                      borderColor: priority === level.value ? level.color : colors.border,
                    }
                  ]}
                  onPress={() => setPriority(level.value)}
                >
                  <View style={[styles.priorityDot, { backgroundColor: level.color }]} />
                  <ThemedText style={[
                    styles.priorityText,
                    { color: priority === level.value ? level.color : theme.text }
                  ]}>
                    {level.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={[styles.infoBox, { backgroundColor: colors.info + '10', borderColor: colors.info }]}>
            <Feather name="info" size={16} color={colors.info} />
            <ThemedText style={[styles.infoText, { color: colors.info }]}>
              Your ticket will be reviewed and assigned to the appropriate team member.
            </ThemedText>
          </View>

          <Button onPress={handleSubmit} disabled={!isValid}>
            Submit Ticket
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  form: {
    gap: Spacing.xl,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: Spacing.inputHeight,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  textArea: {
    minHeight: 120,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  infoText: {
    fontSize: 13,
    flex: 1,
  },
});
