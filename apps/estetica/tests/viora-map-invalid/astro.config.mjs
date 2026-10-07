import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  vite: {
    define: {
      'import.meta.env.VIORA_MAP_INVALID_URL': JSON.stringify(
        process.env.VIORA_MAP_INVALID_URL ?? 'https://evil.example/',
      ),
    },
  },
});
