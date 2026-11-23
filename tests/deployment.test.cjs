const { test } = require('node:test');
const assert = require('node:assert/strict');
const { databaseConfig } = require('../database-config');
const { jwtSecret, createAdminLogin } = require('../admin-auth');

test('cloud database TLS verifies certificates and supports a supplied CA', () => {
  const config = databaseConfig({ DB_SSL: 'true', DB_SSL_CA: 'line1\\nline2', DB_PORT: '4000' });
  assert.equal(config.ssl.rejectUnauthorized, true);
  assert.equal(config.ssl.ca, 'line1\nline2');
  assert.equal(config.port, 4000);
  assert.equal(databaseConfig({}).ssl, undefined);
  assert.throws(() => databaseConfig({ DB_SSL: 'skip-verification' }));
});

test('production rejects short and placeholder signing secrets', () => {
  for (const JWT_SECRET of ['', 'short', 'replace_with_a_long_random_secret']) assert.equal(jwtSecret({ NODE_ENV: 'production', JWT_SECRET }), null);
  assert.equal(jwtSecret({ NODE_ENV: 'development' }), 'portfolio-local-development-only');
});

test('production cannot enable the local default password through configuration', async () => {
  const res = { status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
  await createAdminLogin({ env: { NODE_ENV: 'production', JWT_SECRET: 'test-secret-at-least-32-characters-long', ADMIN_PASS: 'admin123' }, db: { query: async () => assert.fail('No database lookup expected') } })({ body: { username: 'admin', password: 'admin123' } }, res);
  assert.equal(res.code, 503);
});

test('social metadata uses the configured domain and rejects URLs containing credentials', async () => {
  const { siteMetadata, resolveSiteUrl } = await import('../client/site-metadata.js');
  assert.equal(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'portfolio.vercel.app' }), 'https://portfolio.vercel.app');
  assert.equal(resolveSiteUrl({ SITE_URL: 'https://custom.example', VERCEL_PROJECT_PRODUCTION_URL: 'portfolio.vercel.app' }), 'https://custom.example');
  assert.deepEqual(siteMetadata(''), []);
  const tags = siteMetadata('https://portfolio.example');
  assert.equal(tags.find(tag => tag.attrs.rel === 'canonical').attrs.href, 'https://portfolio.example/');
  assert.equal(tags.find(tag => tag.attrs.property === 'og:image').attrs.content, 'https://portfolio.example/about_profile-optimized.jpg');
  assert.throws(() => siteMetadata('https://user:secret@example.com'));
  assert.throws(() => siteMetadata('https://example.com/path'));
});

test('contact email escapes submitted HTML and preserves confirmed owner delivery', async () => {
  const { createContactNotifier } = require('../contact-mail');
  const sent = [];
  const notify = createContactNotifier({ env: { GMAIL_USER: 'owner@example.com', GMAIL_APP_PASSWORD: 'test-only' }, createTransport: options => {
    assert.equal(options.socketTimeout, 6000);
    return { sendMail: async mail => { sent.push(mail); if (sent.length === 2) throw new Error('Acknowledgement failure'); } };
  } });
  assert.equal(await notify('<img src=x>', 'visitor@example.com', '<script>alert(1)</script>'), true);
  assert.ok(sent[0].html.includes('&lt;img src=x&gt;'));
  assert.ok(!sent[0].html.includes('<script>'));
  assert.equal(sent[0].replyTo, 'visitor@example.com');
});

test('a disconnected inbox never reports a successful empty list or deletion', async () => {
  const { createMessageHandlers } = require('../message-routes');
  const handlers = createMessageHandlers({ query: async () => { throw new Error('offline'); } });
  const response = () => ({ status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } });
  const list = response(); await handlers.list({}, list); assert.equal(list.code, 503);
  const remove = response(); await handlers.remove({ params: { id: '3' } }, remove); assert.equal(remove.code, 503);
});

test('database bootstrap preserves existing records and inserts no default credentials', async () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const schema = fs.readFileSync(path.join(__dirname, '../schema.sql'), 'utf8').replace(/^--.*$/gm, '');
  const statements = schema.split(';').map(value => value.trim()).filter(Boolean);
  assert.equal(statements.length, 3);
  for (const statement of statements) assert.match(statement, /^CREATE TABLE IF NOT EXISTS\s/i);
  assert.doesNotMatch(schema, /\b(DROP|TRUNCATE|DELETE|INSERT)\b/i);
});

test('real mail transport can compile the portfolio templates without sending email', async () => {
  const nodemailer = require('nodemailer');
  const { createContactNotifier } = require('../contact-mail');
  const transport = nodemailer.createTransport({ jsonTransport: true });
  const notify = createContactNotifier({ env: { GMAIL_USER: 'owner@example.com', GMAIL_APP_PASSWORD: 'test-only' }, createTransport: () => transport });
  assert.equal(await notify('Visitor', 'visitor@example.com', 'A project inquiry.'), true);
});
