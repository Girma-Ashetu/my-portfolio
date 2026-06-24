import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const interests = ['Full-Stack Development', 'Mobile App Development', 'Cloud Computing', 'Cybersecurity', 'Software Architecture', 'Artificial Intelligence', 'Database Engineering', 'DevOps Practices'];
const strengths = ['Problem Solving', 'Critical Thinking', 'Continuous Learning', 'Team Collaboration', 'Leadership', 'Adaptability', 'Communication', 'Analytical Thinking'];

function About() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('about');

  const tabs = [
    { id: 'about', label: t('about', 'tabs')?.academic || 'Academic Focus' },
    { id: 'education', label: 'Education' },
    { id: 'interests', label: t('about', 'tabs')?.technical || 'Technical Goals' },
    { id: 'strengths', label: t('about', 'tabs')?.soft || 'Soft Skills' },
  ];

  return (
    <section className="py-10 mt-5 pt-5 min-vh-100">
      <div className="container py-5">

        {/* Profile Header */}
        <div className="row align-items-center gy-5 mb-5 reveal">
          <div className="col-lg-4 text-center">
            <div className="about-visual position-relative d-inline-block">
              <img
                src="/about_profile.jpg"
                alt="Girma Ashetu Asefa"
                className="img-fluid rounded-4 shadow-lg border border-primary border-opacity-25"
                style={{ maxWidth: '340px', width: '100%' }}
              />
              <div className="about-glow"></div>
            </div>
          </div>
          <div className="col-lg-8">
            <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>{t('about', 'title')}</h6>
            <h2 className="display-4 fw-bold mb-2">Girma Ashetu <span className="text-primary">Asefa</span></h2>
            <h4 className="text-white fw-normal mb-4">{t('about', 'subtitle')}</h4>
            <p className="lead text-muted mb-3" style={{ lineHeight: '1.9' }}>
              {t('about', 'p1')}
            </p>
            <p className="text-muted mb-5" style={{ lineHeight: '1.9' }}>
              {t('about', 'p2')}
            </p>
            <div className="d-flex flex-wrap gap-3">
              <a href="/cv.pdf" className="btn-premium" download>
                <span className="btn-text">{t('hero', 'downloadResume')}</span>
                <span className="btn-icon"><i className="fas fa-download"></i></span>
              </a>
              <a href="/contact" className="btn-outline-premium">{t('hero', 'contactMe')}</a>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="d-flex flex-wrap gap-3 mb-5 reveal-up border-bottom border-secondary pb-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn px-4 py-2 fw-bold text-uppercase ${activeTab === tab.id ? 'btn-primary' : 'btn-outline-secondary text-light'}`}
              style={{ fontSize: '0.85rem', letterSpacing: '1px' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-pane p-5 bento-item-large reveal-up">

          {activeTab === 'about' && (
            <div>
              <h3 className="text-white fw-bold mb-4"><i className="fas fa-user-circle text-primary me-3"></i>Who I Am</h3>
              <p className="text-muted fs-5 mb-4" style={{ lineHeight: '1.9' }}>
                My name is Girma Ashetu Asefa, and I am currently pursuing a Bachelor of Software Engineering at Jimma Institute of Technology. I enjoy transforming ideas into functional digital products through clean code, modern technologies, and user-centered design.
              </p>
              <p className="text-muted fs-5 mb-0" style={{ lineHeight: '1.9' }}>
                I continuously improve my technical skills through academic projects, self-learning, hands-on development, and pursuing industry certifications. My mission is to design secure, scalable, high-performance applications that create meaningful impact and improve people's lives.
              </p>
            </div>
          )}

          {activeTab === 'education' && (
            <div>
              <h3 className="text-white fw-bold mb-5"><i className="fas fa-graduation-cap text-secondary me-3"></i>Education</h3>
              <div className="d-flex gap-4 align-items-start p-4 border border-secondary rounded-4 bg-dark bg-opacity-50">
                <div className="flex-shrink-0 text-center">
                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                    <i className="fas fa-graduation-cap text-white fs-3"></i>
                  </div>
                </div>
                <div>
                  <h4 className="text-white fw-bold mb-1">Bachelor of Science in Software Engineering</h4>
                  <h5 className="text-primary mb-2">Jimma Institute of Technology</h5>
                  <p className="text-muted mb-2">Ethiopia</p>
                  <span className="badge bg-primary px-3 py-2">Current Status: Undergraduate Student</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'interests' && (
            <div>
              <h3 className="text-white fw-bold mb-5"><i className="fas fa-star text-accent me-3"></i>Areas of Interest</h3>
              <div className="row g-3">
                {interests.map((item, i) => (
                  <div key={i} className="col-md-6 col-lg-4">
                    <div className="d-flex align-items-center gap-3 p-3 border border-secondary rounded-4">
                      <i className="fas fa-arrow-right text-primary"></i>
                      <span className="text-white fw-semibold">{item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'strengths' && (
            <div>
              <h3 className="text-white fw-bold mb-5"><i className="fas fa-bolt text-primary me-3"></i>Personal Strengths</h3>
              <div className="row g-3">
                {strengths.map((s, i) => (
                  <div key={i} className="col-md-6 col-lg-3">
                    <div className="glass-pane p-4 text-center bento-item h-100">
                      <i className="fas fa-check-circle text-primary fs-3 mb-3"></i>
                      <h6 className="text-white fw-bold mb-0">{s}</h6>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default About;
