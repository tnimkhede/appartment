const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Poll = sequelize.define('Poll', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    options: {
        type: DataTypes.JSONB, // [{ id, text, votes }]
        allowNull: false,
    },
    endsAt: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    isAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    votedBy: {
        type: DataTypes.JSONB, // [userId1, userId2]
        defaultValue: [],
    },
});

module.exports = Poll;
