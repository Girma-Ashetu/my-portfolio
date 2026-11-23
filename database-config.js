function databaseConfig(env = process.env) {
  const tls = env.DB_SSL === 'true';
  if (env.DB_SSL && !['true', 'false'].includes(env.DB_SSL)) throw new Error('DB_SSL must be true or false.');
  if (env.DB_SSL_CA && !tls) throw new Error('DB_SSL_CA requires DB_SSL=true.');
  return {
    host: env.DB_HOST || 'localhost', user: env.DB_USER,
    password: env.DB_PASSWORD, database: env.DB_NAME,
    port: Number(env.DB_PORT || 3306), waitForConnections: true,
    connectionLimit: 5, queueLimit: 20, connectTimeout: 5000,
    ...(tls ? { ssl: { rejectUnauthorized: true, ...(env.DB_SSL_CA ? { ca: env.DB_SSL_CA.replace(/\\n/g, '\n') } : {}) } } : {}),
  };
}
module.exports = { databaseConfig };
