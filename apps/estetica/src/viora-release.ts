export const vioraCommercial = {
  name: 'VIORA',
  description: 'Estética integral',
  instagramHref: 'https://www.instagram.com/vioramasajes.ok/',
  publicLocality: 'Rivadavia',
  publicRegion: 'San Juan',
  publicCountryCode: 'AR',
  publicLocation: 'Rivadavia, San Juan, Argentina',
} as const;

const buildEnvironment =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
const configured = (key: string, placeholder: string) => buildEnvironment[key] || placeholder;

export const vioraLegal = {
  providerName: configured('VIORA_LEGAL_NAME', '[PENDIENTE — NOMBRE O RAZÓN SOCIAL]'),
  taxId: configured('VIORA_LEGAL_CUIT', '[PENDIENTE — CUIT]'),
  contactEmail: configured('VIORA_LEGAL_EMAIL', '[PENDIENTE — EMAIL LEGAL Y PRIVACIDAD]'),
  phone: configured('VIORA_LEGAL_PHONE', '[PENDIENTE — TELÉFONO / WHATSAPP COMERCIAL]'),
  legalDomicile: configured(
    'VIORA_LEGAL_DOMICILE',
    '[PENDIENTE — DOMICILIO LEGAL, SI CORRESPONDE]',
  ),
} as const;

export const vioraBookingReadiness = {
  productionUrl: configured('VIORA_BOOKING_URL', 'https://cal.com/gonzalo-linares-rfbhnf/prueba'),
  productionApproval: buildEnvironment.VIORA_BOOKING_APPROVED === 'true',
  inPersonLocationApproved: buildEnvironment.VIORA_BOOKING_IN_PERSON_APPROVED === 'true',
  durationReviewed: buildEnvironment.VIORA_BOOKING_DURATION_REVIEWED === 'true',
  commercialTermsApproved: buildEnvironment.VIORA_TERMS_APPROVED === 'true',
  withdrawalWorkflowApproved: buildEnvironment.VIORA_WITHDRAWAL_APPROVED === 'true',
} as const;

export interface BookingReadiness {
  productionUrl: string;
  productionApproval: boolean;
  inPersonLocationApproved: boolean;
  durationReviewed: boolean;
  commercialTermsApproved: boolean;
  withdrawalWorkflowApproved: boolean;
}

export interface ReleaseReadiness {
  enabled: boolean;
  publicSiteUrl?: string;
  legal: Record<string, string>;
  booking: BookingReadiness;
  commercialPhoneRequired?: boolean;
}

const isPlaceholder = (value: string) => value.includes('[PENDIENTE');

export function releaseBlockers(readiness: ReleaseReadiness): string[] {
  if (!readiness.enabled) return [];
  const blockers: string[] = [];
  for (const [field, value] of Object.entries(readiness.legal)) {
    if (field === 'phone' && !readiness.commercialPhoneRequired) continue;
    if (isPlaceholder(value)) blockers.push(`legal.${field}`);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(readiness.legal.contactEmail))
    blockers.push('legal.email.invalid');
  if (!/^\d{2}-?\d{8}-?\d$/.test(readiness.legal.taxId)) blockers.push('legal.taxId.invalid');
  if (!readiness.publicSiteUrl) blockers.push('PUBLIC_SITE_URL.missing');
  else {
    try {
      const url = new URL(readiness.publicSiteUrl);
      if (
        url.protocol !== 'https:' ||
        url.origin !== readiness.publicSiteUrl.replace(/\/$/, '') ||
        url.username ||
        url.password ||
        url.search ||
        url.hash
      )
        blockers.push('PUBLIC_SITE_URL.invalid');
    } catch {
      blockers.push('PUBLIC_SITE_URL.invalid');
    }
  }
  if (readiness.booking.productionUrl === 'https://cal.com/gonzalo-linares-rfbhnf/prueba')
    blockers.push('booking.uat-url');
  try {
    const bookingUrl = new URL(readiness.booking.productionUrl);
    if (
      bookingUrl.origin !== 'https://cal.com' ||
      bookingUrl.pathname === '/' ||
      bookingUrl.username ||
      bookingUrl.password
    )
      blockers.push('booking.production-url.invalid');
  } catch {
    blockers.push('booking.production-url.invalid');
  }
  if (!readiness.booking.productionApproval) blockers.push('booking.production-approval');
  if (!readiness.booking.inPersonLocationApproved) blockers.push('booking.in-person-location');
  if (!readiness.booking.durationReviewed) blockers.push('booking.duration-review');
  if (!readiness.booking.commercialTermsApproved) blockers.push('commercial.terms-approval');
  if (!readiness.booking.withdrawalWorkflowApproved)
    blockers.push('legal.withdrawal-workflow-review');
  return blockers;
}

export const vioraPublicRelease = buildEnvironment.VIORA_PUBLIC_RELEASE === 'true';
export const publicSiteUrl = buildEnvironment.PUBLIC_SITE_URL;

const blockers = releaseBlockers({
  enabled: vioraPublicRelease,
  publicSiteUrl,
  legal: vioraLegal,
  booking: vioraBookingReadiness,
});
if (blockers.length) throw new Error(`VIORA public release blocked: ${blockers.join(', ')}`);

export function canonicalFor(pathname: string): string | undefined {
  if (!vioraPublicRelease || !publicSiteUrl) return undefined;
  const origin = new URL(publicSiteUrl).origin;
  return new URL(pathname.endsWith('/') ? pathname : `${pathname}/`, origin).href;
}

export function vioraStructuredData() {
  if (!vioraPublicRelease) return undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'BeautySalon',
    name: vioraCommercial.name,
    description: vioraCommercial.description,
    url: publicSiteUrl,
    sameAs: [vioraCommercial.instagramHref],
    address: {
      '@type': 'PostalAddress',
      addressLocality: vioraCommercial.publicLocality,
      addressRegion: vioraCommercial.publicRegion,
      addressCountry: vioraCommercial.publicCountryCode,
    },
  };
}
