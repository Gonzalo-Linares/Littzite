# PR #44 — catálogo comercial y material entregado VIORA

Continúa la rama existente feat/juanjo-hero-favicon-portfolio-polish. Previous HEAD: dba727cfb3f57eeddba50c92bf504ce361e1422a. Commit previsto: Expand VIORA commercial services and approved photography. El SHA final se registra en el PR y en el handoff de entrega.

## Arquitectura y contenido

Una fuente de verdad de servicios/actions en site.config.ts; detalle app-local con introducción, objetivo, pasos, cuidados, variantes y FAQ en viora-commercial-content.ts. No se modifican contratos compartidos. Cada acción conserva targetId por servicio: un Event Type futuro requiere cambiar su target, no rehacer páginas.

Orden del rail y catálogo, con rutas estáticas:

1. Depilación definitiva — /servicios/depilacion-definitiva/
2. Cejas y pestañas — /servicios/cejas-pestanas/
3. Limpieza facial — /servicios/limpieza-facial/
4. Masajes — /servicios/masajes/
5. BB Lips — /servicios/bb-lips/
6. Microneedling facial — /servicios/microneedling-facial/
7. Microneedling capilar — /servicios/microneedling-capilar/

Dermapen es un equipo/técnica complementaria en facial y capilar, sin card madre ni ruta /dermapen/. Peptonas no se ofrecen como servicio separado ni se afirman activos sin confirmar. Depilación explica LÁSER DIODO y reducción progresiva, zonas habituales, experiencia, cuidados y límites. Masajes compara relajantes, reductores y piedras calientes sin prometer adelgazar ni tratar lesiones. Limpieza explica higiene, extracciones cuando correspondan, máscaras e hidratación, sin inventar aparatología. Cejas/pestañas compara lifting, extensiones y laminado, confirmados por el titular; no se inventan perfilado, combos ni otras técnicas.

Seis fichas tienen contenido confirmado en el alcance del pedido. BB Lips queda contentStatus pending, obligatorio: el titular desconoce el protocolo. Tiene introducción y orientación útil de consulta, cuidados a confirmar y FAQ, sin afirmar Dermapen, pigmentos, color, ácido hialurónico, volumen ni activos. La foto rotulada micropigmentación se utiliza por instrucción expresa posterior del titular; no convierte el servicio en micropigmentación ni prueba el protocolo.

Reiki se retira del flujo comercial y no genera ruta nueva. No se declara que Victoria haya dejado de ofrecerlo: ficha anterior conservada en docs/25-viora-reiki-archived.txt y fotos anteriores conservadas con su procedencia. Su reincorporación requiere decisión comercial explícita.

## Fotos y presentación

Victoria imagen.jpeg se incorpora en public/images/victoria-linares.jpg, 435×563, sin ampliación ni retoque. Se usa en hero y presentación, con dimensiones intrínsecas correctas. victoriaMedia.temporary=false. Texto exacto solicitado preservado. El párrafo tiene ancho hasta 65ch, fuente de 1rem y min-width:0; en móvil ocupa toda la fila para evitar una columna estrecha junto al retrato. No cambia identidad, tipografías ni paleta.

Las seis imágenes de servicios y su mapeo están en apps/estetica/src/assets/services/SOURCES.md. Hashes, dimensiones y bytes en docs/25-viora-photo-manifest.json. Originales conservados en Downloads; derivados JPEG sin metadata innecesaria ni alteración estética. Hasta 1400px (1122px cuando ese es el original) y 640px, srcset con dimensiones reales. No se genera material con IA. Los archivos suministrados no acreditan por sí solos sesiones reales de VIORA; no se les atribuye esa procedencia.

No se encontró foto identificada de cuero cabelludo para microneedling capilar. Archivos IMG, WhatsApp y HEIC sin identidad inequívoca se dejaron fuera: no se asocian personas ni servicios por conjetura. No se encontraron fotos identificadas del espacio; sus bloqueos siguen activos. No se sustituye capilar por una imagen facial ni stock. Las fotos Pexels anteriores quedan fuera del catálogo principal, con sus avisos conservados. La imagen editorial de marca en /viora/ mantiene su procedencia existente.

El componente app-local de imágenes permite mostrar la única foto aprobada en contextos secundarios existentes cuando no hay otra toma; no fabrica una segunda foto ni recupera stock para el reveal. El rail conserva sus cuatro cards por grupo y comportamiento responsive.

## Reservas y precios

- Depilación → booking-depilacion-definitiva → https://cal.com/maria-victoria-linares-b6rvoz/depilacion?overlayCalendar=true
- Los otros seis servicios → booking-general → https://cal.com/maria-victoria-linares-b6rvoz/lashista

