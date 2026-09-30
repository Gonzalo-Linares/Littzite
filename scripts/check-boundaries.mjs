import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const workspaceRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const sourceExtensions = new Set(['.astro', '.ts', '.tsx', '.js', '.mjs', '.jsx', '.css']);
const packageDependencyAllowlist = Object.freeze({
  'packages/booking': Object.freeze(['packages/content-schema']),
});

function hasDisallowedPackageDependency(unit, target) {
  const allowedPackages = packageDependencyAllowlist[unit];
  return unit.startsWith('packages/') && target.startsWith('packages/') &&
    allowedPackages !== undefined && !allowedPackages.includes(target);
}

async function sourceFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (['node_modules', 'dist', '.astro'].includes(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await sourceFiles(fullPath));
    else if (sourceExtensions.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

function ownerOf(relativePath) {
  const parts = relativePath.split(path.sep);
  if (parts.length < 2 || !['apps', 'packages'].includes(parts[0])) return null;
  return `${parts[0]}/${parts[1]}`;
}

function importSpecifiers(source, filename) {
  const imports = [];
  const errors = [];
  const extension = path.extname(filename);
  const cssImports = (styles) => {
    const withoutComments = styles.replace(/\/\*[\s\S]*?\*\//g, '');
    for (const match of withoutComments.matchAll(/@import\s+(?:url\(\s*)?['"]([^'"]+)['"]\s*\)?/g)) imports.push(match[1]);
  };
  if (extension === '.css') {
    cssImports(source);
    return { imports, errors };
  }
  const sources = [];
  if (extension === '.astro') {
    const frontmatter = source.match(/^\uFEFF?---\s*\r?\n([\s\S]*?)\r?\n---/);
    if (frontmatter) sources.push(frontmatter[1]);
    for (const match of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) sources.push(match[1]);
    for (const match of source.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) cssImports(match[1]);
  } else sources.push(source);
  for (const [index, code] of sources.entries()) {
    const kind = ['.tsx', '.jsx'].includes(extension) ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
    const ast = ts.createSourceFile(`${filename}:${index}`, code, ts.ScriptTarget.Latest, true, kind);
    function add(literal, kindName) {
      if (literal && ts.isStringLiteralLike(literal)) imports.push(literal.text);
      else errors.push(`Non-literal ${kindName} in ${filename}`);
    }
    function visit(node) {
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        if (node.moduleSpecifier) add(node.moduleSpecifier, 'module specifier');
      } else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
        add(node.moduleReference.expression, 'import-equals');
      } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
        add(node.argument.literal, 'import-type');
      } else if (ts.isCallExpression(node) &&
        (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(node.expression) && node.expression.text === 'require'))) {
        add(node.arguments.length === 1 ? node.arguments[0] : null, 'dynamic import/require');
      }
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
  return { imports, errors };
}

export async function inspectWorkspace(root) {
  const violations = [];
  const units = new Map();
  for (const kind of ['apps', 'packages']) {
    for (const entry of await readdir(path.join(root, kind), { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const unit = `${kind}/${entry.name}`;
      const manifest = JSON.parse(await readFile(path.join(root, unit, 'package.json'), 'utf8'));
      units.set(unit, manifest);
    }
  }

  const names = new Map([...units].map(([unit, manifest]) => [manifest.name, unit]));
  const packageGraph = new Map();
  for (const [unit, manifest] of units) {
    const dependencies = {
      ...manifest.dependencies,
      ...manifest.devDependencies,
      ...manifest.peerDependencies,
      ...manifest.optionalDependencies,
    };
    const neighbors = [];
    for (const name of Object.keys(dependencies)) {
      const target = names.get(name);
      if (!target) continue;
      if (unit.startsWith('packages/') && target.startsWith('apps/')) violations.push(`${unit} depends on ${target}`);
      if (hasDisallowedPackageDependency(unit, target)) violations.push(`${unit} depends on disallowed ${target}`);
      if (unit.startsWith('apps/') && target.startsWith('apps/') && unit !== target) violations.push(`${unit} depends on ${target}`);
      if (target.startsWith('packages/') && unit.startsWith('packages/')) neighbors.push(target);
    }
    if (unit.startsWith('packages/')) packageGraph.set(unit, neighbors);

    for (const file of await sourceFiles(path.join(root, unit))) {
      const source = await readFile(file, 'utf8');
      const { imports, errors } = importSpecifiers(source, file);
      violations.push(...errors.map((error) => `${path.relative(root, file)}: ${error}`));
      for (const specifier of imports) {
        if (!specifier) continue;
        if (specifier.startsWith('.')) {
          const resolved = path.resolve(path.dirname(file), specifier);
          if (!resolved.startsWith(`${root}${path.sep}`)) {
            violations.push(`${path.relative(root, file)} imports outside workspace`);
            continue;
          }
          const target = ownerOf(path.relative(root, resolved));
          if (target && target !== unit) violations.push(`${path.relative(root, file)} imports ${target} by path`);
          continue;
        }
        if (!specifier.startsWith('@littzite/')) continue;
        const parts = specifier.split('/');
        const name = `${parts[0]}/${parts[1]}`;
        const target = names.get(name);
        if (!target) {
          violations.push(`${path.relative(root, file)} imports unknown ${name}`);
          continue;
        }
        if (unit.startsWith('packages/') && target.startsWith('apps/')) violations.push(`${path.relative(root, file)} imports ${target}`);
        if (hasDisallowedPackageDependency(unit, target)) violations.push(`${path.relative(root, file)} imports disallowed ${target}`);
        if (unit.startsWith('apps/') && target.startsWith('apps/') && unit !== target) violations.push(`${path.relative(root, file)} imports ${target}`);
        if (unit !== target && !Object.hasOwn(dependencies, name)) violations.push(`${unit} imports undeclared ${name}`);
        const exportKey = specifier === name ? '.' : `./${parts.slice(2).join('/')}`;
        if (!Object.hasOwn(units.get(target).exports ?? {}, exportKey)) violations.push(`${path.relative(root, file)} imports private ${specifier}`);
      }
    }
  }

  const visiting = new Set();
  const visited = new Set();
  function visit(unit) {
    if (visiting.has(unit)) {
      violations.push(`package cycle at ${unit}`);
      return;
    }
    if (visited.has(unit)) return;
    visiting.add(unit);
    for (const next of packageGraph.get(unit) ?? []) visit(next);
    visiting.delete(unit);
    visited.add(unit);
  }
  for (const unit of packageGraph.keys()) visit(unit);
  return violations;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const violations = await inspectWorkspace(workspaceRoot);
  if (violations.length) {
    console.error(violations.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Workspace dependency boundaries verified');
  }
}
