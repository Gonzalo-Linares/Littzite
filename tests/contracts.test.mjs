import assert from 'node:assert/strict';
import test from 'node:test';
import {
  bookingTargetSchema,
  contrastRatio,
  pageSectionSchema,
  pageSchema,
  seoMetadataSchema,
  serviceSchema,
  serviceActionSchema,
  siteContentSchema,
  siteConfigSchema,
} from '../packages/content-schema/src/index.ts';
import { siteContent as estetica } from '../apps/estetica/src/site.config.ts';
import { siteContent as tattoo } from '../apps/tattoo/src/site.config.ts';
import { assertMetadata } from '../scripts/html-metadata.mjs';
import {
  resolveServiceVisual,
  validateServiceVisuals,
} from '../apps/estetica/src/service-visuals.validation.ts';
import {
  resolveDirectBookingAction,
  validateBookingTargets,
} from '../packages/booking/src/index.ts';

const theme = {
  surface: '#ffffff',
  text: '#222222',
  accent: '#334455',
  accentText: '#ffffff',
  border: '#999999',
  focus: '#775500',
};

function fixture() {
  return {
    site: { defaultLocale: 'es-AR', theme, contact: { whatsapp: '+5491112345678' } },
    services: [
      {
        id: 'sample',
        slug: 'sample',
        displayName: 'Fixture',
        description: 'Solo prueba',
        actions: [
          { id: 'book', type: 'direct-booking', label: 'Reservar', targetId: 'calendar' },
          { id: 'quote', type: 'quote-request', label: 'Consultar', targetId: 'whatsapp' },
        ],
      },
    ],
    pages: [
      {
        slug: '',
        seo: { title: 'Fixture', description: 'Descripción de prueba' },
        sections: [{ id: 'services', type: 'service-list', serviceIds: ['sample'] }],
      },
    ],
    bookingTargets: [
      {
        id: 'calendar',
        providerKey: 'fixture-provider',
        fallbackUrl: 'https://booking.example.test/',
      },
    ],
    quoteTargets: [{ id: 'whatsapp', channel: 'whatsapp' }],
  };
}

test('both demo apps validate independently and use different themes', () => {
  assert.equal(siteContentSchema.safeParse(estetica).success, true);
  assert.equal(siteContentSchema.safeParse(tattoo).success, true);
  assert.equal(estetica.site.defaultLocale, 'es-AR');
  assert.equal(tattoo.site.defaultLocale, 'es-AR');
  assert.notDeepEqual(estetica.site.theme, tattoo.site.theme);
  assert.notDeepEqual(estetica.pages[0].seo, tattoo.pages[0].seo);
  for (const content of [estetica, tattoo]) {
    const { surface, text, accent, accentText, focus } = content.site.theme;
    assert.ok(contrastRatio(surface, text) >= 4.5);
    assert.ok(contrastRatio(accent, accentText) >= 4.5);
    assert.ok(contrastRatio(surface, focus) >= 3);
  }
  assert.equal(estetica.bookingTargets.length, 1);
  assert.equal(estetica.bookingTargets[0].providerKey, 'cal-com');
  assert.equal(
    estetica.bookingTargets[0].fallbackUrl,
    'https://cal.com/gonzalo-linares-rfbhnf/prueba',
  );
  assert.deepEqual(tattoo.quoteTargets, []);
});

test('SEO metadata is strict, trimmed, non-empty and required by Page', () => {
  const valid = { title: ' Título ', description: ' Descripción ' };
  assert.deepEqual(seoMetadataSchema.parse(valid), { title: 'Título', description: 'Descripción' });
  assert.equal(seoMetadataSchema.safeParse({ ...valid, title: '' }).success, false);
  assert.equal(seoMetadataSchema.safeParse({ ...valid, description: '' }).success, false);
  assert.equal(seoMetadataSchema.safeParse({ ...valid, description: '  ' }).success, false);
  assert.equal(seoMetadataSchema.safeParse({ ...valid, keywords: ['x'] }).success, false);
  assert.equal(pageSchema.safeParse({ slug: '', seo: valid, sections: [] }).success, true);
  assert.equal(pageSchema.safeParse({ slug: '', sections: [] }).success, false);
  assert.equal(
    pageSchema.safeParse({ slug: '', seo: { ...valid, description: '' }, sections: [] }).success,
    false,
  );
  assert.equal(pageSchema.safeParse({ slug: '', title: 'Legacy', sections: [] }).success, false);
  assert.equal('title' in pageSchema.parse({ slug: '', seo: valid, sections: [] }), false);
});

