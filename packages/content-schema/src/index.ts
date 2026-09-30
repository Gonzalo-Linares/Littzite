import { z } from 'zod';

const idSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const textSchema = z.string().trim().min(1);
const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const e164Schema = z.string().regex(/^\+[1-9]\d{1,14}$/);
const httpsUrlSchema = z.url().refine((value) => {
  const url = new URL(value);
  return url.protocol === 'https:' && !url.username && !url.password;
});

// Relative luminance and minimum WCAG contrast for semantic token pairs.
export function contrastRatio(first: string, second: string): number {
  function luminance(hex: string): number {
    const channels = [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16) / 255);
    const linear = channels.map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
  }
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + .05) / (values[1] + .05);
}

export const themeConfigSchema = z.object({
  surface: colorSchema,
  text: colorSchema,
  accent: colorSchema,
  accentText: colorSchema,
  border: colorSchema,
  focus: colorSchema,
}).strict().superRefine((theme, ctx) => {
  for (const [label, foreground, background, minimum] of [
    ['body text', theme.text, theme.surface, 4.5],
    ['accent text', theme.accentText, theme.accent, 4.5],
    ['focus ring', theme.focus, theme.surface, 3],
  ] as const) {
    if (contrastRatio(foreground, background) < minimum) {
      ctx.addIssue({ code: 'custom', message: `${label} contrast must be at least ${minimum}:1` });
    }
  }
});
export type ThemeConfig = z.infer<typeof themeConfigSchema>;

export const contactConfigSchema = z.object({
  phone: e164Schema.optional(),
  whatsapp: e164Schema.optional(),
  email: z.email().optional(),
}).strict();
export type ContactConfig = z.infer<typeof contactConfigSchema>;

export const locationSchema = z.object({
  id: idSchema,
  city: textSchema,
  address: textSchema.optional(),
}).strict();
export type Location = z.infer<typeof locationSchema>;

export const siteConfigSchema = z.object({
  defaultLocale: z.literal('es-AR'),
  theme: themeConfigSchema,
  contact: contactConfigSchema.optional(),
  locations: z.array(locationSchema).default([]),
  canonicalOrigin: httpsUrlSchema.refine((value) => new URL(value).origin === value).optional(),
}).strict();
export type SiteConfig = z.infer<typeof siteConfigSchema>;

const actionBase = {
  id: idSchema,
  label: textSchema,
  eligibilityNote: textSchema.optional(),
};

export const serviceActionSchema = z.discriminatedUnion('type', [
  z.object({ ...actionBase, type: z.literal('direct-booking'), targetId: idSchema }).strict(),
  z.object({ ...actionBase, type: z.literal('quote-request'), targetId: idSchema }).strict(),
  z.object({ ...actionBase, type: z.literal('contact'), contactMethod: z.enum(['phone', 'whatsapp', 'email']) }).strict(),
]);
export type ServiceAction = z.infer<typeof serviceActionSchema>;

export const serviceSchema = z.object({
  id: idSchema,
  slug: idSchema,
  displayName: textSchema,
  description: textSchema,
  durationMinutes: z.int().positive().optional(),
  actions: z.array(serviceActionSchema),
}).strict();
export type Service = z.infer<typeof serviceSchema>;

export const bookingTargetSchema = z.object({
  id: idSchema,
  providerKey: idSchema,
  fallbackUrl: httpsUrlSchema,
}).strict();
export type BookingTarget = z.infer<typeof bookingTargetSchema>;

export const quoteTargetSchema = z.object({
  id: idSchema,
  channel: z.literal('whatsapp'),
  prefillTemplate: textSchema.optional(),
}).strict();
export type QuoteTarget = z.infer<typeof quoteTargetSchema>;

