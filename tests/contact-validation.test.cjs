const { test } = require('node:test');
const assert = require('node:assert/strict');

test('contact validation identifies fields and rejects whitespace-only messages', async () => {
  const { validateContact } = await import('../client/src/data/contactValidation.js');
  assert.deepEqual(Object.keys(validateContact({ name: ' ', email: 'invalid', message: '          ' })), ['name', 'email', 'message']);
  assert.deepEqual(validateContact({ name: 'Girma', email: 'visitor@example.com', message: 'A useful project question.' }), {});
  const errors = validateContact({ name: 'x'.repeat(121), email: 'x'.repeat(255) + '@example.com', message: 'x'.repeat(10001) });
  assert.deepEqual(Object.keys(errors), ['name', 'email', 'message']);
});
