import { defineConfig, passthroughImageService } from 'astro/config';

export default defineConfig({
  output: 'static',
  image: { service: passthroughImageService() },
});
