export function resolveSiteUrl(env) {
  return env.SITE_URL || env.VITE_SITE_URL || (env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : '');
}

export function siteMetadata(siteUrl) {
  if (!siteUrl) return [];
  const url = new URL(siteUrl);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('SITE_URL must be the site origin, for example https://your-domain.com');
  const origin = url.origin;
  return [
    { tag: 'link', attrs: { rel: 'canonical', href: origin + '/' }, injectTo: 'head' },
    ...['og:url', 'twitter:url'].map(property => ({ tag: 'meta', attrs: { [property.startsWith('og:') ? 'property' : 'name']: property, content: origin + '/' }, injectTo: 'head' })),
    ...['og:image', 'twitter:image'].map(property => ({ tag: 'meta', attrs: { [property.startsWith('og:') ? 'property' : 'name']: property, content: origin + '/about_profile-optimized.jpg' }, injectTo: 'head' })),
  ];
}
