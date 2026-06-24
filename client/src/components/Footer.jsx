import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Footer() {
  const { t } = useLanguage();

  const navLinks = [
    { to: '/',         label: t('nav','home') },
    { to: '/about',    label: t('nav','about') },
    { to: '/projects', label: t('nav','projects') },
    { to: '/contact',  label: t('nav','contact') },
  ];

  return (
    <footer className="footer-premium py-5 mt-5 glass-pane" style={{ borderRadius: '40px 40px 0 0', borderBottom: 'none' }}>
      <div className="container position-relative">
        <div className="row g-5 mb-5">
          <div className="col-lg-4">
            <div className="footer-brand mb-3">Girma<span className="text-primary">.</span></div>
            <p className="text-muted" style={{ lineHeight: '1.9' }}>
              {t('about','subtitle')} | Full-Stack Web Developer | Mobile App Developer | Cybersecurity & Cloud Computing Enthusiast
            </p>
            <p className="text-muted small mt-3">{t('footer','builtWith')}</p>
            <div className="social-links-footer mt-4">
              <a href="https://github.com/Girma-Ashetu" target="_blank" rel="noopener noreferrer" title="GitHub" className="glass-pane"><i className="fab fa-github"></i></a>
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="glass-pane"><i className="fab fa-linkedin-in"></i></a>
              <a href="https://t.me/Progirma35" target="_blank" rel="noopener noreferrer" title="Telegram" className="glass-pane"><i className="fab fa-telegram-plane"></i></a>
              <a href="mailto:girme405@gmail.com" title="Email" className="glass-pane"><i className="fas fa-envelope"></i></a>
            </div>
          </div>
          <div className="col-lg-4">
            <h6 className="text-white fw-bold uppercase tracking-widest mb-4" style={{ letterSpacing: '3px' }}>{t('nav','home')} | {t('nav','about')}</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-muted text-decoration-none footer-nav-link">
                    <i className="fas fa-chevron-right text-primary me-2 small"></i>{link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-lg-4">
            <h6 className="text-white fw-bold uppercase tracking-widest mb-4" style={{ letterSpacing: '3px' }}>{t('contact','info')}</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 text-muted">
              <li><i className="fas fa-envelope text-primary me-2"></i>girme405@gmail.com</li>
              <li><i className="fab fa-github text-primary me-2"></i>github.com/Girma-Ashetu</li>
              <li><i className="fab fa-telegram-plane text-primary me-2"></i>@Progirma35</li>
              <li><i className="fas fa-phone text-primary me-2"></i>+251 915 387 500</li>
              <li><i className="fas fa-map-marker-alt text-primary me-2"></i>Jimma, Ethiopia</li>
            </ul>
          </div>
        </div>
        <div className="footer-divider mb-4"></div>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <p className="footer-copyright mb-0 text-muted">&copy; 2026 Girma Ashetu Asefa. {t('footer','rights')}</p>
          <Link to="/admin" className="footer-admin-link opacity-25">ADMIN</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
