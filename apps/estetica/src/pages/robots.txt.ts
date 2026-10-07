import { publicSiteUrl, vioraPublicRelease } from '../viora-release.ts';

export function GET() {
  const body =
    vioraPublicRelease && publicSiteUrl
      ? `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', publicSiteUrl).href}\n`
      : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
