import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import './navbar.css';

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const navLinks = [
    { to: '/', label: t('nav', 'home') || 'Home', icon: 'fa-house' },
    { to: '/about', label: t('nav', 'about') || 'About', icon: 'fa-user' },
    { to: '/projects', label: t('nav', 'projects') || 'Projects', icon: 'fa-folder-open' },
    { to: '/contact', label: t('nav', 'contact') || 'Contact', icon: 'fa-paper-plane' },
  ];


  return (
    <nav className={`master-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="master-nav-container">

        {/* ── Brand ── */}
        <Link className="master-brand" to="/" onClick={() => setIsOpen(false)}>
          <div className="master-avatar-wrap">
            <img src="/about_profile.jpg" alt="Girma" />
            <div className="master-avatar-ring"></div>
            <span className="master-avatar-status"></span>
          </div>
          <div className="master-brand-info">
            <span className="master-brand-text">Girma<span className="master-brand-dot">.</span></span>
            <span className="master-brand-sub">Software Engineer</span>
          </div>
        </Link>

        {/* ── Mobile Toggle ── */}
        <button
          className={`master-menu-toggle ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
          <span className="toggle-bar"></span>
        </button>

        {/* ── Nav Links ── */}
        <div className={`master-nav-links ${isOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              className={`master-nav-link ${isActive(link.to)}`}
              to={link.to}
              onClick={() => setIsOpen(false)}
            >
              <i className={`fas ${link.icon} nav-link-icon`}></i>
              {link.label}
            </Link>
          ))}

          {/* ── Controls Row ── */}
          <div className="master-controls-row">
            {/* Theme Toggle Switch */}
            <button
              className={`theme-toggle-switch ${theme === 'light' ? 'light-active' : ''}`}
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'White Mode' : 'Dark Mode'}`}
              title={theme === 'dark' ? 'Switch to White Mode' : 'Switch to Dark Mode'}
            >
              <span className="theme-toggle-track">
                <span className="theme-toggle-thumb">
                  <i className={`fas ${theme === 'dark' ? 'fa-moon' : 'fa-sun'}`}></i>
                </span>
                <span className="theme-label-dark">
                  <i className="fas fa-moon"></i>
                </span>
                <span className="theme-label-light">
                  <i className="fas fa-sun"></i>
                </span>
              </span>
            </button>

            {/* Language Selector */}
            <div className="master-lang-wrap" title="Select Portfolio Language">
              <i className="fas fa-globe lang-globe-icon"></i>
              <select
                className="master-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                aria-label="Select language"
              >
                <option value="en">EN</option>
                <option value="am">አማ</option>
                <option value="om">ORO</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;
