import { Link } from 'react-router-dom';
import { learningSkills } from '../data/skills';
import './about-studio.css';

const principles = [
  { title: 'Understand before building', text: 'A useful application begins with a clear problem. I start with the workflow, the people involved, and what they need to accomplish.' },
  { title: 'Connect the whole experience', text: 'I enjoy working across interfaces, APIs, and databases. Seeing how the pieces fit together helps me make more thoughtful implementation decisions.' },
  { title: 'Improve through practice', text: 'I learn by building, testing, and revisiting the details. Every project gives me a better question to ask and something concrete to improve.' },
];

export default function About() {
  return <div className="studio-page studio-container about-page">
    <header className="about-intro"><div><p className="studio-eyebrow">THE PERSON BEHIND THE CODE</p><h1>Curiosity drives me.<br /><span>Building teaches me.</span></h1></div><p>I’m Girma Ashetu Asefa—a software engineering student in Ethiopia, connecting thoughtful interfaces with practical application development.</p></header>
    <section className="about-story" aria-labelledby="about-story-heading">
      <aside className="about-profile"><figure><img src="/about_profile-optimized.jpg" width="560" height="554" fetchPriority="high" alt="Girma Ashetu Asefa" /><figcaption><strong>Girma Ashetu Asefa</strong><span>Full-stack development</span></figcaption></figure><dl><div><dt>BASED IN</dt><dd>Jimma, Ethiopia</dd></div><div><dt>STUDYING</dt><dd>Software engineering</dd></div><div><dt>INSTITUTION</dt><dd>Jimma Institute of Technology</dd></div></dl><a className="studio-button secondary" href="/cv.pdf" target="_blank" rel="noopener noreferrer">View résumé</a></aside>
      <div className="about-story-copy"><p className="studio-eyebrow">A LITTLE ABOUT ME</p><h2 id="about-story-heading">Learning the craft.<br />Building something useful.</h2><p className="about-lead">I like the moment when an idea becomes something you can interact with—a clear screen, a working API, or a workflow that finally connects.</p><p>I’m studying software engineering at Jimma Institute of Technology. My projects are how I turn that learning into practice: exploring a problem, implementing the pieces, and improving how they work together.</p><p>My work spans web applications, desktop systems, and mobile development. I work with React, JavaScript, Node.js, Express, Java, Python, PHP, and MySQL, with an interest in secure application design and structured data.</p>
        <div className="about-evidence"><span className="studio-eyebrow">LEARNING THROUGH REAL WORK</span><h3>The Student Record System</h3><p>For this academic team project, I implemented the frontend, Express backend, and MySQL data layer myself. It brought registration, attendance, grades, reporting, and messaging into one school-focused application.</p><Link to="/projects">Explore the project and case study</Link></div>
      </div>
    </section>
    <section className="about-principles" aria-labelledby="about-principles-heading"><div className="studio-section-head"><div><p className="studio-eyebrow">HOW I THINK ABOUT THE WORK</p><h2 id="about-principles-heading">The details matter.<br /><span>So does the bigger picture.</span></h2></div><p>These are the ideas I bring to my projects as I keep developing my skills.</p></div><div className="about-principle-grid">{principles.map((principle, index) => <article key={principle.title}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{index === 0 ? <><circle cx="14" cy="14" r="8"/><path d="m20 20 7 7M10 14h8m-4-4v8"/></> : index === 1 ? <><rect x="3" y="4" width="10" height="10" rx="2"/><rect x="19" y="18" width="10" height="10" rx="2"/><path d="M13 9h11v9M8 14v9h11"/></> : <><path d="M25 12a10 10 0 1 0 1 9M25 5v8h-8m-7 4 4 4 7-8"/></>}</svg><h3>{principle.title}</h3><p>{principle.text}</p></article>)}</div></section>
    <section className="about-learning" aria-labelledby="about-learning-heading"><div><p className="studio-eyebrow">STILL LEARNING. ALWAYS BUILDING.</p><h2 id="about-learning-heading">What I’m exploring next.</h2><p>I’m broadening my approach to backend architecture and frontend applications with these frameworks.</p><Link to="/skills">See my full toolkit</Link></div><ul>{learningSkills.map(skill => <li key={skill}><strong>{skill}</strong><span>Currently learning</span></li>)}</ul></section>
    <section className="about-connect" aria-label="Connect with Girma"><div><h2>Let’s exchange ideas.</h2><p>A project, a question, or an opportunity to learn together.</p></div><Link className="studio-button" to="/contact">Get in touch</Link></section>
  </div>;
}
