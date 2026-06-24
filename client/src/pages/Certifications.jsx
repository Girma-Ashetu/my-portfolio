import React from 'react';

const certs = [
  { title: 'AWS Certified Cloud Practitioner', org: 'Amazon Web Services', icon: 'fa-aws', color: 'warning', status: 'In Progress' },
  { title: 'Azure Fundamentals (AZ-900)', org: 'Microsoft', icon: 'fa-microsoft', color: 'info', status: 'In Progress' },
  { title: 'Cisco Certified Network Associate (CCNA)', org: 'Cisco', icon: 'fa-network-wired', color: 'primary', status: 'Targeted' },
  { title: 'Google Cybersecurity Certificate', org: 'Google', icon: 'fa-google', color: 'secondary', status: 'In Progress' },
  { title: 'Meta Front-End Developer', org: 'Meta', icon: 'fa-facebook', color: 'primary', status: 'Targeted' },
  { title: 'Meta Back-End Developer', org: 'Meta', icon: 'fa-server', color: 'accent', status: 'Targeted' },
  { title: 'CompTIA Security+', org: 'CompTIA', icon: 'fa-shield-alt', color: 'danger', status: 'Targeted' },
  { title: 'Google Associate Cloud Engineer', org: 'Google', icon: 'fa-cloud', color: 'info', status: 'Targeted' },
];

const futureCerts = [
  { title: 'AWS Solutions Architect Associate', org: 'Amazon Web Services' },
  { title: 'Microsoft Azure Administrator', org: 'Microsoft' },
  { title: 'Certified Ethical Hacker (CEH)', org: 'EC-Council' },
  { title: 'CompTIA Network+', org: 'CompTIA' },
];

function Certifications() {
  return (
    <section className="py-10 mt-5 pt-5 min-vh-100">
      <div className="container py-5">
        <div className="text-center mb-5 reveal">
          <h6 className="text-primary uppercase tracking-widest mb-3" style={{ letterSpacing: '4px' }}>Professional Credentials</h6>
          <h2 className="display-4 fw-bold mb-3">Certifications & <span className="text-primary">Learning Path</span></h2>
          <p className="text-muted fs-5 mx-auto" style={{ maxWidth: '600px' }}>
            Globally recognized industry certifications that validate expertise and demonstrate a commitment to continuous professional growth.
          </p>
        </div>

        <h5 className="text-white fw-bold mb-4 reveal-up"><i className="fas fa-spinner text-primary me-3"></i>Current Learning Path</h5>
        <div className="row g-4 mb-5">
          {certs.map((cert, i) => (
            <div key={i} className="col-md-6 reveal-up">
              <div className="glass-pane p-4 bento-item d-flex align-items-center gap-4 h-100">
                <div className="flex-shrink-0 text-center" style={{ width: '60px' }}>
                  <i className={`fab ${cert.icon} fs-2 text-${cert.color}`} style={{ fontFamily: cert.icon.startsWith('fa-') && !['fa-network-wired','fa-server','fa-shield-alt','fa-cloud'].includes(cert.icon) ? 'Font Awesome 6 Brands' : 'Font Awesome 6 Free' }}></i>
                  {/* fallback solid icon */}
                </div>
                <div className="flex-grow-1">
                  <h5 className="text-white fw-bold mb-1">{cert.title}</h5>
                  <h6 className={`text-${cert.color} mb-2`}>{cert.org}</h6>
                </div>
                <span className={`badge ${cert.status === 'In Progress' ? 'bg-primary' : 'bg-secondary'} text-white px-3 py-2 flex-shrink-0`}>
                  {cert.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <h5 className="text-white fw-bold mb-4 reveal-up"><i className="fas fa-road text-accent me-3"></i>Future Certifications Roadmap</h5>
        <div className="glass-pane p-5 reveal-up">
          <div className="row g-4">
            {futureCerts.map((cert, i) => (
              <div key={i} className="col-md-6">
                <div className="d-flex align-items-center gap-3 p-3 border border-secondary rounded-4">
                  <i className="fas fa-flag text-accent fs-4"></i>
                  <div>
                    <h6 className="text-white fw-bold mb-0">{cert.title}</h6>
                    <small className="text-muted">{cert.org}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Certifications;
