const { test } = require('node:test');
const assert = require('node:assert/strict');
const { normalizeCaseStudy, projectRecord } = require('../project-case-study');
test('case-study input is trimmed and limited to supported sections', () => {
  assert.deepEqual(normalizeCaseStudy({ role: ' Developer ', problem: ' ', ignored: 'never publish' }), { role: 'Developer' });
  assert.deepEqual(normalizeCaseStudy('{"problem":"Student registration"}'), { problem: 'Student registration' });
  assert.throws(() => normalizeCaseStudy({ role: 'x'.repeat(1501) }));
  assert.throws(() => normalizeCaseStudy({ outcome: 100 }));
  assert.throws(() => normalizeCaseStudy('broken json'));
});
test('older records remain readable without case-study fields', () => {
  assert.deepEqual(projectRecord({ id: 1 }).case_study, {});
  assert.equal(projectRecord({ id: 1 }).featured, false);
  assert.deepEqual(projectRecord({ id: 1, case_study: 'corrupt' }).case_study, {});
  assert.equal(projectRecord({ id: 1, featured: 1 }).featured, true);
});
test('featured projects appear first without changing the original list', async () => {
  const { prioritizeProjects, caseStudySections } = await import('../client/src/data/caseStudies.js');
  const input = [{ id: 1 }, { id: 2, featured: true }, { id: 3 }];
  assert.deepEqual(prioritizeProjects(input).map(row => row.id), [2, 1, 3]);
  assert.deepEqual(input.map(row => row.id), [1, 2, 3]);
  assert.equal(caseStudySections({ problem: 'Verified problem', role: '' }).length, 1);
});
