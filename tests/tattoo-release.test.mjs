import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { GET as getRobots } from '../apps/tattoo/src/pages/robots.txt.ts';
import { GET as getSitemap } from '../apps/tattoo/src/pages/sitemap.xml.ts';
import {
  isValidTattooBookingUrl,
  tattooCanonicalForRelease,
  tattooLegal,
  tattooReleaseBlockersFor,
  tattooStructuredDataFor,
} from '../apps/tattoo/src/release-readiness.ts';

const root = fileURLToPath(new URL('../', import.meta.url));

const cleanAssets = {
  temporaryHeroImage: false,
  temporaryPortfolioImages: false,
  temporaryAftercareImage: false,
};
const validReadiness = {
  enabled: true,
  publicSiteUrl: 'https://juanjo.fixture.test',
  legal: {
    providerName: 'Prestador Fixture',
    taxId: '30-10000000-4',
    contactEmail: 'legal@juanjo.fixture.test',
    phone: '+5492641234567',
    legalDomicile: 'Domicilio Fixture 123',
  },
  bookingApproved: true,
  termsApproved: true,
  withdrawalApproved: true,
  withdrawalPlacementApproved: true,
};

test('preview is non-blocking and has no productive index metadata', async () => {
  const readiness = { ...validReadiness, enabled: false };
  assert.deepEqual(tattooReleaseBlockersFor(readiness), []);
  assert.equal(tattooCanonicalForRelease(false, readiness.publicSiteUrl, '/'), undefined);
  assert.equal(tattooStructuredDataFor(false, readiness.publicSiteUrl), undefined);
  const robots = await getRobots().text();
  const sitemap = await getSitemap().text();
  assert.equal(robots, 'User-agent: *\nDisallow: /\n');
  assert.doesNotMatch(sitemap, /<url>/);
});

test('public release fails closed while temporary production assets remain', () => {
  const blockers = tattooReleaseBlockersFor(validReadiness);
  assert.ok(blockers.includes('assets.temporary-hero'));
  assert.ok(blockers.includes('assets.temporary-portfolio'));
  assert.ok(blockers.includes('assets.temporary-aftercare'));
});

test('release requires a public HTTPS origin without credentials, path, query or hash', () => {
  const missing = tattooReleaseBlockersFor(
    { ...validReadiness, publicSiteUrl: undefined },
    cleanAssets,
  );
  assert.ok(missing.includes('JUANJO_PUBLIC_SITE_URL.missing'));
  for (const publicSiteUrl of [
    'http://juanjo.fixture.test',
    'https://user:pass@juanjo.fixture.test',
    'https://juanjo.fixture.test/path',
    'https://juanjo.fixture.test?preview=1',
    'https://juanjo.fixture.test#section',
  ]) {
    assert.ok(
      tattooReleaseBlockersFor({ ...validReadiness, publicSiteUrl }, cleanAssets).includes(
        'JUANJO_PUBLIC_SITE_URL.invalid',
      ),
      publicSiteUrl,
    );
  }
  assert.deepEqual(
    tattooReleaseBlockersFor(
      { ...validReadiness, publicSiteUrl: 'https://juanjo.fixture.test/' },
      cleanAssets,
    ),
    [],
  );
});

test('legal placeholders and invalid CUIT, email and phone block release', () => {
  const cases = [
    [{ ...validReadiness.legal, providerName: '[PENDIENTE]' }, 'legal.providerName.missing'],
    [{ ...validReadiness.legal, taxId: '30-10000000-5' }, 'legal.taxId.invalid'],
    [{ ...validReadiness.legal, contactEmail: 'not-an-email' }, 'legal.email.invalid'],
    [{ ...validReadiness.legal, phone: '264 123 4567' }, 'legal.phone.invalid'],
    [{ ...validReadiness.legal, legalDomicile: '' }, 'legal.legalDomicile.missing'],
  ];
  for (const [legal, blocker] of cases)
    assert.ok(
      tattooReleaseBlockersFor({ ...validReadiness, legal }, cleanAssets).includes(blocker),
    );
});

test('approved booking destination remains exact Cal.com and arbitrary hosts are rejected', () => {
  assert.equal(
    isValidTattooBookingUrl(
      'https://cal.com/juanjo-pereyra-mkzgce/turnos-tattoos?overlayCalendar=true',
    ),
    true,
  );
  for (const url of [
    'http://cal.com/juanjo/turnos',
    'https://evil.example/juanjo/turnos',
    'https://cal.com/',
    'https://user:pass@cal.com/juanjo/turnos',
  ])
    assert.equal(isValidTattooBookingUrl(url), false, url);
});

