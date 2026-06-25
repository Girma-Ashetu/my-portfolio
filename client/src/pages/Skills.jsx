import React, { useRef } from 'react';
import './skills.css';

/* ── Tilt Card Wrapper ── */
function TiltCard({ children, className, style }) {
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
    >
      {children}
    </div>
  );
}

const skillCategories = [
  {
    title: 'Programming Languages',
    icon: 'fa-terminal',
    color: 'primary',
    skills: ['Java', 'JavaScript', 'Python', 'C++', 'SQL', 'HTML5', 'CSS3'],
  },
  {
    title: 'Front-End Development',
    icon: 'fa-desktop',
    color: 'secondary',
    skills: ['React.js', 'Next.js', 'Bootstrap', 'Tailwind CSS', 'Responsive Design'],
  },
  {
    title: 'Back-End Development',
    icon: 'fa-server',
    color: 'info',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'Auth Systems', 'Microservices'],
  },
  {
    title: 'Mobile Development',
    icon: 'fa-mobile-alt',
    color: 'accent',
    skills: ['Flutter', 'React Native', 'Android', 'Firebase', 'Cross-Platform'],
  },
  {
    title: 'Database Technologies',
    icon: 'fa-database',
    color: 'primary',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Data Modeling', 'Optimization'],
  },
  {
    title: 'Cloud Computing',
    icon: 'fa-cloud',
    color: 'secondary',
    skills: ['AWS', 'Microsoft Azure', 'Cloud Storage', 'EC2', 'Serverless'],
  },
  {
    title: 'Cybersecurity',
    icon: 'fa-shield-alt',
    color: 'accent',
    skills: ['Network Security', 'OWASP Top 10', 'Web App Sec', 'Secure Coding'],
  },
  {
    title: 'Development Tools',
    icon: 'fa-tools',
    color: 'warning',
    skills: ['Git', 'GitHub Actions', 'Docker', 'Linux', 'Postman', 'Figma'],
  },
];

const softSkills = ['Problem Solving', 'Critical Thinking', 'Continuous Learning', 'Team Collaboration', 'Leadership', 'Adaptability', 'Communication', 'Analytical Thinking'];

function Skills() {
  return (
    <section className="skills-master-section">
        {/* Deep Space Background */}
        <div className="skills-bg-aurora">
            <div className="skills-aurora-1"></div>
            <div className="skills-aurora-2"></div>
        </div>
        <div className="skills-bg-grid"></div>

        <div className="container relative-z">
            {/* Master Header */}
            <div className="skills-header reveal">
                <div className="skills-core-icon">
                    <div className="core-ring-1"></div>
                    <div className="core-ring-2"></div>
                    <i className="fas fa-brain"></i>
                </div>
                <span className="skills-chip">Technical Competencies</span>
                <h2 className="skills-title">
                    Skills & <span className="text-gradient">Expertise</span>
                </h2>
                <p className="skills-sub">
                    A comprehensive multi-stack skillset built through rigorous academic study, hands-on production projects, and continuous self-development.
                </p>
            </div>

            {/* Technical Skills Bento Grid */}
            <div className="skills-bento-grid reveal-up">
                {skillCategories.map((cat, i) => (
                    <TiltCard key={i}>
                        <div className={`skill-card-master color-${cat.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="skill-card-glow"></div>
                            <div className="skill-card-header">
                                <div className="skill-icon-shield">
                                    <i className={`fas ${cat.icon}`}></i>
                                </div>
                                <h4>{cat.title}</h4>
                            </div>
                            <div className="skill-tags-container">
                                {cat.skills.map((skill, si) => (
                                    <span key={si} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </TiltCard>
                ))}
            </div>

            {/* Soft Skills Section */}
            <div className="soft-skills-container reveal-up" style={{ transitionDelay: '0.4s' }}>
                <TiltCard>
                    <div className="soft-skills-master">
                        <div className="soft-skills-glow"></div>
                        <div className="soft-header">
                            <div className="soft-icon"><i className="fas fa-users"></i></div>
                            <h3>Soft Skills & Personal Strengths</h3>
                        </div>
                        <div className="soft-skills-grid">
                            {softSkills.map((s, i) => (
                                <div key={i} className="soft-skill-item" style={{ animationDelay: `${i * 0.05}s` }}>
                                    <i className="fas fa-check-circle"></i>
                                    <span>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </TiltCard>
            </div>
        </div>
    </section>
  );
}

export default Skills;
