import { readdir, stat, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { HtmlValidate } from 'html-validate';
import config from '../.htmlvalidate.mjs';

export async function collectHtmlFiles(buildDirs) {
  const files = [];

  for (const buildDir of buildDirs) {
    const absoluteDir = resolve(buildDir);
    const metadata = await stat(absoluteDir).catch(() => null);
    if (!metadata?.isDirectory()) {
      throw new Error(`Build output directory is missing: ${absoluteDir}`);
    }

    const visit = async (directory) => {
      for (const entry of await readdir(directory, { withFileTypes: true })) {
        const entryPath = join(directory, entry.name);
        if (entry.isDirectory()) await visit(entryPath);
        else if (entry.isFile() && entry.name.endsWith('.html')) files.push(entryPath);
      }
    };

    const startIndex = files.length;
    await visit(absoluteDir);
    if (files.length === startIndex) {
      throw new Error(`No HTML files found in build output: ${absoluteDir}`);
    }
  }

  return files.sort();
}

export function formatValidationMessages(validationResults) {
  return validationResults.flatMap((validationResult) =>
    validationResult.results.flatMap((documentResult) =>
      documentResult.messages.map(
        (message) =>
          `${documentResult.filePath}:${message.line}:${message.column} ${message.ruleId}: ${message.message}`,
      ),
    ),
  );
}

export async function validateHtmlFiles(files, validator = new HtmlValidate(config)) {
  const results = await Promise.all(
    files.map(async (file) => {
      const html = await readFile(file, 'utf8');
      // Astro owns the lowercase doctype of its generated static redirect template.
      // Keep every semantic rule, and scope this style convention to that template only.
      const nativeRedirect =
        /^<!doctype html>\s*<title>Redirecting to:/.test(html) &&
        /<meta http-equiv="refresh"/.test(html);
      return nativeRedirect
        ? validator.validateString(html, file, {
            rules: { 'doctype-style': ['error', { style: 'lowercase' }] },
          })
        : validator.validateFile(file);
    }),
  );
  const valid = results.every((result) => result.valid);

  return {
    valid,
    exitCode: valid ? 0 : 1,
    diagnostics: formatValidationMessages(results),
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const buildDirs = ['apps/estetica/dist', 'apps/tattoo/dist'];
  const files = await collectHtmlFiles(buildDirs);
  const validation = await validateHtmlFiles(files);

  if (!validation.valid) {
    process.stderr.write(`${validation.diagnostics.join('\n')}\n`);
    process.exitCode = validation.exitCode;
  } else process.stdout.write(`Validated ${files.length} built HTML files.\n`);
}
