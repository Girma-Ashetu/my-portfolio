const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection immediately
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ DATABASE CONNECTION FAILED:', err.message);
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('👉 Tip: Check your DB_USER and DB_PASSWORD in .env');
    } else if (err.code === 'ENOTFOUND') {
      console.error('👉 Tip: Check your DB_HOST (it should usually be localhost)');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('👉 Tip: Database does not exist. Run schema.sql first!');
    }
  } else {
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
    connection.release();
  }
});

module.exports = pool.promise();
