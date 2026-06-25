import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import './projects.css';

/* ── Tilt Card Wrapper ── */
function TiltCard({ children, className, style, onClick }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrapper ${className || ''}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

const mockProjects = [
    {
        id: 1,
        title: "Bank Management System",
        description: "An enterprise-grade banking application built for Ethiopian currency (Birr). Features robust account management, full admin dashboard, and status transitions.",
        long_description: "Developed a comprehensive core banking platform featuring secure transaction processing, real-time account status transitions (Active/Suspended/Frozen/Closed), and an intuitive administrative dashboard. The system incorporates strict validation for Ethiopian banking standards and utilizes a premium dark-mode aesthetic for a modern user experience.",
        technologies: "Java, MySQL, Swing, JDBC",
        link: "https://github.com/Girma-Ashetu",
        image_url: "bank.png"
    },
    {
        id: 2,
        title: "Advanced AI Portfolio Platform",
        description: "A breathtaking, trilingual digital portfolio equipped with GAIA—a Gemini-powered AI assistant, 3D tilt interactions, and full glassmorphism UI.",
        long_description: "A world-class digital portfolio engineered to showcase technical excellence. It integrates Google's Gemini AI to power 'GAIA', a responsive virtual assistant. Features include multilingual support (English, Amharic, Afan Oromo), high-performance CSS grid layouts, and cutting-edge 3D micro-animations.",
        technologies: "React, Node.js, Express, AI",
        link: "https://github.com/Girma-Ashetu",
        image_url: "portfolio.png"
    },
    {
        id: 3,
        title: "Course Management System (CSMS)",
        description: "A comprehensive academic platform handling student enrollment, grade management, and secure role-based access for Jimma Institute of Technology.",
        long_description: "A tailored academic portal designed to streamline university operations. It includes modules for student course registration, secure grading systems for faculty, and robust role-based access control (RBAC). The platform dramatically improved administrative efficiency at Jimma Institute of Technology.",
        technologies: "PHP, MySQL, Web",
        link: "https://github.com/Girma-Ashetu",
        image_url: "csms.png"
    },
    {
        id: 4,
        title: "Cybersecurity Vulnerability Scanner",
        description: "A robust security tool implementing OWASP Top 10 guidelines to scan, detect, and report vulnerabilities in web applications.",
        long_description: "An automated security analysis tool that actively probes web applications for common vulnerabilities such as SQL Injection, XSS, and misconfigured headers. It generates comprehensive HTML reports detailing the risk level and remediation steps, adhering strictly to OWASP guidelines.",
        technologies: "Python, Security, React",
        link: "https://github.com/Girma-Ashetu",
        image_url: "cyber.png"
    },
    {
        id: 5,
        title: "Cross-Platform E-Commerce Mobile App",
        description: "A high-performance mobile marketplace built with Flutter and Firebase, featuring real-time state management and seamless UI/UX.",
        long_description: "A dynamic mobile application built for both iOS and Android using a single codebase. It leverages Firebase for real-time data synchronization, secure user authentication, and seamless payment gateway integration. The app delivers a fluid, native-like experience with 60fps animations.",
        technologies: "Flutter, Firebase, Mobile",
        link: "https://github.com/Girma-Ashetu",
        image_url: "ecommerce.png"
    },
    {
        id: 6,
        title: "Cloud Infrastructure Automation",
        description: "A DevOps pipeline built on AWS to automate deployments, scaling, and monitoring using Docker and Github Actions.",
        long_description: "Designed and implemented a fully automated CI/CD pipeline. The infrastructure utilizes Docker for containerization and AWS ECS for orchestration. It includes automated testing via GitHub Actions and integrates robust monitoring and alerting mechanisms, ensuring zero-downtime deployments.",
        technologies: "AWS, Docker, Cloud",
        link: "https://github.com/Girma-Ashetu",
        image_url: "cloud.png"
    }
];

function Projects() {
  const { t } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // Modal State

  const filters = [
    { key: 'All', label: t('projects','all') || 'All Works', icon: 'fa-layer-group' },
    { key: 'Web', label: t('projects','web') || 'Web Dev', icon: 'fa-globe' },
    { key: 'Mobile', label: t('projects','mobile') || 'Mobile', icon: 'fa-mobile-alt' },
    { key: 'Security', label: t('projects','security') || 'Security', icon: 'fa-shield-alt' },
    { key: 'Cloud', label: t('projects','cloud') || 'Cloud', icon: 'fa-cloud' },
  ];

  useEffect(() => {
    axios.get('/api/projects')
      .then(res => {
        if (res.data && res.data.length > 0) {
            setProjects(res.data);
            setFilteredProjects(res.data);
        } else {
            setProjects(mockProjects);
            setFilteredProjects(mockProjects);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching projects', err);
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (key) => {
    if (activeFilter === key) return;
    setIsTransitioning(true);
    setActiveFilter(key);
    
    setTimeout(() => {
        if (key === 'All') {
            setFilteredProjects(projects);
        } else {
            setFilteredProjects(projects.filter(p => {
                const techs = p.technologies.toLowerCase();
                const desc = p.description.toLowerCase();
                if (key === 'Web' && (techs.includes('react') || techs.includes('node') || techs.includes('php') || techs.includes('web'))) return true;
                if (key === 'Mobile' && (techs.includes('mobile') || techs.includes('flutter') || techs.includes('react native') || desc.includes('mobile'))) return true;
                if (key === 'Security' && (techs.includes('security') || techs.includes('scanner') || desc.includes('vulnerabilit'))) return true;
                if (key === 'Cloud' && (techs.includes('aws') || techs.includes('cloud') || techs.includes('docker'))) return true;
                return false;
            }));
        }
        setIsTransitioning(false);
    }, 300);
  };

  // Close modal on Escape key
  useEffect(() => {
      const handleKeyDown = (e) => {
          if (e.key === 'Escape') setSelectedProject(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="projects-master-section">
        {/* Background Ambience */}
        <div className="projects-bg-aurora">
            <div className="projects-aurora-1"></div>
            <div className="projects-aurora-2"></div>
        </div>
        <div className="projects-bg-grid"></div>

        {/* Project Modal Overlay */}
        {selectedProject && (
            <div className="project-modal-overlay active" onClick={() => setSelectedProject(null)}>
                <div className="project-modal-content" onClick={e => e.stopPropagation()}>
                    <button className="modal-close-btn" onClick={() => setSelectedProject(null)}>
                        <i className="fas fa-times"></i>
                    </button>
                    <div className="modal-layout">
                        <div className="modal-image-col">
                            <div className="modal-img-glow"></div>
                            <img src={`/${selectedProject.image_url}`} alt={selectedProject.title} onError={(e) => { e.target.src = '/project_ai.png' }} />
                        </div>
                        <div className="modal-info-col">
                            <span className="modal-category">Featured Project</span>
                            <h2 className="modal-title">{selectedProject.title}</h2>
                            <p className="modal-desc">{selectedProject.long_description || selectedProject.description}</p>
                            
                            <h6 className="modal-subtitle">Technologies Utilized</h6>
                            <div className="project-tech-stack mb-5">
                                {selectedProject.technologies.split(',').map((tech, i) => (
                                    <span key={i} className="tech-badge">
                                        {tech.trim()}
                                    </span>
                                ))}
                            </div>

                            <div className="modal-actions">
                                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="btn-masterpiece-primary w-100">
                                    <span className="btn-bg-slide"></span>
                                    <span className="btn-content" style={{justifyContent: 'center'}}>
                                        <i className="fab fa-github me-2"></i> Source Code
                                    </span>
                                </a>
                                <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="btn-masterpiece-outline w-100">
                                    <span className="btn-content" style={{justifyContent: 'center'}}>
                                        <i className="fas fa-external-link-alt me-2"></i> Live Preview
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <div className="container relative-z">
            {/* Header Section */}
            <div className="projects-header reveal">
                <span className="projects-chip">{t('projects','title') || 'Featured Portfolio'}</span>
                <h2 className="projects-title">
                    Digital <span className="text-gradient">Masterpieces</span>
                </h2>
                <p className="projects-sub">
                    {t('projects','desc') || 'A curated collection of my most impactful software engineering projects, showcasing expertise across full-stack web, mobile, security, and cloud architectures.'}
                </p>
            </div>

            {/* Filter Navigation */}
            <div className="projects-filter-container reveal-up">
                <div className="projects-filter-wrapper">
                    {filters.map(f => (
                        <button 
                            key={f.key} 
                            onClick={() => handleFilterChange(f.key)}
                            className={`projects-filter-btn ${activeFilter === f.key ? 'active' : ''}`}
                        >
                            <i className={`fas ${f.icon} me-2`}></i> {f.label}
                            {activeFilter === f.key && <div className="filter-active-glow"></div>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="projects-loading-state">
                    <div className="loading-core">
                        <div className="loading-ring"></div>
                        <i className="fas fa-satellite-dish pulse-icon"></i>
                    </div>
                    <p>Loading project schematics...</p>
                </div>
            ) : (
                /* Projects Grid */
                <div className={`projects-grid ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
                    {filteredProjects.map((project, idx) => (
                        <TiltCard key={project.id} className="cursor-pointer" onClick={() => setSelectedProject(project)}>
                            <div className="project-card-master" style={{ animationDelay: `${idx * 0.1}s` }}>
                                <div className="card-bg-glow"></div>
                                
                                {/* Image Box */}
                                <div className="project-img-box">
                                    <div className="img-overlay-gradient"></div>
                                    <div className="img-hover-overlay">
                                        <i className="fas fa-expand-arrows-alt"></i>
                                        <span>View Details</span>
                                    </div>
                                    <img 
                                        src={`/${project.image_url}`} 
                                        alt={project.title} 
                                        className="project-img" 
                                        onError={(e) => { e.target.src = '/project_ai.png' }} 
                                    />
                                </div>
                                
                                {/* Content Box */}
                                <div className="project-content-box">
                                    <h4 className="project-title">{project.title}</h4>
                                    <p className="project-desc line-clamp">{project.description}</p>
                                </div>

                                {/* Tech Stack — isolated footer strip to prevent 3D transform text glitch */}
                                <div className="project-tech-footer">
                                    {project.technologies.split(',').map((tech, i) => (
                                        <span key={i} className="tech-badge">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </TiltCard>
                    ))}

                    {/* Empty State */}
                    {!loading && filteredProjects.length === 0 && (
                        <div className="projects-empty-state">
                            <div className="empty-icon-shield">
                                <i className="fas fa-folder-open"></i>
                            </div>
                            <h4>{t('projects','noProj') || 'No Projects Found'}</h4>
                            <p>Try selecting a different filter category to explore more works.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    </section>
  );
}

export default Projects;
