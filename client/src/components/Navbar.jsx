import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './navbar.css';

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const navLinks = [
    { to: '/',        label: t('nav', 'home') || 'Home' },
    { to: '/about',   label: t('nav', 'about') || 'About' },
    { to: '/projects',label: t('nav', 'projects') || 'Projects' },
    { to: '/contact', label: t('nav', 'contact') || 'Contact' },
  ];

  return (
    <nav className={`master-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="master-nav-container">
        <Link className="master-brand" to="/" onClick={() => setIsOpen(false)}>
          <div className="master-avatar-wrap">
            <img src="/about_profile.jpg" alt="Girma" />
            <div className="master-avatar-ring"></div>
          </div>
          <span className="master-brand-text">Girma<span className="master-brand-dot">.</span></span>
        </Link>
        
        <button className="master-menu-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle navigation">
          <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <div className={`master-nav-links ${isOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              className={`master-nav-link ${isActive(link.to)}`}
              to={link.to}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          
          <div className="master-lang-wrap">
            <select 
                className="master-lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
            >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
                <option value="om">Oromoo</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
