# ADR-009 — Primeras secciones visuales compartidas y prototipos no indexables

**Estado:** propuesta para revisión en PR-03 · **Fecha:** 2026-09-29

## Contexto

PR-01 y PR-02 establecieron el monorepo, los contratos y un layout mínimo, pero ambos sitios solo tenían HTML de demo. Necesitamos validar una experiencia visual para dos negocios distintos sin fijar identidad de marca, publicar servicios ficticios ni añadir componentes o licencias innecesarios.

## Decisión propuesta

- Añadir `packages/sections` **ahora que tiene dos consumidores efectivos**: `LandingHero` y `FeatureGrid` se renderizan desde ambas apps y solo importan APIs públicas de `ui` y `content-schema`.
- Ampliar `packages/ui` con `SiteHeader` y `SiteFooter`, y compartir tokens de color, estados de foco, layout adaptable y el enlace de salto. Ningún componente compartido pregunta qué cliente está activo.
- Dos variantes explícitas para el hero (`serene` y `graphic`) elegidas en la aplicación. Ilustración original con CSS; no instalar fonts, librerías, plantillas ni assets de terceros.
- Agregar una variante `feature-grid` a `PageSection` porque ambas aplicaciones la usan. Copy y número de tarjetas se validan con Zod; slugs, referencias y locale mantienen los contratos anteriores.
- Mantener las demos `noindex` y diferenciar copy editorial del negocio real. Sin teléfonos, tratamientos, precio, nombre comercial definitivo, fotos de portfolios o links de reservas ficticios.

## Consecuencias

- Se prueba reutilización real en una composición serena para estética y otra editorial/gráfica para tatuajes, con las mismas piezas.
- La dirección de dependencias se mantiene: apps → sections → ui → content-schema, con imports directos de apps/sections a content-schema cuando se necesitan tipos; sin ciclos.
- Se amplían los smoke tests estáticos para validar encabezados, landmarks, titulares distintos, tres tarjetas por app, foco/skip link y ausencia de indexación. La revisión visual definitiva y la aprobación de marca **son posteriores**.
- Tailwind y AstroWind no son necesarios en este prototipo; evaluarlos con código, assets y licencias concretos si existe una necesidad real.
- Los proveedores externos y la publicación de contenidos comerciales permanecen fuera del alcance.

## Alternativas

- Duplicar cada hero y grilla en ambas apps: descartado porque ya comparten una misma responsabilidad real.
- Un único `PreviewLanding` que decida la estética mediante `siteId`: descartado por acoplamiento entre negocio y vista compartida.
- Añadir un CMS o librería de componentes completos: descartado por falta de contenido real y coste de mantenimiento.

## Trazabilidad

[Arquitectura](../02-architecture.md) · [Sistema de diseño](../05-design-system.md) · [D-09](../09-open-decisions.md)
