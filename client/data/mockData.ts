export type UserRole = 'resident' | 'management' | 'security' | 'maintenance';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  unitNumber: string;
  phone: string;
  avatar?: string;
}

export interface Unit {
  id: string;
  number: string;
  block: string;
  floor: number;
  type: string;
  ownerId: string;
  tenantId?: string;
  familyMembers: FamilyMember[];
  pets: Pet[];
  vehicles: Vehicle[];
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  phone?: string;
}

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
}

export interface Vehicle {
  id: string;
  type: 'car' | 'bike' | 'scooter';
  make: string;
  model: string;
  number: string;
  parkingSlot?: string;
}

export interface Bill {
  id: string;
  unitId: string;
  type: 'maintenance' | 'water' | 'gas' | 'common';
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
  description: string;
  month: string;
}

export interface Ticket {
  id: string;
  unitId: string;
  createdBy: string;
  category: 'plumbing' | 'electrical' | 'cleaning' | 'elevator' | 'security' | 'other';
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  feedback?: string;
}

export interface Visitor {
  id: string;
  name: string;
  phone: string;
  unitId: string;
  purpose: string;
  vehicleNumber?: string;
  checkInTime: string;
  checkOutTime?: string;
  preApproved: boolean;
  type: 'visitor' | 'delivery' | 'service';
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  capacity: number;
  timings: string;
  amenities: string[];
  rules: string[];
  isPaid: boolean;
  pricePerHour?: number;
  image?: string;
}

export interface FacilityBooking {
  id: string;
  facilityId: string;
  unitId: string;
  bookedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  purpose?: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'notice' | 'event' | 'circular';
  createdAt: string;
  createdBy: string;
  eventDate?: string;
  attachment?: string;
  important: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  phone: string;
  email?: string;
  address?: string;
  rating: number;
  contractEnd?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  shift: string;
  attendance: { date: string; status: 'present' | 'absent' | 'leave' }[];
}

export interface Poll {
  id: string;
  question: string;
  options: { id: string; text: string; votes: number }[];
  createdAt: string;
  endsAt: string;
  createdBy: string;
  isAnonymous: boolean;
  votedBy: string[];
}

export interface Document {
  id: string;
  title: string;
  category: 'rules' | 'minutes' | 'budget' | 'contract' | 'other';
  uploadedAt: string;
  uploadedBy: string;
  fileType: 'pdf' | 'doc' | 'image';
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  type: 'resident' | 'visitor';
  assignedTo?: string;
  vehicleNumber?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  type: string;
  phone: string;
  available24x7: boolean;
}

export const USERS: User[] = [
  { id: 'u1', email: 'resident@apt.com', password: 'pass123', name: 'John Smith', role: 'resident', unitNumber: 'A-101', phone: '+1234567890' },
  { id: 'u2', email: 'admin@apt.com', password: 'pass123', name: 'Sarah Johnson', role: 'management', unitNumber: 'Office', phone: '+1234567891' },
  { id: 'u3', email: 'security@apt.com', password: 'pass123', name: 'Mike Brown', role: 'security', unitNumber: 'Gate-1', phone: '+1234567892' },
  { id: 'u4', email: 'maintenance@apt.com', password: 'pass123', name: 'Tom Wilson', role: 'maintenance', unitNumber: 'Service', phone: '+1234567893' },
  { id: 'u5', email: 'jane@apt.com', password: 'pass123', name: 'Jane Doe', role: 'resident', unitNumber: 'B-202', phone: '+1234567894' },
];

export const UNITS: Unit[] = [
  {
    id: 'unit1', number: 'A-101', block: 'A', floor: 1, type: '3BHK', ownerId: 'u1',
    familyMembers: [
      { id: 'fm1', name: 'Mary Smith', relation: 'Spouse', phone: '+1234567895' },
      { id: 'fm2', name: 'Tommy Smith', relation: 'Son' },
    ],
    pets: [{ id: 'p1', name: 'Max', type: 'Dog', breed: 'Golden Retriever' }],
    vehicles: [{ id: 'v1', type: 'car', make: 'Toyota', model: 'Camry', number: 'ABC-1234', parkingSlot: 'P-A101' }],
  },
  {
    id: 'unit2', number: 'B-202', block: 'B', floor: 2, type: '2BHK', ownerId: 'u5',
    familyMembers: [{ id: 'fm3', name: 'Bob Doe', relation: 'Spouse' }],
    pets: [],
    vehicles: [{ id: 'v2', type: 'bike', make: 'Honda', model: 'CBR', number: 'XYZ-5678', parkingSlot: 'P-B202' }],
  },
];

export const BILLS: Bill[] = [
  { id: 'b1', unitId: 'unit1', type: 'maintenance', amount: 5000, dueDate: '2025-01-15', status: 'pending', description: 'Monthly Maintenance', month: 'January 2025' },
  { id: 'b2', unitId: 'unit1', type: 'water', amount: 500, dueDate: '2025-01-15', status: 'pending', description: 'Water Charges', month: 'January 2025' },
  { id: 'b3', unitId: 'unit1', type: 'maintenance', amount: 5000, dueDate: '2024-12-15', status: 'paid', paidDate: '2024-12-10', description: 'Monthly Maintenance', month: 'December 2024' },
  { id: 'b4', unitId: 'unit2', type: 'maintenance', amount: 4000, dueDate: '2025-01-15', status: 'overdue', description: 'Monthly Maintenance', month: 'January 2025' },
];

