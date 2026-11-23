const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const { createContactNotifier } = require('./contact-mail');
const db = require('./db');
const { registerProjectRoutes } = require('./project-routes');
const { registerMessageRoutes } = require('./message-routes');
const { createAdminLogin } = require('./admin-auth');
const { createContactHandler } = require('./contact-handler');
require('dotenv').config();

// ── Email Helpers ──
const sendContactNotification = createContactNotifier();

const app = express();

const auth = require('./auth');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
registerProjectRoutes(app, { db, auth });




// Submit a contact message (Public)
app.post('/api/messages', createContactHandler({ db, notify: sendContactNotification }));

// Admin Login
app.post('/api/admin/login', createAdminLogin({ db }));

registerMessageRoutes(app, { db, auth });

module.exports = app;
