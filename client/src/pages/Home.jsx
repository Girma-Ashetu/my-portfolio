import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { useLanguage } from '../context/LanguageContext';

function Home() {
  const { t, language } = useLanguage();
  const typingRef = useRef(null);

  /* ── DATA ── */
  const focusAreas = [
    { icon: 'fa-globe',      label: t('focus', 'web') || 'Full-Stack Web Development',    color: 'primary'   },
    { icon: 'fa-mobile-alt', label: t('focus', 'mobile') || 'Mobile App Development',        color: 'secondary' },
    { icon: 'fa-shield-alt', label: t('focus', 'cyber') || 'Cybersecurity',                 color: 'accent'    },
    { icon: 'fa-cloud',      label: t('focus', 'cloud') || 'Cloud Computing',               color: 'info'      },
    { icon: 'fa-code',       label: t('focus', 'software') || 'Software Engineering',          color: 'primary'   },
    { icon: 'fa-database',   label: t('focus', 'db') || 'Database Systems',              color: 'secondary' },
  ];

  const skillCategories = [
    { title: t('skills', 'lang') || 'Programming Languages', icon: 'fa-terminal',   color: 'primary',   skills: ['Java','JavaScript','Python','C++','SQL','HTML5','CSS3'] },
    { title: t('skills', 'front') || 'Front-End Development', icon: 'fa-desktop',    color: 'secondary', skills: ['React.js','Next.js','Bootstrap','Tailwind CSS','Responsive Design'] },
    { title: t('skills', 'back') || 'Back-End Development',  icon: 'fa-server',     color: 'info',      skills: ['Node.js','Express.js','REST APIs','Authentication','Database Integration'] },
    { title: t('skills', 'mobile') || 'Mobile Development',    icon: 'fa-mobile-alt', color: 'accent',    skills: ['Flutter','React Native','Android Dev','Firebase','Cross-Platform'] },
    { title: t('skills', 'cloud') || 'Cloud Computing',       icon: 'fa-cloud',      color: 'primary',   skills: ['AWS','Microsoft Azure','Cloud Storage','IAM','Serverless'] },
    { title: t('skills', 'cyber') || 'Cybersecurity',         icon: 'fa-shield-alt', color: 'accent',    skills: ['Network Security','OWASP Top 10','Secure Coding','Vulnerability Assessment'] },
    { title: t('skills', 'db') || 'Database Technologies', icon: 'fa-database',   color: 'secondary', skills: ['MySQL','PostgreSQL','MongoDB','Database Design','SQL Optimization'] },
    { title: t('skills', 'tools') || 'Dev Tools',             icon: 'fa-tools',      color: 'info',      skills: ['Git','GitHub','Docker','Linux','VS Code','Postman','Figma'] },
  ];

  const softSkills = ['Problem Solving','Critical Thinking','Continuous Learning','Team Collaboration','Leadership','Adaptability','Communication','Analytical Thinking'];

  const experiences = [
    {
      title: t('exp', 't1') || 'Academic Software Development', org: t('exp', 'o1') || 'Jimma Institute of Technology', period: '2022 – Present', color: 'primary', icon: 'fa-graduation-cap',
      points: [
        t('exp', 'p1a') || 'Designed and developed multiple academic projects — desktop apps, web apps, and cloud-based solutions.',
        t('exp', 'p1b') || 'Applied OOP, data structures, and software engineering principles to real-world problems.',
        t('exp', 'p1c') || 'Gained hands-on experience with database design, API development, and system architecture.',
      ],
    },
    {
      title: t('exp', 't2') || 'Team-Based Development', org: t('exp', 'o2') || 'University Group Projects', period: '2023 – Present', color: 'secondary', icon: 'fa-users',
      points: [
        t('exp', 'p2a') || 'Collaborated with peers to analyze requirements, design architectures, and implement solutions.',
        t('exp', 'p2b') || 'Led feature development using Git and GitHub for version control.',
        t('exp', 'p2c') || 'Practiced Agile methodologies and iterative development cycles.',
      ],
    },
    {
      title: t('exp', 't3') || 'Technical Research & Self-Learning', org: t('exp', 'o3') || 'Independent Study', period: '2022 – Present', color: 'accent', icon: 'fa-book-open',
      points: [
        t('exp', 'p3a') || 'In-depth research on cloud computing, cybersecurity, software engineering, and emerging tech.',
        t('exp', 'p3b') || 'Completed online courses, lab exercises, and technical documentation.',
        t('exp', 'p3c') || 'Actively pursuing industry certifications to validate practical knowledge.',
      ],
    },
    {
      title: t('exp', 't4') || 'Open Source & Freelance Work', org: t('exp', 'o4') || 'Personal & Freelance Projects', period: '2024 – Present', color: 'info', icon: 'fa-laptop-code',
      points: [
        t('exp', 'p4a') || 'Built responsive web applications and desktop tools for various use cases.',
        t('exp', 'p4b') || 'Maintained professional GitHub repositories with clean documentation.',
        t('exp', 'p4c') || 'Continuously improving through open-source contribution and real-client feedback.',
      ],
    },
  ];

  const certs = [
    { title: 'AWS Certified Cloud Practitioner',          org: 'Amazon Web Services', icon: 'fa-cloud',      color: 'primary',   status: t('certStatus', 'progress') || 'In Progress' },
    { title: 'Azure Fundamentals (AZ-900)',               org: 'Microsoft',           icon: 'fa-microsoft',  color: 'info',      status: t('certStatus', 'progress') || 'In Progress' },
    { title: 'Cisco CCNA',                                org: 'Cisco',               icon: 'fa-network-wired',color:'secondary', status: t('certStatus', 'targeted') || 'Targeted'    },
    { title: 'Google Cybersecurity Certificate',          org: 'Google',              icon: 'fa-shield-alt', color: 'accent',    status: t('certStatus', 'progress') || 'In Progress' },
    { title: 'Meta Front-End Developer',                  org: 'Meta',                icon: 'fa-code',       color: 'primary',   status: t('certStatus', 'targeted') || 'Targeted'    },
    { title: 'Meta Back-End Developer',                   org: 'Meta',                icon: 'fa-server',     color: 'secondary', status: t('certStatus', 'targeted') || 'Targeted'    },
  ];

  const achievementStats = [
    { val: '10+', label: t('stats', 'projects') || 'Projects Completed',       icon: 'fa-project-diagram', color: 'primary'   },
    { val: '500+',label: t('stats', 'github') || 'GitHub Contributions',     icon: 'fa-code-branch',     color: 'secondary' },
    { val: '3+',  label: t('stats', 'stacks') || 'Major Tech Stacks',        icon: 'fa-layer-group',     color: 'accent'    },
    { val: '6+',  label: t('stats', 'certs') || 'Certifications Pursued',   icon: 'fa-certificate',     color: 'info'      },
  ];

  const academic = [
    t('academic','oop'), t('academic','dsa'), t('academic','db'),
    t('academic','se'), t('academic','net'), t('academic','os')
  ];
  const technical = [
    t('technical','t1'), t('technical','t2'), t('technical','t3'),
    t('technical','t4'), t('technical','t5'), t('technical','t6')
  ];

  useEffect(() => {
    const target = typingRef.current;
    if (!target) return;
    const phrases = [
      t('typingPhrases','p1') || 'Full-Stack Web Developer',
      t('typingPhrases','p2') || 'Mobile App Developer',
      t('typingPhrases','p3') || 'Cybersecurity Enthusiast',
      t('typingPhrases','p4') || 'Cloud Computing Enthusiast'
    ];
    let phraseIdx = 0, charIdx = 0, isDeleting = false, timer;
    const type = () => {
      const phrase = phrases[phraseIdx];
      target.textContent = phrase.substring(0, charIdx);
      let speed = isDeleting ? 45 : 95;
      if (!isDeleting && charIdx === phrase.length) { speed = 2200; isDeleting = true; }
      else if (isDeleting && charIdx === 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; speed = 400; }
      charIdx = isDeleting ? charIdx - 1 : charIdx + 1;
      timer = setTimeout(type, speed);
    };
    type();
    return () => clearTimeout(timer);
  }, [language]);

  return (
    <>
      {/* ═══════════════════════════ HERO ═══════════════════════════ */}
      <header className="hero-section min-vh-100 d-flex align-items-center">
        <div className="container">
          <div className="row align-items-center gy-5 text-center text-lg-start">
            <div className="col-lg-7 reveal">
              <div className="hero-badge mb-4 mx-auto mx-lg-0">
                <span className="badge-icon"><i className="fas fa-bolt"></i></span>
                <span className="badge-text">{t('hero', 'available')}</span>
              </div>
              <h1 className="hero-title mb-3">
                {t('hero', 'hello')}<br />
                <span className="text-gradient d-block mt-2">GIRMA ASHETU ASEFA</span>
              </h1>
              <h4 className="text-white mb-4 fw-normal">{t('hero', 'subtitle')}</h4>
              <div className="typing-box mb-4">
                <h5 className="hero-subtitle fs-4" id="typing-hero-container">
                  <span id="typing-hero" ref={typingRef} className="text-primary"></span>
                  <span className="cursor">|</span>
                </h5>
              </div>
              <p className="hero-description mb-5 text-light mx-auto mx-lg-0" style={{ lineHeight: '1.9', fontSize: '1.1rem' }}>
                {t('hero', 'description')}
              </p>
              <div className="hero-actions d-flex flex-wrap gap-4 justify-content-center justify-content-lg-start">
                <Link to="/projects" className="btn-premium">
                  <span className="btn-text">{t('hero', 'viewProjects')}</span>
                  <span className="btn-icon"><i className="fas fa-arrow-right"></i></span>
                </Link>
                <a href="/cv.pdf" className="btn-outline-premium" download>
                  <i className="fas fa-download me-2"></i>{t('hero', 'downloadResume')}
                </a>
                <Link to="/contact" className="btn-outline-premium">{t('hero', 'contactMe')}</Link>
              </div>
            </div>
            <div className="col-lg-5 reveal">
              <div className="hero-visual">
                <div className="visual-container">
                  <div className="glow-orb"></div>
                  <div className="rotating-rings">
                    <div className="orbit-path" style={{ inset: '-30px', borderStyle: 'dashed', opacity: 0.1 }}></div>
                    <div className="orbit-path" style={{ inset: '-70px', borderStyle: 'dotted', opacity: 0.05 }}></div>
                    <div className="ring ring-1"></div>
                    <div className="ring ring-2"></div>
                    <div className="ring ring-3"></div>
                  </div>
                  <div className="profile-mask">
                    <div className="hud-overlay"></div>
                    <div className="corner-brackets"></div>
                    <img src="/about_profile.jpg" alt="Girma Ashetu Asefa" className="hero-avatar" />
                  </div>
                  <div className="tech-float float-1 glass-pane">
                    <i className="fas fa-shield-alt text-accent"></i>
                  </div>
                  <div className="tech-float float-2 glass-pane">
                    <i className="fas fa-cloud text-primary"></i>
                  </div>
                  <div className="tech-float float-3 glass-pane" style={{ bottom: '40%', right: '-15px', animationDelay: '-1.5s' }}>
                    <i className="fas fa-code text-secondary"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span className="scroll-text">{t('hero','scroll') || 'Scroll to Explore'}</span>
          <div className="scroll-line"></div>
        </div>
      </header>

      {/* ═══════════════════════════ STATS ═══════════════════════════ */}
      <section className="py-10">
        <div className="container">
          <div className="row g-4 text-center justify-content-center">
            {achievementStats.map((s, i) => (
              <div key={i} className="col-md-3 reveal-up">
                <div className="glass-pane glass-pane-hover p-5 h-100 bento-item">
                  <div className="stat-icon mb-3"><i className={`fas ${s.icon} text-${s.color} fs-2`}></i></div>
                  <h2 className="display-4 fw-bold text-white mb-0">{s.val}</h2>
                  <p className={`small uppercase mt-2 tracking-widest fw-bold text-${s.color}`}>{s.label}</p>
                  <div className={`stat-accent bg-${s.color}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FOCUS AREAS ═══════════════════════════ */}
      <section className="py-10">
        <div className="container py-5 text-center">
          <div className="reveal-up mb-5">
            <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>{t('homeTitles','focus')}</h6>
            <h2 className="display-5 fw-bold mb-3">{t('homeTitles','focusSub')}</h2>
          </div>
          <div className="row g-4">
            {focusAreas.map((area, i) => (
              <div key={i} className="col-lg-4 col-md-6 reveal-up">
                <div className={`glass-pane p-4 h-100 bento-item d-flex flex-column flex-sm-row align-items-center gap-4 text-center text-sm-start border-start border-3 border-${area.color}`}>
                  <i className={`fas ${area.icon} text-${area.color} fs-2 flex-shrink-0 mb-3 mb-sm-0`}></i>
                  <h5 className="fw-bold text-white mb-0">{area.label}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ SKILLS ═══════════════════════════ */}
      <section className="py-10">
        <div className="container py-5">
          <div className="text-center mb-5 reveal">
            <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>{t('homeTitles','skills')}</h6>
            <h2 className="display-5 fw-bold mb-3">{t('homeTitles','skillsSub')}</h2>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '580px' }}>
              {t('about','p1')}
            </p>
          </div>
          <div className="row g-4 mb-5">
            {skillCategories.map((cat, i) => (
              <div key={i} className="col-lg-3 col-md-6 reveal-up">
                <div className={`glass-pane p-4 h-100 bento-item border-top border-3 border-${cat.color}`}>
                  <h6 className={`text-${cat.color} fw-bold mb-3`}>
                    <i className={`fas ${cat.icon} me-2`}></i>{cat.title}
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {cat.skills.map((skill, si) => (
                      <span key={si} className={`badge bg-${cat.color} bg-opacity-25 text-${cat.color} border border-${cat.color}`}>{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Soft Skills */}
          <div className="glass-pane p-4 reveal-up">
            <h5 className="text-white fw-bold mb-4"><i className="fas fa-users text-primary me-2"></i>{t('homeTitles','softSkillsTitle') || t('about','tabs')?.soft || 'Soft Skills'}</h5>
            <div className="d-flex flex-wrap gap-3">
              {softSkills.map((s, i) => (
                <span key={i} className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary px-3 py-2 fs-6">
                  <i className="fas fa-check-circle me-2 text-primary"></i>{s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ EXPERIENCE ═══════════════════════════ */}
      <section className="py-10">
        <div className="container py-5">
          <div className="text-center mb-5 reveal">
            <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>{t('homeTitles','experience')}</h6>
            <h2 className="display-5 fw-bold mb-3">{t('homeTitles','expSub')}</h2>
          </div>
          <div className="row g-4">
            {experiences.map((exp, i) => (
              <div key={i} className="col-lg-6 reveal-up">
                <div className={`glass-pane p-4 p-md-5 h-100 bento-item border-start border-4 border-${exp.color}`}>
                  <div className="d-flex flex-column flex-sm-row align-items-center align-items-sm-start gap-3 mb-4 text-center text-sm-start">
                    <i className={`fas ${exp.icon} text-${exp.color} fs-2 flex-shrink-0`}></i>
                    <div>
                      <h5 className="text-white fw-bold mb-1">{exp.title}</h5>
                      <span className={`badge bg-${exp.color} bg-opacity-25 text-${exp.color} border border-${exp.color}`}>{exp.org} · {exp.period}</span>
                    </div>
                  </div>
                  <ul className="text-muted mb-0 ps-3 text-start" style={{ lineHeight: '1.9' }}>
                    {exp.points.map((pt, j) => <li key={j}>{pt}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CERTIFICATIONS ═══════════════════════════ */}
      <section className="py-10">
        <div className="container py-5">
          <div className="text-center mb-5 reveal">
            <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>{t('homeTitles','certs')}</h6>
            <h2 className="display-5 fw-bold mb-3">{t('homeTitles','certsSub')}</h2>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '560px' }}>
              {t('about','p2')}
            </p>
          </div>
          <div className="row g-4">
            {certs.map((cert, i) => (
              <div key={i} className="col-md-6 col-lg-4 reveal-up">
                <div className={`glass-pane p-4 h-100 bento-item border-top border-3 border-${cert.color}`}>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <i className={`fas ${cert.icon} text-${cert.color} fs-2`}></i>
                    <span className={`badge ${cert.status === 'In Progress' ? 'bg-primary' : 'bg-secondary'} ms-auto`}>{cert.status}</span>
                  </div>
                  <h6 className="text-white fw-bold mb-1">{cert.title}</h6>
                  <p className={`text-${cert.color} small mb-0`}>{cert.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ ACHIEVEMENTS ═══════════════════════════ */}
      <section className="py-10">
        <div className="container py-5">
          <div className="text-center mb-5 reveal">
            <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>{t('homeTitles','achievements')}</h6>
            <h2 className="display-5 fw-bold mb-3">{t('homeTitles','achieveSub')}</h2>
          </div>
          <div className="row g-4">
            {/* Academic */}
            <div className="col-lg-6 reveal-up">
              <div className="glass-pane p-5 h-100 bento-item border-top border-3 border-primary">
                <h4 className="text-white fw-bold mb-4"><i className="fas fa-graduation-cap text-primary me-3"></i>{t('achieveTitles','academic') || 'Academic Growth'}</h4>
                <ul className="list-unstyled d-flex flex-column gap-3">
                  {academic.map((item, i) => (
                    <li key={i} className="d-flex align-items-center gap-3">
                      <span className="badge bg-primary rounded-circle p-2"><i className="fas fa-check"></i></span>
                      <span className="text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Technical */}
            <div className="col-lg-6 reveal-up">
              <div className="glass-pane p-5 h-100 bento-item border-top border-3 border-secondary">
                <h4 className="text-white fw-bold mb-4"><i className="fas fa-trophy text-secondary me-3"></i>{t('achieveTitles','technical') || 'Technical Accomplishments'}</h4>
                <ul className="list-unstyled d-flex flex-column gap-3">
                  {technical.map((item, i) => (
                    <li key={i} className="d-flex align-items-center gap-3">
                      <span className="badge bg-secondary rounded-circle p-2"><i className="fas fa-check"></i></span>
                      <span className="text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* GitHub */}
            <div className="col-12 reveal-up">
              <div className="glass-pane p-5 bento-item-large border-top border-3 border-accent">
                <div className="row align-items-center g-4">
                  <div className="col-lg-7">
                    <h4 className="text-white fw-bold mb-3"><i className="fab fa-github text-accent me-3"></i>{t('achieveTitles','github') || 'GitHub Portfolio'}</h4>
                    <p className="text-muted fs-5 mb-4" style={{ lineHeight: '1.8' }}>
                      {t('achieveTitles','githubDesc') || 'My GitHub serves as a live showcase of my software development journey.'}
                    </p>
                    <a href="https://github.com/Girma-Ashetu" target="_blank" rel="noopener noreferrer" className="btn-premium">
                      <span className="btn-text">{t('achieveTitles','viewGithub') || 'View GitHub Profile'}</span>
                      <span className="btn-icon"><i className="fab fa-github"></i></span>
                    </a>
                  </div>
                  <div className="col-lg-5">
                    <div className="d-flex flex-wrap gap-2">
                      {['Web Development','Mobile Apps','Cloud Projects','Cybersecurity','Software Engineering','Academic Projects'].map((cat, i) => (
                        <span key={i} className="badge bg-accent bg-opacity-25 text-accent border border-accent px-3 py-2">{cat}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURED PROJECT (CTA) ═══════════════════════════ */}
      <section className="py-10">
        <div className="container py-5">
          <div className="glass-pane overflow-hidden reveal-up bento-item-large">
            <div className="row g-0">
              <div className="col-lg-5 position-relative overflow-hidden">
                <img src="/about_profile.jpg" alt="Girma Asefa" loading="lazy" className="img-fluid h-100 w-100 innovation-img" style={{ objectFit: 'cover', objectPosition: 'top' }} />
                <div className="img-overlay-glow"></div>
              </div>
              <div className="col-lg-7 p-5 d-flex flex-column justify-content-center">
                <div className="premium-badge mb-4">{t('homeTitles','mission')}</div>
                <h2 className="display-6 fw-bold mb-4">{t('hero','description').substring(0,40)}...</h2>
                <p className="text-muted fs-5 mb-5" style={{ lineHeight: '1.9' }}>
                  {t('hero','description')}
                </p>
                <div className="d-flex gap-4 flex-wrap">
                  <Link to="/projects" className="btn-premium">{t('hero','viewProjects')}</Link>
                  <Link to="/contact" className="btn-outline-premium">{t('contact','title')}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
