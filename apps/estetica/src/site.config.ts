import { siteContentSchema } from '@littzite/content-schema';

export const siteContent = siteContentSchema.parse({
  site: {
    defaultLocale: 'es-AR',
    theme: {
      surface: '#f7f4ef',
      text: '#242930',
      accent: '#324c52',
      accentText: '#ffffff',
      border: '#b4b8b4',
      focus: '#77551d',
    },
  },
  services: [],
  bookingTargets: [],
  quoteTargets: [],
  pages: [{
    slug: '',
    title: 'Demo de estética | Littzite',
    sections: [{
      id: 'intro',
      type: 'intro',
      heading: 'Demo de estética',
      body: 'Entrada técnica de la aplicación de estética. El contenido comercial está pendiente.',
    }],
  }],
});
