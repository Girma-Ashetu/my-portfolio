const db = require('../db');
const { ensureProjectSchema } = require('../project-schema');
(async () => {
  try { await ensureProjectSchema(db); console.log('Project schema is ready. Demo URLs can be saved.'); }
  catch (err) { console.error('Project migration failed:', err.code || err.message); process.exitCode = 1; }
  finally { await db.end(); }
})();
