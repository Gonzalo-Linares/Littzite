# VIORA — experiencia comercial (Draft PR #42)

## Alcance y estado

Rama única: `feat/viora-commercial-experience`. Base main/PR #41 merged: `5c700b3a026b56a505509219f17eab451718e774`. HEAD anterior a esta ronda: `d35a5bf8966b7d28e84db8a88f993e0001e4ec40`. Se actualiza exclusivamente el mismo Draft PR #42; no nueva rama, PR, Ready, merge ni deploy. Copia local: `C:\Users\gonza\Documents\Littzite`.

Esta ronda no modifica Juanjo ni packages. El diff acumulado del PR conserva la compactación del footer Juanjo y el slot neutral compartido solicitados explícitamente al inicio; sus flujos comerciales permanecen intactos. Sin dependencias nuevas ni cambios en pnpm-lock.yaml. GitHub Actions continúa desactivado.

## Recorrido y navegación

Home: hero → servicios → Victoria → nuestro espacio → footer. No hay pasos de reserva, cierre comercial genérico ni teasers abstractos. Header, footer y contacto apuntan a `/servicios/` para explorar/comenzar un turno. El usuario elige una ficha y reserva desde su acción canónica junto a los precios.

`/reservar/` deja de tener página comercial. `astro.config.mjs` declara el redirect estático nativo `/reservar/` → `/servicios/`. Astro genera HTML con meta refresh inmediato (0 segundos), noindex y enlace de respaldo, sin JS ni reglas Cloudflare. Es una compatibilidad técnica, no un HTTP 301 garantizado por el hosting estático. No aparece en el sitemap ni en enlaces internos de UI. Se auditaron las referencias de `src`; la única definición remanente está en la configuración del alias.

El validador conserva todas las reglas semánticas. Sólo acepta el doctype en minúsculas que emite el template nativo de redirect de Astro, identificado por su encabezado y meta refresh; páginas normales siguen exigiendo mayúsculas. Un test comprueba que un redirect con imagen sin alt falla igualmente.

## Hero, Victoria y marca

El copy hero usa el símbolo oficial V, sin repetir el wordmark completo del header, y “Un momento para vos.”. Mantiene el frame responsive de retrato y la franja inferior de ubicación. `VioraBotanical.astro` aporta trazos botánicos originales, decorativos, aria-hidden, sin assets externos ni fotografías inventadas. No recrea el logo.

Victoria tiene título, slot de fotografía real y descripción breve, sin credenciales inventadas. Se reutiliza `victoriaMedia`: src, alt y focalPosition permiten reemplazar la composición neutra tanto en hero como en presentación. Las dos fotos del espacio siguen como slots explícitos. No se exige una segunda foto profesional.

Se conservan paleta y fuentes del manual: marfil, ciruela, rosas, tinta/salvia, Nimbus Roman local con fallback Times autorizado y DejaVu Sans con licencia. Favicon con la V original intacta. Footer mantiene legales centrados, preview separado, copyright y powered by.

## Rail y superficies interactivas

Servicios canónicos, orden, slugs y acciones siguen en site.config.ts. Home utiliza un anchor por card completa; catálogo hace lo mismo mediante viora-catalog__surface, incluyendo imagen y contenido, sin enlaces anidados. Intro del catálogo compacta: “Elegí tu momento.”.

Rail desktop: cuatro cards visibles; controles sólo si la geometría real indica overflow. Cada flecha se oculta/deshabilita al alcanzar su extremo. Scroll snapping, foco visible y navegación de teclado; mouse/trackpad y desplazamiento horizontal nativo. Mobile/tablet preservan swipe/scroll natural sin depender de flechas. ResizeObserver recalcula el estado y los observers/listeners se limpian al cambiar de página. `viora-service-rail.ts` concentra únicamente el cálculo geométrico testeable; no duplica contenido ni mantiene páginas comerciales.

Fixtures: 0/1/4/5/7/10 servicios. QA adicional de controles al inicio, grupo intermedio y extremo final de diez servicios, con vuelta por teclado. Las fichas ficticias y sus rutas existen sólo en el fixture de test.

## Motion progresivo

