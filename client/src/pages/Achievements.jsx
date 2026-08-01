import React, { useRef, useEffect, useState } from 'react';
import './achievements.css';

// Counter animation hook
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.8 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const numeric = parseInt(String(target).replace(/\D/g, ''), 10);
    const suffix = String(target).replace(/[0-9]/g, '');
    let start = 0;
    const step = numeric / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) { setCount(numeric); clearInterval(timer); }
      else setCount(Math.ceil(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { ref, display: (started ? count : 0) + (String(target).replace(/[0-9]/g, '')) };
}

function TiltCard({ children }) {
  const ref = useRef(null);
  const m = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
    ref.current.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
  };
  const l = () => { if (ref.current) ref.current.style.transform = ''; };
  return <div ref={ref} className="tilt-card-wrapper" onMouseMove={m} onMouseLeave={l}>{children}</div>;
}

function StatCard({ val, label, icon, color, scColor, delay = 0 }) {
  const { ref, display } = useCounter(val);
  return (
    <TiltCard>
      <div ref={ref} className="achieve-stat-card reveal-up" style={{ '--sc-color': scColor, animationDelay: `${delay}s` }}>
        <div className="achieve-stat-glow" />
        <span className="achieve-stat-icon" style={{ color }}><i className={`fas ${icon}`} /></span>
        <div className="achieve-stat-val" style={{ color }}>{display}</div>
        <div className="achieve-stat-label">{label}</div>
      </div>
    </TiltCard>
  );
}

const stats = [
  { val: '10+', label: 'Projects Completed', icon: 'fa-project-diagram', color: 'var(--primary)', scColor: 'var(--primary)' },
  { val: '500+', label: 'GitHub Contributions', icon: 'fa-code-branch', color: 'var(--secondary)', scColor: 'var(--secondary)' },
  { val: '3+', label: 'Major Tech Stacks', icon: 'fa-layer-group', color: 'var(--accent)', scColor: 'var(--accent)' },
  { val: '6+', label: 'Certifications Pursued', icon: 'fa-certificate', color: 'var(--warning)', scColor: 'var(--warning)' },
];

const academicItems = [
  'Object-Oriented Programming',
  'Data Structures & Algorithms',
  'Database Systems',
  'Software Engineering Principles',
  'Computer Networks',
  'Operating Systems',
];

const technicalItems = [
  'Developed multiple full-stack production-grade projects',
  'Built database-driven desktop & web applications',
  'Created fully responsive, accessible web interfaces',
  'Implemented and deployed cloud infrastructure',
  'Applied cybersecurity & network security concepts',
  'Maintained active, disciplined daily development habits',
];

const repoCats = ['Web Development', 'Mobile Applications', 'Cloud Projects', 'Cybersecurity', 'Software Engineering', 'Academic Projects'];

function Achievements() {
  return (
    <section className="achieve-master-section">
      {/* Background */}
      <div className="achieve-bg-aurora">
        <div className="achieve-aurora-1" />
        <div className="achieve-aurora-2" />
      </div>
      <div className="achieve-bg-grid" />

      <div className="container relative-z">
        {/* Header */}
        <div className="achieve-header reveal">
          <div className="achieve-icon-core">
            <div className="achieve-ring-1" />
            <div className="achieve-ring-2" />
            <i className="fas fa-trophy" />
          </div>
          <span className="achieve-chip">Milestones</span>
          <h2 className="achieve-title">Achievements &amp; <span className="text-gradient">Growth</span></h2>
          <p className="achieve-sub">
            A track record of consistent academic and technical accomplishments demonstrating capability, discipline, and dedication.
          </p>
        </div>

        {/* Stats */}
        <div className="achieve-stats-grid">
          {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
        </div>

        {/* Two-column panels */}
        <div className="achieve-content-grid">
          {/* Academic */}
          <TiltCard>
            <div className="achieve-panel reveal-up">
              <div className="achieve-panel-bar" style={{ background: 'linear-gradient(90deg, var(--primary), transparent)', color: 'var(--primary)' }} />
              <div className="achieve-panel-glow" style={{ background: 'var(--primary)' }} />
              <div className="achieve-panel-title">
                <i className="fas fa-graduation-cap" style={{ color: 'var(--primary)' }} />
                Academic Growth
              </div>
              <ul className="achieve-checklist">
                {academicItems.map((item, i) => (
                  <li key={i} className="achieve-check-item">
                    <div className="achieve-check-icon" style={{ background: 'rgba(94,234,212,0.1)', color: 'var(--primary)', border: '1px solid rgba(94,234,212,0.2)' }}>
                      <i className="fas fa-check" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>

          {/* Technical */}
          <TiltCard>
            <div className="achieve-panel reveal-up" style={{ animationDelay: '0.15s' }}>
              <div className="achieve-panel-bar" style={{ background: 'linear-gradient(90deg, var(--secondary), transparent)', color: 'var(--secondary)' }} />
              <div className="achieve-panel-glow" style={{ background: 'var(--secondary)' }} />
              <div className="achieve-panel-title">
                <i className="fas fa-trophy" style={{ color: 'var(--warning)' }} />
                Technical Accomplishments
              </div>
              <ul className="achieve-checklist">
                {technicalItems.map((item, i) => (
                  <li key={i} className="achieve-check-item">
                    <div className="achieve-check-icon" style={{ background: 'rgba(99,102,241,0.1)', color: 'var(--secondary)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <i className="fas fa-check" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </TiltCard>
        </div>

        {/* GitHub Full-Width */}
        <TiltCard>
          <div className="achieve-github-panel reveal-up" style={{ marginTop: '2rem' }}>
            <div className="achieve-github-glow" />
            <div>
              <h3 className="achieve-github-title">
                <i className="fab fa-github me-3" style={{ color: 'var(--accent)' }} />
                GitHub Portfolio
              </h3>
              <p className="achieve-github-desc">
                My GitHub is a live showcase of my software development journey — professional repositories, clean documentation, and real-world projects that demonstrate technical growth and engineering discipline.
              </p>
              <a
                href="https://github.com/Girma-Ashetu"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-masterpiece-primary"
                style={{ textDecoration: 'none' }}
              >
                <span className="btn-bg-slide" />
                <span className="btn-content">
                  <i className="fab fa-github me-2" />
                  View GitHub Profile
                </span>
              </a>
            </div>
            <div>
              <h6 style={{ color: '#fff', fontWeight: 700, marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                Repository Categories
              </h6>
              <div className="achieve-repo-cats">
                {repoCats.map((cat, i) => (
                  <span key={i} className="achieve-cat-badge">{cat}</span>
                ))}
              </div>
            </div>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}

export default Achievements;
