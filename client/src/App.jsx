import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';
const Projects = lazy(() => import('./pages/Projects'));
const LegacyLayout = lazy(() => import('./components/LegacyLayout'));
const About = lazy(() => import('./pages/About'));
const Skills = lazy(() => import('./pages/Skills'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Experience = lazy(() => import('./pages/Experience'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));
function Content() {
 const { pathname } = useLocation();
 useEffect(() => { window.scrollTo(0, 0); const titles = { '/': 'Software Developer', '/about': 'About', '/projects': 'Selected Work', '/skills': 'Skills & Learning', '/contact': 'Contact', '/admin': 'Portfolio Studio' }; document.title = (titles[pathname] || 'Portfolio') + ' | Girma Ashetu Asefa'; }, [pathname]);
 return <><a className="studio-skip" href="#main-content">Skip to content</a><Navbar /><main id="main-content"><Suspense fallback={<div className="studio-loading" role="status">Loading page…</div>}><Routes>
 <Route path="/" element={<Home />} /><Route path="/projects" element={<Projects />} />
 <Route path="/about" element={<About />} /><Route path="/skills" element={<Skills />} /><Route path="/contact" element={<Contact />} /><Route path="/admin" element={<Admin />} /><Route element={<LegacyLayout />}><Route path="/certifications" element={<Certifications />} /><Route path="/experience" element={<Experience />} /><Route path="/achievements" element={<Achievements />} /></Route>
 <Route path="*" element={<section className="studio-container studio-project-page"><h1>Page not found</h1><Link to="/">Return home</Link></section>} />
 </Routes></Suspense></main><Footer /></>;
}
export default function App() { return <ThemeProvider><BrowserRouter><Content /></BrowserRouter></ThemeProvider>; }
