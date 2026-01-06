const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FacilityBooking = sequelize.define('FacilityBooking', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
        defaultValue: 'pending',
    },
    purpose: {
        type: DataTypes.STRING,
    },
});

module.exports = FacilityBooking;
