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
  assert.match(
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
  assert.equal(
    tattooBrand.attribution.href,
    'https://www.instagram.com/litt.zite/?utm_source=ig_web_button_share_sheet',
  );
  assert.equal(tattooBrand.attribution.logoSrc, '/littzite/horizontal-dark.svg');
  assert.equal(siteContent.bookingTargets.length, 0);
  assert.equal(siteContent.quoteTargets.length, 0);
});

test('Juanjo footer and navigation retain the owner logo and omit Estudio and Instagram', async () => {
  const layout = await readFile(
    new URL('apps/tattoo/src/layouts/TattooSiteLayout.astro', root),
    'utf8',
  );
  const footer = layout.slice(layout.indexOf('<SiteFooter'));
  assert.match(layout, /tattoo-footer-brand/);
  assert.match(layout, /tattooBrand\.marks\.signature\.src/);
  assert.doesNotMatch(layout, /href="\/estudio\//);
  assert.doesNotMatch(footer, /Instagram/i);
  assert.match(footer, /href="\/arrepentimiento\/"/);
  const css = await readFile(new URL('apps/tattoo/src/styles/juanjo.css', root), 'utf8');
  assert.match(css, /inline-size:\s*44px/);
  assert.match(css, /block-size:\s*44px/);
  assert.match(css, /place-items:\s*center/);
});

test('favicon is the recorded official PNG derivative, not the retired manual SVG', async () => {
  const favicon = await readFile(new URL('apps/tattoo/public/brand/favicon-jt.png', root));
  assert.equal(siteContent.site.iconHref, '/brand/favicon-jt.png');
  assert.equal(
    createHash('sha256').update(favicon).digest('hex'),
    'a3f5196f801074f0a1ecb53f9d5fcbd2df9a46db654ccef4de8143d0e90b33cb',
  );
  assert.equal(favicon.readUInt32BE(16), 64);
  assert.equal(favicon.readUInt32BE(20), 64);
  assert.equal(
    tattooBrand.marks.jt.sha256,
    '971090d517b7ad5236be56e2010e864b03b18826091ae63197b22c48aa0ca002',
  );
  await assert.rejects(readFile(new URL('apps/tattoo/public/brand/favicon.svg', root)));
});

test('production motion is CSS progressive and JS only freezes completed reveals', async () => {
  const css = await readFile(
    new URL('apps/tattoo/src/styles/production-content.css', root),
    'utf8',
  );
  const home = await readFile(new URL('apps/tattoo/src/pages/index.astro', root), 'utf8');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /@supports \(animation-timeline: view\(\)\)/);
  assert.match(css, /animation-timeline: --tattoo-works/);
  assert.match(css, /--work-order/);
  assert.match(css, /\[data-revealed\]/);
  assert.match(css, /position: sticky/);
  assert.doesNotMatch(home, /style\.opacity|classList\.add|IntersectionObserver|pending/);
  assert.match(home, /section\.dataset\.revealed = 'true'/);
  assert.match(home, /removeEventListener\('scroll'/);
});
