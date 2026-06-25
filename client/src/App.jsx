import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import useAnimations from './hooks/useAnimations';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Skills = lazy(() => import('./pages/Skills'));
const Projects = lazy(() => import('./pages/Projects'));
const Certifications = lazy(() => import('./pages/Certifications'));
const Experience = lazy(() => import('./pages/Experience'));
const Achievements = lazy(() => import('./pages/Achievements'));
const Contact = lazy(() => import('./pages/Contact'));
const Admin = lazy(() => import('./pages/Admin'));

const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh', color: 'var(--primary)' }}>
    <div className="spinner-border border-2" role="status" style={{ width: '3rem', height: '3rem' }}>
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);
import { LanguageProvider } from './context/LanguageContext';
import AiChatbot from './components/AiChatbot';

// Scroll-to-top + progress bar wrapper
function ScrollFeatures() {
  const [showTop, setShowTop] = useState(false);
  const [progress, setProgress] = useState(0);
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
      setShowTop(scrollTop > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Reading progress bar */}
      <div className="reading-progress" style={{ width: `${progress}%` }} />
      {/* Back-to-top button */}
      <button
        className={`scroll-top-btn ${showTop ? 'visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        <i className="fas fa-chevron-up"></i>
      </button>
    </>
  );
}

function AppContent() {
  useAnimations();
  
  React.useEffect(() => {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    
    if (cursorDot && cursorCircle) {
      window.addEventListener('mousemove', (e) => {
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
        
        setTimeout(() => {
          cursorCircle.style.left = e.clientX + 'px';
          cursorCircle.style.top = e.clientY + 'px';
        }, 50);
      });

      document.querySelectorAll('a, button, .bento-item').forEach(el => {
        el.addEventListener('mouseenter', () => {
          document.querySelector('.custom-cursor')?.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
          document.querySelector('.custom-cursor')?.classList.remove('active');
        });
      });
    }
  }, []);

  return (
    <div className="bg-deep min-vh-100 d-flex flex-column position-relative z-0">
      <div className="custom-cursor d-none d-lg-block">
        <div className="cursor-dot"></div>
        <div className="cursor-circle"></div>
      </div>
      
      <div className="universe-bg">
        <div className="nebula-layer"></div>
        <div className="star-field"></div>
        <div className="aurora-glow"></div>
        <div className="grid-mesh"></div>
      </div>
      
      <ScrollFeatures />
      <Navbar />
      <main className="flex-grow-1 position-relative z-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/certifications" element={<Certifications />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <AiChatbot />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;
