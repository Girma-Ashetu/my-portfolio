const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createAdminLogin } = require('../admin-auth');
const { createAuth } = require('../auth');
function response() { return { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } }; }
const db = { query: async () => [[]] };
const env = { NODE_ENV: 'production', JWT_SECRET: 'test-only-not-a-deployment-key-at-least-32', ADMIN_USER: 'owner', ADMIN_PASS: 'configured-password-test-only' };
test('production cannot sign in with the old default password', async () => {
  const res = response(); await createAdminLogin({ db, env })({ body: { username: 'admin', password: 'admin123' } }, res); assert.equal(res.code, 401);
});
test('configured admin signs in and the signed token authenticates', async () => {
  const res = response(); await createAdminLogin({ db, env })({ body: { username: 'owner', password: 'configured-password-test-only' } }, res);
  assert.equal(res.code, 200); let passed = false;
  createAuth(env)({ headers: { authorization: 'Bearer ' + res.body.token } }, response(), () => { passed = true; }); assert.equal(passed, true);
});
test('dummy tokens cannot edit demos', () => {
  const res = response(); createAuth(env)({ headers: { authorization: 'Bearer dummy-token' } }, res, () => assert.fail('Authentication bypass')); assert.equal(res.code, 401);
});
test('production requires a configured signing secret', async () => {
  const res = response(); await createAdminLogin({ db, env: { NODE_ENV: 'production' } })({ body: { username: 'admin', password: 'admin123' } }, res); assert.equal(res.code, 503);
});
