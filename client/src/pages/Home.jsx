import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectGrid from '../components/ProjectGrid';
import { learningSkills, skillGroups } from '../data/skills';
import './home-studio.css';

export default function Home() {
  const [copyStatus, setCopyStatus] = useState('');
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('girme405@gmail.com');
      setCopyStatus('Email copied. Ready to paste.');
    } catch {
      setCopyStatus('Copy unavailable. Use the email link below.');
    }
  }
  return <div className="studio-page studio-home">
    <header className="studio-container studio-hero">
      <div className="studio-hero-copy">
        <p className="studio-eyebrow"><span className="studio-small-mark" aria-hidden="true" /> GIRMA ASHETU · SOFTWARE DEVELOPER</p>
        <h1>Useful software.<br /><span>Thoughtfully built.</span></h1>
        <p className="studio-intro"><strong>I’m Girma.</strong> I turn everyday problems into responsive interfaces and connected applications—bringing the frontend, backend, and data together.</p>
        <div className="studio-actions"><a className="studio-button" href="#work-heading">Explore my work</a><a className="studio-button secondary" href="/cv.pdf" target="_blank" rel="noreferrer">View résumé</a></div>
        <div className="home-social-links" aria-label="Professional profiles"><a href="https://github.com/Girma-Ashetu" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://www.linkedin.com/in/girma-ashetu-a146b9422" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="mailto:girme405@gmail.com">Email me</a></div>
        <div className="studio-hero-footnote"><span><small>BASED IN</small>Jimma, Ethiopia</span><span><small>MY DISCIPLINE</small>Full-stack development</span></div>
      </div>
      <div className="studio-hero-visual home-profile-visual">
        <div className="home-profile-card">
          <figure className="studio-portrait">
            <div className="home-profile-topline"><span>DEVELOPER PROFILE</span><img src="/ga-logo.png" alt="" width="28" height="28" /></div>
            <div className="home-profile-photo"><img src="/about_profile-optimized.jpg" alt="Girma Ashetu Asefa" width="560" height="554" fetchPriority="high" /><span className="home-profile-location">Jimma, Ethiopia</span></div>
            <figcaption><span className="home-profile-role">FULL-STACK DEVELOPMENT</span><strong>Girma Ashetu Asefa<span aria-hidden="true">.</span></strong><span>Software engineering student</span><span className="home-profile-school">Jimma Institute of Technology</span></figcaption>
          </figure>
          <div className="home-profile-focus"><div><span>CORE TOOLKIT</span><strong>Interfaces, APIs & databases.</strong></div><ul aria-label="Core technologies"><li>React</li><li>Node.js</li><li>MySQL</li></ul><Link className="home-profile-link" to="/about">More about me</Link></div>
        </div>
      </div>
    </header>
    <nav className="studio-container home-section-nav" aria-label="Explore this page"><span>TAKE A CLOSER LOOK</span><a href="#work-heading">Selected work</a><a href="#skills-heading">My toolkit</a><a href="#process-heading">My approach</a><a href="#home-contact">Get in touch</a></nav>
    <section className="studio-section studio-container" aria-labelledby="work-heading">
      <div className="studio-section-head"><div><p className="studio-eyebrow">A FEW THINGS I’VE BUILT</p><h2 id="work-heading">Selected work<span className="studio-accent-dot">.</span></h2></div><div className="studio-section-summary"><p>Explore what I built, how I approached it, and what I learned along the way.</p><Link to="/projects">Explore all projects</Link></div></div>
      <ProjectGrid limit={3} featured />
      <div className="home-work-note"><span>THE STORY BEHIND THE SCREEN</span><p>Each project brings together the interface, the implementation, and the decisions behind it.</p><a href="https://github.com/Girma-Ashetu" target="_blank" rel="noopener noreferrer">Browse source code</a></div>
    </section>
    <section className="studio-section studio-container" aria-labelledby="skills-heading">
      <div className="studio-section-head"><div><p className="studio-eyebrow">THE TOOLS BEHIND THE WORK</p><h2 id="skills-heading">A growing toolkit.</h2></div><Link to="/skills">Explore my skills</Link></div>
      <div className="studio-capabilities">{skillGroups.map(group => <article key={group.title}><div className="studio-capability-symbol" aria-hidden="true">{group.title.startsWith('Interface') ? '◇' : group.title.startsWith('Logic') ? '{ }' : '⌘'}</div><h3>{group.title}</h3><p>{group.description}</p><div className="studio-tags">{group.skills.map(skill => <span key={skill}>{skill}</span>)}</div></article>)}</div>
      <div className="studio-learning"><div><span className="studio-eyebrow">CURRENTLY LEARNING</span><p>New frameworks. Broader possibilities.</p></div><div className="studio-learning-tags">{learningSkills.map(skill => <span key={skill}>{skill}<small>Learning</small></span>)}</div></div>
    </section>
    <section className="studio-container studio-section home-process" aria-labelledby="process-heading">
      <div className="studio-section-head"><div><p className="studio-eyebrow">FROM THE FIRST QUESTION TO THE FINAL DETAIL</p><h2 id="process-heading">Good software starts<br />with understanding.</h2></div><p className="studio-section-summary">My approach connects what people need with how an application actually works.</p></div>
      <div className="home-process-grid">{[
        {title: 'Understand the problem', text: 'Start with the people using the application. Map their tasks, define the scope, and make the essential journey clear.', icon: 'discover'},
        {title: 'Build the whole experience', text: 'Connect a responsive interface to application logic and structured data. Keep the implementation readable and the interactions clear.', icon: 'build'},
        {title: 'Test, learn, improve', text: 'Check the important workflows, review small-screen layouts, and use what I learn to improve the next iteration.', icon: 'refine'},
      ].map(step => <article key={step.title}><div className={'home-process-icon ' + step.icon} aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">{step.icon === 'discover' ? <><circle cx="14" cy="14" r="8"/><path d="m20 20 7 7M10 14h8m-4-4v8"/></> : step.icon === 'build' ? <><rect x="4" y="5" width="24" height="22" rx="3"/><path d="M4 12h24m-14 5-4 3 4 3m4-6 4 3-4 3"/></> : <><path d="M25 12a10 10 0 1 0 1 9M25 5v8h-8m-7 4 4 4 7-8"/></>}</svg></div><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
    </section>
    <section className="studio-container home-about" aria-labelledby="home-about-heading"><div className="home-about-title"><p className="studio-eyebrow">THE PERSON BEHIND THE CODE</p><h2 id="home-about-heading">A curious mind.<br /><span>A builder’s mindset.</span></h2><Link to="/about">Get to know me</Link></div><div className="home-about-story"><p>I’m studying software engineering at Jimma Institute of Technology. Building real applications helps me turn what I learn into something tangible.</p><p>My Student Record System brought the frontend, backend, and database together in one school-focused application—an academic team project I implemented across the stack.</p><dl><div><dt>EDUCATION</dt><dd>Software engineering · JiT</dd></div><div><dt>BASED IN</dt><dd>Jimma, Ethiopia</dd></div><div><dt>EXPLORING</dt><dd>NestJS, Django & Angular</dd></div></dl></div></section>
    <aside id="home-contact" className="studio-container home-direct-contact" aria-label="Direct contact"><div><span className="studio-eyebrow">PREFER EMAIL?</span><a href="mailto:girme405@gmail.com">girme405@gmail.com</a></div><div className="home-direct-copy"><button className="home-copy-email" onClick={copyEmail}>Copy email address</button><p className="home-copy-status" role="status">{copyStatus}</p></div></aside>
  </div>;
}
