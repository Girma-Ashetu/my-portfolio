const mysql = require('mysql2/promise');
const { databaseConfig } = require('./database-config');
require('dotenv').config();
let pool;
function getPool() {
  if (!pool) pool = mysql.createPool(databaseConfig());
  return pool;
}
// Failed database writes must reject, never return a fake successful result.
module.exports = {
  query: (...args) => getPool().query(...args),
  getConnection: () => getPool().getConnection(),
  end: async () => { if (pool) { await pool.end(); pool = undefined; } },
};
