# Third-party notices

## Rye font

- Files: `apps/tattoo/public/fonts/Rye-Regular.ttf`
- Source: owner-provided `Kit-Marca-Juanjo-Tattoo-Studio-Premium/fuentes/`.
- Copyright: © 2011 Sorkin Type Co; Reserved Font Name: Rye.
- License: SIL Open Font License 1.1, retained at `apps/tattoo/public/fonts/LICENCIA-Rye.txt`.

## DejaVu fonts

- Files: `apps/tattoo/public/fonts/DejaVuSans.ttf`, `apps/tattoo/public/fonts/DejaVuSans-Bold.ttf`, `apps/tattoo/public/fonts/DejaVuSerif.ttf`.
- Source: owner-provided `Kit-Marca-Juanjo-Tattoo-Studio-Premium/fuentes/`.
- Copyright and license: Bitstream Vera/DejaVu notices retained at `apps/tattoo/public/fonts/LICENCIA-DejaVu.txt`.

These font files are bundled with the static Juanjo site. The official Juanjo logos are client brand assets authorized for this site by the supplied owner request; they are not reusable Littzite assets. Their source and checksums are recorded in [the digital brand implementation note](docs/20-juanjo-digital-brand-implementation.md).

## VIORA commercial experience assets

- Official symbol: `apps/estetica/public/brand/viora-simbolo.png` is the unchanged VIORA_simbolo_ciruela.png supplied in the VIORA brand kit. Use as neutral brand composition explicitly requested by the owner; no reconstructed glyph or artificial portrait. Client brand rights remain with their owner.
- Favicon: `apps/estetica/public/brand/viora-botanical-icon.png` is a proportional 64px derivative of the owner-approved Downloads/Monograma V botánico en ciruela.png (source SHA-256 8c7cb221d6ee85b79727ec8f8b02a0ae016414a3bfdee1a712be2ec405c5f36b). Original plum background and transparency are preserved with a 2px safe area. No redrawing or tracing. The previous embedded-symbol SVG is retired.
- DejaVu Sans: unchanged DejaVuSans.ttf supplied in that kit, distributed in apps/estetica/public/fonts with its full LICENCIA_DejaVu_Sans.txt. The font name/version can be read from the original binary. License: Bitstream Vera with DejaVu changes in the public domain; notices retained. Source: https://dejavu-fonts.github.io/. No font code was added as a package dependency.
- Nimbus Roman: named local font only, with Times New Roman fallback as the manual permits. The kit's AGPL-3 font binary is not redistributed as a webfont; this PR does not assume its document-embedding exception grants webfont distribution rights.

## Juanjo approved Oni hero and favicon

The owner explicitly supplied and approved Máscara oni roja entre humo y tinta.png and Ícono minimalista de máscara oni roja.png in Downloads for this site. Their origins, SHA-256 hashes and non-generative WebP/PNG/ICO processing are recorded in [the Juanjo polish note](docs/24-juanjo-hero-favicon-portfolio-polish.md). Twelve real tattoo photographs from the owner-prepared imagenes juanjo set are incorporated with orientation/metadata cleanup and proportional WebP compression only. No tattoo, portrait or scene was generated in this change. These owner-supplied client assets are not reusable Littzite assets.

## VIORA: material suministrado para PR #44

Retrato de Victoria y seis imágenes de servicios entregadas por el titular en Downloads. Autorización de incorporación en el pedido del 17/10/2026; imagen de labios asignada a BB Lips por instrucción expresa posterior. Sin transferencia de titularidad ni licencia general de reutilización. Procedencia, limitaciones y derivados: `apps/estetica/src/assets/services/SOURCES.md` y `docs/25-viora-photo-manifest.json`. No se acredita que las imágenes de servicios documenten sesiones reales de VIORA.
