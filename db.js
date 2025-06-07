require('dotenv').config(); // Load environment variables from .env file

const createPool = require('mysql2/promise');

const pool = createPool.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // wait for connections to be available
});

module.exports = pool; // export the pool instance for use in other files
