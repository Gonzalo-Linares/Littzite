import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { access, readFile } from 'node:fs/promises';
import { siteConfigSchema } from '../packages/content-schema/src/index.ts';
import { assertMetadata } from './html-metadata.mjs';
import { verifyInternalLinks } from './verify-site-links.mjs';

const expectedTitles = {
  estetica: 'VIORA · Estética integral',
  tattoo: 'Juanjo Tattoo Studio | Tu próximo tatuaje empieza acá',
};

const app = process.argv[2];
assert.ok(Object.hasOwn(expectedTitles, app), `Unknown app: ${app}`);
assert.equal(siteConfigSchema.safeParse({ defaultLocale: 'es' }).success, false);
const tattooBookingUrl =
  'https://cal.com/juanjo-pereyra-mkzgce/turnos-tattoos?overlayCalendar=true';

const { siteContent } = await import(`../apps/${app}/src/site.config.ts`);
const html = await readFile(new URL(`../apps/${app}/dist/index.html`, import.meta.url), 'utf8');
const assertBrowserIcon = (markup, href, label) => {
  const icons = markup.match(/<link\b(?=[^>]*\brel="icon")[^>]*>/g) ?? [];
  assert.equal(icons.length, href ? 1 : 0, `${label}: unexpected browser icon count`);
  if (href) assert.ok(icons[0].includes(`href="${href}"`), `${label}: wrong browser icon`);
};
assert.equal(
  (html.match(/<header class="site-header">/g) ?? []).length,
  1,
  `${app}: expected one header`,
);
assert.equal(
  (html.match(/<footer class="site-footer">/g) ?? []).length,
  1,
  `${app}: expected one footer`,
);
assert.match(html, /<html lang="es-AR"(?:\s|>)/);
assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
assert.match(html, /<meta property="og:type" content="website">/);
assert.match(html, /<meta property="og:title" content=/);
assert.match(html, /<meta property="og:description" content=/);
assert.match(html, /<meta name="twitter:card" content="summary">/);
assert.match(html, /<meta name="twitter:title" content=/);
assert.match(html, /<meta name="twitter:description" content=/);
assertMetadata(html, siteContent.pages.find((page) => page.slug === '').seo, app);
assertBrowserIcon(html, siteContent.site.iconHref, `${app} home`);
const renderedHeading = html
  .match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]
  .replace(/<[^>]+>/g, '')
  .replace(/\s+/g, ' ')
  .trim();
