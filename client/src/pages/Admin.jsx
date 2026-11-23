import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { safeUrl } from '../data/projects';
import ProjectVisual from '../components/ProjectVisual';
import { caseStudyFields } from '../data/caseStudies';
import { projectsChanged } from '../data/projectStore';
import { loadStudioSections } from '../data/studioLoader';
import './admin-studio.css';

const emptyProject = { title: '', description: '', long_description: '', technologies: '', link: '', demo_url: '', image_url: '', featured: false, case_study: {} };
function readToken() { try { return localStorage.getItem('token') || ''; } catch { return ''; } }
export default function Admin() {
  const [token, setToken] = useState(readToken);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('projects');
  const [form, setForm] = useState(null);
  const [demo, setDemo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);
  const [query, setQuery] = useState('');
  const [loadErrors, setLoadErrors] = useState({ projects: null, messages: null });
  const [reload, setReload] = useState(0);
  const logout = () => { try { localStorage.removeItem('token'); } catch {} setToken(''); setProjects([]); setMessages([]); setForm(null); setDemo(null); };
  async function api(path, options = {}) {
    let response;
    try {
      response = await fetch(path, { ...options, signal: AbortSignal.timeout(12000), cache: 'no-store', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}), ...options.headers } });
    } catch (error) {
      throw new Error(error.name === 'TimeoutError' ? 'The API did not respond in time. Check that the backend is running, then retry.' : 'Cannot reach the portfolio API. Start the backend with npm start, then retry.');
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 || response.status === 403 || data.message === 'Invalid token') logout();
      throw new Error(data.message || ([502, 503, 504].includes(response.status) ? 'The portfolio API is unavailable. Check that the backend (npm start) and MySQL80 are running, then retry.' : 'The request could not be completed. Please try again.'));
    }
    return data;
  }
  useEffect(() => {
    if (!token) return;
    let active = true;
    setLoading(true);
    setNotice(null);
    loadStudioSections(api).then(result => {
      if (active) {
        if (result.projects.data) setProjects(result.projects.data);
        if (result.messages.data) setMessages(result.messages.data);
        setLoadErrors({ projects: result.projects.error, messages: result.messages.error });
      }
    }).catch(error => { if (active) setNotice({ type: 'error', text: error.message }); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token, reload]);
  async function login(event) {
    event.preventDefault(); setBusy(true); setNotice(null);
    try {
      const data = await api('/api/admin/login', { method: 'POST', body: JSON.stringify(credentials) });
      if (!data.token) throw new Error('Sign in failed. Please try again.');
      try { localStorage.setItem('token', data.token); } catch {}
      setToken(data.token); setCredentials({ username: '', password: '' });
    } catch (error) { setNotice({ type: 'error', text: error.message }); }
    finally { setBusy(false); }
  }
  function acceptSaved(data) {
    if (!data.project?.id) throw new Error('The server did not confirm the saved project.');
    setProjects(previous => [data.project, ...previous.filter(project => project.id !== data.project.id)]);
    projectsChanged();
  }
  async function saveProject(event) {
    event.preventDefault(); if (busy) return; setBusy(true); setNotice(null);
    try {
      const data = await api(form.id ? '/api/admin/projects/' + form.id : '/api/admin/projects', { method: form.id ? 'PUT' : 'POST', body: JSON.stringify(form) });
      acceptSaved(data); setForm(null); setNotice({ type: 'success', text: 'Project saved. Your portfolio is up to date.' });
    } catch (error) { setNotice({ type: 'error', text: error.message }); }
    finally { setBusy(false); }
  }
  async function saveDemo(event) {
    event.preventDefault(); if (busy) return; setBusy(true); setNotice(null);
    try {
      const data = await api('/api/admin/projects/' + demo.id + '/demo', { method: 'PATCH', body: JSON.stringify({ demo_url: demo.demo_url }) });
      acceptSaved(data); setDemo(null); setNotice({ type: 'success', text: data.message + ' The public project list is up to date.' });
    } catch (error) { setNotice({ type: 'error', text: error.message }); }
    finally { setBusy(false); }
  }
  async function removeProject(project) {
    if (!window.confirm('Permanently delete “' + project.title + '”?')) return;
    setBusy(true); setNotice(null);
    try { await api('/api/admin/projects/' + project.id, { method: 'DELETE' }); setProjects(previous => previous.filter(item => item.id !== project.id)); projectsChanged(); setNotice({ type: 'success', text: 'Project deleted.' }); }
    catch (error) { setNotice({ type: 'error', text: error.message }); }
    finally { setBusy(false); }
  }
  const status = notice && <div className={'studio-admin-notice ' + notice.type} role={notice.type === 'error' ? 'alert' : 'status'}>{notice.text}</div>;
  if (!token) return <section className="studio-page studio-container studio-project-page"><div className="studio-admin-login"><p className="studio-eyebrow">PORTFOLIO STUDIO</p><h1>Welcome back.</h1><p>Sign in to publish projects, manage live demos, and read your messages.</p>{status}<form onSubmit={login}><fieldset disabled={busy}><label htmlFor="admin-user">Username</label><input id="admin-user" autoComplete="username" required value={credentials.username} onChange={event => setCredentials({ ...credentials, username: event.target.value })} /><label htmlFor="admin-password">Password</label><input id="admin-password" type="password" autoComplete="current-password" required value={credentials.password} onChange={event => setCredentials({ ...credentials, password: event.target.value })} /><button className="studio-button" type="submit">{busy ? 'Signing in…' : 'Sign in'}</button></fieldset></form></div></section>;
  return <section className="studio-page studio-container studio-project-page studio-admin">
    <div className="studio-section-head"><div><p className="studio-eyebrow">YOUR CONTENT, IN YOUR CONTROL</p><h1>Portfolio studio.</h1></div><div className="studio-actions"><Link className="studio-button secondary" to="/projects">View portfolio</Link><button className="studio-button secondary" onClick={logout}>Sign out</button></div></div>
    <div className="studio-admin-tabs"><button aria-pressed={tab === 'projects'} onClick={() => { setTab('projects'); setNotice(null); }}>Projects <span>{loading || loadErrors.projects ? '—' : projects.length}</span></button><button aria-pressed={tab === 'messages'} onClick={() => { setTab('messages'); setNotice(null); }}>Messages <span>{loading || loadErrors.messages ? '—' : messages.length}</span></button></div>
    {status}
    {loading && <p role="status">Loading your studio…</p>}
    {!loading && loadErrors[tab] && <div className="studio-admin-connection" role="alert"><div><h2>{tab === 'projects' ? 'Projects could not be loaded.' : 'Messages could not be loaded.'}</h2><p>{loadErrors[tab]}</p>{tab === 'projects' && <p>The <strong>Add demo</strong> button appears beside each loaded project. Once connected, paste your deployed app’s URL there and save it.</p>}</div><button className="studio-button secondary" disabled={busy} onClick={() => setReload(value => value + 1)}>Retry connection</button></div>}
    {tab === 'projects' && !loadErrors.projects && !loading && projects.length > 0 && <p className="studio-admin-demo-help">To publish a demo, choose <strong>Add demo</strong> beside a project, enter its public URL, and save.</p>}
    {tab === 'projects' && <>
      <div className="studio-admin-toolbar"><label className="studio-admin-search">Search projects<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a project…" /></label><button className="studio-button" onClick={() => { setForm({ ...emptyProject, case_study: {} }); setDemo(null); setNotice(null); }}>Add project</button></div>
      {form && <div className="studio-editor"><div className="studio-section-head"><div><p className="studio-eyebrow">PROJECT EDITOR</p><h2>{form.id ? 'Refine the details.' : 'Share your next build.'}</h2></div><button className="studio-button secondary" disabled={busy} onClick={() => setForm(null)}>Cancel</button></div><form onSubmit={saveProject}><fieldset disabled={busy}><div className="studio-form-grid"><div><label htmlFor="project-title-input">Project title *</label><input id="project-title-input" autoFocus required maxLength={255} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} /></div><div><label htmlFor="project-tech">Technologies *</label><input id="project-tech" required maxLength={255} placeholder="React, NestJS, MySQL" value={form.technologies} onChange={event => setForm({ ...form, technologies: event.target.value })} /></div></div><label htmlFor="project-description">Short description *</label><textarea id="project-description" required maxLength={2000} rows={3} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /><label htmlFor="project-story">The story behind the build</label><textarea id="project-story" maxLength={12000} rows={5} placeholder="What problem did you solve? What did you build, and what did you learn?" value={form.long_description || ''} onChange={event => setForm({ ...form, long_description: event.target.value })} /><section className="studio-admin-case-editor"><p className="studio-eyebrow">PROJECT CASE STUDY</p><h3>Show the thinking behind the work.</h3><p className="studio-note">Optional sections appear publicly only when filled in. Describe your own work and use results you can support.</p>{caseStudyFields.map(field => <div key={field.key}><label htmlFor={'case-' + field.key}>{field.label}</label><textarea id={'case-' + field.key} rows={field.key === 'role' ? 2 : 4} maxLength={1500} value={form.case_study?.[field.key] || ''} onChange={event => setForm({ ...form, case_study: { ...form.case_study, [field.key]: event.target.value } })} placeholder={field.prompt} /></div>)}<label className="studio-featured-checkbox"><input type="checkbox" checked={Boolean(form.featured)} onChange={event => setForm({ ...form, featured: event.target.checked })} /><span>Feature this project first on the homepage</span></label></section><div className="studio-form-grid"><div><label htmlFor="project-source">Source code URL</label><input id="project-source" inputMode="url" maxLength={2048} placeholder="https://github.com/you/project" value={form.link} onChange={event => setForm({ ...form, link: event.target.value })} /></div><div><label htmlFor="project-demo">Live demo URL</label><input id="project-demo" inputMode="url" maxLength={2048} placeholder="https://your-app.vercel.app" value={form.demo_url} onChange={event => setForm({ ...form, demo_url: event.target.value })} /></div></div><p className="studio-note">Use the published app or a video walkthrough. Leave the demo blank until it’s ready.</p><label htmlFor="project-image">Screenshot URL or local image filename</label><input id="project-image" maxLength={255} placeholder="https://… or bank.png" value={form.image_url} onChange={event => setForm({ ...form, image_url: event.target.value })} /><p className="studio-note">Use your actual application screenshot. Leave this blank for a project-specific interface concept.</p><div className="studio-admin-visual-preview"><ProjectVisual key={form.image_url} project={form} eager /></div>{form.image_url && <button type="button" className="studio-admin-reset-image" onClick={() => setForm({ ...form, image_url: '' })}>Use interface concept instead</button>}<div className="studio-actions"><button type="submit" className="studio-button">{busy ? 'Saving project…' : 'Save project'}</button></div></fieldset></form></div>}
      {demo && <div className="studio-editor studio-demo-editor"><p className="studio-eyebrow">LIVE DEMO</p><h2>{demo.title}</h2><form onSubmit={saveDemo}><fieldset disabled={busy}><label htmlFor="quick-demo">Demo or walkthrough URL</label><input id="quick-demo" autoFocus inputMode="url" maxLength={2048} value={demo.demo_url} onChange={event => setDemo({ ...demo, demo_url: event.target.value })} placeholder="https://your-app.vercel.app" aria-describedby="quick-demo-help" /><p className="studio-note" id="quick-demo-help">Paste your published application URL. Clear the field and save to remove the demo.</p><div className="studio-actions"><button className="studio-button" type="submit">{busy ? 'Saving demo…' : 'Save demo'}</button><button className="studio-button secondary" type="button" onClick={() => setDemo(null)}>Cancel</button>{safeUrl(demo.demo_url) && <a className="studio-button secondary" href={safeUrl(demo.demo_url)} target="_blank" rel="noopener noreferrer">Test demo link</a>}</div></fieldset></form></div>}
      <div className="studio-admin-projects">{projects.filter(project => (project.title + ' ' + project.technologies).toLowerCase().includes(query.toLowerCase())).map(project => <article className="studio-admin-project" key={project.id}><ProjectVisual key={project.image_url} project={project} className="studio-admin-thumbnail" /><div className="studio-admin-project-info"><h3>{project.title}</h3><p>{project.technologies}</p>{safeUrl(project.demo_url) ? <a className="studio-admin-demo-url" href={safeUrl(project.demo_url)} target="_blank" rel="noopener noreferrer">{project.demo_url}</a> : <span className="studio-note">No live demo yet</span>}</div><div className="studio-admin-project-actions"><button className="studio-button" disabled={busy} onClick={() => { setDemo({ id: project.id, title: project.title, demo_url: project.demo_url || '' }); setForm(null); setNotice(null); window.scrollTo({ top: 260, behavior: 'instant' }); }}>{safeUrl(project.demo_url) ? 'Edit demo' : 'Add demo'}</button><button className="studio-button secondary" disabled={busy} onClick={() => { setForm({ ...emptyProject, ...project, case_study: { ...(project.case_study || {}) } }); setDemo(null); setNotice(null); window.scrollTo({ top: 260, behavior: 'instant' }); }}>Edit project</button><button className="studio-admin-delete" disabled={busy} onClick={() => removeProject(project)}>Delete</button></div></article>)}</div>
      {!loading && !loadErrors.projects && !projects.length && <div className="studio-empty"><h3>Your next project belongs here.</h3><p>Add a project, then attach its live demo when it’s ready to share.</p></div>}
    </>}
    {tab === 'messages' && <div className="studio-admin-messages">{messages.map(message => <article className="studio-editor" key={message.id}><p className="studio-eyebrow">{message.created_at ? new Date(message.created_at).toLocaleDateString() : 'MESSAGE'}</p><h2>{message.name}</h2><a href={'mailto:' + message.email}>{message.email}</a><p className="studio-message-body">{message.message}</p><a className="studio-button secondary" href={'mailto:' + message.email + '?subject=' + encodeURIComponent('Re: Your portfolio message')}>Reply by email</a></article>)}{!loading && !loadErrors.messages && !messages.length && <div className="studio-empty"><h3>Your inbox is clear.</h3><p>Messages from the contact form will appear here.</p></div>}</div>}
  </section>;
}
