import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './footer.css';

function Footer() {
  const { t } = useLanguage();
  const [copiedItem, setCopiedItem] = useState(null);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    setTimeout(() => setCopiedItem(null), 2200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { to: '/', label: t('nav', 'home') || 'Home' },
    { to: '/about', label: t('nav', 'about') || 'About' },
    { to: '/projects', label: t('nav', 'projects') || 'Projects' },
    { to: '/contact', label: t('nav', 'contact') || 'Contact' },
  ];

  return (
    <footer className="master-footer" aria-label="Site Footer">
      {/* Top glowing animated border */}
      <div className="footer-top-divider"></div>

      {/* Dynamic Background Auroras */}
      <div className="footer-aurora footer-aurora-1"></div>
      <div className="footer-aurora footer-aurora-2"></div>

      <div className="container relative-z">
        {/* Banner Marquee Section */}
        <div className="footer-marquee-wrap mb-5">
          <div className="footer-marquee">
            <div className="footer-marquee-track">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="footer-marquee-text">
                  {t('footer', 'letsWork') || "LET'S WORK TOGETHER"}
                  <span className="marquee-dot"></span>
                </span>
              ))}
            </div>
          </div>
          <Link to="/contact" className="footer-marquee-cta">
            <span>{t('hero', 'contactMe') || 'Contact Me'}</span>
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>

        {/* 3-Column Glassmorphism Main Grid */}
        <div className="master-footer-grid mb-5">
          {/* Column 1: Brand, Status & Bio */}
          <div className="footer-glass-panel footer-brand-panel">
            <div className="footer-brand-header mb-3">
              <Link to="/" className="footer-brand">
                <div className="footer-avatar-wrap">
                  <img src="/about_profile.jpg" alt="Girma Ashetu" />
                </div>
                <div className="footer-brand-title">
                  <span className="brand-text">Girma<span className="text-primary">.</span></span>
                  <span className="brand-role">Software Engineer</span>
                </div>
              </Link>
            </div>

            {/* Live Availability Badge */}
            <div className="footer-status-pill mb-3">
              <span className="status-ping">
                <span className="ping-wave"></span>
                <span className="ping-dot"></span>
              </span>
              <span className="status-text">{t('footer', 'status') || 'Available for Freelance & Full-Time'}</span>
            </div>

            <p className="footer-bio">
              Software Engineering Student at JiT | Full-Stack Web Developer | Mobile App Developer | Cybersecurity Enthusiast
            </p>

            {/* Tech Stack Badges */}
            <div className="footer-tech-stack mt-3 mb-4">
              <span className="tech-tag"><i className="fab fa-react" style={{ color: '#61dafb' }}></i> React 19</span>
              <span className="tech-tag"><i className="fas fa-bolt" style={{ color: '#ffb703' }}></i> Vite</span>
              <span className="tech-tag"><i className="fab fa-node-js" style={{ color: '#68a063' }}></i> Node.js</span>
              <span className="tech-tag"><i className="fab fa-css3-alt" style={{ color: '#38bdf8' }}></i> Modern CSS</span>
            </div>

            {/* Social Media Pills */}
            <div className="footer-social-links">
              <a href="https://github.com/Girma-Ashetu" target="_blank" rel="noopener noreferrer" title="GitHub Profile" className="social-pill github">
                <i className="fab fa-github"></i>
                <span className="pill-tooltip">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/girma-ashetu-a146b9422" target="_blank" rel="noopener noreferrer" title="LinkedIn Profile" className="social-pill linkedin">
                <i className="fab fa-linkedin-in"></i>
                <span className="pill-tooltip">LinkedIn</span>
              </a>
              <a href="https://t.me/Progirma35" target="_blank" rel="noopener noreferrer" title="Telegram Personal" className="social-pill telegram">
                <i className="fab fa-telegram-plane"></i>
                <span className="pill-tooltip">Telegram</span>
              </a>
              <a href="https://t.me/soft_wareENG" target="_blank" rel="noopener noreferrer" title="Telegram Channel" className="social-pill channel">
                <i className="fas fa-broadcast-tower"></i>
                <span className="pill-tooltip">Channel</span>
              </a>
              <a href="mailto:girme405@gmail.com" title="Send Email" className="social-pill email">
                <i className="fas fa-envelope"></i>
                <span className="pill-tooltip">Email</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-glass-panel footer-nav-panel">
            <h6 className="footer-heading">{t('footer', 'quickLinks') || 'Quick Links'}</h6>
            <ul className="footer-nav-list">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-nav-link">
                    <span className="link-icon"><i className="fas fa-chevron-right"></i></span>
                    <span className="link-label">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Secondary CTA inside Quick Links panel */}
            <div className="footer-sub-card mt-4">
              <i className="fas fa-code-branch text-primary me-2"></i>
              <span>Looking for collaborators?</span>
              <Link to="/contact" className="footer-mini-link mt-2">Let's Connect &rarr;</Link>
            </div>
          </div>

          {/* Column 3: Contact & Location Information */}
          <div className="footer-glass-panel footer-contact-panel">
            <h6 className="footer-heading">{t('footer', 'contactInfo') || 'Contact Information'}</h6>
            <ul className="footer-contact-list">
              <li>
                <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                <div className="contact-details">
                  <span className="contact-label">Email</span>
                  <div className="contact-value-row">
                    <a href="mailto:girme405@gmail.com" className="contact-text">girme405@gmail.com</a>
                    <button
                      type="button"
                      className={`copy-btn ${copiedItem === 'email' ? 'copied' : ''}`}
                      onClick={() => handleCopy('girme405@gmail.com', 'email')}
                      title="Copy Email"
                    >
                      <i className={copiedItem === 'email' ? 'fas fa-check' : 'far fa-copy'}></i>
                    </button>
                  </div>
                </div>
              </li>

              <li>
                <div className="contact-icon"><i className="fab fa-telegram-plane"></i></div>
                <div className="contact-details">
                  <span className="contact-label">Telegram</span>
                  <a href="https://t.me/Progirma35" target="_blank" rel="noopener noreferrer" className="contact-text">@Progirma35</a>
                </div>
              </li>

              <li>
                <div className="contact-icon"><i className="fas fa-broadcast-tower"></i></div>
                <div className="contact-details">
                  <span className="contact-label">Channel</span>
                  <a href="https://t.me/soft_wareENG" target="_blank" rel="noopener noreferrer" className="contact-text">t.me/soft_wareENG</a>
                </div>
              </li>

              <li>
                <div className="contact-icon"><i className="fas fa-phone"></i></div>
                <div className="contact-details">
                  <span className="contact-label">Phone</span>
                  <div className="contact-value-row">
                    <a href="tel:+251915387500" className="contact-text">+251 915 387 500</a>
                    <button
                      type="button"
                      className={`copy-btn ${copiedItem === 'phone' ? 'copied' : ''}`}
                      onClick={() => handleCopy('+251915387500', 'phone')}
                      title="Copy Phone"
                    >
                      <i className={copiedItem === 'phone' ? 'fas fa-check' : 'far fa-copy'}></i>
                    </button>
                  </div>
                </div>
              </li>

              <li>
                <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                <div className="contact-details">
                  <span className="contact-label">Location</span>
                  <span className="contact-text">{t('footer', 'location') || 'Jimma, Ethiopia'} 🇪🇹 (GMT+3)</span>
                </div>
              </li>
            </ul>

            {copiedItem && (
              <div className="copy-toast-inline">
                <i className="fas fa-check-circle me-1"></i> {t('footer', 'copied') || 'Copied to clipboard!'}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar & Scroll To Top */}
        <div className="footer-bottom-bar">
          <div className="copyright-group">
            <p className="copyright-text mb-0">
              &copy; {new Date().getFullYear()} <strong className="text-light-glow">Girma Ashetu Asefa</strong>. {t('footer', 'rights') || 'All rights reserved.'}
            </p>
          </div>

          <div className="footer-bottom-actions">
            <Link to="/admin" className="footer-admin-badge" title="Admin Portal Access">
              <i className="fas fa-shield-alt me-2" style={{ fontSize: '0.75rem' }}></i>ADMIN
            </Link>

            <button
              type="button"
              className="back-to-top-btn"
              onClick={scrollToTop}
              aria-label="Scroll to top"
              title={t('footer', 'backToTop') || 'Back to Top'}
            >
              <i className="fas fa-arrow-up"></i>
              <span className="top-text">{t('footer', 'backToTop') || 'Top'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
