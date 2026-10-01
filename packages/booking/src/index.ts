import type { BookingTarget } from '@littzite/content-schema';

const providerPolicies = {
  'cal-com': (target: BookingTarget): void => {
    let url: URL;
    try {
      url = new URL(target.fallbackUrl);
    } catch {
      throw new InvalidBookingTargetError(target.id, 'fallbackUrl must be a valid URL');
    }
    if (
      url.protocol !== 'https:' ||
      url.origin !== 'https://cal.com' ||
      url.username ||
      url.password
    ) {
      throw new InvalidBookingTargetError(
        target.id,
        'cal-com targets must use the exact HTTPS origin https://cal.com without credentials',
      );
    }
    if (url.pathname === '/') {
      throw new InvalidBookingTargetError(
        target.id,
        'cal-com targets must include a non-root path',
      );
    }
  },
} satisfies Record<string, (target: BookingTarget) => void>;

export class UnsupportedBookingProviderError extends Error {
  constructor(targetId: string, providerKey: string) {
    super(`Unsupported booking provider "${providerKey}" for target "${targetId}"`);
    this.name = 'UnsupportedBookingProviderError';
    this.targetId = targetId;
    this.providerKey = providerKey;
  }

  readonly targetId: string;
  readonly providerKey: string;
}

export class InvalidBookingTargetError extends Error {
  constructor(targetId: string, reason: string) {
    super(`Invalid booking target ${targetId}: ${reason}`);
    this.name = 'InvalidBookingTargetError';
  }
}

type SupportedBookingProviderKey = keyof typeof providerPolicies;

function isSupportedBookingProviderKey(
  providerKey: string,
): providerKey is SupportedBookingProviderKey {
  return Object.hasOwn(providerPolicies, providerKey);
}

function validateTarget(target: BookingTarget): void {
  if (!isSupportedBookingProviderKey(target.providerKey)) {
    throw new UnsupportedBookingProviderError(target.id, target.providerKey);
  }
  providerPolicies[target.providerKey](target);
}

/** Validate provider-specific policy after siteContentSchema has checked shape and references. */
export function validateBookingTargets(targets: readonly BookingTarget[]): void {
  for (const target of targets) validateTarget(target);
}
