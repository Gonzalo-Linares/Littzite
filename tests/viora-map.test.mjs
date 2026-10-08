import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const astroBin = path.join(root, 'apps/estetica/node_modules/astro/bin/astro.mjs');
function build(name, extraEnv = {}) {
  try {
    execFileSync(
      process.execPath,
      [astroBin, 'build', '--root', path.join(root, `apps/estetica/tests/${name}`)],
      {
        cwd: root,
        env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', ...extraEnv },
        stdio: 'pipe',
      },
    );
    return { status: 0, output: '' };
  } catch (error) {
    return {
      status: error.status ?? 1,
      output: `${error.stdout?.toString() ?? ''}${error.stderr?.toString() ?? ''}`,
    };
  }
}

test('VioraMap supports directions without an embed and renders a lazy titled Google embed when configured', () => {
  const result = build('viora-map-fixture');
  assert.equal(result.status, 0, result.output);
  const html = readFileSync(
    path.join(root, 'apps/estetica/tests/viora-map-fixture/dist/index.html'),
    'utf8',
  );
  const empty = html.match(/<div data-case="empty">(.*?)<\/div>/s)?.[1];
  assert.equal(empty, '');
  const directionsOnly = html.match(/<div data-case="directions-only">(.*?)<\/div>/s)?.[1];
  assert.match(
    directionsOnly,
    /class="button-link button-link--secondary button-link--compact google-map-panel__directions" href="https:\/\/maps\.app\.goo\.gl\/H4jmqTGKicDse2iS7">Ver en Google Maps/,
  );
  assert.doesNotMatch(directionsOnly, /<iframe\b/);
  assert.match(
    html,
    /<iframe class="google-map-panel__iframe" src="https:\/\/www\.google\.com\/maps\/embed\?pb=verified-fixture" title="Mapa interactivo: Ubicación de prueba" loading="lazy" referrerpolicy="no-referrer-when-downgrade"><\/iframe>/,
  );
  assert.match(
    html,
    /class="button-link button-link--secondary button-link--compact google-map-panel__directions" href="https:\/\/www\.google\.com\/maps\/dir\/\?api=1">Ver en Google Maps/,
  );
});

test('VioraMap rejects HTTP, unrelated hosts and Google lookalike embed URLs', () => {
  for (const url of [
    'http://www.google.com/maps/embed?pb=not-secure',
    'https://evil.example/maps/embed?pb=untrusted',
    'https://google.com.example/maps/embed?pb=lookalike',
    'https://user@www.google.com/maps/embed?pb=credentials',
  ]) {
    const result = build('viora-map-invalid', { VIORA_MAP_INVALID_URL: url });
    assert.notEqual(result.status, 0, `${url} should fail closed`);
    assert.match(result.output, /valid Google Maps embed URL/);
  }
});

test('VIORA production map uses the official embed src and keeps the confirmed directions URL separate', () => {
  const config = readFileSync(path.join(root, 'apps/estetica/src/viora-location.ts'), 'utf8');
  assert.match(config, /directionsHref: 'https:\/\/maps\.app\.goo\.gl\/H4jmqTGKicDse2iS7'/);
  assert.match(config, /embedUrl:\s*'https:\/\/www\.google\.com\/maps\/embed\?pb=!1m17/);
  assert.doesNotMatch(config, /example\.test|verified-fixture/);
});
