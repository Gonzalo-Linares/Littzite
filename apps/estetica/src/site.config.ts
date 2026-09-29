import { siteContentSchema } from '@littzite/content-schema';

// D-09 / VIORA manual de marca, edición 01 (septiembre de 2026).
// Los servicios del manual son líneas editoriales: disponibilidad, técnicas,
// precios, duración y política de turnos deben confirmarse antes del lanzamiento.
export const siteContent = siteContentSchema.parse({
  site: {
    defaultLocale: 'es-AR',
    theme: {
      surface: '#FAF5F0', // Marfil
      text: '#39252D', // Tinta
      accent: '#7B4655', // Ciruela
      accentText: '#FAF5F0',
      border: '#D7BEC4', // Borde derivado, no un color de marca principal
      focus: '#39252D',
    },
  },
  services: [],
  bookingTargets: [],
  quoteTargets: [],
  pages: [{
    slug: '',
    title: 'VIORA · Estética integral | Vista previa',
    sections: [
      {
        id: 'intro',
        type: 'intro',
        eyebrow: 'VIORA / estética integral',
        heading: 'Regalate una pausa.',
        body: 'Tu momento, tu bienestar. Un espacio donde el cuidado personal se encuentra con una atención cercana, serena y profesional.',
        visualCaption: 'Tu momento, tu bienestar.',
      },
      {
        id: 'alcance',
        type: 'feature-grid',
        eyebrow: 'Nuestro universo',
        heading: 'Cada cuidado tiene su momento.',
        intro: 'Las cuatro líneas de VIORA, según el manual de marca. Los detalles de cada servicio y la agenda estarán disponibles cuando estén confirmados.',
        items: [
          { id: 'facial', title: 'Limpieza facial', body: 'Un espacio para dedicarle atención a tu piel. Técnica y disponibilidad por confirmar.' },
          { id: 'depilacion', title: 'Depilación definitiva', body: 'Información clara sobre el servicio cuando estén validados el equipo y el procedimiento.' },
          { id: 'masajes', title: 'Masajes', body: 'Una propuesta de bienestar para bajar el ritmo y regalarte una pausa.' },
          { id: 'reiki', title: 'Reiki', body: 'Una experiencia de bienestar, sin presentarla como tratamiento de enfermedades.' },
        ],
      },
    ],
  }],
});
