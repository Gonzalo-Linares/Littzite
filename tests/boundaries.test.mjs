import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
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
    'apps/one': { name: '@littzite/one', dependencies: { '@littzite/ui': 'workspace:*', '@littzite/booking': 'workspace:*' } },
    'apps/two': { name: '@littzite/two', dependencies: { '@littzite/ui': 'workspace:*', '@littzite/booking': 'workspace:*' } },
    'packages/booking': { name: '@littzite/booking', exports: { '.': './src/index.ts' }, dependencies: { '@littzite/schema': 'workspace:*' } },
    'packages/ui': { name: '@littzite/ui', exports: { '.': './src/index.ts' }, dependencies: { '@littzite/schema': 'workspace:*' } },
    'packages/sections': { name: '@littzite/sections', exports: { '.': './src/index.ts' }, dependencies: { '@littzite/ui': 'workspace:*', '@littzite/schema': 'workspace:*' } },
    'packages/content-schema': { name: '@littzite/schema', exports: { '.': './src/index.ts' } },
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

test('apps may consume booking and booking may consume only the schema layer', async () => {
  const root = await workspace();
  await writeFile(path.join(root, 'apps/one/src/index.ts'), "import '@littzite/booking';");
  await writeFile(path.join(root, 'packages/booking/src/index.ts'), "import '@littzite/schema';");
  assert.deepEqual(await inspectWorkspace(root), []);
});

test('booking allowlist rejects UI, sections, applications, and any other workspace package', async () => {
  const root = await workspace();
  const seoPath = path.join(root, 'packages/seo');
  await mkdir(path.join(seoPath, 'src'), { recursive: true });
  await writeFile(path.join(seoPath, 'package.json'), JSON.stringify({
    name: '@littzite/seo', exports: { '.': './src/index.ts' },
  }));
  await writeFile(path.join(seoPath, 'src/index.ts'), 'export const value = 1;');
  const manifestPath = path.join(root, 'packages/booking/package.json');
  await writeFile(manifestPath, JSON.stringify({
    name: '@littzite/booking',
    exports: { '.': './src/index.ts' },
    dependencies: {
      '@littzite/schema': 'workspace:*',
      '@littzite/ui': 'workspace:*',
      '@littzite/sections': 'workspace:*',
      '@littzite/seo': 'workspace:*',
      '@littzite/one': 'workspace:*',
    },
  }));
  await writeFile(path.join(root, 'packages/booking/src/index.ts'), [
    "import '@littzite/ui';",
    "import '@littzite/sections';",
    "import '@littzite/seo';",
    "import '@littzite/one';",
    "import '@littzite/booking/src/private.ts';",
  ].join('\n'));
  const errors = await inspectWorkspace(root);
  assert.ok(errors.some((error) => error.includes('disallowed packages/ui')));
  assert.ok(errors.some((error) => error.includes('disallowed packages/sections')));
  assert.ok(errors.some((error) => error.includes('disallowed packages/seo')));
  assert.ok(errors.some((error) => error.includes('depends on apps/one')));
  assert.ok(errors.some((error) => error.includes('depends on disallowed packages/ui')));
  assert.ok(errors.some((error) => error.includes('depends on disallowed packages/sections')));
  assert.ok(errors.some((error) => error.includes('depends on disallowed packages/seo')));
  assert.ok(errors.some((error) => error.includes('imports private')));
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
  await writeFile(path.join(root, 'packages/content-schema/package.json'), JSON.stringify({
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

test('ignores misleading source comments and scans Astro frontmatter and scripts', async () => {
  const root = await workspace();
  const content = [
    "---",
    "// import '@littzite/fake';",
    "import { value } from '@littzite/ui';",
    "---",
    "<section>import '@littzite/fake'</section>",
    "<script>import { value } from '@littzite/schema';</script>",
  ].join('\n');
  await writeFile(path.join(root, 'apps/one/src/example.astro'), content);
  const manifestPath = path.join(root, 'apps/one/package.json');
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  manifest.dependencies['@littzite/schema'] = 'workspace:*';
  await writeFile(manifestPath, JSON.stringify(manifest));
  assert.deepEqual(await inspectWorkspace(root), []);
});

test('rejects dynamic module specifiers instead of silently bypassing the checker', async () => {
  const root = await workspace();
  await writeFile(path.join(root, 'apps/one/src/index.ts'), [
    "const target = '@littzite/two';",
    "await import(target);",
    "const x = require(target);",
  ].join('\n'));
  const errors = await inspectWorkspace(root);
  assert.equal(errors.filter((error) => error.includes('Non-literal')).length, 2);
});

test('parses CSS imports but ignores imports in CSS comments', async () => {
  const root = await workspace();
  await writeFile(path.join(root, 'apps/one/src/design.css'),
    "/* @import '@littzite/fake'; */\n@import '@littzite/ui/src/hidden.css';");
  const errors = await inspectWorkspace(root);
  assert.ok(errors.some((error) => error.includes('imports private')));
  assert.ok(!errors.some((error) => error.includes('fake')));
});
