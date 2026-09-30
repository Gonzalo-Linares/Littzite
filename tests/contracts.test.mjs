import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bookingTargetSchema,
  pageSectionSchema,
  serviceActionSchema,
  siteContentSchema,
  siteConfigSchema,
} from '../packages/content-schema/src/index.ts';
import { siteContent as estetica } from '../apps/estetica/src/site.config.ts';
import { siteContent as tattoo } from '../apps/tattoo/src/site.config.ts';

const theme = {
  surface: '#ffffff', text: '#222222', accent: '#334455',
  accentText: '#ffffff', border: '#999999', focus: '#775500',
};

function contrast(first, second) {
  function luminance(hex) {
    const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
    const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
  }
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function fixture() {
  return {
    site: { defaultLocale: 'es-AR', theme, contact: { whatsapp: '+5491112345678' } },
    services: [{
      id: 'sample', slug: 'sample', displayName: 'Fixture', description: 'Solo prueba',
      actions: [
        { id: 'book', type: 'direct-booking', label: 'Reservar', targetId: 'calendar' },
        { id: 'quote', type: 'quote-request', label: 'Consultar', targetId: 'whatsapp' },
      ],
    }],
    pages: [{
      slug: '', title: 'Fixture',
      sections: [{ id: 'services', type: 'service-list', serviceIds: ['sample'] }],
    }],
    bookingTargets: [{ id: 'calendar', providerKey: 'fixture-provider', fallbackUrl: 'https://booking.example.test/' }],
    quoteTargets: [{ id: 'whatsapp', channel: 'whatsapp' }],
  };
}

test('both demo apps validate independently and use different themes', () => {
  assert.equal(siteContentSchema.safeParse(estetica).success, true);
  assert.equal(siteContentSchema.safeParse(tattoo).success, true);
  assert.equal(estetica.site.defaultLocale, 'es-AR');
  assert.equal(tattoo.site.defaultLocale, 'es-AR');
  assert.notDeepEqual(estetica.site.theme, tattoo.site.theme);
  for (const content of [estetica, tattoo]) {
    const { surface, text, accent, accentText, focus } = content.site.theme;
    assert.ok(contrast(surface, text) >= 4.5);
    assert.ok(contrast(accent, accentText) >= 4.5);
    assert.ok(contrast(surface, focus) >= 3);
  }
  assert.deepEqual(estetica.bookingTargets, []);
  assert.deepEqual(tattoo.quoteTargets, []);
});

test('only es-AR and valid theme tokens are accepted', () => {
  assert.equal(siteConfigSchema.safeParse({ defaultLocale: 'es', theme }).success, false);
  assert.equal(siteConfigSchema.safeParse({ defaultLocale: 'en-US', theme }).success, false);
  assert.equal(siteConfigSchema.safeParse({ defaultLocale: 'es-AR', theme: { ...theme, accent: 'red' } }).success, false);
});

test('one service can have direct booking and WhatsApp quote actions', () => {
  const result = siteContentSchema.safeParse(fixture());
  assert.equal(result.success, true);
  assert.equal(result.data.services[0].actions.length, 2);
  assert.equal('whatsapp' in result.data.quoteTargets[0], false);
});

test('discriminants, target types, contacts and cross references are enforced', () => {
  const wrongDiscriminant = { id: 'x', type: 'direct-booking', label: 'Ir', contactMethod: 'phone' };
  assert.equal(serviceActionSchema.safeParse(wrongDiscriminant).success, false);
  assert.equal(pageSectionSchema.safeParse({ id: 'x', type: 'unknown' }).success, false);

  const wrongTarget = fixture();
  wrongTarget.services[0].actions[0].targetId = 'whatsapp';
  assert.equal(siteContentSchema.safeParse(wrongTarget).success, false);

  const missingService = fixture();
  missingService.pages[0].sections[0].serviceIds = ['missing'];
  assert.equal(siteContentSchema.safeParse(missingService).success, false);

  const missingContact = fixture();
  delete missingContact.site.contact;
  assert.equal(siteContentSchema.safeParse(missingContact).success, false);

  const duplicate = fixture();
  duplicate.services.push(structuredClone(duplicate.services[0]));
  assert.equal(siteContentSchema.safeParse(duplicate).success, false);
});

test('external targets require HTTPS and contact numbers require E.164', () => {
  assert.equal(bookingTargetSchema.safeParse({ id: 'x', providerKey: 'p', fallbackUrl: 'http://booking.example.test/' }).success, false);
  assert.equal(bookingTargetSchema.safeParse({ id: 'x', providerKey: 'p', fallbackUrl: 'https://user:secret@booking.example.test/' }).success, false);
  assert.equal(siteConfigSchema.safeParse({ defaultLocale: 'es-AR', theme, canonicalOrigin: 'https://example.test/path' }).success, false);
  const badNumber = fixture();
  badNumber.site.contact.whatsapp = '1112345678';
  assert.equal(siteContentSchema.safeParse(badNumber).success, false);
});

test('VIORA service-list references all services and Juanjo keeps its shared feature-grid', () => {
  const vioraSections = estetica.pages.find((page) => page.slug === '').sections;
  assert.deepEqual(vioraSections.map((section) => section.type), ['intro', 'service-list']);
  const serviceList = vioraSections[1];
  assert.equal(pageSectionSchema.safeParse(serviceList).success, true);
  assert.deepEqual(serviceList.serviceIds, estetica.services.map((service) => service.id));

  const juanjoSections = tattoo.pages.find((page) => page.slug === '').sections;
  assert.deepEqual(juanjoSections.map((section) => section.type), ['intro', 'feature-grid']);
  assert.equal(juanjoSections[1].items.length, 3);
});

test('feature-grid rejects empty text, excess cards and duplicate IDs', () => {
  const base = structuredClone(tattoo);
  const grid = base.pages[0].sections.find((section) => section.type === 'feature-grid');
  const duplicate = structuredClone(base);
  duplicate.pages[0].sections[1].items[1].id = duplicate.pages[0].sections[1].items[0].id;
  assert.equal(siteContentSchema.safeParse(duplicate).success, false);
  assert.equal(pageSectionSchema.safeParse({ ...grid, heading: '' }).success, false);
  assert.equal(pageSectionSchema.safeParse({ ...grid, items: [...grid.items, ...grid.items] }).success, false);
});

test('VIORA theme, voice and four named services match its brand manual', () => {
  assert.deepEqual(estetica.site.theme, {
    surface: '#FAF5F0', text: '#39252D', accent: '#7B4655', accentText: '#FAF5F0',
    border: '#D7BEC4', focus: '#39252D',
  });
  const home = estetica.pages.find((page) => page.slug === '');
  const intro = home.sections.find((section) => section.type === 'intro');
  const serviceList = home.sections.find((section) => section.type === 'service-list');
  assert.equal(intro.heading, 'Regalate una pausa.');
  assert.deepEqual(serviceList.serviceIds, ['limpieza-facial', 'depilacion-definitiva', 'masajes', 'reiki']);
  assert.deepEqual(estetica.services.map(({ displayName, slug }) => [displayName, slug]), [
    ['Limpieza facial', 'limpieza-facial'],
    ['Depilación definitiva', 'depilacion-definitiva'],
    ['Masajes', 'masajes'],
    ['Reiki', 'reiki'],
  ]);
  assert.ok(estetica.services.every((service) => service.actions.length === 0 && service.durationMinutes === 60));
  assert.deepEqual(estetica.bookingTargets, []);
  assert.deepEqual(estetica.quoteTargets, []);
});

test('VIORA service slugs are unique, URL-safe and referenced by the catalog', () => {
  assert.equal(new Set(estetica.services.map((service) => service.slug)).size, 4);
  assert.ok(estetica.services.every((service) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.slug)));

  const duplicateSlug = structuredClone(estetica);
  duplicateSlug.services[1].slug = duplicateSlug.services[0].slug;
  assert.equal(siteContentSchema.safeParse(duplicateSlug).success, false);

  const missingReference = structuredClone(estetica);
  missingReference.pages[0].sections[1].serviceIds[0] = 'missing-service';
  assert.equal(siteContentSchema.safeParse(missingReference).success, false);
});

