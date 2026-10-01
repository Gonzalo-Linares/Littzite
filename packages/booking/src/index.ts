import type { BookingTarget, ServiceAction } from '@littzite/content-schema';

type DirectBookingAction = Extract<ServiceAction, { type: 'direct-booking' }>;

const providerAdapters = {
  'cal-com': {
    validate(target: BookingTarget): void {
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
    resolve(target: BookingTarget): string {
      return target.fallbackUrl;
    },
  },
} satisfies Record<
  string,
  { validate(target: BookingTarget): void; resolve(target: BookingTarget): string }
>;

export type ResolvedDirectBookingAction = {
  type: 'direct-booking';
  actionId: string;
  targetId: string;
  label: string;
  eligibilityNote?: string;
  providerKey: string;
  href: string;
};

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

export class MissingBookingTargetError extends Error {
  constructor(actionId: string, targetId: string) {
    super(`Missing booking target "${targetId}" for action "${actionId}"`);
    this.name = 'MissingBookingTargetError';
    this.actionId = actionId;
    this.targetId = targetId;
  }

  readonly actionId: string;
  readonly targetId: string;
}

type SupportedBookingProviderKey = keyof typeof providerAdapters;

function isSupportedBookingProviderKey(
  providerKey: string,
): providerKey is SupportedBookingProviderKey {
  return Object.hasOwn(providerAdapters, providerKey);
}

function getProviderAdapter(target: BookingTarget) {
  if (!isSupportedBookingProviderKey(target.providerKey)) {
    throw new UnsupportedBookingProviderError(target.id, target.providerKey);
  }
  return providerAdapters[target.providerKey];
}

function validateTarget(target: BookingTarget): void {
  getProviderAdapter(target).validate(target);
}

/** Validate provider-specific policy after siteContentSchema has checked shape and references. */
export function validateBookingTargets(targets: readonly BookingTarget[]): void {
  for (const target of targets) validateTarget(target);
}

/** Resolve one declared direct-booking action to its validated provider URL. */
export function resolveDirectBookingAction(
  action: DirectBookingAction,
  targets: readonly BookingTarget[],
): ResolvedDirectBookingAction {
  const target = targets.find(({ id }) => id === action.targetId);
  if (!target) throw new MissingBookingTargetError(action.id, action.targetId);

  const provider = getProviderAdapter(target);
  provider.validate(target);

  return {
    type: 'direct-booking',
    actionId: action.id,
    targetId: target.id,
    label: action.label,
    ...(action.eligibilityNote === undefined ? {} : { eligibilityNote: action.eligibilityNote }),
    providerKey: target.providerKey,
    href: provider.resolve(target),
  };
}
