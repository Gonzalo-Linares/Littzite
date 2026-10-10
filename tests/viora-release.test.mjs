import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  isValidCuil,
  normalizeCuil,
  releaseBlockers,
  vioraBookingReadiness,
  vioraWhatsAppHref,
} from '../apps/estetica/src/viora-release.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const esteticaAstroBin = path.join(root, 'apps/estetica/node_modules/astro/bin/astro.mjs');
const validFixture = {
  enabled: true,
  publicSiteUrl: 'https://viora.example',
  legal: {
    providerName: 'Prestador Fixture',
    // Synthetic checksum-valid CUIL fixture; it is not assigned to a real person.
    cuil: '20-00000000-1',
    contactEmail: 'legal@viora.example',
    phone: '+5492641234567',
    legalDomicile: 'Domicilio fixture',
  },
  booking: {
    generalUrl: 'https://cal.com/viora/booking-general',
    depilacionUrl: 'https://cal.com/viora/booking-depilacion',
    productionApproval: true,
    inPersonLocationApproved: true,
    durationReviewed: true,
    commercialTermsApproved: true,
    withdrawalWorkflowApproved: true,
    withdrawalPlacementApproved: true,
  },
};

function buildEsteticaPreview(extraEnv = {}) {
  execFileSync(
    process.execPath,
    [esteticaAstroBin, 'build', '--root', path.join(root, 'apps/estetica')],
    {
      cwd: root,
      env: {
        ...process.env,
        ASTRO_TELEMETRY_DISABLED: '1',
        VIORA_PUBLIC_RELEASE: 'false',
        ...extraEnv,
      },
      stdio: 'pipe',
    },
  );
}

test('preview permits empty placeholders while public release remains disabled', () => {
  assert.deepEqual(
    releaseBlockers({ enabled: false, legal: {}, booking: {}, publicSiteUrl: undefined }),
    [],
  );
});

test('complete approved release fixture passes with both Cal.com agendas', () => {
  assert.deepEqual(releaseBlockers(validFixture), []);
});

test('normalizes supported CUIL formats and validates current human-person prefixes and checksum', () => {
  assert.equal(normalizeCuil('20-00000000-1'), '20000000001');
  assert.equal(normalizeCuil('20000000001'), '20000000001');
  assert.equal(normalizeCuil('20 00000000 1'), undefined);
  assert.equal(isValidCuil('20-00000000-1'), true);
  assert.equal(isValidCuil('20000000001'), true);
  assert.equal(isValidCuil('23-00000000-0'), true);
  assert.equal(isValidCuil('24-00000000-7'), true);
  assert.equal(isValidCuil('27-00000000-6'), true);
  assert.equal(isValidCuil('20-00000000-2'), false);
  assert.equal(isValidCuil('30-10000000-4'), false);
  assert.equal(isValidCuil('30-00000000-7'), false);
  assert.equal(isValidCuil('20 00000000 1'), false);
  assert.equal(isValidCuil('20-0000000-1'), false);
});

test('a missing or placeholder CUIL blocks release', () => {
  for (const cuil of ['', '[PENDIENTE — CUIL]']) {
    const blockers = releaseBlockers({
      ...validFixture,
      legal: { ...validFixture.legal, cuil },
    });
    assert.ok(blockers.includes('legal.cuil'), cuil);
    assert.ok(blockers.includes('legal.cuil.invalid'), cuil);
  }
});

test('release fails closed for each missing production agenda URL', () => {
  assert.ok(
    releaseBlockers({
      ...validFixture,
      booking: { ...validFixture.booking, generalUrl: '' },
    }).includes('booking.general-url.missing'),
  );
  assert.ok(
    releaseBlockers({
      ...validFixture,
      booking: { ...validFixture.booking, depilacionUrl: '[PENDIENTE]' },
    }).includes('booking.depilacion-url.missing'),
  );
});

