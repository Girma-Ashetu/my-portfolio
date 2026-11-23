const { test } = require('node:test');
const assert = require('node:assert/strict');
test('an old in-flight catalogue request cannot overwrite a newly saved demo', async () => {
  const store = await import('../client/src/data/projectStore.js');
  const originalFetch = global.fetch;
  let resolveOld;
  let requests = 0;
  try {
    global.fetch = () => {
      requests += 1;
      if (requests === 1) return new Promise(resolve => { resolveOld = resolve; });
      return Promise.resolve({ ok: true, json: async () => [{ id: 1, demo_url: 'https://example.com/new' }] });
    };
    store.invalidateProjects();
    const old = store.loadProjects();
    store.invalidateProjects();
    const latest = await store.loadProjects();
    resolveOld({ ok: true, json: async () => [{ id: 1, demo_url: '' }] });
    const staleResult = await old;
    assert.equal(latest[0].demo_url, 'https://example.com/new');
    assert.equal(staleResult[0].demo_url, 'https://example.com/new');
    assert.equal(store.peekProjects()[0].demo_url, 'https://example.com/new');
  } finally { global.fetch = originalFetch; store.invalidateProjects(); }
});
