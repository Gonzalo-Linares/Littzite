import { z } from 'zod';

// PR-01 validates only the locale invariant. The full content contract belongs to PR-02.
export const siteConfigSchema = z.object({
  defaultLocale: z.literal('es-AR'),
}).strict();

export type SiteConfig = z.infer<typeof siteConfigSchema>;
