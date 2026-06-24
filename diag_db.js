require('dotenv').config({ path: './backend/.env' });
const db = require('./backend/config/db');
async function check() {
  try {
    const [rows] = await db.query('SELECT * FROM projects');
    console.log('--- DATABASE PROJECTS ---');
    console.log(JSON.stringify(rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('❌ SQL ERROR:', err.message);
    process.exit(1);
  }
}
check();
