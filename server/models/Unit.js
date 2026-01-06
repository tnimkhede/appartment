const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Unit = sequelize.define('Unit', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    block: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    floor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    familyMembers: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    pets: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    vehicles: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
});

module.exports = Unit;
