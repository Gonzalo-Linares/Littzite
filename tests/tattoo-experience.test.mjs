import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { tattooActions, tattooBrand } from '../apps/tattoo/src/brand.config.ts';
import { siteContent } from '../apps/tattoo/src/site.config.ts';
import { tattooPortfolio } from '../apps/tattoo/src/portfolio.ts';

const root = new URL('../', import.meta.url);
const read = (file) => readFile(new URL(file, root), 'utf8');

test('Juanjo header offers a safe Instagram icon, Guide and a real turns contact route', async () => {
  const layout = await read('apps/tattoo/src/layouts/TattooSiteLayout.astro');
  const social = await read('apps/tattoo/src/components/TattooInstagramLink.astro');
  assert.match(layout, /label: 'Guía', href: '\/guia\//);
  assert.match(layout, /tattoo-header-turns/);
  assert.match(layout, /href=\{tattooActions\.turnsHref\}/);
  assert.match(social, /<svg[\s\S]*aria-hidden="true"[\s\S]*focusable="false"/);
  assert.match(social, /ariaLabel="Juanjo Tattoo Studio en Instagram"/);
  assert.equal(tattooBrand.social.instagram, 'https://www.instagram.com/juanjo.tattoos/');
  assert.equal(tattooActions.turnsHref, '/contacto/#turnos');
  assert.equal(tattooActions.instagramHref, tattooBrand.social.instagram);
  assert.equal(tattooActions.consultHref, tattooBrand.social.instagram);
  assert.doesNotMatch(layout, /badge=\{\{\s*label:\s*tattooBrand\.social\.handle/);
});

test('home prioritizes the approved conversion copy and a completed photo-free hero fallback', async () => {
  const home = await read('apps/tattoo/src/pages/index.astro');
  const hero = await read('apps/tattoo/src/components/TattooHeroMedia.astro');
  assert.match(home, /Tu próxima pieza/);
  assert.match(home, /empieza acá\./);
  assert.match(home, /Explorá trabajos, definí tu idea y coordiná el próximo paso con Juanjo\./);
  assert.match(home, /Sacar turno/);
  assert.match(home, /href="\/trabajos\/" variant="secondary">\s*Explorar trabajos/);
  assert.match(home, /tattooActions\.turnsHref/);
  assert.doesNotMatch(home, /Contanos tu idea|Una marca que deja huella|Una identidad construida/);
  assert.equal(tattooBrand.heroMedia.src, undefined);
  assert.equal(tattooPortfolio.length, 0);
  assert.match(hero, /media\.src \? \(/);
  assert.match(hero, /tattoo-hero-media__art/);
  assert.match(hero, /tattoo-hero-media__oni/);
  assert.match(hero, /requires approved descriptive alt text/);
  assert.match(hero, /root-relative asset/);
});

test('home stays to six useful sections and routes each process path to Instagram contact', async () => {
  const home = await read('apps/tattoo/src/pages/index.astro');
  assert.equal((home.match(/<section\b/g) ?? []).length, 6);
  assert.match(home, /id="antes-de-la-tinta"/);
  assert.match(home, /id="como-trabajamos"/);
  assert.match(home, /Piezas pequeñas/);
  assert.match(home, /Proyectos grandes/);
  assert.match(home, /href=\{tattooActions\.turnsHref\}/);
  assert.match(home, /Consultar por Instagram/);
  assert.match(home, /href="\/guia\/"/);
  assert.match(home.toLocaleLowerCase('es-AR'), /antes y después de tatuarte/);
  const lowerHome = home.toLocaleLowerCase('es-AR');
  assert.match(lowerHome, /antes de venir/);
  assert.match(lowerHome, /sensibilidad por zona/);
  assert.match(lowerHome, /cuidados/);
});

test('guide covers preparation, orientation, scale, aftercare, safety boundary and FAQ', async () => {
  const guide = await read('apps/tattoo/src/pages/guia.astro');
  const map = await read('apps/tattoo/src/components/TattooSensitivityMap.astro');
  for (const heading of [
    'Antes de la sesión',
    'El tamaño cambia cómo se lee una pieza',
    'Cuidá la pieza',
    'Preguntas frecuentes',
  ])
    assert.ok(
      guide.toLocaleLowerCase('es-AR').includes(heading.toLocaleLowerCase('es-AR')),
      `${heading} is required`,
    );
  assert.match(map.toLocaleLowerCase('es-AR'), /sensibilidad orientativa por zona/);
  for (const text of [
    'Descansá',
    'Hidratate y comé',
    'referencias',
    'ropa cómoda',
    'indicaciones particulares',
  ])
    assert.ok(guide.toLocaleLowerCase('es-AR').includes(text.toLocaleLowerCase('es-AR')));
  for (const size of ['5 cm', '10 cm', '15 cm', '20 cm']) assert.ok(guide.includes(size));
  for (const care of ['Manos limpias', 'Secado y cuidado', 'Menos fricción', 'Sol y piel'])
    assert.ok(guide.includes(care));
  assert.match(guide, /tienen prioridad/);
  assert.match(guide, /buscá evaluación médica/);
  assert.equal((guide.match(/<details>/g) ?? []).length, 7);
  assert.match(map, /role="img" aria-labelledby=/);
  assert.match(map, /Silueta frontal orientativa/);
  assert.match(map, /Silueta trasera orientativa/);
  assert.match(map, /Menor sensibilidad/);
  assert.match(map, /Sensibilidad media/);
  assert.match(map, /Mayor sensibilidad/);
  assert.match(map, /La sensibilidad varía entre personas/);
  assert.match(map, /id="sensitivity-key-title">\s*Referencias generales\s*</);
  assert.doesNotMatch(map, /https?:\/\//);
  assert.doesNotMatch(guide, /[0-9]\/10|diagnóstico|garantiza|\$|seña|horario|forma de pago/i);
});

test('contact and commercial copy stay profile-based without fake booking or business terms', async () => {
  const contact = await read('apps/tattoo/src/pages/contacto.astro');
  assert.match(contact, /id="turnos"/);
  assert.match(contact, /Escribile a Juanjo por Instagram/);
  assert.match(contact, /Sacar turno/);
  assert.match(contact, /tattooActions\.instagramHref/);
  assert.match(contact, /tattooActions\.consultHref/);
  assert.match(contact, /PROYECTOS PERSONALIZADOS/);
  assert.match(contact, /No hay una agenda automática configurada/);
  assert.equal(siteContent.bookingTargets.length, 0);
  assert.equal(siteContent.quoteTargets.length, 0);
  assert.equal(siteContent.services.length, 0);
});

test('kit use stays local to Juanjo and no third-party tattoo imagery or new packages are introduced', async () => {
  const layout = await read('apps/tattoo/src/layouts/TattooSiteLayout.astro');
  const home = await read('apps/tattoo/src/pages/index.astro');
  const guide = await read('apps/tattoo/src/pages/guia.astro');
  const names = [layout, home, guide].join('\n');
  assert.match(names, /tattooBrand\.marks\.(oni|jt|seal|signature)/);
  assert.doesNotMatch(names, /unsplash|pexels|iframe|src="https?:/i);
  assert.equal(tattooPortfolio.length, 0);
  assert.equal(siteContent.bookingTargets.length, 0);
  assert.equal(siteContent.quoteTargets.length, 0);
});
