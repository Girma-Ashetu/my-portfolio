const mysql = require('mysql2/promise');
require('dotenv').config();

let pool = null;

// Create the pool and test connection — gracefully handles failures
async function connectDB() {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Verify the connection actually works
    const conn = await pool.getConnection();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME);
    conn.release();
  } catch (err) {
    console.error('❌ DATABASE CONNECTION FAILED:', err.message);

    // Helpful diagnostic hints
    if (err.code === 'ER_ACCESS_DENIED_ERROR')  console.error('👉 Tip: Check DB_USER and DB_PASSWORD in .env');
    if (err.code === 'ENOTFOUND')               console.error('👉 Tip: Check DB_HOST — is the DB server reachable?');
    if (err.code === 'ER_BAD_DB_ERROR')         console.error('👉 Tip: Database does not exist. Run schema.sql first!');
    if (err.code === 'ECONNREFUSED')            console.error('👉 Tip: MySQL is not running on the specified host/port.');

    console.warn('⚠️  Server will run WITHOUT database functionality.');
    pool = null; // Ensure pool stays null so callers can check
  }
}

// Run immediately on startup — non-blocking
connectDB();

// ──────────────────────────────────────────────────────────────────────────────
// Safe proxy: if pool is null (DB offline), queries return an empty-safe result
// instead of throwing and crashing the server.
// ──────────────────────────────────────────────────────────────────────────────
const safePool = new Proxy({}, {
  get(_, prop) {
    return (...args) => {
      if (!pool) {
        console.warn(`⚠️  DB query skipped (no connection): ${prop}()`);
        // Return a promise that resolves to an empty result set
        return Promise.resolve([[], []]);
      }
      return pool[prop](...args);
    };
  }
});

module.exports = safePool;

