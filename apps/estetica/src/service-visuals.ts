import type { VioraServiceVisual } from './service-visuals.validation';
import { validateServiceVisuals } from './service-visuals.validation';
import { siteContent } from './site.config';
import facialPrimary from './assets/services/limpieza-facial-primary.jpg';
import facialPrimarySmall from './assets/services/limpieza-facial-primary-small.jpg';
import facialReveal from './assets/services/limpieza-facial-reveal.jpg';
import facialRevealSmall from './assets/services/limpieza-facial-reveal-small.jpg';
import hairRemovalPrimary from './assets/services/depilacion-definitiva-primary.jpg';
import hairRemovalPrimarySmall from './assets/services/depilacion-definitiva-primary-small.jpg';
import hairRemovalReveal from './assets/services/depilacion-definitiva-reveal.jpg';
import hairRemovalRevealSmall from './assets/services/depilacion-definitiva-reveal-small.jpg';
import massagePrimary from './assets/services/masajes-primary.jpg';
import massagePrimarySmall from './assets/services/masajes-primary-small.jpg';
import massageReveal from './assets/services/masajes-reveal.jpg';
import massageRevealSmall from './assets/services/masajes-reveal-small.jpg';
import reikiPrimary from './assets/services/reiki-primary.jpg';
import reikiPrimarySmall from './assets/services/reiki-primary-small.jpg';
import reikiReveal from './assets/services/reiki-reveal.jpg';
import reikiRevealSmall from './assets/services/reiki-reveal-small.jpg';

export const serviceVisuals = [
  {
    serviceId: 'limpieza-facial',
    primary: facialPrimary,
    primarySmall: facialPrimarySmall,
    primaryAlt: 'Una especialista aplica una mascarilla facial con una brocha.',
    reveal: facialReveal,
    revealSmall: facialRevealSmall,
    revealAlt: 'Manos realizan un masaje facial en primer plano.',
    focalPosition: '50% 52%',
  },
  {
    serviceId: 'depilacion-definitiva',
    primary: hairRemovalPrimary,
    primarySmall: hairRemovalPrimarySmall,
    primaryAlt: 'Un dispositivo de depilación trabaja sobre la pierna de una persona.',
    reveal: hairRemovalReveal,
    revealSmall: hairRemovalRevealSmall,
    revealAlt: 'Una profesional acerca un dispositivo a una persona con protección ocular.',
    focalPosition: '50% 58%',
  },
  {
    serviceId: 'masajes',
    primary: massagePrimary,
    primarySmall: massagePrimarySmall,
    primaryAlt: 'Manos aplican una compresa de tela durante un masaje corporal.',
    reveal: massageReveal,
    revealSmall: massageRevealSmall,
    revealAlt: 'Una profesional sostiene la mano de una persona durante un masaje.',
    focalPosition: '50% 54%',
  },
  {
    serviceId: 'reiki',
    primary: reikiPrimary,
    primarySmall: reikiPrimarySmall,
    primaryAlt: 'Una persona recibe una sesión de Reiki con las manos sobre el cuerpo.',
    reveal: reikiReveal,
    revealSmall: reikiRevealSmall,
    revealAlt: 'Primer plano de manos en una sesión de bienestar con velas al fondo.',
    focalPosition: '50% 56%',
  },
] satisfies VioraServiceVisual[];

validateServiceVisuals(siteContent.services, serviceVisuals);
