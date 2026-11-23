const { test } = require('node:test');
const assert = require('node:assert/strict');
test('replaces the legacy AI artwork while preserving custom screenshots', async () => {
  const { isLegacyArtwork } = await import('../client/src/data/projectArtwork.js');
  for (const path of ['/project_ai.png', 'background.png', '/bank-optimized.jpg', 'cyber.png', '', null]) assert.equal(isLegacyArtwork(path), true);
  for (const path of ['uploads/my-app.png', '/screenshots/dashboard.webp', 'https://example.com/bank.png']) assert.equal(isLegacyArtwork(path), false);
});
test('selects a distinct interface for each current project', async () => {
  const { projectType } = await import('../client/src/data/projectArtwork.js');
  const titles = {
    'Cybersecurity Vulnerability Scanner': 'security',
    'Personal Finance Mobile App': 'finance',
    'Cloud File Storage System': 'storage',
    'E-Commerce Web Application': 'commerce',
    'Student Registration Management System': 'academic',
    'Bank Management System': 'banking',
    'Cloud Infrastructure Automation': 'pipeline',
    'Developer Portfolio': 'portfolio',
  };
  for (const [title, expected] of Object.entries(titles)) assert.equal(projectType({ title }), expected);
});
