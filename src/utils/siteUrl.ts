export const SITE_ORIGIN = 'https://www.examsidemann.com';

/**
 * Public HTML routes use Netlify's directory-style Pretty URL form. Keeping
 * this rule in one place prevents slash, query-string, www and preview-domain
 * variants from emitting competing canonical URLs in the browser.
 */
export const canonicalPathFor = (pathname: string): string => {
  const pathOnly = pathname.split(/[?#]/, 1)[0] || '/';
  const normalized = `/${pathOnly.split('/').filter(Boolean).join('/')}`;
  return normalized === '/' ? '/' : `${normalized}/`;
};

export const canonicalUrlFor = (urlOrPath: string): string => {
  try {
    const url = new URL(urlOrPath, SITE_ORIGIN);
    return `${SITE_ORIGIN}${canonicalPathFor(url.pathname)}`;
  } catch {
    return `${SITE_ORIGIN}${canonicalPathFor(urlOrPath)}`;
  }
};
