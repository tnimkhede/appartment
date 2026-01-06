
import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Pressable, Linking, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { Staff } from '@/data/mockData';

export default function StaffScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { user: currentUser } = useAuth();
  const { staff, addStaff, updateStaff, deleteStaff } = useData();
  const colors = isDark ? Colors.dark : Colors.light;

  const [modalVisible, setModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [shift, setShift] = useState('');

  const isAdmin = currentUser?.role === 'management';

  const handleAdd = () => {
    setEditingStaff(null);
    setName('');
    setRole('');
    setPhone('');
    setShift('');
    setModalVisible(true);
  };

  const handleEdit = (staffMember: Staff) => {
    setEditingStaff(staffMember);
    setName(staffMember.name);
    setRole(staffMember.role);
    setPhone(staffMember.phone);
    setShift(staffMember.shift);
    setModalVisible(true);
  };

  const handleDelete = (staffId: string) => {
    Alert.alert(
      'Delete Staff',
      'Are you sure you want to delete this staff member?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteStaff(staffId) }
      ]
    );
  };

  const handleSave = () => {
    if (!name || !role || !phone || !shift) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (editingStaff) {
      updateStaff(editingStaff.id, { name, role, phone, shift });
    } else {
      addStaff({
        name,
        role,
        phone,
        shift,
        attendance: [], // Initialize with empty attendance
      });
    }
    setModalVisible(false);
  };

  const getRoleIcon = (role: string): keyof typeof Feather.glyphMap => {
    switch (role.toLowerCase()) {
      case 'security guard': return 'shield';
      case 'housekeeping': return 'home';
      case 'maintenance': return 'tool';
      default: return 'user';
    }
  };

  const getLatestAttendance = (staff: Staff) => {
    if (staff.attendance.length === 0) return null;
    return staff.attendance[0];
  };

  const getAttendanceColor = (status: string) => {
    switch (status) {
      case 'present': return colors.success;
      case 'absent': return colors.error;
      case 'leave': return colors.warning;
      default: return colors.textSecondary;
    }
  };

  const renderStaff = ({ item }: { item: Staff }) => {
    const latestAttendance = getLatestAttendance(item);

    return (
      <View style={[styles.staffCard, { backgroundColor: colors.backgroundDefault }]}>
        <View style={styles.staffHeader}>
          <View style={[styles.staffIcon, { backgroundColor: colors.primary + '20' }]}>
            <Feather name={getRoleIcon(item.role)} size={20} color={colors.primary} />
          </View>
          <View style={styles.staffInfo}>
            <ThemedText style={styles.staffName}>{item.name}</ThemedText>
            <ThemedText style={[styles.staffRole, { color: colors.textSecondary }]}>{item.role}</ThemedText>
          </View>
          {latestAttendance ? (
            <View style={[styles.statusBadge, { backgroundColor: getAttendanceColor(latestAttendance.status) + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: getAttendanceColor(latestAttendance.status) }]} />
              <ThemedText style={[styles.statusText, { color: getAttendanceColor(latestAttendance.status) }]}>
                {latestAttendance.status}
              </ThemedText>
            </View>
          ) : null}
          {isAdmin && (
            <View style={styles.adminActions}>
              <Pressable onPress={() => handleEdit(item)} style={styles.iconButton}>
                <Feather name="edit-2" size={18} color={colors.primary} />
              </Pressable>
              <Pressable onPress={() => handleDelete(item.id)} style={styles.iconButton}>
                <Feather name="trash-2" size={18} color={colors.error} />
              </Pressable>
            </View>
          )}
        </View>

        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <Feather name="phone" size={14} color={colors.textSecondary} />
            <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{item.phone}</ThemedText>
          </View>
          <View style={styles.detailRow}>
            <Feather name="clock" size={14} color={colors.textSecondary} />
            <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{item.shift}</ThemedText>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.success, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => Linking.openURL(`tel:${item.phone} `)}
          >
            <Feather name="phone" size={14} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Call</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  };

  const presentCount = staff.filter(s => getLatestAttendance(s)?.status === 'present').length;
  const absentCount = staff.filter(s => getLatestAttendance(s)?.status === 'absent').length;
  const leaveCount = staff.filter(s => getLatestAttendance(s)?.status === 'leave').length;

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.summarySection, { backgroundColor: colors.backgroundDefault }]}>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: colors.success + '20' }]}>
            <Feather name="check-circle" size={16} color={colors.success} />
          </View>
          <ThemedText style={styles.summaryValue}>{presentCount}</ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>Present</ThemedText>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: colors.error + '20' }]}>
            <Feather name="x-circle" size={16} color={colors.error} />
          </View>
          <ThemedText style={styles.summaryValue}>{absentCount}</ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>Absent</ThemedText>
        </View>
        <View style={styles.summaryItem}>
          <View style={[styles.summaryIcon, { backgroundColor: colors.warning + '20' }]}>
            <Feather name="calendar" size={16} color={colors.warning} />
          </View>
          <ThemedText style={styles.summaryValue}>{leaveCount}</ThemedText>
          <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>On Leave</ThemedText>
        </View>
      </View>

      {isAdmin && (
        <View style={styles.addButtonContainer}>
          <Button onPress={handleAdd} icon="plus">Add Staff</Button>
        </View>
      )}

      <FlatList
        data={staff}
        keyExtractor={item => item.id}
        renderItem={renderStaff}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundDefault }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                {editingStaff ? 'Edit Staff' : 'Add Staff'}
              </ThemedText>
              <Pressable onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Name</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Role</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
                  value={role}
                  onChangeText={setRole}
                  placeholder="e.g. Security Guard, Maintenance"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Phone</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Shift</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
                  value={shift}
                  onChangeText={setShift}
                  placeholder="e.g. Day (6AM-6PM)"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <Button onPress={handleSave} style={styles.saveButton}>
                Save Staff
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summarySection: {
    flexDirection: 'row',
    margin: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryIcon: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  summaryLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  addButtonContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  staffCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  staffHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  staffIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  staffName: {
    fontSize: 16,
    fontWeight: '600',
  },
  staffRole: {
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  adminActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  iconButton: {
    padding: Spacing.xs,
  },
  detailsSection: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  detailText: {
    fontSize: 13,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalBody: {
    marginBottom: Spacing.xl,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    fontSize: 16,
  },
  saveButton: {
    marginTop: Spacing.md,
  },
});