test('HTML metadata smoke accepts correctly escaped text and attributes', () => {
  const seo = {
    title: 'VIORA <cuidado> & bienestar',
    description: 'Texto con <, >, & y "comillas"',
  };
  const safeHtml =
    '<title>VIORA &lt;cuidado&gt; &amp; bienestar</title><meta name="description" content="Texto con &lt;, &gt;, &amp; y &quot;comillas&quot;">';
  assert.doesNotThrow(() => assertMetadata(safeHtml, seo, 'escape fixture'));
});

test('only es-AR and valid theme tokens are accepted', () => {
  assert.equal(siteConfigSchema.safeParse({ defaultLocale: 'es', theme }).success, false);
  assert.equal(siteConfigSchema.safeParse({ defaultLocale: 'en-US', theme }).success, false);
  assert.equal(
    siteConfigSchema.safeParse({ defaultLocale: 'es-AR', theme: { ...theme, accent: 'red' } })
      .success,
    false,
  );
});

test('SiteConfig accepts an optional root-relative local browser icon only', () => {
  const base = { defaultLocale: 'es-AR', theme };
  assert.equal(siteConfigSchema.safeParse(base).success, true);
  assert.equal(
    siteConfigSchema.safeParse({ ...base, iconHref: '/brand/viora-principal.png' }).success,
    true,
  );
  assert.equal(siteConfigSchema.safeParse({ ...base, iconHref: '' }).success, false);
  assert.equal(
    siteConfigSchema.safeParse({ ...base, iconHref: 'https://example.test/icon.png' }).success,
    false,
  );
  assert.equal(
    siteConfigSchema.safeParse({ ...base, iconHref: 'javascript:alert(1)' }).success,
    false,
  );
  assert.equal(
    siteConfigSchema.safeParse({ ...base, iconHref: '//example.test/icon.png' }).success,
    false,
  );
  assert.equal(siteConfigSchema.safeParse({ ...base, iconHref: '/../icon.png' }).success, false);
  assert.equal(estetica.site.iconHref, '/brand/viora-principal.png');
  assert.equal('iconHref' in tattoo.site, false);
});

test('VIORA visuals validate optional service references and image alternatives independently', () => {
  const services = [{ id: 'sample' }, { id: 'future-service' }];
  const image = { src: '/sample.jpg', width: 1400, height: 900, format: 'jpg' };
  const smallImage = { src: '/sample-small.jpg', width: 640, height: 411, format: 'jpg' };
  const primaryOnly = {
    serviceId: 'sample',
    primary: image,
    primaryAlt: 'Una imagen editorial de prueba.',
  };

  assert.doesNotThrow(() => validateServiceVisuals(services, []));
  assert.equal(resolveServiceVisual([], 'future-service'), undefined);
  assert.equal(resolveServiceVisual([primaryOnly], 'future-service'), undefined);
  assert.equal(resolveServiceVisual([primaryOnly], 'sample'), primaryOnly);
  assert.doesNotThrow(() => validateServiceVisuals(services, [primaryOnly]));
  assert.doesNotThrow(() =>
    validateServiceVisuals(services, [{ ...primaryOnly, primarySmall: smallImage }]),
  );
  assert.doesNotThrow(() =>
    validateServiceVisuals(services, [
      { ...primaryOnly, reveal: image, revealAlt: 'Una segunda imagen editorial.' },
    ]),
  );
  assert.throws(
    () => validateServiceVisuals(services, [{ ...primaryOnly, serviceId: 'missing' }]),
    /unknown VIORA service/,
  );
  assert.throws(
    () => validateServiceVisuals(services, [primaryOnly, primaryOnly]),
    /Duplicate VIORA visual/,
  );
  assert.throws(
    () => validateServiceVisuals(services, [{ ...primaryOnly, primaryAlt: '  ' }]),
    /Primary image alt is required/,
  );
  assert.throws(
    () => validateServiceVisuals(services, [{ ...primaryOnly, reveal: image }]),
    /Reveal image alt is required/,
  );
  assert.throws(
    () => validateServiceVisuals(services, [{ ...primaryOnly, revealAlt: 'Alt sin imagen.' }]),
    /Reveal alt requires/,
  );
  assert.throws(
    () => validateServiceVisuals(services, [{ ...primaryOnly, primary: { ...image, width: 0 } }]),
    /Invalid primary image/,
  );
  assert.throws(
    () => validateServiceVisuals(services, [{ ...primaryOnly, primarySmall: image }]),
    /Invalid responsive primary image/,
  );
  assert.throws(
    () => validateServiceVisuals(services, [{ ...primaryOnly, revealSmall: smallImage }]),
    /Reveal variant requires a reveal image/,
  );
});

