import { siteContentSchema } from '@littzite/content-schema';

export const siteContent = siteContentSchema.parse({
  site: {
    defaultLocale: 'es-AR',
    theme: {
      surface: '#1d2025',
      text: '#f4f0e8',
      accent: '#dfbb87',
      accentText: '#202126',
      border: '#777879',
      focus: '#f2d7a4',
    },
  },
  services: [],
  bookingTargets: [],
  quoteTargets: [],
  pages: [{
    slug: '',
    title: 'Demo de tatuajes | Littzite',
    sections: [{
      id: 'intro',
      type: 'intro',
      heading: 'Demo de tatuajes',
      body: 'Entrada técnica de la aplicación de tatuajes. La identidad y el contenido se definirán más adelante.',
    }],
  }],
});
