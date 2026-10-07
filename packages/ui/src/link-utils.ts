// Links are configured by each application. This shared primitive rejects unsafe
// URL forms, including browser-normalized protocol-relative URLs with backslashes.
const base = 'https://littzite.invalid';

const emailAddressPattern =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

function isAllowedMailto(href: string): boolean {
  const match = /^mailto:([^?#]+)(?:\?subject=([^#]*))?$/.exec(href);
  if (!match) return false;

  const [, recipient, rawSubject] = match;
  if (!emailAddressPattern.test(recipient)) return false;
  if (rawSubject === undefined) return true;
  if (!rawSubject || rawSubject.length > 2048 || /%(?![\da-f]{2})/i.test(rawSubject)) return false;
  if (!/^(?:[A-Za-z0-9_.!~'()-]|%[\da-f]{2})+$/i.test(rawSubject)) return false;

  try {
    let subject = rawSubject.replace(/\+/g, ' ');
    for (let pass = 0; pass < 10; pass += 1) {
      if (/[\u0000-\u001f\u007f]/.test(subject)) return false;
      if (!/%[\da-f]{2}/i.test(subject)) return true;
      const decoded = decodeURIComponent(subject);
      subject = decoded;
    }
    return !/%[\da-f]{2}/i.test(subject) && !/[\u0000-\u001f\u007f]/.test(subject);
  } catch {
    return false;
  }
}

export function isAllowedHref(href: string): boolean {
  if (!href || href !== href.trim() || /[\u0000-\u001f\u007f\\]/.test(href)) return false;

  if (href.startsWith('#')) return href.length > 1;
  if (href.startsWith('mailto:')) return isAllowedMailto(href);

  try {
    if (href.startsWith('/') && !href.startsWith('//')) {
      return new URL(href, base).origin === base;
    }
    if (!href.startsWith('https://')) return false;
    const authority = href.slice('https://'.length).split(/[/?#]/, 1)[0];
    if (!authority || authority.includes('@')) return false;

    const url = new URL(href);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}
