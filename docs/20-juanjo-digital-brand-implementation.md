# Juanjo Tattoo Studio: digital brand implementation

This document records the website translation of the official 2026 brand manual. The supplied manual remains authoritative; this note does not replace it.

## Source kit and marks

Source: `C:\Users\gonza\Downloads\Kit-Marca-Juanjo-Tattoo-Studio-Premium\Juanjo-Tattoo-Studio-Premium`. The owner supplied the complete official kit and authorized its use for the Juanjo site. The five master PNG files were copied byte-for-byte to `apps/tattoo/public/brand/`; the hashes below cover both the source and repository copy.

| Official mark | Source PNG → repository asset | Digital role | SHA-256 |
| --- | --- | --- | --- |
| Principal | `logos/logo-principal.png` → `/brand/logo-principal.png` | Full identity on `/estudio/` | `c66d7dc0fa4c99daefadab6200f55ed9f750819d7ecaab1055e3b0609c80a237` |
| Sello | `logos/sello-circular.png` → `/brand/sello-circular.png` | Honest empty state on `/trabajos/` | `8bb1da4d3b7cb300fd7d741a481928f07d4056e5fe9a28e65e42d4ca6666d92d` |
| Oni | `logos/icono-oni.png` → `/brand/icono-oni.png` | Hero symbol | `576f730d5f44aaf2840e78413e99f0aafa733918d148d629756be16e9f149b01` |
| JT | `logos/monograma-jt.png` → `/brand/monograma-jt.png` | Compact mobile header mark and favicon | `971090d517b7ad5236be56e2010e864b03b18826091ae63197b22c48aa0ca002` |
| Firma | `logos/wordmark.png` → `/brand/wordmark.png` | Desktop header and footer signature | `ce40f98a9c935642e56d66021513fd2680b75225cd75e2e100593a4a42dfe1c4` |

Use `object-fit: contain` and preserve the source dimensions. Do not crop, recolor, filter, rotate, redraw, or place textures over a mark. Leave approximately ten percent clear space around each signature. Asset paths, natural dimensions, roles and hashes live in `apps/tattoo/src/brand.config.ts`.

## Color and type

The app-local theme preserves the manual values: ink `#0E0E0E`, red `#A61E1E`, ivory `#EADCC6`, gold `#C9A96B`, charcoal `#2C2C2C`. Ink and ivory carry large surfaces; red is used for focused actions; gold for fine rules and secondary detail.

Only the supplied font files used on the site are distributed locally under `apps/tattoo/public/fonts/`: Rye Regular for short display headings, DejaVu Serif Regular for editorial phrases, and DejaVu Sans Regular/Bold for navigation and functional text. All use `@font-face` with `font-display: swap`; no remote font service is loaded. Their original license notices are retained next to the files. Unused font variants are not bundled.

## Page system

`TattooSiteLayout.astro` owns the shared frame for `/`, `/trabajos/`, `/estudio/` and `/contacto/`. It composes public `packages/ui` APIs: `BaseLayout`, `SiteHeader`, `SiteFooter`, `Link`, `ButtonLink` and the existing neutral `SiteAttribution`. All four routes remain `noindex, nofollow` and `es-AR`.

The home uses the Oni as the only hero mark, a truthful work teaser, the editorial line “Tradición, fuerza y detalle”, two informational (non-clickable) commercial paths, and a contact route. `/estudio/` presents the brand's creative universe without biography, experience or physical-location claims. `/contacto/` exposes only the supplied Instagram profile. The shared footer includes accessible route navigation, Instagram, preview status and “Powered by Littzite”. Its attribution is plain text until a real URL and logo are supplied.

The portfolio stays `[]` until original, authorized tattoo photographs and descriptive alt text are available. `/trabajos/` then changes from the branded empty state to the responsive gallery through `validatePortfolio`; original photos keep their natural colors and are contained without cropping. The test fixture uses neutral geometric SVGs and is never imported into production.

## Motion, accessibility and boundaries

Motion is limited to a short entrance and native cross-document View Transitions. The page and links work without script. Reduced-motion preferences remove entrances and transitions. Logo images declare natural dimensions and use proportional containment; the Oni loads eagerly and secondary marks lazily. Focus styles, skip link, landmarks, headings, meaningful image alt text and touch-sized navigation remain in place.

All identity, theme, fonts, pages and portfolio components remain in `apps/tattoo`. The only shared capability consumed is the already existing neutral footer attribution; this PR adds no shared package code. VIORA configuration and presentation remain unchanged.

## Pending before production

- Original authorized tattoo photographs, editorial titles and alt text.
- Approved small-work booking provider and scope; no booking target is active.
- Approved WhatsApp number and message for large-work quotes; no WhatsApp link is active.
- Production domain, indexation, legal and release approval.

GitHub Actions remain disabled. This prototype is not a production release.
