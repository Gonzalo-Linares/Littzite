import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import { siteConfigSchema } from '../packages/content-schema/src/index.ts';
import { assertMetadata } from './html-metadata.mjs';
import { verifyInternalLinks } from './verify-site-links.mjs';

const expectedTitles = {
  estetica: 'VIORA · Estética integral | Vista previa',
  tattoo: 'Juanjo Tattoos · San Juan | Vista previa',
};

const app = process.argv[2];
assert.ok(Object.hasOwn(expectedTitles, app), `Unknown app: ${app}`);
assert.equal(siteConfigSchema.safeParse({ defaultLocale: 'es' }).success, false);

const { siteContent } = await import(`../apps/${app}/src/site.config.ts`);
const html = await readFile(new URL(`../apps/${app}/dist/index.html`, import.meta.url), 'utf8');
assert.equal((html.match(/<header class="site-header">/g) ?? []).length, 1, `${app}: expected one header`);
assert.equal((html.match(/<footer class="site-footer">/g) ?? []).length, 1, `${app}: expected one footer`);
assert.match(html, /<html lang="es-AR"(?:\s|>)/);
assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
assertMetadata(html, siteContent.pages.find((page) => page.slug === '').seo, app);
assert.ok(html.includes(`>${app === 'estetica' ? 'Regalate una pausa.' : 'De la idea a la piel.'}</h1>`), 'Expected editorial heading');
assert.ok(html.includes('class="site-header"'), 'Shared header missing');
assert.ok(html.includes('class="site-footer"'), 'Shared footer missing');
if (app === 'estetica') {
  assert.equal(siteContent.bookingTargets.length, 0, 'VIORA must not have live booking targets');
  assert.ok(siteContent.services.every(({ actions }) => actions.length === 0), 'VIORA services must not have booking CTAs');
  const assertVioraFrame = (markup, page) => {
    assert.equal((markup.match(/<header class="site-header">/g) ?? []).length, 1, `${page}: expected one VIORA header`);
    assert.equal((markup.match(/<footer class="site-footer">/g) ?? []).length, 1, `${page}: expected one VIORA footer`);
    assert.ok(markup.includes('href="/" class="site-mark"'), `${page}: logo must return to the home page`);
    assert.match(markup, /<a href="\/">Inicio<\/a>/, `${page}: Inicio link must target /`);
    assert.match(markup, /<a href="\/#alcance">Experiencias<\/a>/, `${page}: Experiencias link must target /#alcance`);
    assert.match(markup, /<a href="\/#esencia">Nuestra esencia<\/a>/, `${page}: Nuestra esencia link must target /#esencia`);
    assert.ok(markup.includes('/brand/viora-horizontal.png'), `${page}: horizontal logo missing`);
    assert.ok(markup.includes('/brand/viora-palabra.png'), `${page}: wordmark missing`);
  };
  assertVioraFrame(html, 'home');
  assert.ok(html.includes('class="viora-site"'), 'VIORA-only body style missing');
  assert.ok(html.includes('/brand/viora-horizontal.png'), 'VIORA header asset missing');
  assert.ok(html.includes('/brand/viora-principal.png'), 'VIORA hero asset missing');
  assert.ok(html.includes('/brand/viora-palabra.png'), 'VIORA footer asset missing');
  assert.ok(html.includes('id="esencia"'), 'VIORA essence section missing');
  assert.ok(!/(?:cal\.com|booking\.example|wa\.me|api\.whatsapp)/i.test(html), 'No commercial destination may be published');
  assert.ok(!/<a[^>]*>[^<]*(Reservar|Agendar|Consultar)[^<]*<\/a>/i.test(html), 'VIORA home must not publish a commercial booking CTA');
  const { access } = await import('node:fs/promises');
  for (const asset of ['viora-horizontal.png', 'viora-principal.png', 'viora-palabra.png']) {
    await access(new URL(`../apps/estetica/dist/brand/${asset}`, import.meta.url));
  }
  assert.equal((html.match(/class="viora-catalog__card"/g) ?? []).length, 4, 'Expected four VIORA service cards');
  for (const service of siteContent.services) {
    assert.ok(html.includes(`>${service.displayName}</a>`), `${service.slug}: card title missing`);
    assert.ok(html.includes(service.description), `${service.slug}: card description missing`);
    assert.ok(html.includes(`href="/servicios/${service.slug}/"`), `${service.slug}: card link missing`);
    const route = new URL(`../apps/estetica/dist/servicios/${service.slug}/index.html`, import.meta.url);
    const detail = await readFile(route, 'utf8');
    const detailSeo = { title: `${service.displayName} | VIORA · Vista previa`, description: service.description };
    assertMetadata(detail, detailSeo, service.slug);
    assert.notEqual(detailSeo.title, siteContent.pages[0].seo.title, `${service.slug}: detail title must differ from home`);
    assertVioraFrame(detail, service.slug);
    assert.ok(detail.includes(`<h1 id="viora-service-title">${service.displayName}</h1>`), `${service.slug}: title missing`);
    assert.ok(detail.includes(service.description), `${service.slug}: canonical description missing`);
    assert.ok(detail.includes('<html lang="es-AR"'), `${service.slug}: locale missing`);
    assert.ok(detail.includes('<meta name="robots" content="noindex, nofollow">'), `${service.slug}: noindex missing`);
    assert.ok(detail.includes('<main id="contenido">') && detail.includes('aria-labelledby="viora-service-title"'), `${service.slug}: accessible landmarks missing`);
    assert.ok(detail.includes('href="/#alcance"'), `${service.slug}: return link missing`);
    assert.ok(!/<a[^>]*>[^<]*(Reservar|Agendar|Consultar)[^<]*<\/a>/i.test(detail), `${service.slug}: unapproved conversion CTA`);
    assert.ok(!/(?:\$\s?\d|ARS\s?\d|\d+\s?(?:minutos|min))/i.test(detail), `${service.slug}: unapproved price or duration`);
    assert.ok(!/60\s*(?:minutos|min\b)/i.test(detail), `${service.slug}: pilot duration must not be presented as a technical duration`);
    assert.ok(!/(?:cal\.com|booking\.example|wa\.me|api\.whatsapp)/i.test(detail), `${service.slug}: fictitious commercial URL`);
  }
  await assert.rejects(access(new URL('../apps/estetica/dist/servicios/no-existe/index.html', import.meta.url)));
 } else {
  assert.equal(siteContent.bookingTargets.length, 0, 'Juanjo must not have provider targets');
  assert.ok(siteContent.services.every(({ actions }) => actions.length === 0), 'Juanjo must not have active booking CTAs');
  assert.ok(!html.includes('viora-site') && !html.includes('/brand/viora-'), 'VIORA assets leaked into tattoo');
  assert.ok(html.includes('class="juanjo-site"'), 'Juanjo body style missing');
  assert.ok(html.includes('class="juanjo-gallery"'), 'Juanjo portfolio region missing');
  assert.ok(html.includes('class="juanjo-gallery__empty"'), 'Honest portfolio empty state missing');
  assert.ok(html.includes('href="https://www.instagram.com/juanjo.tattoos/"'), 'Approved Instagram link missing');
  assert.ok(html.includes('id="portfolio"') && html.includes('id="alcance"'), 'Juanjo section anchors missing');
  assert.ok(!html.includes('wa.me/') && !html.includes('api.whatsapp.com/'), 'Unapproved WhatsApp CTA was published');
  assert.ok(!html.includes('cal.com') && !/<a[^>]*>[^<]*(Reservar|Agendar)[^<]*<\/a>/i.test(html), 'Juanjo must not publish a booking provider or CTA');
  assert.ok(!html.includes('juanjo-gallery__item--lead'), 'No real artwork should appear before originals arrive');
}
assert.ok(html.includes('class="landing-hero landing-hero--'), 'Shared hero missing');
if (app === 'tattoo') assert.equal((html.match(/class="feature-card"/g) ?? []).length, 3, 'Juanjo feature cards missing');
assert.ok(html.includes('id="alcance"'), 'Feature grid anchor missing');
assert.ok(!html.includes('feature-card__symbol'), 'Informational cards must not suggest a nonexistent link');
assert.ok(html.includes('class="skip-link" href="#contenido"'));
assert.ok(html.includes('class="container"'));
const expectedHeroHref = app === 'tattoo' ? '#portfolio' : '#alcance';
assert.ok(
  html.includes(`class="action-link" href="${expectedHeroHref}"`),
  `${app}: hero CTA must point to ${expectedHeroHref}`,
);
for (const [token, value] of Object.entries(siteContent.site.theme)) {
  const cssName = token === 'accentText' ? 'accent-text' : token;
  assert.ok(html.includes(`--color-${cssName}:${value}`), `Missing ${token} for ${app}`);
}

for (const [otherApp, otherTitle] of Object.entries(expectedTitles)) {
  if (otherApp !== app) assert.ok(!html.includes(otherTitle), `${app} contains ${otherApp} content`);
}

const links = await verifyInternalLinks(fileURLToPath(new URL(`../apps/${app}/dist/`, import.meta.url)));
console.log(`${app}: static prototype, locale, noindex, content isolation and ${links.checked} internal links across ${links.pages} pages verified`);
