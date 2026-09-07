const ALLOWED_ELEMENTS = new Set([
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'del',
  'div',
  'em',
  'figcaption',
  'figure',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'img',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'span',
  'strong',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'u',
  'ul',
]);

const DROP_WITH_CONTENT = new Set([
  'audio',
  'base',
  'button',
  'canvas',
  'embed',
  'form',
  'iframe',
  'input',
  'link',
  'math',
  'meta',
  'object',
  'option',
  'picture',
  'script',
  'select',
  'source',
  'style',
  'svg',
  'textarea',
  'video',
]);

const safeUrl = (value: string, allowedProtocols: Set<string>) => {
  try {
    const parsed = new URL(value, window.location.origin);
    return allowedProtocols.has(parsed.protocol);
  } catch {
    return false;
  }
};

/**
 * Sanitizes editor-authored news HTML before it reaches dangerouslySetInnerHTML.
 * Formatting is intentionally allowlisted; scripts, embeds, forms, event handlers,
 * inline styles, and unsafe URL schemes are removed.
 */
export const sanitizeArticleHtml = (html: string): string => {
  if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return '';

  const document = new DOMParser().parseFromString(html, 'text/html');
  const elements = Array.from(document.body.querySelectorAll('*')).reverse();

  elements.forEach((element) => {
    const tag = element.tagName.toLowerCase();

    if (DROP_WITH_CONTENT.has(tag)) {
      element.remove();
      return;
    }

    if (!ALLOWED_ELEMENTS.has(tag)) {
      element.replaceWith(...Array.from(element.childNodes));
      return;
    }

    const href = tag === 'a' ? element.getAttribute('href') : null;
    const title = element.getAttribute('title');
    const target = tag === 'a' ? element.getAttribute('target') : null;
    const src = tag === 'img' ? element.getAttribute('src') : null;
    const alt = tag === 'img' ? element.getAttribute('alt') : null;
    const width = tag === 'img' ? element.getAttribute('width') : null;
    const height = tag === 'img' ? element.getAttribute('height') : null;
    const colspan = ['td', 'th'].includes(tag) ? element.getAttribute('colspan') : null;
    const rowspan = ['td', 'th'].includes(tag) ? element.getAttribute('rowspan') : null;

    Array.from(element.attributes).forEach((attribute) => {
      element.removeAttribute(attribute.name);
    });

    if (title) element.setAttribute('title', title.slice(0, 300));

    if (tag === 'a' && href && safeUrl(href, new Set(['http:', 'https:', 'mailto:', 'tel:']))) {
      element.setAttribute('href', href);
      if (target === '_blank') {
        element.setAttribute('target', '_blank');
        element.setAttribute('rel', 'noopener noreferrer');
      }
    }

    if (tag === 'img') {
      if (!src || !safeUrl(src, new Set(['http:', 'https:']))) {
        element.remove();
        return;
      }
      element.setAttribute('src', src);
      element.setAttribute('alt', (alt || '').slice(0, 300));
      element.setAttribute('loading', 'lazy');
      if (width && /^\d{1,4}$/.test(width)) element.setAttribute('width', width);
      if (height && /^\d{1,4}$/.test(height)) element.setAttribute('height', height);
    }

    if (colspan && /^\d{1,2}$/.test(colspan)) element.setAttribute('colspan', colspan);
    if (rowspan && /^\d{1,2}$/.test(rowspan)) element.setAttribute('rowspan', rowspan);
  });

  return document.body.innerHTML;
};
