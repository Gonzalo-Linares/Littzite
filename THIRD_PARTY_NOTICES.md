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
- Favicon: `apps/estetica/public/brand/viora-favicon.svg` embeds the unchanged official VIORA_simbolo_blanco.png on a ciruela (#7B4655) vector backdrop, preserving proportions. The embedded PNG checksum is covered by tests. No tracing or re-created V.
- DejaVu Sans: unchanged DejaVuSans.ttf supplied in that kit, distributed in apps/estetica/public/fonts with its full LICENCIA_DejaVu_Sans.txt. The font name/version can be read from the original binary. License: Bitstream Vera with DejaVu changes in the public domain; notices retained. Source: https://dejavu-fonts.github.io/. No font code was added as a package dependency.
- Nimbus Roman: named local font only, with Times New Roman fallback as the manual permits. The kit's AGPL-3 font binary is not redistributed as a webfont; this PR does not assume its document-embedding exception grants webfont distribution rights.

## Juanjo production visual content

The favicon PNG is a proportional, alpha-trimmed derivative of the owner-supplied official monograma-jt.png; no letters were redrawn. Twelve portfolio photographs come exclusively from the owner-prepared Downloads/imagenes juanjo set, authorized by the request for this site. Only orientation, metadata removal, proportional resizing and WebP compression were applied. Client asset rights remain with their respective owners; these are not reusable Littzite assets. Source filenames, dimensions, selection and processing are recorded in [the production visual content note](docs/23-juanjo-production-visual-content.md).
