import React from 'react';

const experiences = [
  {
    title: 'Academic Software Development Projects',
    org: 'Jimma Institute of Technology',
    period: '2022 – Present',
    color: 'primary',
    icon: 'fa-graduation-cap',
    points: [
      'Designed and developed multiple academic projects including desktop applications, web apps, and cloud-based solutions.',
      'Applied object-oriented programming, data structures, and software engineering principles to real-world problems.',
      'Gained hands-on experience with database design, API development, and system architecture.',
    ],
  },
  {
    title: 'Team-Based Development',
    org: 'University Group Projects',
    period: '2023 – Present',
    color: 'secondary',
    icon: 'fa-users',
    points: [
      'Collaborated with peers to analyze requirements, design software architectures, and implement solutions.',
      'Led feature development in team environments using Git and GitHub for version control.',
      'Practiced Agile methodologies and iterative development cycles.',
    ],
  },
  {
    title: 'Technical Research & Self-Learning',
    org: 'Independent Study',
    period: '2022 – Present',
    color: 'accent',
    icon: 'fa-book-open',
    points: [
      'Conducted in-depth research on cloud computing, cybersecurity, software engineering methodologies, and emerging tech.',
      'Completed online courses, technical documentation, and hands-on lab exercises.',
      'Actively pursuing industry certifications to validate and formalize practical knowledge.',
    ],
  },
  {
    title: 'Open Source & Freelance Work',
    org: 'Personal & Freelance Projects',
    period: '2024 – Present',
    color: 'info',
    icon: 'fa-laptop-code',
    points: [
      'Built responsive web applications and desktop tools for various use cases.',
      'Maintained professional GitHub repositories with clean documentation and code standards.',
      'Continuously improving through open-source contribution and real-client feedback.',
    ],
  },
];

function Experience() {
  return (
    <section className="py-10 mt-5 pt-5 min-vh-100">
      <div className="container py-5">
        <div className="text-center mb-5 reveal">
          <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>Professional Journey</h6>
          <h2 className="display-4 fw-bold mb-3">Experience & <span className="text-primary">Background</span></h2>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
            Building a solid foundation through academic projects, team collaboration, research, and continuous hands-on development.
          </p>
        </div>

        <div className="d-flex flex-column gap-4">
          {experiences.map((exp, i) => (
            <div key={i} className={`glass-pane p-5 bento-item reveal-up border-start border-4 border-${exp.color}`}>
              <div className="row align-items-start g-4">
                <div className="col-md-4">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className={`text-${exp.color} fs-3`}>
                      <i className={`fas ${exp.icon}`}></i>
                    </div>
                    <div>
                      <h4 className="text-white fw-bold mb-0">{exp.title}</h4>
                      <p className={`text-${exp.color} mb-0 fw-semibold`}>{exp.org}</p>
                    </div>
                  </div>
                  <span className="badge bg-secondary text-white px-3 py-2 mt-2">{exp.period}</span>
                </div>
                <div className="col-md-8">
                  <ul className="text-muted mb-0" style={{ lineHeight: '2' }}>
                    {exp.points.map((pt, j) => (
                      <li key={j}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;
