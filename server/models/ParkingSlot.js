const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ParkingSlot = sequelize.define('ParkingSlot', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    slotNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.ENUM('resident', 'visitor'),
        allowNull: false,
    },
    assignedTo: {
        type: DataTypes.UUID,
    },
    vehicleNumber: {
        type: DataTypes.STRING,
    },
});

module.exports = ParkingSlot;
