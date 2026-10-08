# Littzite — arquitectura fundacional

**Estado de implementación (07/10/2026):** dos prototipos estáticos `noindex`; PR-19 aplica el manual oficial de Juanjo con cinco marcas maestras, tipografías licenciadas y rutas de inicio/trabajos/guía/estudio/contacto. Hero photography y portfolio esperan originales autorizados. Turnos inicia contacto por Instagram, sin agenda automática. PR-15 conserva una acción Cal.com temporal de UAT solo para depilación definitiva; la Location `Cal Video` debe cambiarse y el link UAT sustituirse antes de producción.
**Producto:** plataforma de creación de sitios comerciales modulares; primeros casos: estética integral y estudio de tatuajes en San Juan, Argentina.  
**Propósito:** captación orgánica local, diferenciación visual, contacto y reservas/solicitudes mediante proveedores externos.

> El repositorio incluye dos aplicaciones Astro, cuatro paquetes compartidos, contratos Zod, secciones compartidas y prototipos visuales. Ambas apps tienen `title` y `description` tipados y conservan `noindex, nofollow`. Estética usa identidad VIORA y Tattoo el manual oficial de Juanjo. El portfolio de Juanjo y los canales comerciales que faltan permanecen inactivos.

## Acuerdos de alcance

- Un monorepo con **dos apps Astro independientes** y **paquetes compartidos**; TypeScript estricto y configuración tipada; despliegue, dominio, contenido y credenciales separados.
- Modificar una capacidad común una sola vez, consumirla desde ambos sitios y validarla en ambas apps; evitar hardcodear identidad comercial dentro de los paquetes.
- Cada app tiene identidad y páginas propias. No crear una megatemplate con condicionales por cliente, ni un SaaS multi-tenant en v1.
- Contenido inicial gestionado como archivos versionados en Git; sin CMS, backend ni base de datos propios para la primera versión, salvo un requisito aprobado que lo justifique.
- Reservas desacopladas mediante acciones tipadas: estética con una profesional y duraciones técnicas por validar; tatuajes pequeños con reserva directa y grandes mediante presupuesto. PR-15 configura en su rama un único target temporal de UAT de Cal.com para depilación definitiva; no es una URL comercial ni autoriza producción. El UAT manual fue realizado; faltan la URL final de Victoria/VIORA y la corrección de la Location `Cal Video` del Event Type antes de producción. Los otros servicios VIORA no tienen target. El proveedor de tatuajes sigue sin definir. D-04 confirma presupuestos de tatuajes grandes por WhatsApp, solo texto y sin formulario ni carga propia.
- Reutilización selectiva de AstroWind solo luego de auditar código, versión y licencias independientes de sus recursos.
- **D-08B acordada:** repositorio público, **sin licencia de reutilización para el código original de Littzite**. Cada dependencia, fragmento de plantilla o asset de terceros conserva su licencia o autorización específica; ver [política de propiedad intelectual](docs/15-ip-license-policy.md) y [ADR-006](docs/adr/006-public-rights-reserved.md).
- **D-09 acordada:** primera versión únicamente en español de Argentina (`es-AR`) para ambos negocios, rutas sin prefijo idiomático y sin infraestructura de traducción, según [ADR-007](docs/adr/007-single-locale-es-ar.md).

## Índice

1. [Visión, alcance y requisitos](docs/01-vision-scope.md)
2. [Arquitectura lógica, contenedores y despliegues](docs/02-architecture.md)
3. [Dominio, clases y ERE conceptual](docs/03-domain-model.md)
4. [Secuencias y flujos](docs/04-sequences-flows.md)
5. [Sistema de diseño y parametrización](docs/05-design-system.md)
6. [Calidad, SEO, seguridad y operación](docs/06-quality-operations.md)
7. [Roadmap y Definition of Done](docs/07-implementation-roadmap.md)
8. [Referencias técnicas](docs/08-references.md)
9. [Registro de decisiones acordadas y pendientes](docs/09-open-decisions.md)
10. [Modelo de amenazas y límites de confianza](docs/10-security-threat-model.md)
11. [Trazabilidad y criterios de aceptación](docs/11-traceability.md)
12. [Contribución y estrategia de PR](docs/12-contributing.md)
13. [Especificación funcional del módulo de reservas](docs/13-booking-specification.md)
14. [Cómo visualizar los diagramas](docs/14-diagram-guide.md)
15. [Política de propiedad intelectual, terceros y contribuciones](docs/15-ip-license-policy.md)
16. [Integración visual del manual de marca VIORA](docs/16-viora-brand.md)
17. [Identidad editorial y galería preparada de Juanjo Tattoos](docs/17-juanjo-web-identity.md)
18. [Implementación digital del manual de Juanjo](docs/20-juanjo-digital-brand-implementation.md)
18. [Estado real de implementación](docs/18-implementation-status.md)
19. [Registros de decisión arquitectónica — ADR](docs/adr/)
20. [Instrucciones para agentes de código](AGENTS.md)

## Comprobaciones locales

