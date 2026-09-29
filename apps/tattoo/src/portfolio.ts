import type { ImageMetadata } from 'astro';

// The image metadata is provided by static imports from ../assets/portfolio/.
// Astro will generate responsive formats at build time once originals arrive.
export interface TattooPortfolioItem {
  id: string;
  title: string;
  alt: string;
  image: ImageMetadata;
}

export function validatePortfolio(items: readonly TattooPortfolioItem[]): readonly TattooPortfolioItem[] {
  const ids = new Set<string>();
  for (const work of items) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.id) || ids.has(work.id)) {
      throw new Error(`Invalid or duplicate portfolio ID: ${work.id}`);
    }
    if (work.title.trim().length === 0 || work.alt.trim().length < 12) {
      throw new Error(`A portfolio item needs a title and descriptive alt text: ${work.id}`);
    }
    if (!work.image || !Number.isFinite(work.image.width) || !Number.isFinite(work.image.height)
      || work.image.width < 640 || work.image.height < 640) {
      throw new Error(`The original portfolio image is missing or too small: ${work.id}`);
    }
    ids.add(work.id);
  }
  return items;
}

// No low-resolution Instagram screenshots or fabricated tattoos are published.
// Add authorized image imports and editorial metadata here once received.
export const tattooPortfolio = validatePortfolio([]);
