const migrations = new WeakMap();

function ensureProjectSchema(db) {
  if (!migrations.has(db)) {
    const migration = (async () => {
      const [columns] = await db.query("SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'projects'");
      if (!columns.length) throw Object.assign(new Error('Create the portfolio database using schema.sql first.'), { code: 'PROJECT_SCHEMA_MISSING' });
      for (const [name, definition] of [['demo_url', 'VARCHAR(2048) NULL'], ['long_description', 'TEXT NULL'], ['case_study', 'TEXT NULL'], ['featured', 'TINYINT(1) NOT NULL DEFAULT 0']]) {
        if (!columns.some(column => column.COLUMN_NAME === name)) {
          try { await db.query(`ALTER TABLE projects ADD COLUMN ${name} ${definition}`); }
          catch (err) { if (err.code !== 'ER_DUP_FIELDNAME') throw err; }
        }
      }
      const link = columns.find(column => column.COLUMN_NAME === 'link');
      if (link && Number(link.CHARACTER_MAXIMUM_LENGTH) < 2048) await db.query('ALTER TABLE projects MODIFY COLUMN link VARCHAR(2048)');
    })().catch(err => { migrations.delete(db); throw err; });
    migrations.set(db, migration);
  }
  return migrations.get(db);
}
module.exports = { ensureProjectSchema };
