import type { Service } from '@littzite/content-schema';

export interface VioraPriceItem {
  id: string;
  label: string;
  detail?: string;
  amountArs?: number;
  prefix?: 'Desde';
}
export interface VioraPriceGroup {
  id: string;
  title: string;
  items: VioraPriceItem[];
}
export interface VioraPreviewPriceGroup {
  id: string;
  title: string;
  items: Array<Omit<VioraPriceItem, 'amountArs'> & { amountArs?: never }>;
}
export type VioraPricing =
  | {
      status: 'pending';
      required: boolean;
      priceGroups: [];
      previewGroups?: VioraPreviewPriceGroup[];
    }
  | {
      status: 'confirmed';
      required: boolean;
      priceGroups: VioraPriceGroup[];
      previewGroups?: never;
    };
export interface VioraServiceDetail {
  serviceId: string;
  summary: string;
  contentStatus: 'pending' | 'confirmed';
  contentRequired: boolean;
  intro?: string;
  purpose?: string;
  includes?: string[];
  session?: string[];
  pricing: VioraPricing;
  faq?: Array<{ question: string; answer: string }>;
}
export interface VioraMedia {
  src?: string;
  alt: string;
  focalPosition: string;
  temporary: boolean;
  required: boolean;
}
// No portrait or room is simulated. Only replace these fields with approved local photos.
export const victoriaMedia: VioraMedia = {
  alt: '',
  focalPosition: '50% 50%',
  temporary: true,
  required: true,
};
export const vioraSpaceMedia: VioraMedia[] = [
  { alt: '', focalPosition: '50% 50%', temporary: true, required: true },
  { alt: '', focalPosition: '50% 50%', temporary: true, required: true },
];
export const victoriaIntroduction =
  'Soy quien está detrás de VIORA. Te acompaño a conocer cada servicio y elegir la opción que mejor vaya con vos.';
