import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { inspectWorkspace } from '../scripts/check-boundaries.mjs';

const roots = [];
after(async () => {
  for (const root of roots) await rm(root, { recursive: true, force: true });
});

async function workspace() {
  const root = await mkdtemp(path.join(tmpdir(), 'littzite-boundaries-'));
  roots.push(root);
  for (const [unit, manifest] of Object.entries({
    'apps/one': { name: '@littzite/one', dependencies: { '@littzite/ui': 'workspace:*' } },
    'apps/two': { name: '@littzite/two', dependencies: { '@littzite/ui': 'workspace:*' } },
    'packages/ui': { name: '@littzite/ui', exports: { '.': './src/index.ts' }, dependencies: { '@littzite/schema': 'workspace:*' } },
    'packages/schema': { name: '@littzite/schema', exports: { '.': './src/index.ts' } },
  })) {
    await mkdir(path.join(root, unit, 'src'), { recursive: true });
    await writeFile(path.join(root, unit, 'package.json'), JSON.stringify(manifest));
    await writeFile(path.join(root, unit, 'src/index.ts'), 'export const value = 1;');
  }
  return root;
}

test('valid app to public package imports pass', async () => {
  const root = await workspace();
  await writeFile(path.join(root, 'apps/one/src/index.ts'), "import { value } from '@littzite/ui';");
  assert.deepEqual(await inspectWorkspace(root), []);
});

test('app cross imports and package to app dependencies fail', async () => {
  const root = await workspace();
  await writeFile(path.join(root, 'apps/one/src/index.ts'), "import '../../two/src/index.ts';");
  const manifestPath = path.join(root, 'packages/ui/package.json');
  const manifest = { name: '@littzite/ui', exports: { '.': './src/index.ts' }, dependencies: { '@littzite/one': 'workspace:*' } };
  await writeFile(manifestPath, JSON.stringify(manifest));
  const errors = await inspectWorkspace(root);
  assert.ok(errors.some((error) => error.includes('imports apps/two')));
  assert.ok(errors.some((error) => error.includes('depends on apps/one')));
});

test('private package imports and package cycles fail', async () => {
  const root = await workspace();
  await writeFile(path.join(root, 'apps/one/src/index.ts'), "import '@littzite/ui/src/internal.ts';");
  await writeFile(path.join(root, 'packages/schema/package.json'), JSON.stringify({
    name: '@littzite/schema', exports: { '.': './src/index.ts' }, dependencies: { '@littzite/ui': 'workspace:*' },
  }));
  const errors = await inspectWorkspace(root);
  assert.ok(errors.some((error) => error.includes('imports private')));
  assert.ok(errors.some((error) => error.includes('package cycle')));
});

test('dynamic imports and relative paths outside a unit fail', async () => {
  const root = await workspace();
  await writeFile(path.join(root, 'apps/one/src/index.ts'), "await import('@littzite/two'); import '../../../../outside.ts';");
  const errors = await inspectWorkspace(root);
  assert.ok(errors.some((error) => error.includes('imports apps/two')));
  assert.ok(errors.some((error) => error.includes('outside workspace')));
});
