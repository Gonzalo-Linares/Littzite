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
