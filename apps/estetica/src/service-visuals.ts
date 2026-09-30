import type { VioraServiceVisual } from './service-visuals.validation';
import { validateServiceVisuals } from './service-visuals.validation';
import { siteContent } from './site.config';
import facialPrimary from './assets/services/limpieza-facial-primary.jpg';
import facialReveal from './assets/services/limpieza-facial-reveal.jpg';
import hairRemovalPrimary from './assets/services/depilacion-definitiva-primary.jpg';
import hairRemovalReveal from './assets/services/depilacion-definitiva-reveal.jpg';
import massagePrimary from './assets/services/masajes-primary.jpg';
import massageReveal from './assets/services/masajes-reveal.jpg';
import reikiPrimary from './assets/services/reiki-primary.jpg';
import reikiReveal from './assets/services/reiki-reveal.jpg';

export const serviceVisuals = [
  {
    serviceId: 'limpieza-facial',
    primary: facialPrimary,
    primaryAlt: 'Una especialista aplica una mascarilla facial con una brocha.',
    reveal: facialReveal,
    revealAlt: 'Manos realizan un masaje facial en primer plano.',
    focalPosition: '50% 52%',
  },
  {
    serviceId: 'depilacion-definitiva',
    primary: hairRemovalPrimary,
    primaryAlt: 'Un dispositivo de depilación trabaja sobre la pierna de una persona.',
    reveal: hairRemovalReveal,
    revealAlt: 'Una profesional acerca un dispositivo a una persona con protección ocular.',
    focalPosition: '50% 58%',
  },
  {
    serviceId: 'masajes',
    primary: massagePrimary,
    primaryAlt: 'Manos aplican una compresa de tela durante un masaje corporal.',
    reveal: massageReveal,
    revealAlt: 'Una profesional sostiene la mano de una persona durante un masaje.',
    focalPosition: '50% 54%',
  },
  {
    serviceId: 'reiki',
    primary: reikiPrimary,
    primaryAlt: 'Una persona recibe una sesión de Reiki con las manos sobre el cuerpo.',
    reveal: reikiReveal,
    revealAlt: 'Primer plano de manos en una sesión de bienestar con velas al fondo.',
    focalPosition: '50% 56%',
  },
] satisfies VioraServiceVisual[];

validateServiceVisuals(siteContent.services, serviceVisuals);
