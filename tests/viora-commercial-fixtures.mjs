// All content, images and amounts here are synthetic test fixtures, never app content.
export function approvedCommercialFixture() {
  return {
    professional: {
      src: '/tests/victoria-fixture.png',
      alt: 'Retrato fixture',
      focalPosition: '50% 50%',
      temporary: false,
      required: true,
    },
    space: [
      {
        src: '/tests/space-fixture.png',
        alt: 'Espacio fixture',
        focalPosition: '50% 50%',
        temporary: false,
        required: true,
      },
    ],
    services: [
      {
        serviceId: 'fixture-service',
        summary: 'Resumen fixture',
        contentStatus: 'confirmed',
        contentRequired: true,
        intro: 'Introducción fixture',
        purpose: 'Objetivo fixture',
        includes: ['Incluye fixture'],
        session: ['Paso fixture'],
        pricing: {
          status: 'confirmed',
          required: true,
          priceGroups: [
            {
              id: 'opciones',
              title: 'Opciones fixture',
              items: [{ id: 'opcion', label: 'Opción fixture', amountArs: 12345 }],
            },
          ],
        },
      },
    ],
  };
}
