const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');
const db = require('./db');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// ── Email Transporter ────────────────────────────────────────────────────────
function createMailTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass || user === 'your_gmail@gmail.com') {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

async function sendContactNotification(name, email, message) {
  const transporter = createMailTransporter();
  if (!transporter) {
    console.warn('⚠️  Email not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env');
    return;
  }

  const ownerEmail = process.env.GMAIL_USER;
  const receivedAt = new Date().toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });

  // ── 1. Notify owner ──
  await transporter.sendMail({
    from: `"Portfolio Contact" <${ownerEmail}>`,
    to: ownerEmail,
    subject: `📩 New Message from ${name} — Portfolio`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#5eead4,#6366f1);padding:28px 32px">
          <h1 style="margin:0;color:#000;font-size:22px">📩 New Portfolio Message</h1>
          <p style="margin:6px 0 0;color:#0f172a;font-size:14px;opacity:.8">${receivedAt} (Addis Ababa)</p>
        </div>
        <div style="padding:28px 32px;color:#e2e8f0">
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#94a3b8;width:100px">From</td><td style="padding:8px 0;color:#f8fafc;font-weight:600">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#94a3b8">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#5eead4">${email}</a></td></tr>
          </table>
          <div style="margin-top:20px;background:#1e293b;border-left:3px solid #5eead4;border-radius:8px;padding:16px 20px">
            <p style="margin:0;color:#cbd5e1;line-height:1.7;white-space:pre-wrap">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          <div style="margin-top:24px;text-align:center">
            <a href="mailto:${email}" style="display:inline-block;background:#5eead4;color:#000;font-weight:700;text-decoration:none;padding:12px 28px;border-radius:100px;font-size:14px">Reply to ${name}</a>
          </div>
        </div>
        <div style="padding:16px 32px;background:#070d1a;text-align:center;color:#475569;font-size:12px">
          Sent from your Portfolio Contact Form
        </div>
      </div>
    `,
  });

  // ── 2. Auto-reply to sender ──
  await transporter.sendMail({
    from: `"Girma Ashetu" <${ownerEmail}>`,
    to: email,
    subject: `Thank you, ${name}! I received your message ✅`,
    html: `
      <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#5eead4,#6366f1);padding:28px 32px">
          <h1 style="margin:0;color:#000;font-size:22px">Message Received! 🎉</h1>
          <p style="margin:6px 0 0;color:#0f172a;font-size:14px;opacity:.8">Hello, ${name}</p>
        </div>
        <div style="padding:28px 32px;color:#e2e8f0">
          <p style="color:#cbd5e1;line-height:1.7">Thank you for reaching out through my portfolio. I have received your message and will get back to you as soon as possible — usually within <strong style="color:#5eead4">24–48 hours</strong>.</p>
          <div style="margin:20px 0;background:#1e293b;border-left:3px solid #6366f1;border-radius:8px;padding:16px 20px">
            <p style="margin:0 0 6px;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:1px">Your Message</p>
            <p style="margin:0;color:#cbd5e1;line-height:1.7;white-space:pre-wrap">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </div>
          <p style="color:#94a3b8;font-size:14px">You can also reach me directly:</p>
          <ul style="color:#cbd5e1;line-height:2;padding-left:20px">
            <li>📧 <a href="mailto:girme405@gmail.com" style="color:#5eead4">girme405@gmail.com</a></li>
            <li>💬 Telegram: <a href="https://t.me/Progirma35" style="color:#5eead4">@Progirma35</a></li>
            <li>📱 +251 915 387 500</li>
          </ul>
        </div>
        <div style="padding:16px 32px;background:#070d1a;text-align:center;color:#475569;font-size:12px">
          © ${new Date().getFullYear()} Girma Ashetu Asefa · Jimma, Ethiopia
        </div>
      </div>
    `,
  });

  console.log(`✅ Contact email sent: ${name} <${email}>`);
}

const app = express();
const PORT = process.env.PORT || 5001;

const auth = require('./auth');

// Middleware
app.use(cors());
app.use(express.json());

const multer = require('multer');
const fs = require('fs');

const uploadDir = path.join(__dirname, 'client', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Serve static files from the React client build directory
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// ── Routes ───────────────────────────────────────────────────────────────────

// Fetch all projects (Public)
app.get('/api/projects', async (req, res) => {
  console.log('🚀 Projects API hit');
  try {
    const [rows] = await db.query('SELECT * FROM projects ORDER BY created_at DESC');
    console.log('✅ Found', rows.length, 'projects');
    res.json(rows);
  } catch (err) {
    console.error('❌ SQL ERROR in /api/projects:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
});

// In-Memory fallback store for messages
const inMemoryMessages = [];

// Submit a contact message (Public)
app.post('/api/messages', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ message: 'All fields are required' });

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ message: 'Invalid email address format' });

  // Store in memory
  const newMsg = {
    id: Date.now(),
    name,
    email,
    message,
    created_at: new Date().toISOString()
  };
  inMemoryMessages.unshift(newMsg);

  try {
    // 1. Save to database (non-blocking failure — don't let DB issues block delivery)
    try {
      await db.query('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)', [name, email, message]);
    } catch (dbErr) {
      console.warn('⚠️  DB save failed (continuing with email and memory):', dbErr.message);
    }

    // 2. Send email notifications (owner alert + auto-reply)
    sendContactNotification(name, email, message).catch(mailErr => {
      console.error('❌ Email send failed:', mailErr.message);
    });

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    console.error('❌ /api/messages error:', err);
    res.status(500).json({ message: 'Server Error. Please try emailing directly: girme405@gmail.com' });
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
    console.warn('⚠️ Admin DB lookup skipped:', err.message);
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
app.post('/api/admin/projects', auth, upload.single('image'), async (req, res) => {
  const { title, description, long_description, technologies, link } = req.body;
  let image_url = req.body.image_url; // fallback if string is passed
  if (req.file) {
    image_url = `uploads/${req.file.filename}`;
  }
  try {
    await db.query('INSERT INTO projects (title, description, long_description, technologies, link, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, long_description, technologies, link, image_url]);
    res.status(201).json({ message: 'Project added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin: Delete Project
app.delete('/api/admin/projects/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Admin: Update Project
app.put('/api/admin/projects/:id', auth, upload.single('image'), async (req, res) => {
  const { title, description, long_description, technologies, link } = req.body;
  let image_url = req.body.image_url;
  if (req.file) {
    image_url = `uploads/${req.file.filename}`;
  }
  try {
    await db.query(
      'UPDATE projects SET title=?, description=?, long_description=?, technologies=?, link=?, image_url=? WHERE id=?',
      [title, description, long_description, technologies, link, image_url, req.params.id]
    );
    res.json({ message: 'Project updated successfully' });
  } catch (err) {
    console.error(err);
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
    console.warn('⚠️ DB message delete skipped');
  }
  const idx = inMemoryMessages.findIndex(m => String(m.id) === String(idParam));
  if (idx !== -1) inMemoryMessages.splice(idx, 1);
  res.json({ message: 'Message deleted' });
});

// ── AI Chat System ────────────────────────────────────────────────────────────

const GEMINI_SYSTEM_PROMPT = `You are GAIA (Girma's Advanced Intelligent Assistant), an elite AI embedded in Girma Ashetu Asefa's professional portfolio website. You are highly conversational, witty, warm, and deeply knowledgeable about Girma and all areas of software engineering and technology.

═══════════════════════════════════════════
IDENTITY OF THE PERSON YOU REPRESENT
═══════════════════════════════════════════
Full Name: Girma Ashetu Asefa
Role: Software Engineering Student & Full-Stack Developer
University: Jimma Institute of Technology (JIT), Jimma, Ethiopia
Year: 4th Year Student (2022–Present)
Status: Actively seeking internships, junior roles, and collaboration opportunities

Contact:
  📧 Email: girme405@gmail.com
  📱 Phone: +251 915 387 500
  💬 Telegram: @Progirma35
  🐱 GitHub: https://github.com/Girma-Ashetu
  💼 LinkedIn: https://linkedin.com/in/girmaasefa
  📍 Location: Jimma, Ethiopia

═══════════════════════════════════════════
TECHNICAL SKILLS (DEEP KNOWLEDGE)
═══════════════════════════════════════════

Programming Languages:
  → Java (OOP, data structures, desktop apps, Android)
  → JavaScript / TypeScript (ES6+, async/await, Node.js)
  → Python (scripting, data processing, automation)
  → C++ (algorithms, competitive programming)
  → SQL (complex queries, stored procedures, optimization)
  → HTML5 & CSS3 (semantic HTML, animations, Flexbox/Grid)

Frontend Development:
  → React.js (hooks, context, custom hooks, JSX)
  → Next.js (SSR, SSG, API routes, App Router)
  → Bootstrap 5 (responsive grids, utilities)
  → Tailwind CSS (utility-first design)
  → Figma (UI/UX prototyping and design)
  → Responsive Design, CSS animations, glassmorphism

Backend Development:
  → Node.js + Express.js (REST APIs, middleware, routing)
  → JWT Authentication & bcrypt password hashing
  → MySQL & PostgreSQL (relational database design, normalization)
  → MongoDB (NoSQL, aggregation pipelines)
  → RESTful API design principles
  → MVC architecture, middleware, error handling

Mobile Development:
  → Flutter & Dart (cross-platform iOS/Android)
  → React Native (JavaScript-based mobile development)
  → Firebase (auth, Firestore, real-time database, hosting)

Cloud & DevOps:
  → AWS (EC2, S3, Lambda, IAM) — studying for Cloud Practitioner
  → Microsoft Azure (AZ-900 Fundamentals — in progress)
  → Docker (containerization basics)
  → Linux (command line, server administration)
  → Git & GitHub (version control, branching, pull requests)

Cybersecurity:
  → OWASP Top 10 vulnerabilities
  → Secure coding practices
  → Input validation, SQL injection prevention, XSS protection
  → Google Cybersecurity Certificate — in progress
  → Network security fundamentals

Tools & Workflow:
  → VS Code, IntelliJ IDEA, Android Studio
  → Postman (API testing), Insomnia
  → Git, GitHub Actions (CI/CD basics)
  → Figma, Adobe XD
  → Agile/Scrum methodology

Soft Skills:
  → Problem Solving & Critical Thinking
  → Team Collaboration & Leadership
  → Continuous Learning & Adaptability
  → Communication & Technical Writing
  → Analytical Thinking

═══════════════════════════════════════════
PROJECTS PORTFOLIO
═══════════════════════════════════════════

1. 🌐 This Portfolio Website (GAPortfolio)
   Stack: React.js + Node.js + Express + MySQL
   Features: Multilingual (EN/AM/OM), Gemini AI chatbot, Admin dashboard, Contact system, Premium glassmorphism UI

2. 🏦 Bank Management System
   Stack: Java (Swing) + JDBC + MySQL
   Features: Account management, Admin dashboard, Ethiopian Birr currency, Dark mode premium UI, Account status management (Active/Suspended/Frozen/Closed)

3. 📚 Course Management System (CSMS)
   Stack: HTML + CSS + JavaScript + PHP/MySQL
   Features: Student dashboard, Grade management, Role-based access

4. 🔐 Cybersecurity Projects
   Secure web app implementations following OWASP guidelines

5. 📱 Mobile Applications (Flutter)
   Cross-platform apps built with Flutter/Dart and Firebase backend

═══════════════════════════════════════════
CERTIFICATIONS
═══════════════════════════════════════════

In Progress:
  ✅ AWS Certified Cloud Practitioner (Amazon Web Services)
  ✅ Azure Fundamentals AZ-900 (Microsoft)
  ✅ Google Cybersecurity Certificate (Google)

Targeted Next:
  🎯 Cisco CCNA (Networking)
  🎯 Meta Front-End Developer Professional Certificate
  🎯 Meta Back-End Developer Professional Certificate

═══════════════════════════════════════════
3. RESPONSE LENGTH:
   → Short casual questions → 1-3 sentences max
   → Detailed technical questions → up to 6-8 sentences with structure
   → "Tell me everything" type → use bullet points and sections

4. FORMATTING (use these in responses):
   → Use **bold** for key terms and names
   → Use bullet points (•) for lists
   → Use emojis tastefully to make responses friendly
   → Break long responses into clear paragraphs

5. TECHNICAL KNOWLEDGE: You can answer ANY general software engineering, programming, career, or technology question. You are not limited to only Girma's portfolio — you are also a knowledgeable tech assistant. If someone asks about JavaScript, React, Python, cloud, interviews, career advice — answer fully and helpfully.

6. PORTFOLIO QUESTIONS: When asked about Girma, answer with confidence and enthusiasm. You know him deeply.

7. HIRING/COLLABORATION: If someone expresses interest in hiring or collaborating, be enthusiastic and share contact info. Encourage them to reach out directly.

8. IF ASKED WHO YOU ARE: Say you are GAIA (Girma's Advanced Intelligent Assistant), an AI built into his portfolio powered by Google Gemini.

9. DO NOT: Invent false facts about Girma. If unsure about a specific detail, say "Girma would be best placed to give you exact details — reach him at girme405@gmail.com".

10. BE PROACTIVE: End responses with a relevant follow-up question or suggestion when appropriate.

11. FORMATTING RULES: Always use Markdown extensively. Use **bolding** for emphasis, inline code for technical terms, and fenced code blocks when showing code examples.

12. UNKNOWN PERSONAL QUESTIONS: If someone asks a specific personal question about Girma that you do not have information about, say: "I don't have that specific detail, but you can ask Girma directly at girme405@gmail.com, Telegram: @Progirma35, or Phone: +251 915 387 500."`;


// ── Smart keyword fallback (used when no API key) ───────────────────────────
function smartFallback(message) {
  const msg = message.toLowerCase();
  const isAmharic = /[\u1200-\u137F]/.test(message);
  const isOromo = msg.includes('akkam') || msg.includes('girmaa') || msg.includes('barataa') || msg.includes('hojii');

  const responses = {
    hire: {
      en: "**Girma is actively available for hire!** 🚀 He's seeking internships and junior software engineering roles in **full-stack development**, **cloud**, and **cybersecurity**. Reach him directly at:\n📧 girme405@gmail.com\n💬 Telegram: @Progirma35\n📱 +251 915 387 500",
      am: "**ግርማ አሁን ለስራ ዝግጁ ነው!** 🚀 የስራ ልምምድ (internship) እና ጀማሪ ሶፍትዌር ምህንድስና ስራዎችን ይፈልጋል። ቀጥታ ያግኙት:\n📧 girme405@gmail.com\n💬 ቴሌግራም: @Progirma35",
      om: "**Girmaan hojii argachuuf qophii dha!** 🚀 Internship fi hojii injinariingii sooftiweerii barbaada. Kallattiidhaan quunnamaa:\n📧 girme405@gmail.com\n💬 Telegram: @Progirma35"
    },
    skills: {
      en: "Girma has an impressive **full-stack skill set** including:\n• **Frontend:** React.js, Next.js, HTML5, CSS3, Bootstrap\n• **Backend:** Node.js, Express.js, REST APIs, JWT auth\n• **Languages:** Java, JavaScript, Python, C++, SQL\n• **Mobile:** Flutter, React Native, Firebase\n• **Cloud:** AWS (studying), Azure AZ-900 (in progress)\n• **Security:** OWASP Top 10, Secure Coding\nWhat specific skill area interests you most?",
      am: "ግርማ **ሙሉ-ስቴክ ስልጠናዎች** አሉት:\n• **ፊት-ዳርቻ:** React.js, Next.js, HTML5, CSS3\n• **ኋለኛ-ዳርቻ:** Node.js, Express.js, REST APIs\n• **ቋንቋዎች:** Java, JavaScript, Python, C++\n• **ሞባይል:** Flutter, React Native\n• **ክላውድ:** AWS, Azure",
      om: "Girmaan **dandeettii guutuu** qaba:\n• **Frontend:** React.js, Next.js, HTML5\n• **Backend:** Node.js, Express.js, APIs\n• **Afaanota:** Java, JavaScript, Python\n• **Moobaayilaa:** Flutter, React Native"
    },
    projects: {
      en: "Here are Girma's key projects:\n\n🌐 **Portfolio Website** — React + Node.js + MySQL + AI Chatbot\n🏦 **Bank Management System** — Java + MySQL, Ethiopian banking system\n📚 **Course Management System** — Full-stack academic platform\n🔐 **Cybersecurity Apps** — OWASP-compliant secure web apps\n📱 **Flutter Mobile Apps** — Cross-platform mobile applications\n\nCheck out his GitHub: **github.com/Girma-Ashetu**",
      am: "ዋና ፕሮጀክቶቹ:\n🌐 **ፖርትፎሊዮ ድረ-ገፅ** - React + Node.js + AI\n🏦 **የባንክ አስተዳደር ስርዓት** - Java + MySQL\n📚 **የኮርስ አስተዳደር** - ሙሉ-ስቴክ\n\nጊትሃብ: github.com/Girma-Ashetu",
      om: "Pirojektoota gurguddoo:\n🌐 **Weebsaayitii Portfolio** - React + Node.js\n🏦 **Siistema Bulchiinsa Baankii** - Java + MySQL\n📚 **Siistema Hooggansa Koorsii**\n\nGitHub: github.com/Girma-Ashetu"
    },
    contact: {
      en: "You can reach Girma through multiple channels:\n📧 **Email:** girme405@gmail.com\n💬 **Telegram:** @Progirma35\n📱 **Phone:** +251 915 387 500\n🐱 **GitHub:** github.com/Girma-Ashetu\n💼 **LinkedIn:** linkedin.com/in/girmaasefa\n📍 **Location:** Jimma, Ethiopia",
      am: "ግርማን ለማግኘት:\n📧 girme405@gmail.com\n💬 ቴሌግራም: @Progirma35\n📱 +251 915 387 500\n🐱 GitHub: github.com/Girma-Ashetu",
      om: "Girmaa argachuuf:\n📧 girme405@gmail.com\n💬 Telegram: @Progirma35\n📱 +251 915 387 500"
    },
    certs: {
      en: "Girma is actively pursuing these certifications:\n\n**In Progress:**\n✅ AWS Certified Cloud Practitioner\n✅ Azure Fundamentals (AZ-900)\n✅ Google Cybersecurity Certificate\n\n**Targeted:**\n🎯 Cisco CCNA\n🎯 Meta Front-End Developer\n🎯 Meta Back-End Developer",
      am: "ግርማ እነዚህ ምስክርነቶችን ያሳድዳቸዋል:\n✅ AWS Cloud Practitioner\n✅ Azure AZ-900\n✅ Google Cybersecurity\n🎯 Cisco CCNA\n🎯 Meta Front-End",
      om: "Girmaan waraqaalee mirkaneessaa hordofaa jira:\n✅ AWS Cloud Practitioner\n✅ Azure AZ-900\n✅ Google Cybersecurity\n🎯 Cisco CCNA"
    },
    education: {
      en: "Girma is a **4th-year Software Engineering student** at **Jimma Institute of Technology (JIT)**, Ethiopia (2022–Present). His coursework covers OOP, Data Structures & Algorithms, Database Systems, Computer Networks, Operating Systems, Software Engineering principles, and Mobile App Development.",
      am: "ግርማ **ጅማ ቴክኖሎጂ ኢንስቲትዩት (JIT)** የ**4ኛ ዓመት ሶፍትዌር ምህንድስና ተማሪ** ነው (2022–አሁን).",
      om: "Girmaan barataa **waggaa 4ffaa Injinariingii Sooftiweerii** Inistiityuutii Teeknooloojii Jimmaa (JIT) (2022–ammaa)."
    },
    default: {
      en: "Hi! I'm **GAIA**, Girma's AI assistant! 👋 I'm here to help you learn all about Girma's skills, projects, certifications, and how to work with him. I can also answer general **tech and programming questions**!\n\nWhat would you like to know? Try asking about:\n• His tech stack or skills\n• His projects\n• How to hire or contact him\n• Career advice or tech questions",
      am: "ሰላም! እኔ **GAIA** ነኝ፣ የግርማ ኤአይ ረዳት! 👋 ስለ ግርማ ክህሎቶች፣ ፕሮጀክቶች እና ስለ ምን ሊረዳዎ እንደሚችል ለማወቅ ጥያቄዎ ምን ይሁን?",
      om: "Akkam! Ani **GAIA**, gargaaraa AI Girmaati! 👋 Waa'ee Girma fi teeknooloojii maal barbaadda?"
    }
  };

  const lang = isAmharic ? 'am' : isOromo ? 'om' : 'en';

  if (msg.includes('hire') || msg.includes('job') || msg.includes('work') || msg.includes('intern') || msg.includes('employ') || msg.includes('recruit') || msg.includes('ስራ') || msg.includes('hojii'))
    return responses.hire[lang];
  if (msg.includes('skill') || msg.includes('tech') || msg.includes('stack') || msg.includes('know') || msg.includes('can') || msg.includes('ክህሎ') || msg.includes('dandeettii'))
    return responses.skills[lang];
  if (msg.includes('project') || msg.includes('built') || msg.includes('made') || msg.includes('work') || msg.includes('portfolio') || msg.includes('ፕሮጀክ') || msg.includes('pirojekt'))
    return responses.projects[lang];
  if (msg.includes('contact') || msg.includes('email') || msg.includes('reach') || msg.includes('phone') || msg.includes('telegram') || msg.includes('አግኙ') || msg.includes('quunnam'))
    return responses.contact[lang];
  if (msg.includes('cert') || msg.includes('aws') || msg.includes('azure') || msg.includes('cisco') || msg.includes('ምስክ') || msg.includes('waraqaa'))
    return responses.certs[lang];
  if (msg.includes('educat') || msg.includes('universit') || msg.includes('school') || msg.includes('study') || msg.includes('student') || msg.includes('jit') || msg.includes('jimma') || msg.includes('ጅማ') || msg.includes('jimmaa'))
    return responses.education[lang];

  return responses.default[lang];
}

// ── Standard Chat Endpoint ───────────────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10;

  if (!hasKey) {
    return res.json({ reply: smartFallback(message), fallback: true });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.85,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const chatHistory = (history || [])
      .filter(m => m.content && m.content.trim())
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: { parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
    });

    const result = await chat.sendMessage(message);
    const reply = result.response.text();
    res.json({ reply, fallback: false });
  } catch (err) {
    console.error('❌ Gemini Error:', err.message);
    // Gracefully fall back on Gemini failure
    if (err.message.includes('API_KEY') || err.message.includes('401') || err.message.includes('403')) {
      return res.json({ reply: smartFallback(message), fallback: true });
    }
    res.status(500).json({ error: 'AI service temporarily unavailable. Please try again in a moment.' });
  }
});

// ── Streaming Chat Endpoint ──────────────────────────────────────────────────
app.post('/api/chat/stream', async (req, res) => {
  const { message, history } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: 'Message is required' });

  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.length > 10;

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const sendChunk = (text) => res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
  const sendDone = () => res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  const sendError = (msg) => res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);

  if (!hasKey) {
    const reply = smartFallback(message);
    // Simulate streaming for fallback
    const words = reply.split(' ');
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        sendChunk(words[i] + (i < words.length - 1 ? ' ' : ''));
        i++;
      } else {
        clearInterval(interval);
        sendDone();
        res.end();
      }
    }, 30);
    return;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { temperature: 0.85, topK: 40, topP: 0.95, maxOutputTokens: 1024 },
    });

    const chatHistory = (history || [])
      .filter(m => m.content && m.content.trim())
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

    const chat = model.startChat({
      history: chatHistory,
      systemInstruction: { parts: [{ text: GEMINI_SYSTEM_PROMPT }] },
    });

    const result = await chat.sendMessageStream(message);
    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) sendChunk(text);
    }
    sendDone();
    res.end();
  } catch (err) {
    console.error('❌ Gemini Stream Error:', err.message);
    sendError('AI service temporarily unavailable.');
    res.end();
  }
});

// ── Catchall → React app ─────────────────────────────────────────────────────
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  const hasKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here';
  console.log(`🤖 AI Chat: ${hasKey ? 'Gemini API connected' : 'Smart fallback mode (no API key)'}`);
});
