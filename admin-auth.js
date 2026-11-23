const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
function jwtSecret(env = process.env) {
  const production = env.NODE_ENV === 'production' || Boolean(env.VERCEL);
  if (production && (!env.JWT_SECRET || env.JWT_SECRET.length < 32 || /replace_with|development-only|your.secret/i.test(env.JWT_SECRET))) return null;
  return env.JWT_SECRET || (!production ? 'portfolio-local-development-only' : null);
}
function createAdminLogin({ db, env = process.env }) {
  return async (req, res) => {
    const { username, password } = req.body || {};
    if (typeof username !== 'string' || typeof password !== 'string' || username.length > 255 || password.length > 1024) return res.status(400).json({ message: 'Enter your username and password.' });
    const secret = jwtSecret(env);
    if (!secret) return res.status(503).json({ message: 'Administrator sign-in is not configured on this deployment.' });
    const production = env.NODE_ENV === 'production' || Boolean(env.VERCEL);
    if (production && env.ADMIN_PASS && (env.ADMIN_PASS.length < 12 || /^(admin123|choose_a_unique_password|password)$/i.test(env.ADMIN_PASS))) return res.status(503).json({ message: 'Configure a unique administrator password of at least 12 characters.' });
    if (production && (password.length < 12 || password === 'admin123')) return res.status(401).json({ message: 'Invalid administrator username or password.' });
    let valid = Boolean(env.ADMIN_PASS) && username === (env.ADMIN_USER || 'admin') && password === env.ADMIN_PASS;
    let adminId = 1;
    if (!valid) {
      try {
        const [rows] = await db.query('SELECT id, password FROM admins WHERE username=?', [username]);
        if (rows[0] && /^\$2[aby]\$/.test(rows[0].password)) {
          valid = await bcrypt.compare(password, rows[0].password);
          adminId = rows[0].id;
        }
      } catch { /* A configured environment account can still sign in without the database. */ }
    }
    if (!valid && !env.ADMIN_PASS && env.NODE_ENV !== 'production' && !env.VERCEL) valid = username === 'admin' && password === 'admin123';
    if (!valid) return res.status(401).json({ message: 'Invalid administrator username or password.' });
    const token = jwt.sign({ id: adminId, username }, secret, { algorithm: 'HS256', expiresIn: '24h' });
    return res.json({ token, message: 'Signed in.' });
  };
}
module.exports = { createAdminLogin, jwtSecret };
