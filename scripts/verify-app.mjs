import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { siteConfigSchema } from '../packages/content-schema/src/index.ts';

const expectedTitles = {
  estetica: 'Regalate una pausa.',
  tattoo: 'Ideas que dejan huella',
};

const app = process.argv[2];
assert.ok(Object.hasOwn(expectedTitles, app), `Unknown app: ${app}`);
assert.equal(siteConfigSchema.safeParse({ defaultLocale: 'es' }).success, false);

const { siteContent } = await import(`../apps/${app}/src/site.config.ts`);
const html = await readFile(new URL(`../apps/${app}/dist/index.html`, import.meta.url), 'utf8');
assert.match(html, /<html lang="es-AR"(?:\s|>)/);
assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
assert.ok(html.includes(`>${expectedTitles[app]}</h1>`), 'Expected editorial heading');
assert.ok(html.includes('class="site-header"'), 'Shared header missing');
assert.ok(html.includes('class="site-footer"'), 'Shared footer missing');
if (app === 'estetica') {
  assert.ok(html.includes('class="viora-site"'), 'VIORA-only body style missing');
  assert.ok(html.includes('/brand/viora-horizontal.png'), 'VIORA header asset missing');
  assert.ok(html.includes('/brand/viora-principal.png'), 'VIORA hero asset missing');
  assert.ok(html.includes('/brand/viora-palabra.png'), 'VIORA footer asset missing');
  assert.ok(html.includes('id="esencia"'), 'VIORA essence section missing');
  const { access } = await import('node:fs/promises');
  for (const asset of ['viora-horizontal.png', 'viora-principal.png', 'viora-palabra.png']) {
    await access(new URL(`../apps/estetica/dist/brand/${asset}`, import.meta.url));
  }
} else {
  assert.ok(!html.includes('viora-site') && !html.includes('/brand/viora-'), 'VIORA assets leaked into tattoo');
}
assert.ok(html.includes('class="landing-hero landing-hero--'), 'Shared hero missing');
assert.equal((html.match(/class="feature-card"/g) ?? []).length, app === 'estetica' ? 4 : 3, 'Feature cards missing');
assert.ok(html.includes('id="alcance"'), 'Feature grid anchor missing');
assert.ok(!html.includes('feature-card__symbol'), 'Informational cards must not suggest a nonexistent link');
assert.ok(html.includes('class="skip-link" href="#contenido"'));
assert.ok(html.includes('class="container"'));
assert.ok(html.includes('class="action-link" href="#alcance"'));
for (const [token, value] of Object.entries(siteContent.site.theme)) {
  const cssName = token === 'accentText' ? 'accent-text' : token;
  assert.ok(html.includes(`--color-${cssName}:${value}`), `Missing ${token} for ${app}`);
}

for (const [otherApp, otherTitle] of Object.entries(expectedTitles)) {
  if (otherApp !== app) assert.ok(!html.includes(otherTitle), `${app} contains ${otherApp} content`);
}

console.log(`${app}: static prototype, locale, noindex, shared sections and content isolation verified`);
