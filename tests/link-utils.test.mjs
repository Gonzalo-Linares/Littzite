import assert from 'node:assert/strict';
import test from 'node:test';
import { isAllowedHref } from '../packages/ui/src/link-utils.ts';

test('accepts same-page anchors, site-relative paths and HTTPS links', () => {
  for (const href of ['#contenido', '/', '/servicios/masajes', 'https://example.com/consulta', 'https://example.com:443/']) {
    assert.equal(isAllowedHref(href), true, href);
  }
});

test('rejects protocol-relative, unsafe and malformed destinations', () => {
  for (const href of [
    '', '#', '//evil.example', '/\\evil.example', '/\tevil.example',
    'http://example.com', 'javascript:alert(1)', 'data:text/html,hello',
    'https://', 'https:///evil.example', 'https://user:secret@example.com/',
    ' https://example.com', 'https://example.com\n',
  ]) {
    assert.equal(isAllowedHref(href), false, JSON.stringify(href));
  }
});
