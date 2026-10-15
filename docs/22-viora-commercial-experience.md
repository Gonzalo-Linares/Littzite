# VIORA — experiencia comercial (Draft PR #42)

## Alcance y estado

Rama única: `feat/viora-commercial-experience`. Base main/PR #41 merged: `5c700b3a026b56a505509219f17eab451718e774`. HEAD anterior a esta ronda: `1a26a2eb198d58b81b4991596d37cf534d426fd6`. Se actualiza exclusivamente el mismo Draft PR #42; no nueva rama, PR, Ready, merge ni deploy. Copia local: `C:\Users\gonza\Documents\Littzite`.

Esta ronda no modifica Juanjo ni packages. El diff acumulado del PR conserva la compactación del footer Juanjo y el slot neutral compartido solicitados explícitamente al inicio; sus flujos comerciales permanecen intactos. Sin dependencias nuevas ni cambios en pnpm-lock.yaml. GitHub Actions continúa desactivado.

## Recorrido y navegación

Home: hero → servicios → Victoria → nuestro espacio → footer. No hay pasos de reserva, cierre comercial genérico ni teasers abstractos. Header, footer y contacto apuntan a `/servicios/` para explorar/comenzar un turno. El usuario elige una ficha y reserva desde su acción canónica junto a los precios.

`/reservar/` deja de tener página comercial. `astro.config.mjs` declara el redirect estático nativo `/reservar/` → `/servicios/`. Astro genera HTML con meta refresh inmediato (0 segundos), noindex y enlace de respaldo, sin JS ni reglas Cloudflare. Es una compatibilidad técnica, no un HTTP 301 garantizado por el hosting estático. No aparece en el sitemap ni en enlaces internos de UI. Se auditaron las referencias de `src`; la única definición remanente está en la configuración del alias.

El validador conserva todas las reglas semánticas. Sólo acepta el doctype en minúsculas que emite el template nativo de redirect de Astro, identificado por su encabezado y meta refresh; páginas normales siguen exigiendo mayúsculas. Un test comprueba que un redirect con imagen sin alt falla igualmente.

## Hero, Victoria y marca

El hero usa la V oficial a 70–90 px de ancho desktop y 56 px mobile, centrada respecto al título “Un momento para vos.”. Desktop reserva 74svh útiles debajo del header, con límites para pantallas bajas; mobile mantiene altura natural sin espacios forzados. Fondo radial marfil/rosa suave, sin patrones. Marco editorial con doble hairline (plum exterior, rose interior, separación 6 px), rama fina inferior izquierda, pequeño grupo floral superior derecho y detalle mínimo inferior derecho. SVG original app-local decorativo/aria-hidden, strokes finos y opacidades 35–55%, reducido en móvil. La franja de ubicación exacta es más estrecha, con ivory translúcido y regla superior. No se recrea el logo ni se generan fotos.

Victoria tiene título, slot de fotografía real y descripción breve, sin credenciales inventadas. Se reutiliza `victoriaMedia`: src, alt y focalPosition permiten reemplazar la composición neutra tanto en hero como en presentación. Las dos fotos del espacio siguen como slots explícitos. No se exige una segunda foto profesional.

Se conservan paleta y fuentes del manual: marfil, ciruela, rosas, tinta/salvia, Nimbus Roman local con fallback Times autorizado y DejaVu Sans con licencia. Favicon con la V original intacta. Footer mantiene legales centrados, preview separado, copyright y powered by.

## Rail y superficies interactivas

Servicios canónicos, orden, slugs y acciones siguen en site.config.ts. Home utiliza un anchor por card completa; catálogo hace lo mismo mediante viora-catalog__surface, incluyendo imagen y contenido, sin enlaces anidados. Intro del catálogo compacta: “Elegí tu momento.”.

Rail desktop: cuatro cards visibles; controles sólo si la geometría real indica overflow. Cada flecha se oculta/deshabilita al alcanzar su extremo. Scroll snapping, foco visible y navegación de teclado; mouse/trackpad y desplazamiento horizontal nativo. Mobile/tablet preservan swipe/scroll natural sin depender de flechas. ResizeObserver recalcula el estado y los observers/listeners se limpian al cambiar de página. `viora-service-rail.ts` concentra únicamente el cálculo geométrico testeable; no duplica contenido ni mantiene páginas comerciales.

Fixtures: 0/1/4/5/7/10 servicios. QA adicional de controles al inicio, grupo intermedio y extremo final de diez servicios, con vuelta por teclado. Las fichas ficticias y sus rutas existen sólo en el fixture de test.

## Motion sin flash al recargar

Se elimina VioraReveal.astro y su import: no existe IntersectionObserver ni una clase pending agregada después del primer paint. Esa era la causa del ciclo visible → hidden → visible. El tamaño del hero es una decisión de composición independiente de la corrección.

El estado inicial pertenece exclusivamente al CSS. Dentro de prefers-reduced-motion: no-preference y @supports(animation-timeline: view()), los elementos usan view timelines y animation-range. Servicios define el timeline nombrado --viora-services: las cards están dentro de un scroller horizontal y no deben usar su scrollport interno como referencia vertical. Título, subtítulo y cards avanzan con rangos progresivos; Victoria y espacio usan view(block) propio.

La animación de entrada de hero conserva 550 ms para copy y 650 ms + 90 ms para imagen. Los reveals ligados al scroll siguen el avance del usuario, no un temporizador. El 1ms técnico sólo asegura compatibilidad de la declaración; no produce un parpadeo temporal. La propiedad timeline se declara con un selector separado para impedir que el optimizador la combine en un shorthand nuevo que algunos navegadores no ejecutan. El CSS compilado del fixture tiene una regresión específica para este caso.

