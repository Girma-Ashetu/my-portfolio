import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
export default function Navbar() {
 const [open, setOpen] = useState(false);
 const menuButton = useRef(null);
 const header = useRef(null);
 const { pathname } = useLocation();
 const { theme, toggleTheme } = useTheme();
 useEffect(() => { setOpen(false); }, [pathname]);
 useEffect(() => {
   if (!open) return;
   const dismiss = event => { if (!header.current?.contains(event.target)) setOpen(false); };
   const resize = () => { if (window.matchMedia('(min-width: 701px)').matches) setOpen(false); };
   document.addEventListener('pointerdown', dismiss);
   window.addEventListener('resize', resize);
   return () => { document.removeEventListener('pointerdown', dismiss); window.removeEventListener('resize', resize); };
 }, [open]);
 function closeWithEscape(event) {
   if (event.key === 'Escape' && open) {
     setOpen(false);
     menuButton.current?.focus();
   }
 }
 return <header ref={header} className="studio-nav" onKeyDown={closeWithEscape} onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}><div className="studio-container studio-nav-inner"><Link className="studio-logo" to="/" aria-label="Girma Ashetu home"><img className="studio-brand-mark" src="/ga-logo.png" alt="" width="44" height="44" /></Link><button type="button" ref={menuButton} className="studio-menu-button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button><nav id="primary-navigation" className={open ? 'is-open' : ''} aria-label="Main navigation">{[['/', 'Home'], ['/about', 'About'], ['/projects', 'Work'], ['/skills', 'Skills'], ['/contact', 'Contact']].map(([to, label]) => <NavLink key={to} to={to} end onClick={() => setOpen(false)}>{label}</NavLink>)}</nav><button className="studio-theme-button" onClick={toggleTheme} aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme'}>{theme === 'dark' ? 'Light' : 'Dark'}</button></div></header>;
}