export const TICKETS: Ticket[] = [
  { id: 't1', unitId: 'unit1', createdBy: 'u1', category: 'plumbing', subject: 'Leaking faucet', description: 'Kitchen faucet is leaking continuously', priority: 'medium', status: 'open', createdAt: '2025-01-10', updatedAt: '2025-01-10' },
  { id: 't2', unitId: 'unit1', createdBy: 'u1', category: 'electrical', subject: 'Faulty switch', description: 'Bedroom light switch not working', priority: 'low', status: 'in-progress', assignedTo: 'u4', createdAt: '2025-01-08', updatedAt: '2025-01-09' },
  { id: 't3', unitId: 'unit2', createdBy: 'u5', category: 'elevator', subject: 'Elevator stuck', description: 'Block B elevator stuck on 3rd floor', priority: 'urgent', status: 'resolved', assignedTo: 'u4', createdAt: '2025-01-05', updatedAt: '2025-01-06', feedback: 'Fixed quickly, thank you!' },
];

export const VISITORS: Visitor[] = [
  { id: 'vis1', name: 'Robert Johnson', phone: '+1234567899', unitId: 'unit1', purpose: 'Family Visit', checkInTime: '2025-01-12T10:30:00', preApproved: true, type: 'visitor' },
  { id: 'vis2', name: 'Amazon Delivery', phone: '+1234567800', unitId: 'unit1', purpose: 'Package Delivery', checkInTime: '2025-01-12T11:00:00', checkOutTime: '2025-01-12T11:15:00', preApproved: false, type: 'delivery' },
  { id: 'vis3', name: 'Electrician - Quick Fix', phone: '+1234567801', unitId: 'unit2', purpose: 'Repair Work', checkInTime: '2025-01-12T09:00:00', preApproved: false, type: 'service' },
];

export const FACILITIES: Facility[] = [
  { id: 'f1', name: 'Gymnasium', description: 'Fully equipped modern gym with cardio and weight training sections', capacity: 20, timings: '5:00 AM - 10:00 PM', amenities: ['Treadmills', 'Weight Training', 'Yoga Area', 'Shower Room'], rules: ['Proper gym attire required', 'Wipe equipment after use'], isPaid: false },
  { id: 'f2', name: 'Party Hall', description: 'Spacious party hall for celebrations and gatherings', capacity: 100, timings: '9:00 AM - 11:00 PM', amenities: ['AC', 'Sound System', 'Tables & Chairs', 'Kitchen Access'], rules: ['Book 3 days in advance', 'Clean after use', 'No loud music after 10 PM'], isPaid: true, pricePerHour: 1000 },
  { id: 'f3', name: 'Swimming Pool', description: 'Temperature controlled swimming pool with kids section', capacity: 30, timings: '6:00 AM - 9:00 PM', amenities: ['Changing Rooms', 'Shower', 'Kids Pool', 'Loungers'], rules: ['Swim cap mandatory', 'No diving', 'Shower before entering'], isPaid: false },
  { id: 'f4', name: 'Clubhouse', description: 'Community clubhouse with indoor games and reading area', capacity: 40, timings: '8:00 AM - 10:00 PM', amenities: ['Billiards', 'Table Tennis', 'Cards Room', 'Library'], rules: ['Replace equipment after use', 'Maintain silence in reading area'], isPaid: false },
];

export const FACILITY_BOOKINGS: FacilityBooking[] = [
  { id: 'fb1', facilityId: 'f2', unitId: 'unit1', bookedBy: 'u1', date: '2025-01-20', startTime: '18:00', endTime: '22:00', status: 'approved', purpose: 'Birthday Party' },
  { id: 'fb2', facilityId: 'f2', unitId: 'unit2', bookedBy: 'u5', date: '2025-01-25', startTime: '10:00', endTime: '14:00', status: 'pending', purpose: 'Family Gathering' },
];

export const NOTICES: Notice[] = [
  { id: 'n1', title: 'Water Supply Interruption', content: 'Water supply will be interrupted on Jan 15th from 10 AM to 2 PM for tank cleaning.', type: 'notice', createdAt: '2025-01-10', createdBy: 'u2', important: true },
  { id: 'n2', title: 'Republic Day Celebration', content: 'Join us for Republic Day celebrations on Jan 26th at the clubhouse. Flag hoisting at 8 AM followed by cultural programs.', type: 'event', createdAt: '2025-01-08', createdBy: 'u2', eventDate: '2025-01-26', important: false },
  { id: 'n3', title: 'New Parking Rules', content: 'New parking guidelines effective from Feb 1st. Please read the attached document for details.', type: 'circular', createdAt: '2025-01-05', createdBy: 'u2', attachment: 'parking_rules.pdf', important: true },
  { id: 'n4', title: 'Annual General Meeting', content: 'AGM scheduled for Feb 10th at 6 PM in the clubhouse. All owners are requested to attend.', type: 'event', createdAt: '2025-01-02', createdBy: 'u2', eventDate: '2025-02-10', important: true },
];

