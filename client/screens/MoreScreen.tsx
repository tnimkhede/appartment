import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import { useAuth, getRoleColor, getRoleLabel } from '@/context/AuthContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';

interface MenuItem {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  screen?: string;
  action?: () => void;
  color?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
  roles?: string[];
}

export default function MoreScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const tabBarHeight = useBottomTabBarHeight();
  const { theme, isDark } = useTheme();
  const { user, logout } = useAuth();
  const colors = isDark ? Colors.dark : Colors.light;

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

  const menuSections: MenuSection[] = [
    {
      title: 'Management',
      roles: ['management'],
      items: [
        { icon: 'users', label: 'Residents', screen: 'ResidentsScreen' },
        { icon: 'briefcase', label: 'Vendors', screen: 'VendorsScreen' },
        { icon: 'user-check', label: 'Staff', screen: 'StaffScreen' },
        { icon: 'truck', label: 'Parking', screen: 'ParkingScreen' },
        { icon: 'bar-chart-2', label: 'Reports', screen: 'ReportsScreen' },
      ],
    },
    {
      title: 'My Unit',
      roles: ['resident'],
      items: [
        { icon: 'home', label: 'Unit Details', screen: 'UnitDetailsScreen' },
        { icon: 'users', label: 'Family Members', screen: 'FamilyScreen' },
        { icon: 'truck', label: 'Vehicles', screen: 'VehiclesScreen' },
      ],
    },
    {
      title: 'Security',
      roles: ['security'],
      items: [
        { icon: 'user-plus', label: 'Visitor Entry', screen: 'VisitorEntry' },
        { icon: 'package', label: 'Delivery Log', screen: 'DeliveryLog' },
        { icon: 'truck', label: 'Vehicle Log', screen: 'VehicleLog' },
      ],
    },
    {
      title: 'Community',
      items: [
        { icon: 'bell', label: 'Notices & Events', screen: 'NoticesScreen' },
        { icon: 'check-square', label: 'Polls & Voting', screen: 'PollsScreen' },
        { icon: 'file-text', label: 'Documents', screen: 'DocumentsScreen' },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'phone', label: 'Emergency Contacts', screen: 'EmergencyScreen', color: colors.error },
        { icon: 'help-circle', label: 'Help & FAQ', screen: 'HelpScreen' },
      ],
    },
    {
      title: 'Account',
      items: [
        { icon: 'settings', label: 'Settings', screen: 'SettingsScreen' },
        { icon: 'log-out', label: 'Log Out', action: handleLogout, color: colors.error },
      ],
    },
  ];

  const roleColor = getRoleColor(user?.role || 'resident', isDark);

  const renderMenuItem = (item: MenuItem, index: number) => (
    <Pressable
      key={index}
      style={({ pressed }) => [
        styles.menuItem,
        { backgroundColor: pressed ? colors.backgroundSecondary : 'transparent' }
      ]}
      onPress={() => {
        if (item.action) {
          item.action();
        } else if (item.screen) {
          navigation.navigate(item.screen);
        }
      }}
    >
      <View style={[styles.menuIconWrapper, { backgroundColor: (item.color || colors.primary) + '20' }]}>
        <Feather name={item.icon} size={18} color={item.color || colors.primary} />
      </View>
      <ThemedText style={[styles.menuLabel, item.color ? { color: item.color } : null]}>{item.label}</ThemedText>
      <Feather name="chevron-right" size={20} color={colors.textSecondary} />
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarHeight + Spacing.xl }
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
            <ThemedText style={[styles.profileUnit, { color: colors.textSecondary }]}>
              {user?.unitNumber}
            </ThemedText>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: roleColor + '20' }]}>
            <ThemedText style={[styles.roleText, { color: roleColor }]}>
              {getRoleLabel(user?.role || 'resident')}
            </ThemedText>
          </View>
        </View>

        {menuSections.map((section, sectionIndex) => {
          if (section.roles && !section.roles.includes(user?.role || '')) {
            return null;
          }

          return (
            <View key={sectionIndex} style={styles.section}>
              <ThemedText style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                {section.title}
              </ThemedText>
              <View style={[styles.menuCard, { backgroundColor: colors.backgroundDefault }]}>
                {section.items.map(renderMenuItem)}
              </View>
            </View>
          );
        })}

        <ThemedText style={[styles.version, { color: colors.textSecondary }]}>
          AptManager v1.0.0
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
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.xl,
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
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
  profileUnit: {
    fontSize: 14,
    marginTop: 2,
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
  menuCard: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    marginLeft: Spacing.md,
  },
  version: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
