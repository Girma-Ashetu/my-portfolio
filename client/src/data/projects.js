import { studentShowcase } from './studentShowcase';
export const fallbackProjects = [
 { id: 1, title: 'Bank Management System', description: 'A desktop application for managing accounts, transactions, and account status in Ethiopian Birr.', technologies: 'Java, MySQL, Swing, JDBC', image_url: 'bank.png', link: 'https://github.com/Girma-Ashetu' },
 { id: 2, title: 'Developer Portfolio', description: 'A React portfolio with a project catalogue, content administration, and a contact workflow.', technologies: 'React, Node.js, Express, MySQL', image_url: 'portfolio-home-real.jpg', link: 'https://github.com/Girma-Ashetu/my-portfolio', demo_url: 'https://my-portfolio1-theta-one.vercel.app/' },
 { id: 'student-records', ...studentShowcase },
 { id: 4, title: 'Vulnerability Scanner', description: 'A security project exploring common web vulnerabilities and actionable reporting.', technologies: 'Python, Security, React', image_url: 'cyber.png', link: 'https://github.com/Girma-Ashetu' },
 { id: 5, title: 'Mobile Marketplace', description: 'A cross-platform shopping application built with Flutter and Firebase.', technologies: 'Flutter, Firebase, Mobile', image_url: 'ecommerce.png', link: 'https://github.com/Girma-Ashetu' },
 { id: 6, title: 'Cloud Infrastructure Automation', description: 'An exploration of containerized deployments and automated delivery pipelines.', technologies: 'AWS, Docker, Cloud', image_url: 'cloud.png', link: 'https://github.com/Girma-Ashetu' }
];
export function safeUrl(value) {
 try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}
export function projectImage(value) {
 if (/^\/?portfolio\.png$/.test(value || '')) return '/portfolio-home-real.jpg';
 if (safeUrl(value)) return value;
 const optimized = /^(?:\/)?(bank|portfolio|csms|cyber|ecommerce|cloud)\.png$/.exec(value || '');
 if (optimized) return '/' + optimized[1] + '-optimized.jpg';
 return value && !value.includes(':') && !value.startsWith('//') ? '/' + value.replace(/^\/+/, '') : '/project_ai.png';
}
