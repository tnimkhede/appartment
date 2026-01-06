const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Bill = sequelize.define('Bill', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    type: {
        type: DataTypes.ENUM('maintenance', 'water', 'gas', 'common'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('paid', 'pending', 'overdue'),
        defaultValue: 'pending',
    },
    paidDate: {
        type: DataTypes.DATEONLY,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    month: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Bill;
