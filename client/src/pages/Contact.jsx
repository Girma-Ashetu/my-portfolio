import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import './contact.css';

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

    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
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

function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: 'loading', text: 'Transmitting signal...' });

    try {
      await axios.post('/api/messages', formData);
      setStatus({ type: 'success', text: 'Message successfully delivered. Girma will respond shortly.' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', text: 'Transmission failed. Please try again or use direct email.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    { icon: 'fa-envelope',         label: 'Email',     value: 'girme405@gmail.com',         href: 'mailto:girme405@gmail.com',          color: 'primary'   },
    { icon: 'fab fa-github',       label: 'GitHub',    value: 'github.com/Girma-Ashetu',    href: 'https://github.com/Girma-Ashetu',    color: 'secondary' },
    { icon: 'fab fa-linkedin-in',  label: 'LinkedIn',  value: 'linkedin.com/in/girmaasefa', href: 'https://linkedin.com/',              color: 'info'      },
    { icon: 'fab fa-telegram-plane',label:'Telegram',  value: '@Progirma35',                href: 'https://t.me/Progirma35',            color: 'primary'   },
    { icon: 'fa-phone',            label: 'Phone',     value: '+251 915 387 500',            href: 'tel:+251915387500',                  color: 'accent'    },
    { icon: 'fa-map-marker-alt',   label: 'Location',  value: 'Jimma, Ethiopia',             href: null,                                color: 'secondary' },
  ];

  return (
    <section className="contact-master-section">
      {/* Background Animated Elements */}
      <div className="contact-bg-aurora">
          <div className="contact-aurora-1"></div>
          <div className="contact-aurora-2"></div>
      </div>
      <div className="contact-grid-overlay"></div>

      <div className="container relative-z">
        {/* Header */}
        <div className="contact-header reveal">
          <span className="contact-chip">{t('contact', 'title') || 'Initiate Connection'}</span>
          <h2 className="contact-title">
            Let's build the <span className="text-gradient">Future</span>
          </h2>
          <p className="contact-sub">
            {t('contact', 'desc') || 'Whether you have a groundbreaking idea, need technical expertise, or just want to say hi, my inbox is always open.'}
          </p>
        </div>

        {/* AI Assistant Banner Masterpiece */}
        <div className="ai-banner-master reveal-up">
          <div className="ai-banner-glow"></div>
          <div className="ai-banner-content">
            <div className="ai-core-icon">
              <div className="ai-core-ring"></div>
              <i className="fas fa-robot" />
            </div>
            <div className="ai-banner-text">
              <h5><span className="text-gradient">GAIA Interface Active</span></h5>
              <p>
                Need immediate answers about my skills or availability? Initialize the 
                <strong> GAIA AI Chat</strong> via the floating beacon in the bottom-right corner for instant interaction.
              </p>
            </div>
            <div className="ai-status-badge">
              <span className="pulse-dot"></span> Online
            </div>
          </div>
        </div>

        <div className="contact-grid">
          {/* Left: Contact Info Bento */}
          <div className="contact-info-col reveal-up" style={{ transitionDelay: '0.1s' }}>
            <TiltCard>
                <div className="contact-info-panel">
                    <div className="panel-bg-glow"></div>
                    <h3 className="panel-title">{t('contact', 'info') || 'Direct Comm Links'}</h3>
                    <div className="contact-items-list">
                        {contactItems.map((item, i) => (
                        <div key={i} className="contact-item-row" style={{ '--item-color': `var(--${item.color})`, animationDelay: `${i * 0.1}s` }}>
                            <div className="c-item-icon">
                                <i className={item.icon.startsWith('fab') ? item.icon : `fas ${item.icon}`} />
                            </div>
                            <div className="c-item-details">
                                <span className="c-item-label">{item.label}</span>
                                {item.href ? (
                                    <a href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="c-item-value c-item-link">
                                        {item.value}
                                    </a>
                                ) : (
                                    <span className="c-item-value">{item.value}</span>
                                )}
                            </div>
                        </div>
                        ))}
                    </div>
                </div>
            </TiltCard>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-col reveal-up" style={{ transitionDelay: '0.2s' }}>
            <TiltCard>
                <div className="contact-form-panel">
                    <h3 className="panel-title mb-4">
                        <i className="fas fa-satellite-dish me-2 text-primary" /> {t('contact', 'sendMsg') || 'Transmit Signal'}
                    </h3>

                    {status.text && (
                        <div className={`form-status-alert status-${status.type}`}>
                            <div className="status-icon">
                                <i className={`fas ${status.type === 'success' ? 'fa-check' : status.type === 'error' ? 'fa-exclamation' : 'fa-circle-notch fa-spin'}`} />
                            </div>
                            <div className="status-text">{status.text}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="master-form">
                        <div className="form-group-row">
                            <div className="input-master-wrapper">
                                <input
                                    type="text"
                                    className="input-master"
                                    id="contact-name"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                                <label htmlFor="contact-name" className={formData.name ? 'active' : ''}>
                                    {t('contact', 'name') || 'Your Name'}
                                </label>
                                <div className="input-border-glow"></div>
                            </div>
                            <div className="input-master-wrapper">
                                <input
                                    type="email"
                                    className="input-master"
                                    id="contact-email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                                <label htmlFor="contact-email" className={formData.email ? 'active' : ''}>
                                    {t('contact', 'email') || 'Your Email'}
                                </label>
                                <div className="input-border-glow"></div>
                            </div>
                        </div>

                        <div className="input-master-wrapper mt-4">
                            <textarea
                                className="input-master textarea-master"
                                id="contact-message"
                                rows="6"
                                required
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                            />
                            <label htmlFor="contact-message" className={formData.message ? 'active' : ''}>
                                {t('contact', 'payload') || 'Signal Payload'}
                            </label>
                            <div className="input-border-glow"></div>
                        </div>

                        <div className="form-actions mt-4">
                            <button
                                type="submit"
                                className="btn-masterpiece-primary w-100"
                                disabled={isSubmitting}
                            >
                                <span className="btn-bg-slide"></span>
                                <span className="btn-content" style={{ justifyContent: 'center' }}>
                                    {isSubmitting ? (
                                        <><i className="fas fa-circle-notch fa-spin me-2" /> Processing...</>
                                    ) : (
                                        <><i className="fas fa-paper-plane me-2" /> {t('contact', 'transmit') || 'Engage Transmission'}</>
                                    )}
                                </span>
                            </button>
                            <div className="form-secure-note">
                                <i className="fas fa-shield-alt me-1" /> End-to-end encrypted channel. Your data is secure.
                            </div>
                        </div>
                    </form>
                </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