export const pageSectionSchema = z.discriminatedUnion('type', [
  z.object({ id: idSchema, type: z.literal('intro'), heading: textSchema, body: textSchema, eyebrow: textSchema.optional(), visualCaption: textSchema.optional() }).strict(),
  z.object({
    id: idSchema,
    type: z.literal('feature-grid'),
    eyebrow: textSchema,
    heading: textSchema,
    intro: textSchema,
    items: z.array(z.object({ id: idSchema, title: textSchema, body: textSchema }).strict()).min(2).max(4),
  }).strict(),
  z.object({ id: idSchema, type: z.literal('service-list'), serviceIds: z.array(idSchema).min(1) }).strict(),
]);
export type PageSection = z.infer<typeof pageSectionSchema>;

export const seoMetadataSchema = z.object({
  title: textSchema,
  description: textSchema,
}).strict();
export type SeoMetadata = z.infer<typeof seoMetadataSchema>;

export const pageSchema = z.object({
  slug: z.string().regex(/^(?:[a-z0-9]+(?:-[a-z0-9]+)*)?$/),
  seo: seoMetadataSchema,
  sections: z.array(pageSectionSchema),
}).strict();
export type Page = z.infer<typeof pageSchema>;

const unique = (values: string[]) => new Set(values).size === values.length;

// Validate only relationships inside a single app's content set. No provider is activated here.
export const siteContentSchema = z.object({
  site: siteConfigSchema,
  services: z.array(serviceSchema),
  pages: z.array(pageSchema),
  bookingTargets: z.array(bookingTargetSchema),
  quoteTargets: z.array(quoteTargetSchema),
}).strict().superRefine((content, context) => {
  const { site, services, pages, bookingTargets, quoteTargets } = content;
  const collections = [
    ['services', services.map(({ id }) => id)],
    ['service slugs', services.map(({ slug }) => slug)],
    ['pages', pages.map(({ slug }) => slug)],
    ['booking targets', bookingTargets.map(({ id }) => id)],
    ['quote targets', quoteTargets.map(({ id }) => id)],
    ['locations', site.locations.map(({ id }) => id)],
  ] as const;
  for (const [name, values] of collections) {
    if (!unique(values)) context.addIssue({ code: 'custom', message: `Duplicate ${name}` });
  }

  const serviceIds = new Set(services.map(({ id }) => id));
  const bookingIds = new Set(bookingTargets.map(({ id }) => id));
  const quoteIds = new Set(quoteTargets.map(({ id }) => id));
  for (const service of services) {
    if (!unique(service.actions.map(({ id }) => id))) {
      context.addIssue({ code: 'custom', message: `Duplicate actions in ${service.id}` });
    }
    for (const action of service.actions) {
      if (action.type === 'direct-booking' && !bookingIds.has(action.targetId)) {
        context.addIssue({ code: 'custom', message: `Missing booking target ${action.targetId}` });
      }
      if (action.type === 'quote-request' && !quoteIds.has(action.targetId)) {
        context.addIssue({ code: 'custom', message: `Missing quote target ${action.targetId}` });
      }
      if (action.type === 'contact' && !site.contact?.[action.contactMethod]) {
        context.addIssue({ code: 'custom', message: `Missing ${action.contactMethod} contact` });
      }
    }
  }
  if (quoteTargets.length > 0 && !site.contact?.whatsapp) {
    context.addIssue({ code: 'custom', message: 'WhatsApp quote target requires a contact number' });
  }
  for (const page of pages) {
    if (!unique(page.sections.map(({ id }) => id))) {
      context.addIssue({ code: 'custom', message: `Duplicate sections in ${page.slug}` });
    }
    for (const section of page.sections) {
      if (section.type === 'feature-grid' && !unique(section.items.map(({ id }) => id))) {
        context.addIssue({ code: 'custom', message: `Duplicate feature items in ${section.id}` });
      }
      if (section.type === 'service-list') {
        if (!unique(section.serviceIds)) context.addIssue({ code: 'custom', message: `Duplicate services in ${section.id}` });
        for (const id of section.serviceIds) {
          if (!serviceIds.has(id)) context.addIssue({ code: 'custom', message: `Missing service ${id}` });
        }
      }
    }
  }
});
export type SiteContent = z.infer<typeof siteContentSchema>;
