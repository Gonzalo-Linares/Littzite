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

// Original photographs supplied by the owner; editorial order, without retouching.
export const tattooPortfolioRecords = [
  {
    id: 'work-01',
    title: 'Trabajo 01',
    alt: 'Tatuaje de dos personajes en tinta negra sobre una pierna.',
    imageKey: 'work01',
    featured: true,
  },
  {
    id: 'work-02',
    title: 'Trabajo 02',
    alt: 'Tatuaje de un rostro de león sobre el muslo.',
    imageKey: 'work02',
    featured: true,
  },
  {
    id: 'work-03',
    title: 'Trabajo 03',
    alt: 'Tatuaje sobre el hombro y la parte superior del brazo.',
    imageKey: 'work03',
    featured: true,
  },
  {
    id: 'work-04',
    title: 'Trabajo 04',
    alt: 'Tatuaje de un rostro entre flores sobre el antebrazo.',
    imageKey: 'work04',
    featured: true,
  },
  {
    id: 'work-05',
    title: 'Trabajo 05',
    alt: 'Tatuaje de máscara y flores con tinta roja sobre el brazo.',
    imageKey: 'work05',
    featured: true,
  },
  {
    id: 'work-06',
    title: 'Trabajo 06',
    alt: 'Tatuaje de una figura con detalle floral sobre el antebrazo.',
    imageKey: 'work06',
    featured: true,
  },
  {
    id: 'work-07',
    title: 'Trabajo 07',
    alt: 'Tatuaje de una figura alada sobre el brazo.',
    imageKey: 'work07',
    featured: false,
  },
  {
    id: 'work-08',
    title: 'Trabajo 08',
    alt: 'Tatuajes de cerebro y corazón con la palabra balance.',
    imageKey: 'work08',
    featured: false,
  },
  {
    id: 'work-09',
    title: 'Trabajo 09',
    alt: 'Tatuaje simétrico en tinta negra en la parte posterior del cuello.',
    imageKey: 'work09',
    featured: false,
  },
  {
    id: 'work-10',
    title: 'Trabajo 10',
    alt: 'Tatuaje de una flor delineada sobre el hombro.',
    imageKey: 'work10',
    featured: false,
  },
  {
    id: 'work-11',
    title: 'Trabajo 11',
    alt: 'Tatuaje con las palabras Aquí y Ahora sobre el brazo.',
    imageKey: 'work11',
    featured: false,
  },
  {
    id: 'work-12',
    title: 'Trabajo 12',
    alt: 'Tatuaje de un símbolo negro en la parte superior de la espalda.',
    imageKey: 'work12',
    featured: false,
  },
] as const;
