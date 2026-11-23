let cache;
let loadedAt = 0;
let pending;
let revision = 0;
const listeners = new Set();
export const PROJECTS_UPDATED = 'portfolio:projects-updated';
export function peekProjects() { return cache; }
export function loadProjects({ force = false } = {}) {
  if (!force && cache && Date.now() - loadedAt < 30000) return Promise.resolve(cache);
  if (!pending) {
    const startedAtRevision = revision;
    const request = fetch('/api/projects', { cache: 'no-store', signal: AbortSignal.timeout(7000) })
    .then(async response => {
      if (!response.ok) throw new Error('The project catalogue is temporarily unavailable.');
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid project response.');
      if (startedAtRevision !== revision) return loadProjects({ force: true });
      cache = data;
      loadedAt = Date.now();
      listeners.forEach(listener => listener(data));
      return data;
    }).finally(() => { if (pending === request) pending = undefined; });
    pending = request;
  }
  return pending;
}
export function subscribeProjects(listener) { listeners.add(listener); return () => listeners.delete(listener); }
export function invalidateProjects() {
  cache = undefined;
  loadedAt = 0;
  revision += 1;
  pending = undefined;
}
export function projectsChanged() {
  invalidateProjects();
  window.dispatchEvent(new Event(PROJECTS_UPDATED));
  try { localStorage.setItem('portfolio_projects_updated', String(Date.now())); } catch { /* Private storage may be unavailable. */ }
}
