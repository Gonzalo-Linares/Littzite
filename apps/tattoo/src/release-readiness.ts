import { tattooActions, tattooBrand, tattooReleaseState } from './brand.config.ts';

export interface TattooReleaseReadiness {
  enabled: boolean;
  publicSiteUrl?: string;
  legal: TattooLegalData;
  bookingApproved: boolean;
  termsApproved: boolean;
  withdrawalApproved: boolean;
  withdrawalPlacementApproved: boolean;
}

export interface TattooLegalData {
  providerName: string;
  taxId: string;
  contactEmail: string;
  phone: string;
  legalDomicile: string;
}

const environment =
  (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env ?? {};
const envValue = (key: string, fallback = '') => environment[key] || fallback;
const envFlag = (key: string) => environment[key] === 'true';

export const tattooLegal: TattooLegalData = {
  providerName: envValue('JUANJO_LEGAL_NAME', '[PENDIENTE — NOMBRE / RAZÓN SOCIAL]'),
  taxId: envValue('JUANJO_LEGAL_CUIT', '[PENDIENTE — CUIT]'),
  contactEmail: envValue('JUANJO_LEGAL_EMAIL', '[PENDIENTE — EMAIL DE CONTACTO]'),
  phone: envValue('JUANJO_LEGAL_PHONE', '[PENDIENTE — TELÉFONO]'),
  legalDomicile: envValue('JUANJO_LEGAL_DOMICILE', '[PENDIENTE — DOMICILIO LEGAL]'),
};
export const tattooLegalEmailHref = tattooLegal.contactEmail.startsWith('[PENDIENTE')
  ? undefined
  : `mailto:${tattooLegal.contactEmail}`;

const releaseConfiguration = {
  enabled: envFlag('JUANJO_PUBLIC_RELEASE'),
  publicSiteUrl: envValue('JUANJO_PUBLIC_SITE_URL') || undefined,
  legal: tattooLegal,
  bookingApproved: envFlag('JUANJO_BOOKING_APPROVED'),
  termsApproved: envFlag('JUANJO_TERMS_APPROVED'),
  withdrawalApproved: envFlag('JUANJO_WITHDRAWAL_APPROVED'),
  withdrawalPlacementApproved: envFlag('JUANJO_WITHDRAWAL_PLACEMENT_APPROVED'),
};

function hasPlaceholder(value: string) {
  return !value.trim() || /\b(pendiente|completar|placeholder|example)\b/i.test(value);
}

function validCuit(value: string) {
  const digits = value.replaceAll('-', '');
  if (!/^\d{11}$/.test(digits) || !/^(\d{2}-\d{8}-\d|\d{11})$/.test(value)) return false;
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = [...digits.slice(0, 10)].reduce(
    (total, digit, index) => total + Number(digit) * weights[index],
    0,
  );
  const remainder = sum % 11;
  const checkDigit = remainder === 0 ? 0 : remainder === 1 ? 9 : 11 - remainder;
  return checkDigit === Number(digits[10]);
}

function validPublicOrigin(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.origin === value.replace(/\/$/, '') &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    );
  } catch {
    return false;
  }
}

export function isValidTattooBookingUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.origin === 'https://cal.com' &&
      url.pathname !== '/' &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function tattooReleaseBlockersFor(
  readiness: TattooReleaseReadiness,
  assets = tattooReleaseState,
): string[] {
  if (!readiness.enabled) return [];
  const blockers: string[] = [];
  if (assets.temporaryHeroImage) blockers.push('assets.temporary-hero');
  if (assets.temporaryPortfolioImages) blockers.push('assets.temporary-portfolio');
  if (assets.temporaryAftercareImage) blockers.push('assets.temporary-aftercare');
  if (!readiness.publicSiteUrl) blockers.push('JUANJO_PUBLIC_SITE_URL.missing');
  else if (!validPublicOrigin(readiness.publicSiteUrl))
    blockers.push('JUANJO_PUBLIC_SITE_URL.invalid');
  for (const [field, value] of Object.entries(readiness.legal)) {
    if (hasPlaceholder(value)) blockers.push(`legal.${field}.missing`);
  }
  if (!validCuit(readiness.legal.taxId)) blockers.push('legal.taxId.invalid');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(readiness.legal.contactEmail))
    blockers.push('legal.email.invalid');
  if (!/^\+[1-9]\d{1,14}$/.test(readiness.legal.phone)) blockers.push('legal.phone.invalid');
  if (!isValidTattooBookingUrl(tattooActions.turnsHref)) blockers.push('booking.url.invalid');
  if (!readiness.bookingApproved) blockers.push('booking.approval');
  if (!readiness.termsApproved) blockers.push('terms.approval');
  if (!readiness.withdrawalApproved) blockers.push('withdrawal.approval');
  if (!readiness.withdrawalPlacementApproved) blockers.push('withdrawal.placement-approval');
  return blockers;
}

export const tattooReadiness: TattooReleaseReadiness = releaseConfiguration;
export const tattooPublicRelease = tattooReadiness.enabled;
export const tattooPublicSiteUrl = tattooReadiness.publicSiteUrl;
export const tattooReleaseBlockers = tattooReleaseBlockersFor(tattooReadiness);
export const tattooProductionBlockers = tattooReleaseBlockersFor({
  ...tattooReadiness,
  enabled: true,
});

if (tattooReleaseBlockers.length > 0)
  throw new Error(`Juanjo public release blocked: ${tattooReleaseBlockers.join(', ')}`);

export function assertTattooProductionReady() {
  if (tattooProductionBlockers.length > 0) {
    throw new Error(
      `Juanjo production release blocked:\n- ${tattooProductionBlockers.join('\n- ')}`,
    );
  }
}

export function tattooCanonicalFor(pathname: string): string | undefined {
  return tattooCanonicalForRelease(tattooPublicRelease, tattooPublicSiteUrl, pathname);
}

export function tattooCanonicalForRelease(
  enabled: boolean,
  publicSiteUrl: string | undefined,
  pathname: string,
): string | undefined {
  if (!enabled || !publicSiteUrl) return undefined;
  const safePath = pathname.startsWith('/') && !pathname.startsWith('//') ? pathname : '/';
  return new URL(safePath.endsWith('/') ? safePath : `${safePath}/`, publicSiteUrl).href;
}

export function tattooStructuredData() {
  return tattooStructuredDataFor(tattooPublicRelease, tattooPublicSiteUrl);
}

export function tattooStructuredDataFor(enabled: boolean, publicSiteUrl: string | undefined) {
  if (!enabled || !publicSiteUrl) return undefined;
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: tattooBrand.name,
    url: publicSiteUrl,
    sameAs: [tattooBrand.social.instagram],
  };
}
