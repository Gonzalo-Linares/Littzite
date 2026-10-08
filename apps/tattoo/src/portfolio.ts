import type { ImageMetadata } from 'astro';
import botanical from './assets/preview/work-botanical-preview.webp';
import moth from './assets/preview/work-moth-preview.webp';
import ornamental from './assets/preview/work-ornamental-preview.webp';
import { tattooPortfolioRecords } from './portfolio-data';
import { validatePortfolio } from './portfolio-data';

export { validatePortfolio } from './portfolio-data';
export type { TattooPortfolioItem } from './portfolio-data';

const portfolioImages: Record<(typeof tattooPortfolioRecords)[number]['imageKey'], ImageMetadata> =
  {
    botanical,
    moth,
    ornamental,
  };

// Static image imports let Astro retain dimensions and serve the original assets.
export const tattooPortfolio = validatePortfolio(
  tattooPortfolioRecords.map(({ imageKey, ...work }) => ({
    ...work,
    image: portfolioImages[imageKey],
  })),
);

export const featuredTattooWorks = tattooPortfolio.filter((work) => work.featured);
