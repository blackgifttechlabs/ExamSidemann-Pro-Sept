import { useEffect } from 'react';
import { canonicalUrlFor, SITE_ORIGIN } from '../utils/siteUrl';
import { isSingletonPastPaperSubjectPath } from '../utils/pastPaperSeo';

type Props = {
  title: string;
  description: string;
  canonical: string;
  image?: string;
  robots?: string;
  type?: 'website' | 'article';
  /** @deprecated Retained for call-site compatibility; meta keywords are not emitted. */
  keywords?: string;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

const DEFAULT_TITLE = 'Exam Sidemann | Free ZIMSEC & HEXCO Learning Resources';
const DEFAULT_DESCRIPTION = 'Study ZIMSEC and HEXCO courses with past papers, syllabi, notes, videos, practical labs, school tools, and interactive learning resources for Zimbabwe.';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/exam-sidemann-social-preview.png`;
const DEFAULT_ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const POLICY_NOINDEX_ROBOTS = 'noindex, follow, noarchive';

const pathMustNotBeIndexed = (pathname: string) => {
  const normalizedPathname = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
  const parts = normalizedPathname.split('/').filter(Boolean);

  return (
    (parts[0] === 'news' && parts[1] === 'article') ||
    (parts[0] === 'past-papers' && parts.length >= 4) ||
    isSingletonPastPaperSubjectPath(normalizedPathname) ||
    (parts[0] === 'tutorials' && parts.length > 1) ||
    (parts[0] === 'courses' && parts[1] === 'detail') ||
    normalizedPathname === '/premium' ||
    normalizedPathname === '/payment' ||
    normalizedPathname === '/practicals/polytechnic/under-construction' ||
    normalizedPathname === '/practicals/olevel/computer-science' ||
    normalizedPathname === '/practicals/olevel/food-technology' ||
    normalizedPathname === '/practicals/alevel/computer-science'
  );
};

const sanitizeStructuredData = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value
      .map(sanitizeStructuredData)
      .filter((entry) => entry !== undefined);
  }
  if (!value || typeof value !== 'object') return value;

  const record = value as Record<string, unknown>;
  if (record['@type'] === 'FAQPage') return undefined;

  return Object.fromEntries(
    Object.entries(record)
      .filter(([key]) => key !== 'keywords')
      .map(([key, entry]) => [key, sanitizeStructuredData(entry)]),
  );
};

const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element?.setAttribute(name, value));
};

const upsertCanonical = (href: string) => {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.appendChild(element);
  }
  element.href = href;
};

export const SeoHead: React.FC<Props> = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  robots = DEFAULT_ROBOTS,
  type = 'website',
  structuredData,
}) => {
  useEffect(() => {
    const effectiveCanonical = canonicalUrlFor(canonical);
    const effectiveRobots = pathMustNotBeIndexed(window.location.pathname)
      ? POLICY_NOINDEX_ROBOTS
      : robots;
    const safeStructuredData = effectiveRobots.startsWith('noindex')
      ? undefined
      : sanitizeStructuredData(structuredData);

    document.title = title;
    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    document.head
      .querySelectorAll('meta[name="keywords"]')
      .forEach((element) => element.remove());
    upsertMeta('meta[name="robots"]', { name: 'robots', content: effectiveRobots });
    upsertMeta('meta[name="googlebot"]', { name: 'googlebot', content: effectiveRobots });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: effectiveCanonical });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Exam Sidemann' });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_ZW' });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });
    upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: 'Exam Sidemann digital learning platform' });
    upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: '1200' });
    upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: '630' });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });
    upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: 'Exam Sidemann digital learning platform' });
    upsertCanonical(effectiveCanonical);

    const scriptId = 'route-structured-data';
    document.getElementById(scriptId)?.remove();
    if (
      safeStructuredData &&
      (!Array.isArray(safeStructuredData) || safeStructuredData.length > 0)
    ) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify(safeStructuredData);
      document.head.appendChild(script);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      upsertMeta('meta[name="description"]', { name: 'description', content: DEFAULT_DESCRIPTION });
      document.getElementById(scriptId)?.remove();
    };
  }, [canonical, description, image, robots, structuredData, title, type]);

  return null;
};
