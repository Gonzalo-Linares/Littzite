import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import {
  tattooActions,
  tattooBrand,
  tattooLocation,
  tattooReleaseState,
} from '../apps/tattoo/src/brand.config.ts';
import { siteContent } from '../apps/tattoo/src/site.config.ts';
import { tattooPortfolioRecords } from '../apps/tattoo/src/portfolio-data.ts';
import { stepGalleryIndex } from '../apps/tattoo/src/gallery-navigation.ts';
import {
  assertTattooProductionReady,
  tattooProductionBlockers,
  tattooReleaseBlockers,
} from '../apps/tattoo/src/release-readiness.ts';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');

test('Juanjo uses the approved Cal.com booking link and keeps Instagram available', async () => {
  const layout = await read('apps/tattoo/src/layouts/TattooSiteLayout.astro');
  const social = await read('apps/tattoo/src/components/TattooInstagramLink.astro');
  assert.match(layout, /label: 'Guía', href: '\/guia\//);
  assert.match(layout, /href=\{tattooActions\.turnsHref\}/);
  assert.match(social, /InstagramIconLink/);
  assert.equal(
    tattooActions.turnsHref,
    'https://cal.com/juanjo-pereyra-mkzgce/turnos-tattoos?overlayCalendar=true',
  );
  assert.equal(tattooBrand.social.instagram, 'https://www.instagram.com/juanjo.tattoos/');
  assert.equal(tattooActions.instagramHref, tattooBrand.social.instagram);
  assert.equal(tattooActions.consultHref, tattooBrand.social.instagram);
  assert.doesNotMatch(layout, /turnos por Instagram/i);
});

test('home keeps the approved copy and records temporary assets outside the interface', async () => {
  const home = await read('apps/tattoo/src/pages/index.astro');
  const hero = await read('apps/tattoo/src/components/TattooHeroMedia.astro');
  assert.match(home, /Tu próximo tatuaje empieza acá\./);
  assert.match(home, /Explorá trabajos, elegí el estilo que más te represente y sacá tu turno\./);
  assert.match(home, /Explorar trabajos/);
  assert.match(home, /Sacar turno/);
  assert.doesNotMatch(home, /Contanos tu idea|Antes de la tinta/);
  assert.equal(tattooBrand.heroMedia.src, undefined);
  assert.equal(tattooPortfolioRecords.length, 3);
  assert.deepEqual(
    tattooPortfolioRecords.filter((work) => work.featured),
    tattooPortfolioRecords,
  );
  assert.match(home, /import \{ featuredTattooWorks \} from '\.\.\/portfolio'/);
  assert.match(home, /<TattooWorkCarousel items=\{featuredTattooWorks\}/);
  assert.doesNotMatch(
    home + hero,
    /Imagen de preview generada|imagen generada para la preview|no es un trabajo real del estudio/i,
  );
  const styles = await read('apps/tattoo/src/styles/juanjo.css');
  assert.match(styles, /\.juanjo-site \.tattoo-home-hero h1\s*\{[^}]*font-family:\s*'Rye'/);
  assert.doesNotMatch(styles, /\.tattoo-home-hero h1 span\s*\{[^}]*font-family:\s*'DejaVu Serif'/);
});

test('home has five focused sections and removes the retired preparation block', async () => {
  const home = await read('apps/tattoo/src/pages/index.astro');
  assert.equal((home.match(/<section\b/g) ?? []).length, 5);
  assert.doesNotMatch(home, /antes-de-la-tinta|Antes de la tinta/);
  assert.match(home, /id="como-trabajamos"/);
  assert.match(home, /href="\/guia\/"/);
  assert.doesNotMatch(home, /Contanos tu idea/);
});

test('guide retains preparation, aftercare and FAQ while removing the two retired visuals', async () => {
  const guide = await read('apps/tattoo/src/pages/guia.astro');
  for (const heading of [
    '01 / ANTES DE LA SESIÓN',
    '02 / DESPUÉS DE LA SESIÓN',
    '03 / PREGUNTAS FRECUENTES',
  ])
    assert.ok(guide.toLocaleLowerCase('es-AR').includes(heading.toLocaleLowerCase('es-AR')));
  for (const text of [
    'Descansá',
    'Hidratate y comé',
    'referencias',
    'ropa cómoda',
    'indicaciones particulares',
  ])
    assert.ok(guide.toLocaleLowerCase('es-AR').includes(text.toLocaleLowerCase('es-AR')));
  for (const care of ['Manos limpias', 'Secado y cuidado', 'Menos fricción', 'Sol y piel'])
    assert.ok(guide.includes(care));
  assert.match(guide, /Usá el botón Sacar turno para abrir la agenda y elegir un horario/);
  assert.match(guide, /href="\/trabajos\/"/);
  assert.match(guide, /tienen prioridad/);
  assert.match(guide, /buscá evaluación médica/);
  assert.equal((guide.match(/<details>/g) ?? []).length, 7);
  assert.doesNotMatch(
    guide,
    /Sensibilidad orientativa por zona|¿Qué tamaño puede tener tu tatuaje\?/i,
  );
  assert.doesNotMatch(guide, /id="(?:sensibilidad|tamano)"/);
  assert.doesNotMatch(
    guide,
    /body-(?:front|back)\.webp|tattoo-size-map|tattoo-sensitivity|id="(?:sensibilidad|tamano)"/i,
  );
  assert.doesNotMatch(guide, /[0-9]\/10|diagnóstico|garantiza|\$\s*\d|seña|forma de pago/i);
});

test('contact leads with the approved Google embed and keeps directions and cards below it', async () => {
  const contact = await read('apps/tattoo/src/pages/contacto.astro');
  const mapPanel = await read('packages/ui/src/GoogleMapPanel.astro');
  const styles = await read('apps/tattoo/src/styles/juanjo.css');
  assert.match(contact, /<h1>Contacto<\/h1>/);
  assert.match(contact, /Instagram/);
  assert.match(contact, /directionsHref=\{tattooLocation\.directionsHref\}/);
  assert.ok(contact.indexOf('tattoo-contact-location') < contact.indexOf('tattoo-contact-paths'));
  assert.match(contact, /class="tattoo-contact-path" id="turnos"/);
  assert.match(contact, /class="tattoo-contact-path" id="instagram"/);
  assert.match(styles, /\.tattoo-contact-hero\s*\{[^}]*background:\s*var\(--tattoo-ink\)/);
  assert.equal(tattooLocation.directionsHref, 'https://maps.app.goo.gl/SrLiJA1dutozzdKn7');
  assert.match(tattooLocation.embedUrl, /^https:\/\/www\.google\.com\/maps\/embed\?pb=/);
  assert.match(mapPanel, /allowfullscreen/);
  assert.match(mapPanel, /referrerpolicy="strict-origin-when-cross-origin"/);
  assert.match(mapPanel, /searchParams\.get\('pb'\)/);
  assert.doesNotMatch(contact, /CANAL OFICIAL|cal\.com[^<]*agenda comercial/);
  assert.equal(siteContent.bookingTargets.length, 0);
  assert.equal(siteContent.quoteTargets.length, 0);
  assert.equal(siteContent.services.length, 0);
});

test('temporary image portfolio remains marked as release blocked', async () => {
  const gallery = await read('apps/tattoo/src/components/TattooGallery.astro');
  const previewFiles = await readdir(new URL('apps/tattoo/src/assets/preview/', root));
  assert.equal(tattooPortfolioRecords.length, 3);
  assert.equal(tattooPortfolioRecords.filter((work) => work.featured).length, 3);
  assert.match(gallery, /items\.map\(\(item, index\)/);
  assert.match(gallery, /loading="lazy"/);
  assert.equal(tattooReleaseState.temporaryHeroImage, true);
  assert.equal(tattooReleaseState.temporaryPortfolioImages, true);
  assert.equal(tattooReleaseState.temporaryAftercareImage, true);
  assert.equal('bookingUrlIsPlaceholder' in tattooReleaseState, false);
  assert.equal(tattooReleaseBlockers.length, 0);
  assert.equal(
    tattooProductionBlockers.filter((blocker) => blocker.startsWith('assets.')).length,
    3,
  );
  assert.ok(tattooProductionBlockers.includes('JUANJO_PUBLIC_SITE_URL.missing'));
  assert.throws(assertTattooProductionReady, /Juanjo production release blocked/);
  assert.ok(previewFiles.includes('work-botanical-preview.webp'));
  assert.ok(previewFiles.includes('work-moth-preview.webp'));
  assert.ok(previewFiles.includes('work-ornamental-preview.webp'));
});

test('Juanjo keeps booking values app-local and booking stays inactive', async () => {
  const tattooFiles = await readdir(new URL('apps/tattoo/src/', root));
  assert.ok(tattooFiles.includes('portfolio.ts'));
  assert.equal(tattooFiles.includes('preview-portfolio.ts'), false);
  assert.equal(siteContent.bookingTargets.length, 0);
  assert.equal(siteContent.quoteTargets.length, 0);
  assert.equal(
    siteContent.services.every((service) => service.actions.length === 0),
    true,
  );
  const config = await read('apps/tattoo/src/brand.config.ts');
  assert.match(
    config,
    /https:\/\/cal\.com\/juanjo-pereyra-mkzgce\/turnos-tattoos\?overlayCalendar=true/,
  );
});

test('native gallery lightbox supports circular navigation, close, focus and scroll restoration', async () => {
  const gallery = await read('apps/tattoo/src/components/TattooGallery.astro');
  const lightbox = await read('apps/tattoo/src/components/TattooLightbox.astro');
  assert.match(gallery, /dialog\.showModal\(\)/);
  assert.match(gallery, /dialog\.close\(\)/);
  assert.match(gallery, /event\.key === 'ArrowLeft'/);
  assert.match(gallery, /event\.key === 'ArrowRight'/);
  assert.match(gallery, /event\.target === dialog/);
  assert.match(gallery, /closeButton\?\.focus\(\)/);
  assert.match(gallery, /opener\?\.focus\(\)/);
  assert.match(gallery, /document\.body\.style\.overflow = 'hidden'/);
  assert.match(gallery, /window\.scrollTo\(\{ top: previousScrollY/);
  assert.match(lightbox, /<dialog[^>]*aria-labelledby=/);
  assert.match(lightbox, /count > 1/);
  assert.equal(stepGalleryIndex(0, -1, 5), 4);
  assert.equal(stepGalleryIndex(4, 1, 5), 0);
  assert.equal(stepGalleryIndex(0, 1, 1), 0);
  assert.equal(stepGalleryIndex(0, 1, 0), -1);
});

test('the work carousel has three accessible physical copies and manual horizontal controls', async () => {
  const carousel = await read('apps/tattoo/src/components/TattooWorkCarousel.astro');
  const css = await read('apps/tattoo/src/styles/juanjo.css');
  assert.match(carousel, /aria-label="Trabajo anterior"/);
  assert.match(carousel, /aria-label="Trabajo siguiente"/);
  assert.match(carousel, /<svg viewBox="0 0 24 24"/);
  assert.match(carousel, /ArrowLeft/);
  assert.match(carousel, /ArrowRight/);
  assert.match(carousel, /viewport\.scrollTo\(\{\s*left:/);
  assert.match(carousel, /\[0, 1, 2\]\.map\(\(copy\)/);
  assert.match(carousel, /copy \* items\.length \+ index/);
  assert.match(carousel, /data-logical-index=\{index\}/);
  assert.match(carousel, /aria-hidden=\{copy !== 1 \? 'true' : undefined\}/);
  assert.match(carousel, /const itemCount = Number\(carousel\.dataset\.count\)/);
  assert.match(carousel, /nearest < itemCount \|\| nearest >= itemCount \* 2/);
  assert.match(carousel, /window\.setTimeout\(settle, 140\)/);
  assert.match(carousel, /let physicalIndex = itemCount/);
  assert.match(carousel, /centerSlide\(physicalIndex, 'auto'\)/);
  assert.doesNotMatch(
    carousel,
    /setInterval|scrollIntoView|\.focus\(|location\.hash|carousel-toggle/i,
  );
  assert.match(css, /\.tattoo-carousel__controls\s*\{[^}]*position:\s*absolute/);
  assert.match(css, /\.tattoo-carousel__controls button\s*\{[^}]*min-height:\s*3rem/);
});

test('the shared Instagram and map primitives are used by both apps without sharing commercial data', async () => {
  const vioraInstagram = await read('apps/estetica/src/components/VioraInstagramLink.astro');
  const tattooInstagram = await read('apps/tattoo/src/components/TattooInstagramLink.astro');
  const vioraMap = await read('apps/estetica/src/components/VioraMap.astro');
  const map = await read('packages/ui/src/GoogleMapPanel.astro');
  assert.match(vioraInstagram, /InstagramIconLink/);
  assert.match(tattooInstagram, /InstagramIconLink/);
  assert.match(vioraMap, /GoogleMapPanel/);
  assert.match(map, /hostname === 'www\.google\.com'/);
  assert.match(map, /pathname === '\/maps\/embed'/);
  assert.match(map, /loading="lazy"/);
  assert.match(map, /referrerpolicy="strict-origin-when-cross-origin"/);
  assert.doesNotMatch(map, /pendingMessage|google-map-panel__pending|<svg viewBox="0 0 640/);
  const tattooSource = await read('apps/tattoo/src/brand.config.ts');
  assert.match(tattooSource, /https:\/\/maps\.app\.goo\.gl\/SrLiJA1dutozzdKn7/);
  assert.match(tattooSource, /https:\/\/www\.google\.com\/maps\/embed\?pb=/);
  assert.doesNotMatch(tattooSource, /example/);
});

test('retired guide illustrations and their third-party body-photo assets are removed', async () => {
  const guide = await read('apps/tattoo/src/pages/guia.astro');
  const notices = await read('THIRD_PARTY_NOTICES.md');
  assert.doesNotMatch(
    guide,
    /sensibilidad orientativa por zona|¿qué tamaño puede tener tu tatuaje\?/i,
  );
  assert.doesNotMatch(notices, /MuscleMap|body-front\.webp|body-back\.webp/);
  assert.doesNotMatch(
    await read('apps/tattoo/src/styles/juanjo.css'),
    /tattoo-sensitivity|tattoo-size-map|tattoo-body-map/,
  );
});