test('Juanjo brand stays independent and its commercial targets remain inactive', () => {
  assert.deepEqual(tattoo.site.theme, {
    surface: '#17191B', text: '#F8F4ED', accent: '#EF9476',
    accentText: '#17191B', border: '#67696B', focus: '#FFD4B3',
  });
  const home = tattoo.pages.find((page) => page.slug === '');
  assert.equal(home.sections[0].heading, 'De la idea a la piel.');
  assert.deepEqual(home.sections[1].items.map((item) => item.id), [
    'portfolio', 'piezas-pequenas', 'proyectos-grandes',
  ]);
  assert.equal(tattoo.services.length, 0);
  assert.equal(tattoo.bookingTargets.length, 0);
  assert.equal(tattoo.quoteTargets.length, 0);
  assert.equal(tattoo.site.contact, undefined);
});

test('VIORA trial durations are independently editable without enabling booking', () => {
  const trial = structuredClone(estetica);
  assert.equal(trial.services.length, 4);
  assert.deepEqual(trial.services.map(({ durationMinutes }) => durationMinutes), [60, 60, 60, 60]);
  trial.services[0].durationMinutes = 45;
  const parsed = siteContentSchema.parse(trial);
  assert.deepEqual(parsed.services.map(({ durationMinutes }) => durationMinutes), [45, 60, 60, 60]);
  assert.ok(parsed.services.every((service) => service.actions.length === 0));
  assert.deepEqual(parsed.bookingTargets, []);

  trial.services[0].durationMinutes = 0;
  assert.equal(siteContentSchema.safeParse(trial).success, false);
});
