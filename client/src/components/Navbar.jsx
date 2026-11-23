import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
export default function Navbar() {
 const [open, setOpen] = useState(false);
 const menuButton = useRef(null);
 const { pathname } = useLocation();
 const { theme, toggleTheme } = useTheme();
 useEffect(() => { setOpen(false); }, [pathname]);
 function closeWithEscape(event) {
   if (event.key === 'Escape' && open) {
     setOpen(false);
     menuButton.current?.focus();
   }
 }
 return <header className="studio-nav" onKeyDown={closeWithEscape}><div className="studio-container studio-nav-inner"><Link className="studio-logo" to="/" aria-label="Girma Ashetu home"><img className="studio-brand-mark" src="/ga-logo.png" alt="" width="44" height="44" /></Link><button ref={menuButton} className="studio-menu-button" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button><nav id="primary-navigation" className={open ? 'is-open' : ''} aria-label="Main navigation">{[['/', 'Home'], ['/about', 'About'], ['/projects', 'Work'], ['/skills', 'Skills'], ['/contact', 'Contact']].map(([to, label]) => <NavLink key={to} to={to} end onClick={() => setOpen(false)}>{label}</NavLink>)}</nav><button className="studio-theme-button" onClick={toggleTheme} aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme'}>{theme === 'dark' ? 'Light' : 'Dark'}</button></div></header>;
}
