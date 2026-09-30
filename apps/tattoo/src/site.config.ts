import { siteContentSchema } from '@littzite/content-schema';
import { validateBookingTargets } from '@littzite/booking';

// Portfolio photographs, brand artwork and booking destinations are deliberately
// absent until Juanjo supplies originals and approves the commercial details.
const parsedContent = siteContentSchema.parse({
  site: {
    defaultLocale: 'es-AR',
    theme: {
      surface: '#17191B',
      text: '#F8F4ED',
      accent: '#EF9476',
      accentText: '#17191B',
      border: '#67696B',
      focus: '#FFD4B3',
    },
  },
  services: [],
  bookingTargets: [],
  quoteTargets: [],
  pages: [{
    slug: '',
    seo: {
      title: 'Juanjo Tattoos · San Juan | Vista previa',
      description: 'Conocé la vista previa del universo visual de Juanjo Tattoos en San Juan mientras preparamos su portfolio web.',
    },
    sections: [
      {
        id: 'intro',
        type: 'intro',
        eyebrow: 'JUANJO TATTOOS / SAN JUAN',
        heading: 'De la idea a la piel.',
        body: 'Cada pieza empieza con una idea. Conocé el universo visual de Juanjo y explorá sus trabajos actuales mientras preparamos su portfolio web.',
        visualCaption: 'TRAZO / CONTRASTE / EXPRESIÓN',
      },
      {
        id: 'alcance',
        type: 'feature-grid',
        eyebrow: 'CÓMO FUNCIONARÁ',
        heading: 'Cada proyecto, su camino.',
        intro: 'Dos recorridos distintos: reserva directa para trabajos pequeños habilitados y consulta previa para proyectos grandes. Las condiciones y los enlaces se publicarán cuando estén confirmados.',
        items: [
          {
            id: 'portfolio',
            title: 'Trabajos originales',
            body: 'Una selección de piezas fotografiadas por el artista, que incorporaremos al portfolio cuando estén disponibles los archivos originales.',
          },
          {
            id: 'piezas-pequenas',
            title: 'Piezas pequeñas',
            body: 'Podrán reservarse directamente cuando Juanjo confirme qué trabajos entran en esta categoría y habilite su agenda.',
          },
          {
            id: 'proyectos-grandes',
            title: 'Proyectos grandes',
            body: 'El primer contacto será por WhatsApp, solo texto desde este sitio. El número y el mensaje definitivo siguen pendientes de aprobación.',
          },
        ],
      },
    ],
  }],
});

validateBookingTargets(parsedContent.bookingTargets);
export const siteContent = parsedContent;