assert.equal(
  renderedHeading,
  app === 'estetica' ? 'Regalate una pausa.' : 'Tu próximo tatuaje empieza acá.',
  'Expected approved home heading',
);
assert.ok(html.includes('class="site-header"'), 'Shared header missing');
assert.ok(html.includes('class="site-footer"'), 'Shared footer missing');
if (app === 'estetica') {
  const uatBookingUrl = 'https://cal.com/gonzalo-linares-rfbhnf/prueba';
  const bookingTarget = siteContent.bookingTargets.find(
    ({ id }) => id === 'booking-depilacion-definitiva',
  );
  assert.equal(siteContent.bookingTargets.length, 1, 'VIORA must have only the UAT target');
  assert.deepEqual(bookingTarget, {
    id: 'booking-depilacion-definitiva',
    providerKey: 'cal-com',
    fallbackUrl: uatBookingUrl,
  });
  const depilation = siteContent.services.find(({ id }) => id === 'depilacion-definitiva');
  assert.deepEqual(depilation?.actions, [
    {
      id: 'reservar',
      type: 'direct-booking',
      label: 'Sacar turno',
      targetId: 'booking-depilacion-definitiva',
    },
  ]);
  assert.ok(
    siteContent.services
      .filter(({ id }) => id !== 'depilacion-definitiva')
      .every(({ actions }) => actions.length === 0),
    'Only depilación definitiva may have a UAT booking action',
  );
  const { resolveDirectBookingAction } = await import('../packages/booking/src/index.ts');
  const resolvedUatAction = resolveDirectBookingAction(
    depilation.actions[0],
    siteContent.bookingTargets,
  );
  assert.equal(resolvedUatAction.providerKey, 'cal-com');
  assert.equal(resolvedUatAction.href, uatBookingUrl);
  const railSource = await readFile(
    new URL('../apps/estetica/src/components/VioraServiceRail.astro', import.meta.url),
    'utf8',
  );
  assert.match(railSource, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(railSource, /setInterval|autoplay/i);
  const vioraStyles = await readFile(
    new URL('../apps/estetica/src/styles/viora.css', import.meta.url),
    'utf8',
  );
  assert.match(
    vioraStyles,
    /@view-transition\s*\{\s*navigation:\s*auto;/,
    'VIORA should opt into progressive cross-document transitions',
  );
  assert.match(
    vioraStyles,
    /@media\s*\(prefers-reduced-motion:\s*reduce\)/,
    'VIORA must respect reduced motion',
  );
  assert.match(
    vioraStyles,
    /animation-timeline:\s*view\(\)/,
    'VIORA scroll reveals should use CSS view timelines progressively',
  );
  assert.doesNotMatch(
    vioraStyles,
    /clip-path:\s*polygon\(/,
    'VIORA imagery must not use a diagonal reveal',
  );
  const assertVioraFrame = (markup, page) => {
    assert.equal(
      (markup.match(/<header class="site-header">/g) ?? []).length,
      1,
      `${page}: expected one VIORA header`,
    );
    assert.equal(
      (markup.match(/<footer class="site-footer">/g) ?? []).length,
      1,
      `${page}: expected one VIORA footer`,
    );
    assert.ok(
      markup.includes('href="/" class="site-mark"'),
      `${page}: logo must return to the home page`,
    );
    assert.match(markup, /<a href="\/">Inicio<\/a>/, `${page}: Inicio link must target /`);
    assert.match(
      markup,
      /<a href="\/servicios\/">Servicios<\/a>/,
      `${page}: Services route missing`,
    );
    assert.match(markup, /<a href="\/viora\/">VIORA<\/a>/, `${page}: VIORA route missing`);
    assert.match(markup, /<a href="\/contacto\/">Contacto<\/a>/, `${page}: Contact route missing`);
    assert.match(
      markup,
      /<a class="viora-instagram-link viora-header-instagram" href="https:\/\/www\.instagram\.com\/vioramasajes\.ok\/" aria-label="VIORA en Instagram">/,
      `${page}: accessible Instagram header link missing`,
    );
    assert.match(
      markup,
      /class="button-link button-link--primary button-link--compact site-header__badge" href="\/reservar\/">\s*Turnos/,
    );
    const footerNav = markup.match(
      /<nav class="viora-footer-links" aria-label="Navegación del pie de página">(.*?)<\/nav>/s,
    )?.[1];
    assert.ok(footerNav, `${page}: VIORA footer navigation missing`);
    assert.match(footerNav, /href="\/servicios\/"[^>]*>\s*Servicios/);
    assert.match(footerNav, /href="\/viora\/"[^>]*>\s*VIORA/);
    assert.match(footerNav, /href="\/contacto\/"[^>]*>\s*Contacto/);
    assert.match(footerNav, /href="\/reservar\/"[^>]*>\s*Turnos/);
    const footer = markup.match(/<footer class="site-footer">([\s\S]*?)<\/footer>/)?.[1];
    assert.ok(footer, `${page}: footer missing`);
    const attribution = footer.match(
      /<div class="site-attribution viora-footer-attribution">([\s\S]*?)<\/div>/,
    )?.[1];
    assert.ok(attribution, `${page}: developer attribution missing`);
    assert.match(attribution, /Powered by/);
    assert.match(attribution, /Littzite/);
    assert.match(attribution, /src="\/littzite\/horizontal-dark\.svg" alt="Littzite"/);
    assert.doesNotMatch(attribution, /<a\b|href=/);
    assert.match(footer, /class="container site-footer__secondary"/);
    assert.doesNotMatch(
      footer,
      /instagram|vioramasajes/i,
      `${page}: footer must not contain Instagram`,
    );
    const legalFooter = markup.match(
      /<nav class="viora-footer-legal" aria-label="Información legal">([\s\S]*?)<\/nav>/,
    )?.[1];
    assert.ok(legalFooter, `${page}: legal footer links missing`);
    assert.match(
      legalFooter,
      /<a class="viora-footer-link" href="\/arrepentimiento\/">\s*BOTÓN DE ARREPENTIMIENTO/,
    );
    assert.doesNotMatch(legalFooter, /button-link|<button/);
    assert.match(markup, /href="#inicio"[^>]*>\s*Volver arriba/);
    assert.ok(markup.includes('/brand/viora-horizontal.png'), `${page}: horizontal logo missing`);
    assert.ok(markup.includes('/brand/viora-palabra.png'), `${page}: wordmark missing`);
    assertBrowserIcon(markup, siteContent.site.iconHref, page);
  };
  assertVioraFrame(html, 'home');
  assert.ok(html.includes('class="viora-site"'), 'VIORA-only body style missing');
  assert.ok(html.includes('/brand/viora-horizontal.png'), 'VIORA header asset missing');
  assert.match(html, /class="viora-hero-photo-frame"/, 'VIORA editorial hero photograph missing');
  assert.doesNotMatch(
    html,
    /class="viora-hero-logo"/,
    'VIORA hero should not be a giant logo poster',
  );
  const heroImageTag = html.match(/<img\b(?=[^>]*class="viora-hero-photo")[^>]*>/)?.[0];
  assert.ok(heroImageTag, 'VIORA hero photo image missing');
  assert.ok(html.includes('/brand/viora-palabra.png'), 'VIORA footer asset missing');
  assert.ok(html.includes('class="viora-home-teaser viora-home-teaser--story"'));
  assert.doesNotMatch(html, /viora-moment-teaser/);
  assert.ok(html.includes('class="viora-contact-teaser"'));
  assert.doesNotMatch(html, /class="viora-moment"/, 'Full moment narrative belongs on /viora/');
  assert.doesNotMatch(html, /class="viora-contact__map"/, 'The map panel belongs on /contacto/');
  assert.ok(html.includes('aria-label="Navegación del pie de página"'));
  assert.ok(html.includes('href="/contacto/">Contacto</a>'));
  assert.doesNotMatch(html, /Ver todos los servicios/);
  assert.doesNotMatch(html, /viora-regret-access/);
  assert.equal((html.match(/BOTÓN DE ARREPENTIMIENTO/g) ?? []).length, 1);
  assert.match(html, /href="\/viora\/"[^>]*>\s*Conocé VIORA/);
  assert.match(html, /href="\/contacto\/"[^>]*>\s*Ver contacto/);
  assert.match(
    html,
    /class="button-link button-link--primary button-link--default" href="\/servicios\/"/,
  );
  assert.doesNotMatch(html, /VIORA \/ 01|viora-catalog__card-number|referencias ilustrativas/);
  assert.match(html, /UN RESPIRO PARA VOS/);
  assert.match(html, /<span class="viora-service-rail__affordance">Ver experiencia<\/span>/);
  assert.doesNotMatch(html, /href="\/(?:#alcance|#esencia|#contacto|#viora-moment-title)"/);
  assert.ok(!/<iframe\b/i.test(html), 'VIORA home must not embed a map');
  assert.equal((html.match(/instagram\.com\/vioramasajes\.ok\//g) ?? []).length, 1);
  assert.ok(
    !/(?:cal\.com|booking\.example|wa\.me|api\.whatsapp)/i.test(html),
    'No commercial destination may be published',
  );
  assert.ok(
    !/<a[^>]*>[^<]*(Reservar|Agendar|Consultar)[^<]*<\/a>/i.test(html),
    'VIORA home must not publish a commercial booking CTA',
  );
  const { access } = await import('node:fs/promises');
  for (const asset of ['viora-horizontal.png', 'viora-principal.png', 'viora-palabra.png']) {
    await access(new URL(`../apps/estetica/dist/brand/${asset}`, import.meta.url));
  }
  assert.equal(
    (html.match(/class="viora-service-rail__card(?:\s[^"]*)?"/g) ?? []).length,
    4,
    'Expected four VIORA service cards',
  );
  const homeVisualImages = Array.from(
    html.matchAll(
      /<img\b(?=[^>]*class="viora-service-visual__layer viora-service-visual__(?:image|reveal)")[^>]*>/g,
    ),
    ([tag]) => tag,
  );
  assert.equal(
    homeVisualImages.length,
    8,
    'Expected primary and reveal images for each configured VIORA service',
  );
  const assertResponsiveImage = (tag, label) => {
    const candidates = tag.match(/\bsrcset="([^"]+)"/)?.[1].split(', ') ?? [];
    assert.equal(candidates.length, 2, `${label}: expected small and large local image candidates`);
    assert.match(
      candidates[0],
      /\/_astro\/[^ ]+\s640w$/,
      `${label}: small candidate must advertise its real width`,
    );
    assert.match(
      candidates[1],
      /\/_astro\/[^ ]+\s1400w$/,
      `${label}: large candidate must advertise its real width`,
    );
    assert.notEqual(
      candidates[0].split(' ')[0],
      candidates[1].split(' ')[0],
      `${label}: srcset candidates must use distinct files`,
    );
    assert.match(tag, /\bsizes="[^"]+"/, `${label}: srcset must declare rendered size hints`);
  };
  assertResponsiveImage(heroImageTag, 'VIORA hero image');
  for (const [index, tag] of homeVisualImages.entries()) {
    assert.match(
      tag,
      /\bsrc="\/_astro\/[^"]+\.jpg"/,
      `VIORA catalog image ${index + 1}: expected a bundled local source`,
    );
    if (index % 2 === 0) {
      assert.match(tag, /class="viora-service-visual__layer viora-service-visual__image"/);
      assert.match(
        tag,
        /\balt="[^"]+"/,
        `VIORA catalog primary image ${index / 2 + 1}: expected descriptive alt text`,
      );
    } else
      assert.match(
        tag,
        /\balt=""/,
        `VIORA catalog crossfade layer ${index + 1}: should be decorative for assistive technology`,
      );
    assert.match(
      tag,
      /\bwidth="\d+"[^>]*\bheight="\d+"|\bheight="\d+"[^>]*\bwidth="\d+"/,
      `VIORA catalog image ${index + 1}: expected intrinsic dimensions`,
    );
    assertResponsiveImage(tag, `VIORA catalog image ${index + 1}`);
  }
  for (const service of siteContent.services) {
    assert.ok(
      html.includes(`<h3>${service.displayName}</h3>`),
      `${service.slug}: card title missing`,
    );
    assert.ok(html.includes(service.description), `${service.slug}: card description missing`);
    assert.ok(
      html.includes(`href="/servicios/${service.slug}/"`),
      `${service.slug}: card link missing`,
    );
    assert.ok(
      html.includes(`viora-service-image-${service.slug}`),
      `${service.slug}: card image transition name missing`,
    );
    const route = new URL(
      `../apps/estetica/dist/servicios/${service.slug}/index.html`,
      import.meta.url,
    );
    const detail = await readFile(route, 'utf8');
    const detailSeo = {
      title: `${service.displayName} | VIORA · Estética integral`,
      description: service.description,
    };
    assertMetadata(detail, detailSeo, service.slug);
    assert.ok(
      detail.includes(`view-transition-name: viora-service-${service.slug}`),
      `${service.slug}: shared transition name missing from detail`,
    );
    assert.ok(
      detail.includes(`viora-service-image-${service.slug}`),
      `${service.slug}: detail image transition name missing`,
    );
    assert.notEqual(
      detailSeo.title,
      siteContent.pages[0].seo.title,
      `${service.slug}: detail title must differ from home`,
    );
    assertVioraFrame(detail, service.slug);
    const detailVisualImages = Array.from(
      detail.matchAll(
        /<img\b(?=[^>]*class="viora-service-visual__layer viora-service-visual__image")[^>]*>/g,
      ),
      ([tag]) => tag,
    );
    assert.equal(
      detailVisualImages.length,
      2,
      `${service.slug}: expected primary and separate secondary image`,
    );
    assert.match(detail, /<figure[^>]*viora-service-visual--detail-primary/);
    assert.match(detail, /<figure[^>]*viora-service-visual--detail-secondary/);
    assert.ok(detailVisualImages.every((tag) => tag.includes('viora-service-visual__image')));
    assert.doesNotMatch(
      detail,
      /viora-service-visual__reveal/,
      `${service.slug}: detail must not contain a split/reveal layer`,
    );
    assert.match(
      detail,
      /class="viora-service-detail__secondary-scene"/,
      `${service.slug}: second scene must be separate from the primary`,
    );
    detailVisualImages.forEach((tag, index) =>
      assertResponsiveImage(tag, `${service.slug} detail image ${index + 1}`),
    );
    assert.match(
      detailVisualImages[0],
      /\bloading="eager"/i,
      `${service.slug}: detail primary image should load eagerly`,
    );
    assert.match(
      detailVisualImages[1],
      /\bloading="lazy"/i,
      `${service.slug}: secondary scene image should stay lazy`,
    );
    assert.match(
      detail,
      new RegExp(`<h1 id="viora-service-title"[^>]*>${service.displayName}</h1>`),
      `${service.slug}: title missing`,
    );
    assert.ok(
      detail.includes(service.description),
      `${service.slug}: canonical description missing`,
    );
    assert.ok(detail.includes('<html lang="es-AR"'), `${service.slug}: locale missing`);
    assert.ok(
      detail.includes('<meta name="robots" content="noindex, nofollow">'),
      `${service.slug}: noindex missing`,
    );
    assert.ok(
      detail.includes('<main id="contenido">') &&
        detail.includes('aria-labelledby="viora-service-title"'),
      `${service.slug}: accessible landmarks missing`,
    );
    assert.ok(detail.includes('href="/servicios/"'), `${service.slug}: return link missing`);
    assert.ok(
      !/<a[^>]*>[^<]*(Reservar|Agendar|Consultar)[^<]*<\/a>/i.test(detail),
      `${service.slug}: unapproved conversion CTA`,
    );
    if (service.id === 'depilacion-definitiva') {
      assert.match(detail, /class="viora-service-actions"/);
      assert.match(
        detail,
        /class="button-link button-link--primary button-link--compact" href="https:\/\/cal\.com\/gonzalo-linares-rfbhnf\/prueba">\s*Sacar turno/,
      );
      assert.ok(detail.indexOf('Sacar turno') < detail.indexOf('viora-service-detail__media'));
      assert.equal((detail.match(/Sacar turno/g) ?? []).length, 1);
      assert.equal((detail.match(/gonzalo-linares-rfbhnf\/prueba/g) ?? []).length, 1);
    } else {
      assert.ok(
        !detail.includes('class="viora-service-actions"'),
        `${service.slug}: empty service actions must not render a section`,
      );
      assert.doesNotMatch(detail, /cal\.com|<a[^>]*>[^<]*Sacar turno/);
    }
    assert.ok(
      !/(?:\$\s?\d|ARS\s?\d|\d+\s?(?:minutos|min))/i.test(detail),
      `${service.slug}: unapproved price or duration`,
    );
    assert.ok(
      !/60\s*(?:minutos|min\b)/i.test(detail),
      `${service.slug}: pilot duration must not be presented as a technical duration`,
    );
    if (service.id !== 'depilacion-definitiva')
      assert.ok(
        !/(?:cal\.com|booking\.example|wa\.me|api\.whatsapp)/i.test(detail),
        `${service.slug}: unexpected commercial URL`,
      );
  }
  const catalog = await readFile(
    new URL('../apps/estetica/dist/servicios/index.html', import.meta.url),
    'utf8',
  );
  assertVioraFrame(catalog, 'services catalog');
  assertMetadata(
    catalog,
    {
      title: 'Servicios de estética integral | VIORA',
      description: 'Explorá las experiencias de cuidado y bienestar de VIORA.',
    },
    'VIORA services',
  );
  assert.match(catalog, /<h1 id="catalogo-servicios-titulo">Nuestras experiencias\.<\/h1>/);
  assert.equal((catalog.match(/class="viora-catalog__card(?:\s[^"]*)?"/g) ?? []).length, 4);
  assert.doesNotMatch(
    catalog,
    /referencias ilustrativas|Fotografía ilustrativa|viora-catalog__card-number|>0[1-4]</,
  );
  for (const service of siteContent.services) {
    assert.ok(catalog.includes(`href="/servicios/${service.slug}/"`));
    assert.ok(catalog.includes(service.displayName));
  }
  assert.doesNotMatch(catalog, /cal\.com|Reservar|Agendar/);

  const story = await readFile(
    new URL('../apps/estetica/dist/viora/index.html', import.meta.url),
    'utf8',
  );
  assertVioraFrame(story, 'VIORA story');
  assertMetadata(
    story,
    {
      title: 'VIORA · Nuestra forma de cuidar',
      description: 'Conocé la identidad, la filosofía y la experiencia de bienestar de VIORA.',
    },
    'VIORA story',
  );
  assert.match(story, /<h1 id="viora-story-title">Tu momento, tu bienestar\.<\/h1>/);
  assert.match(story, /Nuestra forma de cuidar/);
  assert.match(story, /class="viora-story-block__eyebrow"|La esencia/);
  assert.match(story, /id="momento"[^>]*aria-labelledby="viora-moment-title"/);
  assert.match(story, /class="viora-moment__eyebrow"/);
  for (const step of ['Conocé', 'Elegí', 'Coordiná']) assert.ok(story.includes(step));
  assert.doesNotMatch(story, /cal\.com|Reservar ahora|turnos disponibles/);

  const contactPage = await readFile(
    new URL('../apps/estetica/dist/contacto/index.html', import.meta.url),
    'utf8',
  );
  assertVioraFrame(contactPage, 'contact');
  assertMetadata(
    contactPage,
    {
      title: 'Contacto | VIORA · Estética integral',
      description: 'Ubicación e Instagram oficial de VIORA en Rivadavia, San Juan.',
    },
    'VIORA contact',
  );
  assert.match(contactPage, /<h1 id="[^"]+">Contacto<\/h1>/);
  assert.match(contactPage, /Rivadavia, San Juan, Argentina/);
  assert.doesNotMatch(contactPage, /más adelante|próximamente|se confirmarán/);
  assert.match(
    contactPage,
    /class="button-link button-link--secondary button-link--compact viora-map__directions" href="https:\/\/maps\.app\.goo\.gl\/H4jmqTGKicDse2iS7">/,
  );
  assert.ok(contactPage.includes('Ver en Google Maps'));
  assert.match(
    contactPage,
    /<iframe class="google-map-panel__iframe" src="https:\/\/www\.google\.com\/maps\/embed\?pb=!1m17!1m12!1m3!1d3401\.297756485471!2d-68\.567944!3d-31\.515980999999996[^"]*" title="Mapa interactivo: Ubicación de VIORA" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"><\/iframe>/,
  );
  assert.match(contactPage, /href="https:\/\/www\.instagram\.com\/vioramasajes\.ok\/"/);
  assert.doesNotMatch(contactPage, /href="(?:tel:|mailto:)/i);
  assert.equal((contactPage.match(/H4jmqTGKicDse2iS7/g) ?? []).length, 1);
  assert.equal((contactPage.match(/<iframe\b/g) ?? []).length, 1);
  assert.doesNotMatch(contactPage, /cal\.com|<a[^>]*>[^<]*(?:Reservar|Agendar)[^<]*<\/a>/i);

  const notFound = await readFile(
    new URL('../apps/estetica/dist/404.html', import.meta.url),
    'utf8',
  );
  assertMetadata(
    notFound,
    {
      title: 'Página no encontrada | VIORA · Vista previa',
      description:
        'La página que buscás no existe en esta vista previa de VIORA. Podés volver al inicio o explorar las experiencias.',
    },
    'VIORA 404',
  );
  assertBrowserIcon(notFound, siteContent.site.iconHref, 'VIORA 404');
  assertVioraFrame(notFound, '404');
  assert.match(notFound, /<html lang="es-AR"/);
  assert.match(notFound, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(notFound, /<h1 id="viora-not-found-title">Esta página no existe\.<\/h1>/);
  assert.ok(
    notFound.includes('href="/"') && notFound.includes('href="/servicios/"'),
    'VIORA 404 must provide real return links',
  );
  assert.ok(
    !/(?:cal\.com|wa\.me|api\.whatsapp)/i.test(notFound) &&
      !/<a[^>]*>[^<]*(?:Reservar|Agendar)[^<]*<\/a>/i.test(notFound),
    'VIORA 404 must not publish a commercial action',
  );
  assert.doesNotMatch(
    catalog + story + contactPage,
    /(?:cal\.com|wa\.me|api\.whatsapp)/i,
    'VIORA routes must not publish unapproved commercial actions',
  );
  const booking = await readFile(
    new URL('../apps/estetica/dist/reservar/index.html', import.meta.url),
    'utf8',
  );
  assertVioraFrame(booking, 'booking');
  assert.match(booking, /<h1 id="viora-booking-title">Reservá tu momento\.<\/h1>/);
  assert.equal((booking.match(/class="viora-booking-card"/g) ?? []).length, 4);
  assert.equal(
    (booking.match(/class="viora-booking-card__status">Agenda próximamente/g) ?? []).length,
    3,
  );
  assert.match(booking, /Estamos terminando de configurar los horarios/);
  const contactBuildCheck = await readFile(
    new URL('../apps/estetica/dist/contacto/index.html', import.meta.url),
    'utf8',
  );
  assert.match(contactBuildCheck, /Rivadavia, San Juan, Argentina/);
  assert.match(contactBuildCheck, /href="https:\/\/www\.instagram\.com\/vioramasajes\.ok\/"/);
  assert.match(
    contactBuildCheck,
    /href="https:\/\/maps\.app\.goo\.gl\/H4jmqTGKicDse2iS7">\s*Ver en Google Maps/,
  );
  assert.match(
    contactBuildCheck,
    /<iframe[^>]*title="Mapa interactivo:[^>]*loading="lazy"[^>]*allowfullscreen/,
  );
  assert.match(
    contactBuildCheck,
    /allowfullscreen referrerpolicy="strict-origin-when-cross-origin"/,
  );
  const robots = await readFile(
    new URL('../apps/estetica/dist/robots.txt', import.meta.url),
    'utf8',
  );
  assert.equal(robots, 'User-agent: *\nDisallow: /\n');
  const sitemap = await readFile(
    new URL('../apps/estetica/dist/sitemap.xml', import.meta.url),
    'utf8',
  );
  assert.match(sitemap, /<urlset/);
  assert.doesNotMatch(sitemap, /<url>/);
  assert.doesNotMatch(sitemap, /localhost|pages\.dev|preview|404|example/i);
  const releaseHeaders = await readFile(
    new URL('../apps/estetica/dist/_headers', import.meta.url),
    'utf8',
  );
  assert.match(releaseHeaders, /Content-Security-Policy:/);
  for (const route of ['terminos-y-condiciones', 'privacidad', 'arrepentimiento']) {
    const legalPage = await readFile(
      new URL(`../apps/estetica/dist/${route}/index.html`, import.meta.url),
      'utf8',
    );
    assert.match(legalPage, /<meta name="robots" content="noindex, nofollow">/);
    assert.match(
      legalPage,
      /Términos y condiciones|Política de privacidad|BOTÓN DE ARREPENTIMIENTO/,
    );
    assert.match(legalPage, /href="\/arrepentimiento\/"/);
    if (route !== 'arrepentimiento')
      assert.doesNotMatch(
        legalPage.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '',
        /Littzite/,
      );
  }
  assert.match(html, /href="\/arrepentimiento\/"[^>]*>\s*BOTÓN DE ARREPENTIMIENTO/);
  assert.doesNotMatch(contactBuildCheck, /example\.com|John Doe|11-11111111-1/);
  assert.doesNotMatch(booking, /booking\.example|href="#"/);
  const bookingCards = Array.from(
    booking.matchAll(/<article class="viora-booking-card">.*?<\/article>/gs),
    ([markup]) => markup,
  );
  assert.equal(bookingCards.length, 4);
  const bookingCtas =
    booking.match(
      /class="button-link button-link--primary button-link--compact" href="https:\/\/cal\.com\/gonzalo-linares-rfbhnf\/prueba">\s*Sacar turno/g,
    ) ?? [];
  assert.equal(bookingCtas.length, 1);
  assert.equal((booking.match(/gonzalo-linares-rfbhnf\/prueba/g) ?? []).length, 1);
  for (const card of bookingCards) {
    if (card.includes('Depilación definitiva')) {
      assert.match(card, /Sacar turno/);
      assert.match(card, /href="https:\/\/cal\.com\/gonzalo-linares-rfbhnf\/prueba"/);
      assert.doesNotMatch(card, /Agenda próximamente/);
    } else {
      assert.doesNotMatch(card, /button-link--primary|cal\.com/);
      assert.match(card, /Agenda próximamente/);
    }
  }
  assert.equal((booking.match(/class="viora-booking-card__media"/g) ?? []).length, 4);
  assert.equal((booking.match(/class="viora-booking-card__body"/g) ?? []).length, 4);
  for (const card of bookingCards) {
    assert.match(
      card,
      /<div class="viora-booking-card__media">\s*<figure[^>]*class="viora-service-visual viora-service-visual--card/,
    );
    assert.match(card, /<div class="viora-booking-card__body">/);
    assert.ok(card.indexOf('viora-booking-card__media') < card.indexOf('viora-booking-card__body'));
  }
  await assert.rejects(
    access(new URL('../apps/estetica/dist/servicios/no-existe/index.html', import.meta.url)),
  );
} else {
  assert.equal(siteContent.bookingTargets.length, 0, 'Juanjo must not have provider targets');
  assert.ok(
    siteContent.services.every(({ actions }) => actions.length === 0),
    'Juanjo must not have active booking CTAs',
  );
  assert.ok(
    !html.includes('viora-site') && !html.includes('/brand/viora-'),
    'VIORA assets leaked into tattoo',
  );
  assert.ok(!html.includes('H4jmqTGKicDse2iS7'), 'VIORA directions leaked into tattoo');
  assert.ok(!html.includes('vioramasajes.ok'), 'VIORA Instagram leaked into tattoo');
  assert.ok(html.includes('class="juanjo-site"'), 'Juanjo body style missing');
  assert.ok(html.includes('class="tattoo-home-hero"'), 'Juanjo commercial hero missing');
  assert.ok(html.includes('class="tattoo-hero-media'), 'Official Oni hero media missing');
  assert.ok(html.includes('Tu próximo tatuaje empieza acá.'), 'Approved Juanjo H1 missing');
  assert.ok(html.includes(`href="${tattooBookingUrl}"`), 'Test booking URL missing');
  assert.ok(!html.includes('agenda de prueba'), 'UAT wording must not appear in public copy');
  assert.ok(html.includes('Explorar trabajos'), 'Work CTA missing');
  assert.ok(html.includes('href="/guia/"'), 'Guide route missing');
  assert.ok(
    html.includes('aria-label="Juanjo Tattoo Studio en Instagram"'),
    'Instagram icon CTA missing',
  );
  assert.ok(!html.includes('>Contanos tu idea.<'), 'Legacy hero CTA must be removed');
  assert.ok(!html.includes('Una marca que deja huella'), 'Legacy brand-copy hero must be removed');
  assert.ok(html.includes('id="como-trabajamos"'), 'Conceptual service paths missing');
  assert.ok(
    html.includes('Powered by') && html.includes('alt="Littzite"'),
    'Powered by logo attribution missing',
  );
  const attribution = html.match(
    /<div class="site-attribution tattoo-attribution">([\s\S]*?)<\/div>/,
  )?.[1];
  assert.ok(attribution, 'Juanjo attribution wrapper missing');
  assert.doesNotMatch(
    attribution,
    /<a\b|href=/,
    'Attribution remains non-interactive without an approved URL',
  );
  assert.match(attribution, /src="\/littzite\/horizontal-dark\.svg"/);
  assert.ok(
    html.includes('href="https://www.instagram.com/juanjo.tattoos/"'),
    'Approved Instagram link missing',
  );
  assert.ok(
    html.includes('href="/trabajos/"') &&
      html.includes('href="/guia/"') &&
      !html.includes('href="/estudio/"') &&
      html.includes('href="/contacto/"'),
    'Juanjo routes incorrect or retired Estudio route remains',
  );
  assert.ok(
    !html.includes('wa.me/') && !html.includes('api.whatsapp.com/'),
    'Unapproved WhatsApp CTA was published',
  );
  assert.ok(
    html.includes(tattooBookingUrl) && !/<a[^>]*>[^<]*(Reservar|Agendar)[^<]*<\/a>/i.test(html),
    'Juanjo must use only the configured booking link',
  );
  assert.equal(
    (html.match(/class="tattoo-carousel__item/g) ?? []).length,
    9,
    'Juanjo preview carousel must render three physical copies of each item',
  );
  assert.ok(!html.includes('href="/servicios/"'), 'VIORA navigation must not leak into Juanjo');
  assert.ok(html.includes('aria-label="Navegación del pie de página"'));
  assert.ok(html.includes('href="/brand/monograma-jt.png"'), 'Official JT favicon missing');
  assert.ok(
    html.includes('class="tattoo-brand-mark__image"'),
    'Official signature header mark missing',
  );
  assert.ok(html.includes('srcset="/brand/monograma-jt.png"'), 'Compact JT header mark missing');
  assert.ok(!/<(?:img|figure)[^>]*>[^<]*(?:placeholder|fake|stock)/i.test(html));
  for (const route of [
    'trabajos',
    'guia',
    'contacto',
    'privacidad',
    'terminos-y-condiciones',
    'arrepentimiento',
  ]) {
    const routeHtml = await readFile(
      new URL(`../apps/tattoo/dist/${route}/index.html`, import.meta.url),
      'utf8',
    );
    assert.match(routeHtml, /<meta name="robots" content="noindex, nofollow">/);
    assert.equal((routeHtml.match(/<header class="site-header">/g) ?? []).length, 1);
    assert.equal((routeHtml.match(/<footer class="site-footer">/g) ?? []).length, 1);
    assert.match(routeHtml, /Powered by/);
    assert.match(routeHtml, /Littzite/);
  }
  await assert.rejects(access(new URL('../apps/tattoo/dist/estudio/index.html', import.meta.url)));
  const notFound = await readFile(new URL('../apps/tattoo/dist/404.html', import.meta.url), 'utf8');
  assert.match(notFound, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(notFound, /Esta página no existe/);
  const workPage = await readFile(
    new URL('../apps/tattoo/dist/trabajos/index.html', import.meta.url),
    'utf8',
  );
  assert.ok(workPage.includes('class="tattoo-gallery"'), 'Juanjo portfolio route missing');
  assert.equal(
    (workPage.match(/class="tattoo-carousel__item/g) ?? []).length,
    9,
    'Work fixture must render three physical copies of each preview item',
  );
  assert.equal((workPage.match(/<figure[^>]*aria-hidden="true"/g) ?? []).length, 6);
  assert.match(workPage, /Una selección de tatuajes y estilos\./);
  assert.doesNotMatch(
    workPage.replace(/<script\b[\s\S]*?<\/script>/gi, ''),
    /referencia generada|imágenes generadas|no es un trabajo real/i,
  );
  const guidePage = await readFile(
    new URL('../apps/tattoo/dist/guia/index.html', import.meta.url),
    'utf8',
  );
  assert.match(guidePage, /<h1[^>]*>Una guía para llegar preparado\.<\/h1>/);
  assert.match(guidePage, /Sensibilidad orientativa por zona/);
  assert.match(guidePage, /¿Qué tamaño puede tener tu tatuaje\?/);
  assert.match(guidePage, /Cuidá el tatuaje\./);
  assert.match(guidePage, /Preguntas frecuentes/i);
  assert.equal((guidePage.match(/<details>/g) ?? []).length, 7);
  assert.equal((guidePage.match(/href="#tattoo-size-motif"/g) ?? []).length, 3);
  assert.equal((guidePage.match(/href="\/guide\/body-front\.webp"/g) ?? []).length, 2);
  assert.equal((guidePage.match(/class="tattoo-body-map"/g) ?? []).length, 2);
  assert.match(guidePage, /La sensibilidad varía entre personas y zonas/);
  assert.match(guidePage, /no predice cuánto va a doler un tatuaje/);
  assert.match(guidePage, /class="tattoo-size-figure"/);
  assert.match(guidePage, /viewBox="0 0 1024 1536"/);
  assert.equal((guidePage.match(/href="\/guide\/body-back\.webp"/g) ?? []).length, 1);
  assert.doesNotMatch(guidePage, /[0-9]\/10|diagnóstico|garantiza|\$|seña|horarios ficticios/i);
  const tattooStyles = await readFile(
    new URL('../apps/tattoo/src/styles/juanjo.css', import.meta.url),
    'utf8',
  );
  assert.match(tattooStyles, /@font-face[\s\S]*Rye-Regular\.ttf/);
  assert.match(tattooStyles, /@font-face[\s\S]*DejaVuSerif\.ttf/);
  assert.match(tattooStyles, /@font-face[\s\S]*DejaVuSans\.ttf/);
  const contact = await readFile(
    new URL('../apps/tattoo/dist/contacto/index.html', import.meta.url),
    'utf8',
  );
  assert.match(contact, /href="https:\/\/www\.instagram\.com\/juanjo\.tattoos\/"/);
  assert.match(contact, /class="[^"]*\btattoo-instagram-link(?:\s|")/);
  assert.match(contact, /id="turnos"/);
  assert.match(contact, /Sacar turno/);
  assert.match(
    contact,
    /class="button-link button-link--secondary button-link--compact google-map-panel__directions" href="https:\/\/maps\.app\.goo\.gl\/SrLiJA1dutozzdKn7">Cómo llegar<svg/,
  );
  assert.match(
    contact,
    /<iframe class="google-map-panel__iframe" src="https:\/\/www\.google\.com\/maps\/embed\?pb=/,
  );
  assert.match(
    contact,
    /loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"/,
  );
  assert.ok(
    contact.indexOf('class="tattoo-contact-location"') <
      contact.indexOf('class="tattoo-contact-paths"'),
  );
  assert.equal((contact.match(/class="tattoo-contact-path"/g) ?? []).length, 2);
  assert.ok(contact.includes(`href="${tattooBookingUrl}"`));
  assert.match(contact, /href="https:\/\/www\.instagram\.com\/juanjo\.tattoos\/"/);
  assert.doesNotMatch(html + contact, /wa\.me|api\.whatsapp|Reserva tu turno|Agendá ahora/i);
  for (const route of ['privacidad', 'terminos-y-condiciones', 'arrepentimiento']) {
    const legal = await readFile(
      new URL(`../apps/tattoo/dist/${route}/index.html`, import.meta.url),
      'utf8',
    );
    assert.match(legal, /INFORMACIÓN LEGAL/);
    assert.doesNotMatch(
      legal,
      /Información para la preview|Borrador informativo|agenda de prueba/i,
    );
  }
}
if (app === 'estetica') {
  assert.ok(html.includes('class="landing-hero landing-hero--'), 'Shared hero missing');
  assert.ok(html.includes('id="alcance"'), 'Feature grid anchor missing');
  assert.ok(!html.includes('feature-card__symbol'));
}
assert.ok(html.includes('class="skip-link" href="#contenido"'));
assert.ok(html.includes('class="container"'));
const expectedHeroHref = app === 'estetica' ? '/servicios/' : tattooBookingUrl;
assert.ok(
  app === 'estetica'
    ? html.includes(
        `class="button-link button-link--primary button-link--default" href="${expectedHeroHref}"`,
      )
    : html.includes(
        `class="button-link button-link--primary button-link--default" href="${expectedHeroHref}"`,
      ),
  `${app}: main CTA must point to the appropriate route`,
);
for (const [token, value] of Object.entries(siteContent.site.theme)) {
  const cssName = token === 'accentText' ? 'accent-text' : token;
  assert.ok(html.includes(`--color-${cssName}:${value}`), `Missing ${token} for ${app}`);
}

for (const [otherApp, otherTitle] of Object.entries(expectedTitles)) {
  if (otherApp !== app)
    assert.ok(!html.includes(otherTitle), `${app} contains ${otherApp} content`);
}

const links = await verifyInternalLinks(
  fileURLToPath(new URL(`../apps/${app}/dist/`, import.meta.url)),
);
console.log(
  `${app}: static prototype, locale, noindex, content isolation and ${links.checked} internal links across ${links.pages} pages verified`,
);
