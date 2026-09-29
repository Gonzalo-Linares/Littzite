# Calidad, SEO, seguridad y operaciones — v0.5

## SEO local por construcción

- `canonicalOrigin` específico por sitio, canonical absoluta por página; sitemap solo con URLs indexables válidas; `robots.txt` independiente.
- D-09: usar `SiteConfig.defaultLocale = 'es-AR'` como única fuente de verdad para `<html lang>`, idioma de metadatos y formatos regionales por `Intl` cuando corresponda. Una sola versión de URL sin prefijo `/es/`; no emitir `hreflang` ficticio ni páginas traducidas. Slugs legibles en español y metadatos únicos por servicio.
- Título y descripción únicos y útiles, URL legible y HTML indexable por cada tratamiento/estilo genuinamente distinto. Evitar páginas casi duplicadas por barrio o palabra clave.
- Datos estructurados `LocalBusiness` con el subtipo correcto y la información **visible y verificable**; páginas de servicio con datos semánticos cuando correspondan.
- Perfil de Empresa en Google separado por negocio, contacto/NAP consistente, reseñas legítimas y fotografías originales autorizadas.
- Meta social y fotografías Open Graph por app; Search Console configurado para cada dominio; plan de redirecciones 301 cuando cambien slugs.
- No reutilizar descripciones idénticas de tratamientos entre sitios o fichas: el contenido aporta la diferenciación local.

## Calidad automatizada

**Gates implementados en PR-02:** `pnpm check:boundaries` revisa dependencias/imports y ciclos; `pnpm test:contracts` usa `node:test` para Zod y límites; `pnpm check`, `pnpm build` y `pnpm test` verifican ambas apps, incluyendo HTML estático, locale, `noindex`, tokens y aislamiento. CI ejecuta los gates en cada PR para ambas apps. La tabla siguiente enumera gates objetivo de fases posteriores; lint/format, Vitest, Playwright, axe/Lighthouse y link check aún no están configurados.

| Gate | Qué comprueba | Cuándo |
| --- | --- | --- |
| `pnpm lint` / format | convenciones y código no usado | PR |
| `pnpm typecheck` | TypeScript estricto, Astro y contratos | PR |
| Validación de contenido | Zod, referencias, URLs, slugs, locale `es-AR` y campos SEO | PR/build |
| Vitest | uniones discriminadas de `ServiceAction`, referencias a `BookingTarget`/`QuoteTarget`, fallback, URLs, SEO y secciones lógicas | PR |
| Build ambas apps | ausencia de imports cruzados, errores de SSR/build y assets | PR común |
| Playwright | menú móvil, reserva directa de estética, doble CTA tatuador, fallback, contacto, rutas y sitemap | PR/release |
| axe / Lighthouse | accesibilidad y performance móvil, umbrales progresivos | PR/release |
| Link check | enlaces internos, políticas y enlaces externos críticos | programado/release |

Testear adaptadores con stubs; E2E de widget externo solo como smoke test no determinista, para evitar flakiness por depender de un tercero. Cobertura útil en contratos y flujos, no porcentajes arbitrarios.

## Seguridad y privacidad

- Separación de cuentas y propiedad de dominio, proveedor de agenda, buscador/analítica y despliegue por cliente.
- `env` validada; secretos solo de lado servidor de los servicios que realmente los requieran. **Ninguna clave privada en `PUBLIC_` ni HTML generado.**
- URLs de calendarios controladas/validadas por lista de proveedores; no aceptar iframe URL arbitraria desde contenido sin revisión.
- `postMessage` de embeds: verificar `origin`, forma del mensaje y tipo permitido. No tomarlo como fuente confiable para pagos ni citas confirmadas de negocio.
- Scripts de terceros mínimos, CSP compatible con los proveedores elegidos, sin perder seguridad por la facilidad de incrustación.
- Política de privacidad, cookies, condiciones/cancelación y derechos de imágenes adaptadas a cada negocio y revisadas antes del lanzamiento.
- Captar solo datos imprescindibles. Evitar recibir datos sensibles de salud en formularios públicos; si surge una necesidad real, diseñar un flujo específico y revisar requisitos legales.
- Presupuestos de tatuajes: D-04 define WhatsApp directo, inicialmente solo texto. Littzite no implementa formulario, subida de archivos ni almacenamiento de mensajes; el número comercial real se valida antes de lanzar el CTA. Informar que se abandona el sitio para contactar a un tercero. No recopilar ni registrar el contenido del mensaje.
- Sin prometer métricas exactas de reserva por simples clics. Separar `cta_clicked`, `booking_widget_event` y `provider_confirmed_booking` cuando este último dato exista.

## Despliegue

1. Un proyecto de hosting, dominio, variables y Search Console **por app**.
2. Preview deployments fuera de los sitemaps de producción, con `noindex` y preferiblemente protegidos por autenticación cuando existan datos o contenido no público. `noindex` no es control de acceso.
3. CI selectiva por app, pero cualquier cambio en `packages/*` dispara typecheck/build/E2E clave de ambas.
4. Versiones fijadas por lockfile; actualización programada de dependencias; vigilar avisos de seguridad.
5. Rollback por deployment anterior y procedimiento documentado para una caída del proveedor de reservas.

## Responsabilidad del contenido

El negocio debe revisar servicios, precios, horarios, ubicación, tratamientos y descripciones de beneficios. Evitar promesas de resultados de procedimientos estéticos no sustentadas y publicar material fotográfico únicamente con los permisos aplicables.

## Presupuesto de calidad y auditoría de librerías

- Establecer presupuestos de recursos **por app y plantilla**, no metas arbitrarias derivadas de una única página: imágenes, JavaScript hidratado y scripts de terceros deben justificarse.
- Priorizar LCP, CLS e INP medidos en móvil y datos de campo cuando existan; comparar los sitios de marketing sin el widget y con el widget de reserva activo.
- Revisar dependencias exactas y licencias antes de extraer piezas de AstroWind; copiar solamente archivos auditados, preservar avisos MIT y comprobar recursos multimedia por separado.
- Mantener un inventario de scripts de terceros por app y de datos transmitidos a cada proveedor; evitar cargar widgets de reserva en páginas donde nadie los usa.
- Todo incidente con datos personales requiere revisión del negocio y del proveedor que los recibe; el proyecto no puede prometer cumplimiento legal por sí solo.
