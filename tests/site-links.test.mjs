import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { verifyInternalLinks } from '../scripts/verify-site-links.mjs';

const roots = [];
after(async () => {
  for (const root of roots) await rm(root, { recursive: true, force: true });
});

async function site(home, detail) {
  const root = await mkdtemp(path.join(tmpdir(), 'littzite-links-'));
  roots.push(root);
  await mkdir(path.join(root, 'servicios', 'masajes'), { recursive: true });
  await writeFile(path.join(root, 'index.html'), home);
  await writeFile(path.join(root, 'servicios', 'masajes', 'index.html'), detail);
  return root;
}

test('validates links and fragments across generated static routes', async () => {
  const root = await site(
    '<main id="contenido"><a href="/servicios/masajes/">Ver</a><a href="#contenido">Arriba</a></main>',
    '<h1 id="detalle">Masajes</h1><a href="/#contenido">Volver</a><a href="https://cal.com/">Externo</a>',
  );
  assert.deepEqual(await verifyInternalLinks(root), { pages: 2, checked: 3 });
});

test('rejects nonexistent internal paths and fragments', async () => {
  const missingRoute = await site(
    '<a href="/no-existe/">Rota</a>',
    '<h1 id="detalle">Masajes</h1>',
  );
  await assert.rejects(verifyInternalLinks(missingRoute), /broken internal href/);
  const missingAnchor = await site(
    '<a href="/servicios/masajes/#no-existe">Rota</a>',
    '<h1 id="detalle">Masajes</h1>',
  );
  await assert.rejects(verifyInternalLinks(missingAnchor), /missing #no-existe/);
});

test('rejects duplicate IDs within one generated page', async () => {
  const root = await site(
    '<main id="duplicado"></main><div id="duplicado"></div>',
    '<h1>Detalle</h1>',
  );
  await assert.rejects(verifyInternalLinks(root), /duplicate HTML id/);
});
