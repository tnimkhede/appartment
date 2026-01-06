const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Facility = sequelize.define('Facility', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    timings: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amenities: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    rules: {
        type: DataTypes.JSONB,
        defaultValue: [],
    },
    isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    pricePerHour: {
        type: DataTypes.FLOAT,
    },
    image: {
        type: DataTypes.STRING,
    },
});

module.exports = Facility;
