import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { siteConfigSchema } from '../packages/content-schema/src/index.ts';

const expectedTitles = {
  estetica: 'Demo de estética',
  tattoo: 'Demo de tatuajes',
};

const app = process.argv[2];
assert.ok(Object.hasOwn(expectedTitles, app), `Unknown app: ${app}`);
assert.equal(siteConfigSchema.safeParse({ defaultLocale: 'es' }).success, false);

const html = await readFile(new URL(`../apps/${app}/dist/index.html`, import.meta.url), 'utf8');
assert.match(html, /<html lang="es-AR">/);
assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
assert.ok(html.includes(`<h1>${expectedTitles[app]}</h1>`));

for (const [otherApp, otherTitle] of Object.entries(expectedTitles)) {
  if (otherApp !== app) assert.ok(!html.includes(otherTitle), `${app} contains ${otherApp} content`);
}

console.log(`${app}: static HTML, locale, noindex and content isolation verified`);
