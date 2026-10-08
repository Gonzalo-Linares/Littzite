import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { tattooPortfolioRecords, validatePortfolio } from '../apps/tattoo/src/portfolio-data.ts';
import { stepGalleryIndex } from '../apps/tattoo/src/gallery-navigation.ts';

const item = () => ({
  id: 'lineas-originales',
  title: 'Pieza original',
  alt: 'Tatuaje original fotografiado sobre un brazo de perfil',
  image: { src: '/fixture.webp', width: 1400, height: 1800, format: 'webp' },
  featured: false,
});

test('featured works are a projection of the canonical portfolio in source order', () => {
  const featuredTattooWorkRecords = tattooPortfolioRecords.filter((work) => work.featured);
  assert.equal(tattooPortfolioRecords.length, 3);
  assert.equal(featuredTattooWorkRecords.length, 3);
  assert.deepEqual(
    featuredTattooWorkRecords,
    tattooPortfolioRecords.filter((work) => work.featured),
  );
  assert.deepEqual(
    tattooPortfolioRecords.map((work) => work.featured),
    [true, true, true],
  );
  assert.notEqual(featuredTattooWorkRecords, tattooPortfolioRecords);
  assert.ok(
    featuredTattooWorkRecords.every((work, index) => work === tattooPortfolioRecords[index]),
  );
  const implementation = readFileSync(
    new URL('../apps/tattoo/src/portfolio.ts', import.meta.url),
    'utf8',
  );
  assert.match(implementation, /tattooPortfolioRecords\.map\(/);
  assert.match(implementation, /tattooPortfolio\.filter\(\(work\) => work\.featured\)/);
});

test('authorized originals require valid IDs, titles, alt text and resolution', () => {
  const work = item();
  const descriptor = { ...work, image: { ...work.image, src: 'asset-key' } };
  assert.equal(validatePortfolio([descriptor]).length, 1);
  const ordered = [descriptor, { ...descriptor, id: 'segunda-pieza' }];
  assert.equal(validatePortfolio(ordered), ordered);
  assert.deepEqual(
    ordered.map(({ id }) => id),
    ['lineas-originales', 'segunda-pieza'],
  );
  assert.throws(
    () => validatePortfolio([descriptor, structuredClone(descriptor)]),
    /duplicate portfolio ID/,
  );
  assert.throws(
    () => validatePortfolio([{ ...descriptor, id: 'Invalid ID' }]),
    /Invalid or duplicate/,
  );
  assert.throws(
    () => validatePortfolio([{ ...descriptor, title: ' ' }]),
    /title and descriptive alt/,
  );
  assert.throws(
    () => validatePortfolio([{ ...descriptor, alt: 'foto' }]),
    /title and descriptive alt/,
  );
  assert.throws(
    () => validatePortfolio([{ ...descriptor, image: { ...descriptor.image, width: 300 } }]),
    /too small/,
  );
  assert.throws(
    () => validatePortfolio([{ ...descriptor, image: { ...descriptor.image, height: 0 } }]),
    /too small/,
  );
});

test('gallery navigation wraps in both directions and rejects empty collections', () => {
  assert.equal(stepGalleryIndex(0, -1, 5), 4);
  assert.equal(stepGalleryIndex(4, 1, 5), 0);
  assert.equal(stepGalleryIndex(2, 1, 5), 3);
  assert.equal(stepGalleryIndex(0, 1, 0), -1);
});
