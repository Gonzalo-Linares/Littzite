import assert from 'node:assert/strict';
import test from 'node:test';
import { isAllowedHref } from '../packages/ui/src/link-utils.ts';

test('accepts same-page anchors, site-relative paths and HTTPS links', () => {
  for (const href of [
    '#contenido',
    '/',
    '/servicios/masajes',
    'https://example.com/consulta',
    'https://example.com:443/',
  ]) {
    assert.equal(isAllowedHref(href), true, href);
  }
});

test('accepts one email recipient with an optional safely encoded subject', () => {
  for (const href of [
    'mailto:legal@example.com',
    'mailto:legal@example.com?subject=Solicitud%20de%20arrepentimiento',
  ]) {
    assert.equal(isAllowedHref(href), true, href);
  }
});

test('rejects protocol-relative, unsafe and malformed destinations', () => {
  for (const href of [
    '',
    '#',
    '//evil.example',
    '/\\evil.example',
    '/\tevil.example',
    'http://example.com',
    'javascript:alert(1)',
    'data:text/html,hello',
    'https://',
    'https:///evil.example',
    'https://user:secret@example.com/',
    ' https://example.com',
    'https://example.com\n',
    'mailto:',
    'mailto:not-an-email',
    'mailto:a..b@example.com',
    'mailto:a@example.com,b@example.com',
    'mailto:a@example.com?subject=',
    'mailto:a@example.com?subject=x&Bcc:evil@example.com',
    'mailto:a@example.com?subject=x%0D%0ABcc%3Aevil%40example.com',
    'mailto:a@example.com?subject=x%250D%250ABcc%253Aevil',
    'mailto:a@example.com?cc=evil@example.com',
    'mailto:a@example.com#fragment',
  ]) {
    assert.equal(isAllowedHref(href), false, JSON.stringify(href));
  }
});