test('booking, terms and withdrawal approvals are required', () => {
  for (const [field, blocker] of [
    ['bookingApproved', 'booking.approval'],
    ['termsApproved', 'terms.approval'],
    ['withdrawalApproved', 'withdrawal.approval'],
    ['withdrawalPlacementApproved', 'withdrawal.placement-approval'],
  ]) {
    assert.ok(
      tattooReleaseBlockersFor({ ...validReadiness, [field]: false }, cleanAssets).includes(
        blocker,
      ),
    );
  }
});

test('legal pages consume the shared app-local legal data and render configured fixture values', () => {
  const env = {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
    JUANJO_PUBLIC_RELEASE: 'false',
    JUANJO_LEGAL_NAME: 'Prestador Fixture',
    JUANJO_LEGAL_CUIT: '30-10000000-4',
    JUANJO_LEGAL_EMAIL: 'legal@juanjo.fixture.test',
    JUANJO_LEGAL_PHONE: '+5492641234567',
    JUANJO_LEGAL_DOMICILE: 'Domicilio Fixture 123',
  };
  execFileSync(
    process.execPath,
    [path.join(root, 'apps/tattoo/node_modules/astro/bin/astro.mjs'), 'build'],
    { cwd: path.join(root, 'apps/tattoo'), env, stdio: 'pipe' },
  );

  const read = (route) =>
    readFileSync(path.join(root, `apps/tattoo/dist/${route}/index.html`), 'utf8');
  const terms = read('terminos-y-condiciones');
  for (const value of [
    'Prestador Fixture',
    '30-10000000-4',
    'Domicilio Fixture 123',
    'legal@juanjo.fixture.test',
    '+5492641234567',
  ])
    assert.ok(terms.includes(value), `terms missing ${value}`);

  const privacy = read('privacidad');
  assert.ok(privacy.includes('Prestador Fixture'));
  assert.ok(privacy.includes('legal@juanjo.fixture.test'));
  assert.match(privacy, /Cal\.com/);
  assert.match(privacy, /Instagram/);
  assert.match(privacy, /Google Maps/);
  assert.match(privacy, /no tiene formularios ni base de datos propios/);

  const withdrawal = read('arrepentimiento');
  assert.ok(withdrawal.includes('legal@juanjo.fixture.test'));
  assert.doesNotMatch(withdrawal, /El sitio no cuenta con correo/i);
  assert.match(withdrawal, /no necesariamente equivale a ejercer el derecho de arrepentimiento/);

  for (const route of ['terminos-y-condiciones', 'privacidad', 'arrepentimiento']) {
    const html = read(route);
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
    assert.doesNotMatch(html, /\[PENDIENTE/);
  }
});

test('legal pages share tattooLegal instead of duplicating environment reads', () => {
  assert.equal(tattooLegal.providerName, '[PENDIENTE — NOMBRE / RAZÓN SOCIAL]');
  for (const file of [
    'terminos-y-condiciones.astro',
    'privacidad.astro',
    'arrepentimiento.astro',
  ]) {
    const source = readFileSync(path.join(root, `apps/tattoo/src/pages/${file}`), 'utf8');
    assert.match(source, /tattooLegal/);
    assert.doesNotMatch(source, /import\.meta\.env|JUANJO_LEGAL_/);
  }
});

test('synthetic fully valid readiness passes without changing production asset blockers', () => {
  assert.deepEqual(tattooReleaseBlockersFor(validReadiness, cleanAssets), []);
  assert.equal(
    tattooReleaseBlockersFor(validReadiness).some((blocker) => blocker.startsWith('assets.')),
    true,
  );
});

test('canonical and LocalBusiness structured data are app-local and release-only', () => {
  assert.equal(
    tattooCanonicalForRelease(true, validReadiness.publicSiteUrl, '/trabajos'),
    'https://juanjo.fixture.test/trabajos/',
  );
  assert.equal(
    tattooCanonicalForRelease(true, validReadiness.publicSiteUrl, '//evil.example/'),
    'https://juanjo.fixture.test/',
  );
  assert.deepEqual(tattooStructuredDataFor(true, validReadiness.publicSiteUrl), {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Juanjo Tattoo Studio',
    url: 'https://juanjo.fixture.test',
    sameAs: ['https://www.instagram.com/juanjo.tattoos/'],
  });
  assert.equal(tattooStructuredDataFor(false, validReadiness.publicSiteUrl), undefined);
});

test('Robots and sitemap endpoints are generated as noindex preview outputs', async () => {
  const robots = await getRobots().text();
  assert.equal(robots, 'User-agent: *\nDisallow: /\n');
  const sitemap = await getSitemap().text();
  assert.match(sitemap, /<urlset/);
  assert.doesNotMatch(sitemap, /<url>|pages\.dev|fixture\.test|404/);
});
