import { siteContentSchema } from '@littzite/content-schema';
import { validateBookingTargets } from '@littzite/booking';
import { tattooBrand, tattooIdentity } from './brand.config.ts';

const parsedContent = siteContentSchema.parse({
  site: {
    defaultLocale: tattooBrand.locale,
    iconHref: tattooBrand.marks.jt.src,
    theme: {
      surface: tattooIdentity.surface,
      text: tattooIdentity.text,
      accent: tattooIdentity.accent,
      accentText: tattooIdentity.accentText,
      border: tattooIdentity.border,
      focus: tattooIdentity.focus,
    },
  },
  services: [],
  bookingTargets: [],
  quoteTargets: [],
  pages: [
    {
      slug: '',
      seo: {
        title: 'Juanjo Tattoo Studio | Tu próximo tatuaje empieza acá',
        description:
          'Explorá trabajos, elegí el estilo que te representa y sacá tu turno con Juanjo Tattoo Studio en San Juan.',
      },
      sections: [],
    },
  ],
});

validateBookingTargets(parsedContent.bookingTargets);

export const siteContent = parsedContent;
