const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createProjectHandlers } = require('../project-routes');
function response() { return { code: 200, headers: {}, setHeader(key,value) { this.headers[key] = value; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } }; }
const body = { title: 'Test app', description: 'A useful application', technologies: 'React, NestJS', link: 'https://github.com/example/app', demo_url: 'https://example.com/demo', image_url: 'bank.png' };
function fixture() {
  let rows = [];
  const calls = [];
  const db = { query: async (sql, values = []) => {
    calls.push({ sql, values });
    if (sql.startsWith('INSERT')) { rows.push({ ...body, id: 12, title: values[0], description: values[1], long_description: values[2], technologies: values[3], link: values[4], demo_url: values[5], image_url: values[6], case_study: values[7], featured: values[8] }); return [{ insertId: 12, affectedRows: 1 }]; }
    if (sql.startsWith('UPDATE projects SET demo_url')) { const row = rows.find(item => item.id === Number(values[1])); if (row) row.demo_url = values[0]; return [{ affectedRows: row ? 1 : 0 }]; }
    if (sql.startsWith('UPDATE')) { const row = rows.find(item => item.id === Number(values[9])); if (row) Object.assign(row, { title: values[0], description: values[1], long_description: values[2], technologies: values[3], link: values[4], demo_url: values[5], image_url: values[6], case_study: values[7], featured: values[8] }); return [{ affectedRows: row ? 1 : 0 }]; }
    if (sql.startsWith('DELETE')) { const before = rows.length; rows = rows.filter(row => row.id !== Number(values[0])); return [{ affectedRows: before - rows.length }]; }
    return [values.length ? rows.filter(row => row.id === Number(values[0])).map(row => ({ ...row })) : rows.map(row => ({ ...row }))];
  } };
  const handlers = createProjectHandlers({ db, ensureSchema: async () => {} });
  return { db, handlers, calls };
}
async function create(handlers, project = body) { const res = response(); await handlers.save({ method: 'POST', body: project, is: () => false }, res); return res; }
test('create confirms persisted, independent demo and source fields', async () => {
 const { handlers } = fixture(); const res = await create(handlers);
 assert.equal(res.code, 201); assert.equal(res.body.project.demo_url, body.demo_url); assert.equal(res.body.project.link, body.link);
});
test('Add Demo works without changing the other project fields', async () => {
 const { handlers } = fixture(); await create(handlers, { ...body, demo_url: '' });
 const res = response(); await handlers.demo({ params: { id: '12' }, body: { demo_url: 'my-app.vercel.app' } }, res);
 assert.equal(res.code, 200); assert.equal(res.body.project.demo_url, 'https://my-app.vercel.app/'); assert.equal(res.body.project.title, body.title); assert.equal(res.body.project.link, body.link);
});
test('demo can be changed, removed, and read immediately from public catalogue', async () => {
 const { handlers } = fixture(); await create(handlers);
 for (const demo_url of ['https://example.com/new-demo', '']) {
  const saved = response(); await handlers.demo({ params: { id: '12' }, body: { demo_url } }, saved); assert.equal(saved.code, 200);
  const list = response(); await handlers.list({}, list); assert.equal(list.body[0].demo_url, demo_url || null); assert.equal(list.headers['Cache-Control'], 'no-store');
 }
});
test('full edit preserves demo and returns updated record', async () => {
 const { handlers } = fixture(); await create(handlers);
 const res = response(); await handlers.save({ method: 'PUT', params: { id: '12' }, body: { ...body, title: 'Updated' } }, res);
 assert.equal(res.body.project.title, 'Updated'); assert.equal(res.body.project.demo_url, body.demo_url);
});
test('invalid URLs are rejected before any writes', async () => {
 const { handlers, calls } = fixture(); const res = response();
 await handlers.demo({ params: { id: '12' }, body: { demo_url: 'javascript:alert(1)' } }, res);
 assert.equal(res.code, 400); assert.equal(calls.length, 0);
});
test('missing projects cannot report a successful demo update', async () => {
 const { handlers } = fixture(); const res = response(); await handlers.demo({ params: { id: '999' }, body: { demo_url: body.demo_url } }, res); assert.equal(res.code, 404);
});
test('database failures are visible and never return success', async () => {
 const db = { query: async () => { throw Object.assign(new Error('offline'), { code: 'ECONNREFUSED' }); } };
 const handlers = createProjectHandlers({ db, ensureSchema: async () => {} });
 const res = await create(handlers); assert.equal(res.code, 503); assert.match(res.body.message, /Nothing was saved/);
});
test('empty fake database results cannot report success', async () => {
 const handlers = createProjectHandlers({ db: { query: async () => [[], []] }, ensureSchema: async () => {} });
 const res = await create(handlers); assert.equal(res.code, 503);
});
test('nonexistent and invalid IDs are handled clearly', async () => {
 const { handlers, calls } = fixture(); const res = response(); await handlers.demo({ params: { id: 'bad' }, body: { demo_url: body.demo_url } }, res); assert.equal(res.code, 400); assert.equal(calls.length, 0);
});

test('case studies and feature priority survive save, read, and demo edits', async () => {
 const { handlers } = fixture();
 const study = { role: 'Full-stack implementation', problem: 'Student enrolment', approach: 'Express and MySQL transactions', outcome: 'Implemented; deployment pending' };
 const created = await create(handlers, { ...body, case_study: study, featured: true });
 assert.deepEqual(created.body.project.case_study, study); assert.equal(created.body.project.featured, true);
 const edited = response(); await handlers.demo({ params: { id: '12' }, body: { demo_url: 'https://example.com/case-study-demo' } }, edited);
 assert.deepEqual(edited.body.project.case_study, study); assert.equal(edited.body.project.featured, true);
 const updated = response(); await handlers.save({ method: 'PUT', params: { id: '12' }, body: { ...body, featured: false, case_study: { ...study, outcome: 'Updated result' } } }, updated);
 assert.equal(updated.body.project.featured, false); assert.equal(updated.body.project.case_study.outcome, 'Updated result');
});
