# Littzite — reglas de trabajo para Codex y otros asistentes

Leer `README.md`, `docs/01-vision-scope.md`, `docs/02-architecture.md`, `docs/09-open-decisions.md`, `docs/13-booking-specification.md`, `docs/15-ip-license-policy.md` y ADR relevantes antes de proponer cualquier implementación. La documentación incluye decisiones vigentes y diagramas futuros: confirmar el árbol real antes de implementar; no asumir que lo pendiente fue aprobado. Consultar la matriz de estado en `docs/18-implementation-status.md` y decisiones en `docs/09-open-decisions.md`.

## Invariantes

1. Monorepo con apps independientes. `apps/*` solo consume contratos públicos de `packages/*`. Sin imports cruzados entre apps ni dependencias de packages a apps.
2. Sin hardcode comercial en packages compartidos: nombre, ubicación, teléfonos, logos, calendario, perfil social, copy, SEO y colores se cargan desde la configuración/colecciones de cada app.
3. Sin `if siteId === ...` ni `switch` por cliente en la lógica compartida; las diferencias se expresan mediante datos tipados, variantes justificadas o componentes específicos de app.
4. Contratos validados con Zod y TypeScript estricto; sin `any` salvo justificación localizada y testeada. Una sola fuente de verdad para el mismo dato.
5. Astro con salida estática por defecto. No CMS, API propia, DB, autenticación ni motor de reservas sin ADR y requisito real; no instalar librerías especulativas.
6. El proveedor externo es fuente de verdad de horarios y citas. El widget tiene fallback a enlace validado. No tomar eventos de navegador como prueba de pago o turno confirmado. La estética tiene una profesional y duraciones fijas; el tatuador requiere reserva directa para trabajos pequeños y presupuesto previo para grandes. No asumir tamaño máximo, duración ni señas sin validación. D-04: presupuesto de tatuaje grande por WhatsApp (solo texto en v1); sin formulario ni cargas de archivos propias. El número real todavía debe verificarse.
7. Cada aplicación tiene dominio, canonical, sitemap, medios, analítica, deployment, credenciales y perfiles comerciales propios. Ninguna clave secreta en HTML/JS público.
8. SEO local útil, contenido real, accesibilidad, velocidad móvil, privacidad y licencias de activos como requisitos de diseño.
9. AstroWind solo como fuente selectiva luego de auditoría de código, dependencias y licencias, conservando atribución exigida.
10. Un servicio puede presentar varias `ServiceAction` tipadas (reserva directa, presupuesto, contacto) sin copiar fichas ni crear condicionales por app. `ServiceAction`, `BookingTarget` y `QuoteTarget` son conceptos distintos; los targets externos nunca están incrustados en componentes genéricos.
11. D-08B: el repositorio es público, pero el código original de Littzite **no tiene licencia de reutilización**. No crear `LICENSE` con MIT, GPL, Apache, Creative Commons ni otra licencia sin decisión nueva. Identificar el código y assets de terceros, conservar sus avisos, registrar origen, versión, rutas y obligaciones antes de copiarlos. No asumir que una imagen, fuente, marca o contribución externa pasa a ser propiedad de Littzite.
12. D-09: el contenido inicial de ambas apps es exclusivamente español de Argentina (`es-AR`); `SiteConfig.defaultLocale` se valida en el esquema común y se consume en SEO, `<html lang>` y formato regional. Sin rutas `/es/`, selector de idiomas, catálogos de traducción ni `hreflang` para un único idioma. No hardcodear `lang` o formatos contradictorios en múltiples componentes; cualquier expansión requiere ADR.
13. `SiteConfig.iconHref`, cuando exista, es una ruta local root-relative; el layout común no contiene identidad de app. Mantener branding y motion específico dentro de la app. Las transiciones son progresivas, la navegación HTML normal siempre funciona y todo movimiento respeta `prefers-reduced-motion`.

## Antes de cada PR

- Describir objetivo, alcance y no alcance. Identificar contratos modificados y decisiones abiertas relacionadas.
- Si falta información relevante de proveedor de reservas, reglas comerciales, señas, número real y texto aprobado para WhatsApp, privacidad, dominios o edición de contenido: **detener únicamente el flujo afectado y preguntar**. La arquitectura transversal aprobada puede continuar. No rellenar con supuestos silenciosos.
- Testear el comportamiento modificado; si cambia `packages/*`, revisar y ejecutar gates de ambas apps.
- No duplicar funciones existentes ni copiar componentes enteros para cambios cosméticos. Verificar que las abstracciones no crean dependencias circulares.
- Actualizar diagramas/ADR/guías si cambian responsabilidades. Informar comandos y resultados reales, sin atribuirse checks no ejecutados.
- Si se incorpora código de AstroWind u otro tercero, verificar la licencia efectiva del commit importado, archivar los avisos requeridos en `THIRD_PARTY_NOTICES.md` cuando corresponda y evitar recursos gráficos no autorizados. No aceptar contribuciones externas sin permiso escrito suficiente para el uso previsto.

## Orden previsto

