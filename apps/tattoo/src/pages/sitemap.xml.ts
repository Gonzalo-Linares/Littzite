import { tattooCanonicalFor, tattooPublicRelease } from '../release-readiness.ts';

const routes = [
  '/',
  '/trabajos/',
  '/guia/',
  '/contacto/',
  '/privacidad/',
  '/terminos-y-condiciones/',
  '/arrepentimiento/',
];

export function GET() {
  const urls = tattooPublicRelease
    ? routes.map((route) => tattooCanonicalFor(route)).filter((url): url is string => Boolean(url))
    : [];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
