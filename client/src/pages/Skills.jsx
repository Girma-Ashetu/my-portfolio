import React from 'react';

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
    skills: ['React.js', 'Next.js', 'Bootstrap', 'Tailwind CSS', 'Responsive Design', 'UI/UX Principles'],
  },
  {
    title: 'Back-End Development',
    icon: 'fa-server',
    color: 'info',
    skills: ['Node.js', 'Express.js', 'REST APIs', 'Authentication Systems', 'Database Integration', 'Server-Side Dev'],
  },
  {
    title: 'Mobile Development',
    icon: 'fa-mobile-alt',
    color: 'accent',
    skills: ['Flutter', 'React Native', 'Android Development', 'Firebase', 'Cross-Platform Dev'],
  },
  {
    title: 'Database Technologies',
    icon: 'fa-database',
    color: 'primary',
    skills: ['MySQL', 'PostgreSQL', 'MongoDB', 'Database Design', 'SQL Optimization', 'Data Modeling'],
  },
  {
    title: 'Cloud Computing',
    icon: 'fa-cloud',
    color: 'secondary',
    skills: ['Amazon Web Services (AWS)', 'Microsoft Azure', 'Cloud Storage', 'Virtual Machines', 'IAM', 'Serverless Computing'],
  },
  {
    title: 'Cybersecurity',
    icon: 'fa-shield-alt',
    color: 'accent',
    skills: ['Network Security', 'Web App Security', 'Authentication & Authorization', 'OWASP Top 10', 'Secure Coding', 'Vulnerability Assessment'],
  },
  {
    title: 'Development Tools',
    icon: 'fa-tools',
    color: 'info',
    skills: ['Git', 'GitHub', 'Docker', 'Linux', 'VS Code', 'IntelliJ IDEA', 'Postman', 'Figma'],
  },
];

const softSkills = ['Problem Solving', 'Critical Thinking', 'Continuous Learning', 'Team Collaboration', 'Leadership', 'Adaptability', 'Communication', 'Analytical Thinking'];

function Skills() {
  return (
    <section className="py-10 mt-5 pt-5 min-vh-100">
      <div className="container py-5">
        <div className="text-center mb-5 reveal">
          <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>Technical Competencies</h6>
          <h2 className="display-4 fw-bold mb-3">Skills & <span className="text-primary">Expertise</span></h2>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
            A comprehensive multi-stack skillset built through academic study, hands-on projects, and continuous self-development.
          </p>
        </div>

        {/* Technical Skills Grid */}
        <div className="row g-4 mb-5">
          {skillCategories.map((cat, i) => (
            <div key={i} className="col-lg-6 col-xl-3 reveal-up">
              <div className={`glass-pane p-4 h-100 bento-item border-top border-3 border-${cat.color}`}>
                <h5 className="text-white fw-bold mb-4">
                  <i className={`fas ${cat.icon} text-${cat.color} me-2`}></i>
                  {cat.title}
                </h5>
                <div className="d-flex flex-wrap gap-2">
                  {cat.skills.map((skill, si) => (
                    <span
                      key={si}
                      className={`badge bg-${cat.color} bg-opacity-25 text-${cat.color} border border-${cat.color} px-3 py-2`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Soft Skills */}
        <div className="glass-pane p-5 reveal-up">
          <h4 className="text-white fw-bold mb-4"><i className="fas fa-users text-primary me-3"></i>Soft Skills & Personal Strengths</h4>
          <div className="d-flex flex-wrap gap-3">
            {softSkills.map((s, i) => (
              <div key={i} className="glass-pane px-4 py-3 bento-item d-flex align-items-center gap-3">
                <i className="fas fa-check-circle text-primary"></i>
                <span className="text-white fw-semibold">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Skills;
