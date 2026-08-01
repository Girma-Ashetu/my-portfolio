import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import '../home.css';

/* ── Animated counter hook ── */
function useCounter(target, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    const num = parseInt(target);
    if (isNaN(num)) { setVal(target); return; }
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(eased * num));
      if (p < 1) requestAnimationFrame(step);
      else setVal(target);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

/* ── Stat card component ── */
function StatCard({ val, label, icon, color, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const animated = useCounter(val, 1800, visible);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.4 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="stat-card reveal-up" style={{ animationDelay: `${index * 0.15}s` }}>
      <div className="stat-card-glow" style={{ '--glow-color': `var(--${color})` }} />
      <div className="stat-card-border" style={{ '--glow-color': `var(--${color})` }} />
      <div className="stat-icon-wrap" style={{ color: `var(--${color})` }}>
        <i className={`fas ${icon}`} />
      </div>
      <div className="stat-number" style={{ color: `var(--${color})` }}>{animated}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ── Tilt Card Wrapper ── */
function TiltCard({ children, className, style, onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    requestAnimationFrame(() => {
      if (!cardRef.current) return;
      cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className || ''}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/* ── Interactive Live Terminal ── */
function EngineeringTerminal() {
  const [activeTab, setActiveTab] = useState('api');
  const [executing, setExecuting] = useState(false);
  const [outputLogs, setOutputLogs] = useState([]);
  const [copied, setCopied] = useState(false);

  const snippets = {
    api: {
      title: "Backend API (Express & Node.js)",
      code: `// Secure Microservice Endpoint
import express from 'express';
import { authenticateToken } from './middleware/auth.js';

const app = express();
app.use(express.json());

app.get('/api/v1/user/portfolio', authenticateToken, async (req, res) => {
  try {
    const data = await UserService.getEngineeredProfile(req.user.id);
    return res.status(200).json({ success: true, latency: '12ms', data });
  } catch (error) {
    return res.status(500).json({ error: 'System Exception Intercepted' });
  }
});`
    },
    ai: {
      title: "AI Intelligence Core (Gemini GAIA)",
      code: `// Real-Time Gemini AI Copilot Integration
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function askPortfolioCopilot(query, context) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = \`Context: \${JSON.stringify(context)}\\nUser Question: \${query}\`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
}`
    },
    cyber: {
      title: "Cyber Security Guard (OWASP Sanitizer)",
      code: `// Zero-Trust Input & XSS Shield
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeRequestPayload(payload) {
  if (typeof payload === 'string') {
    return DOMPurify.sanitize(payload, { ALLOWED_TAGS: [] });
  }
  return JSON.parse(JSON.stringify(payload));
}`
    },
    db: {
      title: "Database Optimization (MySQL / Postgres)",
      code: `-- High-Speed Indexed Portfolio Analytics Query
SELECT 
  p.id, p.title, COUNT(v.id) AS total_views,
  ROUND(AVG(r.rating), 2) AS avg_feedback
FROM projects p
LEFT JOIN project_views v ON p.id = v.project_id
LEFT JOIN project_reviews r ON p.id = r.project_id
WHERE p.status = 'PUBLISHED'
GROUP BY p.id
ORDER BY total_views DESC LIMIT 10;`
    }
  };

  const handleRunSimulation = () => {
    setExecuting(true);
    setOutputLogs(['[SYSTEM] Initializing execution sandbox...']);
    setTimeout(() => {
      setOutputLogs(prev => [...prev, '[AUTH] Security handshake token verified.']);
    }, 400);
    setTimeout(() => {
      setOutputLogs(prev => [...prev, `[COMPUTE] Executing ${snippets[activeTab].title}...`]);
    }, 800);
    setTimeout(() => {
      setOutputLogs(prev => [...prev, '[SUCCESS] 200 OK — Execution finished in 14ms. Log saved.']);
      setExecuting(false);
    }, 1200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippets[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="interactive-terminal-card glass-card-master">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
        </div>
        <div className="terminal-tabs">
          <button className={`term-tab ${activeTab === 'api' ? 'active' : ''}`} onClick={() => setActiveTab('api')}>
            <i className="fas fa-server me-1"></i> REST API
          </button>
          <button className={`term-tab ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => setActiveTab('ai')}>
            <i className="fas fa-brain me-1"></i> AI Copilot
          </button>
          <button className={`term-tab ${activeTab === 'cyber' ? 'active' : ''}`} onClick={() => setActiveTab('cyber')}>
            <i className="fas fa-shield-alt me-1"></i> Cyber Guard
          </button>
          <button className={`term-tab ${activeTab === 'db' ? 'active' : ''}`} onClick={() => setActiveTab('db')}>
            <i className="fas fa-database me-1"></i> SQL Query
          </button>
        </div>
        <div className="terminal-actions">
          <button className="term-action-btn" onClick={handleCopyCode} title="Copy Snippet">
            <i className={`fas ${copied ? 'fa-check text-success' : 'fa-copy'}`}></i>
          </button>
        </div>
      </div>

      <div className="terminal-body">
        <pre className="code-block">
          <code>{snippets[activeTab].code}</code>
        </pre>

        {outputLogs.length > 0 && (
          <div className="terminal-console-output">
            <div className="console-title">Execution Console Output:</div>
            {outputLogs.map((log, idx) => (
              <div key={idx} className="console-line">{log}</div>
            ))}
          </div>
        )}
      </div>

      <div className="terminal-footer">
        <span className="term-status">
          <span className="status-ping"></span> Live Sandbox Ready
        </span>
        <button className="btn-term-run" onClick={handleRunSimulation} disabled={executing}>
          <i className={`fas ${executing ? 'fa-spinner fa-spin' : 'fa-play'} me-2`}></i>
          {executing ? 'Simulating...' : 'Run Simulation'}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { t, language } = useLanguage();
  const typingRef = useRef(null);
  const heroRef = useRef(null);
  const [skillCategory, setSkillCategory] = useState('all');

  /* ── Parallax effect on hero ── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const move = (e) => {
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const px = (x - 0.5) * 25;
        const py = (y - 0.5) * 25;
        hero.style.setProperty('--px', `${px}px`);
        hero.style.setProperty('--py', `${py}px`);
      });
    };
    hero.addEventListener('mousemove', move, { passive: true });
    return () => hero.removeEventListener('mousemove', move);
  }, []);

  /* ── Scroll Reveal IntersectionObserver ── */
  useEffect(() => {
    const els = document.querySelectorAll('.reveal-up, .reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('active');
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  /* ── Typing effect ── */
  useEffect(() => {
    const target = typingRef.current;
    if (!target) return;
    const phrases = [
      t('typingPhrases', 'p1') || 'Full-Stack Software Engineer',
      t('typingPhrases', 'p2') || 'Mobile App Specialist (Flutter/React Native)',
      t('typingPhrases', 'p3') || 'Cybersecurity & OWASP Advocate',
      t('typingPhrases', 'p4') || 'Cloud & Database Architect',
    ];
    let idx = 0, char = 0, deleting = false, timer;
    const type = () => {
      const phrase = phrases[idx];
      target.textContent = phrase.substring(0, char);
      let speed = deleting ? 35 : 85;
      if (!deleting && char === phrase.length) { speed = 2400; deleting = true; }
      else if (deleting && char === 0) { deleting = false; idx = (idx + 1) % phrases.length; speed = 400; }
      char = deleting ? char - 1 : char + 1;
      timer = setTimeout(type, speed);
    };
    type();
    return () => clearTimeout(timer);
  }, [language]);

  /* ── DATA ── */
  const stats = [
    { val: '10+', label: t('stats', 'projects') || 'Projects Completed', icon: 'fa-project-diagram', color: 'primary' },
    { val: '500+', label: t('stats', 'github') || 'GitHub Contributions', icon: 'fa-code-branch', color: 'secondary' },
    { val: '3+', label: t('stats', 'stacks') || 'Major Tech Stacks', icon: 'fa-layer-group', color: 'accent' },
    { val: '6+', label: t('stats', 'certs') || 'Certifications Pursued', icon: 'fa-certificate', color: 'info' },
  ];

  const focusAreas = [
    { icon: 'fa-globe', label: t('focus', 'web') || 'Full-Stack Web Engineering', color: 'primary', desc: 'React, Next.js, Node.js, Express, REST APIs, GraphQL, and modern web architectures.' },
    { icon: 'fa-mobile-alt', label: t('focus', 'mobile') || 'Mobile App Development', color: 'secondary', desc: 'Native & cross-platform solutions using Flutter, React Native, and Firebase backend.' },
    { icon: 'fa-shield-alt', label: t('focus', 'cyber') || 'Cybersecurity & OWASP', color: 'accent', desc: 'Application vulnerability testing, threat mitigation, network security, and secure coding.' },
    { icon: 'fa-cloud', label: t('focus', 'cloud') || 'Cloud Infrastructure', color: 'info', desc: 'Scalable deployment models using AWS, Azure, Docker containers, and serverless logic.' },
    { icon: 'fa-code', label: t('focus', 'software') || 'Software System Architecture', color: 'primary', desc: 'Clean architecture, OOP design patterns, microservices, and high-performance algorithms.' },
    { icon: 'fa-database', label: t('focus', 'db') || 'Database Systems', color: 'secondary', desc: 'High-concurrency database design and query tuning in MySQL, PostgreSQL, and MongoDB.' },
  ];

  const featuredInnovations = [
    {
      id: 1,
      title: "SmartBuy Commercial Platform",
      tagline: "Live E-Commerce & Auction Engine",
      desc: "Full-stack web application featuring live product auctions, campaign participation, dynamic stats API, and toast notification architecture.",
      tech: ["React.js", "Node.js", "Express", "MySQL", "Socket.io"],
      color: "primary",
      icon: "fa-shopping-cart",
      link: "/projects"
    },
    {
      id: 2,
      title: "Bank Management System",
      tagline: "Enterprise Core Financial Solution",
      desc: "Comprehensive multi-account banking core with real-time status transitions (Active/Suspended/Frozen), strict transaction validations, and admin panel.",
      tech: ["Java", "MySQL", "JDBC", "Swing", "OOP"],
      color: "secondary",
      icon: "fa-university",
      link: "/projects"
    },
    {
      id: 3,
      title: "Advanced AI Portfolio Platform",
      tagline: "Trilingual & GAIA Assistant Integrated",
      desc: "State-of-the-art interactive digital portfolio equipped with GAIA Gemini AI assistant, 3D tilt effects, and light/dark theme converter.",
      tech: ["React.js", "Gemini API", "Vite", "Bootstrap 5", "CSS3"],
      color: "accent",
      icon: "fa-robot",
      link: "/projects"
    }
  ];

  const skillMeters = [
    { name: 'React.js & Next.js', percent: 95, cat: 'front', color: 'primary' },
    { name: 'Node.js & Express.js', percent: 92, cat: 'back', color: 'secondary' },
    { name: 'Java & OOP Systems', percent: 90, cat: 'lang', color: 'accent' },
    { name: 'Python & Automation', percent: 88, cat: 'lang', color: 'info' },
    { name: 'JavaScript (ES6+) & TS', percent: 94, cat: 'lang', color: 'primary' },
    { name: 'Cybersecurity & OWASP', percent: 85, cat: 'cyber', color: 'accent' },
    { name: 'Cloud (AWS / Azure)', percent: 82, cat: 'cloud', color: 'info' },
    { name: 'MySQL & PostgreSQL', percent: 90, cat: 'db', color: 'secondary' },
  ];

  const filteredSkills = skillCategory === 'all'
    ? skillMeters
    : skillMeters.filter(s => s.cat === skillCategory);

  const experiences = [
    {
      title: t('exp', 't1') || 'Academic Software Developer', org: t('exp', 'o1') || 'Jimma Institute of Technology', period: '2022–Present', color: 'primary', icon: 'fa-graduation-cap',
      points: [
        'Engineered high-performance web and desktop solutions as part of core Software Engineering curriculum.',
        'Applied strict OOP principles, clean code practices, and automated testing procedures.',
        'Collaborated on campus software projects and academic technical research initiatives.'
      ]
    },
    {
      title: t('exp', 't2') || 'Team Lead & Developer', org: t('exp', 'o2') || 'University Group Projects', period: '2023–Present', color: 'secondary', icon: 'fa-users',
      points: [
        'Led agile team development for full-stack software applications and database management systems.',
        'Architected relational schema designs and integrated secure RESTful API endpoints.',
        'Mentored peers in Git version control workflows and frontend UI component construction.'
      ]
    },
    {
      title: t('exp', 't3') || 'Cybersecurity & Cloud Researcher', org: t('exp', 'o3') || 'Independent Study', period: '2022–Present', color: 'accent', icon: 'fa-book-open',
      points: [
        'Conducted in-depth security audits adhering to OWASP Top 10 web vulnerability guidelines.',
        'Explored serverless cloud deployments on AWS and Azure with strict IAM role constraints.',
        'Pioneered AI integration patterns using Google Gemini API for intelligent developer tools.'
      ]
    },
    {
      title: t('exp', 't4') || 'Open Source & Freelance Developer', org: t('exp', 'o4') || 'Personal Projects', period: '2024–Present', color: 'info', icon: 'fa-laptop-code',
      points: [
        'Published open-source utilities and full-stack web platforms on GitHub.',
        'Designed custom responsive web interfaces with custom glassmorphism styling and micro-animations.',
        'Optimized client-side rendering speed and backend query execution times.'
      ]
    },
  ];

  const certs = [
    { title: 'AWS Certified Cloud Practitioner', org: 'Amazon Web Services', icon: 'fa-cloud', color: 'primary', status: t('certStatus', 'progress') || 'In Progress' },
    { title: 'Azure Fundamentals (AZ-900)', org: 'Microsoft', icon: 'fa-window-restore', color: 'info', status: t('certStatus', 'progress') || 'In Progress' },
    { title: 'Cisco CCNA Security & Routing', org: 'Cisco', icon: 'fa-network-wired', color: 'secondary', status: t('certStatus', 'targeted') || 'Targeted' },
    { title: 'Google Cybersecurity Certificate', org: 'Google', icon: 'fa-shield-alt', color: 'accent', status: t('certStatus', 'progress') || 'In Progress' },
    { title: 'Meta Front-End Developer Specialization', org: 'Meta', icon: 'fa-code', color: 'primary', status: t('certStatus', 'targeted') || 'Targeted' },
    { title: 'Meta Back-End Developer Specialization', org: 'Meta', icon: 'fa-server', color: 'secondary', status: t('certStatus', 'targeted') || 'Targeted' },
  ];

  const softSkills = ['Problem Solving', 'Critical Thinking', 'Continuous Learning', 'Team Leadership', 'Agile Collaboration', 'Adaptability', 'Technical Communication', 'System Architecture'];

  const marqueeTech = ["React.js", "Node.js", "Python", "Docker", "AWS Cloud", "MongoDB", "Flutter", "TypeScript", "Next.js", "Firebase", "PostgreSQL", "Tailwind CSS", "Git", "Figma"];

  return (
    <>
      {/* ══════════════════════ HERO SECTION ══════════════════════ */}
      <header className="home-hero" ref={heroRef}>
        <div className="hero-bg-aurora">
          <div className="aurora-1"></div>
          <div className="aurora-2"></div>
          <div className="aurora-3"></div>
        </div>

        <div className="hero-particles" aria-hidden="true">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 5}px`,
              height: `${2 + Math.random() * 5}px`,
              animationDuration: `${6 + Math.random() * 12}s`,
              animationDelay: `${Math.random() * 5}s`,
              background: i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--secondary)' : 'var(--accent)',
              boxShadow: `0 0 12px ${i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--secondary)' : 'var(--accent)'}`
            }} />
          ))}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="home-hero-grid">
            {/* ── LEFT: Hero Introduction ── */}
            <div className="hero-left reveal">
              <div className="hero-badge-pill">
                <span className="badge-dot" />
                <span className="badge-text">⚡ Open for Internships, High-Impact Roles & Collaboration</span>
                <div className="badge-shine"></div>
              </div>

              <h1 className="hero-h1">
                {t('hero', 'hello') || "Hello, I'm"}<br />
                <span className="hero-name-gradient" data-text="GIRMA ASHETU ASEFA">GIRMA ASHETU ASEFA</span>
              </h1>

              <p className="hero-sub">{t('hero', 'subtitle') || 'Software Engineering Student at Jimma Institute of Technology'}</p>

              <div className="hero-typing-wrapper">
                <div className="hero-typing-row">
                  <span className="typing-prefix">›</span>
                  <span className="typing-text" ref={typingRef} />
                  <span className="typing-cursor">|</span>
                </div>
              </div>

              <p className="hero-desc">{t('hero', 'description')}</p>

              <div className="hero-cta-row">
                <Link to="/projects" className="btn-masterpiece-primary">
                  <span className="btn-bg-slide"></span>
                  <span className="btn-content">
                    <i className="fas fa-rocket me-2" />
                    {t('hero', 'viewProjects') || 'Explore Projects'}
                  </span>
                </Link>
                <Link to="/contact" className="btn-masterpiece-outline">
                  <span className="btn-content">
                    <i className="fas fa-paper-plane me-2" />
                    {t('hero', 'contactMe') || 'Get in Touch'}
                  </span>
                </Link>
              </div>

              <div className="hero-socials">
                <a href="https://github.com/Girma-Ashetu" target="_blank" rel="noreferrer" className="hero-social-link" title="GitHub">
                  <i className="fab fa-github" />
                </a>
                <a href="mailto:girmaashetu3@gmail.com" className="hero-social-link" title="Email">
                  <i className="fas fa-envelope" />
                </a>
                <a href="https://www.linkedin.com/in/girma-ashetu-a146b9422" target="_blank" rel="noreferrer" className="hero-social-link" title="LinkedIn">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </div>

            {/* ── RIGHT: 3D Holographic Scene ── */}
            <div className="hero-right reveal">
              <TiltCard className="hero-avatar-scene">
                <div className="avatar-glow-bg" />
                <div className="orbit orbit-1"><div className="orbit-dot" /></div>
                <div className="orbit orbit-2"><div className="orbit-dot" /></div>
                <div className="orbit orbit-3"><div className="orbit-dot orbit-dot--accent" /></div>

                <div className="avatar-core-container">
                  <div className="avatar-pulse-rings">
                    <div className="pulse-ring pr-1"></div>
                    <div className="pulse-ring pr-2"></div>
                  </div>
                  <div className="avatar-frame">
                    <div className="avatar-hud-line hl-top"></div>
                    <div className="avatar-hud-line hl-bottom"></div>
                    <div className="avatar-hud-line hl-left"></div>
                    <div className="avatar-hud-line hl-right"></div>
                    <div className="avatar-overlay-grid"></div>
                    <img src="/about_profile.jpg" alt="Girma Ashetu Asefa" className="avatar-img" />
                  </div>
                </div>

                <div className="avatar-tech-badge avatar-tech-badge--1 glass-pane-premium" title="Cybersecurity Guard">
                  <i className="fas fa-shield-alt" style={{ color: 'var(--accent)' }} />
                </div>
                <div className="avatar-tech-badge avatar-tech-badge--2 glass-pane-premium" title="Cloud Architecture">
                  <i className="fas fa-cloud" style={{ color: 'var(--primary)' }} />
                </div>
                <div className="avatar-tech-badge avatar-tech-badge--3 glass-pane-premium" title="Software Development">
                  <i className="fas fa-code" style={{ color: 'var(--secondary)' }} />
                </div>
                <div className="avatar-tech-badge avatar-tech-badge--4 glass-pane-premium" title="React Specialist">
                  <i className="fab fa-react" style={{ color: 'var(--info)' }} />
                </div>
              </TiltCard>
            </div>
          </div>
        </div>

        <div className="hero-scroll-cue">
          <div className="scroll-mouse">
            <div className="scroll-mouse-dot" />
          </div>
          <span className="scroll-cue-text">{t('hero', 'scroll') || 'Scroll To Explore'}</span>
        </div>

        <div className="hero-bottom-fade"></div>
      </header>

      {/* ══════════════════════ TECH MARQUEE ══════════════════════ */}
      <div className="tech-marquee-wrapper">
        <div className="tech-marquee">
          <div className="tech-marquee-track">
            {[...marqueeTech, ...marqueeTech, ...marqueeTech].map((tech, idx) => (
              <div key={idx} className="tech-marquee-item">
                <span className="tech-marquee-dot"></span>
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════ STATS BAND ══════════════════════ */}
      <section className="stats-band">
        <div className="container">
          <div className="stats-grid">
            {stats.map((s, i) => (
              <StatCard key={i} {...s} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ INTERACTIVE ENGINEERING TERMINAL ══════════════════════ */}
      <section className="home-section relative-section">
        <div className="container relative-z">
          <div className="section-head reveal">
            <span className="section-chip">Inside The Code</span>
            <h2 className="section-title">Interactive Engineering Terminal</h2>
            <p className="section-sub">Experience clean software design and live architecture execution in real time.</p>
          </div>

          <EngineeringTerminal />
        </div>
      </section>

      {/* ══════════════════════ FEATURED INNOVATIONS BENTO ══════════════════════ */}
      <section className="home-section home-section--alt relative-section">
        <div className="section-divider-top"></div>
        <div className="container relative-z">
          <div className="section-head reveal">
            <span className="section-chip">Portfolio Highlights</span>
            <h2 className="section-title">Featured Innovations</h2>
            <p className="section-sub">A curated selection of flagship full-stack, core systems, and AI applications.</p>
          </div>

          <div className="featured-grid">
            {featuredInnovations.map((proj, i) => (
              <TiltCard key={proj.id}>
                <div className="featured-card glass-card-master reveal-up" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="featured-card-header">
                    <div className="featured-icon-box" style={{ color: `var(--${proj.color})` }}>
                      <i className={`fas ${proj.icon}`}></i>
                    </div>
                    <span className="featured-tagline">{proj.tagline}</span>
                  </div>
                  <h4 className="featured-title">{proj.title}</h4>
                  <p className="featured-desc">{proj.desc}</p>

                  <div className="featured-tech-row">
                    {proj.tech.map((t, idx) => (
                      <span key={idx} className="tech-badge">{t}</span>
                    ))}
                  </div>

                  <div className="featured-footer">
                    <Link to={proj.link} className="btn-featured-link">
                      <span>View Project Details</span>
                      <i className="fas fa-arrow-right ms-2"></i>
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ FOCUS AREAS ══════════════════════ */}
      <section className="home-section relative-section">
        <div className="section-bg-element bg-element-1"></div>
        <div className="container relative-z">
          <div className="section-head reveal">
            <span className="section-chip">{t('homeTitles', 'focus') || 'Focus Areas'}</span>
            <h2 className="section-title">{t('homeTitles', 'focusSub') || 'Engineering Competencies'}</h2>
            <p className="section-sub">End-to-end expertise across modern software engineering domains.</p>
          </div>
          <div className="focus-grid">
            {focusAreas.map((area, i) => (
              <TiltCard key={i}>
                <div className="focus-card reveal-up" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="focus-card-glow" style={{ '--fc-color': `var(--${area.color})` }} />
                  <div className="focus-card-border-run" style={{ '--fc-color': `var(--${area.color})` }}></div>
                  <div className="focus-icon" style={{ color: `var(--${area.color})`, borderColor: `color-mix(in srgb, var(--${area.color}) 30%, transparent)` }}>
                    <i className={`fas ${area.icon}`} />
                  </div>
                  <h4 className="focus-label">{area.label}</h4>
                  <p className="focus-desc">{area.desc}</p>
                  <div className="focus-hover-reveal" style={{ background: `linear-gradient(to top, color-mix(in srgb, var(--${area.color}) 10%, transparent), transparent)` }}></div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ SKILLS & PROFICIENCY ══════════════════════ */}
      <section className="home-section home-section--alt relative-section">
        <div className="section-divider-top"></div>
        <div className="container relative-z">
          <div className="section-head reveal">
            <span className="section-chip">{t('homeTitles', 'skills') || 'Technical Proficiency'}</span>
            <h2 className="section-title">{t('homeTitles', 'skillsSub') || 'Interactive Skill Arsenal'}</h2>
          </div>

          <div className="skill-filter-bar">
            {[
              { id: 'all', label: 'All Skills' },
              { id: 'lang', label: 'Languages' },
              { id: 'front', label: 'Frontend' },
              { id: 'back', label: 'Backend' },
              { id: 'cyber', label: 'Cyber & Security' },
              { id: 'cloud', label: 'Cloud' },
              { id: 'db', label: 'Databases' }
            ].map(cat => (
              <button
                key={cat.id}
                className={`btn-skill-filter ${skillCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSkillCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="skill-meters-grid">
            {filteredSkills.map((sk, idx) => (
              <div key={idx} className="skill-meter-card glass-card-master reveal-up">
                <div className="meter-info">
                  <span className="meter-name">{sk.name}</span>
                  <span className="meter-val" style={{ color: `var(--${sk.color})` }}>{sk.percent}%</span>
                </div>
                <div className="meter-track">
                  <div
                    className="meter-fill"
                    style={{ width: `${sk.percent}%`, background: `linear-gradient(90deg, var(--${sk.color}), var(--primary))` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="soft-skills-band reveal-up mt-5">
            <div className="soft-skills-bg-pattern"></div>
            <div className="soft-skills-header">
              <div className="icon-box">
                <i className="fas fa-brain" />
              </div>
              <span>Core Engineering Soft Skills</span>
            </div>
            <div className="soft-pills">
              {softSkills.map((s, i) => (
                <span key={i} className="soft-pill">
                  <i className="fas fa-check-circle" style={{ color: 'var(--primary)', marginRight: 8 }} />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ EXPERIENCE JOURNEY ══════════════════════ */}
      <section className="home-section relative-section">
        <div className="section-bg-element bg-element-2"></div>
        <div className="container relative-z">
          <div className="section-head reveal">
            <span className="section-chip">{t('homeTitles', 'experience') || 'Milestones'}</span>
            <h2 className="section-title">{t('homeTitles', 'expSub') || 'Engineering Journey'}</h2>
          </div>
          <div className="exp-timeline">
            {experiences.map((exp, i) => (
              <div key={i} className="exp-card reveal-up" style={{ '--exp-color': `var(--${exp.color})`, animationDelay: `${i * 0.1}s` }}>
                <div className="exp-card-glow"></div>
                <div className="exp-card-left">
                  <div className="exp-icon">
                    <i className={`fas ${exp.icon}`} style={{ color: `var(--${exp.color})` }} />
                    <div className="exp-icon-ring"></div>
                  </div>
                  <div className="exp-spine" />
                </div>
                <div className="exp-body">
                  <div className="exp-meta">
                    <h5 className="exp-title">{exp.title}</h5>
                    <span className="exp-badge" style={{ color: `var(--${exp.color})`, borderColor: `color-mix(in srgb, var(--${exp.color}) 30%, transparent)`, background: `color-mix(in srgb, var(--${exp.color}) 10%, transparent)` }}>
                      <i className="far fa-calendar-alt me-2"></i>{exp.org} · {exp.period}
                    </span>
                  </div>
                  <ul className="exp-points">
                    {exp.points.map((pt, j) => <li key={j}><span className="li-bullet" style={{ background: `var(--${exp.color})` }}></span>{pt}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CERTIFICATIONS ══════════════════════ */}
      <section className="home-section home-section--alt relative-section">
        <div className="section-divider-top"></div>
        <div className="container relative-z">
          <div className="section-head reveal">
            <span className="section-chip">{t('homeTitles', 'certs') || 'Certifications'}</span>
            <h2 className="section-title">{t('homeTitles', 'certsSub') || 'Verified Credentials'}</h2>
          </div>
          <div className="certs-grid">
            {certs.map((cert, i) => (
              <TiltCard key={i}>
                <div className="cert-card reveal-up" style={{ '--cert-color': `var(--${cert.color})`, animationDelay: `${i * 0.08}s` }}>
                  <div className="cert-bg-glow"></div>
                  <div className="cert-top">
                    <div className="cert-icon-wrap" style={{ background: `color-mix(in srgb, var(--${cert.color}) 15%, transparent)`, color: `var(--${cert.color})`, borderColor: `color-mix(in srgb, var(--${cert.color}) 30%, transparent)` }}>
                      <i className={`fas ${cert.icon}`} />
                    </div>
                    <span className={`cert-status ${cert.status === (t('certStatus', 'progress') || 'In Progress') ? 'status--progress' : 'status--targeted'}`}>
                      {cert.status === (t('certStatus', 'progress') || 'In Progress') ? <i className="fas fa-spinner fa-spin me-1"></i> : <i className="fas fa-bullseye me-1"></i>}
                      {cert.status}
                    </span>
                  </div>
                  <h6 className="cert-title">{cert.title}</h6>
                  <p className="cert-org"><i className="far fa-building me-1"></i>{cert.org}</p>
                  <div className="cert-bar" style={{ background: `var(--${cert.color})` }} />
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ CTA BANNER ══════════════════════ */}
      <section className="home-section relative-section" style={{ paddingBottom: '8rem' }}>
        <div className="container relative-z">
          <div className="cta-banner reveal-up">
            <div className="cta-banner-bg-grid"></div>
            <div className="cta-banner-glow" />
            <div className="cta-banner-left">
              <div className="cta-avatar-wrapper">
                <div className="cta-avatar-ring"></div>
                <div className="cta-avatar">
                  <img src="/about_profile.jpg" alt="Girma Ashetu" />
                </div>
              </div>
              <div className="cta-text">
                <div className="section-chip" style={{ marginBottom: 16 }}>{t('homeTitles', 'mission') || 'Professional Mission'}</div>
                <h2 className="cta-title">Let's Build Something<br /><span className="hero-name-gradient">Extraordinary</span></h2>
                <p className="cta-desc">Driven software engineering student specializing in scalable systems, full-stack architecture, and AI-driven solutions.</p>
                <div className="cta-actions">
                  <Link to="/projects" className="btn-masterpiece-primary">
                    <span className="btn-bg-slide"></span>
                    <span className="btn-content"><i className="fas fa-folder-open me-2" />{t('hero', 'viewProjects') || 'View Projects'}</span>
                  </Link>
                  <Link to="/contact" className="btn-masterpiece-outline">
                    <span className="btn-content"><i className="fas fa-handshake me-2" />{t('contact', 'title') || 'Get in Touch'}</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="cta-stats-col">
              {[
                { v: '10+', l: 'Projects', c: 'primary', icon: 'fa-project-diagram' },
                { v: '500+', l: 'Contributions', c: 'secondary', icon: 'fa-code-branch' },
                { v: '6+', l: 'Certs', c: 'accent', icon: 'fa-certificate' },
              ].map((s, i) => (
                <div key={i} className="cta-stat" style={{ '--cs-color': `var(--${s.c})` }}>
                  <div className="cta-stat-icon" style={{ color: `var(--${s.c})` }}><i className={`fas ${s.icon}`}></i></div>
                  <div className="cta-stat-info">
                    <span className="cta-stat-val" style={{ color: `var(--${s.c})` }}>{s.v}</span>
                    <span className="cta-stat-label">{s.l}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
