// These bundled files are legacy AI illustrations, not screenshots of the apps.
const legacyArtwork = new Set([
  'project_ai.png', 'project_fintech.png', 'background.png', 'academic_verification.png',
  ...['bank', 'cloud', 'csms', 'cyber', 'ecommerce', 'portfolio'].flatMap(name => [name + '.png', name + '-optimized.jpg']),
]);

export function projectType(project) {
  const title = String(project.title || '').toLowerCase();
  const tech = String(project.technologies || '').toLowerCase();
  if (/security|scanner|vulnerab/.test(title)) return 'security';
  if (/finance|budget|expense/.test(title)) return 'finance';
  if (/bank/.test(title)) return 'banking';
  if (/commerce|marketplace|shopping/.test(title)) return 'commerce';
  if (/student|course|academic|registration/.test(title)) return 'academic';
  if (/pipeline|infrastructure|automation/.test(title)) return 'pipeline';
  if (/cloud|storage|file/.test(title)) return 'storage';
  if (/portfolio/.test(title)) return 'portfolio';
  if (/security/.test(tech)) return 'security';
  if (/aws|cloud|docker/.test(tech)) return 'pipeline';
  return 'application';
}

export function isLegacyArtwork(value) {
  const path = String(value || '').trim().replace(/^\/+/, '').split(/[?#]/)[0];
  return !path || legacyArtwork.has(path);
}

export const projectCategories = {
  security: 'Security tooling', finance: 'Mobile application', banking: 'Desktop application',
  commerce: 'Commerce platform', academic: 'Academic system', storage: 'Cloud application',
  pipeline: 'Cloud & delivery', portfolio: 'Developer portfolio', application: 'Software application',
};
