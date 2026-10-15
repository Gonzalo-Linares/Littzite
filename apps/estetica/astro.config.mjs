import { defineConfig, passthroughImageService } from 'astro/config';

export default defineConfig({
  output: 'static',
  redirects: { '/reservar/': '/servicios/' },
  image: { service: passthroughImageService() },
});
