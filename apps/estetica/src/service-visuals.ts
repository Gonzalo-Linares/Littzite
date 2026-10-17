import type { VioraServiceVisual } from './service-visuals.validation';
import { validateServiceVisuals } from './service-visuals.validation';
import { siteContent } from './site.config';
import image0 from './assets/services/depilacion-definitiva-approved.jpg';
import small0 from './assets/services/depilacion-definitiva-approved-small.jpg';
import image1 from './assets/services/cejas-pestanas-approved.jpg';
import small1 from './assets/services/cejas-pestanas-approved-small.jpg';
import image2 from './assets/services/limpieza-facial-approved.jpg';
import small2 from './assets/services/limpieza-facial-approved-small.jpg';
import image3 from './assets/services/masajes-approved.jpg';
import small3 from './assets/services/masajes-approved-small.jpg';
import image4 from './assets/services/microneedling-facial-approved.jpg';
import small4 from './assets/services/microneedling-facial-approved-small.jpg';
import image5 from './assets/services/bb-lips-approved.jpg';
import small5 from './assets/services/bb-lips-approved-small.jpg';
export const serviceVisuals = [
  {
    serviceId: 'depilacion-definitiva',
    primary: image0,
    primarySmall: small0,
    primaryAlt: 'Un dispositivo de depilación se aplica sobre una pierna.',
    focalPosition: '50% 50%',
  },
  {
    serviceId: 'cejas-pestanas',
    primary: image1,
    primarySmall: small1,
    primaryAlt: 'Primer plano de un ojo, las pestañas y una ceja.',
    focalPosition: '50% 50%',
  },
  {
    serviceId: 'limpieza-facial',
    primary: image2,
    primarySmall: small2,
    primaryAlt: 'Aplicación de una máscara facial con una brocha.',
    focalPosition: '50% 50%',
  },
  {
    serviceId: 'masajes',
    primary: image3,
    primarySmall: small3,
    primaryAlt: 'Manos y piedras calientes sobre la espalda de una persona.',
    focalPosition: '50% 50%',
  },
  {
    serviceId: 'microneedling-facial',
    primary: image4,
    primarySmall: small4,
    primaryAlt: 'Un dispositivo de microneedling se aplica sobre una mejilla.',
    focalPosition: '50% 50%',
  },
  {
    serviceId: 'bb-lips',
    primary: image5,
    primarySmall: small5,
    primaryAlt: 'Un dispositivo de mano se acerca a los labios de una persona.',
    focalPosition: '50% 50%',
  },
] satisfies VioraServiceVisual[];
validateServiceVisuals(siteContent.services, serviceVisuals);
