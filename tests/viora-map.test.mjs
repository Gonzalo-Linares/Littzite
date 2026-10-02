import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const astroBin = path.join(root, 'apps/estetica/node_modules/astro/bin/astro.mjs');
function build(name) {
  try {
    execFileSync(
      process.execPath,
      [astroBin, 'build', '--root', path.join(root, `apps/estetica/tests/${name}`)],
      { cwd: root, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }, stdio: 'pipe' },
    );
    return { status: 0, output: '' };
  } catch (error) {
    return {
      status: error.status ?? 1,
      output: `${error.stdout?.toString() ?? ''}${error.stderr?.toString() ?? ''}`,
    };
  }
}

test('VioraMap omits the frame without location and renders a lazy titled Google embed when configured', () => {
  const result = build('viora-map-fixture');
  assert.equal(result.status, 0, result.output);
  const html = readFileSync(
    path.join(root, 'apps/estetica/tests/viora-map-fixture/dist/index.html'),
    'utf8',
  );
  const empty = html.match(/<div data-case="empty">(.*?)<\/div>/s)?.[1];
  assert.equal(empty, '');
  assert.match(
    html,
    /<iframe src="https:\/\/www\.google\.com\/maps\/embed\?pb=verified-fixture" title="Mapa interactivo: Ubicación de prueba" loading="lazy" referrerpolicy="no-referrer-when-downgrade"><\/iframe>/,
  );
  assert.match(
    html,
    /<a class="viora-map__directions" href="https:\/\/www\.google\.com\/maps\/dir\/\?api=1">\s*Cómo llegar/,
  );
});

test('VioraMap rejects provider URLs outside the Google Maps embed endpoint', () => {
  const result = build('viora-map-invalid');
  assert.notEqual(result.status, 0);
  assert.match(result.output, /valid Google Maps embed URL/);
});
