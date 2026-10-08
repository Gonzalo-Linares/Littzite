import { tattooPublicRelease, tattooPublicSiteUrl } from '../release-readiness.ts';

export function GET() {
  const body =
    tattooPublicRelease && tattooPublicSiteUrl
      ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', tattooPublicSiteUrl).href}\n`
      : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
