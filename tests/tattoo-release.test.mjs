import assert from 'node:assert/strict';
import test from 'node:test';
import { GET as getRobots } from '../apps/tattoo/src/pages/robots.txt.ts';
import { GET as getSitemap } from '../apps/tattoo/src/pages/sitemap.xml.ts';
import {
  isValidTattooBookingUrl,
  tattooCanonicalForRelease,
  tattooReleaseBlockersFor,
  tattooStructuredDataFor,
} from '../apps/tattoo/src/release-readiness.ts';

const cleanAssets = {
  temporaryHeroImage: false,
  temporaryPortfolioImages: false,
  temporaryAftercareImage: false,
};
const validReadiness = {
  enabled: true,
  publicSiteUrl: 'https://juanjo.fixture.test',
  legal: {
    name: 'Prestador Fixture',
    cuit: '30-10000000-4',
    email: 'legal@juanjo.fixture.test',
    phone: '+5492641234567',
    domicile: 'Domicilio Fixture 123',
  },
  bookingApproved: true,
  termsApproved: true,
  withdrawalApproved: true,
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
});

test('legal placeholders and invalid CUIT, email and phone block release', () => {
  const cases = [
    [{ ...validReadiness.legal, name: '[PENDIENTE]' }, 'legal.name.missing'],
    [{ ...validReadiness.legal, cuit: '30-10000000-5' }, 'legal.cuit.invalid'],
    [{ ...validReadiness.legal, email: 'not-an-email' }, 'legal.email.invalid'],
    [{ ...validReadiness.legal, phone: '264 123 4567' }, 'legal.phone.invalid'],
    [{ ...validReadiness.legal, domicile: '' }, 'legal.domicile.missing'],
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
  ]) {
    assert.ok(
      tattooReleaseBlockersFor({ ...validReadiness, [field]: false }, cleanAssets).includes(
        blocker,
      ),
    );
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
