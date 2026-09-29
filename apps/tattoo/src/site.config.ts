import { siteContentSchema } from '@littzite/content-schema';

// Editorial sample only: no real portfolio, availability or commercial data.
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
    title: 'Prototipo de tatuajes | Littzite',
    sections: [
      {
        id: 'intro',
        type: 'intro',
        eyebrow: 'Tatuajes / exploración editorial',
        heading: 'Ideas que dejan huella',
        body: 'Un prototipo para dar protagonismo al arte, el portfolio y los distintos recorridos de consulta. Las imágenes, los servicios y el contacto definitivos aún están pendientes.',
        visualCaption: 'Una idea. Una composición.',
      },
      {
        id: 'alcance',
        type: 'feature-grid',
        eyebrow: 'El concepto',
        heading: 'Arte, consulta y recorrido',
        intro: 'Una estructura pensada para mostrar trabajos auténticos y orientar al visitante sin mezclar turnos y presupuestos.',
        items: [
          { id: 'portfolio', title: 'Portfolio', body: 'Galerías editoriales con fotografías originales y permisos verificados.' },
          { id: 'turnos', title: 'Turnos pequeños', body: 'Reservas directas para los trabajos que el artista habilite, sin agenda propia.' },
          { id: 'presupuestos', title: 'Piezas grandes', body: 'Consultas iniciales por WhatsApp, solo texto en el flujo del sitio.' },
        ],
      },
    ],
  }],
});
