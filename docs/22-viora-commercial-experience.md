# VIORA commercial experience

Base: PR #41 merged as 5c700b3a026b56a505509219f17eab451718e774. This work starts from main and does not modify PR #41.

## Content and responsibilities

The canonical service IDs, names, slugs and booking actions remain in site.config.ts. The app-local viora-commercial-content.ts associates each ID with a short card summary, optional intro/purpose/includes/session/FAQ, content review state and pricing. validateCommercialContent rejects unknown, duplicate and missing IDs, malformed groups/items, unsafe IDs and invalid amounts. No booking URL or target is duplicated. The existing booking resolver supplies the CTA immediately below pricing; Reiki keeps no booking action.

Home: compact editorial hero (“Un momento para vos.”), without paragraph or buttons → wide compact service rail → brief Victoria introduction → compact space/location → existing frame. The header and contact composition remain intact. Editorial history stays on /viora/.

Detail: two columns from the start: canonical title, explanation and illustrative media on the left; options/prices and canonical booking on the right. The panel is sticky on desktop. Mobile stacks one primary image and the pricing panel; secondary media is desktop-only. Victoria and generic consultation blocks are removed. Empty optional sections are omitted; current service details remain pending instead of invented.

## Prices

All four services currently use pricing.status=pending and empty priceGroups; preview shows “Valores a confirmar.” only on details. Future confirmed groups support a single price, Desde, options, zones and combos; items have stable IDs, labels, optional detail and positive integer amountArs. A required price must include every amount. One formatArs helper uses es-AR / ARS without decimals. Synthetic amounts exist only in tests. No promotions, discounts or price claims are published.

## Media and release

Victoria and the two space slots have no src and are explicitly temporary/required. The UI uses only a neutral VIORA composition, never a simulated person or interior. Replacing src, alt and focalPosition in app-local data changes media without layout edits. Every final local photo requires authorization.

VIORA releaseBlockers now combines existing legal/booking approvals with professional/space media, required service content and required pricing. Preview remains permitted. There is no environment bypass for the pending editorial state. Complete legal/booking variables alone cannot release the current app. Confirmed content must include introduction, purpose, includes and session; pricing must validate. Existing environment flags, providers, guards and noindex defaults remain.

## Brand and footer

The supplied manual was reviewed in full. Exact palette: ivory, plum, rose, soft rose, ink and optional sage; Nimbus Roman heading stack and DejaVu Sans body. The original ciruela symbol is copied unchanged for neutral compositions. The favicon embeds the original white symbol PNG unchanged over a ciruela SVG backdrop for contrast at small sizes, preserving its aspect ratio. DejaVu Sans is served with its license; Nimbus uses local resolution and the manual's Times fallback pending a web distribution decision. No external design, text, code or photographs were copied.

VIORA footer centers legal links in a dedicated middle column, with balanced side columns for copyright and location. Preview status occupies a separate centered line and cannot shift legal alignment. At narrow widths the row wraps without hiding content. Juanjo changes are strictly limited to this requested footer compaction; its commercial behavior, booking, routes, assets and release state remain unchanged.

## Verification

Run the existing quality gates, plus tests/viora-commercial.test.mjs through test:contracts. Visual QA: home, catalog, limpieza-facial, depilacion-definitiva, reservar and contacto at 390/768/1440; also inspect 320/375/1024 responsiveness, keyboard focus, reduced motion and both compact footers. GitHub Actions remains disabled. No deploy, release activation, merge or Ready.

## QA de la primera versión (antes del ajuste compacto)

Revisión local en navegador del build estático: /, /servicios/, /servicios/limpieza-facial/, /servicios/depilacion-definitiva/, /reservar/ y /contacto/ a 390, 768 y 1440 px. Sin overflow horizontal de documento en las 18 combinaciones. Revisión adicional de home y depilación a 320, 375 y 1024 px, también sin overflow. El rail conserva cuatro servicios y cards enteras en desktop, con desplazamiento horizontal intencional en tamaños menores.

Se probó “Ver servicios” y “Ver opciones y precios”, así como Tab entre cards: el segundo servicio recibe foco visible sólido y se mantiene accesible. El CTA de Instagram de /reservar/ se revisó de nuevo a 768 px tras corregir su compresión. CSS reduced-motion se verifica por tests/inspección; no se afirma una emulación manual del sistema operativo. Ambos footers se revisaron a 1440 y 390 px; la fila inferior es única en desktop y envuelve su contenido en móvil. El favicon definitivo se revisó a 16, 24, 32 y 64 px. Los mapas externos se mantienen sin cambios. No se completó ninguna reserva real ni se enviaron mensajes.

Los estados temporales activos son: foto de Victoria, dos fotos del espacio, detalle comercial de los cuatro servicios y sus precios. Bloquean public release hasta su reemplazo/revisión; no hay cifras sintéticas en el sitio. Nimbus Roman conserva el fallback Times permitido por el manual; no se distribuye el binario AGPL del kit como webfont.

## Ajuste compacto solicitado

Se actualiza el mismo Draft PR #42. No se crea una rama apilada. Este ajuste no modifica apps/tattoo ni paquetes compartidos. Se retiran los CTA del hero, el bloque de tres pasos, el cierre de consulta genérico y la presentación profesional de las fichas. Cards sin descripción visible, título de catálogo centrado y menor altura mobile. La foto real de Victoria no está disponible (confirmado por el titular); se conserva el marco neutro y el blocker de release. Colores, logos y fuentes siguen el kit oficial, sin recursos nuevos ni dependencias.

### QA del ajuste compacto

Build final revisado localmente: landing, limpieza facial y depilación definitiva en 1440/1280/1024/768/390/320 px, sin overflow de documento. Catálogo, reservas y contacto revisados además en 1440/768/390. El panel queda visible desde la primera pantalla en desktop y móvil; una sola imagen visible por ficha en móvil. El contenido editorial ampliado queda después del panel en móvil para no retrasar la reserva cuando se completen los datos. Navegación desde card a ficha y foco sólido con Tab comprobados. Legales centrados con preview separado; copyright y powered by conservados.

Instalación frozen-lockfile y quality completos: PASS (119 tests, ambas apps sin errores/advertencias Astro, 21 HTML, 215/129 enlaces internos VIORA/Juanjo). Reduced motion comprobado por CSS, sin afirmar emulación del sistema operativo. Lockfile intacto, sin dependencias nuevas y sin cambios adicionales en Juanjo ni packages en este ajuste. GitHub Actions permanece desactivado; no se declara CI verde. No merge, Ready, release ni deploy.
