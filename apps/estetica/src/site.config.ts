import { siteContentSchema } from '@littzite/content-schema';

// Editorial sample only: these are not real client claims or published services.
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
    title: 'Prototipo de estética | Littzite',
    sections: [
      {
        id: 'intro',
        type: 'intro',
        eyebrow: 'Estética / exploración editorial',
        heading: 'Una pausa para vos',
        body: 'Una propuesta visual para imaginar una experiencia clara y serena. Los tratamientos, el contenido y los turnos reales se incorporarán después de validarlos con el negocio.',
        visualCaption: 'Calma, cuidado y espacio',
      },
      {
        id: 'alcance',
        type: 'feature-grid',
        eyebrow: 'El enfoque',
        heading: 'Lo que tendrá este espacio',
        intro: 'Tres partes de un futuro sitio de estética. Por ahora son una demostración de componentes y composición.',
        items: [
          { id: 'catalogo', title: 'Tratamientos', body: 'Un catálogo legible con fichas y duraciones reales cuando estén confirmadas.' },
          { id: 'agenda', title: 'Reservas', body: 'Un acceso sencillo a la agenda externa de la profesional, una vez elegido el proveedor.' },
          { id: 'identidad', title: 'Identidad', body: 'Fotografías, textos y detalles propios del negocio, publicados solo con autorización.' },
        ],
      },
    ],
  }],
});
