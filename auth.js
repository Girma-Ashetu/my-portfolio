const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  // For demo purposes, we'll allow a dummy token or standard JWT
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access denied' });

  if (token === 'dummy-token') return next();

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
