const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Staff = sequelize.define('Staff', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    shift: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    attendance: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
});

module.exports = Staff;
