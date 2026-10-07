import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { before, test } from 'node:test';
import { execFileSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const fixtureRoot = path.join(root, 'apps/estetica/tests/site-attribution-fixture');
let html;
function build(href) {
  const env = { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' };
  delete env.SITE_ATTRIBUTION_TEST_HREF;
  if (href !== undefined) env.SITE_ATTRIBUTION_TEST_HREF = href;
  return execFileSync(
    process.execPath,
    [
      path.join(root, 'apps/estetica/node_modules/astro/bin/astro.mjs'),
      'build',
      '--root',
      fixtureRoot,
    ],
    { cwd: root, env, stdio: 'pipe' },
  );
}
function section(id) {
  const markup = new RegExp(`<section id="${id}">([\\s\\S]*?)<\\/section>`).exec(html)?.[1];
  assert.ok(markup, `fixture ${id} missing`);
  return markup;
}
before(() => {
  build();
  html = readFileSync(path.join(fixtureRoot, 'dist/index.html'), 'utf8');
});

test('SiteAttribution without href is noninteractive content', () => {
  assert.match(section('plain'), /Built by/);
  assert.match(section('plain'), /Studio/);
  assert.doesNotMatch(section('plain'), /<a\b|<button\b|tabindex=/);
});
test('SiteAttribution links an HTTPS destination through safe Link', () => {
  assert.match(
    section('linked'),
    /<a class="site-attribution__identity" href="https:\/\/studio\.example\.test\/\?utm_source=fixture">/,
  );
  assert.doesNotMatch(section('linked'), /target="_blank"/);
});
test('SiteAttribution fails closed for unsafe hrefs', () => {
  for (const href of ['http://unsafe.example/', 'javascript:alert(1)']) {
    assert.throws(
      () => build(href),
      (error) => {
        assert.match(
          `${error.stdout?.toString() ?? ''}${error.stderr?.toString() ?? ''}`,
          /Unsupported link URL/,
        );
        return true;
      },
    );
  }
});
test('SiteAttribution without logo emits no image or empty logo wrapper', () => {
  assert.doesNotMatch(section('plain'), /<img\b|site-attribution__logo/);
});
test('SiteAttribution preserves an optional logo and readable brand', () => {
  assert.match(
    section('logo'),
    /<img class="site-attribution__logo" src="\/authorized-logo\.svg" alt="" loading="lazy">/,
  );
  assert.match(section('logo'), /<span>Studio<\/span>/);
});
test('SiteAttribution preserves the consumer className', () => {
  assert.match(section('plain'), /class="site-attribution custom-signature"/);
});