Hero: copy 550 ms, imagen 650 ms con demora de 90 ms. `VioraReveal.astro` usa IntersectionObserver pequeño y local: servicios espera el primer desplazamiento y la entrada real al viewport; título primero, subtítulo 70 ms después y cards con stagger moderado de 55 ms. Victoria y espacio se revelan al entrar. Transiciones de 650 ms, sin autoplay, parallax ni scroll hijacking.

Sin JS/IntersectionObserver, todo permanece visible. Reduced motion muestra todo inmediatamente y elimina animaciones/transiciones. Cambiar esa preferencia durante la visita también revela los elementos pendientes. Teclado conserva visibilidad al enfocar cards. El comportamiento de scroll se comprobó en navegador; reduced-motion se verifica mediante tests/CSS, sin afirmar cambio manual del sistema operativo.

## Fichas y pricing

Desktop: izquierda 57,5% con nombre, frase breve e imágenes ilustrativas; derecha 42,5% con listado escaneable y CTA. Panel sticky con límite de altura respecto del viewport y scroll interno sólo si hace falta. Mobile: título → frase → una imagen → opciones/precios → reserva → información opcional; segunda imagen oculta. No hay bio de Victoria ni CTA “Ver opciones y precios”.

`viora-commercial-content.ts` mantiene la asociación validada serviceId → detalle, sin duplicar nombres/slugs/targets. El pricing aprobado usa priceGroups y montos ARS enteros positivos; un formatter Intl es-AR/ARS centraliza el formato sin centavos. Admite precio único, Desde, opciones, zonas y combos. CTA resuelto siempre por packages/booking: general para limpieza/masajes y específico para depilación; Reiki sigue sin booking.

Para ver el diseño ahora, el estado pending admite previewGroups separados de priceGroups. Son muestras estructurales solicitadas por el titular: limpieza (tres opciones), depilación (zonas/combos), masajes (dos opciones), Reiki (una muestra mínima). Labels y categorías NO están aprobados como catálogo. No contienen amountArs ni números reales; una máscara centralizada muestra `$00.000` o `Desde $00.000`, con aviso visible de muestra y “Valores a confirmar.”. No se usan imágenes de precios, select, descuentos ni promociones. Por ser pocas opciones se muestran todos los grupos, sin tabs innecesarias.

Validación rechaza importes numéricos en previewGroups, grupos/items duplicados, asociaciones huérfanas y mezcla de pricing confirmado con preview. Es imposible promover las muestras a confirmed sin completar los datos reales y retirar los grupos de muestra.

## Release fail-closed

Foto profesional y fotos del espacio siguen temporales/obligatorias. Contenido de servicios y precios siguen pending. Todos bloquean public release, junto con las aprobaciones legales y booking existentes. Cualquier previewGroups activo bloquea release incluso si pricing.required fuese false; no hay bypass por environment. Preview/noindex construye normalmente. Las muestras sólo se renderizan mientras public release esté desactivado.

## Validación y QA de esta ronda

Instalación frozen-lockfile y todos los gates del quality se ejecutan localmente, sin declarar CI verde. El informe final del PR registra resultados concretos y HEAD publicado. Tests cubren máscara y grupos visibles, no aprobación de muestras, release bloqueado, booking canónico, ausencia de bio en fichas, alias único, superficies sin anchors anidados, estados del rail y reduced motion.

Se revisaron `/`, `/servicios/`, limpieza facial, depilación definitiva, masajes y contacto en 1440/1280/1024/768/390/320: 36 combinaciones sin overflow horizontal del documento ni enlaces anidados. Pricing comienza en torno a 193 px en desktop, 231 px en tablet y 471–506 px en móvil. Una sola imagen visible por ficha en móvil; 3/6/2 opciones de muestra para limpieza/depilación/masajes. Se verificaron capturas de hero/rail, catálogo compacto, pricing mobile/desktop, navegación al tocar la imagen y panel sticky (top 24 px después de scroll). No se completaron reservas ni se enviaron mensajes.

Resultados finales: install --frozen-lockfile PASS; quality PASS (123 tests, ambas apps con 0 errores y 0 warnings Astro, 21 HTML, 197/129 enlaces internos VIORA/Juanjo); lint y format:check repetidos después del último ajuste de listeners, PASS. git diff --check PASS. Alias /reservar/ verificado en navegador: termina en /servicios/.
