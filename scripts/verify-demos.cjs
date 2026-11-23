const assert = require('node:assert/strict');
const db = require('../db');
const { createProjectHandlers } = require('../project-routes');
function response() { return { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } }; }
(async () => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    // Schema migration is separate: DDL must not run inside this rollback test.
    const handlers = createProjectHandlers({ db: connection, ensureSchema: async () => {} });
    const created = response();
    await handlers.save({ method: 'POST', body: { title: '__portfolio_demo_verification__', description: 'Temporary transaction-only verification record.', technologies: 'NestJS, Django, Angular', demo_url: 'https://example.com/first-demo' } }, created);
    assert.equal(created.code, 201);
    const id = String(created.body.project.id);
    for (const demo_url of ['https://example.com/updated-demo', '', 'my-app.vercel.app']) {
      const edited = response();
      await handlers.demo({ params: { id }, body: { demo_url } }, edited);
      assert.equal(edited.code, 200);
      const [rows] = await connection.query('SELECT demo_url FROM projects WHERE id=?', [id]);
      assert.equal(rows[0].demo_url, edited.body.project.demo_url);
    }
    console.log('Real MySQL verification passed: create project, add/change/remove demo, and read persisted values.');
  } catch (err) { console.error('Demo verification failed:', err.code || err.message); process.exitCode = 1; }
  finally {
    if (connection) { await connection.rollback(); connection.release(); }
    await db.end();
    console.log('Verification transaction rolled back; no test project retained.');
  }
})();
