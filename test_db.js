const db = require('./backend/config/db');
async function check() {
  try {
    const [rows] = await db.query('SHOW TABLES');
    console.log('Tables:', rows);
    const [admins] = await db.query('SELECT * FROM admins');
    console.log('Admins:', admins);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}
check();
