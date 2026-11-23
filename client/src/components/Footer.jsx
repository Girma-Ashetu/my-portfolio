import { Link } from 'react-router-dom';
import './footer-studio.css';

export default function Footer() {
  return <footer className="studio-footer portfolio-footer">
    <div className="studio-container">
      <div className="footer-invitation">
        <div><p className="footer-eyebrow">HAVE SOMETHING IN MIND?</p><h2>A good conversation.<br /><span>A great place to start.</span></h2></div>
        <Link className="studio-button" to="/contact">Let’s connect</Link>
      </div>
      <div className="footer-main">
        <div className="footer-identity"><Link to="/" className="studio-footer-brand" aria-label="Girma Ashetu home"><img className="studio-brand-mark" src="/ga-logo.png" alt="" width="52" height="52" /><span className="studio-brand-name">Girma Ashetu<span>.</span></span></Link><p>Thoughtful interfaces. Practical applications.<br />Built with curiosity and attention to detail.</p><span className="footer-location">Jimma, Ethiopia · East Africa Time (UTC+3)</span></div>
        <nav className="footer-column" aria-label="Footer navigation"><h3>Explore</h3><Link to="/">Home</Link><Link to="/about">About me</Link><Link to="/projects">Selected work</Link><Link to="/skills">Skills & toolkit</Link></nav>
        <nav className="footer-column" aria-label="Professional profiles"><h3>Elsewhere</h3><a href="https://github.com/Girma-Ashetu" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://www.linkedin.com/in/girma-ashetu-a146b9422" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="https://t.me/Progirma35" target="_blank" rel="noopener noreferrer">Telegram</a><a href="/cv.pdf" target="_blank" rel="noopener noreferrer">View résumé</a></nav>
        <div className="footer-column footer-contact"><h3>Start a conversation</h3><a className="footer-email" href="mailto:girme405@gmail.com">girme405@gmail.com</a><p>For project ideas, opportunities,<br />or a simple hello.</p><Link to="/contact">Send a message</Link></div>
      </div>
      <div className="footer-bottom"><small>© {new Date().getFullYear()} Girma Ashetu Asefa</small><span>Designed with care. Built with React.</span><div><Link to="/admin">Studio</Link><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Back to top</button></div></div>
    </div>
  </footer>;
}
