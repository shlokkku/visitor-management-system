// server/testConnection.js
const pool = require('./config/db');

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Successfully connected to the MySQL database!');
    connection.release();
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

testConnection();