import type { ImageMetadata } from 'astro';
import work01 from './assets/works/work-01.webp';
import work02 from './assets/works/work-02.webp';
import work03 from './assets/works/work-03.webp';
import work04 from './assets/works/work-04.webp';
import work05 from './assets/works/work-05.webp';
import work06 from './assets/works/work-06.webp';
import work07 from './assets/works/work-07.webp';
import work08 from './assets/works/work-08.webp';
import work09 from './assets/works/work-09.webp';
import work10 from './assets/works/work-10.webp';
import work11 from './assets/works/work-11.webp';
import work12 from './assets/works/work-12.webp';
import { tattooPortfolioRecords } from './portfolio-data';
import { validatePortfolio } from './portfolio-data';

export { validatePortfolio } from './portfolio-data';
export type { TattooPortfolioItem } from './portfolio-data';

const portfolioImages: Record<(typeof tattooPortfolioRecords)[number]['imageKey'], ImageMetadata> =
  {
    work01,
    work02,
    work03,
    work04,
    work05,
    work06,
    work07,
    work08,
    work09,
    work10,
    work11,
    work12,
  };

// Static image imports let Astro retain dimensions and serve the original assets.
export const tattooPortfolio = validatePortfolio(
  tattooPortfolioRecords.map(({ imageKey, ...work }) => ({
    ...work,
    image: portfolioImages[imageKey],
  })),
);

export const featuredTattooWorks = tattooPortfolio.filter((work) => work.featured);
