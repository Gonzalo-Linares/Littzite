# ADR-010 — Aplicación de marca VIORA manteniendo la arquitectura compartida

**Estado:** propuesto para revisión en PR-04 · **Fecha:** 2026-09-29

## Contexto

El prototipo de estética del PR-03 usa una composición genérica que no representa el manual de marca VIORA aportado por el titular. El manual define logo, paleta, familias tipográficas, voz, usos y límites de los materiales.

## Decisión

- Adaptar únicamente `apps/estetica` al manual VIORA, manteniendo los seis tokens comunes y valores oficiales validados por Zod.
- Aislar los colores secundarios, CSS editorial, fuentes con fallback y sección institucional propios de VIORA en la aplicación.
- Extender `BaseLayout` mediante una prop genérica `bodyClass?` y exponer slots nombrados `brand` en `SiteHeader`/`SiteFooter` y `artwork` en `LandingHero`, conservando el fallback visual existente para tatuajes y futuros clientes.
- Utilizar exclusivamente las variantes originales del logo aportadas por el kit, con proporciones/área de protección del manual. No reconstruir el monograma mediante CSS ni vectorizar automáticamente su raster.
- Los servicios del manual son texto de orientación editorial en el prototipo: sin rutas de reservas, horarios, precios, resultados garantizados o contenido clínico inventados.
- Mantener la CI desactivada por decisión expresa del propietario. La revisión se basa en pruebas locales documentadas y comprobación visual manual.

## Alternativas descartadas

- Introducir estilos de VIORA en `packages/ui`: contamina el sistema de diseño del tatuador.
- Duplicar los componentes compartidos por cada cliente: multiplica mantenimiento.
- Publicar fuentes e imágenes sin validar licencias/titularidad para un repositorio público: incompatible con D-08B y la política de materiales de clientes.
- Diseñar el tatuador imitando un perfil de Instagram no verificable: requiere capturas del portfolio real y permiso para sus fotografías.

## Pendientes

- **Permiso confirmado** por el usuario para incorporar al repositorio público las tres variantes oficiales del logo. Falta añadir los PNG originales a la rama del PR desde el ZIP preparado y verificar que las pruebas de build los encuentren.
- Comprobar tipografía real en los navegadores objetivo y definir distribución autorizada de las fuentes.
- Aprobar datos de contacto y servicios activos con el negocio. La web sigue como preview `noindex`.

[Implementación VIORA](../16-viora-brand.md) · [Política de PI](../15-ip-license-policy.md) · [Sistema de diseño](../05-design-system.md)
