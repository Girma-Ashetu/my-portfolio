const fs = require('node:fs');
const path = require('node:path');
const db = require('../db');
const { ensureProjectSchema } = require('../project-schema');

async function setupDatabase(database) {
  const sql = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8');
  const statements = sql.replace(/^--.*$/gm, '').split(';').map(statement => statement.trim()).filter(Boolean);
  for (const statement of statements) {
    if (!/^CREATE TABLE IF NOT EXISTS\s/i.test(statement)) throw new Error('Database setup accepts only non-destructive CREATE TABLE statements.');
    await database.query(statement);
  }
  await ensureProjectSchema(database);
}
if (require.main === module) (async () => {
  try { await setupDatabase(db); console.log('Portfolio tables are ready. Existing data was preserved; no admin credentials or sample records were inserted.'); }
  catch (error) { console.error('Database setup failed:', error.code || error.message); process.exitCode = 1; }
  finally { await db.end(); }
})();
module.exports = { setupDatabase };
