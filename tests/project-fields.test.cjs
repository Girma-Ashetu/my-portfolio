const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeProject } = require('../project-fields');
const base = { title: ' App ', description: 'A useful app', technologies: 'React' };
test('accepts projects without a public demo or source', () => {
  const project = normalizeProject(base);
  assert.equal(project.title, 'App');
  assert.equal(project.demo_url, '');
  assert.equal(project.link, '');
});
test('preserves independent source and demo addresses', () => {
  const project = normalizeProject({ ...base, link: 'https://github.com/example/app', demo_url: 'https://example.com/demo?q=1' });
  assert.equal(project.link, 'https://github.com/example/app');
  assert.equal(project.demo_url, 'https://example.com/demo?q=1');
});
test('rejects unsafe, malformed and excessive URLs', () => {
  for (const demo_url of ['javascript:alert(1)', 'data:text/html,hello', '/demo', 'invalid', 'https://example.com/' + 'a'.repeat(2048)]) {
    assert.throws(() => normalizeProject({ ...base, demo_url }));
  }
});
test('requires meaningful core project fields', () => {
  assert.throws(() => normalizeProject({ ...base, title: ' ' }));
  assert.throws(() => normalizeProject({ ...base, description: '' }));
});
