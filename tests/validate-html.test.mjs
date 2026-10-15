import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { collectHtmlFiles, validateHtmlFiles } from '../scripts/validate-html.mjs';

test('collectHtmlFiles finds built HTML recursively and requires output in every app', async () => {
  const root = await mkdtemp(join(tmpdir(), 'littzite-html-'));
  const first = join(root, 'estetica');
  const second = join(root, 'tattoo');

  try {
    await mkdir(join(first, 'nested'), { recursive: true });
    await mkdir(second);
    await writeFile(join(first, 'index.html'), '<!doctype html>');
    await writeFile(join(first, 'nested', '404.html'), '<!doctype html>');
    await writeFile(join(second, 'index.html'), '<!doctype html>');

    assert.deepEqual(await collectHtmlFiles([first, second]), [
      join(first, 'index.html'),
      join(first, 'nested', '404.html'),
      join(second, 'index.html'),
    ]);
    await assert.rejects(collectHtmlFiles([first, join(root, 'missing')]), /directory is missing/);
    const empty = join(root, 'empty');
    await mkdir(empty);
    await assert.rejects(collectHtmlFiles([first, empty]), /No HTML files found/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('invalid HTML reports its real file path and preserves a failing exit code', async () => {
  const root = await mkdtemp(join(tmpdir(), 'littzite-html-invalid-'));
  const invalidFile = join(root, 'invalid.html');

  try {
    await writeFile(
      invalidFile,
      '<!doctype html><html lang="es-AR"><body><main><img src="photo.jpg"></main></body></html>',
    );

    const validation = await validateHtmlFiles([invalidFile]);
    const output = validation.diagnostics.join('\n');

    assert.equal(validation.valid, false);
    assert.equal(validation.exitCode, 1);
    assert.match(output, /invalid\.html:\d+:\d+ .*alt/i);
    assert.doesNotMatch(output, /undefined:/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('Astro native static redirects retain semantic validation with their compiler-owned doctype', async () => {
  const root = await mkdtemp(join(tmpdir(), 'littzite-redirect-'));
  const alias = join(root, 'index.html');
  const html =
    '<!doctype html>\n<title>Redirecting to: /servicios/</title>\n<meta http-equiv="refresh" content="0;url=/servicios/">\n<meta name="robots" content="noindex">\n<body><a href="/servicios/">Servicios</a></body>';
  try {
    await writeFile(alias, html);
    assert.equal((await validateHtmlFiles([alias])).valid, true);
    await writeFile(alias, html.replace('</body>', '<img src="missing.jpg"></body>'));
    const invalid = await validateHtmlFiles([alias]);
    assert.equal(invalid.valid, false);
    assert.match(invalid.diagnostics.join('\n'), /alt/);
    await writeFile(
      alias,
      '<!doctype html><html lang="es-AR"><head><title>Normal</title></head><body></body></html>',
    );
    assert.match((await validateHtmlFiles([alias])).diagnostics.join('\n'), /doctype-style/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
