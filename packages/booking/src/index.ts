import type { BookingTarget, ServiceAction } from '@littzite/content-schema';

const providerPolicies = {
  'cal-com': (target: BookingTarget): void => {
    let url: URL;
    try {
      url = new URL(target.fallbackUrl);
    } catch {
      throw new InvalidBookingTargetError(target.id, 'fallbackUrl must be a valid URL');
    }
    if (url.protocol !== 'https:' || url.origin !== 'https://cal.com' || url.username || url.password) {
      throw new InvalidBookingTargetError(target.id, 'cal-com targets must use the exact HTTPS origin https://cal.com without credentials');
    }
    if (url.pathname === '/') {
      throw new InvalidBookingTargetError(target.id, 'cal-com targets must include a non-root path');
    }
  },
} satisfies Record<string, (target: BookingTarget) => void>;

export class UnsupportedBookingProviderError extends Error {
  constructor(providerKey: string) {
    super(`Unsupported booking provider: ${providerKey}`);
    this.name = 'UnsupportedBookingProviderError';
  }
}

export class InvalidBookingTargetError extends Error {
  constructor(targetId: string, reason: string) {
    super(`Invalid booking target ${targetId}: ${reason}`);
    this.name = 'InvalidBookingTargetError';
  }
}

export class MissingBookingTargetError extends Error {
  constructor(targetId: string) {
    super(`Missing booking target: ${targetId}`);
    this.name = 'MissingBookingTargetError';
  }
}

export class UnsupportedBookingActionError extends Error {
  constructor(actionType: string) {
    super(`Action cannot be resolved as direct booking: ${actionType}`);
    this.name = 'UnsupportedBookingActionError';
  }
}

function validateTarget(target: BookingTarget): void {
  if (!Object.hasOwn(providerPolicies, target.providerKey)) {
    throw new UnsupportedBookingProviderError(target.providerKey);
  }
  providerPolicies[target.providerKey as keyof typeof providerPolicies](target);
}

/** Validate provider-specific policy after siteContentSchema has checked shape and references. */
export function validateBookingTargets(targets: readonly BookingTarget[]): void {
  for (const target of targets) validateTarget(target);
}

export interface ResolvedDirectBooking {
  readonly actionId: string;
  readonly targetId: string;
  readonly providerKey: keyof typeof providerPolicies;
  /** The approved fallback URL, preserved byte-for-byte including query and fragment. */
  readonly href: string;
}

/** Resolve a configured direct-booking action to its validated external fallback URL. */
export function resolveDirectBookingAction(
  action: ServiceAction,
  targets: readonly BookingTarget[],
): Readonly<ResolvedDirectBooking> {
  if (action.type !== 'direct-booking') throw new UnsupportedBookingActionError(action.type);
  const target = targets.find(({ id }) => id === action.targetId);
  if (!target) throw new MissingBookingTargetError(action.targetId);
  validateTarget(target);
  return Object.freeze({
    actionId: action.id,
    targetId: target.id,
    providerKey: target.providerKey as keyof typeof providerPolicies,
    href: target.fallbackUrl,
  });
}
