const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5432,
});

const createDatabase = async () => {
    try {
        await client.connect();
        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'apartment'");
        if (res.rowCount === 0) {
            await client.query('CREATE DATABASE apartment');
            console.log('Database "apartment" created successfully.');
        } else {
            console.log('Database "apartment" already exists.');
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
};

createDatabase();
