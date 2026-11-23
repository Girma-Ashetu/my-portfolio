const keys = ['role', 'problem', 'approach', 'outcome', 'lessons'];
function normalizeCaseStudy(value) {
  if (value === undefined || value === null || value === '') return {};
  let input = value;
  if (typeof input === 'string') {
    try { input = JSON.parse(input); } catch { throw new Error('The case study must contain valid structured text.'); }
  }
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('The case study must be an object.');
  const result = {};
  for (const key of keys) {
    if (input[key] === undefined || input[key] === null) continue;
    if (typeof input[key] !== 'string') throw new Error('Case-study fields must contain text.');
    const text = input[key].trim();
    if (text.length > 1500) throw new Error('Keep each case-study section under 1,500 characters.');
    if (text) result[key] = text;
  }
  return result;
}
function projectRecord(row) {
  if (!row) return row;
  let study = {};
  try { study = normalizeCaseStudy(row.case_study); } catch { /* Older malformed notes must not break the public catalogue. */ }
  return { ...row, case_study: study, featured: row.featured === true || Number(row.featured) === 1 };
}
module.exports = { normalizeCaseStudy, projectRecord };
