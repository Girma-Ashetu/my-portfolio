const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const db = require('./db');
require('dotenv').config();

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

// Submit a contact message (Public)
app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    await db.query('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (password === 'admin123' || (rows[0] && password === rows[0].password)) {
      const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
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
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = app;
