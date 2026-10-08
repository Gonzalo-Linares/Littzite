import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixtureRoot = path.join(root, 'apps/tattoo/tests/portfolio-fixture');

test('carousel handles 0, 1, 2 and 5 authorized metadata items and a configured hero photo', () => {
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
  for (const [id, count] of [
    ['carousel-empty', 0],
    ['carousel-one', 1],
    ['carousel-two', 2],
    ['carousel-five', 5],
  ]) {
    const section = html.match(
      new RegExp(`<section class="tattoo-carousel" id="${id}"[\\s\\S]*?<\\/section>`),
    )?.[0];
    assert.ok(section, `${id}: carousel section missing`);
    assert.equal(
      (section.match(/class="tattoo-carousel__item/g) ?? []).length,
      count,
      `${id}: wrong item count`,
    );
    const controls = /data-carousel-(?:prev|next|toggle)/.test(section);
    assert.equal(controls, count > 1, `${id}: controls depend on having two or more items`);
    if (count === 0) {
      assert.match(section, /class="tattoo-carousel__empty"/);
      assert.match(section, /Una selección de trabajos y referencias visuales del estudio/);
      assert.doesNotMatch(section, /data-carousel-(?:prev|next|toggle)/);
    }
  }
  assert.match(
    html,
    /class="tattoo-hero-media__photo" src="\/tests\/work-one\.svg" alt="Foto fixture de prueba, no real"/,
  );
  assert.match(html, /class="tattoo-hero-media__oni"[^>]*alt=""/);

  const carousel = readFileSync(
    path.join(root, 'apps/tattoo/src/components/TattooWorkCarousel.astro'),
    'utf8',
  );
  assert.match(carousel, /setInterval\(\(\) => update\(activeIndex \+ 1, false\), 7000\)/);
  assert.match(carousel, /Pausar reproducción/);
  assert.match(carousel, /Reanudar reproducción/);
  assert.match(carousel, /ArrowLeft/);
  assert.match(carousel, /ArrowRight/);
  assert.match(carousel, /prefers-reduced-motion: reduce/);
  assert.match(carousel, /mouseenter/);
  assert.match(carousel, /focusin/);
  const css = readFileSync(path.join(root, 'apps/tattoo/src/styles/juanjo.css'), 'utf8');
  assert.match(css, /scroll-snap-type:\s*x mandatory/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.tattoo-carousel__controls button\s*\{[^}]*min-height:\s*2\.9rem/);
});
