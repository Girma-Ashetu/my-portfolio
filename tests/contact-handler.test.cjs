const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createContactHandler } = require('../contact-handler');
function response() { return { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } }; }
const body = { name: 'Visitor', email: 'visitor@example.com', message: 'A project inquiry.' };
test('contact confirms receipt only after database storage', async () => {
  const res = response(); await createContactHandler({ db: { query: async () => [{ insertId: 5 }] }, notify: async () => false })({ body }, res); assert.equal(res.code, 201);
});
test('contact can fall back to confirmed email delivery', async () => {
  const res = response(); await createContactHandler({ db: { query: async () => { throw new Error('offline'); } }, notify: async () => true })({ body }, res); assert.equal(res.code, 201);
});
test('contact reports failure when neither storage nor email is available', async () => {
  const res = response(); await createContactHandler({ db: { query: async () => [[]] }, notify: async () => false })({ body }, res); assert.equal(res.code, 503);
});