export const vioraServiceDetails: VioraServiceDetail[] = [
  {
    serviceId: 'limpieza-facial',
    summary: 'Conocé la propuesta de cuidado facial y consultá sus opciones.',
    contentStatus: 'pending',
    contentRequired: true,
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
      previewGroups: [
        {
          id: 'muestra-grupo-0',
          title: 'Opciones',
          items: [
            { id: 'muestra-0-0', label: 'Limpieza facial', prefix: 'Desde' },
            { id: 'muestra-0-1', label: 'Limpieza profunda' },
            { id: 'muestra-0-2', label: 'Limpieza con aparatología' },
          ],
        },
      ],
    },
  },
  {
    serviceId: 'depilacion-definitiva',
    summary: 'Consultá las zonas y opciones antes de elegir tu turno.',
    contentStatus: 'pending',
    contentRequired: true,
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
      previewGroups: [
        {
          id: 'muestra-grupo-0',
          title: 'Zonas',
          items: [
            { id: 'muestra-0-0', label: 'Axilas', prefix: 'Desde' },
            { id: 'muestra-0-1', label: 'Cavado' },
            { id: 'muestra-0-2', label: 'Piernas completas' },
            { id: 'muestra-0-3', label: 'Rostro' },
          ],
        },
        {
          id: 'muestra-grupo-1',
          title: 'Combos',
          items: [
            { id: 'muestra-1-0', label: 'Axilas + cavado', prefix: 'Desde' },
            { id: 'muestra-1-1', label: 'Cuerpo completo' },
          ],
        },
      ],
    },
  },
  {
    serviceId: 'masajes',
    summary: 'Conocé la propuesta de bienestar y consultá las modalidades.',
    contentStatus: 'pending',
    contentRequired: true,
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
      previewGroups: [
        {
          id: 'muestra-grupo-0',
          title: 'Opciones',
          items: [
            { id: 'muestra-0-0', label: 'Sesión individual', prefix: 'Desde' },
            { id: 'muestra-0-1', label: 'Sesión extendida' },
          ],
        },
      ],
    },
  },
  {
    serviceId: 'reiki',
    summary: 'Explorá una experiencia de bienestar y consultá en qué consiste.',
    contentStatus: 'pending',
    contentRequired: true,
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
      previewGroups: [
        {
          id: 'muestra-grupo-0',
          title: 'Opción',
          items: [{ id: 'muestra-0-0', label: 'Sesión', prefix: 'Desde' }],
        },
      ],
    },
  },
];
const slugSafe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const useful = (value: string | undefined) => typeof value === 'string' && value.trim().length > 0;
function validateMedia(media: VioraMedia) {
  if (
    !/^((left|center|right|(?:100|[0-9]{1,2})%) (top|center|bottom|(?:100|[0-9]{1,2})%))$/.test(
      media.focalPosition,
    )
  )
    throw new Error('Invalid VIORA focal position');
  if (media.src && (!/^\/(?!\/)/.test(media.src) || media.src.includes('..') || !useful(media.alt)))
    throw new Error('VIORA media requires a local image and useful alt');
}
export function validateCommercialContent(
  services: readonly Pick<Service, 'id'>[],
  details: readonly VioraServiceDetail[],
): void {
  const canonical = new Set(services.map(({ id }) => id));
  const seen = new Set<string>();
  for (const detail of details) {
    if (
      !slugSafe.test(detail.serviceId) ||
      !canonical.has(detail.serviceId) ||
      seen.has(detail.serviceId)
    )
      throw new Error('Unknown or duplicate VIORA service detail: ' + detail.serviceId);
    seen.add(detail.serviceId);
    if (!useful(detail.summary) || !['pending', 'confirmed'].includes(detail.contentStatus))
      throw new Error('Invalid VIORA service content');
    if (
      detail.contentStatus === 'confirmed' &&
      (!useful(detail.intro) ||
        !useful(detail.purpose) ||
        !detail.includes?.length ||
        !detail.session?.length)
    )
      throw new Error('Confirmed VIORA service content is incomplete');
    for (const values of [detail.includes, detail.session])
      if (values?.some((value) => !useful(value))) throw new Error('Empty VIORA service copy');
    if (detail.faq?.some(({ question, answer }) => !useful(question) || !useful(answer)))
      throw new Error('Incomplete VIORA FAQ');
    if (!['pending', 'confirmed'].includes(detail.pricing.status))
      throw new Error('Invalid VIORA pricing status');
    if (detail.pricing.status === 'pending' && detail.pricing.priceGroups.length)
      throw new Error('Pending VIORA pricing must not contain prices');
    if (detail.pricing.status === 'confirmed' && !detail.pricing.priceGroups.length)
      throw new Error('Confirmed VIORA pricing needs options');
    if (detail.pricing.status === 'confirmed' && detail.pricing.previewGroups !== undefined)
      throw new Error('Confirmed VIORA pricing cannot contain preview groups');
    const groupIds = new Set<string>();
    const itemIds = new Set<string>();
    for (const group of detail.pricing.status === 'pending'
      ? (detail.pricing.previewGroups ?? [])
      : detail.pricing.priceGroups) {
      if (
        !slugSafe.test(group.id) ||
        groupIds.has(group.id) ||
        !useful(group.title) ||
        !group.items.length
      )
        throw new Error('Invalid or duplicate VIORA price group');
      groupIds.add(group.id);
      for (const item of group.items) {
        if (!slugSafe.test(item.id) || itemIds.has(item.id) || !useful(item.label))
          throw new Error('Invalid or duplicate VIORA price option');
        itemIds.add(item.id);
        if (detail.pricing.status === 'pending' && item.amountArs !== undefined)
          throw new Error('Preview VIORA pricing must not contain amounts');
        if (
          item.amountArs !== undefined &&
          (!Number.isSafeInteger(item.amountArs) || item.amountArs <= 0)
        )
          throw new Error('Invalid VIORA ARS amount');
        if (item.prefix !== undefined && item.prefix !== 'Desde')
          throw new Error('Invalid VIORA price prefix');
        if (detail.pricing.status === 'confirmed' && item.prefix && item.amountArs === undefined)
          throw new Error('VIORA price prefix requires an amount');
        if (
          detail.pricing.status === 'confirmed' &&
          detail.pricing.required &&
          item.amountArs === undefined
        )
          throw new Error('Required VIORA pricing needs every amount');
      }
    }
  }
  if (seen.size !== canonical.size) throw new Error('Missing VIORA service details');
}
export function serviceDetailFor(id: string): VioraServiceDetail {
  const detail = vioraServiceDetails.find((detail) => detail.serviceId === id);
  if (!detail) throw new Error('Missing VIORA service detail: ' + id);
  return detail;
}
const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});
export function formatArs(amount: number): string {
  if (!Number.isSafeInteger(amount) || amount <= 0) throw new Error('Invalid VIORA ARS amount');
  return ars.format(amount);
}
export interface VioraCommercialReadiness {
  professional: VioraMedia;
  space: VioraMedia[];
  services: VioraServiceDetail[];
}
export const vioraCommercialReadiness: VioraCommercialReadiness = {
  professional: victoriaMedia,
  space: vioraSpaceMedia,
  services: vioraServiceDetails,
};
export function commercialReleaseBlockers(readiness: VioraCommercialReadiness): string[] {
  validateCommercialContent(
    readiness.services.map(({ serviceId }) => ({ id: serviceId })),
    readiness.services,
  );
  const blockers: string[] = [];
  validateMedia(readiness.professional);
  if (
    readiness.professional.required &&
    (readiness.professional.temporary || !readiness.professional.src)
  )
    blockers.push('commercial.professional-image');
  if (!readiness.space.length) blockers.push('commercial.space-images.missing');
  readiness.space.forEach((media, index) => {
    validateMedia(media);
    if (media.required && (media.temporary || !media.src))
      blockers.push('commercial.space-image.' + index);
  });
  if (!readiness.services.length) blockers.push('commercial.services.missing');
  for (const detail of readiness.services) {
    if (detail.contentRequired && detail.contentStatus !== 'confirmed')
      blockers.push('commercial.content.' + detail.serviceId);
    if (detail.pricing.status === 'pending' && detail.pricing.previewGroups?.length)
      blockers.push('commercial.preview-pricing.' + detail.serviceId);
    if (detail.pricing.required && detail.pricing.status !== 'confirmed')
      blockers.push('commercial.pricing.' + detail.serviceId);
  }
  return blockers;
}

// Symbolic preview mask: deliberately not a numeric price or an approved ARS amount.
export function previewPriceLabel(prefix?: 'Desde'): string {
  return prefix ? 'Desde $00.000' : '$00.000';
}
