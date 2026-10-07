import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixtureRoot = path.join(root, 'apps/tattoo/tests/portfolio-fixture');

test('future portfolio fixture renders N real metadata items in source order responsively', () => {
  execFileSync(
    process.execPath,
    [
      path.join(root, 'apps/tattoo/node_modules/astro/bin/astro.mjs'),
      'build',
      '--root',
      fixtureRoot,
    ],
    { cwd: root, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }, stdio: 'pipe' },
  );
  const html = readFileSync(path.join(fixtureRoot, 'dist/index.html'), 'utf8');
  const figures = [
    ...html.matchAll(/<figure class="tattoo-gallery__item[^>]*>([\s\S]*?)<\/figure>/g),
  ];
  assert.equal(figures.length, 2);
  assert.ok(html.indexOf('Fixture principal') < html.indexOf('Fixture secundario'));
  assert.match(html, /alt="Fixture geométrico de prueba; no representa un tatuaje real"/);
  assert.match(html, /alt="Segundo fixture geométrico de prueba; no representa un tatuaje real"/);
  assert.match(html, /width="640" height="800"/);
  assert.match(html, /width="800" height="640"/);
  assert.match(html, /class="tattoo-gallery__item [^"]*tattoo-gallery__item--lead"/);
  assert.doesNotMatch(html, /PORTFOLIO EN PREPARACIÓN/);
  const css = readFileSync(path.join(root, 'apps/tattoo/src/styles/juanjo.css'), 'utf8');
  assert.match(css, /\.tattoo-gallery__grid\s*\{\s*display:\s*grid/);
  assert.match(
    css,
    /@media \(max-width: 600px\)[\s\S]*\.tattoo-gallery__grid\s*\{\s*grid-template-columns:\s*1fr/,
  );
});
