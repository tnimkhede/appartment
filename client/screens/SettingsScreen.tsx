import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Alert, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth, getRoleColor, getRoleLabel } from '@/context/AuthContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const colors = isDark ? Colors.dark : Colors.light;
  const roleColor = getRoleColor(user?.role || 'resident', isDark);

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logout }
      ]
    );
  };

  const renderSettingItem = (
    icon: keyof typeof Feather.glyphMap,
    label: string,
    value?: string,
    hasSwitch?: boolean,
    onPress?: () => void,
    destructive?: boolean
  ) => (
    <Pressable
      style={({ pressed }) => [
        styles.settingItem,
        { backgroundColor: pressed && onPress ? colors.backgroundSecondary : 'transparent' }
      ]}
      onPress={onPress}
      disabled={!onPress && !hasSwitch}
    >
      <View style={[styles.settingIcon, { backgroundColor: (destructive ? colors.error : colors.primary) + '20' }]}>
        <Feather name={icon} size={18} color={destructive ? colors.error : colors.primary} />
      </View>
      <ThemedText style={[styles.settingLabel, destructive ? { color: colors.error } : null]}>{label}</ThemedText>
      {value ? (
        <ThemedText style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</ThemedText>
      ) : null}
      {hasSwitch ? (
        <Switch value={false} disabled trackColor={{ false: colors.border, true: colors.primary }} />
      ) : onPress ? (
        <Feather name="chevron-right" size={20} color={colors.textSecondary} />
      ) : null}
    </Pressable>
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
        <View style={[styles.profileCard, { backgroundColor: colors.backgroundDefault }]}>
          <View style={[styles.avatarWrapper, { backgroundColor: roleColor + '20' }]}>
            <ThemedText style={[styles.avatarText, { color: roleColor }]}>
              {user?.name.charAt(0).toUpperCase()}
            </ThemedText>
          </View>
          <View style={styles.profileInfo}>
            <ThemedText style={styles.profileName}>{user?.name}</ThemedText>
            <ThemedText style={[styles.profileEmail, { color: colors.textSecondary }]}>{user?.email}</ThemedText>
            <View style={styles.profileMeta}>
              <View style={[styles.roleBadge, { backgroundColor: roleColor + '20' }]}>
                <ThemedText style={[styles.roleText, { color: roleColor }]}>
                  {getRoleLabel(user?.role || 'resident')}
                </ThemedText>
              </View>
              <ThemedText style={[styles.unitText, { color: colors.textSecondary }]}>{user?.unitNumber}</ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Notifications</ThemedText>
          <View style={[styles.sectionCard, { backgroundColor: colors.backgroundDefault }]}>
            {renderSettingItem('bell', 'Push Notifications', undefined, true)}
            {renderSettingItem('mail', 'Email Notifications', undefined, true)}
            {renderSettingItem('message-square', 'SMS Alerts', undefined, true)}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</ThemedText>
          <View style={[styles.sectionCard, { backgroundColor: colors.backgroundDefault }]}>
            {renderSettingItem('moon', 'Dark Mode', isDark ? 'On' : 'Off')}
            {renderSettingItem('globe', 'Language', 'English')}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>About</ThemedText>
          <View style={[styles.sectionCard, { backgroundColor: colors.backgroundDefault }]}>
            {renderSettingItem('info', 'App Version', '1.0.0')}
            {renderSettingItem('file-text', 'Terms of Service', undefined, false, () => {})}
            {renderSettingItem('shield', 'Privacy Policy', undefined, false, () => {})}
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionCard, { backgroundColor: colors.backgroundDefault }]}>
            {renderSettingItem('log-out', 'Log Out', undefined, false, handleLogout, true)}
          </View>
        </View>

        <ThemedText style={[styles.footerText, { color: colors.textSecondary }]}>
          AptManager - Apartment Management System
        </ThemedText>
        <ThemedText style={[styles.footerSubtext, { color: colors.textSecondary }]}>
          Demo version with hardcoded data
        </ThemedText>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  profileMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.sm,
  },
  roleBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '600',
  },
  unitText: {
    fontSize: 12,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  sectionCard: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    marginLeft: Spacing.md,
  },
  settingValue: {
    fontSize: 14,
    marginRight: Spacing.sm,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  footerSubtext: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
