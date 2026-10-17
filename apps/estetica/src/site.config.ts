import { validateCommercialContent, vioraServiceDetails } from './viora-commercial-content.ts';
import { siteContentSchema } from '@littzite/content-schema';
import { validateBookingTargets } from '@littzite/booking';
import { vioraBookingTargetUrls, vioraCommercial } from './viora-release.ts';

// D-09 / VIORA manual de marca, edición 01 (septiembre de 2026).
// Los servicios del manual son líneas editoriales. Las dos agendas y sus URLs
// productivas se configuran fuera del repositorio; Cal.com mantiene horarios,
// disponibilidad y duración de cada Event Type.
const parsedContent = siteContentSchema.parse({
  site: {
    defaultLocale: 'es-AR',
    iconHref: '/brand/viora-botanical-icon.png',
    locations: [{ id: 'viora-public-location', city: vioraCommercial.publicLocation }],
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
    {
      id: 'depilacion-definitiva',
      slug: 'depilacion-definitiva',
      displayName: 'Depilación definitiva',
      description: 'LÁSER DIODO para una reducción progresiva del crecimiento del vello.',
      actions: [
        {
          id: 'reservar',
          type: 'direct-booking',
          label: 'Solicitar turno',
          targetId: 'booking-depilacion-definitiva',
        },
      ],
    },
    {
      id: 'cejas-pestanas',
      slug: 'cejas-pestanas',
      displayName: 'Cejas y pestañas',
      description:
        'Lifting, extensiones de pestañas y laminado de cejas: elegí cómo realzar tu mirada.',
      actions: [
        {
          id: 'reservar',
          type: 'direct-booking',
          label: 'Solicitar turno',
          targetId: 'booking-general',
        },
      ],
    },
    {
      id: 'limpieza-facial',
      slug: 'limpieza-facial',
      displayName: 'Limpieza facial',
      description: 'Higiene, máscaras e hidratación para acompañar el cuidado de tu piel.',
      actions: [
        {
          id: 'reservar',
          type: 'direct-booking',
          label: 'Solicitar turno',
          targetId: 'booking-general',
        },
      ],
    },
    {
      id: 'masajes',
      slug: 'masajes',
      displayName: 'Masajes',
      description:
        'Relajantes, reductores y con piedras calientes: una experiencia corporal a tu medida.',
      actions: [
        {
          id: 'reservar',
          type: 'direct-booking',
          label: 'Solicitar turno',
          targetId: 'booking-general',
        },
      ],
    },
    {
      id: 'bb-lips',
      slug: 'bb-lips',
      displayName: 'BB Lips',
      description:
        'Conocé la propuesta de cuidado estético de labios y consultá el protocolo con Victoria.',
      actions: [
        {
          id: 'reservar',
          type: 'direct-booking',
          label: 'Solicitar turno',
          targetId: 'booking-general',
        },
      ],
    },
    {
      id: 'microneedling-facial',
      slug: 'microneedling-facial',
      displayName: 'Microneedling facial',
      description: 'Cuidado cosmético facial personalizado mediante microneedling con Dermapen.',
      actions: [
        {
          id: 'reservar',
          type: 'direct-booking',
          label: 'Solicitar turno',
          targetId: 'booking-general',
        },
      ],
    },
    {
      id: 'microneedling-capilar',
      slug: 'microneedling-capilar',
      displayName: 'Microneedling capilar',
      description: 'Protocolo estético con Dermapen para el cuidado del cuero cabelludo.',
      actions: [
        {
          id: 'reservar',
          type: 'direct-booking',
          label: 'Solicitar turno',
          targetId: 'booking-general',
        },
      ],
    },
  ],
  bookingTargets: [
    {
      id: 'booking-depilacion-definitiva',
      providerKey: 'cal-com',
      fallbackUrl: vioraBookingTargetUrls.depilacion,
    },
    {
      id: 'booking-general',
      providerKey: 'cal-com',
      fallbackUrl: vioraBookingTargetUrls.general,
    },
  ],
  quoteTargets: [],
  pages: [
    {
      slug: '',
      seo: {
        title: 'VIORA · Estética y bienestar en Rivadavia, San Juan',
        description:
          'Conocé los servicios de estética y bienestar de VIORA en Rivadavia, San Juan. Consultá sus opciones y elegí tu turno.',
      },
      sections: [
        {
          id: 'intro',
          type: 'intro',
          heading: 'Un momento para vos.',
          body: 'Estética y bienestar con el cuidado de VIORA.',
          visualCaption: 'Tu momento, tu bienestar.',
        },
      ],
    },
  ],
});

validateBookingTargets(parsedContent.bookingTargets);
validateCommercialContent(parsedContent.services, vioraServiceDetails);
export const siteContent = parsedContent;