test('the preview agenda fallbacks are treated as missing production URLs', () => {
  const blockers = releaseBlockers({
    ...validFixture,
    booking: {
      ...validFixture.booking,
      generalUrl: vioraBookingReadiness.generalUrl,
      depilacionUrl: vioraBookingReadiness.depilacionUrl,
    },
  });
  assert.ok(blockers.includes('booking.general-url.missing'));
  assert.ok(blockers.includes('booking.depilacion-url.missing'));
});

test('release validates both Cal.com agenda URLs and rejects temporary event URLs', () => {
  const invalidGeneral = releaseBlockers({
    ...validFixture,
    booking: { ...validFixture.booking, generalUrl: 'https://evil.example/booking' },
  });
  assert.ok(invalidGeneral.includes('booking.general-url.invalid'));

  const invalidDepilacion = releaseBlockers({
    ...validFixture,
    booking: { ...validFixture.booking, depilacionUrl: 'http://cal.com/viora/depilacion' },
  });
  assert.ok(invalidDepilacion.includes('booking.depilacion-url.invalid'));

  const temporaryGeneral = releaseBlockers({
    ...validFixture,
    booking: { ...validFixture.booking, generalUrl: 'https://cal.com/viora/prueba-general' },
  });
  assert.ok(temporaryGeneral.includes('booking.general-url.temporary'));
});

test('release fails closed for missing or non-HTTPS canonical origins', () => {
  assert.ok(
    releaseBlockers({ ...validFixture, publicSiteUrl: undefined }).includes(
      'VIORA_PUBLIC_SITE_URL.missing',
    ),
  );
  assert.ok(
    releaseBlockers({ ...validFixture, publicSiteUrl: 'http://viora.example' }).includes(
      'VIORA_PUBLIC_SITE_URL.invalid',
    ),
  );
});

test('release remains blocked while human booking and legal approvals are pending', () => {
  const blockers = releaseBlockers({
    ...validFixture,
    booking: {
      ...validFixture.booking,
      productionApproval: false,
      inPersonLocationApproved: false,
      durationReviewed: false,
      commercialTermsApproved: false,
      withdrawalWorkflowApproved: false,
      withdrawalPlacementApproved: false,
    },
  });
  for (const blocker of [
    'booking.production-approval',
    'booking.in-person-location',
    'booking.duration-review',
    'commercial.terms-approval',
    'legal.withdrawal-workflow-review',
    'legal.withdrawal-placement-approval',
  ])
    assert.ok(blockers.includes(blocker), blocker);
});

test('WhatsApp is omitted without a valid E.164 number and safely encodes the approved message', () => {
  assert.equal(vioraWhatsAppHref('[PENDIENTE — TELÉFONO / WHATSAPP COMERCIAL]'), undefined);
  assert.equal(vioraWhatsAppHref('264 123 4567'), undefined);
  assert.equal(
    vioraWhatsAppHref('+5492641234567'),
    'https://wa.me/5492641234567?text=Hola%2C%20vi%20VIORA%20en%20la%20web%20y%20quer%C3%ADa%20consultar%20el%20precio%20de%20un%20servicio%20antes%20de%20reservar.',
  );
});

