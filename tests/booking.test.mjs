import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  InvalidBookingTargetError,
  MissingBookingTargetError,
  UnsupportedBookingActionError,
  UnsupportedBookingProviderError,
  resolveDirectBookingAction,
  validateBookingTargets,
} from '../packages/booking/src/index.ts';

const target = (fallbackUrl = 'https://cal.com/viora/limpieza-facial') => ({
  id: 'cal-viora',
  providerKey: 'cal-com',
  fallbackUrl,
});
const action = (overrides = {}) => ({
  id: 'reservar',
  type: 'direct-booking',
  targetId: 'cal-viora',
  label: 'Reservar',
  ...overrides,
});

test('an empty target list is valid', () => {
  assert.equal(validateBookingTargets([]), undefined);
});

test('accepts Cal.com event URLs and preserves query and fragment', () => {
  const href = 'https://cal.com/team/event?month=2026-10#availability';
  assert.equal(validateBookingTargets([target(href)]), undefined);
  const resolved = resolveDirectBookingAction(action(), [target(href)]);
  assert.equal(resolved.href, href);
  assert.equal(resolved.providerKey, 'cal-com');
});

for (const [label, url] of [
  ['root path', 'https://cal.com/'],
  ['HTTP', 'http://cal.com/viora/event'],
  ['userinfo', 'https://person:secret@cal.com/viora/event'],
  ['lookalike host', 'https://cal.com.evil.example/viora/event'],
  ['unapproved subdomain', 'https://team.cal.com/viora/event'],
]) {
  test(`rejects Cal.com ${label}`, () => {
    assert.throws(() => validateBookingTargets([target(url)]), InvalidBookingTargetError);
  });
}

test('rejects unknown provider keys closed', () => {
  assert.throws(() => validateBookingTargets([{ ...target(), providerKey: 'other' }]), UnsupportedBookingProviderError);
});

test('rejects missing action targets and non direct-booking actions', () => {
  assert.throws(() => resolveDirectBookingAction(action(), []), MissingBookingTargetError);
  assert.throws(() => resolveDirectBookingAction(action({ type: 'quote-request' }), [target()]), UnsupportedBookingActionError);
});

test('does not mutate action or target inputs', () => {
  const inputAction = action();
  const inputTargets = [target('https://cal.com/viora/event?source=site#book')];
  const beforeAction = structuredClone(inputAction);
  const beforeTargets = structuredClone(inputTargets);
  resolveDirectBookingAction(inputAction, inputTargets);
  assert.deepEqual(inputAction, beforeAction);
  assert.deepEqual(inputTargets, beforeTargets);
});
