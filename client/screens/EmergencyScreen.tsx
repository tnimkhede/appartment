import React from 'react';
import { StyleSheet, View, FlatList, Pressable, Linking, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { EMERGENCY_CONTACTS, EmergencyContact } from '@/data/mockData';

export default function EmergencyScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const handleCall = (contact: EmergencyContact) => {
    Alert.alert(
      `Call ${contact.name}?`,
      `This will dial ${contact.phone}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => Linking.openURL(`tel:${contact.phone}`)
        }
      ]
    );
  };

  const getTypeIcon = (type: string): keyof typeof Feather.glyphMap => {
    switch (type.toLowerCase()) {
      case 'emergency': return 'alert-triangle';
      case 'medical': return 'heart';
      case 'internal': return 'home';
      default: return 'phone';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'emergency': return colors.error;
      case 'medical': return colors.success;
      case 'internal': return colors.info;
      default: return colors.primary;
    }
  };

  const renderContact = ({ item }: { item: EmergencyContact }) => {
    const typeColor = getTypeColor(item.type);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.contactCard,
          { backgroundColor: colors.backgroundDefault, opacity: pressed ? 0.8 : 1 }
        ]}
        onPress={() => handleCall(item)}
      >
        <View style={[styles.iconWrapper, { backgroundColor: typeColor + '20' }]}>
          <Feather name={getTypeIcon(item.type)} size={24} color={typeColor} />
        </View>
        <View style={styles.contactInfo}>
          <ThemedText style={styles.contactName}>{item.name}</ThemedText>
          <ThemedText style={[styles.contactType, { color: colors.textSecondary }]}>
            {item.type}
          </ThemedText>
          <View style={styles.phoneBadge}>
            <Feather name="phone" size={12} color={colors.primary} />
            <ThemedText style={[styles.phoneText, { color: colors.primary }]}>
              {item.phone}
            </ThemedText>
          </View>
        </View>
        <View style={styles.rightSection}>
          {item.available24x7 ? (
            <View style={[styles.availableBadge, { backgroundColor: colors.success + '20' }]}>
              <ThemedText style={[styles.availableText, { color: colors.success }]}>24/7</ThemedText>
            </View>
          ) : null}
          <View style={[styles.callButton, { backgroundColor: colors.success }]}>
            <Feather name="phone-call" size={16} color="#FFFFFF" />
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.sosCard, { backgroundColor: colors.error }]}>
        <Pressable
          style={({ pressed }) => [
            styles.sosButton,
            { opacity: pressed ? 0.8 : 1 }
          ]}
          onPress={() => handleCall(EMERGENCY_CONTACTS[0])}
        >
          <View style={styles.sosIconWrapper}>
            <Feather name="alert-octagon" size={48} color="#FFFFFF" />
          </View>
          <ThemedText style={styles.sosText}>SOS - Emergency</ThemedText>
          <ThemedText style={styles.sosSubtext}>Tap to call emergency services</ThemedText>
        </Pressable>
      </View>

      <View style={styles.infoCard}>
        <Feather name="info" size={16} color={colors.info} />
        <ThemedText style={[styles.infoText, { color: colors.textSecondary }]}>
          Tap any contact below to call directly. For life-threatening emergencies, use the SOS button above.
        </ThemedText>
      </View>

      <FlatList
        data={EMERGENCY_CONTACTS}
        keyExtractor={item => item.id}
        renderItem={renderContact}
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
  sosCard: {
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  sosButton: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  sosIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  sosSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactType: {
    fontSize: 12,
    marginTop: 2,
  },
  phoneBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  phoneText: {
    fontSize: 13,
    fontWeight: '500',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  availableBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  availableText: {
    fontSize: 10,
    fontWeight: '600',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
