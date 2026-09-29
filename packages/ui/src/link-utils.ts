// Links are configured by each application. This shared primitive rejects unsafe
// URL forms, including browser-normalized protocol-relative URLs with backslashes.
const base = 'https://littzite.invalid';

export function isAllowedHref(href: string): boolean {
  if (!href || href !== href.trim() || /[\u0000-\u001f\u007f\\]/.test(href)) return false;

  if (href.startsWith('#')) return href.length > 1;

  try {
    if (href.startsWith('/') && !href.startsWith('//')) {
      return new URL(href, base).origin === base;
    }
    if (!href.startsWith('https://')) return false;

    const url = new URL(href);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}
