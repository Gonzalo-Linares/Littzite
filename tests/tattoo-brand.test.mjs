import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { tattooBrand, tattooIdentity } from '../apps/tattoo/src/brand.config.ts';
import { siteContent } from '../apps/tattoo/src/site.config.ts';

const root = new URL('../', import.meta.url);

test('Juanjo has five unique official mark roles and unchanged approved PNG masters', async () => {
  const entries = Object.entries(tattooBrand.marks);
  assert.equal(entries.length, 5);
  assert.equal(new Set(entries.map(([, mark]) => mark.role)).size, 5);
  assert.equal(new Set(entries.map(([, mark]) => mark.src)).size, 5);

  for (const [name, mark] of entries) {
    const bytes = await readFile(new URL(`apps/tattoo/public${mark.src}`, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), mark.sha256, `${name} checksum`);
  }
});

test('official palette, local fonts, licenses and commercial-empty state are configured', async () => {
  assert.deepEqual(tattooBrand.palette, {
    ink: '#0E0E0E',
    red: '#A61E1E',
    ivory: '#EADCC6',
    gold: '#C9A96B',
    charcoal: '#2C2C2C',
  });
  assert.deepEqual(siteContent.site.theme, tattooIdentity);
  assert.equal(siteContent.services.length, 0);
  assert.equal(siteContent.bookingTargets.length, 0);
  assert.equal(siteContent.quoteTargets.length, 0);
  for (const file of Object.values(tattooBrand.typography))
    await readFile(new URL(`apps/tattoo/public${file}`, root));
  const ryeLicense = await readFile(
    new URL('apps/tattoo/public/fonts/LICENCIA-Rye.txt', root),
    'utf8',
  );
  const dejaVuLicense = await readFile(
    new URL('apps/tattoo/public/fonts/LICENCIA-DejaVu.txt', root),
    'utf8',
  );
  assert.match(ryeLicense, /SIL OPEN FONT LICENSE Version 1\.1/);
  assert.match(dejaVuLicense, /Bitstream Vera/);
});

test('Juanjo brand styling contains no former palette or remote font loading', async () => {
  const css = await readFile(new URL('apps/tattoo/src/styles/juanjo.css', root), 'utf8');
  assert.doesNotMatch(css, /#17191B|#F8F4ED|#EF9476|#FFD4B3/i);
  assert.doesNotMatch(css, /fonts\.googleapis|use\.typekit|@import\s+url\(/i);
  assert.doesNotMatch(css, /font-family:\s*Impact|Arial Black/i);
  assert.match(css, /font-display:\s*swap/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /object-fit:\s*contain/);
  assert.doesNotMatch(
    css.match(/\.tattoo-gallery__item img\s*\{[^}]*\}/)?.[0] ?? '',
    /object-fit:\s*cover/,
  );
});

test('Juanjo frontend uses the supplied marks instead of the former text wordmark', async () => {
  const layout = await readFile(
    new URL('apps/tattoo/src/layouts/TattooSiteLayout.astro', root),
    'utf8',
  );
  const home = await readFile(new URL('apps/tattoo/src/pages/index.astro', root), 'utf8');
  assert.doesNotMatch(
    `${layout}\n${home}`,
    /JUANJO\s*\.|JUANJO\s*\/\s*EDITORIAL|class="juanjo-wordmark/,
  );
  assert.ok(Object.values(tattooBrand.marks).every((mark) => mark.src.startsWith('/brand/')));
  assert.ok(Object.values(tattooBrand.marks).every((mark) => !mark.src.includes('viora')));
});

test('the official Instagram and neutral Littzite attribution have no unapproved destinations', () => {
  assert.equal(tattooBrand.social.instagram, 'https://www.instagram.com/juanjo.tattoos/');
  assert.equal(tattooBrand.attribution.label, 'Powered by');
  assert.equal(tattooBrand.attribution.brand, 'Littzite');
  assert.equal(tattooBrand.attribution.href, undefined);
  assert.equal(tattooBrand.attribution.logoSrc, undefined);
  assert.equal(siteContent.bookingTargets.length, 0);
  assert.equal(siteContent.quoteTargets.length, 0);
});