Requiere Node.js 24 y pnpm 12.6.0 (disponible mediante Corepack). Desde la raíz:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm quality
```

`quality` ejecuta, en orden: `check:boundaries`, `lint`, `format:check`, `test:contracts`, `check`, `build`, `validate:html` y `test`. `validate:html` requiere builds recientes de las dos apps; `quality` los genera antes de validar. GitHub Actions continúa desactivado por decisión del propietario: registrar resultados locales del último HEAD y no declarar un workflow verde.

Para iniciar cada sitio en desarrollo, ejecutar `corepack pnpm dev:estetica` (puerto 4321) o `corepack pnpm dev:tattoo` (puerto 4322). `corepack pnpm format` aplica Prettier al código y configuración del workspace; los documentos Markdown quedan fuera del formateo automático.

Para trabajar en una sola aplicación, usar `corepack pnpm --filter @littzite/estetica <check|build|test>` o `@littzite/tattoo`. Las pruebas de salida requieren ejecutar antes el build de la app. Ambas páginas siguen siendo prototipos `noindex` con componentes compartidos. VIORA usa identidad aprobada y catálogo de cuatro servicios; depilación definitiva tiene una acción Cal.com de UAT temporal en PR-15, mientras los otros servicios siguen sin reservas activas. El UAT manual funcionó, pero Cal.com mostró `Dónde: Cal Video`: Victoria debe configurar la Location del Event Type como `In-person` o ubicación física personalizada apropiada y revisar su duración. Reemplazar el link UAT antes de producción. Juanjo aplica el manual oficial con hero de marca cuando falta foto, carousel en espera de obras autorizadas, Guía e inicio de turnos por Instagram; no tiene booking automático ni términos comerciales inventados. Faltan dominios y datos comerciales de producción. VIORA conserva sus tres logotipos originales autorizados en `apps/estetica/public/brand/`. Las instrucciones y limitaciones están en [la guía de marca](docs/16-viora-brand.md).

## Juanjo Tattoo Studio (PR-19)

La app `tattoo` implementa el manual oficial en `apps/tattoo/src/brand.config.ts`: cinco PNG maestros intactos, paleta exacta y Rye/DejaVu locales con licencias. `TattooSiteLayout.astro` centraliza `/`, `/trabajos/`, `/guia/`, `/estudio/` y `/contacto/`; se mantienen `noindex`, `tattooPortfolio=[]` hasta recibir originales autorizados y las listas comerciales vacías. El hero acepta foto local futura con `src` y `alt`; mientras tanto usa una composición de marca terminada. “Sacar turno” inicia contacto en el Instagram aprobado; no se configura agenda automática. Ver [la guía de implementación](docs/20-juanjo-digital-brand-implementation.md) y [los avisos de terceros](THIRD_PARTY_NOTICES.md).

## Atribución del desarrollador

La firma del desarrollador se compone con `@littzite/ui/SiteAttribution.astro`: `label`, `brand`, `href?`, `logoSrc?` y `className?`. Es una primitive neutral; cada app configura “Powered by / Littzite” localmente, sin URL ni logo hasta recibir datos reales. La firma es texto no interactivo mientras falta `href`; una URL futura utiliza el `Link` seguro. No reserva un espacio de imagen cuando falta `logoSrc`. `SiteFooter` ofrece slots opcionales `attribution` y `secondary-links`.

Cuando exista el sitio real de Littzite, se podrá configurar su URL con `?utm_source=viora&utm_medium=footer&utm_campaign=powered_by`. Esta posibilidad no habilita analytics ni instala tracking; hoy no se publica una URL ficticia ni un logo provisional.

## Condiciones de uso del repositorio

**Littzite es público y no concede una licencia de reutilización de su código original.** Se reserva el derecho de autor conforme a la normativa aplicable, sin perjuicio de los permisos y límites derivados de los Términos de GitHub y la legislación vigente. Los componentes de terceros (incluido cualquier código de AstroWind efectivamente incorporado en el futuro) conservan **sus propias licencias y avisos**. No asumir que el contenido, las marcas, las fotografías o los diseños de clientes están autorizados para reutilización. Ver [política detallada](docs/15-ip-license-policy.md).

## Estados de decisión

- **Acordada**: decidida explícitamente en la conversación; cambiarla exige ADR y revisión.
- **Propuesta**: planteada técnicamente, pendiente de ratificación, prueba o validación de costes.
- **Pendiente**: no seleccionar proveedor, política comercial, flujo o integración sin información del negocio.

**Próximos pasos:** corregir la Location de Cal.com que apareció como `Dónde: Cal Video` a `In-person` o texto presencial personalizado apropiado; reemplazar la URL temporal de UAT de depilación por el booking link final de Victoria/VIORA antes de habilitar producción. Victoria debe revisar la duración del Event Type. Cal.com conserva la disponibilidad: un único link permanente y fechas puntuales mediante Date Overrides, sin fechas en Littzite. El UAT manual ya se realizó. Revisar por separado los datos comerciales aún pendientes, SEO, legales, rendimiento y deploy.

PR-17 agrega contenido legal/privacidad inicial y preparación de release estático para VIORA. Sigue noindex por defecto; razón social, CUIT, email legal, teléfono, domicilio legal, aprobación de contratación y reservas, Cal.com presencial y URL final, URL real del sitio y revisión legal son blockers explícitos. Ver [readiness y Cloudflare Pages](docs/19-viora-release-readiness.md); no activar `VIORA_PUBLIC_RELEASE` antes de resolverlos.
