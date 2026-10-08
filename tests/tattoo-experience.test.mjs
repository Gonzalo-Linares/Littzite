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
import { tattooPortfolio } from '../apps/tattoo/src/portfolio.ts';
import {
  assertTattooProductionReady,
  tattooReleaseBlockers,
} from '../apps/tattoo/src/release-readiness.ts';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');

test('Juanjo uses the exact preview booking link and keeps Instagram available', async () => {
  const layout = await read('apps/tattoo/src/layouts/TattooSiteLayout.astro');
  const social = await read('apps/tattoo/src/components/TattooInstagramLink.astro');
  assert.match(layout, /label: 'Guía', href: '\/guia\//);
  assert.match(layout, /href=\{tattooActions\.turnsHref\}/);
  assert.match(social, /InstagramIconLink/);
  assert.equal(tattooActions.turnsHref, 'https://cal.com/gonzalo-linares-rfbhnf/prueba');
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
  assert.equal(tattooPortfolio.length, 0);
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

test('guide explains preparation, orientation, scale, aftercare and consultation paths', async () => {
  const guide = await read('apps/tattoo/src/pages/guia.astro');
  const map = await read('apps/tattoo/src/components/TattooSensitivityMap.astro');
  for (const heading of [
    'Antes de la sesión',
    '¿Qué tamaño puede tener tu tatuaje?',
    'Cuidá el tatuaje.',
    'Preguntas frecuentes',
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
  for (const size of ['5 cm', '10 cm', '20 cm']) assert.ok(guide.includes(size));
  for (const care of ['Manos limpias', 'Secado y cuidado', 'Menos fricción', 'Sol y piel'])
    assert.ok(guide.includes(care));
  assert.match(guide, /Usá el botón Sacar turno para abrir la agenda y elegir un horario/);
  assert.match(guide, /href="\/trabajos\/"/);
  assert.match(guide, /tienen prioridad/);
  assert.match(guide, /buscá evaluación médica/);
  assert.equal((guide.match(/<details>/g) ?? []).length, 7);
  assert.match(map, /La sensibilidad varía según la persona/);
  assert.match(map, /no es una evaluación médica/);
  assert.doesNotMatch(guide, /[0-9]\/10|diagnóstico|garantiza|\$|seña|forma de pago/i);
});

test('contact uses the approved directions URL and has no fake map while embed is pending', async () => {
  const contact = await read('apps/tattoo/src/pages/contacto.astro');
  assert.match(contact, /<h1>Contacto<\/h1>/);
  assert.match(contact, /Instagram/);
  assert.match(contact, /directionsHref=\{tattooLocation\.directionsHref\}/);
  assert.match(contact, /<h2 id="tattoo-location-title">Encontranos<\/h2>/);
  assert.doesNotMatch(
    contact,
    /pendingMessage|iframe|mapa ilustrativo|dirección exacta se confirma/i,
  );
  assert.equal(tattooLocation.directionsHref, 'https://maps.app.goo.gl/SrLiJA1dutozzdKn7');
  assert.equal(tattooLocation.embedUrl, undefined);
  assert.doesNotMatch(contact, /CANAL OFICIAL|cal\.com[^<]*agenda comercial/);
  assert.equal(siteContent.bookingTargets.length, 0);
  assert.equal(siteContent.quoteTargets.length, 0);
  assert.equal(siteContent.services.length, 0);
});

test('temporary gallery images stay separate from the real portfolio and have an explicit release block', async () => {
  const gallery = await read('apps/tattoo/src/components/TattooGallery.astro');
  const previewSource = await read('apps/tattoo/src/preview-portfolio.ts');
  const previewFiles = await readdir(new URL('apps/tattoo/src/assets/preview/', root));
  assert.equal(tattooPortfolio.length, 0);
  assert.match(previewSource, /work-botanical-preview\.webp/);
  assert.doesNotMatch(gallery, /preview|generada|referencia/i);
  assert.doesNotMatch(previewSource, /no es un trabajo real del estudio|generada para la preview/i);
  assert.equal(tattooReleaseState.temporaryHeroImage, true);
  assert.equal(tattooReleaseState.temporaryPortfolioImages, true);
  assert.equal(tattooReleaseState.temporaryAftercareImage, true);
  assert.equal(tattooReleaseState.bookingUrlIsPlaceholder, true);
  assert.equal(tattooReleaseBlockers.length, 4);
  assert.throws(assertTattooProductionReady, /Juanjo production release blocked/);
  assert.ok(previewFiles.includes('work-botanical-preview.webp'));
  assert.ok(previewFiles.includes('work-moth-preview.webp'));
  assert.ok(previewFiles.includes('work-ornamental-preview.webp'));
});

test('only the tattoo app receives the temporary Cal.com URL and booking stays inactive', async () => {
  const tattooFiles = await readdir(new URL('apps/tattoo/src/', root));
  assert.ok(tattooFiles.includes('preview-portfolio.ts'));
  assert.equal(siteContent.bookingTargets.length, 0);
  assert.equal(siteContent.quoteTargets.length, 0);
  assert.equal(
    siteContent.services.every((service) => service.actions.length === 0),
    true,
  );
  const config = await read('apps/tattoo/src/brand.config.ts');
  assert.match(config, /https:\/\/cal\.com\/gonzalo-linares-rfbhnf\/prueba/);
});

test('the work carousel has only manual horizontal controls and no vertical navigation side effects', async () => {
  const carousel = await read('apps/tattoo/src/components/TattooWorkCarousel.astro');
  const css = await read('apps/tattoo/src/styles/juanjo.css');
  assert.match(carousel, /aria-label="Trabajo anterior"/);
  assert.match(carousel, /aria-label="Trabajo siguiente"/);
  assert.match(carousel, /<svg viewBox="0 0 24 24"/);
  assert.match(carousel, /ArrowLeft/);
  assert.match(carousel, /ArrowRight/);
  assert.match(carousel, /viewport\.scrollTo\(\{\s*left:/);
  assert.doesNotMatch(
    carousel,
    /setInterval|setTimeout|scrollIntoView|\.focus\(|location\.hash|carousel-toggle/i,
  );
  assert.match(css, /\.tattoo-carousel__controls\s*\{[^}]*position:\s*absolute/);
  assert.match(css, /\.tattoo-carousel__controls button\s*\{[^}]*min-height:\s*3\.2rem/);
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
  assert.match(map, /referrerpolicy="no-referrer-when-downgrade"/);
  assert.doesNotMatch(map, /pendingMessage|google-map-panel__pending|<svg viewBox="0 0 640/);
  const tattooSource = await read('apps/tattoo/src/brand.config.ts');
  assert.match(tattooSource, /https:\/\/maps\.app\.goo\.gl\/SrLiJA1dutozzdKn7/);
  assert.doesNotMatch(tattooSource, /\/maps\/embed|example/);
});
