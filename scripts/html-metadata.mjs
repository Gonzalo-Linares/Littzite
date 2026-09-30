import assert from 'node:assert/strict';

function decodeHtmlEntities(value) {
  const entities = {
    amp: '&',
    quot: '"',
    '#39': "'",
    '#x27': "'",
    lt: '<',
    gt: '>',
  };
  return value.replace(/&(amp|quot|#39|#x27|lt|gt);/g, (entity, name) => entities[name]);
}

export function assertMetadata(markup, seo, label) {
  const titles = markup.match(/<title>[\s\S]*?<\/title>/g) ?? [];
  const descriptions = markup.match(/<meta name="description" content="[^"]*">/g) ?? [];
  assert.equal(titles.length, 1, `${label}: expected one title`);
  assert.equal(descriptions.length, 1, `${label}: expected one description`);

  const title = titles[0].match(/^<title>([\s\S]*)<\/title>$/)?.[1];
  const description = descriptions[0].match(/^<meta name="description" content="([^"]*)">$/)?.[1];
  assert.equal(decodeHtmlEntities(title), seo.title, `${label}: title does not match validated metadata`);
  assert.equal(decodeHtmlEntities(description), seo.description, `${label}: description does not match validated metadata`);
  assert.doesNotMatch(markup, /<link\b[^>]*\brel=["']canonical["']/i, `${label}: canonical must not be emitted`);
}
