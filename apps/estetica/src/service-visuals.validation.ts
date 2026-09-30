import type { ImageMetadata } from 'astro';
import type { Service } from '@littzite/content-schema';

export interface VioraServiceVisual {
  serviceId: string;
  primary: ImageMetadata;
  primaryAlt: string;
  reveal?: ImageMetadata;
  revealAlt?: string;
  focalPosition?: string;
}

export function resolveServiceVisual(
  visuals: readonly VioraServiceVisual[],
  serviceId: string,
): VioraServiceVisual | undefined {
  return visuals.find((visual) => visual.serviceId === serviceId);
}

const isUsefulAlt = (value: string | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isImageMetadata = (value: ImageMetadata | undefined): value is ImageMetadata =>
  value !== undefined
  && typeof value.src === 'string'
  && value.src.length > 0
  && Number.isInteger(value.width)
  && value.width > 0
  && Number.isInteger(value.height)
  && value.height > 0;

const focalPositionPattern = /^(?:left|center|right|\d{1,3}%)\s+(?:top|center|bottom|\d{1,3}%)$/;

export function validateServiceVisuals(
  services: readonly Pick<Service, 'id'>[],
  visuals: readonly VioraServiceVisual[],
): void {
  const serviceIds = new Set(services.map(({ id }) => id));
  const visualServiceIds = new Set<string>();

  for (const visual of visuals) {
    if (!serviceIds.has(visual.serviceId)) {
      throw new Error(`Visual references unknown VIORA service: ${visual.serviceId}`);
    }
    if (visualServiceIds.has(visual.serviceId)) {
      throw new Error(`Duplicate VIORA visual for service: ${visual.serviceId}`);
    }
    visualServiceIds.add(visual.serviceId);

    if (!isImageMetadata(visual.primary)) {
      throw new Error(`Invalid primary image for VIORA service: ${visual.serviceId}`);
    }
    if (!isUsefulAlt(visual.primaryAlt)) {
      throw new Error(`Primary image alt is required for VIORA service: ${visual.serviceId}`);
    }
    if (visual.reveal !== undefined) {
      if (!isImageMetadata(visual.reveal)) {
        throw new Error(`Invalid reveal image for VIORA service: ${visual.serviceId}`);
      }
      if (!isUsefulAlt(visual.revealAlt)) {
        throw new Error(`Reveal image alt is required for VIORA service: ${visual.serviceId}`);
      }
    } else if (visual.revealAlt !== undefined) {
      throw new Error(`Reveal alt requires a reveal image for VIORA service: ${visual.serviceId}`);
    }
    if (visual.focalPosition !== undefined && !focalPositionPattern.test(visual.focalPosition)) {
      throw new Error(`Invalid focal position for VIORA service: ${visual.serviceId}`);
    }
  }
}
