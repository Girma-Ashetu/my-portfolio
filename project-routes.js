const { normalizeProject, normalizeDemoUrl } = require('./project-fields');
const { ensureProjectSchema } = require('./project-schema');
const { projectRecord } = require('./project-case-study');

function createProjectHandlers({ db, ensureSchema = ensureProjectSchema }) {
  const validId = value => /^\d+$/.test(String(value)) && Number(value) > 0;
  function failure(res, err) {
    console.error('Project operation failed:', err.code || 'UNKNOWN');
    const schemaError = ['PROJECT_SCHEMA_MISSING', 'ER_TABLEACCESS_DENIED_ERROR', 'ER_DBACCESS_DENIED_ERROR', 'ER_BAD_FIELD_ERROR', 'ER_NO_SUCH_TABLE'].includes(err.code);
    return res.status(503).json({ message: schemaError ? 'The project database needs setup or migration access. Run npm run db:migrate with your database administrator account.' : 'The project database is unavailable. Nothing was saved. Please try again when the database is connected.' });
  }
  async function read(id) {
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    return projectRecord(rows[0]);
  }
  return {
    async list(req, res) {
      try {
        const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC, id DESC');
        res.setHeader('Cache-Control', 'no-store');
        return res.json(rows.map(projectRecord));
      } catch (err) { return failure(res, err); }
    },
    async save(req, res) {
      if (req.method === 'PUT' && !validId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' });
      if (req.is?.('multipart/form-data') && !req.file && !req.body?.title) return res.status(400).json({ message: 'Use a screenshot URL on this deployment. File uploads need the persistent Express server.' });
      if (req.file) req.body.image_url = `uploads/${req.file.filename}`;
      let project;
      try { project = normalizeProject(req.body); }
      catch (err) { return res.status(400).json({ message: err.message }); }
      try {
        await ensureSchema(db);
        const { title, description, long_description, technologies, link, demo_url, image_url, case_study, featured } = project;
        const values = [title, description, long_description, technologies, link, demo_url || null, image_url, JSON.stringify(case_study), featured ? 1 : 0];
        let id = req.params?.id;
        if (req.method === 'PUT') {
          const [result] = await db.query('UPDATE projects SET title=?, description=?, long_description=?, technologies=?, link=?, demo_url=?, image_url=?, case_study=?, featured=? WHERE id=?', [...values, id]);
          if (!result.affectedRows && !await read(id)) return res.status(404).json({ message: 'Project not found.' });
        } else {
          const [result] = await db.query('INSERT INTO projects (title, description, long_description, technologies, link, demo_url, image_url, case_study, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', values);
          id = result.insertId;
          if (!id) throw new Error('The database did not confirm the write.');
        }
        const saved = await read(id);
        if (!saved) throw new Error('The saved project could not be read back.');
        return res.status(req.method === 'POST' ? 201 : 200).json({ message: 'Project saved successfully.', project: saved });
      } catch (err) { return failure(res, err); }
    },
    async demo(req, res) {
      if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' });
      let demoUrl;
      try { demoUrl = normalizeDemoUrl(req.body?.demo_url); }
      catch (err) { return res.status(400).json({ message: err.message }); }
      try {
        await ensureSchema(db);
        await db.query('UPDATE projects SET demo_url=? WHERE id=?', [demoUrl || null, req.params.id]);
        const saved = await read(req.params.id);
        if (!saved) return res.status(404).json({ message: 'Project not found.' });
        if (String(saved.demo_url || '') !== demoUrl) throw new Error('The database did not confirm the demo change.');
        return res.json({ message: demoUrl ? 'Live demo saved.' : 'Live demo removed.', project: saved });
      } catch (err) { return failure(res, err); }
    },
    async remove(req, res) {
      if (!validId(req.params.id)) return res.status(400).json({ message: 'Invalid project ID.' });
      try {
        const [result] = await db.query('DELETE FROM projects WHERE id=?', [req.params.id]);
        if (!result.affectedRows) return res.status(404).json({ message: 'Project not found.' });
        return res.json({ message: 'Project deleted.' });
      } catch (err) { return failure(res, err); }
    },
  };
}

function registerProjectRoutes(app, { db, auth, upload }) {
  const handlers = createProjectHandlers({ db });
  app.get('/api/projects', handlers.list);
  const middleware = upload ? [auth, upload.single('image')] : [auth];
  app.post('/api/admin/projects', ...middleware, handlers.save);
  app.put('/api/admin/projects/:id', ...middleware, handlers.save);
  app.patch('/api/admin/projects/:id/demo', auth, handlers.demo);
  app.delete('/api/admin/projects/:id', auth, handlers.remove);
}
module.exports = { createProjectHandlers, registerProjectRoutes };