Sin soporte de view timelines el contenido aparece normalmente; no necesita JS para revelarse. Reduced-motion elimina todas las animaciones y muestra todo inmediatamente. No hay listeners de reveal que limpiar, layout shift, parallax ni scroll hijacking. El foco en una card la muestra inmediatamente.

## Header y footer móviles

VioraHeader.astro compone el SiteHeader existente sin modificar packages/ui. Reutiliza un único array de navegación para desktop y menú móvil. Hasta 640 px, una fila sticky de 64 px reúne logo oficial, Turnos y Menú; desaparece la fila permanente de navegación. El dropdown absoluto no aumenta la altura del header. Contiene Inicio, Servicios, VIORA, Contacto e Instagram canónico.

Details/summary es funcional sin JS y conserva semántica nativa de expansión. Con JS, aria-expanded se sincroniza con open y summary controla el id de nav mediante aria-controls. Escape cierra y devuelve foco; pointerdown exterior y navegación cierran el panel. Listeners se retiran al cambiar página Astro, y el menú se cierra al salir del breakpoint móvil. Foco visible y sin animación obligatoria.

Footer mobile centrado: logo/tagline, powered by Littzite en fila compacta, navegación primaria, legales, copyright, ubicación y preview final independiente. El aviso no participa en el bloque legal. Altura medida: 193,33 px frente a 305,45 px en 390/375 y 337,45 px en 320 antes del cambio (reducción 37–43%). Se reducen gaps/paddings y el acceso redundante Volver arriba se mantiene sólo en desktop. Los enlaces móviles conservan al menos 24 px de alto. Desktop mantiene su composición.

## Fichas y pricing

Desktop: izquierda 57,5% con nombre, frase breve e imágenes ilustrativas; derecha 42,5% con listado escaneable y CTA. Panel sticky con límite de altura respecto del viewport y scroll interno sólo si hace falta. Mobile: título → frase → una imagen → opciones/precios → reserva → información opcional; segunda imagen oculta. No hay bio de Victoria ni CTA “Ver opciones y precios”.

`viora-commercial-content.ts` mantiene la asociación validada serviceId → detalle, sin duplicar nombres/slugs/targets. El pricing aprobado usa priceGroups y montos ARS enteros positivos; un formatter Intl es-AR/ARS centraliza el formato sin centavos. Admite precio único, Desde, opciones, zonas y combos. CTA resuelto siempre por packages/booking: general para limpieza/masajes y específico para depilación; Reiki sigue sin booking.

Para ver el diseño ahora, el estado pending admite previewGroups separados de priceGroups. Son muestras estructurales solicitadas por el titular: limpieza (tres opciones), depilación (zonas/combos), masajes (dos opciones), Reiki (una muestra mínima). Labels y categorías NO están aprobados como catálogo. No contienen amountArs ni números reales; una máscara centralizada muestra `$00.000` o `Desde $00.000`, con aviso visible de muestra y “Valores a confirmar.”. No se usan imágenes de precios, select, descuentos ni promociones. Por ser pocas opciones se muestran todos los grupos, sin tabs innecesarias.

Validación rechaza importes numéricos en previewGroups, grupos/items duplicados, asociaciones huérfanas y mezcla de pricing confirmado con preview. Es imposible promover las muestras a confirmed sin completar los datos reales y retirar los grupos de muestra.

## Release fail-closed

Foto profesional y fotos del espacio siguen temporales/obligatorias. Contenido de servicios y precios siguen pending. Todos bloquean public release, junto con las aprobaciones legales y booking existentes. Cualquier previewGroups activo bloquea release incluso si pricing.required fuese false; no hay bypass por environment. Preview/noindex construye normalmente. Las muestras sólo se renderizan mientras public release esté desactivado.

## Validación y QA de esta ronda

Install --frozen-lockfile y quality completos: PASS; 125 tests, ambas apps Astro con 0 errores/warnings, 21 HTML, 245/129 enlaces internos VIORA/Juanjo. Tests de regresión cubren ausencia de ocultamiento tardío, CSS view timeline y fallback, CSS compilado sin shorthand incompatible, menú nativo/aria/cleanup, símbolo, SVG decorativo y separación legal/meta. Tests de booking, precios pendientes y release fail-closed continúan pasando. pnpm-lock.yaml intacto; sin dependencias nuevas.

Home revisada/capturada en 1440/1280/1024/768/390/375/320 a 900 px de alto, sin overflow de documento ni clases pending. Header mobile 64 px, footer 193,33 px, V de 56 px; desktop hero 666 px (74svh). Se revisaron frame floral, location strip, recarga y primer scroll: las cards permanecen a opacity 0 en el estado inicial desktop y, tras 180 px de scroll, avanzan a aproximadamente .79/.68/.57/.47, sin ningún cambio de clases por JS. Título/subtítulo entran antes; Victoria/espacio alcanzan opacity 1 al entrar. La recarga conserva el estado CSS sin ciclo visible→hidden→visible.

Menú a 320 px: apertura con Enter, Tab a Inicio, foco visible, Escape con retorno a summary, aria-expanded true/false, cierre exterior sobre la franja de ubicación y header de altura constante. Sticky top 0 tras scroll. Se revisó el footer móvil completo con legales centrados y meta separado. Reduced-motion/fallback se verifican mediante CSS/tests; no se afirma haber cambiado manualmente la preferencia del SO ni desactivado JavaScript en el navegador.

La foto real de Victoria, fotos del espacio, labels e importes de muestra continúan bloqueando release. Ninguna reserva ni mensaje fue enviado. No se habilitó release, CI, Cloudflare ni deploy. El PR permanece OPEN/DRAFT sin merge ni Ready.