PR-00: documentación y aprobación; PR-01: scaffold mínimo pnpm + Astro + TypeScript + CI; PR-02: contratos Zod y sistema de diseño; PR posteriores: SEO/booking adapters y sitios reales. No mezclar arquitectura y diseño visual definitivo en el primer PR.

## Scaffold PR-01

El grafo implementado inicialmente es `apps/{estetica,tattoo} -> packages/{content-schema,ui}` y `packages/ui -> packages/content-schema`. PR-01 validó solo `SiteConfig.defaultLocale` y compartió un layout mínimo; PR-02 amplía ambos paquetes. PR-03 incorpora `sections` con `LandingHero` y `FeatureGrid`, ambos consumidos por las dos apps. `sections` depende de APIs públicas de `ui` y `content-schema`. `booking` existe como fundación headless; metadata de preview vive en `content-schema` y se renderiza en `ui`, sin paquete `seo`. El SEO de lanzamiento sigue pendiente. Ejecutar `pnpm check`, `pnpm build` y `pnpm test` para verificar ambas apps; los comandos por app están en cada `package.json`.

## Contratos PR-02

`siteContentSchema` valida los datos de una app y sus referencias internas. Las configuraciones demo no contienen datos comerciales ni targets externos. Antes de publicar reservas o WhatsApp se requieren el proveedor/host aprobado, duración verificada donde corresponda y D-04B; un fixture de test no autoriza un CTA público. `packages/ui` consume el tema tipado y no conoce el negocio. Ejecutar `pnpm check:boundaries` y `pnpm test:contracts` localmente junto con los gates de ambas apps; la CI sigue desactivada por decisión del titular. El checker de límites utiliza el AST de TypeScript sobre fuentes de apps y paquetes y comprueba manifests y ciclos; los imports dinámicos con expresiones no literales se rechazan para exigir revisión explícita. CSS usa análisis acotado de @import; nuevas convenciones requieren pruebas.

## Prototipos visuales PR-03

Ambas aplicaciones comparten `SiteHeader` y `SiteFooter` de `ui`, así como `LandingHero` y `FeatureGrid` de `sections`. Las variantes `serene` y `graphic` se eligen en cada aplicación y no se deciden mediante `siteId`. Son demos `noindex` con ilustración CSS original y contenido provisional, sin datos comerciales ni reservas activas. Ejecutar los gates de ambas apps y `check:boundaries` ante cambios compartidos.

## Identidad VIORA (PR-04)

La identidad de la aplicación `estetica` adopta el manual entregado por el titular: ciruela `#7B4655`, rosa `#C87D90`, rosa suave `#F0CED3`, marfil `#FAF5F0`, tinta `#39252D` y salvia opcional `#A7AEA0`. Mantener el arte original del logo en sus variantes horizontal, principal y de palabra, sin recrearlo con CSS, recortar zonas de seguridad ni deformarlo. El CSS de VIORA permanece en `apps/estetica` y NO entra en `packages/ui` ni en `apps/tattoo`. Los slots genéricos de header, footer y hero permiten imágenes de cada cliente sin condicionales de marca. La voz es cercana, con voseo, sin promesas de resultados ni atribuir tratamientos médicos al reiki. Las fuentes del manual se mencionan con fallback, pero no se publican archivos de fuentes sin su propia auditoría de licencia. Fotos, horarios, condiciones, canales y precios requieren validación comercial. Consultar `docs/16-viora-brand.md` y ADR-010.

La CI permanece desactivada por decisión del titular. No modificar el workflow para reactivarla; validar cambios mediante gates locales, registrar salidas concretas y no declarar GitHub Actions verde.

## Juanjo Tattoos (PR-05)

La app `tattoo` tiene CSS de marca provisional exclusivamente en `apps/tattoo/src/styles/juanjo.css`, un portfolio propio (`src/portfolio.ts`) y `TattooGallery.astro` con dos estados: galería de originales importados estáticamente y estado vacío honesto mientras no se aporten. No extraer al paquete `sections` una galería utilizada por un solo cliente ni añadir condicionales por cliente en los paquetes. No copiar imágenes desde capturas de Instagram ni generar obras falsas, y no recrear la marca circular original sin recibir su archivo. El perfil `juanjo.tattoos` está identificado en capturas del usuario; el enlace público a Instagram está aprobado como referencia, pero el teléfono y la agenda no se activan hasta D-04B, D-01C y D-02B. Aplicar el contrato de `ImageMetadata`, texto alternativo y originales autorizados al recibir material. Ver `docs/17-juanjo-web-identity.md` y ADR-011. CI continúa desactivada por decisión del usuario; pedir resultados reales de pruebas locales antes de fusionar.

## Catalogo informativo VIORA (PR-06)

