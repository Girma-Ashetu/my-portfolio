import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './about.css';

/* ── Tilt Card Wrapper ── */
function TiltCard({ children, className, style }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
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

const interests = ['Full-Stack Development', 'Mobile App Development', 'Cloud Computing', 'Cybersecurity', 'Software Architecture', 'Artificial Intelligence', 'Database Engineering', 'DevOps Practices'];
const strengths = ['Problem Solving', 'Critical Thinking', 'Continuous Learning', 'Team Collaboration', 'Leadership', 'Adaptability', 'Communication', 'Analytical Thinking'];

function About() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('about');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayTab, setDisplayTab] = useState('about');

  // Handle smooth tab transitions
  const handleTabChange = (id) => {
    if (id === activeTab) return;
    setIsTransitioning(true);
    setActiveTab(id);
    setTimeout(() => {
        setDisplayTab(id);
        setIsTransitioning(false);
    }, 300); // Wait for fade out
  };

  const tabs = [
    { id: 'about',     label: t('about', 'tabs')?.academic || 'Personal Mission', icon: 'fa-user-astronaut' },
    { id: 'education', label: 'Academic Journey', icon: 'fa-graduation-cap' },
    { id: 'interests', label: t('about', 'tabs')?.technical || 'Technical Focus', icon: 'fa-microchip' },
    { id: 'strengths', label: t('about', 'tabs')?.soft || 'Core Strengths', icon: 'fa-bolt' },
  ];

  return (
    <section className="about-master-section">
      {/* Background Ambience */}
      <div className="about-bg-aurora">
          <div className="about-aurora-1"></div>
          <div className="about-aurora-2"></div>
      </div>
      <div className="about-bg-grid"></div>

      <div className="container relative-z">
        {/* Profile Header Block */}
        <div className="about-header-grid mb-5">
          {/* Left: Avatar Scene */}
          <div className="about-avatar-col reveal">
            <TiltCard>
                <div className="about-avatar-scene">
                    <div className="about-glow-orb"></div>
                    <div className="about-avatar-ring ar-1"></div>
                    <div className="about-avatar-ring ar-2"></div>
                    <div className="about-avatar-frame">
                        <img src="/about_profile.jpg" alt="Girma Ashetu Asefa" className="about-img" />
                        <div className="about-img-overlay"></div>
                    </div>
                    {/* Floating Info Badges */}
                    <div className="about-floating-badge badge-top">
                        <i className="fas fa-code text-primary me-2"></i> Software Eng.
                    </div>
                    <div className="about-floating-badge badge-bottom">
                        <i className="fas fa-map-marker-alt text-accent me-2"></i> Jimma, ET
                    </div>
                </div>
            </TiltCard>
          </div>

          {/* Right: Bio Text */}
          <div className="about-bio-col reveal" style={{ transitionDelay: '0.2s' }}>
            <span className="section-chip">{t('about', 'title') || 'Discover My Story'}</span>
            <h2 className="about-title">
              Girma Ashetu <span className="text-gradient">Asefa</span>
            </h2>
            <h4 className="about-subtitle">{t('about', 'subtitle') || 'Full-Stack Developer & Innovator'}</h4>
            <div className="about-desc-box">
                <p>{t('about', 'p1') || 'I am a passionate software engineering student dedicated to building robust, scalable, and visually stunning digital experiences.'}</p>
                <p className="mb-0">{t('about', 'p2') || 'With a deep love for problem-solving and modern web technologies, I strive to bridge the gap between complex backend logic and beautiful frontend interfaces.'}</p>
            </div>
            
            <div className="about-actions mt-4">
              <a href="/cv.pdf" className="btn-masterpiece-primary" download>
                <span className="btn-bg-slide"></span>
                <span className="btn-content"><i className="fas fa-cloud-download-alt me-2"></i> {t('hero', 'downloadResume') || 'Download Resume'}</span>
              </a>
              <a href="/contact" className="btn-masterpiece-outline">
                <span className="btn-content"><i className="fas fa-paper-plane me-2"></i> {t('hero', 'contactMe') || 'Let\'s Connect'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Navigation */}
        <div className="about-tabs-container reveal-up" style={{ transitionDelay: '0.3s' }}>
            <div className="about-tabs-wrapper">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`about-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <i className={`fas ${tab.icon} me-2`}></i> {tab.label}
                        {activeTab === tab.id && <div className="tab-active-glow"></div>}
                    </button>
                ))}
            </div>
        </div>

        {/* Tab Content Display */}
        <div className="about-content-viewport reveal-up" style={{ transitionDelay: '0.4s' }}>
            <div className={`about-content-layer ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
                
                {/* Tab: About / Mission */}
                {displayTab === 'about' && (
                    <div className="tab-pane-master">
                        <div className="pane-header">
                            <div className="pane-icon"><i className="fas fa-user-astronaut"></i></div>
                            <h3 className="pane-title">Who I Am & My Mission</h3>
                        </div>
                        <div className="pane-body two-col-text">
                            <div className="text-col">
                                <p>My name is <strong>Girma Ashetu Asefa</strong>, and I am currently pursuing a Bachelor of Software Engineering at Jimma Institute of Technology. I enjoy transforming ideas into functional digital products through clean code, modern technologies, and user-centered design.</p>
                            </div>
                            <div className="text-col">
                                <p>I continuously improve my technical skills through academic projects, self-learning, hands-on development, and pursuing industry certifications. My mission is to design secure, scalable, high-performance applications that create meaningful impact and improve people's lives.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab: Education */}
                {displayTab === 'education' && (
                    <div className="tab-pane-master">
                        <div className="pane-header">
                            <div className="pane-icon" style={{color: 'var(--secondary)'}}><i className="fas fa-graduation-cap"></i></div>
                            <h3 className="pane-title">Academic Journey</h3>
                        </div>
                        <div className="pane-body">
                            <TiltCard>
                                <div className="edu-card-master">
                                    <div className="edu-glow"></div>
                                    <div className="edu-icon-shield">
                                        <i className="fas fa-university"></i>
                                    </div>
                                    <div className="edu-details">
                                        <span className="edu-date">2022 — Present</span>
                                        <h4 className="edu-degree">Bachelor of Science in Software Engineering</h4>
                                        <h5 className="edu-uni">Jimma Institute of Technology</h5>
                                        <p className="edu-loc"><i className="fas fa-map-marker-alt me-1"></i> Jimma, Ethiopia</p>
                                        <div className="edu-status-badge">
                                            <span className="status-dot"></span> Undergraduate Student
                                        </div>
                                    </div>
                                </div>
                            </TiltCard>
                        </div>
                    </div>
                )}

                {/* Tab: Interests */}
                {displayTab === 'interests' && (
                    <div className="tab-pane-master">
                        <div className="pane-header">
                            <div className="pane-icon" style={{color: 'var(--accent)'}}><i className="fas fa-microchip"></i></div>
                            <h3 className="pane-title">Technical Focus Areas</h3>
                        </div>
                        <div className="pane-body interests-grid">
                            {interests.map((item, i) => (
                                <TiltCard key={i}>
                                    <div className="interest-pill-master" style={{animationDelay: `${i * 0.05}s`}}>
                                        <div className="interest-icon">
                                            <i className="fas fa-code-branch"></i>
                                        </div>
                                        <span className="interest-text">{item}</span>
                                    </div>
                                </TiltCard>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tab: Strengths */}
                {displayTab === 'strengths' && (
                    <div className="tab-pane-master">
                        <div className="pane-header">
                            <div className="pane-icon" style={{color: 'var(--warning)'}}><i className="fas fa-bolt"></i></div>
                            <h3 className="pane-title">Core Strengths</h3>
                        </div>
                        <div className="pane-body strengths-grid">
                            {strengths.map((s, i) => (
                                <TiltCard key={i}>
                                    <div className="strength-card-master" style={{animationDelay: `${i * 0.08}s`}}>
                                        <div className="strength-bg-glow"></div>
                                        <i className="fas fa-check-circle strength-check"></i>
                                        <h6 className="strength-title">{s}</h6>
                                    </div>
                                </TiltCard>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>

      </div>
    </section>
  );
}

export default About;
