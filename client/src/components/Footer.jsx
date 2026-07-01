import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import './footer.css';

function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { to: '/',         label: t('nav','home') || 'Home' },
    { to: '/about',    label: t('nav','about') || 'About' },
    { to: '/projects', label: t('nav','projects') || 'Projects' },
    { to: '/contact',  label: t('nav','contact') || 'Contact' },
  ];

  return (
    <footer className="master-footer">
      {/* Top glowing divider */}
      <div className="footer-top-divider"></div>
      
      {/* Background Aurora */}
      <div className="footer-aurora"></div>
      <div className="footer-aurora footer-aurora-2"></div>

      <div className="container relative-z">
        {/* Connection Marquee */}
        <div className="footer-marquee-wrap mb-5">
            <div className="footer-marquee">
                <div className="footer-marquee-track">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="footer-marquee-text">
                            LET'S WORK TOGETHER <span className="marquee-dot"></span>
                        </span>
                    ))}
                </div>
            </div>
        </div>

        <div className="master-footer-grid mb-5">
          {/* Column 1: Brand & Bio */}
          <div className="footer-glass-panel">
            <Link to="/" className="footer-brand mb-4">
              <div className="footer-avatar-wrap">
                  <img src="/about_profile.jpg" alt="Girma" />
              </div>
              <span className="brand-text">Girma<span className="text-primary">.</span></span>
            </Link>
            <p className="footer-bio">
              {t('about','subtitle') || 'Software Engineering Student'} | Full-Stack Web Developer | Mobile App Developer | Cybersecurity Enthusiast
            </p>
            <p className="footer-built mt-3">
              <i className="fas fa-code" style={{color: 'var(--primary)'}}></i> {t('footer','builtWith') || 'Built with React & Vite'}
            </p>
            
            <div className="footer-social-links mt-4">
              <a href="https://github.com/Girma-Ashetu" target="_blank" rel="noopener noreferrer" title="GitHub" className="social-pill">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="social-pill">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://t.me/Progirma35" target="_blank" rel="noopener noreferrer" title="Telegram Personal" className="social-pill">
                <i className="fab fa-telegram-plane"></i>
              </a>
              <a href="https://t.me/soft_wareENG" target="_blank" rel="noopener noreferrer" title="Telegram Channel" className="social-pill">
                <i className="fas fa-broadcast-tower"></i>
              </a>
              <a href="mailto:girme405@gmail.com" title="Email" className="social-pill">
                <i className="fas fa-envelope"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-glass-panel">
            <h6 className="footer-heading">{t('nav','home') || 'Explore'}</h6>
            <ul className="footer-nav-list">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="footer-nav-link">
                    <span className="link-arrow">›</span> {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-glass-panel">
            <h6 className="footer-heading">{t('contact','info') || 'Contact'}</h6>
            <ul className="footer-contact-list">
              <li>
                  <div className="contact-icon"><i className="fas fa-envelope"></i></div>
                  <a href="mailto:girme405@gmail.com" className="contact-text">girme405@gmail.com</a>
              </li>
              <li>
                  <div className="contact-icon"><i className="fab fa-telegram-plane"></i></div>
                  <a href="https://t.me/Progirma35" target="_blank" rel="noopener noreferrer" className="contact-text">@Progirma35</a>
              </li>
              <li>
                  <div className="contact-icon"><i className="fas fa-broadcast-tower"></i></div>
                  <a href="https://t.me/soft_wareENG" target="_blank" rel="noopener noreferrer" className="contact-text">t.me/soft_wareENG</a>
              </li>
              <li>
                  <div className="contact-icon"><i className="fas fa-phone"></i></div>
                  <span className="contact-text">+251 915 387 500</span>
              </li>
              <li>
                  <div className="contact-icon"><i className="fas fa-map-marker-alt"></i></div>
                  <span className="contact-text">Jimma, Ethiopia</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="copyright-text mb-0">&copy; {new Date().getFullYear()} Girma Ashetu Asefa. {t('footer','rights') || 'All rights reserved.'}</p>
          <Link to="/admin" className="footer-admin-badge">
            <i className="fas fa-lock me-2" style={{fontSize: '0.75rem'}}></i>ADMIN
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
