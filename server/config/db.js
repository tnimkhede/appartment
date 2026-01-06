const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('apartment', 'postgres', '123456', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('PostgreSQL Connected...');
        // Sync models - alter tables to match models, preserving data.
        await sequelize.sync({ alter: true }); // Changed from force: true to alter: true to preserve data.
        console.log('Database Synced');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
