import assert from 'node:assert/strict';
import test from 'node:test';
import { tattooPortfolio, validatePortfolio } from '../apps/tattoo/src/portfolio.ts';

const item = () => ({
  id: 'lineas-originales',
  title: 'Pieza original',
  alt: 'Tatuaje original fotografiado sobre un brazo de perfil',
  image: { src: '/fixture.webp', width: 1400, height: 1800, format: 'webp' },
});

test('an empty gallery publishes no fabricated tattoo photographs', () => {
  assert.deepEqual(tattooPortfolio, []);
});

test('authorized originals require valid IDs, titles, alt text and resolution', () => {
  const work = item();
  assert.equal(validatePortfolio([work]).length, 1);
  assert.throws(() => validatePortfolio([work, structuredClone(work)]), /duplicate portfolio ID/);
  assert.throws(() => validatePortfolio([{ ...work, id: 'Invalid ID' }]), /Invalid or duplicate/);
  assert.throws(() => validatePortfolio([{ ...work, title: ' ' }]), /title and descriptive alt/);
  assert.throws(() => validatePortfolio([{ ...work, alt: 'foto' }]), /title and descriptive alt/);
  assert.throws(
    () => validatePortfolio([{ ...work, image: { ...work.image, width: 300 } }]),
    /too small/,
  );
  assert.throws(
    () => validatePortfolio([{ ...work, image: { ...work.image, height: 0 } }]),
    /too small/,
  );
});
