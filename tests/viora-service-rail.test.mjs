import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixtureRoot = path.join(root, 'apps/estetica/tests/viora-service-rail-fixture');

test('VIORA service rail handles 0, 1, 4, 5, 8 and 9 items progressively', () => {
  execFileSync(
    process.execPath,
    [
      path.join(root, 'apps/estetica/node_modules/astro/bin/astro.mjs'),
      'build',
      '--root',
      fixtureRoot,
    ],
    { cwd: root, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }, stdio: 'pipe' },
  );
  const html = readFileSync(path.join(fixtureRoot, 'dist/index.html'), 'utf8');
  const counts = [0, 1, 4, 5, 8, 9];

  for (const count of counts) {
    const section = new RegExp(`<section[^>]*id="rail-${count}"[\\s\\S]*?<\\/section>`).exec(
      html,
    )?.[0];
    assert.ok(section, `rail with ${count} items should render`);
    assert.match(section, new RegExp(`data-page-count="${Math.ceil(count / 4)}"`));

    const cards = [
      ...section.matchAll(/<article class="viora-service-rail__card"[^>]*>([\s\S]*?)<\/article>/g),
    ];
    assert.equal(cards.length, count, `${count} items should render exactly once`);
    assert.equal((section.match(/<a\b/g) ?? []).length, count, 'one principal link per card');
    for (const [, card] of cards) {
      assert.equal((card.match(/<a\b/g) ?? []).length, 1, 'each card has one non-nested anchor');
      assert.doesNotMatch(card, /<button\b/, 'card link must not contain nested controls');
    }

    const controlCount = (section.match(/data-service-rail-(?:previous|next)/g) ?? []).length;
    assert.equal(controlCount, count > 4 ? 2 : 0, 'controls only exist for multiple groups');
    if (count > 4) {
      assert.match(section, /aria-label="Servicios anteriores"[^>]*disabled/);
      assert.match(section, /aria-label="Servicios siguientes"/);
    }

    for (let index = 0; index < count; index += 1) {
      const number = String(index + 1).padStart(2, '0');
      assert.ok(section.indexOf(`href="/servicios/servicio-${number}/"`) >= 0);
      if (index > 0) {
        assert.ok(
          section.indexOf(`Servicio ${number}`) >
            section.indexOf(`Servicio ${String(index).padStart(2, '0')}`),
          'service order must be preserved',
        );
      }
    }
  }

  const source = readFileSync(
    path.join(root, 'apps/estetica/src/components/VioraServiceRail.astro'),
    'utf8',
  );
  const styles = readFileSync(path.join(root, 'apps/estetica/src/styles/viora.css'), 'utf8');
  assert.match(source, /aria-label="Servicios anteriores"/);
  assert.match(source, /aria-label="Servicios siguientes"/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(source, /setInterval|autoplay/i);
  assert.match(styles, /scroll-snap-type:\s*x mandatory/);
  assert.match(styles, /overflow-x:\s*auto/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /flex-basis: 88%/);
  assert.match(styles, /flex-basis: calc\(\(100% - clamp\(0\.8rem, 1\.5vw, 1\.25rem\)\) \/ 2\)/);
});
