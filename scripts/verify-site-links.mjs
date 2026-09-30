import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const base = 'https://littzite.invalid';

// Deliberately checks generated static HTML, not source paths or external sites.
// External destinations need separate live validation at release time.
export async function verifyInternalLinks(distDirectory) {
  const pages = new Map();
  async function visit(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      else if (entry.isFile() && entry.name.endsWith('.html')) {
        const relative = path.relative(distDirectory, absolute).split(path.sep).join('/');
        const route = relative === 'index.html' ? '/' :
          relative.endsWith('/index.html') ? '/' + relative.slice(0, -'index.html'.length) : '/' + relative;
        const html = await readFile(absolute, 'utf8');
        const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
        assert.equal(ids.length, new Set(ids).size, `${route}: duplicate HTML id`);
        pages.set(route, { html, ids: new Set(ids) });
      }
    }
  }
  await visit(distDirectory);
  assert.ok(pages.has('/'), 'Static output is missing the home page');
  let checked = 0;
  for (const [route, page] of pages) {
    for (const [, raw] of page.html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
      // Anchor links are generated as double-quoted hrefs by Astro.
      const href = raw.replaceAll('&amp;', '&');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
      const url = new URL(href, base + route);
      if (url.origin !== base) continue;
      const normalized = url.pathname.endsWith('/') ? url.pathname :
        url.pathname.endsWith('.html') ? url.pathname : url.pathname + '/';
      const target = pages.get(normalized);
      assert.ok(target, `${route}: broken internal href ${href} (missing ${normalized})`);
      if (url.hash) {
        const fragment = decodeURIComponent(url.hash.slice(1));
        assert.ok(target.ids.has(fragment), `${route}: href ${href} points to missing #${fragment}`);
      }
      checked++;
    }
  }
  return { pages: pages.size, checked };
}
