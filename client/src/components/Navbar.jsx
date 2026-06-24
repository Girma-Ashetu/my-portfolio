import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const navLinks = [
    { to: '/',        label: t('nav', 'home') },
    { to: '/about',   label: t('nav', 'about') },
    { to: '/projects',label: t('nav', 'projects') },
    { to: '/contact', label: t('nav', 'contact') },
  ];

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark fixed-top glass-navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand fs-3 fw-bold d-flex align-items-center gap-3" to="/" onClick={() => setIsOpen(false)}>
          <div className="nav-avatar-wrapper">
            <img src="/about_profile.jpg" alt="Girma" className="navbar-avatar" />
            <div className="avatar-ring"></div>
          </div>
          <span className="brand-text">Girma<span className="text-primary">.</span></span>
        </Link>
        <button className="navbar-toggler border-0" type="button" onClick={() => setIsOpen(!isOpen)}>
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto fs-6 gap-lg-2 align-items-lg-center">
            {navLinks.map(link => (
              <li key={link.to} className="nav-item">
                <Link
                  className={`nav-link px-3 ${isActive(link.to)}`}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
              <select 
                className="lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
                <option value="om">Oromoo</option>
              </select>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
