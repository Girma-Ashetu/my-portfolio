import { useState } from 'react';
import { projectImage } from '../data/projects';
import { isLegacyArtwork, projectType } from '../data/projectArtwork';
import ProjectInterface from './ProjectInterface';

const unavailable = new Set();
export default function ProjectVisual({ project, className = '', eager = false, decorative = false }) {
  const src = projectImage(project.image_url);
  const [failedSource, setFailedSource] = useState('');
  const concept = (isLegacyArtwork(project.image_url) && src !== '/portfolio-home-real.jpg') || src === '/project_ai.png' || failedSource === src || unavailable.has(src);
  const type = projectType(project);
  const screenshotVariants = ['/srs-login.jpg', '/portfolio-home-real.jpg'].includes(src);
  const srcSet = screenshotVariants ? `${src.replace('.jpg', '-small.jpg')} 480w, ${src.replace('.jpg', '-medium.jpg')} 900w, ${src} 1265w` : undefined;
  const sizes = eager ? '(max-width: 780px) 92vw, 780px' : '(max-width: 700px) 90vw, (max-width: 1280px) 46vw, 610px';
  return <div aria-hidden={decorative || undefined} className={'studio-project-visual ' + (concept ? 'has-concept ' : 'has-screenshot ') + className}>
    {concept ? <div className="studio-interface-art" role="img" aria-label={'Illustrative interface concept for ' + project.title + ', with sample data'}><ProjectInterface type={type} /></div> : <img src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} width="900" height="560" loading={eager ? 'eager' : 'lazy'} decoding="async" alt={project.title + ' project image'} onError={() => { unavailable.add(src); setFailedSource(src); }} />}
    {concept && <span className="studio-artwork-label">Interface concept · sample data</span>}
  </div>;
}
