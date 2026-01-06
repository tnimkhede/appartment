const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const EmergencyContact = sequelize.define('EmergencyContact', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    available24x7: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

module.exports = EmergencyContact;
