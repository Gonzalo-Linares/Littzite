import { approvedCommercialFixture } from './viora-commercial-fixtures.mjs';
import assert from 'node:assert/strict';
import {
  validateBookingTargets,
  resolveDirectBookingAction,
} from '../packages/booking/src/index.ts';
import { siteContent } from '../apps/estetica/src/site.config.ts';
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
  vioraBookingTargetUrls,
  vioraWhatsAppHref,
} from '../apps/estetica/src/viora-release.ts';

const root = fileURLToPath(new URL('../', import.meta.url));
const esteticaAstroBin = path.join(root, 'apps/estetica/node_modules/astro/bin/astro.mjs');
const validFixture = {
  commercial: approvedCommercialFixture(),
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

test('retired preview URLs remain release blockers and are never approved defaults', () => {
  const blockers = releaseBlockers({
    ...validFixture,
    booking: {
      ...validFixture.booking,
      generalUrl: 'https://cal.com/viora/booking-general-pending',
      depilacionUrl: 'https://cal.com/viora/booking-depilacion-pending',
    },
  });
  assert.ok(blockers.includes('booking.general-url.missing'));
  assert.ok(blockers.includes('booking.depilacion-url.missing'));
});

test('approved defaults resolve canonical targets exactly and preserve the depilation query', () => {
  const general = 'https://cal.com/maria-victoria-linares-b6rvoz/lashista';
  const depilacion =
    'https://cal.com/maria-victoria-linares-b6rvoz/depilacion?overlayCalendar=true';
  assert.equal(vioraBookingReadiness.generalUrl, general);
  assert.equal(vioraBookingReadiness.depilacionUrl, depilacion);
  assert.deepEqual(vioraBookingTargetUrls, { general, depilacion });
  assert.doesNotThrow(() => validateBookingTargets(siteContent.bookingTargets));
  for (const [slug, expected] of [
    ['limpieza-facial', general],
    ['masajes', general],
    ['depilacion-definitiva', depilacion],
  ]) {
    const service = siteContent.services.find((item) => item.slug === slug);
    const action = service.actions.find((item) => item.type === 'direct-booking');
    assert.equal(resolveDirectBookingAction(action, siteContent.bookingTargets).href, expected);
  }
  assert.equal(new URL(depilacion).search, '?overlayCalendar=true');
});

test('preview without environment overrides renders approved booking destinations', () => {
  buildEsteticaPreview({ VIORA_BOOKING_GENERAL_URL: '', VIORA_BOOKING_DEPILACION_URL: '' });
  for (const [slug, url] of [
    ['limpieza-facial', vioraBookingTargetUrls.general],
    ['masajes', vioraBookingTargetUrls.general],
    ['depilacion-definitiva', vioraBookingTargetUrls.depilacion],
  ]) {
    const html = readFileSync(
      path.join(root, 'apps/estetica/dist/servicios', slug, 'index.html'),
      'utf8',
    );
    assert.ok(html.includes('href="' + url + '"'));
    assert.doesNotMatch(html, /booking-general-pending|booking-depilacion-pending/);
  }
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
  assert.match(bookingHtml, /http-equiv="refresh" content="0;url=\/servicios\/"/);
  for (const [slug, expectedUrl] of [
    ['limpieza-facial', generalUrl],
    ['masajes', generalUrl],
    ['depilacion-definitiva', depilacionUrl],
  ]) {
    const detail = readFileSync(
      path.join(root, 'apps/estetica/dist/servicios', slug, 'index.html'),
      'utf8',
    );
    assert.ok(detail.includes('href="' + expectedUrl + '"'), slug + ' keeps its canonical target');
    assert.doesNotMatch(detail, /booking-general-pending|booking-depilacion-pending/);
  }
  const whatsappHref =
    'https://wa.me/5492641234567?text=Hola%2C%20vi%20VIORA%20en%20la%20web%20y%20quer%C3%ADa%20consultar%20el%20precio%20de%20un%20servicio%20antes%20de%20reservar.';
  const contactHtml = readFileSync(
    path.join(root, 'apps/estetica/dist/contacto/index.html'),
    'utf8',
  );
  assert.ok(
    contactHtml.includes('href="' + whatsappHref + '" target="_blank" rel="noopener noreferrer"'),
  );
  assert.match(
    contactHtml,
    /<h1[^>]*>Contacto<\/h1>[\s\S]*?<iframe[\s\S]*?Rivadavia, San Juan, Argentina/,
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
    /href="https:\/\/www\.instagram\.com\/vioramasajes\.ok\/"[^>]*>[\s\S]*?Escribir por Instagram/,
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

test('actual public release stays blocked despite complete legal and booking environment', () => {
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
  assert.throws(
    () =>
      execFileSync(
        process.execPath,
        [
          esteticaAstroBin,
          'build',
          '--root',
          path.join(root, 'apps/estetica/tests/viora-release-fixture'),
        ],
        { cwd: root, env, stdio: 'pipe' },
      ),
    (error) => {
      const output = String(error.stdout) + String(error.stderr);
      assert.match(output, /VIORA public release blocked/);
      assert.match(output, /commercial.professional-image/);
      assert.match(output, /commercial.pricing.limpieza-facial/);
      return true;
    },
  );
});
