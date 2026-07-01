import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

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

/* ── Single stat card ── */
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

/* ── Skill pill ── */
function SkillPill({ skill, color, delay }) {
  return (
    <span className="skill-pill" style={{ '--pill-color': `var(--${color})`, animationDelay: delay }}>
      {skill}
    </span>
  );
}

/* ── Tilt Card Wrapper ── */
function TiltCard({ children, className, style }) {
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
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

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
    >
      {children}
    </div>
  );
}

export default function Home() {
  const { t, language } = useLanguage();
  const typingRef = useRef(null);
  const heroRef = useRef(null);

  /* ── Parallax on hero ── */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const move = (e) => {
      // Throttle/RAF for performance
      requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const px = (x - 0.5) * 30;
        const py = (y - 0.5) * 30;
        hero.style.setProperty('--px', `${px}px`);
        hero.style.setProperty('--py', `${py}px`);
      });
    };
    hero.addEventListener('mousemove', move, { passive: true });
    return () => hero.removeEventListener('mousemove', move);
  }, []);

  /* ── Typing effect ── */
  useEffect(() => {
    const target = typingRef.current;
    if (!target) return;
    const phrases = [
      t('typingPhrases', 'p1') || 'Full-Stack Web Developer',
      t('typingPhrases', 'p2') || 'Mobile App Developer',
      t('typingPhrases', 'p3') || 'Cybersecurity Enthusiast',
      t('typingPhrases', 'p4') || 'Cloud Computing Enthusiast',
    ];
    let idx = 0, char = 0, deleting = false, timer;
    const type = () => {
      const phrase = phrases[idx];
      target.textContent = phrase.substring(0, char);
      let speed = deleting ? 40 : 90;
      if (!deleting && char === phrase.length) { speed = 2500; deleting = true; }
      else if (deleting && char === 0) { deleting = false; idx = (idx + 1) % phrases.length; speed = 400; }
      char = deleting ? char - 1 : char + 1;
      timer = setTimeout(type, speed);
    };
    type();
    return () => clearTimeout(timer);
  }, [language]);

  /* ── DATA ── */
  const stats = [
    { val: '10+', label: t('stats', 'projects') || 'Projects Completed',     icon: 'fa-project-diagram', color: 'primary'   },
    { val: '500+',label: t('stats', 'github')   || 'GitHub Contributions',   icon: 'fa-code-branch',     color: 'secondary' },
    { val: '3+',  label: t('stats', 'stacks')   || 'Major Tech Stacks',      icon: 'fa-layer-group',     color: 'accent'    },
    { val: '6+',  label: t('stats', 'certs')    || 'Certifications Pursued', icon: 'fa-certificate',     color: 'info'      },
  ];

  const focusAreas = [
    { icon: 'fa-globe',      label: t('focus','web')      || 'Full-Stack Web Development',   color: 'primary',   desc: 'React, Node.js, REST APIs, GraphQL, and modern web architectures.' },
    { icon: 'fa-mobile-alt', label: t('focus','mobile')   || 'Mobile App Development',       color: 'secondary', desc: 'Cross-platform solutions using Flutter, React Native, and Firebase.'   },
    { icon: 'fa-shield-alt', label: t('focus','cyber')    || 'Cybersecurity',                color: 'accent',    desc: 'OWASP standards, Network Security, and secure coding practices.'},
    { icon: 'fa-cloud',      label: t('focus','cloud')    || 'Cloud Computing',              color: 'info',      desc: 'Deploying scalable solutions on AWS, Azure, and Serverless platforms.'            },
    { icon: 'fa-code',       label: t('focus','software') || 'Software Engineering',         color: 'primary',   desc: 'Clean code, OOP, Design Patterns, and robust system architecture.' },
    { icon: 'fa-database',   label: t('focus','db')       || 'Database Systems',             color: 'secondary', desc: 'Complex schema design and optimization in MySQL, PostgreSQL, and MongoDB.'        },
  ];

  const skillRows = [
    { title: t('skills','lang')   || 'Languages',      icon:'fa-terminal',   color:'primary',   skills:['Java','JavaScript','Python','C++','SQL','HTML5','CSS3'] },
    { title: t('skills','front')  || 'Front-End',      icon:'fa-desktop',    color:'secondary', skills:['React.js','Next.js','Bootstrap','Tailwind','Responsive'] },
    { title: t('skills','back')   || 'Back-End',       icon:'fa-server',     color:'info',      skills:['Node.js','Express.js','REST APIs','Auth','DB Integration'] },
    { title: t('skills','mobile') || 'Mobile',         icon:'fa-mobile-alt', color:'accent',    skills:['Flutter','React Native','Firebase','Cross-Platform'] },
    { title: t('skills','cloud')  || 'Cloud',          icon:'fa-cloud',      color:'primary',   skills:['AWS','Azure','IAM','Serverless','Storage'] },
    { title: t('skills','cyber')  || 'Cybersecurity',  icon:'fa-shield-alt', color:'accent',    skills:['Network Sec','OWASP','Secure Code','Vuln Assessment'] },
    { title: t('skills','db')     || 'Databases',      icon:'fa-database',   color:'secondary', skills:['MySQL','PostgreSQL','MongoDB','SQL Optimization'] },
    { title: t('skills','tools')  || 'Dev Tools',      icon:'fa-tools',      color:'info',      skills:['Git','Docker','Linux','VS Code','Postman','Figma'] },
  ];

  const experiences = [
    { title: t('exp','t1')||'Academic Software Dev',  org: t('exp','o1')||'Jimma Institute of Technology', period:'2022–Present', color:'primary',   icon:'fa-graduation-cap',
      points:[t('exp','p1a'), t('exp','p1b'), t('exp','p1c')] },
    { title: t('exp','t2')||'Team-Based Development', org: t('exp','o2')||'University Group Projects',     period:'2023–Present', color:'secondary', icon:'fa-users',
      points:[t('exp','p2a'), t('exp','p2b'), t('exp','p2c')] },
    { title: t('exp','t3')||'Technical Research',     org: t('exp','o3')||'Independent Study',             period:'2022–Present', color:'accent',    icon:'fa-book-open',
      points:[t('exp','p3a'), t('exp','p3b'), t('exp','p3c')] },
    { title: t('exp','t4')||'Open Source & Freelance',org: t('exp','o4')||'Personal & Freelance',          period:'2024–Present', color:'info',      icon:'fa-laptop-code',
      points:[t('exp','p4a'), t('exp','p4b'), t('exp','p4c')] },
  ];

  const certs = [
    { title:'AWS Certified Cloud Practitioner', org:'Amazon Web Services', icon:'fa-cloud',        color:'primary',   status:t('certStatus','progress')||'In Progress' },
    { title:'Azure Fundamentals (AZ-900)',       org:'Microsoft',           icon:'fa-window-restore',color:'info',      status:t('certStatus','progress')||'In Progress' },
    { title:'Cisco CCNA',                        org:'Cisco',               icon:'fa-network-wired',color:'secondary', status:t('certStatus','targeted')||'Targeted'    },
    { title:'Google Cybersecurity Certificate',  org:'Google',              icon:'fa-shield-alt',   color:'accent',    status:t('certStatus','progress')||'In Progress' },
    { title:'Meta Front-End Developer',          org:'Meta',                icon:'fa-code',         color:'primary',   status:t('certStatus','targeted')||'Targeted'    },
    { title:'Meta Back-End Developer',           org:'Meta',                icon:'fa-server',       color:'secondary', status:t('certStatus','targeted')||'Targeted'    },
  ];

  const softSkills = ['Problem Solving','Critical Thinking','Continuous Learning','Team Collaboration','Leadership','Adaptability','Communication','Analytical Thinking'];

  // Tech marquee items
  const marqueeTech = ["React", "Node.js", "Python", "Docker", "AWS", "MongoDB", "Flutter", "TypeScript", "Next.js", "Firebase", "PostgreSQL", "Tailwind", "Git", "Figma"];

  return (
    <>
      {/* ══════════════════════ HERO ══════════════════════ */}
      <header className="home-hero" ref={heroRef}>
        {/* Animated Background Gradients */}
        <div className="hero-bg-aurora">
            <div className="aurora-1"></div>
            <div className="aurora-2"></div>
            <div className="aurora-3"></div>
        </div>

        {/* animated particles */}
        <div className="hero-particles" aria-hidden="true">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top:  `${Math.random() * 100}%`,
              width:  `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay:    `${Math.random() * 5}s`,
              background: i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--secondary)' : 'var(--accent)',
              boxShadow: `0 0 10px ${i % 3 === 0 ? 'var(--primary)' : i % 3 === 1 ? 'var(--secondary)' : 'var(--accent)'}`
            }} />
          ))}
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="home-hero-grid">
            {/* ── LEFT: text ── */}
            <div className="hero-left reveal">
              <div className="hero-badge-pill">
                <span className="badge-dot" />
                <span className="badge-text">{t('hero','available') || 'Available for Internships & Collaboration'}</span>
                <div className="badge-shine"></div>
              </div>

              <h1 className="hero-h1">
                {t('hero','hello') || "Hello, I'm"}<br />
                <span className="hero-name-gradient" data-text="GIRMA ASHETU ASEFA">GIRMA ASHETU ASEFA</span>
              </h1>

              <p className="hero-sub">{t('hero','subtitle') || 'Software Engineering Student at Jimma Institute of Technology'}</p>

              <div className="hero-typing-wrapper">
                <div className="hero-typing-row">
                    <span className="typing-prefix">›</span>
                    <span className="typing-text" ref={typingRef} />
                    <span className="typing-cursor">|</span>
                </div>
              </div>

              <p className="hero-desc">{t('hero','description')}</p>

              <div className="hero-cta-row">
                <Link to="/projects" className="btn-masterpiece-primary">
                  <span className="btn-bg-slide"></span>
                  <span className="btn-content">
                    <i className="fas fa-rocket me-2" />
                    {t('hero','viewProjects') || 'Explore Projects'}
                  </span>
                </Link>
                <Link to="/contact" className="btn-masterpiece-outline">
                  <span className="btn-content">
                    <i className="fas fa-paper-plane me-2" />
                    {t('hero','contactMe') || 'Contact Me'}
                  </span>
                </Link>
              </div>

              {/* social quick-links */}
              <div className="hero-socials">
                <a href="https://github.com/Girma-Ashetu" target="_blank" rel="noreferrer" className="hero-social-link" title="GitHub">
                  <i className="fab fa-github" />
                </a>
                <a href="mailto:girma@example.com" className="hero-social-link" title="Email">
                  <i className="fas fa-envelope" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hero-social-link" title="LinkedIn">
                  <i className="fab fa-linkedin-in" />
                </a>
              </div>
            </div>

            {/* ── RIGHT: visual ── */}
            <div className="hero-right reveal">
              <TiltCard className="hero-avatar-scene">
                <div className="avatar-glow-bg" />
                {/* orbit rings */}
                <div className="orbit orbit-1"><div className="orbit-dot" /></div>
                <div className="orbit orbit-2"><div className="orbit-dot" /></div>
                <div className="orbit orbit-3"><div className="orbit-dot orbit-dot--accent" /></div>
                
                {/* Center Avatar Core */}
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

                {/* floating tech badges */}
                <div className="tech-badge tech-badge--1 glass-pane-premium">
                  <i className="fas fa-shield-alt" style={{color:'var(--accent)'}} />
                </div>
                <div className="tech-badge tech-badge--2 glass-pane-premium">
                  <i className="fas fa-cloud" style={{color:'var(--primary)'}} />
                </div>
                <div className="tech-badge tech-badge--3 glass-pane-premium">
                  <i className="fas fa-code" style={{color:'var(--secondary)'}} />
                </div>
                <div className="tech-badge tech-badge--4 glass-pane-premium">
                  <i className="fab fa-react" style={{color:'var(--info)'}} />
                </div>
              </TiltCard>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="hero-scroll-cue">
          <div className="scroll-mouse">
            <div className="scroll-mouse-dot" />
          </div>
          <span className="scroll-cue-text">{t('hero','scroll') || 'Scroll To Explore'}</span>
        </div>
        
        {/* Bottom Fade out */}
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

      {/* ══════════════════════ FOCUS AREAS ══════════════════════ */}
      <section className="home-section relative-section">
        <div className="section-bg-element bg-element-1"></div>
        <div className="container relative-z">
          <div className="section-head reveal">
            <span className="section-chip">{t('homeTitles','focus') || 'Focus Areas'}</span>
            <h2 className="section-title">{t('homeTitles','focusSub') || 'What I Do'}</h2>
            <p className="section-sub">Specialized expertise across the full software engineering spectrum, delivering enterprise-grade solutions.</p>
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

      {/* ══════════════════════ SKILLS ══════════════════════ */}
      <section className="home-section home-section--alt relative-section">
        <div className="section-divider-top"></div>
        <div className="container relative-z">
          <div className="section-head reveal">
            <span className="section-chip">{t('homeTitles','skills') || 'Skills & Expertise'}</span>
            <h2 className="section-title">{t('homeTitles','skillsSub') || 'Technical Arsenal'}</h2>
          </div>
          <div className="skills-bento">
            {skillRows.map((cat, i) => (
              <TiltCard key={i}>
                  <div className={`skill-bento-card reveal-up`} style={{ '--sb-color': `var(--${cat.color})`, animationDelay: `${i * 0.07}s` }}>
                    <div className="skill-bento-glow"></div>
                    <div className="skill-bento-header">
                        <span className="skill-bento-icon" style={{ background: `color-mix(in srgb, var(--${cat.color}) 15%, transparent)` }}>
                        <i className={`fas ${cat.icon}`} style={{ color: `var(--${cat.color})` }} />
                        </span>
                        <h6 className="skill-bento-title" style={{ color: '#fff' }}>{cat.title}</h6>
                    </div>
                    <div className="skill-pills-wrap">
                        {cat.skills.map((s, si) => (
                        <SkillPill key={si} skill={s} color={cat.color} delay={`${si * 0.05}s`} />
                        ))}
                    </div>
                  </div>
              </TiltCard>
            ))}
          </div>

          {/* Soft Skills */}
          <div className="soft-skills-band reveal-up">
            <div className="soft-skills-bg-pattern"></div>
            <div className="soft-skills-header">
              <div className="icon-box">
                <i className="fas fa-users" />
              </div>
              <span>Professional Soft Skills</span>
            </div>
            <div className="soft-pills">
              {softSkills.map((s, i) => (
                <span key={i} className="soft-pill">
                  <i className="fas fa-check" style={{ color: 'var(--primary)', marginRight: 8 }} />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════ EXPERIENCE ══════════════════════ */}
      <section className="home-section relative-section">
        <div className="section-bg-element bg-element-2"></div>
        <div className="container relative-z">
          <div className="section-head reveal">
            <span className="section-chip">{t('homeTitles','experience') || 'Experience'}</span>
            <h2 className="section-title">{t('homeTitles','expSub') || 'My Journey'}</h2>
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
                    {exp.points.map((pt, j) => <li key={j}><span className="li-bullet" style={{background: `var(--${exp.color})`}}></span>{pt}</li>)}
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
            <span className="section-chip">{t('homeTitles','certs') || 'Certifications'}</span>
            <h2 className="section-title">{t('homeTitles','certsSub') || 'Verified Expertise'}</h2>
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
                        <span className={`cert-status ${cert.status === (t('certStatus','progress')||'In Progress') ? 'status--progress' : 'status--targeted'}`}>
                        {cert.status === (t('certStatus','progress')||'In Progress') ? <i className="fas fa-spinner fa-spin me-1"></i> : <i className="fas fa-bullseye me-1"></i>}
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
                      <img src="/about_profile.jpg" alt="Girma" />
                  </div>
              </div>
              <div className="cta-text">
                <div className="section-chip" style={{ marginBottom: 16 }}>{t('homeTitles','mission') || 'Professional Mission'}</div>
                <h2 className="cta-title">Let's Build Something<br /><span className="hero-name-gradient">Extraordinary</span></h2>
                <p className="cta-desc">{t('hero','description')}</p>
                <div className="cta-actions">
                  <Link to="/projects" className="btn-masterpiece-primary">
                      <span className="btn-bg-slide"></span>
                      <span className="btn-content"><i className="fas fa-folder-open me-2" />{t('hero','viewProjects') || 'View Projects'}</span>
                  </Link>
                  <Link to="/contact" className="btn-masterpiece-outline">
                      <span className="btn-content"><i className="fas fa-handshake me-2" />{t('contact','title') || 'Get in Touch'}</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="cta-stats-col">
              {[
                { v: '10+',  l: 'Projects',      c: 'primary', icon: 'fa-project-diagram'   },
                { v: '500+', l: 'Contributions', c: 'secondary', icon: 'fa-code-branch' },
                { v: '6+',   l: 'Certs',         c: 'accent', icon: 'fa-certificate'    },
              ].map((s,i) => (
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