export const VENDORS: Vendor[] = [
  { id: 'vd1', name: 'QuickFix Plumbing', category: 'Plumbing', phone: '+1234567810', email: 'quickfix@email.com', rating: 4.5, contractEnd: '2025-06-30' },
  { id: 'vd2', name: 'PowerElec Solutions', category: 'Electrical', phone: '+1234567811', rating: 4.2 },
  { id: 'vd3', name: 'CleanSweep Services', category: 'Housekeeping', phone: '+1234567812', rating: 4.8, contractEnd: '2025-12-31' },
  { id: 'vd4', name: 'GreenThumb Gardens', category: 'Landscaping', phone: '+1234567813', rating: 4.0 },
];

export const STAFF: Staff[] = [
  { id: 's1', name: 'Rajesh Kumar', role: 'Security Guard', phone: '+1234567820', shift: 'Day (6AM-6PM)', attendance: [{ date: '2025-01-12', status: 'present' }, { date: '2025-01-11', status: 'present' }] },
  { id: 's2', name: 'Suresh Patel', role: 'Security Guard', phone: '+1234567821', shift: 'Night (6PM-6AM)', attendance: [{ date: '2025-01-12', status: 'present' }, { date: '2025-01-11', status: 'absent' }] },
  { id: 's3', name: 'Maya Singh', role: 'Housekeeping', phone: '+1234567822', shift: 'Day (8AM-5PM)', attendance: [{ date: '2025-01-12', status: 'present' }] },
  { id: 's4', name: 'Ram Sharma', role: 'Maintenance', phone: '+1234567823', shift: 'Day (9AM-6PM)', attendance: [{ date: '2025-01-12', status: 'leave' }] },
];

export const POLLS: Poll[] = [
  {
    id: 'poll1', question: 'Should we extend gym timings to 11 PM?', createdAt: '2025-01-05', endsAt: '2025-01-20', createdBy: 'u2', isAnonymous: true, votedBy: ['u1'],
    options: [{ id: 'o1', text: 'Yes', votes: 45 }, { id: 'o2', text: 'No', votes: 15 }, { id: 'o3', text: 'Indifferent', votes: 10 }],
  },
  {
    id: 'poll2', question: 'Preferred day for community cleanup drive?', createdAt: '2025-01-10', endsAt: '2025-01-25', createdBy: 'u2', isAnonymous: false, votedBy: [],
    options: [{ id: 'o4', text: 'Saturday', votes: 30 }, { id: 'o5', text: 'Sunday', votes: 25 }],
  },
];

export const DOCUMENTS: Document[] = [
  { id: 'd1', title: 'Society Bylaws', category: 'rules', uploadedAt: '2024-01-15', uploadedBy: 'u2', fileType: 'pdf' },
  { id: 'd2', title: 'AGM Minutes - Dec 2024', category: 'minutes', uploadedAt: '2024-12-20', uploadedBy: 'u2', fileType: 'pdf' },
  { id: 'd3', title: 'Annual Budget 2025', category: 'budget', uploadedAt: '2025-01-01', uploadedBy: 'u2', fileType: 'pdf' },
  { id: 'd4', title: 'Security Contract', category: 'contract', uploadedAt: '2024-06-01', uploadedBy: 'u2', fileType: 'pdf' },
];

export const PARKING_SLOTS: ParkingSlot[] = [
  { id: 'ps1', slotNumber: 'P-A101', type: 'resident', assignedTo: 'unit1', vehicleNumber: 'ABC-1234' },
  { id: 'ps2', slotNumber: 'P-B202', type: 'resident', assignedTo: 'unit2', vehicleNumber: 'XYZ-5678' },
  { id: 'ps3', slotNumber: 'V-01', type: 'visitor' },
  { id: 'ps4', slotNumber: 'V-02', type: 'visitor' },
];

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  { id: 'e1', name: 'Police', type: 'Emergency', phone: '100', available24x7: true },
  { id: 'e2', name: 'Ambulance', type: 'Medical', phone: '102', available24x7: true },
  { id: 'e3', name: 'Fire Station', type: 'Emergency', phone: '101', available24x7: true },
  { id: 'e4', name: 'Society Security', type: 'Internal', phone: '+1234567892', available24x7: true },
  { id: 'e5', name: 'Management Office', type: 'Internal', phone: '+1234567891', available24x7: false },
  { id: 'e6', name: 'Nearest Hospital', type: 'Medical', phone: '+1234567850', available24x7: true },
];

export const TICKET_CATEGORIES = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'elevator', label: 'Elevator' },
  { value: 'security', label: 'Security' },
  { value: 'other', label: 'Other' },
];

export const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: '#10B981' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#EF4444' },
  { value: 'urgent', label: 'Urgent', color: '#DC2626' },
];
