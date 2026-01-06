const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Ticket = sequelize.define('Ticket', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    category: {
        type: DataTypes.ENUM('plumbing', 'electrical', 'cleaning', 'elevator', 'security', 'other'),
        allowNull: false,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('open', 'in-progress', 'resolved'),
        defaultValue: 'open',
    },
    feedback: {
        type: DataTypes.TEXT,
    },
});

module.exports = Ticket;
