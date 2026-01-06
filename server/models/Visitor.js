const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Visitor = sequelize.define('Visitor', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    purpose: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vehicleNumber: {
        type: DataTypes.STRING,
    },
    checkInTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    checkOutTime: {
        type: DataTypes.DATE,
    },
    preApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    type: {
        type: DataTypes.ENUM('visitor', 'delivery', 'service'),
        allowNull: false,
    },
});

module.exports = Visitor;
