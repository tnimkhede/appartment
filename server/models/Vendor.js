const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Vendor = sequelize.define('Vendor', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
    },
    address: {
        type: DataTypes.TEXT,
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    contractEnd: {
        type: DataTypes.DATEONLY,
    },
});

module.exports = Vendor;
