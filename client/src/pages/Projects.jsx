import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

function Projects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = [
    { key: 'All', label: t('projects','all') },
    { key: 'Web', label: t('projects','web') },
    { key: 'Mobile', label: t('projects','mobile') },
    { key: 'Security', label: t('projects','security') },
    { key: 'Cloud', label: t('projects','cloud') },
  ];



  useEffect(() => {
    axios.get('/api/projects')
      .then(res => {
        setProjects(res.data);
        setFilteredProjects(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => {
        const techs = p.technologies.toLowerCase();
        const desc = p.description.toLowerCase();
        if (activeFilter === 'Web' && (techs.includes('react') || techs.includes('node') || techs.includes('php') || techs.includes('web'))) return true;
        if (activeFilter === 'Mobile' && (techs.includes('mobile') || techs.includes('flutter') || techs.includes('react native') || desc.includes('mobile'))) return true;
        if (activeFilter === 'Security' && (techs.includes('security') || techs.includes('scanner') || desc.includes('vulnerabilit'))) return true;
        if (activeFilter === 'Cloud' && (techs.includes('aws') || techs.includes('cloud') || techs.includes('docker'))) return true;
        return false;
      }));
    }
  }, [activeFilter, projects]);

  useEffect(() => {
    if (!loading && filteredProjects.length > 0) {
      setTimeout(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('active');
              observer.unobserve(entry.target);
            }
          });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.reveal-up').forEach(el => observer.observe(el));
        
        // 3D Tilt Effect
        document.querySelectorAll('.bento-item').forEach(el => {
          el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (-(y - centerY) / centerY) * 8;
            const rotateY = ((x - centerX) / centerX) * 8;
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
          });
          el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
          });
        });
      }, 100);
    }
  }, [filteredProjects, loading]);

  return (
    <section className="py-10 mt-5 pt-5 min-vh-100">
      <div className="container py-5">
        <div className="text-center mb-5 reveal-up">
          <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>{t('projects','title')}</h6>
          <h2 className="display-4 fw-bold mb-4">{t('projects','masterpiece')}</h2>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '700px', lineHeight: '1.9' }}>
            {t('projects','desc')}
          </p>
        </div>

        {/* Filters */}
        <div className="d-flex flex-wrap justify-content-center gap-3 mb-5 reveal-up">
          {filters.map(f => (
            <button 
              key={f.key} 
              onClick={() => setActiveFilter(f.key)}
              className={`btn px-4 py-2 fw-bold text-uppercase ${activeFilter === f.key ? 'btn-primary shadow-lg' : 'btn-outline-secondary text-light'}`}
              style={{ fontSize: '0.85rem', letterSpacing: '1px', borderRadius: '100px' }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-primary py-5">
            <i className="fas fa-circle-notch fa-spin fa-3x" style={{ filter: 'drop-shadow(0 0 15px rgba(94, 234, 212, 0.5))' }}></i>
          </div>
        ) : (
          <div className="row g-4">
            {filteredProjects.map((project, idx) => (
              <div key={project.id} className="col-lg-4 col-md-6 reveal-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                <div className="glass-pane h-100 overflow-hidden bento-item d-flex flex-column" style={{ borderRadius: '24px' }}>
                  <div className="position-relative" style={{ height: '220px', overflow: 'hidden' }}>
                    <div className="img-overlay-glow"></div>
                    <img 
                      src={`/${project.image_url}`} 
                      alt={project.title} 
                      className="w-100 h-100 object-fit-cover innovation-img" 
                      onError={(e) => { e.target.src = '/project_ai.png' }} 
                    />
                    <div className="position-absolute top-0 end-0 p-3 z-3">
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-light rounded-circle shadow-lg" style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fas fa-external-link-alt text-dark"></i>
                      </a>
                    </div>
                  </div>
                  <div className="p-4 d-flex flex-column flex-grow-1">
                    <h4 className="fw-bold mb-3 text-white">{project.title}</h4>
                    <p className="text-muted small mb-4 flex-grow-1" style={{ lineHeight: '1.8' }}>{project.description}</p>
                    <div className="mb-4 d-flex flex-wrap gap-2">
                      {project.technologies.split(',').map((tech, i) => (
                        <span key={i} className="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1" style={{ fontSize: '0.7rem' }}>
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-outline-premium w-100 text-center mt-auto" style={{ borderRadius: '12px' }}>
                      <i className="fab fa-github me-2"></i> {t('projects','source')}
                    </a>
                  </div>
                </div>
              </div>
            ))}
            
            {!loading && filteredProjects.length === 0 && (
              <div className="col-12 text-center py-5 reveal-up">
                <i className="fas fa-folder-open text-muted fa-4x mb-4 opacity-50"></i>
                <h4 className="text-white">{t('projects','noProj')}</h4>
                <p className="text-muted">{t('projects','all')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
