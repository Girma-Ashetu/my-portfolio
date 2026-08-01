import React, { useRef } from 'react';
import './certifications.css';

function TiltCard({ children, className }) {
  const ref = useRef(null);
  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -10;
    ref.current.style.transform = `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return (
    <div ref={ref} className={`tilt-card-wrapper ${className || ''}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  );
}

const certs = [
  { title: 'AWS Certified Cloud Practitioner', org: 'Amazon Web Services', icon: 'fa-brands fa-aws', color: 'var(--warning)', bg: 'rgba(251,191,36,0.12)', status: 'In Progress' },
  { title: 'Azure Fundamentals (AZ-900)', org: 'Microsoft', icon: 'fa-brands fa-microsoft', color: 'var(--info)', bg: 'rgba(56,189,248,0.12)', status: 'In Progress' },
  { title: 'Cisco CCNA', org: 'Cisco', icon: 'fa-solid fa-network-wired', color: 'var(--primary)', bg: 'rgba(94,234,212,0.12)', status: 'Targeted' },
  { title: 'Google Cybersecurity Certificate', org: 'Google', icon: 'fa-brands fa-google', color: 'var(--accent)', bg: 'rgba(168,85,247,0.12)', status: 'In Progress' },
  { title: 'Meta Front-End Developer', org: 'Meta', icon: 'fa-brands fa-meta', color: 'var(--secondary)', bg: 'rgba(99,102,241,0.12)', status: 'Targeted' },
  { title: 'Meta Back-End Developer', org: 'Meta', icon: 'fa-solid fa-server', color: 'var(--accent)', bg: 'rgba(168,85,247,0.12)', status: 'Targeted' },
  { title: 'CompTIA Security+', org: 'CompTIA', icon: 'fa-solid fa-shield-halved', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', status: 'Targeted' },
  { title: 'Google Associate Cloud Engineer', org: 'Google', icon: 'fa-solid fa-cloud', color: 'var(--info)', bg: 'rgba(56,189,248,0.12)', status: 'Targeted' },
];

const roadmap = [
  { title: 'AWS Solutions Architect Associate', org: 'Amazon Web Services' },
  { title: 'Microsoft Azure Administrator', org: 'Microsoft' },
  { title: 'Certified Ethical Hacker (CEH)', org: 'EC-Council' },
  { title: 'CompTIA Network+', org: 'CompTIA' },
  { title: 'Kubernetes Administrator (CKA)', org: 'CNCF' },
  { title: 'Terraform Associate', org: 'HashiCorp' },
];

function Certifications() {
  return (
    <section className="certs-master-section">
      {/* Background */}
      <div className="certs-bg-aurora">
        <div className="certs-aurora-1" />
        <div className="certs-aurora-2" />
      </div>
      <div className="certs-bg-grid" />

      <div className="container relative-z">
        {/* Header */}
        <div className="certs-header reveal">
          <div className="certs-icon-core">
            <div className="certs-ring-1" />
            <div className="certs-ring-2" />
            <i className="fas fa-certificate" />
          </div>
          <span className="certs-chip">Professional Credentials</span>
          <h2 className="certs-title">Certifications &amp; <span className="text-gradient">Learning Path</span></h2>
          <p className="certs-sub">
            Globally recognised industry certifications that validate expertise and demonstrate a commitment to continuous professional growth.
          </p>
        </div>

        {/* Active Certs Grid */}
        <div className="certs-section-label reveal-up">
          <i className="fas fa-spinner fa-spin" />
          <span>Current Learning Path</span>
        </div>

        <div className="certs-grid-master">
          {certs.map((cert, i) => (
            <TiltCard key={i}>
              <div className="cert-card-master" style={{ animationDelay: `${i * 0.08}s` }}>
                {/* Glow orb */}
                <div className="cert-card-glow" style={{ background: cert.color }} />
                {/* Accent bar */}
                <div className="cert-accent-bar" style={{ background: `linear-gradient(90deg, ${cert.color}, transparent)`, color: cert.color }} />

                {/* Icon Shield */}
                <div className="cert-icon-shield" style={{ background: cert.bg, border: `1px solid ${cert.color}40`, color: cert.color }}>
                  <i className={cert.icon} />
                </div>

                {/* Info */}
                <div className="cert-info">
                  <div className="cert-org-label">{cert.org}</div>
                  <div className="cert-title-text">{cert.title}</div>
                  <span className={`cert-status-pill ${cert.status === 'In Progress' ? 'in-progress' : 'targeted'}`}>
                    <span className="cert-status-dot" />
                    {cert.status}
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>

        {/* Roadmap */}
        <div className="certs-section-label reveal-up" style={{ marginTop: '1rem' }}>
          <i className="fas fa-road" style={{ color: 'var(--accent)', filter: 'drop-shadow(0 0 8px var(--accent))' }} />
          <span>Future Certifications Roadmap</span>
        </div>

        <div className="certs-roadmap-master reveal-up">
          <div className="roadmap-bg-pattern" />
          <div className="roadmap-glow" />
          <div className="roadmap-grid" style={{ position: 'relative', zIndex: 2 }}>
            {roadmap.map((r, i) => (
              <div key={i} className="roadmap-item">
                <div className="roadmap-flag"><i className="fas fa-flag" /></div>
                <div className="roadmap-texts">
                  <h6>{r.title}</h6>
                  <small>{r.org}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Certifications;
