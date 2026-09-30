import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  InvalidBookingTargetError,
  UnsupportedBookingProviderError,
  validateBookingTargets,
} from '../packages/booking/src/index.ts';

const target = (fallbackUrl = 'https://cal.com/viora/limpieza-facial') => ({
  id: 'cal-viora',
  providerKey: 'cal-com',
  fallbackUrl,
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
  assert.throws(
    () => validateBookingTargets([{ ...target(), id: 'unknown-calendar', providerKey: 'other' }]),
    (error) => error instanceof UnsupportedBookingProviderError &&
      error.message.includes('"other"') && error.message.includes('"unknown-calendar"') &&
      error.providerKey === 'other' && error.targetId === 'unknown-calendar',
  );
});

test('does not mutate targets during provider validation', () => {
  const inputTargets = [target('https://cal.com/viora/event?source=site#book')];
  const beforeTargets = structuredClone(inputTargets);
  validateBookingTargets(inputTargets);
  assert.deepEqual(inputTargets, beforeTargets);
});
