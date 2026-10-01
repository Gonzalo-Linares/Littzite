import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { collectHtmlFiles } from '../scripts/validate-html.mjs';

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
