import { Link } from 'react-router-dom';
import { learningSkills, skillGroups } from '../data/skills';
import './skills-studio.css';

const applications = [
  { title: 'Interface & experience', detail: 'From layout to interaction', example: 'Responsive React interfaces, reusable components, and clear form interactions.' },
  { title: 'Logic & architecture', detail: 'From request to data', example: 'Express APIs and MySQL persistence, including the registration workflow in my Student Record System.' },
  { title: 'Workflow & delivery', detail: 'From changes to working software', example: 'Git for versioning, GitHub for sharing code, and REST APIs for connecting application layers.' },
];
const learningFocus = {
  NestJS: { category: 'BACKEND', focus: 'Organizing Node.js applications with modules, controllers, and services.' },
  Django: { category: 'BACKEND', focus: 'Exploring Python web development, models, and database-backed applications.' },
  Angular: { category: 'FRONTEND', focus: 'Learning component-based application structure, templates, and services.' },
};

export default function Skills() {
  return <div className="studio-page studio-container skills-page">
    <header className="skills-intro"><div><p className="studio-eyebrow">CAPABILITIES & CONTINUOUS LEARNING</p><h1>A practical toolkit.<br /><span>A curious mindset.</span></h1></div><p>The technologies I use to connect interfaces, application logic, and data—and the frameworks I’m exploring next.</p></header>
    <section className="skills-foundations" aria-labelledby="skills-foundations-heading"><div className="skills-section-title"><div><p className="studio-eyebrow">THE FOUNDATIONS</p><h2 id="skills-foundations-heading">Skills with a purpose.</h2></div><p>Grouped by what they help me build.</p></div><div className="skills-domain-grid">{skillGroups.map((group, index) => <article key={group.title}><div className="skills-domain-icon" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5">{index === 0 ? <><rect x="3" y="5" width="26" height="22" rx="3"/><path d="M3 12h26M9 8h1m3 0h1M9 17h6m-6 5h14"/></> : index === 1 ? <><ellipse cx="16" cy="7" rx="10" ry="4"/><path d="M6 7v18c0 5 20 5 20 0V7M6 16c0 5 20 5 20 0"/></> : <><circle cx="8" cy="7" r="3"/><circle cx="24" cy="9" r="3"/><circle cx="8" cy="25" r="3"/><path d="M8 10v12m3-4h4c5 0 9-2 9-6"/></>}</svg></div><p className="skills-domain-detail">{applications[index].detail}</p><h3>{group.title}</h3><p>{group.description}</p><ul className="skills-technology-list" aria-label={group.title + ' technologies'}>{group.skills.map(skill => <li key={skill}>{skill}</li>)}</ul><div className="skills-in-practice"><span>IN PRACTICE</span><p>{applications[index].example}</p></div></article>)}</div></section>
    <section className="skills-proof" aria-labelledby="skills-proof-heading"><div><p className="studio-eyebrow">WHERE THE PIECES COME TOGETHER</p><h2 id="skills-proof-heading">Frontend. Backend.<br /><span>One connected workflow.</span></h2><p>In the Student Record System, I implemented the web interface, Express backend, and MySQL data layer for an academic team project.</p><Link to="/projects">Explore the project and case study</Link></div><div className="skills-workflow" aria-label="Student Record System application layers"><article><span>INTERFACE</span><h3>HTML, CSS & JavaScript</h3><p>Registration forms and role-specific screens, styled with Bootstrap.</p></article><article><span>APPLICATION</span><h3>Node.js & Express</h3><p>API endpoints, authentication logic, and registration workflows.</p></article><article><span>DATA</span><h3>MySQL</h3><p>Related school records and transactions for student registration.</p></article></div></section>
    <section className="skills-exploring" aria-labelledby="skills-exploring-heading"><div className="skills-section-title"><div><p className="studio-eyebrow">CURRENTLY LEARNING</p><h2 id="skills-exploring-heading">The next layer of my toolkit.</h2></div><p>Areas I’m studying and practicing as I expand my skills.</p></div><div className="skills-learning-grid">{learningSkills.map(skill => <article key={skill}><div><span>{learningFocus[skill].category}</span><span className="skills-learning-label">Learning</span></div><h3>{skill}</h3><p>{learningFocus[skill].focus}</p></article>)}</div></section>
    <section className="skills-next"><div><h2>See the tools in context.</h2><p>Explore the projects, the implementation choices, and what I learned.</p></div><Link className="studio-button" to="/projects">Explore my work</Link></section>
  </div>;
}
