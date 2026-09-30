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
  services: [
    { id: 'limpieza-facial', slug: 'limpieza-facial', displayName: 'Limpieza facial', description: 'Una l\u00ednea de cuidado facial de VIORA. La t\u00e9cnica y el alcance de la propuesta se confirmar\u00e1n antes de ofrecer turnos.', actions: [] },
    { id: 'depilacion-definitiva', slug: 'depilacion-definitiva', displayName: 'Depilaci\u00f3n definitiva', description: 'Una l\u00ednea de cuidado personal de VIORA. El equipo, el procedimiento y su alcance se confirmar\u00e1n antes de ofrecer turnos.', actions: [] },
    { id: 'masajes', slug: 'masajes', displayName: 'Masajes', description: 'Una l\u00ednea de bienestar de VIORA. Las modalidades y el alcance de la propuesta se confirmar\u00e1n antes de ofrecer turnos.', actions: [] },
    { id: 'reiki', slug: 'reiki', displayName: 'Reiki', description: 'Una experiencia de bienestar de VIORA. Se comunica como una pr\u00e1ctica de bienestar y no como tratamiento de enfermedades.', actions: [] },
  ],
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
        type: 'service-list',
        serviceIds: ['limpieza-facial', 'depilacion-definitiva', 'masajes', 'reiki'],
      },
    ],
  }],
});
