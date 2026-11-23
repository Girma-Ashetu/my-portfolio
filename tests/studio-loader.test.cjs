const { test } = require('node:test');
const assert = require('node:assert/strict');

test('a failed inbox does not hide projects or their demo controls', async () => {
  const { loadStudioSections } = await import('../client/src/data/studioLoader.js');
  const result = await loadStudioSections(async path => {
    if (path === '/api/projects') return [{ id: 7, title: 'Student records' }];
    throw new Error('Inbox unavailable');
  });
  assert.equal(result.projects.data[0].id, 7);
  assert.equal(result.projects.error, null);
  assert.equal(result.messages.error, 'Inbox unavailable');
});

test('a failed project list is an error, not an empty portfolio', async () => {
  const { loadStudioSections } = await import('../client/src/data/studioLoader.js');
  const result = await loadStudioSections(async path => {
    if (path === '/api/projects') throw new Error('Database unavailable');
    return [];
  });
  assert.equal(result.projects.data, null);
  assert.equal(result.projects.error, 'Database unavailable');
  assert.deepEqual(result.messages.data, []);
});

test('malformed list responses are rejected independently', async () => {
  const { loadStudioSections } = await import('../client/src/data/studioLoader.js');
  const result = await loadStudioSections(async path => path === '/api/projects' ? {} : []);
  assert.match(result.projects.error, /invalid list/);
  assert.equal(result.messages.error, null);
});
