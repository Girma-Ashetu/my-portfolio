import React, { useRef } from 'react';
import './experience.css';

function TiltCard({ children }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
    ref.current.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.01,1.01,1.01)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ''; };
  return (
    <div ref={ref} className="tilt-card-wrapper" onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

const experiences = [
  {
    title: 'Academic Software Development',
    org: 'Jimma Institute of Technology',
    period: '2022 – Present',
    color: 'var(--primary)',
    bgColor: 'rgba(94,234,212,0.1)',
    dotColor: 'var(--primary)',
    icon: 'fa-graduation-cap',
    points: [
      'Designed and developed multiple academic projects — desktop applications, web apps, and cloud-based solutions.',
      'Applied object-oriented programming, data structures, and software engineering principles to real-world problems.',
      'Gained hands-on experience with database design, API development, and system architecture.',
    ],
  },
  {
    title: 'Team-Based Development',
    org: 'University Group Projects',
    period: '2023 – Present',
    color: 'var(--secondary)',
    bgColor: 'rgba(99,102,241,0.1)',
    dotColor: 'var(--secondary)',
    icon: 'fa-users',
    points: [
      'Collaborated with peers to analyze requirements, design software architectures, and implement solutions.',
      'Led feature development in team environments using Git and GitHub for version control.',
      'Practiced Agile methodologies and iterative development cycles.',
    ],
  },
  {
    title: 'Technical Research & Self-Learning',
    org: 'Independent Study',
    period: '2022 – Present',
    color: 'var(--accent)',
    bgColor: 'rgba(168,85,247,0.1)',
    dotColor: 'var(--accent)',
    icon: 'fa-book-open',
    points: [
      'Conducted in-depth research on cloud computing, cybersecurity, software engineering, and emerging techniques.',
      'Completed online courses, technical documentation studies, and hands-on lab exercises.',
      'Actively pursuing industry certifications to validate and formalise practical knowledge.',
    ],
  },
  {
    title: 'Open Source & Freelance Work',
    org: 'Personal & Freelance Projects',
    period: '2024 – Present',
    color: 'var(--info)',
    bgColor: 'rgba(56,189,248,0.1)',
    dotColor: 'var(--info)',
    icon: 'fa-laptop-code',
    points: [
      'Built responsive web applications and desktop tools for various use cases and clients.',
      'Maintained professional GitHub repositories with clean documentation and coding standards.',
      'Continuously improving through open-source contributions and real-client feedback loops.',
    ],
  },
];

function Experience() {
  return (
    <section className="exp-master-section">
      {/* Background */}
      <div className="exp-bg-aurora">
        <div className="exp-aurora-1" />
        <div className="exp-aurora-2" />
      </div>
      <div className="exp-bg-grid" />

      <div className="container relative-z">
        {/* Header */}
        <div className="exp-section-header reveal">
          <div className="exp-icon-core">
            <div className="exp-ring-1" />
            <div className="exp-ring-2" />
            <i className="fas fa-briefcase" />
          </div>
          <span className="exp-page-chip">Professional Journey</span>
          <h2 className="exp-page-title">Experience &amp; <span className="text-gradient">Background</span></h2>
          <p className="exp-page-sub">
            Building a solid foundation through academic projects, team collaboration, intensive research, and continuous hands-on software development.
          </p>
        </div>

        {/* Timeline */}
        <div className="exp-timeline-master">
          {experiences.map((exp, i) => (
            <TiltCard key={i}>
              <div className="exp-card-master reveal-up" style={{ animationDelay: `${i * 0.12}s` }}>
                {/* Left glow bar */}
                <div className="exp-left-glow" style={{ background: exp.color, color: exp.color }} />
                {/* Background glow orb */}
                <div className="exp-card-bg-glow" style={{ background: exp.color }} />

                {/* Timeline dot */}
                <div className="exp-timeline-dot" style={{ borderColor: exp.color, color: exp.color }}>
                  <i className={`fas ${exp.icon}`} />
                </div>

                {/* Card head */}
                <div className="exp-card-head">
                  <div>
                    <h3 className="exp-card-title">{exp.title}</h3>
                    <span className="exp-org-chip" style={{ color: exp.color, borderColor: `${exp.color}40`, background: exp.bgColor }}>
                      <i className={`fas ${exp.icon}`} />
                      {exp.org}
                    </span>
                  </div>
                  <span className="exp-period-tag">{exp.period}</span>
                </div>

                {/* Points */}
                <ul className="exp-points-list">
                  {exp.points.map((pt, j) => (
                    <li key={j} className="exp-point-item" style={{ color: 'var(--text-dim)' }}>
                      <span className="exp-point-bullet" style={{ background: exp.color, color: exp.color }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
