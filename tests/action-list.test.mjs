import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const astroBin = path.join(root, 'apps/estetica/node_modules/astro/bin/astro.mjs');
const fixtureRoot = path.join(root, 'apps/estetica/tests/action-list-fixture');

function buildFixture(name) {
  const fixture = path.join(root, `apps/estetica/tests/${name}`);
  try {
    execFileSync(process.execPath, [astroBin, 'build', '--root', fixture], {
      cwd: root,
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
      stdio: 'pipe',
    });
    return { status: 0, output: '' };
  } catch (error) {
    return {
      status: error.status ?? 1,
      output: `${error.stdout?.toString() ?? ''}${error.stderr?.toString() ?? ''}`,
    };
  }
}

function caseMarkup(html, name) {
  const match = html.match(new RegExp(`<div data-case="${name}">(.*?)</div>`, 's'));
  assert.ok(match, `fixture case ${name} should be present`);
  return match[1];
}

test('ActionList renders empty, single and ordered multiple actions with scoped note IDs', () => {
  const build = buildFixture('action-list-fixture');
  assert.equal(build.status, 0, build.output);
  const html = readFileSync(path.join(fixtureRoot, 'dist/index.html'), 'utf8');

  assert.doesNotMatch(caseMarkup(html, 'zero'), /<ul\b|<a\b/);

  const single = caseMarkup(html, 'one');
  assert.match(
    single,
    /<a class="action-list__link" href="https:\/\/example\.test\/action-a" aria-describedby="single-list-action-note-book">Action A<\/a>/,
  );
  assert.match(
    single,
    /<p class="action-list__note" id="single-list-action-note-book">An optional note\.<\/p>/,
  );

  const multiple = caseMarkup(html, 'many');
  assert.ok(multiple.indexOf('First action') < multiple.indexOf('Second action'));
  assert.equal((multiple.match(/<a class="action-list__link"/g) ?? []).length, 2);

  const firstNoteId = 'service-a-action-note-book';
  const secondNoteId = 'service-b-action-note-book';
  assert.notEqual(firstNoteId, secondNoteId);
  assert.match(caseMarkup(html, 'same-action-id-a'), new RegExp(`id="${firstNoteId}"`));
  assert.match(caseMarkup(html, 'same-action-id-b'), new RegExp(`id="${secondNoteId}"`));
  assert.equal((html.match(new RegExp(`id="${firstNoteId}"`, 'g')) ?? []).length, 1);
  assert.equal((html.match(new RegExp(`id="${secondNoteId}"`, 'g')) ?? []).length, 1);
  assert.match(html, /<a class="action-link" href="\/legacy">Legacy link<\/a>/);
});

test('ActionList fails closed for unsafe hrefs and invalid ID prefixes', () => {
  const hrefBuild = buildFixture('action-list-invalid-href');
  assert.notEqual(hrefBuild.status, 0);
  assert.match(hrefBuild.output, /Unsupported link URL/);

  const idBuild = buildFixture('action-list-invalid-prefix');
  assert.notEqual(idBuild.status, 0);
  assert.match(idBuild.output, /idPrefix must be a safe HTML ID prefix/);
});
