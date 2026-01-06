
import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Pressable, Alert, Modal, TextInput } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/Button';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { Spacing, BorderRadius, Colors } from '@/constants/theme';
import { Facility } from '@/data/mockData'; // Keep Facility type import if not defined elsewhere

export default function FacilitiesScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const { facilities, units, facilityBookings, addFacilityBooking } = useData(); // Added facilities and units from useData
  const colors = isDark ? Colors.dark : Colors.light;

  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingPurpose, setBookingPurpose] = useState('');

  const userUnit = units.find(u => u.ownerId === user?.id);
  const userBookings = facilityBookings.filter(b => b.bookedBy === user?.id);

  const getAvailabilityStatus = (facilityId: string) => {
    const todayBookings = facilityBookings.filter(
      b => b.facilityId === facilityId && b.status === 'approved'
    ).length;
    if (todayBookings === 0) return { status: 'Available', color: colors.success };
    if (todayBookings < 3) return { status: 'Limited', color: colors.warning };
    return { status: 'Busy', color: colors.error };
  };

  const getFacilityIcon = (name: string): keyof typeof Feather.glyphMap => {
    if (name.toLowerCase().includes('gym')) return 'activity';
    if (name.toLowerCase().includes('pool')) return 'droplet';
    if (name.toLowerCase().includes('party')) return 'music';
    if (name.toLowerCase().includes('club')) return 'coffee';
    return 'home';
  };

  const handleBook = () => {
    if (!bookingDate || !bookingTime || !selectedFacility) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    addFacilityBooking({
      facilityId: selectedFacility.id,
      unitId: userUnit?.id || '',
      bookedBy: user?.id || '',
      date: bookingDate,
      startTime: bookingTime,
      endTime: bookingTime,
      status: 'pending',
      purpose: bookingPurpose,
    });

    setShowBookingModal(false);
    setBookingDate('');
    setBookingTime('');
    setBookingPurpose('');
    setSelectedFacility(null);
    Alert.alert('Success', 'Booking request submitted!');
  };

  const renderFacility = ({ item }: { item: Facility }) => {
    const availability = getAvailabilityStatus(item.id);

    return (
      <View style={[styles.facilityCard, { backgroundColor: colors.backgroundDefault }]}>
        <View style={[styles.facilityIcon, { backgroundColor: colors.primary + '20' }]}>
          <Feather name={getFacilityIcon(item.name)} size={32} color={colors.primary} />
        </View>

        <View style={styles.facilityContent}>
          <View style={styles.facilityHeader}>
            <ThemedText style={styles.facilityName}>{item.name}</ThemedText>
            <View style={[styles.availabilityBadge, { backgroundColor: availability.color + '20' }]}>
              <View style={[styles.availabilityDot, { backgroundColor: availability.color }]} />
              <ThemedText style={[styles.availabilityText, { color: availability.color }]}>
                {availability.status}
              </ThemedText>
            </View>
          </View>

          <ThemedText style={[styles.facilityDesc, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </ThemedText>

          <View style={styles.facilityMeta}>
            <View style={styles.metaItem}>
              <Feather name="users" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.metaText, { color: colors.textSecondary }]}>
                Capacity: {item.capacity}
              </ThemedText>
            </View>
            <View style={styles.metaItem}>
              <Feather name="clock" size={14} color={colors.textSecondary} />
              <ThemedText style={[styles.metaText, { color: colors.textSecondary }]}>
                {item.timings}
              </ThemedText>
            </View>
          </View>

          {item.isPaid ? (
            <View style={[styles.priceBadge, { backgroundColor: colors.warning + '20' }]}>
              <Feather name="dollar-sign" size={12} color={colors.warning} />
              <ThemedText style={[styles.priceText, { color: colors.warning }]}>
                ${item.pricePerHour}/hour
              </ThemedText>
            </View>
          ) : null}

          <View style={styles.amenities}>
            {item.amenities.slice(0, 3).map((amenity, index) => (
              <View key={index} style={[styles.amenityChip, { backgroundColor: colors.backgroundSecondary }]}>
                <ThemedText style={[styles.amenityText, { color: colors.textSecondary }]}>{amenity}</ThemedText>
              </View>
            ))}
            {item.amenities.length > 3 ? (
              <ThemedText style={[styles.moreAmenities, { color: colors.textSecondary }]}>
                +{item.amenities.length - 3} more
              </ThemedText>
            ) : null}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.bookButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 }
            ]}
            onPress={() => {
              setSelectedFacility(item);
              setShowBookingModal(true);
            }}
          >
            <Feather name="calendar" size={16} color="#FFFFFF" />
            <ThemedText style={styles.bookButtonText}>Book Now</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      {userBookings.length > 0 ? (
        <View style={[styles.myBookingsCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary }]}>
          <View style={styles.myBookingsHeader}>
            <Feather name="calendar" size={20} color={colors.primary} />
            <ThemedText style={[styles.myBookingsTitle, { color: colors.primary }]}>My Bookings</ThemedText>
          </View>
          <ThemedText style={[styles.myBookingsCount, { color: colors.textSecondary }]}>
            {userBookings.filter(b => b.status === 'pending').length} pending, {userBookings.filter(b => b.status === 'approved').length} approved
          </ThemedText>
        </View>
      ) : null}

      <FlatList
        data={facilities}
        keyExtractor={item => item.id}
        renderItem={renderFacility}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: tabBarHeight + Spacing.xl }
        ]}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={showBookingModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowBookingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.backgroundDefault }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Book {selectedFacility?.name}</ThemedText>
              <Pressable onPress={() => setShowBookingModal(false)}>
                <Feather name="x" size={24} color={theme.text} />
              </Pressable>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Date *</ThemedText>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary, color: theme.text }]}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                  value={bookingDate}
                  onChangeText={setBookingDate}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Time *</ThemedText>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary, color: theme.text }]}
                  placeholder="e.g., 10:00 AM - 12:00 PM"
                  placeholderTextColor={colors.textSecondary}
                  value={bookingTime}
                  onChangeText={setBookingTime}
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Purpose (optional)</ThemedText>
                <TextInput
                  style={[styles.input, { borderColor: colors.border, backgroundColor: colors.backgroundSecondary, color: theme.text }]}
                  placeholder="Birthday party, meeting, etc."
                  placeholderTextColor={colors.textSecondary}
                  value={bookingPurpose}
                  onChangeText={setBookingPurpose}
                />
              </View>

              <Button onPress={handleBook}>Submit Booking</Button>
            </View>
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
  myBookingsCard: {
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  myBookingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  myBookingsTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  myBookingsCount: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
  },
  facilityCard: {
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
  },
  facilityIcon: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  facilityContent: {
    padding: Spacing.lg,
  },
  facilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  facilityName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: Spacing.xs,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  facilityDesc: {
    fontSize: 14,
    marginBottom: Spacing.md,
  },
  facilityMeta: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    fontSize: 12,
  },
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  amenityChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xs,
  },
  amenityText: {
    fontSize: 11,
  },
  moreAmenities: {
    fontSize: 11,
    alignSelf: 'center',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    gap: Spacing.sm,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalBody: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  inputLabel: {
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
});
