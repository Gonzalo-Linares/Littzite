import { readdir, stat } from 'node:fs/promises';
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

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const buildDirs = ['apps/estetica/dist', 'apps/tattoo/dist'];
  const files = await collectHtmlFiles(buildDirs);
  const validator = new HtmlValidate(config);
  const results = await Promise.all(files.map((file) => validator.validateFile(file)));
  let invalid = false;

  for (const result of results) {
    if (!result.valid) {
      invalid = true;
      for (const message of result.results.flatMap(({ messages }) => messages)) {
        process.stderr.write(
          `${message.filePath}:${message.line}:${message.column} ${message.ruleId}: ${message.message}\n`,
        );
      }
    }
  }

  if (invalid) process.exitCode = 1;
  else process.stdout.write(`Validated ${files.length} built HTML files.\n`);
}
