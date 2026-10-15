import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import {
  validateCommercialContent,
  formatArs,
  vioraServiceDetails,
  vioraCommercialReadiness,
  commercialReleaseBlockers,
} from '../apps/estetica/src/viora-commercial-content.ts';
import { siteContent } from '../apps/estetica/src/site.config.ts';
import { releaseBlockers } from '../apps/estetica/src/viora-release.ts';
import { approvedCommercialFixture } from './viora-commercial-fixtures.mjs';
test('commercial detail association is complete and rejects unknown, duplicate or missing IDs', () => {
  assert.doesNotThrow(() => validateCommercialContent(siteContent.services, vioraServiceDetails));
  assert.deepEqual(
    vioraServiceDetails.map((d) => d.serviceId).sort(),
    siteContent.services.map((s) => s.id).sort(),
  );
  for (const details of [
    [...vioraServiceDetails, vioraServiceDetails[0]],
    vioraServiceDetails.slice(1),
    [{ ...vioraServiceDetails[0], serviceId: 'unknown' }],
    [{ ...vioraServiceDetails[0], serviceId: 'bad/id' }],
  ])
    assert.throws(() => validateCommercialContent(siteContent.services, details));
});
test('pending pricing has no groups, amounts or duplicated booking data', () => {
  for (const detail of vioraServiceDetails) {
    assert.equal(detail.pricing.status, 'pending');
    assert.deepEqual(detail.pricing.priceGroups, []);
    assert.equal(detail.slug, undefined);
    assert.equal(detail.displayName, undefined);
    assert.equal(detail.bookingTarget, undefined);
  }
  const detail = structuredClone(vioraServiceDetails[0]);
  detail.pricing.priceGroups = [
    { id: 'fake', title: 'Fake', items: [{ id: 'fake', label: 'Fake', amountArs: 12345 }] },
  ];
  assert.throws(() => validateCommercialContent([{ id: detail.serviceId }], [detail]));
});
test('confirmed pricing supports single, from, options, zones and combos with stable unique IDs', () => {
  const detail = approvedCommercialFixture().services[0];
  detail.pricing.priceGroups = ['precio-unico', 'opciones', 'zonas', 'combos'].map((id, index) => ({
    id,
    title: id,
    items: [
      {
        id: id + '-item',
        label: 'Fixture',
        amountArs: 12345 + index,
        prefix: index === 1 ? 'Desde' : undefined,
      },
    ],
  }));
  assert.doesNotThrow(() => validateCommercialContent([{ id: detail.serviceId }], [detail]));
  for (const amount of [-1, 0, NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    const invalid = structuredClone(detail);
    invalid.pricing.priceGroups[0].items[0].amountArs = amount;
    assert.throws(() => validateCommercialContent([{ id: detail.serviceId }], [invalid]));
  }
  const duplicate = structuredClone(detail);
  duplicate.pricing.priceGroups.push(duplicate.pricing.priceGroups[0]);
  assert.throws(() => validateCommercialContent([{ id: detail.serviceId }], [duplicate]));
  const missing = structuredClone(detail);
  delete missing.pricing.priceGroups[0].items[0].amountArs;
  assert.throws(() => validateCommercialContent([{ id: detail.serviceId }], [missing]));
});
test('ARS is formatted once with es-AR and without centavos', () => {
  assert.equal(formatArs(12345).replace(/\s/g, ' '), '$ 12.345');
  assert.equal(formatArs(50000).replace(/\s/g, ' '), '$ 50.000');
  assert.throws(() => formatArs(1.5));
  assert.throws(() => formatArs(-1));
});
test('mandatory media, content and pricing fail closed, while preview remains allowed', () => {
  assert.deepEqual(commercialReleaseBlockers(approvedCommercialFixture()), []);
  const blockers = commercialReleaseBlockers(vioraCommercialReadiness);
  assert.ok(blockers.includes('commercial.professional-image'));
  assert.ok(blockers.includes('commercial.space-image.0'));
  for (const { id } of siteContent.services) {
    assert.ok(blockers.includes('commercial.content.' + id));
    assert.ok(blockers.includes('commercial.pricing.' + id));
  }
  for (const mutate of [
    (f) => {
      f.professional.temporary = true;
    },
    (f) => {
      delete f.professional.src;
    },
    (f) => {
      f.space[0].temporary = true;
    },
    (f) => {
      f.services[0].contentStatus = 'pending';
    },
    (f) => {
      f.services[0].pricing = { status: 'pending', required: true, priceGroups: [] };
    },
  ]) {
    const fixture = approvedCommercialFixture();
    mutate(fixture);
    assert.ok(commercialReleaseBlockers(fixture).length);
  }
  assert.deepEqual(releaseBlockers({ enabled: false }), []);
});
test('Victoria and space stay neutral placeholders with no manufactured photos', () => {
  assert.equal(vioraCommercialReadiness.professional.src, undefined);
  assert.ok(
    vioraCommercialReadiness.space.every((media) => media.src === undefined && media.temporary),
  );
  const home = readFileSync(
    new URL('../apps/estetica/src/pages/index.astro', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(
    home,
    /viora-hero\.jpg|viora-hero-small|Una identidad para cuidar|Un espacio para tu bienestar/,
  );
  assert.match(home, /victoriaMedia\.src/);
  assert.match(home, /focalPosition/);
});

test('confirmed synthetic groups render ARS and canonical booking immediately after prices', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const fixture = new URL('../apps/estetica/tests/viora-pricing-fixture/', import.meta.url);
  execFileSync(
    process.execPath,
    [
      fileURLToPath(new URL('../apps/estetica/node_modules/astro/bin/astro.mjs', import.meta.url)),
      'build',
      '--root',
      fileURLToPath(fixture),
    ],
    {
      cwd: root,
      env: { ...process.env, VIORA_PUBLIC_RELEASE: 'false', ASTRO_TELEMETRY_DISABLED: '1' },
      stdio: 'pipe',
    },
  );
  const html = readFileSync(new URL('dist/index.html', fixture), 'utf8');
  for (const amount of [12345, 23456, 34567, 45678]) assert.ok(html.includes(formatArs(amount)));
  assert.match(html, /Desde/);
  assert.match(html, /Zonas fixture/);
  assert.match(html, /Combos fixture/);
  assert.doesNotMatch(html, /Valores a confirmar/);
  assert.ok(html.indexOf('Combo fixture') < html.indexOf('Reservar turno'));
  assert.ok(
    html.includes(
      'href="' +
        siteContent.bookingTargets.find((t) => t.id === 'booking-general').fallbackUrl +
        '"',
    ),
  );
});

test('VIORA favicon uses the approved botanical monogram PNG derivative', () => {
  const icon = readFileSync(
    new URL('../apps/estetica/public/brand/viora-botanical-icon.png', import.meta.url),
  );
  assert.equal(
    createHash('sha256').update(icon).digest('hex'),
    '3fac5ae91790c27313d12b68be746eb4a799ac4763af1e014b81776348057e52',
  );
  assert.equal(icon.readUInt32BE(16), 64);
  assert.equal(icon.readUInt32BE(20), 64);
});

test('preview labels are non-approved structural samples and cannot carry numeric amounts or release', () => {
  for (const detail of vioraServiceDetails) {
    assert.ok(detail.pricing.previewGroups.length);
    assert.ok(
      detail.pricing.previewGroups.every((g) => g.items.every((i) => i.amountArs === undefined)),
    );
    const invalid = structuredClone(detail);
    invalid.pricing.previewGroups[0].items[0].amountArs = 12345;
    assert.throws(() => validateCommercialContent([{ id: invalid.serviceId }], [invalid]));
  }
  const readiness = approvedCommercialFixture();
  readiness.services[0].pricing = structuredClone(vioraServiceDetails[0].pricing);
  readiness.services[0].pricing.required = false;
  assert.ok(
    commercialReleaseBlockers(readiness).includes(
      'commercial.preview-pricing.' + readiness.services[0].serviceId,
    ),
  );
  const invalid = structuredClone(vioraServiceDetails[0]);
  invalid.pricing.status = 'confirmed';
  assert.throws(() => validateCommercialContent([{ id: invalid.serviceId }], [invalid]));
});

test('first-paint reveal regression: no late JS hide, CSS view timeline only with visible fallback', () => {
  assert.equal(
    existsSync(new URL('../apps/estetica/src/components/VioraReveal.astro', import.meta.url)),
    false,
  );
  const home = readFileSync(
    new URL('../apps/estetica/src/pages/index.astro', import.meta.url),
    'utf8',
  );
  const css = readFileSync(
    new URL('../apps/estetica/src/styles/viora-experience.css', import.meta.url),
    'utf8',
  );
  assert.doesNotMatch(home, /VioraReveal|viora-reveal-pending|style="[^"]*opacity:\s*0/);
  assert.match(css, /@supports \(animation-timeline: view\(\)\)/);
  assert.match(css, /animation-timeline: view\(block\)/);
  assert.match(css, /animation-range: entry/);
  assert.doesNotMatch(css, /viora-reveal-pending|visibility:\s*hidden/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation: none/);
  assert.match(css, /opacity: 1/);
});

test('mobile header is app-local, native without JS, and supports synchronized disclosure and dismissal', () => {
  const source = readFileSync(
    new URL('../apps/estetica/src/components/VioraHeader.astro', import.meta.url),
    'utf8',
  );
  const css = readFileSync(
    new URL('../apps/estetica/src/styles/viora-mobile.css', import.meta.url),
    'utf8',
  );
  assert.match(source, /<details class="viora-mobile-menu">/);
  assert.match(source, /<summary aria-controls="viora-mobile-navigation">/);
  assert.match(source, /setAttribute\('aria-expanded', String\(menu.open\)\)/);
  assert.match(source, /event.key === 'Escape'/);
  assert.match(source, /trigger.focus\(\)/);
  assert.match(source, /pointerdown/);
  assert.match(source, /removeEventListener/);
  assert.match(source, /astro:before-swap/);
  assert.match(css, /height: 64px/);
  assert.match(css, /position: sticky/);
  assert.match(css, /position: absolute/);
  assert.match(css, /focus-visible/);
});

test('botanical frame is decorative SVG and footer meta remains separate from legal navigation', () => {
  const botanical = readFileSync(
    new URL('../apps/estetica/src/components/VioraBotanical.astro', import.meta.url),
    'utf8',
  );
  const layout = readFileSync(
    new URL('../apps/estetica/src/layouts/VioraSiteLayout.astro', import.meta.url),
    'utf8',
  );
  const css = readFileSync(
    new URL('../apps/estetica/src/styles/viora-experience.css', import.meta.url),
    'utf8',
  );
  assert.match(botanical, /aria-hidden="true"/);
  assert.match(botanical, /focusable="false"/);
  assert.match(botanical, /viora-botanical__flowers/);
  assert.doesNotMatch(botanical, /<image|https?:/);
  const legal = layout.match(/<nav class="viora-footer-legal"[\s\S]*?<\/nav>/)?.[0];
  assert.ok(legal);
  assert.doesNotMatch(legal, /Vista previa|No indexable/);
  assert.match(layout, /class="viora-footer-preview"/);
  assert.match(css, /viora-portrait-frame/);
  assert.match(css, /--viora-plum/);
  assert.match(css, /--viora-rose/);
});
