import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('favicon embeds the original white VIORA symbol unchanged on a brand-plum backdrop', () => {
  const icon = readFileSync(
    new URL('../apps/estetica/public/brand/viora-favicon.svg', import.meta.url),
    'utf8',
  );
  assert.match(icon, /fill="#7B4655"/);
  const embedded = icon.match(/data:image\/png;base64,([^"]+)/)?.[1];
  assert.ok(embedded);
  assert.equal(
    createHash('sha256').update(Buffer.from(embedded, 'base64')).digest('hex'),
    '2c9e8920aa913a8f0d6a4cede272f002d246b34058260298a4537d2c61d633a9',
  );
  assert.doesNotMatch(icon, /<text|<path/);
});
