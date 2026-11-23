const fs = require('node:fs/promises');
const path = require('node:path');
const db = require('../db');
const { ensureProjectSchema } = require('../project-schema');
const { createProjectHandlers } = require('../project-routes');
(async () => {
  try {
    const { studentShowcase } = await import('../client/src/data/studentShowcase.js');
    const [rows] = await db.query('SELECT * FROM projects WHERE title IN (?, ?)', ['Student Registration Management System', studentShowcase.title]);
    if (rows.length !== 1) throw new Error('Expected exactly one existing student project. No records changed.');
    const backupDir = path.resolve(__dirname, '../.local');
    await fs.mkdir(backupDir, { recursive: true });
    try { await fs.writeFile(path.join(backupDir, 'student-showcase-before.json'), JSON.stringify(rows[0], null, 2), { flag: 'wx' }); }
    catch (err) { if (err.code !== 'EEXIST') throw err; }
    await ensureProjectSchema(db);
    const response = { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
    const handlers = createProjectHandlers({ db });
    await handlers.save({ method: 'PUT', params: { id: String(rows[0].id) }, body: studentShowcase }, response);
    if (response.code !== 200 || !response.body?.project?.featured) throw new Error(response.body?.message || 'Showcase update could not be verified.');
    console.log('Student showcase updated: verified web stack, project repository, actual login screenshot, structured case study, featured first.');
    console.log('The demo URL remains empty. The previous record is backed up in .local/student-showcase-before.json.');
  } catch (err) { console.error('Student showcase update failed:', err.code || err.message); process.exitCode = 1; }
  finally { await db.end(); }
})();
