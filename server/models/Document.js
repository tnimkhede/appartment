const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Document = sequelize.define('Document', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: DataTypes.ENUM('rules', 'minutes', 'budget', 'contract', 'other'),
        allowNull: false,
    },
    uploadedBy: {
        type: DataTypes.UUID,
    },
    fileType: {
        type: DataTypes.ENUM('pdf', 'doc', 'image'),
        allowNull: false,
    },
    fileUrl: {
        type: DataTypes.STRING,
    },
});

module.exports = Document;
