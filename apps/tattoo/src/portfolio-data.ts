export interface TattooPortfolioItem {
  id: string;
  title: string;
  alt: string;
  image: { src: string; width: number; height: number };
  featured: boolean;
}

export function validatePortfolio(
  items: readonly TattooPortfolioItem[],
): readonly TattooPortfolioItem[] {
  const ids = new Set<string>();
  for (const work of items) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(work.id) || ids.has(work.id)) {
      throw new Error(`Invalid or duplicate portfolio ID: ${work.id}`);
    }
    if (work.title.trim().length === 0 || work.alt.trim().length < 12) {
      throw new Error(`A portfolio item needs a title and descriptive alt text: ${work.id}`);
    }
    if (
      !work.image ||
      !Number.isFinite(work.image.width) ||
      !Number.isFinite(work.image.height) ||
      work.image.width < 640 ||
      work.image.height < 640
    ) {
      throw new Error(`The original portfolio image is missing or too small: ${work.id}`);
    }
    ids.add(work.id);
  }
  return items;
}

// These temporary image descriptors remain blocked from release until replaced by
// original, authorized work. Their order is the editorial order of the full portfolio.
export const tattooPortfolioRecords = [
  {
    id: 'preview-botanical',
    title: 'Botánico',
    alt: 'Tatuaje botánico negro sobre un antebrazo.',
    imageKey: 'botanical',
    featured: true,
  },
  {
    id: 'preview-moth',
    title: 'Polilla ornamental',
    alt: 'Tatuaje ornamental de una polilla en una pierna.',
    imageKey: 'moth',
    featured: true,
  },
  {
    id: 'preview-feathers',
    title: 'Blackwork ornamental',
    alt: 'Tatuaje blackwork simétrico sobre la espalda.',
    imageKey: 'ornamental',
    featured: true,
  },
] as const;
