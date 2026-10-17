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
  variants?: Array<{ name: string; description: string }>;
  care?: string[];
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
  src: '/images/victoria-linares.jpg',
  alt: 'Victoria Linares, esteticista integral de VIORA.',
  focalPosition: '50% 50%',
  temporary: false,
  required: true,
};
export const vioraSpaceMedia: VioraMedia[] = [
  { alt: '', focalPosition: '50% 50%', temporary: true, required: true },
  { alt: '', focalPosition: '50% 50%', temporary: true, required: true },
];
export const victoriaIntroduction =
  'Victoria Linares. Esteticista integral especializada en el cuidado del cuerpo y el bienestar físico-emocional, creando experiencias de relajación y armonía a través de técnicas manuales conscientes y personalizadas.';
export const vioraServiceDetails: VioraServiceDetail[] = [
  {
    serviceId: 'depilacion-definitiva',
    summary: 'LÁSER DIODO para una reducción progresiva del crecimiento del vello.',
    contentStatus: 'confirmed',
    contentRequired: true,
    intro:
      'La depilación definitiva de VIORA utiliza LÁSER DIODO. La luz actúa sobre el pigmento del vello y busca reducir progresivamente su crecimiento a lo largo de varias sesiones.',
    purpose:
      'Simplificar tu rutina de depilación y conseguir una piel de aspecto más uniforme, con una respuesta que varía según cada persona.',
    includes: [
      'Evaluación de la zona y del vello antes de comenzar.',
      'Consulta por zonas habituales como axilas, cavado, piernas y rostro; la aptitud de cada zona se define antes del turno.',
      'Aplicación con láser diodo y orientación de cuidados.',
    ],
    session: [
      'Conversás con Victoria sobre tu piel, exposición solar y métodos de depilación utilizados.',
      'Se revisa la zona y se acuerdan las condiciones de la sesión.',
      'La aplicación puede producir sensación de calor o molestias; avisá si necesitás una pausa.',
    ],
    care: [
      'Consultá cómo preparar la zona y cuándo rasurarla; evitá arrancar el vello de raíz entre sesiones.',
      'Informá sobre bronceado reciente, productos y medicación antes de la aplicación.',
      'Seguí las indicaciones de protección solar y cuidado suave que recibas.',
    ],
    faq: [
      {
        question: '¿Elimina todo el vello para siempre?',
        answer:
          'No se promete eliminación permanente absoluta. Se busca una reducción progresiva del crecimiento del vello; la cantidad de sesiones y el mantenimiento dependen de la respuesta individual.',
      },
      {
        question: '¿Cuántas sesiones necesito?',
        answer:
          'Se acuerdan después de evaluar tu caso. No hay un número único ni resultados garantizados para todas las personas.',
      },
      {
        question: '¿Dónde reservo?',
        answer:
          'La agenda de depilación tiene su propio enlace. Allí podés consultar los horarios disponibles; confirmá previamente la zona y los cuidados.',
      },
    ],
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
    },
  },
  {
    serviceId: 'cejas-pestanas',
    summary: 'Lifting, extensiones de pestañas y laminado de cejas: elegí cómo realzar tu mirada.',
    contentStatus: 'confirmed',
    contentRequired: true,
    intro:
      'Una misma categoría para elegir el acabado que buscás en cejas y pestañas. Victoria ofrece lifting, extensiones y laminado; conversá con ella para definir la opción adecuada.',
    purpose:
      'Realzar la mirada respetando tus preferencias y las características de tus cejas y pestañas.',
    includes: [
      'Consulta sobre el efecto que querés conseguir.',
      'Elección del servicio y explicación de sus cuidados.',
      'Confirmación del valor y de las condiciones antes del turno.',
    ],
    session: [
      'Contá si buscás curvatura, mayor presencia de pestañas o una dirección más ordenada de las cejas.',
      'Victoria revisa la zona y acuerda la opción con vos.',
      'Al finalizar, recibís indicaciones específicas para el servicio elegido.',
    ],
    variants: [
      {
        name: 'Lifting de pestañas',
        description:
          'Trabaja la curvatura de tus pestañas naturales. Es una opción si querés destacar las que ya tenés sin sumar extensiones.',
      },
      {
        name: 'Extensiones de pestañas',
        description:
          'Se añaden extensiones para dar mayor presencia a la mirada. El acabado y el mantenimiento se acuerdan con Victoria según tus pestañas y preferencias.',
      },
      {
        name: 'Laminado de cejas',
        description:
          'Orienta y acomoda el pelo de las cejas para un aspecto más ordenado. Se diferencia del lifting porque trabaja sobre las cejas.',
      },
    ],
    care: [
      'Informá si tenés sensibilidad o irritación en la zona antes de reservar.',
      'Consultá los tiempos de cuidado, limpieza y mantenimiento correspondientes a la técnica elegida.',
    ],
    faq: [
      {
        question: '¿Cuál elijo?',
        answer:
          'Para curvar tus pestañas naturales, consultá por lifting. Para sumar presencia mediante extensiones, elegí una consulta de extensiones. Para ordenar el pelo de las cejas, consultá por laminado.',
      },
      {
        question: '¿Puedo combinar servicios?',
        answer:
          'Consultá disponibilidad y compatibilidad antes de reservar. No hay combos ni descuentos confirmados en esta página.',
      },
    ],
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
    },
  },
  {
    serviceId: 'limpieza-facial',
    summary: 'Higiene, máscaras e hidratación para acompañar el cuidado de tu piel.',
    contentStatus: 'confirmed',
    contentRequired: true,
    intro:
      'Una sesión de cuidado facial que combina higiene, máscaras e hidratación según lo que tu piel necesite en ese momento.',
    purpose:
      'Retirar impurezas superficiales y acompañar una sensación de limpieza, suavidad y confort, sin prometer tratar enfermedades de la piel.',
    includes: [
      'Higiene inicial adaptada a la piel.',
      'Extracciones únicamente cuando correspondan y tras evaluar la zona.',
      'Máscara facial e hidratación o cuidado final según el protocolo acordado.',
    ],
    session: [
      'Conversás sobre tu rutina y sensibilidad.',
      'Victoria define los pasos y si corresponden extracciones.',
      'La sesión cierra con cuidado final e indicaciones para continuar en casa.',
    ],
    variants: [
      {
        name: 'Cuidado de higiene e hidratación',
        description:
          'Prioriza la limpieza superficial y el confort. Consultá la adaptación disponible para tu piel.',
      },
      {
        name: 'Limpieza con extracciones cuando correspondan',
        description:
          'Suma extracciones si la evaluación lo permite. No todas las pieles ni todas las sesiones las necesitan.',
      },
    ],
    care: [
      'Llevá información sobre los productos que usás y cualquier sensibilidad reciente.',
      'Evitá sumar exfoliaciones por tu cuenta inmediatamente después; seguí las indicaciones recibidas.',
    ],
    faq: [
      {
        question: '¿Siempre incluye extracciones?',
        answer: 'No. Depende de la evaluación y de la tolerancia de tu piel.',
      },
      {
        question: '¿Sirve para tratar el acné?',
        answer:
          'Se ofrece como cuidado estético. Las patologías o lesiones que necesiten diagnóstico y tratamiento requieren consulta con un profesional de salud.',
      },
    ],
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
    },
  },
  {
    serviceId: 'masajes',
    summary:
      'Relajantes, reductores y con piedras calientes: una experiencia corporal a tu medida.',
    contentStatus: 'confirmed',
    contentRequired: true,
    intro:
      'Elegí entre masajes relajantes, reductores o con piedras calientes. Cada variante propone una experiencia distinta, con intensidad y preferencias conversadas antes de empezar.',
    purpose:
      'Dedicar un momento al bienestar corporal y elegir un cuidado manual acorde a lo que buscás.',
    includes: [
      'Conversación inicial sobre comodidad y zonas a trabajar.',
      'Elección de la modalidad e intensidad.',
      'Orientación para disfrutar la experiencia y comunicar cualquier molestia.',
    ],
    session: [
      'Contás qué experiencia preferís y si hay zonas sensibles.',
      'Victoria adapta el encuentro dentro de la modalidad elegida.',
      'Podés pedir cambios de presión o detener la sesión en cualquier momento.',
    ],
    variants: [
      {
        name: 'Masajes relajantes',
        description:
          'Maniobras suaves y un ritmo pausado para una experiencia de descanso y desconexión. Elegilos si priorizás relajarte.',
      },
      {
        name: 'Masajes reductores',
        description:
          'Trabajo manual de enfoque cosmético sobre zonas acordadas, con una sensación más intensa que el relajante. No implica pérdida de peso ni reducción garantizada de medidas.',
      },
      {
        name: 'Masajes con piedras calientes',
        description:
          'Combina maniobras con el uso de piedras calientes para una experiencia envolvente de calor y relajación. La temperatura y la comodidad se conversan durante la sesión.',
      },
    ],
    care: [
      'Informá si el calor o la presión te resultan incómodos y comentá cualquier condición relevante antes de comenzar.',
      'Si buscás atención por dolor o una lesión, consultá con un profesional de salud.',
    ],
    faq: [
      {
        question: '¿Qué masaje elijo para descansar?',
        answer:
          'El relajante prioriza un ritmo suave; las piedras calientes suman una experiencia de calor. El reductor tiene un objetivo cosmético y una intensidad diferente.',
      },
      {
        question: '¿El masaje reductor adelgaza?',
        answer:
          'No se promete pérdida de peso, eliminación de grasa ni cambios permanentes de medidas.',
      },
    ],
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
    },
  },
  {
    serviceId: 'bb-lips',
    summary:
      'Conocé la propuesta de cuidado estético de labios y consultá el protocolo con Victoria.',
    contentStatus: 'pending',
    contentRequired: true,
    intro:
      'BB Lips es una propuesta independiente de cuidado estético de labios. Antes de reservar, consultá con Victoria en qué consiste su protocolo y si es adecuado para vos.',
    purpose:
      'Elegir un cuidado de labios con información clara sobre el procedimiento, sus límites y sus cuidados.',
    includes: [
      'Consulta previa sobre la propuesta disponible.',
      'Confirmación de la técnica y los productos utilizados antes de aceptar el servicio.',
      'Explicación de la experiencia y de los cuidados particulares.',
    ],
    session: [
      'Contá qué buscás y si tenés sensibilidad en los labios.',
      'Pedí a Victoria que te explique los pasos, productos y sensaciones antes de comenzar.',
      'Acordá las indicaciones posteriores y cuándo consultar por molestias.',
    ],
    care: [
      'Consultá la preparación y los cuidados específicos antes del turno.',
      'Avisá si la zona está irritada o presenta lesiones antes de realizar cualquier procedimiento.',
    ],
    faq: [
      {
        question: '¿Es micropigmentación de labios?',
        answer:
          'No se presenta BB Lips como micropigmentación. Consultá con Victoria la técnica concreta de su propuesta antes de reservar.',
      },
      {
        question: '¿Incluye Dermapen, pigmentos o ácido hialurónico?',
        answer:
          'El protocolo específico todavía requiere confirmación con Victoria. Esta página no afirma que incluya microneedling, pigmentos, color, ácido hialurónico ni otros activos.',
      },
      {
        question: '¿Aumenta el volumen?',
        answer: 'No se promete aumento de volumen ni un resultado de color determinado.',
      },
    ],
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
    },
  },
  {
    serviceId: 'microneedling-facial',
    summary: 'Cuidado cosmético facial personalizado mediante microneedling con Dermapen.',
    contentStatus: 'confirmed',
    contentRequired: true,
    intro:
      'Tratamiento estético realizado con Dermapen, un dispositivo de microneedling que realiza micropunciones superficiales sobre la piel del rostro dentro de un protocolo personalizado.',
    purpose:
      'Acompañar objetivos cosméticos relacionados con el aspecto y la textura de la piel, con expectativas acordadas según cada caso.',
    includes: [
      'Evaluación previa del estado de la piel y de tus objetivos cosméticos.',
      'Protocolo de microneedling facial con Dermapen adaptado a la evaluación.',
      'Indicaciones de cuidado antes y después de la sesión.',
    ],
    session: [
      'Victoria conversa con vos sobre tu rutina y la tolerancia de tu piel.',
      'Se explica y acuerda el protocolo antes de comenzar.',
      'La sensación y la reacción de la piel pueden variar; se revisan los cuidados posteriores.',
    ],
    care: [
      'Informá sobre sensibilidad, lesiones, tratamientos recientes y productos que utilizás.',
      'Seguí las indicaciones de higiene, protección solar y productos permitidos; no agregues activos por tu cuenta.',
    ],
    faq: [
      {
        question: '¿Dermapen es otro servicio?',
        answer:
          'Dermapen es el dispositivo utilizado en este protocolo. La propuesta comercial es Microneedling facial.',
      },
      {
        question: '¿Se utilizan peptonas u otros activos?',
        answer:
          'No hay activos específicos confirmados en esta página. Consultá el protocolo disponible con Victoria; no se ofrece una ficha separada de peptonas.',
      },
      {
        question: '¿Cuándo se ven resultados?',
        answer:
          'La respuesta varía y no se garantizan cambios ni plazos. Antes de comenzar, conversá sobre objetivos realistas y cuidados.',
      },
    ],
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
    },
  },
  {
    serviceId: 'microneedling-capilar',
    summary: 'Protocolo estético con Dermapen para el cuidado del cuero cabelludo.',
    contentStatus: 'confirmed',
    contentRequired: true,
    intro:
      'Protocolo estético de microneedling con Dermapen sobre el cuero cabelludo. La propuesta se orienta al cuidado de esa zona, con evaluación previa y sin promesas de resultados médicos.',
    purpose:
      'Incorporar un cuidado estético personalizado del cuero cabelludo dentro del alcance de VIORA.',
    includes: [
      'Conversación sobre tus objetivos de cuidado y el estado del cuero cabelludo.',
      'Evaluación previa para definir si corresponde realizar la sesión.',
      'Aplicación con Dermapen y explicación de los cuidados acordados.',
    ],
    session: [
      'Comentás sensibilidad, tratamientos y cualquier cambio reciente en el cuero cabelludo.',
      'Victoria explica el procedimiento y sus límites antes de comenzar.',
      'Recibís indicaciones sobre higiene y productos posteriores.',
    ],
    care: [
      'Consultá antes si hay irritación o lesiones en la zona.',
      'Confirmá cuándo lavar el cabello y qué productos usar según el protocolo que recibas.',
    ],
    faq: [
      {
        question: '¿Cura la alopecia o garantiza crecimiento?',
        answer:
          'No. Es una propuesta estética; no se afirma que cure la alopecia, frene definitivamente la caída ni garantice crecimiento del cabello. Si te preocupa la caída, buscá evaluación médica.',
      },
      {
        question: '¿Qué activos utiliza?',
        answer:
          'Los activos específicos deben confirmarse con Victoria antes del servicio. No se publican productos ni resultados que no estén aprobados.',
      },
    ],
    pricing: {
      status: 'pending',
      required: true,
      priceGroups: [],
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
    if (detail.variants?.some(({ name, description }) => !useful(name) || !useful(description)))
      throw new Error('Incomplete VIORA variant');
    for (const values of [detail.includes, detail.session, detail.care])
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
