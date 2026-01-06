const dotenv = require('dotenv');
const { connectDB, sequelize } = require('../config/db');
const {
    User,
    Unit,
    Ticket,
    Bill,
    Staff,
    Notice,
    Visitor,
    Facility,
    FacilityBooking,
    Poll,
    Vendor,
    Document,
    ParkingSlot,
    EmergencyContact,
} = require('../models');

dotenv.config();

const importData = async () => {
    try {
        await connectDB();

        // Users
        const users = await User.bulkCreate([
            { name: 'John Smith', email: 'resident@apt.com', password: 'pass123', role: 'resident', unitNumber: 'A-101', phone: '+1234567890' },
            { name: 'Sarah Johnson', email: 'admin@apt.com', password: 'pass123', role: 'management', unitNumber: 'Office', phone: '+1234567891' },
            { name: 'Mike Brown', email: 'security@apt.com', password: 'pass123', role: 'security', unitNumber: 'Gate-1', phone: '+1234567892' },
            { name: 'Tom Wilson', email: 'maintenance@apt.com', password: 'pass123', role: 'maintenance', unitNumber: 'Service', phone: '+1234567893' },
            { name: 'Jane Doe', email: 'jane@apt.com', password: 'pass123', role: 'resident', unitNumber: 'B-202', phone: '+1234567894' },
        ], { individualHooks: true }); // Important for password hashing hook

        const adminUser = users[1];
        const resident1 = users[0];
        const resident2 = users[4];
        const maintenanceUser = users[3];

        // Units
        const units = await Unit.bulkCreate([
            {
                number: 'A-101', block: 'A', floor: 1, type: '3BHK', ownerId: resident1.id,
                familyMembers: [{ name: 'Mary Smith', relation: 'Spouse', phone: '+1234567895' }, { name: 'Tommy Smith', relation: 'Son' }],
                pets: [{ name: 'Max', type: 'Dog', breed: 'Golden Retriever' }],
                vehicles: [{ type: 'car', make: 'Toyota', model: 'Camry', number: 'ABC-1234', parkingSlot: 'P-A101' }],
            },
            {
                number: 'B-202', block: 'B', floor: 2, type: '2BHK', ownerId: resident2.id,
                familyMembers: [{ name: 'Bob Doe', relation: 'Spouse' }],
                pets: [],
                vehicles: [{ type: 'bike', make: 'Honda', model: 'CBR', number: 'XYZ-5678', parkingSlot: 'P-B202' }],
            },
        ]);

        // Tickets
        await Ticket.bulkCreate([
            { unitId: units[0].id, createdById: resident1.id, category: 'plumbing', subject: 'Leaking faucet', description: 'Kitchen faucet is leaking continuously', priority: 'medium', status: 'open' },
            { unitId: units[0].id, createdById: resident1.id, category: 'electrical', subject: 'Faulty switch', description: 'Bedroom light switch not working', priority: 'low', status: 'in-progress', assignedToId: maintenanceUser.id },
            { unitId: units[1].id, createdById: resident2.id, category: 'elevator', subject: 'Elevator stuck', description: 'Block B elevator stuck on 3rd floor', priority: 'urgent', status: 'resolved', assignedToId: maintenanceUser.id, feedback: 'Fixed quickly, thank you!' },
        ]);

        // Bills
        await Bill.bulkCreate([
            { unitId: units[0].id, type: 'maintenance', amount: 5000, dueDate: '2025-01-15', status: 'pending', description: 'Monthly Maintenance', month: 'January 2025' },
            { unitId: units[0].id, type: 'water', amount: 500, dueDate: '2025-01-15', status: 'pending', description: 'Water Charges', month: 'January 2025' },
            { unitId: units[0].id, type: 'maintenance', amount: 5000, dueDate: '2024-12-15', status: 'paid', paidDate: '2024-12-10', description: 'Monthly Maintenance', month: 'December 2024' },
            { unitId: units[1].id, type: 'maintenance', amount: 4000, dueDate: '2025-01-15', status: 'overdue', description: 'Monthly Maintenance', month: 'January 2025' },
        ]);

        // Staff
        await Staff.bulkCreate([
            { name: 'Rajesh Kumar', role: 'Security Guard', phone: '+1234567820', shift: 'Day (6AM-6PM)', attendance: [{ date: '2025-01-12', status: 'present' }, { date: '2025-01-11', status: 'present' }] },
            { name: 'Suresh Patel', role: 'Security Guard', phone: '+1234567821', shift: 'Night (6PM-6AM)', attendance: [{ date: '2025-01-12', status: 'present' }, { date: '2025-01-11', status: 'absent' }] },
            { name: 'Maya Singh', role: 'Housekeeping', phone: '+1234567822', shift: 'Day (8AM-5PM)', attendance: [{ date: '2025-01-12', status: 'present' }] },
            { name: 'Ram Sharma', role: 'Maintenance', phone: '+1234567823', shift: 'Day (9AM-6PM)', attendance: [{ date: '2025-01-12', status: 'leave' }] },
        ]);

        // Notices
        await Notice.bulkCreate([
            { title: 'Water Supply Interruption', content: 'Water supply will be interrupted on Jan 15th from 10 AM to 2 PM for tank cleaning.', type: 'notice', createdById: adminUser.id, important: true },
            { title: 'Republic Day Celebration', content: 'Join us for Republic Day celebrations on Jan 26th at the clubhouse. Flag hoisting at 8 AM followed by cultural programs.', type: 'event', createdById: adminUser.id, eventDate: '2025-01-26', important: false },
        ]);

        // Facilities
        const facilities = await Facility.bulkCreate([
            { name: 'Gymnasium', description: 'Fully equipped modern gym', capacity: 20, timings: '5:00 AM - 10:00 PM', amenities: ['Treadmills', 'Weights'], rules: ['Proper attire required'], isPaid: false },
            { name: 'Party Hall', description: 'Spacious party hall', capacity: 100, timings: '9:00 AM - 11:00 PM', amenities: ['AC', 'Sound System'], rules: ['Clean after use'], isPaid: true, pricePerHour: 1000 },
        ]);

        // Facility Bookings
        await FacilityBooking.bulkCreate([
            { facilityId: facilities[1].id, unitId: units[0].id, bookedById: resident1.id, date: '2025-01-20', startTime: '18:00', endTime: '22:00', status: 'approved', purpose: 'Birthday Party' },
        ]);

        // Visitors
        await Visitor.bulkCreate([
            { name: 'Robert Johnson', phone: '+1234567899', unitId: units[0].id, purpose: 'Family Visit', checkInTime: new Date('2025-01-12T10:30:00'), preApproved: true, type: 'visitor' },
            { name: 'Amazon Delivery', phone: '+1234567800', unitId: units[0].id, purpose: 'Package Delivery', checkInTime: new Date('2025-01-12T11:00:00'), checkOutTime: new Date('2025-01-12T11:15:00'), preApproved: false, type: 'delivery' },
        ]);

        // Polls
        await Poll.bulkCreate([
            {
                question: 'Should we extend gym timings to 11 PM?',
                options: [{ text: 'Yes', votes: 45 }, { text: 'No', votes: 15 }, { text: 'Indifferent', votes: 10 }],
                endsAt: '2025-01-20',
                createdById: adminUser.id,
                isAnonymous: true,
                votedBy: [resident1.id],
            },
        ]);

        // Vendors
        await Vendor.bulkCreate([
            { name: 'QuickFix Plumbing', category: 'Plumbing', phone: '+1234567810', email: 'quickfix@email.com', rating: 4.5, contractEnd: '2025-06-30' },
            { name: 'PowerElec Solutions', category: 'Electrical', phone: '+1234567811', rating: 4.2 },
            { name: 'CleanSweep Services', category: 'Housekeeping', phone: '+1234567812', rating: 4.8, contractEnd: '2025-12-31' },
        ]);

        // Documents
        await Document.bulkCreate([
            { title: 'Society Bylaws', category: 'rules', uploadedBy: adminUser.id, fileType: 'pdf' },
            { title: 'AGM Minutes - Dec 2024', category: 'minutes', uploadedBy: adminUser.id, fileType: 'pdf' },
            { title: 'Annual Budget 2025', category: 'budget', uploadedBy: adminUser.id, fileType: 'pdf' },
        ]);

        // Parking Slots
        await ParkingSlot.bulkCreate([
            { slotNumber: 'P-A101', type: 'resident', assignedTo: units[0].id, vehicleNumber: 'ABC-1234' },
            { slotNumber: 'P-B202', type: 'resident', assignedTo: units[1].id, vehicleNumber: 'XYZ-5678' },
            { slotNumber: 'V-01', type: 'visitor' },
            { slotNumber: 'V-02', type: 'visitor' },
        ]);

        // Emergency Contacts
        await EmergencyContact.bulkCreate([
            { name: 'Police', type: 'Emergency', phone: '100', available24x7: true },
            { name: 'Ambulance', type: 'Medical', phone: '102', available24x7: true },
            { name: 'Fire Station', type: 'Emergency', phone: '101', available24x7: true },
            { name: 'Society Security', type: 'Internal', phone: '+1234567892', available24x7: true },
            { name: 'Management Office', type: 'Internal', phone: '+1234567891', available24x7: false },
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
