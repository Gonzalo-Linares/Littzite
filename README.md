# Littzite — arquitectura fundacional

**Estado de implementación (01/10/2026):** dos prototipos estáticos `noindex`; PR-13 agrega resolución headless de acciones directas sobre la fundación de validación de proveedores. No activa reservas ni publica URLs comerciales. Ver [ADR-014](docs/adr/014-generic-direct-booking-resolution.md).
**Producto:** plataforma de creación de sitios comerciales modulares; primeros casos: estética integral y estudio de tatuajes en San Juan, Argentina.  
**Propósito:** captación orgánica local, diferenciación visual, contacto y reservas/solicitudes mediante proveedores externos.

> El repositorio incluye dos aplicaciones Astro, cuatro paquetes compartidos, contratos Zod, secciones compartidas y prototipos visuales. Ambas apps tienen `title` y `description` tipados en sus páginas y conservan `noindex, nofollow`. La app de estética incorpora el manual de marca y los tres logos oficiales autorizados de VIORA. Todavía **no** hay sitios comerciales terminados, SEO de lanzamiento ni integraciones de reservas. Las decisiones pendientes requieren validación antes de implementarse.

## Acuerdos de alcance

- Un monorepo con **dos apps Astro independientes** y **paquetes compartidos**; TypeScript estricto y configuración tipada; despliegue, dominio, contenido y credenciales separados.
- Modificar una capacidad común una sola vez, consumirla desde ambos sitios y validarla en ambas apps; evitar hardcodear identidad comercial dentro de los paquetes.
- Cada app tiene identidad y páginas propias. No crear una megatemplate con condicionales por cliente, ni un SaaS multi-tenant en v1.
- Contenido inicial gestionado como archivos versionados en Git; sin CMS, backend ni base de datos propios para la primera versión, salvo un requisito aprobado que lo justifique.
- Reservas desacopladas mediante acciones tipadas: estetica con una profesional y duraciones tecnicas por validar; tatuajes pequenos con reserva directa y grandes mediante presupuesto. Cal.com fue elegido para un piloto de VIORA, pero no hay cuenta/eventos/URLs reales aprobados ni reservas publicas; el proveedor de tatuajes sigue sin definir. D-04 confirma presupuestos de tatuajes grandes por WhatsApp, solo texto y sin formulario ni carga propia.
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

Para trabajar en una sola aplicación, usar `corepack pnpm --filter @littzite/estetica <check|build|test>` o `@littzite/tattoo`. Las pruebas de salida requieren ejecutar antes el build de la app. Ambas páginas siguen siendo prototipos `noindex` con componentes compartidos. VIORA usa identidad aprobada y catálogo de cuatro servicios; Cal.com está elegido únicamente para un piloto en standby, sin cuenta, enlaces ni reservas activas. La configuración provisional de 60 minutos corresponde a cada event type futuro del proveedor y debe revisarla la profesional. Juanjo tiene identidad editorial provisional sin fotografías ni logo gráfico originales. Faltan dominios y datos comerciales de producción. Los targets y acciones de reserva/presupuesto solo aparecen en fixtures de test. VIORA conserva sus tres logotipos originales autorizados en `apps/estetica/public/brand/`. Las instrucciones y limitaciones están en [la guía de marca](docs/16-viora-brand.md).

## Condiciones de uso del repositorio

**Littzite es público y no concede una licencia de reutilización de su código original.** Se reserva el derecho de autor conforme a la normativa aplicable, sin perjuicio de los permisos y límites derivados de los Términos de GitHub y la legislación vigente. Los componentes de terceros (incluido cualquier código de AstroWind efectivamente incorporado en el futuro) conservan **sus propias licencias y avisos**. No asumir que el contenido, las marcas, las fotografías o los diseños de clientes están autorizados para reutilización. Ver [política detallada](docs/15-ip-license-policy.md).

## Estados de decisión

- **Acordada**: decidida explícitamente en la conversación; cambiarla exige ADR y revisión.
- **Propuesta**: planteada técnicamente, pendiente de ratificación, prueba o validación de costes.
- **Pendiente**: no seleccionar proveedor, política comercial, flujo o integración sin información del negocio.

**Próximos pasos:** completar el portfolio de Juanjo cuando lleguen originales autorizados; revisar con la profesional la configuración provisional de 60 minutos por event type y las zonas de depilación; después configurar y probar los cuatro eventos y URLs reales de Cal.com, disponibilidad, ubicación y textos antes de activar reservas. El proveedor será la fuente operacional de duración y agenda. Resolver SEO y publicación productiva por separado.
