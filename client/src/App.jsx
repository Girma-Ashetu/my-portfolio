import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Certifications from './pages/Certifications';
import Experience from './pages/Experience';
import Achievements from './pages/Achievements';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import useAnimations from './hooks/useAnimations';
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
