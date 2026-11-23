const fs = require('node:fs');
require('dotenv').config({ quiet: true });
const { jwtSecret } = require('../admin-auth');
const { databaseConfig } = require('../database-config');
const errors = [];
const env = { ...process.env, NODE_ENV: 'production' };
try { databaseConfig(env); } catch (error) { errors.push(error.message); }
if (/\.tidbcloud\.com$/i.test(env.DB_HOST || '') && env.DB_SSL !== 'true') errors.push('DB_SSL: TiDB Cloud public connections require DB_SSL=true.');
if (!jwtSecret(env)) errors.push('JWT_SECRET: set a unique random secret of at least 32 characters.');
if (!env.ADMIN_USER || !env.ADMIN_PASS || env.ADMIN_PASS.length < 12 || /admin123|choose_a_unique_password|your_password/i.test(env.ADMIN_PASS)) errors.push('ADMIN_USER / ADMIN_PASS: configure a unique account and a password of at least 12 characters.');
for (const key of ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME']) if (!env[key] || /^(your_|replace_)/i.test(env[key])) errors.push(`${key}: configure the production database value.`);
if (['localhost', '127.0.0.1', '::1'].includes(env.DB_HOST)) errors.push('DB_HOST: localhost is local development, not the external database for a serverless deployment.');
if (!Number.isInteger(Number(env.DB_PORT || 3306)) || Number(env.DB_PORT || 3306) < 1 || Number(env.DB_PORT || 3306) > 65535) errors.push('DB_PORT: enter a valid port.');
try {
  const url = new URL(env.SITE_URL || env.VITE_SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : ''));
  if (url.protocol !== 'https:' || !url.hostname.includes('.') || ['localhost', '127.0.0.1'].includes(url.hostname) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error();
} catch { errors.push('SITE_URL: set your final HTTPS portfolio origin before building.'); }
if (!fs.existsSync('dist/index.html')) errors.push('Build: run npm run build --prefix client.');
if (!fs.existsSync('client/public/cv.pdf')) errors.push('Résumé: client/public/cv.pdf is missing.');
if (Boolean(env.GMAIL_USER) !== Boolean(env.GMAIL_APP_PASSWORD)) errors.push('Email: provide both GMAIL_USER and GMAIL_APP_PASSWORD, or leave both empty for database-only contact delivery.');
if (errors.length) { console.error('Production configuration is incomplete (no secret values shown):\n' + errors.map(error => '- ' + error).join('\n')); process.exitCode = 1; }
else console.log('Production configuration checks passed. Verify database connectivity, migrations, and contact delivery on the deployed site.');
console.log('DB_SSL=true enables certificate-verified TLS; set DB_SSL_CA if your provider supplies a CA certificate.');
