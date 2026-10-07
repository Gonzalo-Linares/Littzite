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

test('ButtonLink exposes three visual variants and describedBy through the safe Link', () => {
  const result = build('button-link-fixture');
  assert.equal(result.status, 0, result.output);
  const html = readFileSync(
    path.join(root, 'apps/estetica/tests/button-link-fixture/dist/index.html'),
    'utf8',
  );
  assert.match(
    html,
    /class="button-link button-link--primary button-link--default" href="\/seguro\/"/,
  );
  assert.match(
    html,
    /class="button-link button-link--secondary button-link--default" href="https:\/\/example\.test\/"/,
  );
  assert.match(
    html,
    /class="button-link button-link--quiet button-link--compact" href="#inicio" aria-describedby="nota"/,
  );
});

test('ButtonLink rejects an unsafe href through Link', () => {
  const result = build('button-link-invalid');
  assert.notEqual(result.status, 0);
  assert.match(result.output, /Unsupported link URL/);
});