test("all future brand themes enforce semantic contrast, not just today's two apps", () => {
  const base = { defaultLocale: 'es-AR', theme };
  assert.equal(siteConfigSchema.safeParse(base).success, true);
  assert.equal(
    siteConfigSchema.safeParse({ ...base, theme: { ...theme, text: '#fefefe' } }).success,
    false,
  );
  assert.equal(
    siteConfigSchema.safeParse({ ...base, theme: { ...theme, accentText: '#334456' } }).success,
    false,
  );
  assert.equal(
    siteConfigSchema.safeParse({ ...base, theme: { ...theme, focus: '#ffffff' } }).success,
    false,
  );
});

test('one service can have direct booking and WhatsApp quote actions', () => {
  const result = siteContentSchema.safeParse(fixture());
  assert.equal(result.success, true);
  assert.equal(result.data.services[0].actions.length, 2);
  assert.equal('whatsapp' in result.data.quoteTargets[0], false);
});

test('discriminants, target types, contacts and cross references are enforced', () => {
  const wrongDiscriminant = {
    id: 'x',
    type: 'direct-booking',
    label: 'Ir',
    contactMethod: 'phone',
  };
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
  assert.equal(
    bookingTargetSchema.safeParse({
      id: 'x',
      providerKey: 'p',
      fallbackUrl: 'http://booking.example.test/',
    }).success,
    false,
  );
  assert.equal(
    bookingTargetSchema.safeParse({
      id: 'x',
      providerKey: 'p',
      fallbackUrl: 'https://user:secret@booking.example.test/',
    }).success,
    false,
  );
  assert.equal(
    siteConfigSchema.safeParse({
      defaultLocale: 'es-AR',
      theme,
      canonicalOrigin: 'https://example.test/path',
    }).success,
    false,
  );
  const badNumber = fixture();
  badNumber.site.contact.whatsapp = '1112345678';
  assert.equal(siteContentSchema.safeParse(badNumber).success, false);
});

test('VIORA landing derives discovery from services and Juanjo keeps its shared feature-grid', () => {
  const vioraSections = estetica.pages.find((page) => page.slug === '').sections;
  assert.deepEqual(
    vioraSections.map((section) => section.type),
    ['intro'],
  );
  assert.ok(estetica.services.length > 0);
  assert.deepEqual(pageSectionSchema.safeParse(vioraSections[0]).success, true);

  const juanjoSections = tattoo.pages.find((page) => page.slug === '').sections;
  assert.deepEqual(
    juanjoSections.map((section) => section.type),
    ['intro', 'feature-grid'],
  );
  assert.equal(juanjoSections[1].items.length, 3);
});

test('feature-grid rejects empty text, excess cards and duplicate IDs', () => {
  const base = structuredClone(tattoo);
  const grid = base.pages[0].sections.find((section) => section.type === 'feature-grid');
  const duplicate = structuredClone(base);
  duplicate.pages[0].sections[1].items[1].id = duplicate.pages[0].sections[1].items[0].id;
  assert.equal(siteContentSchema.safeParse(duplicate).success, false);
  assert.equal(pageSectionSchema.safeParse({ ...grid, heading: '' }).success, false);
  assert.equal(
    pageSectionSchema.safeParse({ ...grid, items: [...grid.items, ...grid.items] }).success,
    false,
  );
});