test('configured booking URLs and WhatsApp render on VIORA pages; contact uses approved links without Instagram embeds', () => {
  const generalUrl = 'https://cal.com/viora/fixture-general';
  const depilacionUrl = 'https://cal.com/viora/fixture-depilacion';
  buildEsteticaPreview({
    VIORA_BOOKING_GENERAL_URL: generalUrl,
    VIORA_BOOKING_DEPILACION_URL: depilacionUrl,
    VIORA_LEGAL_PHONE: '+5492641234567',
  });

  const bookingHtml = readFileSync(
    path.join(root, 'apps/estetica/dist/reservar/index.html'),
    'utf8',
  );
  const bookingCards = [
    ...bookingHtml.matchAll(/<article class="viora-booking-card">(.*?)<\/article>/gs),
  ];
  assert.equal(bookingCards.length, 4);
  for (const [service, expectedUrl] of [
    ['Limpieza facial', generalUrl],
    ['Masajes', generalUrl],
    ['Depilación definitiva', depilacionUrl],
  ]) {
    const card = bookingCards.find(([, html]) => html.includes(`<h2>${service}</h2>`))?.[1];
    assert.ok(card, `${service} booking card exists`);
    assert.ok(card.includes(`href="${expectedUrl}"`), `${service} resolves to ${expectedUrl}`);
    assert.ok(
      !card.includes('booking-general-pending') && !card.includes('booking-depilacion-pending'),
    );
  }
  const whatsappHref =
    'https://wa.me/5492641234567?text=Hola%2C%20vi%20VIORA%20en%20la%20web%20y%20quer%C3%ADa%20consultar%20el%20precio%20de%20un%20servicio%20antes%20de%20reservar.';
  assert.ok(
    bookingHtml.includes(`href="${whatsappHref}" target="_blank" rel="noopener noreferrer"`),
  );
  assert.match(bookingHtml, />\s*Consultar por WhatsApp\s*</);

  const contactHtml = readFileSync(
    path.join(root, 'apps/estetica/dist/contacto/index.html'),
    'utf8',
  );
  assert.match(
    contactHtml,
    /VIORA \/ ubicación[\s\S]*?Encontranos[\s\S]*?Rivadavia, San Juan, Argentina/,
  );
  assert.ok(
    contactHtml.includes(
      'href="https://maps.app.goo.gl/H4jmqTGKicDse2iS7" target="_blank" rel="noopener noreferrer"',
    ),
  );
  assert.match(contactHtml, />\s*Cómo llegar\s*</);
  assert.match(contactHtml, /src="https:\/\/www\.google\.com\/maps\/embed\?pb=/);
  assert.match(
    contactHtml,
    /VIORA \/ Instagram[\s\S]*?Seguinos de cerca\.[\s\S]*?@vioramasajes\.ok[\s\S]*?Ver Instagram/,
  );
  assert.ok(
    contactHtml.includes(
      'href="https://www.instagram.com/vioramasajes.ok/" target="_blank" rel="noopener noreferrer"',
    ),
  );
  assert.doesNotMatch(
    contactHtml,
    /<blockquote[^>]*instagram-media|<iframe[^>]+instagram\.com|<script[^>]+instagram/i,
  );
  assert.doesNotMatch(
    readFileSync(path.join(root, 'apps/estetica/src/pages/contacto.astro'), 'utf8'),
    /VioraInstagramLink|showHandle/,
  );

  const css = readFileSync(path.join(root, 'apps/estetica/src/styles/viora.css'), 'utf8');
  assert.match(css, /grid-template-areas:\s*'map details'/);
  assert.match(css, /\.viora-contact__map \.viora-map iframe\s*\{[^}]*aspect-ratio:\s*16 \/ 10/s);
  const responsiveCss = css.slice(css.lastIndexOf('@media (max-width: 900px)'));
  assert.match(responsiveCss, /grid-template-areas:\s*'details'\s*'map'/);
  assert.match(
    responsiveCss,
    /\.viora-contact__map \.viora-map iframe\s*\{[^}]*aspect-ratio:\s*4 \/ 3/s,
  );
});

test('VIORA omits WhatsApp CTAs when the phone is not configured', () => {
  buildEsteticaPreview({
    VIORA_BOOKING_GENERAL_URL: 'https://cal.com/viora/fixture-general',
    VIORA_BOOKING_DEPILACION_URL: 'https://cal.com/viora/fixture-depilacion',
    VIORA_LEGAL_PHONE: '',
  });
  const bookingHtml = readFileSync(
    path.join(root, 'apps/estetica/dist/reservar/index.html'),
    'utf8',
  );
  const contactHtml = readFileSync(
    path.join(root, 'apps/estetica/dist/contacto/index.html'),
    'utf8',
  );
  assert.doesNotMatch(bookingHtml, /Consultar por WhatsApp|PENDIENTE[^<]*TELÉFONO/);
  assert.doesNotMatch(contactHtml, /Escribir por WhatsApp|PENDIENTE[^<]*TELÉFONO/);
});

test('env example keeps VIORA personal and booking values blank and release flags false', () => {
  const envExample = readFileSync(path.join(root, '.env.example'), 'utf8');
  for (const key of [
    'VIORA_LEGAL_NAME',
    'VIORA_LEGAL_CUIL',
    'VIORA_LEGAL_EMAIL',
    'VIORA_LEGAL_PHONE',
    'VIORA_LEGAL_DOMICILE',
    'VIORA_BOOKING_GENERAL_URL',
    'VIORA_BOOKING_DEPILACION_URL',
  ])
    assert.match(envExample, new RegExp(`^${key}=$`, 'm'));
  for (const key of [
    'VIORA_PUBLIC_RELEASE',
    'VIORA_BOOKING_APPROVED',
    'VIORA_BOOKING_IN_PERSON_APPROVED',
    'VIORA_BOOKING_DURATION_REVIEWED',
    'VIORA_TERMS_APPROVED',
    'VIORA_WITHDRAWAL_APPROVED',
    'VIORA_WITHDRAWAL_PLACEMENT_APPROVED',
  ])
    assert.match(envExample, new RegExp(`^${key}=false$`, 'm'));
  assert.doesNotMatch(envExample, /VIORA_LEGAL_CUIT|VIORA_BOOKING_URL/);
});

test('release fixture emits canonical metadata only with synthetic environment values', () => {
  const env = {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
    VIORA_PUBLIC_RELEASE: 'true',
    VIORA_PUBLIC_SITE_URL: 'https://viora.fixture.test',
    PUBLIC_SITE_URL: 'https://legacy-generic.fixture.test',
    VIORA_LEGAL_NAME: 'Prestador Fixture',
    VIORA_LEGAL_CUIL: '20-00000000-1',
    VIORA_LEGAL_EMAIL: 'legal@viora.fixture.test',
    VIORA_LEGAL_PHONE: '+5492641234567',
    VIORA_LEGAL_DOMICILE: 'Domicilio fixture',
    VIORA_BOOKING_GENERAL_URL: 'https://cal.com/viora/booking-general',
    VIORA_BOOKING_DEPILACION_URL: 'https://cal.com/viora/booking-depilacion',
    VIORA_BOOKING_APPROVED: 'true',
    VIORA_BOOKING_IN_PERSON_APPROVED: 'true',
    VIORA_BOOKING_DURATION_REVIEWED: 'true',
    VIORA_TERMS_APPROVED: 'true',
    VIORA_WITHDRAWAL_APPROVED: 'true',
    VIORA_WITHDRAWAL_PLACEMENT_APPROVED: 'true',
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
  assert.doesNotMatch(html, /legacy-generic\.fixture\.test/);
  assert.match(html, /<meta property="og:url" content="https:\/\/viora\.fixture\.test\/">/);
  assert.match(html, /<meta property="og:title" content="VIORA fixture">/);
  assert.match(html, /<meta property="og:locale" content="es_AR">/);
  assert.match(html, /<meta name="twitter:card" content="summary">/);
  assert.match(html, /<script type="application\/ld\+json">.*?"@type":"BeautySalon"/);
  assert.doesNotMatch(html, /MedicalBusiness|Physician|medicalSpecialty|fixture\.test.*PENDIENTE/);
  assert.doesNotMatch(html, /\[PENDIENTE/);
  assert.doesNotMatch(html, /<meta name="robots" content="noindex/);
  const regret = readFileSync(
    path.join(root, 'apps/estetica/tests/viora-release-fixture/dist/arrepentimiento/index.html'),
    'utf8',
  );
  assert.match(regret, /<meta name="robots" content="index, follow">/);
  assert.match(
    regret,
    /<link rel="canonical" href="https:\/\/viora\.fixture\.test\/arrepentimiento\/">/,
  );
  assert.match(
    regret,
    /href="mailto:legal@viora\.fixture\.test\?subject=Solicitud%20de%20arrepentimiento"/,
  );
  assert.match(regret, /BOTÓN DE ARREPENTIMIENTO/);
  assert.doesNotMatch(regret, /\[PENDIENTE/);
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