Las cuatro fichas de `apps/estetica/src/site.config.ts` son la unica fuente de titulo, slug y descripcion. El `service-list` de inicio conserva IDs y orden; `ServiceCatalog.astro` resuelve referencias y enlaza a `src/pages/servicios/[slug].astro`, que genera rutas con `getStaticPaths()` desde contenido validado. Las fichas editoriales ahora incluyen únicamente una duración provisional editable de 60 minutos por servicio para el piloto Cal.com; no la renderizar como duración técnica aprobada. Mantener precio, acciones y destinos comerciales ausentes. No activar reservas hasta contar con duracion positiva, disponibilidad y proveedor aprobados (D-02A/D-01C), en otro PR. El catalogo queda especifico de VIORA; no agregar un package compartido para un solo consumidor. Mantener `noindex`, `es-AR` y el alcance de marca; ejecutar todos los gates locales indicados arriba y verificar ambas apps. CI continua desactivada.

## Cal.com: piloto de VIORA (PR-08a)

El titular eligió Cal.com Individual Gratis para probar una única agenda profesional y autorizó cuatro duraciones iniciales independientes de 60 minutos. Son placeholders configurables, pendientes de revisión profesional —especialmente depilación según zona—. Mantener `actions: []`, `bookingTargets: []` y `noindex` hasta disponer de cuatro URLs públicas verificadas de la cuenta real, disponibilidad aprobada, consentimiento/privacidad y resultados de reserva de prueba. Por decisión explícita para PR-14, `/reservar/` sí presenta la experiencia y el estado honesto de agenda en preparación; no expone acciones de reserva todavía. No inventar usuario, event slugs, teléfono, domicilio, pagos, API keys ni proveedores para Juanjo. La propietaria de la cuenta controla horarios y citas en Cal.com. CI continúa desactivada por decisión del titular. Ver issue #15 y ADR-012/015.

## Layout local de VIORA (PR-07)

`VioraSiteLayout.astro` en `apps/estetica` concentra cabecera, navegación, logos, pie, `viora.css`, locale y `noindex`, componiendo solamente los componentes públicos de `packages/ui`. La página `/reservar/` es específica de VIORA y consume `siteContent.services`, `serviceVisuals` y `resolveDirectBookingAction`; no conoce proveedores ni crea destinos. No mover branding a paquetes compartidos ni modificar Juanjo. Mantener `actions: []` y `bookingTargets: []` hasta URLs y aprobaciones reales. CI sigue desactivada; registrar los gates locales.

## Auditoría AUDIT-01 — invariantes adicionales

El catálogo VIORA debe poseer estilos locales explícitos y no depender de efectos de importar LandingHero ni hojas internas de sections. Las clases visuales entre aplicaciones no son API pública implícita. Canonical, sitemap, `robots.txt` de producción, JSON-LD, Open Graph, Content Collections y hosting definitivo siguen pendientes. La fundación headless de `booking` existe desde PR-09, pero no hay integración de agenda activa. El test de enlaces posterior al build comprueba rutas y fragmentos internos; no sustituye pruebas de teclado, accesibilidad y navegador. Registrar los seis gates locales sobre el HEAD final antes de cada merge. No activar CI.

## Fundación de reservas (PR-09)

`packages/booking` es una librería ESM/TypeScript headless cuya única dependencia workspace permitida es `content-schema`; no usa Astro, DOM, red, SDK, secretos ni estado mutable. `content-schema` es dueño de forma, IDs, referencias y HTTPS general; `booking` es dueño del registro cerrado de proveedores y la política URL específica. Por ahora solo admite `cal-com`: origen exacto `https://cal.com`, sin credenciales y con ruta no raíz. Aceptar query/fragmento sin reescribirlos; no asumir patrón de usuario/evento. Proveedores desconocidos fallan al compilar.

Ambas configuraciones de app deben llamar `validateBookingTargets` sobre la lista completa después de `siteContentSchema.parse`, aun vacía: son consumidores del policy gate de configuración, no del flujo de reservas. `apps/*` puede consumir `booking`; el checker aplica la allowlist `packages/booking -> packages/content-schema` y rechaza otros packages y apps. PR-13 resolvió `ServiceAction` y PR-14 añade una presentación app-local neutral en `/reservar/`, autorizada por ADR-015, sin URLs ni proveedor en UI. VIORA conserva `actions: []` y `bookingTargets: []`; Juanjo conserva lista vacía. No añadir cuenta, credencial, API, webhook ni backend sin decisión y datos aprobados aparte. Ver [ADR-013](docs/adr/013-booking-provider-foundation.md), [ADR-015](docs/adr/015-viora-booking-presentation.md) y [docs/13](docs/13-booking-specification.md).

## Candidato de publicación VIORA (PR-17)

VIORA conserva `noindex, nofollow` por defecto y solo intenta indexarse mediante `VIORA_PUBLIC_RELEASE=true` después de que la validación falle cerrado confirme identidad legal/comercial, `PUBLIC_SITE_URL` HTTPS, aprobación de booking, Location presencial, duración, términos y flujo de arrepentimiento. El booking UAT actual y el embed oficial de Maps no deben alterarse para aparentar aprobación. Instagram aprobado y ubicación pública se configuran en `apps/estetica`; ninguna identidad VIORA se mueve a paquetes. Cloudflare Pages, legal, privacidad, SEO, headers y QA se documentan en `docs/19-viora-release-readiness.md`. Lighthouse, accesibilidad manual y deploy siguen pendientes hasta ejecutarse realmente.
