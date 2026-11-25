import { useEffect, useRef, useState } from 'react';
import './project-experience.css';
import { safeUrl } from '../data/projects';
import ProjectVisual from './ProjectVisual';
import { projectCategories, projectType } from '../data/projectArtwork';
import { caseStudySections, prioritizeProjects } from '../data/caseStudies';
import { loadProjects, peekProjects, subscribeProjects, invalidateProjects, PROJECTS_UPDATED } from '../data/projectStore';

function ProjectDetails({ project, onClose }) {
  const dialog = useRef(null);
  const opener = useRef(document.activeElement);
  useEffect(() => {
    const element = dialog.current;
    const returnFocus = opener.current;
    const overflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = overflow; returnFocus?.focus(); };
  }, []);
  const source = safeUrl(project.link);
  const demo = safeUrl(project.demo_url);
  const sections = caseStudySections(project.case_study);
  return <dialog ref={dialog} className="studio-dialog" aria-labelledby="project-title" onCancel={onClose} onClick={event => { if (event.target === dialog.current) onClose(); }}>
    <button className="studio-close" onClick={onClose} aria-label="Close project details">×</button>
    <ProjectVisual project={project} className="studio-dialog-image" eager />
    <div className="studio-dialog-body"><p className="studio-eyebrow">{sections.length ? 'PROJECT CASE STUDY' : 'BEHIND THE BUILD'}</p><h2 id="project-title">{project.title}</h2><p className="studio-detail-description">{project.long_description || project.description}</p><div className="studio-tags">{String(project.technologies || '').split(',').filter(Boolean).map(tech => <span key={tech}>{tech.trim()}</span>)}</div><div className="studio-actions">{demo && <a className="studio-button" href={demo} target="_blank" rel="noopener noreferrer">Try live demo</a>}{source && <a className="studio-button secondary" href={source} target="_blank" rel="noopener noreferrer">{new URL(source).pathname.replace(/\/$/, '') === '/Girma-Ashetu' ? 'GitHub profile' : 'View source code'}</a>}</div>{!demo && <p className="studio-note">A public demo is not available for this project yet.</p>}{sections.length > 0 && <div className="studio-case-study">{sections.map(section => <section key={section.key}><h3>{section.label}</h3><p>{section.content}</p></section>)}</div>}</div>
  </dialog>;
}
function matches(project, filter) {
  const tech = String(project.technologies || '').toLowerCase();
  if (filter === 'Live demos') return Boolean(safeUrl(project.demo_url));
  if (filter === 'Web') return /react|angular|nestjs|django|express|node|php|web/.test(tech);
  if (filter === 'Applications') return /\bjava\b|flutter|mobile|swing/.test(tech);
  if (filter === 'Security') return /security|scanner/.test(tech + ' ' + project.title.toLowerCase());
  if (filter === 'Cloud') return /cloud|docker|aws/.test(tech);
  return true;
}
export default function ProjectGrid({ limit, filterable = false, featured = false }) {
  const [projects, setProjects] = useState(peekProjects() ?? []);
  const [status, setStatus] = useState(peekProjects() ? 'ready' : 'loading');
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('featured');
  const [selected, setSelected] = useState(null);
  const [retrying, setRetrying] = useState(false);
  async function retryCatalogue() {
    if (retrying) return;
    setRetrying(true);
    try {
      const data = await loadProjects({ force: true });
      setProjects(data);
      setStatus('ready');
    } catch { setStatus('offline'); }
    finally { setRetrying(false); }
  }
  useEffect(() => {
    let active = true;
    const update = data => { if (active) { setProjects(data); setStatus('ready'); setSelected(previous => previous ? data.find(project => project.id === previous.id) || null : null); } };
    const refresh = () => loadProjects({ force: true }).catch(() => { if (active) setStatus('offline'); });
    const onStorage = event => { if (event.key === 'portfolio_projects_updated') { invalidateProjects(); refresh(); } };
    const unsubscribe = subscribeProjects(update);
    loadProjects().then(update).catch(() => { if (active) setStatus('offline'); });
    window.addEventListener(PROJECTS_UPDATED, refresh);
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', onStorage);
    return () => { active = false; unsubscribe(); window.removeEventListener(PROJECTS_UPDATED, refresh); window.removeEventListener('focus', refresh); window.removeEventListener('storage', onStorage); };
  }, []);
  const matching = prioritizeProjects(projects).filter(project => matches(project, filter) && [project.title, project.description, project.technologies].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
  if (sort === 'name') matching.sort((a, b) => a.title.localeCompare(b.title));
  const visible = matching.slice(0, limit);
  const narrowed = filter !== 'All' || Boolean(query.trim());
  return <>
    {filterable && <div className="studio-project-toolbar"><div className="studio-filters" aria-label="Filter projects">{['All', 'Live demos', 'Web', 'Applications', 'Security', 'Cloud'].map(item => <button key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div><label className="studio-project-search"><span>Search work</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a project or technology…" /></label><div className="studio-project-results"><p className="studio-project-count" role="status">{status === 'loading' ? 'Loading projects…' : status === 'offline' && !projects.length ? 'Catalogue unavailable' : `${matching.length} ${matching.length === 1 ? 'project' : 'projects'}`} {filter !== 'All' ? ' · ' + filter : ''}{query.trim() ? ' matching “' + query.trim() + '”' : ''}</p>{narrowed && <button className="studio-clear-filters" onClick={() => { setFilter('All'); setQuery(''); }}>Clear filters</button>}<label className="studio-project-sort"><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="featured">Featured first</option><option value="name">Name A–Z</option></select></label></div></div>}
    {status === 'offline' && <div className="studio-catalogue-notice"><p role="status">{projects.length ? 'Unable to refresh the catalogue. Your last loaded projects are still available below.' : 'Projects could not be loaded. Please try again, or explore my work on GitHub.'}</p><button type="button" disabled={retrying} onClick={retryCatalogue}>{retrying ? 'Reconnecting…' : 'Retry connection'}</button></div>}
    {status === 'loading' && <div className="studio-project-loading" role="status"><span className="studio-visually-hidden">Loading project catalogue…</span><div className="studio-project-grid" aria-hidden="true">{Array.from({ length: Math.min(limit || 2, 3) }, (_, index) => <div className="studio-project-placeholder" key={index}><div className="studio-placeholder-image" /><div className="studio-placeholder-body"><span /><span /><span /></div></div>)}</div></div>}
    <div aria-busy={status === 'loading'} className={'studio-project-grid' + (featured ? ' studio-featured-grid' : '') + (filterable ? ' studio-work-grid' : '')}>{visible.map((project, index) => <article className={'studio-project-card' + (project.featured ? ' is-featured' : '')} key={project.id}>
        <div className="studio-image-button"><ProjectVisual key={project.image_url} project={project} decorative /><button className="studio-image-open" onClick={() => setSelected(project)} aria-label={'View ' + project.title}><span className="studio-image-caption">{'View ' + project.title}</span></button></div>
      <div className="studio-card-content"><div className="studio-card-meta"><span>{project.featured || (featured && index === 0) ? 'FEATURED · ' : ''}{projectCategories[projectType(project)]}</span>{safeUrl(project.demo_url) && <span className="studio-demo-badge">Live demo</span>}{filterable && !safeUrl(project.demo_url) && <span className="studio-demo-pending">Demo not published</span>}</div><h3><button className="studio-title-button" onClick={() => setSelected(project)}>{project.title}</button></h3><p>{project.description}</p><div className="studio-tags">{String(project.technologies || '').split(',').filter(Boolean).slice(0, 4).map(tech => <span key={tech}>{tech.trim()}</span>)}</div><div className="studio-card-links">{safeUrl(project.demo_url) && <a className="studio-demo-link" href={safeUrl(project.demo_url)} target="_blank" rel="noopener noreferrer" aria-label={'Live demo for ' + project.title + ' (opens in a new tab)'}>Live demo <span aria-hidden="true">↗</span></a>}{safeUrl(project.link) && new URL(safeUrl(project.link)).pathname.split('/').filter(Boolean).length > 1 && <a className="studio-source-link" href={safeUrl(project.link)} target="_blank" rel="noopener noreferrer" aria-label={'Source code for ' + project.title + ' (opens in a new tab)'}>{new URL(project.link).hostname === 'github.com' ? 'GitHub' : 'Source code'} <span aria-hidden="true">↗</span></a>}<button className="studio-details-link" onClick={() => setSelected(project)} aria-label={'View details for ' + project.title}>{caseStudySections(project.case_study).length ? 'Case study' : 'Project details'} <span aria-hidden="true">→</span></button></div></div>
    </article>)}</div>
    {status === 'ready' && !visible.length && <div className="studio-empty" role="status"><h3>{query.trim() ? 'No matching projects.' : filter === 'Live demos' ? 'Live demos are on their way.' : 'More builds are on the way.'}</h3><p>{query.trim() ? 'Try another keyword or browse the full collection.' : filter === 'Live demos' ? 'Published demos will appear here as soon as they are added.' : 'There are no projects in this category yet.'}</p>{(filter !== 'All' || query) && <button className="studio-button secondary" onClick={() => { setFilter('All'); setQuery(''); }}>Browse all projects</button>}</div>}
    {selected && <ProjectDetails project={selected} onClose={() => setSelected(null)} />}
  </>;
}
