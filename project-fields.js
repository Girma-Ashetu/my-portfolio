const { normalizeCaseStudy } = require('./project-case-study');
function normalizeDemoUrl(value) {
  const input = String(value || '').trim();
  if (!input) return '';
  const address = /^https?:\/\//i.test(input) ? input : (/^[\w-]+(?:\.[\w-]+)+(?:[:/\?#]|$)/.test(input) ? `https://${input}` : input);
  let url;
  try { url = new URL(address); } catch { throw new Error('Enter a complete HTTP or HTTPS URL, such as https://your-app.vercel.app.'); }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || address.length > 2048) throw new Error('Use an HTTP or HTTPS URL under 2048 characters, without a username or password.');
  return url.href;
}
function normalizeProject(body = {}) {
  const fields = ['title', 'description', 'long_description', 'technologies', 'link', 'demo_url', 'image_url'];
  const project = Object.fromEntries(fields.map(key => [key, String(body[key] || '').trim()]));
  if (!project.title || !project.description || !project.technologies) throw new Error('Title, description, and technologies are required.');
  if (project.description.length > 2000 || project.long_description.length > 12000) throw new Error('Keep the short description under 2,000 characters and the project story under 12,000 characters.');
  project.link = normalizeDemoUrl(project.link);
  project.demo_url = normalizeDemoUrl(project.demo_url);
  project.case_study = normalizeCaseStudy(body.case_study);
  project.featured = body.featured === true || body.featured === 1 || body.featured === '1';
  if (project.title.length > 255 || project.technologies.length > 255 || project.image_url.length > 255) throw new Error('Title, technologies, and screenshot URL must each be 255 characters or fewer.');
  return project;
}
module.exports = { normalizeProject, normalizeDemoUrl };
