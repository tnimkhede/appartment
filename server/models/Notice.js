const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notice = sequelize.define('Notice', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('notice', 'event', 'circular'),
        allowNull: false,
    },
    eventDate: {
        type: DataTypes.DATEONLY,
    },
    attachment: {
        type: DataTypes.STRING,
    },
    important: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

module.exports = Notice;
