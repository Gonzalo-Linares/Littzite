import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { releaseBlockers } from '../apps/estetica/src/viora-release.ts';

const root = fileURLToPath(new URL('../', import.meta.url));

const validFixture = {
  enabled: true,
  publicSiteUrl: 'https://viora.example',
  legal: {
    providerName: 'Prestador Real',
    taxId: '20-12345678-9',
    contactEmail: 'legal@viora.example',
    phone: '+5492641234567',
    legalDomicile: 'Domicilio confirmado',
  },
  booking: {
    productionUrl: 'https://cal.com/viora/consulta',
    productionApproval: true,
    inPersonLocationApproved: true,
    durationReviewed: true,
    commercialTermsApproved: true,
    withdrawalWorkflowApproved: true,
  },
};

test('preview permits placeholders without enabling publication', () => {
  assert.deepEqual(
    releaseBlockers({ enabled: false, legal: {}, booking: {}, publicSiteUrl: undefined }),
    [],
  );
});

test('complete approved release fixture passes', () => {
  assert.deepEqual(releaseBlockers(validFixture), []);
});

test('release fails closed for legal placeholders and the UAT booking URL', () => {
  const blockers = releaseBlockers({
    ...validFixture,
    legal: { ...validFixture.legal, providerName: '[PENDIENTE — NOMBRE O RAZÓN SOCIAL]' },
    booking: {
      ...validFixture.booking,
      productionUrl: 'https://cal.com/gonzalo-linares-rfbhnf/prueba',
    },
  });
  assert.ok(blockers.includes('legal.providerName'));
  assert.ok(blockers.includes('booking.uat-url'));
});

test('release fails closed for missing or non-HTTPS canonical origins', () => {
  assert.ok(
    releaseBlockers({ ...validFixture, publicSiteUrl: undefined }).includes(
      'PUBLIC_SITE_URL.missing',
    ),
  );
  assert.ok(
    releaseBlockers({ ...validFixture, publicSiteUrl: 'http://viora.example' }).includes(
      'PUBLIC_SITE_URL.invalid',
    ),
  );
});

test('release fails closed while any booking/legal approval is pending', () => {
  const blockers = releaseBlockers({
    ...validFixture,
    booking: { ...validFixture.booking, inPersonLocationApproved: false },
  });
  assert.ok(blockers.includes('booking.in-person-location'));
});

test('release fixture build emits canonical, social metadata and truthful non-medical JSON-LD', () => {
  const env = {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
    VIORA_PUBLIC_RELEASE: 'true',
    PUBLIC_SITE_URL: 'https://viora.fixture.test',
    VIORA_LEGAL_NAME: 'Prestador Fixture',
    VIORA_LEGAL_CUIT: '20-12345678-9',
    VIORA_LEGAL_EMAIL: 'legal@viora.fixture.test',
    VIORA_LEGAL_DOMICILE: 'Domicilio fixture',
    VIORA_BOOKING_URL: 'https://cal.com/viora/consulta',
    VIORA_BOOKING_APPROVED: 'true',
    VIORA_BOOKING_IN_PERSON_APPROVED: 'true',
    VIORA_BOOKING_DURATION_REVIEWED: 'true',
    VIORA_TERMS_APPROVED: 'true',
    VIORA_WITHDRAWAL_APPROVED: 'true',
  };
  execFileSync(
    process.execPath,
    [
      path.join(root, 'apps/estetica/node_modules/astro/bin/astro.mjs'),
      'build',
      '--root',
      path.join(root, 'apps/estetica/tests/viora-release-fixture'),
    ],
    { cwd: root, env, stdio: 'pipe' },
  );
  const html = readFileSync(
    path.join(root, 'apps/estetica/tests/viora-release-fixture/dist/index.html'),
    'utf8',
  );
  assert.match(html, /<meta name="robots" content="index, follow">/);
  assert.match(html, /<link rel="canonical" href="https:\/\/viora\.fixture\.test\/">/);
  assert.match(html, /<meta property="og:url" content="https:\/\/viora\.fixture\.test\/">/);
  assert.match(html, /<meta property="og:title" content="VIORA fixture">/);
  assert.match(html, /<meta property="og:locale" content="es_AR">/);
  assert.match(html, /<meta name="twitter:card" content="summary">/);
  assert.match(html, /<script type="application\/ld\+json">.*?"@type":"BeautySalon"/);
  assert.doesNotMatch(html, /MedicalBusiness|Physician|medicalSpecialty|fixture\.test.*PENDIENTE/);
  assert.doesNotMatch(html, /<meta name="robots" content="noindex/);
  const robots = readFileSync(
    path.join(root, 'apps/estetica/tests/viora-release-fixture/dist/robots.txt'),
    'utf8',
  );
  assert.match(robots, /User-agent: \*\nAllow: \//);
  assert.match(robots, /Sitemap: https:\/\/viora\.fixture\.test\/sitemap\.xml/);
  const sitemap = readFileSync(
    path.join(root, 'apps/estetica/tests/viora-release-fixture/dist/sitemap.xml'),
    'utf8',
  );
  assert.match(sitemap, /<loc>https:\/\/viora\.fixture\.test\/servicios\/depilacion-definitiva\//);
  assert.doesNotMatch(sitemap, /localhost|pages\.dev|preview|404/);
});
