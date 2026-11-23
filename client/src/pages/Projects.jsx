import ProjectGrid from '../components/ProjectGrid';
import './work-studio.css';

export default function Projects() {
  return <section className="studio-page studio-container studio-project-page work-page">
    <header className="studio-work-intro"><div><p className="studio-eyebrow">PROJECTS, PRACTICE & PROBLEM SOLVING</p><h1>The work.<br /><span>Behind the interface.</span></h1></div><div className="studio-work-summary"><p className="studio-intro">A closer look at what I build—from school workflows to application interfaces and development experiments.</p><p>Explore the implementation, read a case study, or try a published demo.</p><a className="studio-button secondary" href="https://github.com/Girma-Ashetu" target="_blank" rel="noopener noreferrer">Explore GitHub</a></div></header>
    <h2 className="work-catalogue-heading">Project catalogue</h2>
    <ProjectGrid filterable />
  </section>;
}
