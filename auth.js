const jwt = require('jsonwebtoken');
const { jwtSecret } = require('./admin-auth');
require('dotenv').config();
function createAuth(env = process.env) {
  return (req, res, next) => {
    const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
    if (!token) return res.status(401).json({ message: 'Access denied.' });
    const secret = jwtSecret(env);
    if (!secret) return res.status(503).json({ message: 'Administrator access is not configured.' });
    try { req.user = jwt.verify(token, secret, { algorithms: ['HS256'] }); next(); }
    catch { return res.status(401).json({ message: 'Your session has expired. Please sign in again.' }); }
  };
}
module.exports = createAuth();
module.exports.createAuth = createAuth;