La query ?overlayCalendar=true permanece exacta. No se crean destinos nuevos ni se modifica Cal.com. Para maximizar conversión, crear posteriormente Event Types/routing específicos de Masajes, Limpieza facial, Cejas y pestañas, BB Lips, Microneedling facial y Microneedling capilar, y actualizar sus targetId.

Todos los precios permanecen pending y required; priceGroups=[] y sin previewGroups en las fichas reales. No hay montos ficticios ni precios $00.000 en páginas comerciales. La arquitectura distingue aprobación textual y pricing: persisten siete bloqueos de precios y el de protocolo BB Lips, además del espacio, legales, dominio y aprobaciones operativas. Public release sigue desactivado, noindex por defecto.

## Juanjo

Se retira aria-hidden de los cuatro contenedores de aftercare que incluían texto. Flecha y marca decorativas conservan aria-hidden. Hero aprobado y portfolio real dejan de marcarse temporales. Aftercare no usa imagen temporal en UI: tampoco mantiene un bloqueo falso. Se conservan guard, dominio, datos legales y aprobaciones pendientes; no se habilita release. No cambian hero, Oni, portfolio, header, footer, colores, tamaños ni tipografías.

## Validación y revisión manual

Ejecutar pnpm quality y git diff --check. Los resultados definitivos, número de tests y SHA final se registran en el PR y en la entrega. Pruebas cubren siete rutas, mapping de reservas, pricing pending independiente del contenido, ausencia de bloqueos falsos, validación de variantes/cuidados y texto de aftercare accesible. Sin dependencias nuevas, lockfile y packages compartidos intactos.

La inspección visual final corresponde al usuario: revisar las siete fichas, lectura de Victoria en desktop/móvil, foto de labios y recortes de imágenes en el rail. No se utilizó navegador, Playwright, Puppeteer, DevTools, screenshots ni previews automatizados. No hubo merge ni deploy. PR #44 debe mantenerse OPEN / DRAFT. PR #43 no se modifica.

## Archivos de esta ronda

- THIRD_PARTY_NOTICES.md
- apps/estetica/src/assets/services/SOURCES.md
- apps/estetica/src/components/ServiceVisual.astro
- apps/estetica/src/components/VioraProfessional.astro
- apps/estetica/src/pages/index.astro
- apps/estetica/src/pages/servicios/[slug].astro
- apps/estetica/src/service-visuals.ts
- apps/estetica/src/site.config.ts
- apps/estetica/src/styles/viora-experience.css
- apps/estetica/src/viora-commercial-content.ts
- apps/estetica/tests/viora-pricing-fixture/src/pages/index.astro
- apps/tattoo/src/brand.config.ts
- apps/tattoo/src/pages/guia.astro
- scripts/verify-app.mjs
- tests/contracts.test.mjs
- tests/tattoo-experience.test.mjs
- tests/tattoo-release.test.mjs
- tests/viora-commercial.test.mjs
- tests/viora-release.test.mjs
- apps/estetica/public/images/victoria-linares.jpg
- apps/estetica/src/assets/services/bb-lips-approved-small.jpg
- apps/estetica/src/assets/services/bb-lips-approved.jpg
- apps/estetica/src/assets/services/cejas-pestanas-approved-small.jpg
- apps/estetica/src/assets/services/cejas-pestanas-approved.jpg
- apps/estetica/src/assets/services/depilacion-definitiva-approved-small.jpg
- apps/estetica/src/assets/services/depilacion-definitiva-approved.jpg
- apps/estetica/src/assets/services/limpieza-facial-approved-small.jpg
- apps/estetica/src/assets/services/limpieza-facial-approved.jpg
- apps/estetica/src/assets/services/masajes-approved-small.jpg
- apps/estetica/src/assets/services/masajes-approved.jpg
- apps/estetica/src/assets/services/microneedling-facial-approved-small.jpg
- apps/estetica/src/assets/services/microneedling-facial-approved.jpg
- docs/25-viora-photo-manifest.json
- docs/25-viora-reiki-archived.txt
- docs/25-viora-commercial-services.md

## Resultado final de calidad

pnpm quality: PASS. 132 tests (132 pass, 0 fail), Astro check en ambas apps con 0 errores/advertencias/hints, builds PASS, 24 HTML validados. Verificación de enlaces internos: VIORA 311 en 16 páginas, Juanjo 149 en 8. git diff --check: PASS. Sin navegador ni QA visual automatizada. Lockfile, manifests de dependencias y packages compartidos sin cambios.
