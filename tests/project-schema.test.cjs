const { test } = require('node:test');
const assert = require('node:assert/strict');
const { ensureProjectSchema } = require('../project-schema');
test('upgrades an existing database once, without dropping project data', async () => {
  const calls = [];
  const db = { query: async sql => { calls.push(sql); return [[{ COLUMN_NAME: 'link', CHARACTER_MAXIMUM_LENGTH: 255 }]]; } };
  await Promise.all([ensureProjectSchema(db), ensureProjectSchema(db)]);
  await ensureProjectSchema(db);
  assert.equal(calls.filter(sql => sql.startsWith('SELECT')).length, 1);
  assert.ok(calls.some(sql => sql.includes('ADD COLUMN demo_url')));
  assert.ok(calls.some(sql => sql.includes('ADD COLUMN long_description')));
  assert.ok(calls.every(sql => !/DROP|DELETE|TRUNCATE/.test(sql)));
});
test('already migrated databases do not perform schema writes', async () => {
  const calls = [];
  const db = { query: async sql => { calls.push(sql); return [[{ COLUMN_NAME: 'link', CHARACTER_MAXIMUM_LENGTH: 2048 }, { COLUMN_NAME: 'demo_url' }, { COLUMN_NAME: 'long_description' }, { COLUMN_NAME: 'case_study' }, { COLUMN_NAME: 'featured' }]]; } };
  await ensureProjectSchema(db);
  assert.equal(calls.length, 1);
});
test('failed migrations can be retried after connectivity returns', async () => {
  let connected = false;
  const db = { query: async () => { if (!connected) throw new Error('offline'); return [[{ COLUMN_NAME: 'demo_url' }, { COLUMN_NAME: 'long_description' }]]; } };
  await assert.rejects(ensureProjectSchema(db));
  connected = true;
  await ensureProjectSchema(db);
});
