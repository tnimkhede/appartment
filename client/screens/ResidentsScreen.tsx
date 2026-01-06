```
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
import { Unit, User } from '@/data/mockData';

export default function ResidentsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { user: currentUser } = useAuth();
  const { users, addUser, updateUser, deleteUser, units } = useData();
  const colors = isDark ? Colors.dark : Colors.light;

  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [unitNumber, setUnitNumber] = useState('');

  const isAdmin = currentUser?.role === 'management';

  const handleAdd = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('');
    setUnitNumber('');
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone);
    setUnitNumber(user.unitNumber);
    setModalVisible(true);
  };

  const handleDelete = (userId: string) => {
    Alert.alert(
      'Delete Resident',
      'Are you sure you want to delete this resident?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteUser(userId) }
      ]
    );
  };

  const handleSave = () => {
    if (!name || !email || !phone || !unitNumber) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (editingUser) {
      updateUser(editingUser.id, { name, email, phone, unitNumber });
    } else {
      addUser({
        name,
        email,
        phone,
        unitNumber,
        role: 'resident',
        password: 'pass123', // Default password
      });
    }
    setModalVisible(false);
  };

  const renderUnit = ({ item }: { item: Unit }) => {
    // Find the owner from the dynamic users list instead of static USERS
    // Note: In a real app, we'd link units to users more robustly.
    // Here we try to find a user who matches the unit's ownerId OR unit number
    const owner = users.find(u => u.id === item.ownerId || u.unitNumber === item.number);

    return (
      <View style={[styles.unitCard, { backgroundColor: colors.backgroundDefault }]}>
        <View style={styles.unitHeader}>
          <View style={[styles.unitBadge, { backgroundColor: colors.primary + '20' }]}>
            <ThemedText style={[styles.unitNumber, { color: colors.primary }]}>{item.number}</ThemedText>
          </View>
          <View style={styles.unitInfo}>
            <ThemedText style={styles.ownerName}>{owner?.name || 'Vacant'}</ThemedText>
            <ThemedText style={[styles.unitType, { color: colors.textSecondary }]}>
              Block {item.block} - Floor {item.floor} - {item.type}
            </ThemedText>
          </View>
          {isAdmin && owner ? (
            <View style={styles.adminActions}>
              <Pressable onPress={() => handleEdit(owner)} style={styles.iconButton}>
                <Feather name="edit-2" size={18} color={colors.primary} />
              </Pressable>
              <Pressable onPress={() => handleDelete(owner.id)} style={styles.iconButton}>
                <Feather name="trash-2" size={18} color={colors.error} />
              </Pressable>
            </View>
          ) : null}
        </View>

        <View style={styles.detailsSection}>
          {owner?.phone ? (
            <View style={styles.detailRow}>
              <Feather name="phone" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>{owner.phone}</ThemedText>
            </View>
          ) : null}

          {item.familyMembers.length > 0 ? (
            <View style={styles.detailRow}>
              <Feather name="users" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
                {item.familyMembers.length} family member{item.familyMembers.length > 1 ? 's' : ''}
              </ThemedText>
            </View>
          ) : null}

          {item.vehicles.length > 0 ? (
            <View style={styles.detailRow}>
              <Feather name="truck" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
                {item.vehicles.length} vehicle{item.vehicles.length > 1 ? 's' : ''} - {item.vehicles[0].number}
              </ThemedText>
            </View>
          ) : null}

          {item.pets.length > 0 ? (
            <View style={styles.detailRow}>
              <Feather name="heart" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.detailText, { color: colors.textSecondary }]}>
                {item.pets.map(p => p.name).join(', ')}
              </ThemedText>
            </View>
          ) : null}
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => owner?.phone && Linking.openURL(`tel:${ owner.phone } `)}
          >
            <Feather name="phone" size={14} color="#FFFFFF" />
            <ThemedText style={styles.actionButtonText}>Call</ThemedText>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.backgroundSecondary, opacity: pressed ? 0.8 : 1 }
            ]}
          >
            <Feather name="file-text" size={14} color={theme.text} />
            <ThemedText style={styles.actionButtonTextSecondary}>Details</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.summaryCard, { backgroundColor: colors.primary }]}>
        <View style={styles.summaryContent}>
          <ThemedText style={styles.summaryValue}>{UNITS.length}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Total Units</ThemedText>
        </View>
        <View style={[styles.summaryDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
        <View style={styles.summaryContent}>
          <ThemedText style={styles.summaryValue}>{users.filter(u => u.role === 'resident').length}</ThemedText>
          <ThemedText style={styles.summaryLabel}>Residents</ThemedText>
        </View>
      </View>

      {isAdmin && (
        <View style={styles.addButtonContainer}>
          <Button onPress={handleAdd} icon="plus">Add Resident</Button>
        </View>
      )}

      <FlatList
        data={UNITS}
        keyExtractor={item => item.id}
        renderItem={renderUnit}
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
                {editingUser ? 'Edit Resident' : 'Add Resident'}
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
                <ThemedText style={styles.label}>Email</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter email"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
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
                <ThemedText style={styles.label}>Unit Number</ThemedText>
                <TextInput
                  style={[styles.input, { color: theme.text, borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}
                  value={unitNumber}
                  onChangeText={setUnitNumber}
                  placeholder="e.g. A-101"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <Button onPress={handleSave} style={styles.saveButton}>
                Save Resident
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
  summaryCard: {
    flexDirection: 'row',
    margin: Spacing.lg,
    padding: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  summaryContent: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: Spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 50,
    alignSelf: 'center',
  },
  addButtonContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  unitCard: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  unitBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  unitNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  unitInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
  },
  unitType: {
    fontSize: 12,
    marginTop: 2,
  },
  adminActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
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
  actionButtonTextSecondary: {
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
