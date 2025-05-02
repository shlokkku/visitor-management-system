const mysql = require('mysql2/promise');
require('dotenv').config(); // Ensure dotenv is loaded to access environment variables

const pool = mysql.createPool({
  host: process.env.DB_HOST,            // Updated to use DB_HOST
  user: process.env.DB_USER,            // Updated to use DB_USER
  password: process.env.DB_PASSWORD,    // Updated to use DB_PASSWORD
  database: process.env.DB_NAME,        // Updated to use DB_NAME
  port: process.env.DB_PORT,            // Updated to use DB_PORT
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;