test('VIORA theme, voice and four named services match its brand manual', () => {
  assert.deepEqual(estetica.site.theme, {
    surface: '#FAF5F0',
    text: '#39252D',
    accent: '#7B4655',
    accentText: '#FAF5F0',
    border: '#D7BEC4',
    focus: '#39252D',
  });

  const home = estetica.pages.find((page) => page.slug === '');
  const intro = home.sections.find((section) => section.type === 'intro');
  assert.equal(intro.heading, 'Regalate una pausa.');
  assert.equal(
    home.sections.some((section) => section.type === 'service-list'),
    false,
  );
  assert.deepEqual(
    estetica.services.map(({ displayName, slug }) => [displayName, slug]),
    [
      ['Limpieza facial', 'limpieza-facial'],
      ['Depilación definitiva', 'depilacion-definitiva'],
      ['Masajes', 'masajes'],
      ['Reiki', 'reiki'],
    ],
  );
  const depilation = estetica.services.find(({ id }) => id === 'depilacion-definitiva');
  assert.deepEqual(depilation.actions, [
    {
      id: 'reservar',
      type: 'direct-booking',
      label: 'Sacar turno',
      targetId: 'booking-depilacion-definitiva',
    },
  ]);
  assert.ok(
    estetica.services
      .filter(({ id }) => id !== 'depilacion-definitiva')
      .every(({ actions }) => actions.length === 0),
  );
  assert.equal(validateBookingTargets(estetica.bookingTargets), undefined);
  assert.equal(
    resolveDirectBookingAction(depilation.actions[0], estetica.bookingTargets).href,
    'https://cal.com/gonzalo-linares-rfbhnf/prueba',
  );
  assert.deepEqual(estetica.quoteTargets, []);
});

test('VIORA focal positions stay within supported horizontal and vertical values', () => {
  const services = [{ id: 'sample' }];
  const image = { src: '/sample.jpg', width: 1400, height: 900, format: 'jpg' };
  const validPositions = [
    '0% 0%',
    '50% 52%',
    '100% 100%',
    'left top',
    'center center',
    'right bottom',
    'right 35%',
  ];
  const invalidPositions = ['101% 50%', '50% 101%', '999% 999%', '-1% 50%', '50px 50%', '50'];

  for (const focalPosition of validPositions) {
    assert.doesNotThrow(
      () =>
        validateServiceVisuals(services, [
          {
            serviceId: 'sample',
            primary: image,
            primaryAlt: 'Una imagen editorial.',
            focalPosition,
          },
        ]),
      focalPosition,
    );
  }
  for (const focalPosition of invalidPositions) {
    assert.throws(
      () =>
        validateServiceVisuals(services, [
          {
            serviceId: 'sample',
            primary: image,
            primaryAlt: 'Una imagen editorial.',
            focalPosition,
          },
        ]),
      /Invalid focal position/,
      focalPosition,
    );
  }
});

test('VIORA service slugs are unique and URL-safe for the app-local rail and catalog', () => {
  assert.equal(new Set(estetica.services.map((service) => service.slug)).size, 4);
  assert.ok(estetica.services.every((service) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.slug)));

  const duplicateSlug = structuredClone(estetica);
  duplicateSlug.services[1].slug = duplicateSlug.services[0].slug;
  assert.equal(siteContentSchema.safeParse(duplicateSlug).success, false);

  assert.ok(estetica.services.length > 0);
});

test('Juanjo brand stays independent and its commercial targets remain inactive', () => {
  assert.deepEqual(tattoo.site.theme, {
    surface: '#17191B',
    text: '#F8F4ED',
    accent: '#EF9476',
    accentText: '#17191B',
    border: '#67696B',
    focus: '#FFD4B3',
  });
  const home = tattoo.pages.find((page) => page.slug === '');
  assert.equal(home.sections[0].heading, 'De la idea a la piel.');
  assert.deepEqual(
    home.sections[1].items.map((item) => item.id),
    ['portfolio', 'piezas-pequenas', 'proyectos-grandes'],
  );
  assert.equal(tattoo.services.length, 0);
  assert.equal(tattoo.bookingTargets.length, 0);
  assert.equal(tattoo.quoteTargets.length, 0);
  assert.equal(tattoo.site.contact, undefined);
});

test('Service rejects the former durationMinutes field strictly', () => {
  const validService = {
    id: 'service-a',
    slug: 'service-a',
    displayName: 'Service A',
    description: 'A generic service for testing.',
    actions: [],
  };
  assert.equal(serviceSchema.safeParse(validService).success, true);
  assert.equal(serviceSchema.safeParse({ ...validService, durationMinutes: 60 }).success, false);
});
