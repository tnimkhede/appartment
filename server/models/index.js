const User = require('./User');
const Unit = require('./Unit');
const Ticket = require('./Ticket');
const Bill = require('./Bill');
const Staff = require('./Staff');
const Notice = require('./Notice');
const Visitor = require('./Visitor');
const Facility = require('./Facility');
const FacilityBooking = require('./FacilityBooking');
const Poll = require('./Poll');
const Vendor = require('./Vendor');
const Document = require('./Document');
const ParkingSlot = require('./ParkingSlot');
const EmergencyContact = require('./EmergencyContact');

// Unit Relationships
Unit.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
Unit.belongsTo(User, { as: 'tenant', foreignKey: 'tenantId' });
User.hasOne(Unit, { as: 'ownedUnit', foreignKey: 'ownerId' });

// Ticket Relationships
Ticket.belongsTo(Unit, { foreignKey: 'unitId' });
Ticket.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
Ticket.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });

// Bill Relationships
Bill.belongsTo(Unit, { foreignKey: 'unitId' });

// Visitor Relationships
Visitor.belongsTo(Unit, { foreignKey: 'unitId' });

// Notice Relationships
Notice.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });

// Facility Booking Relationships
FacilityBooking.belongsTo(Facility, { foreignKey: 'facilityId' });
FacilityBooking.belongsTo(Unit, { foreignKey: 'unitId' });
FacilityBooking.belongsTo(User, { as: 'bookedBy', foreignKey: 'bookedById' });

// Poll Relationships
Poll.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });

module.exports = {
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
};
