export const caseStudyFields = [
  { key: 'role', label: 'My contribution', prompt: 'What did you personally implement? Give credit to the team where relevant.' },
  { key: 'problem', label: 'The problem', prompt: 'Who is this for, and what workflow or problem does it address?' },
  { key: 'approach', label: 'Technical approach', prompt: 'Explain the architecture and the important decisions behind the implementation.' },
  { key: 'outcome', label: 'What was built', prompt: 'Describe verified functionality and the current deployment status. Include measured results only if you have evidence.' },
  { key: 'lessons', label: 'Lessons learned', prompt: 'What challenge did you work through, and what would you improve next?' },
];
export function caseStudySections(value) {
  let study = value || {};
  if (typeof study === 'string') { try { study = JSON.parse(study); } catch { return []; } }
  return caseStudyFields.filter(field => typeof study?.[field.key] === 'string' && study[field.key].trim()).map(field => ({ ...field, content: study[field.key].trim() }));
}
export function prioritizeProjects(projects) {
  return [...projects].sort((a, b) => Number(b.featured === true || Number(b.featured) === 1) - Number(a.featured === true || Number(a.featured) === 1));
}
