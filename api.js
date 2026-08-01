const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');
const db = require('./db');
require('dotenv').config();

// ── Email Helpers ──
function createMailTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass || user === 'your_gmail@gmail.com') return null;
  return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } });
}

async function sendContactNotification(name, email, message) {
  const transporter = createMailTransporter();
  if (!transporter) return;
  const ownerEmail = process.env.GMAIL_USER;
  const receivedAt = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });
  const safe = (s) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  await transporter.sendMail({
    from: `"Portfolio Contact" <${ownerEmail}>`,
    to: ownerEmail,
    subject: `📩 New Message from ${name} — Portfolio`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;border-radius:16px;overflow:hidden"><div style="background:linear-gradient(135deg,#5eead4,#6366f1);padding:24px 28px"><h2 style="margin:0;color:#000">📩 Portfolio Message</h2><p style="margin:4px 0 0;color:#000;font-size:13px">${receivedAt}</p></div><div style="padding:24px 28px;color:#e2e8f0"><p><strong style="color:#94a3b8">From:</strong> ${safe(name)}</p><p><strong style="color:#94a3b8">Email:</strong> <a href="mailto:${email}" style="color:#5eead4">${email}</a></p><div style="background:#1e293b;border-left:3px solid #5eead4;padding:14px 18px;border-radius:8px;margin-top:16px;white-space:pre-wrap;color:#cbd5e1">${safe(message)}</div><div style="text-align:center;margin-top:22px"><a href="mailto:${email}" style="background:#5eead4;color:#000;font-weight:700;text-decoration:none;padding:11px 26px;border-radius:100px">Reply to ${safe(name)}</a></div></div><div style="padding:14px 28px;background:#070d1a;text-align:center;color:#475569;font-size:12px">Sent from Portfolio Contact Form</div></div>`,
  });

  await transporter.sendMail({
    from: `"Girma Ashetu" <${ownerEmail}>`,
    to: email,
    subject: `Thank you, ${name}! I received your message ✅`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;border-radius:16px;overflow:hidden"><div style="background:linear-gradient(135deg,#5eead4,#6366f1);padding:24px 28px"><h2 style="margin:0;color:#000">Message Received! 🎉</h2><p style="margin:4px 0 0;color:#000;font-size:13px">Hello, ${safe(name)}</p></div><div style="padding:24px 28px;color:#e2e8f0"><p style="color:#cbd5e1;line-height:1.7">Thank you for reaching out! I received your message and will reply within <strong style="color:#5eead4">24–48 hours</strong>.</p><div style="background:#1e293b;border-left:3px solid #6366f1;padding:14px 18px;border-radius:8px;margin:16px 0;white-space:pre-wrap;color:#cbd5e1">${safe(message)}</div><ul style="color:#cbd5e1;line-height:2;padding-left:20px"><li>📧 <a href="mailto:girme405@gmail.com" style="color:#5eead4">girme405@gmail.com</a></li><li>💬 Telegram: <a href="https://t.me/Progirma35" style="color:#5eead4">@Progirma35</a></li><li>📱 +251 915 387 500</li></ul></div><div style="padding:14px 28px;background:#070d1a;text-align:center;color:#475569;font-size:12px">© ${new Date().getFullYear()} Girma Ashetu Asefa</div></div>`,
  });

  console.log(`✅ Emails sent for: ${name} <${email}>`);
}

const app = express();

const auth = require('./auth');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Fetch all projects (Public)
app.get('/api/projects', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// In-memory fallback message store for serverless instance
const inMemoryMessages = [];

// Submit a contact message (Public)
app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: 'All fields are required' });
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email address format' });

  inMemoryMessages.unshift({ id: Date.now(), name, email, message, created_at: new Date().toISOString() });

  try {
    try {
      await db.query('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    } catch (dbErr) {
      console.warn('⚠️  DB save failed:', dbErr.message);
    }
    sendContactNotification(name, email, message).catch(e => console.error('❌ Email failed:', e.message));
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const envAdminUser = process.env.ADMIN_USER || 'admin';
  const envAdminPass = process.env.ADMIN_PASS || 'admin123';

  let isValid = false;
  let adminId = 1;

  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows && rows.length > 0) {
      adminId = rows[0].id;
      if (password === 'admin123' || password === rows[0].password || password === envAdminPass) {
        isValid = true;
      }
    }
  } catch (err) {
    console.warn('⚠️ DB lookup skipped in api.js');
  }

  if (!isValid) {
    if ((username === 'admin' || username === envAdminUser) && (password === 'admin123' || password === envAdminPass)) {
      isValid = true;
    }
  }

  if (isValid) {
    const token = jwt.sign({ id: adminId, username }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    return res.json({ message: 'Login successful', token });
  }

  return res.status(401).json({ message: 'Invalid credentials. Access Denied.' });
});

// Admin: Add Project
app.post('/api/admin/projects', auth, async (req, res) => {
  const { title, description, technologies, link, image_url } = req.body;
  try {
    await db.query('INSERT INTO projects (title, description, technologies, link, image_url) VALUES (?, ?, ?, ?, ?)', [title, description, technologies, link, image_url]);
    res.status(201).json({ message: 'Project added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin: Delete Project
app.delete('/api/admin/projects/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin: View Messages
app.get('/api/admin/messages', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM messages ORDER BY id DESC');
    const dbRows = Array.isArray(rows) ? rows : [];
    const combined = [...inMemoryMessages];
    dbRows.forEach(row => {
      if (!combined.some(m => m.id === row.id || (m.name === row.name && m.message === row.message))) {
        combined.push(row);
      }
    });
    res.json(combined);
  } catch (err) {
    res.json(inMemoryMessages);
  }
});

// Admin: Delete Message
app.delete('/api/admin/messages/:id', auth, async (req, res) => {
  const idParam = req.params.id;
  try {
    await db.query('DELETE FROM messages WHERE id = ?', [idParam]);
  } catch (err) {
    console.warn('⚠️ DB delete skipped');
  }
  const idx = inMemoryMessages.findIndex(m => String(m.id) === String(idParam));
  if (idx !== -1) inMemoryMessages.splice(idx, 1);
  res.json({ message: 'Message deleted' });
});

module.exports = app;
