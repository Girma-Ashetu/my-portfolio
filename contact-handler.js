function createContactHandler({ db, notify }) {
  return async (req, res) => {
    const { name, email, message } = req.body || {};
    if (![name, email, message].every(value => typeof value === 'string' && value.trim()) || name.length > 120 || email.length > 254 || message.length > 10000 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Enter your name, a valid email address, and your message.' });
    let stored = false;
    try {
      const [result] = await db.query('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [name.trim(), email.trim(), message.trim()]);
      stored = Boolean(result.insertId);
    } catch (err) { console.error('Contact storage unavailable:', err.code); }
    if (stored) {
      // Serverless runtimes may freeze work scheduled after the response is sent.
      try { await notify(name, email, message); }
      catch (err) { console.error('Contact email unavailable:', err.code || 'MAIL_ERROR'); }
      return res.status(201).json({ message: 'Your message has been received.' });
    }
    try {
      if (await notify(name, email, message)) return res.status(201).json({ message: 'Your message has been emailed.' });
    } catch (err) { console.error('Contact delivery unavailable:', err.code || 'MAIL_ERROR'); }
    return res.status(503).json({ message: 'Your message could not be delivered. Please email girme405@gmail.com directly.' });
  };
}
module.exports = { createContactHandler };
