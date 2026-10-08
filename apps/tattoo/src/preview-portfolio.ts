import botanical from './assets/preview/work-botanical-preview.webp';
import moth from './assets/preview/work-moth-preview.webp';
import ornamental from './assets/preview/work-ornamental-preview.webp';
import { validatePortfolio, type TattooPortfolioItem } from './portfolio';

export const tattooPreviewPortfolio: readonly TattooPortfolioItem[] = validatePortfolio([
  {
    id: 'preview-botanical',
    title: 'Referencia botánica',
    alt: 'Tatuaje botánico negro sobre un antebrazo; imagen generada para la preview, no es un trabajo real del estudio.',
    image: botanical,
  },
  {
    id: 'preview-moth',
    title: 'Referencia ornamental',
    alt: 'Tatuaje ornamental de una polilla en una pierna; imagen generada para la preview, no es un trabajo real del estudio.',
    image: moth,
  },
  {
    id: 'preview-feathers',
    title: 'Referencia de blackwork',
    alt: 'Tatuaje blackwork simétrico sobre la espalda; imagen generada para la preview, no es un trabajo real del estudio.',
    image: ornamental,
  },
]);
