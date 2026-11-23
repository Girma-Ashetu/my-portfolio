function createMessageHandlers(db) {
  const unavailable = res => res.status(503).json({ message: 'The message database is unavailable. Please reconnect and retry.' });
  return {
    async list(req, res) {
      try {
        const [rows] = await db.query('SELECT * FROM messages ORDER BY id DESC');
        res.setHeader('Cache-Control', 'no-store');
        return res.json(rows);
      } catch { return unavailable(res); }
    },
    async remove(req, res) {
      if (!/^[1-9]\d*$/.test(String(req.params.id))) return res.status(400).json({ message: 'Invalid message ID.' });
      try {
        const [result] = await db.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
        if (!result.affectedRows) return res.status(404).json({ message: 'Message not found.' });
        return res.json({ message: 'Message deleted.' });
      } catch { return unavailable(res); }
    },
  };
}
function registerMessageRoutes(app, { db, auth }) {
  const handlers = createMessageHandlers(db);
  app.get('/api/admin/messages', auth, handlers.list);
  app.delete('/api/admin/messages/:id', auth, handlers.remove);
  app.get('/api/health', async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    try { await db.query('SELECT 1'); return res.json({ status: 'ready', database: 'connected' }); }
    catch { return res.status(503).json({ status: 'unavailable', database: 'disconnected' }); }
  });
}
module.exports = { createMessageHandlers, registerMessageRoutes };
