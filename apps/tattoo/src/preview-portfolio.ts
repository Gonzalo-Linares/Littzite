import botanical from './assets/preview/work-botanical-preview.webp';
import moth from './assets/preview/work-moth-preview.webp';
import ornamental from './assets/preview/work-ornamental-preview.webp';
import { validatePortfolio, type TattooPortfolioItem } from './portfolio';

export const tattooPreviewPortfolio: readonly TattooPortfolioItem[] = validatePortfolio([
  {
    id: 'preview-botanical',
    title: 'Botánico',
    alt: 'Tatuaje botánico negro sobre un antebrazo.',
    image: botanical,
  },
  {
    id: 'preview-moth',
    title: 'Polilla ornamental',
    alt: 'Tatuaje ornamental de una polilla en una pierna.',
    image: moth,
  },
  {
    id: 'preview-feathers',
    title: 'Blackwork ornamental',
    alt: 'Tatuaje blackwork simétrico sobre la espalda.',
    image: ornamental,
  },
]);
