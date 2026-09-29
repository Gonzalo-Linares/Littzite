import { siteConfigSchema } from '@littzite/content-schema';

export const siteConfig = siteConfigSchema.parse({
  defaultLocale: 'es-AR',
});
