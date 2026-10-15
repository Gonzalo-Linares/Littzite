# VIORA commercial experience

Base: PR #41 merged as 5c700b3a026b56a505509219f17eab451718e774. This work starts from main and does not modify PR #41.

## Content and responsibilities

The canonical service IDs, names, slugs and booking actions remain in site.config.ts. The app-local viora-commercial-content.ts associates each ID with a short card summary, optional intro/purpose/includes/session/FAQ, content review state and pricing. validateCommercialContent rejects unknown, duplicate and missing IDs, malformed groups/items, unsafe IDs and invalid amounts. No booking URL or target is duplicated. The existing booking resolver supplies the CTA immediately below pricing; Reiki keeps no booking action.

Home: direct local hero → wide service rail → Victoria → three booking steps → space/location → consultation/reservation → existing frame. The header and contact composition remain intact. Editorial history stays on /viora/.

Detail: canonical hero → available approved explanation/includes/session → options and pricing with resolved booking → Victoria → available approved FAQ → consultation. Empty optional sections are omitted; current service details remain pending instead of invented.

## Prices

All four services currently use pricing.status=pending and empty priceGroups; preview shows “Valores a confirmar.” only on details. Future confirmed groups support a single price, Desde, options, zones and combos; items have stable IDs, labels, optional detail and positive integer amountArs. A required price must include every amount. One formatArs helper uses es-AR / ARS without decimals. Synthetic amounts exist only in tests. No promotions, discounts or price claims are published.

## Media and release

Victoria and the two space slots have no src and are explicitly temporary/required. The UI uses only a neutral VIORA composition, never a simulated person or interior. Replacing src, alt and focalPosition in app-local data changes media without layout edits. Every final local photo requires authorization.

VIORA releaseBlockers now combines existing legal/booking approvals with professional/space media, required service content and required pricing. Preview remains permitted. There is no environment bypass for the pending editorial state. Complete legal/booking variables alone cannot release the current app. Confirmed content must include introduction, purpose, includes and session; pricing must validate. Existing environment flags, providers, guards and noindex defaults remain.

## Brand and footer

The supplied manual was reviewed in full. Exact palette: ivory, plum, rose, soft rose, ink and optional sage; Nimbus Roman heading stack and DejaVu Sans body. The original ciruela symbol is copied unchanged for neutral compositions. The favicon embeds the original white symbol PNG unchanged over a ciruela SVG backdrop for contrast at small sizes, preserving its aspect ratio. DejaVu Sans is served with its license; Nimbus uses local resolution and the manual's Times fallback pending a web distribution decision. No external design, text, code or photographs were copied.

Footer bottom rows combine copyright, legal links, location (VIORA) and preview status (VIORA), rather than adding independent rows. At narrow widths the row wraps without hiding content. Juanjo changes are strictly limited to this requested footer compaction; its commercial behavior, booking, routes, assets and release state remain unchanged.

## Verification

Run the existing quality gates, plus tests/viora-commercial.test.mjs through test:contracts. Visual QA: home, catalog, limpieza-facial, depilacion-definitiva, reservar and contacto at 390/768/1440; also inspect 320/375/1024 responsiveness, keyboard focus, reduced motion and both compact footers. GitHub Actions remains disabled. No deploy, release activation, merge or Ready.

## QA ejecutado

Revisión local en navegador del build estático: /, /servicios/, /servicios/limpieza-facial/, /servicios/depilacion-definitiva/, /reservar/ y /contacto/ a 390, 768 y 1440 px. Sin overflow horizontal de documento en las 18 combinaciones. Revisión adicional de home y depilación a 320, 375 y 1024 px, también sin overflow. El rail conserva cuatro servicios y cards enteras en desktop, con desplazamiento horizontal intencional en tamaños menores.

Se probó “Ver servicios” y “Ver opciones y precios”, así como Tab entre cards: el segundo servicio recibe foco visible sólido y se mantiene accesible. El CTA de Instagram de /reservar/ se revisó de nuevo a 768 px tras corregir su compresión. CSS reduced-motion se verifica por tests/inspección; no se afirma una emulación manual del sistema operativo. Ambos footers se revisaron a 1440 y 390 px; la fila inferior es única en desktop y envuelve su contenido en móvil. El favicon definitivo se revisó a 16, 24, 32 y 64 px. Los mapas externos se mantienen sin cambios. No se completó ninguna reserva real ni se enviaron mensajes.

Los estados temporales activos son: foto de Victoria, dos fotos del espacio, detalle comercial de los cuatro servicios y sus precios. Bloquean public release hasta su reemplazo/revisión; no hay cifras sintéticas en el sitio. Nimbus Roman conserva el fallback Times permitido por el manual; no se distribuye el binario AGPL del kit como webfont.
