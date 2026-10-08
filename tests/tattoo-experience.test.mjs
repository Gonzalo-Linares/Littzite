import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';
import { tattooActions, tattooBrand } from '../apps/tattoo/src/brand.config.ts';
import { siteContent } from '../apps/tattoo/src/site.config.ts';
import { tattooPortfolio } from '../apps/tattoo/src/portfolio.ts';

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

test('home makes the approved next step prominent and labels generated photography', async () => {
  const home = await read('apps/tattoo/src/pages/index.astro');
  const hero = await read('apps/tattoo/src/components/TattooHeroMedia.astro');
  assert.match(home, /Tu próximo <span>tatuaje<\/span> empieza acá\./);
  assert.match(
    home,
    /Explorá trabajos, elegí el estilo que más te represente y sacá tu turno con Juanjo\./,
  );
  assert.match(home, /Explorar trabajos/);
  assert.match(home, /Sacar turno/);
  assert.doesNotMatch(home, /Contanos tu idea|Antes de la tinta/);
  assert.equal(tattooBrand.heroMedia.src, undefined);
  assert.equal(tattooPortfolio.length, 0);
  assert.match(hero, /imagen generada para la preview, no es un trabajo de Juanjo/);
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
    'El tamaño y la ubicación cambian cómo se ve un tatuaje.',
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
  for (const care of ['Manos limpias', 'Secado suave', 'Menos fricción', 'Sol e hidratación'])
    assert.ok(guide.includes(care));
  assert.match(guide, /agenda de prueba de Cal\.com/);
  assert.match(guide, /href="\/trabajos\/"/);
  assert.match(guide, /tienen prioridad/);
  assert.match(guide, /buscá evaluación médica/);
  assert.equal((guide.match(/<details>/g) ?? []).length, 7);
  assert.match(map, /La sensibilidad varía entre personas/);
  assert.match(map, /no es una evaluación médica/);
  assert.doesNotMatch(guide, /[0-9]\/10|diagnóstico|garantiza|\$|seña|horario|forma de pago/i);
});

test('contact is honest about the test agenda and approximate location', async () => {
  const contact = await read('apps/tattoo/src/pages/contacto.astro');
  assert.match(contact, /<h1>Contacto<\/h1>/);
  assert.match(contact, /Cal\.com/);
  assert.match(contact, /Instagram/);
  assert.match(contact, /dirección exacta se confirma al coordinar/);
  assert.doesNotMatch(contact, /CANAL OFICIAL|cal\.com[^<]*agenda comercial/);
  assert.equal(siteContent.bookingTargets.length, 0);
  assert.equal(siteContent.quoteTargets.length, 0);
  assert.equal(siteContent.services.length, 0);
});

test('generated gallery previews are separated from the real portfolio source', async () => {
  const gallery = await read('apps/tattoo/src/components/TattooGallery.astro');
  const previewSource = await read('apps/tattoo/src/preview-portfolio.ts');
  const previewFiles = await readdir(new URL('apps/tattoo/src/assets/preview/', root));
  assert.equal(tattooPortfolio.length, 0);
  assert.match(previewSource, /work-botanical-preview\.webp/);
  assert.match(gallery, /Imágenes generadas solo para evaluar esta preview/);
  assert.match(previewSource, /no es un trabajo real del estudio/);
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
