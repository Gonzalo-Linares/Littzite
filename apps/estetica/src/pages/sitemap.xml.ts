import { siteContent } from '../site.config';
import { canonicalFor, vioraPublicRelease } from '../viora-release.ts';

const routes = [
  '/',
  '/servicios/',
  '/viora/',
  '/contacto/',
  '/reservar/',
  '/terminos-y-condiciones/',
  '/privacidad/',
  '/arrepentimiento/',
  ...siteContent.services.map(({ slug }) => `/servicios/${slug}/`),
];

export function GET() {
  const urls = vioraPublicRelease
    ? routes.map((route) => canonicalFor(route)).filter((url): url is string => Boolean(url))
    : [];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join('')}</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
