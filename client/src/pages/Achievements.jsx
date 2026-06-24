import React from 'react';

const stats = [
  { val: '10+', label: 'Projects Completed', icon: 'fa-project-diagram', color: 'primary' },
  { val: '500+', label: 'GitHub Contributions', icon: 'fa-code-branch', color: 'secondary' },
  { val: '3+', label: 'Major Tech Stacks', icon: 'fa-layer-group', color: 'accent' },
  { val: '6+', label: 'Certifications Pursued', icon: 'fa-certificate', color: 'info' },
];

const academic = [
  'Object-Oriented Programming',
  'Data Structures and Algorithms',
  'Database Systems',
  'Software Engineering Principles',
  'Computer Networks',
  'Operating Systems',
];

const technical = [
  'Developed multiple full-stack software projects',
  'Built database-driven desktop & web applications',
  'Created fully responsive web interfaces',
  'Studied and implemented cloud technologies',
  'Practiced cybersecurity and network security concepts',
  'Maintained active, disciplined software development habits',
];

function Achievements() {
  return (
    <section className="py-10 mt-5 pt-5 min-vh-100">
      <div className="container py-5">
        <div className="text-center mb-5 reveal">
          <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>Milestones</h6>
          <h2 className="display-4 fw-bold mb-3">Achievements & <span className="text-primary">Growth</span></h2>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
            A track record of consistent academic and technical accomplishments demonstrating capability and dedication.
          </p>
        </div>

        {/* Stats */}
        <div className="row g-4 mb-5">
          {stats.map((s, i) => (
            <div key={i} className="col-md-3 reveal-up">
              <div className="glass-pane p-5 h-100 bento-item text-center">
                <i className={`fas ${s.icon} text-${s.color} fs-2 mb-3`}></i>
                <h2 className="display-4 fw-bold text-white mb-2">{s.val}</h2>
                <p className={`text-${s.color} small uppercase tracking-widest fw-bold mb-0`}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-4">
          {/* Academic */}
          <div className="col-lg-6 reveal-up">
            <div className="glass-pane p-5 h-100 bento-item border-top border-3 border-primary">
              <h4 className="text-white fw-bold mb-4"><i className="fas fa-graduation-cap text-primary me-3"></i>Academic Growth</h4>
              <p className="text-muted mb-4">Successfully completed Software Engineering coursework involving:</p>
              <ul className="list-unstyled d-flex flex-column gap-3">
                {academic.map((item, i) => (
                  <li key={i} className="d-flex align-items-center gap-3">
                    <span className="badge bg-primary rounded-circle p-2"><i className="fas fa-check"></i></span>
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Technical */}
          <div className="col-lg-6 reveal-up">
            <div className="glass-pane p-5 h-100 bento-item border-top border-3 border-secondary">
              <h4 className="text-white fw-bold mb-4"><i className="fas fa-trophy text-secondary me-3"></i>Technical Accomplishments</h4>
              <ul className="list-unstyled d-flex flex-column gap-3">
                {technical.map((item, i) => (
                  <li key={i} className="d-flex align-items-center gap-3">
                    <span className="badge bg-secondary rounded-circle p-2"><i className="fas fa-check"></i></span>
                    <span className="text-white">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* GitHub Section */}
          <div className="col-12 reveal-up">
            <div className="glass-pane p-5 bento-item-large border-top border-3 border-accent">
              <div className="row align-items-center g-4">
                <div className="col-lg-6">
                  <h4 className="text-white fw-bold mb-4"><i className="fab fa-github text-accent me-3"></i>GitHub Portfolio</h4>
                  <p className="text-muted fs-5 mb-4" style={{ lineHeight: '1.8' }}>
                    My GitHub serves as a live showcase of my software development journey and technical growth — housing professional repositories, clean documentation, and real-world projects.
                  </p>
                  <a href="https://github.com/Girma-Ashetu" target="_blank" rel="noopener noreferrer" className="btn-premium">
                    <span className="btn-text">View GitHub Profile</span>
                    <span className="btn-icon"><i className="fab fa-github"></i></span>
                  </a>
                </div>
                <div className="col-lg-6">
                  <h6 className="text-white fw-bold mb-4">Repository Categories</h6>
                  <div className="d-flex flex-wrap gap-3">
                    {['Web Development', 'Mobile Applications', 'Cloud Projects', 'Cybersecurity Projects', 'Software Engineering', 'Academic Projects'].map((cat, i) => (
                      <span key={i} className="badge bg-accent bg-opacity-25 text-accent border border-accent px-3 py-2 fs-6">{cat}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Achievements;
