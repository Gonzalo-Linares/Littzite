import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  InvalidBookingTargetError,
  MissingBookingTargetError,
  UnsupportedBookingProviderError,
  resolveDirectBookingAction,
  validateBookingTargets,
} from '../packages/booking/src/index.ts';

const target = (fallbackUrl = 'https://cal.com/example-practice/service-a') => ({
  id: 'booking-a',
  providerKey: 'cal-com',
  fallbackUrl,
});
const action = (targetId = 'booking-a') => ({
  id: 'action-a',
  type: 'direct-booking',
  label: 'Book a session',
  eligibilityNote: 'For eligible appointments',
  targetId,
});
test('an empty target list is valid', () => {
  assert.equal(validateBookingTargets([]), undefined);
});

test('accepts Cal.com event URLs and preserves query and fragment', () => {
  const href = 'https://cal.com/team/event?month=2026-10#availability';
  assert.equal(validateBookingTargets([target(href)]), undefined);
});

for (const [label, url] of [
  ['root path', 'https://cal.com/'],
  ['HTTP', 'http://cal.com/example-practice/service-a'],
  ['userinfo', 'https://person:secret@cal.com/example-practice/service-a'],
  ['lookalike host', 'https://cal.com.evil.example/example-practice/service-a'],
  ['unapproved subdomain', 'https://team.cal.com/example-practice/service-a'],
]) {
  test(`rejects Cal.com ${label}`, () => {
    assert.throws(() => validateBookingTargets([target(url)]), InvalidBookingTargetError);
  });
}

test('rejects unknown provider keys closed', () => {
  assert.throws(
    () => validateBookingTargets([{ ...target(), id: 'unknown-calendar', providerKey: 'other' }]),
    (error) =>
      error instanceof UnsupportedBookingProviderError &&
      error.message.includes('"other"') &&
      error.message.includes('"unknown-calendar"') &&
      error.providerKey === 'other' &&
      error.targetId === 'unknown-calendar',
  );
});

test('does not mutate targets during provider validation', () => {
  const inputTargets = [target('https://cal.com/example-practice/service-a?source=site#book')];
  const beforeTargets = structuredClone(inputTargets);
  validateBookingTargets(inputTargets);
  assert.deepEqual(inputTargets, beforeTargets);
});

test('resolves a direct-booking action while preserving editorial fields', () => {
  const href = 'https://cal.com/example-practice/service-a';
  const resolved = resolveDirectBookingAction(action(), [target(href)]);
  assert.deepEqual(resolved, {
    type: 'direct-booking',
    actionId: 'action-a',
    targetId: 'booking-a',
    label: 'Book a session',
    eligibilityNote: 'For eligible appointments',
    providerKey: 'cal-com',
    href,
  });
});

test('resolution preserves query and fragment without rewriting the URL', () => {
  const href = 'https://cal.com/example-practice/service-a?month=2026-10#availability';
  assert.equal(resolveDirectBookingAction(action(), [target(href)]).href, href);
});

test('fails explicitly when the action target is missing', () => {
  assert.throws(
    () => resolveDirectBookingAction(action('missing-booking'), []),
    (error) =>
      error instanceof MissingBookingTargetError &&
      error.actionId === 'action-a' &&
      error.targetId === 'missing-booking',
  );
});

test('resolution rejects unknown providers and invalid known-provider targets', () => {
  assert.throws(
    () => resolveDirectBookingAction(action(), [{ ...target(), providerKey: 'other' }]),
    UnsupportedBookingProviderError,
  );
  assert.throws(
    () => resolveDirectBookingAction(action(), [target('https://cal.com/')]),
    InvalidBookingTargetError,
  );
});

test('resolution does not mutate its action or target inputs', () => {
  const inputAction = action();
  const inputTargets = [target('https://cal.com/example-practice/service-a?source=site#book')];
  const beforeAction = structuredClone(inputAction);
  const beforeTargets = structuredClone(inputTargets);
  resolveDirectBookingAction(inputAction, inputTargets);
  assert.deepEqual(inputAction, beforeAction);
  assert.deepEqual(inputTargets, beforeTargets);
});

test('resolves independent actions and targets without app-specific assumptions', () => {
  const first = resolveDirectBookingAction(action('booking-a'), [target()]);
  const secondAction = {
    ...action('booking-b'),
    id: 'action-b',
    label: 'Schedule another service',
  };
  const secondTarget = {
    ...target('https://cal.com/another-practice/service-b'),
    id: 'booking-b',
  };
  const second = resolveDirectBookingAction(secondAction, [secondTarget]);
  assert.equal(first.href, 'https://cal.com/example-practice/service-a');
  assert.equal(second.actionId, 'action-b');
  assert.equal(second.targetId, 'booking-b');
  assert.equal(second.href, 'https://cal.com/another-practice/service-b');
});
