# ADR-007 — Idioma único español de Argentina para v1

**Estado:** aceptada · **Fecha:** 2026-09-29 · **Decisión:** D-09

## Contexto

Las dos primeras aplicaciones de Littzite se dirigen inicialmente a negocios de San Juan, Argentina. No existe un requerimiento confirmado de traducir contenido ni operar versiones por país. Implementar internacionalización completa antes de ese requerimiento aumentaría la complejidad de rutas, edición, SEO y pruebas sin aportar valor al alcance aprobado.

## Decisión

- La primera versión de ambas apps utiliza exclusivamente español de Argentina, identificado por BCP 47 `es-AR`.
- `SiteConfig.defaultLocale` es el origen tipado y validado del idioma inicial. El contrato compartido lo consume para `<html lang>`, metadatos relevantes y formato regional; no duplicar literales dispersos por componentes.
- URLs públicas sin prefijo de idioma (por ejemplo, `/tratamientos/masajes-relajantes`). No crear rutas `/es/`, catálogos de traducción, selector de idioma, duplicados de páginas ni etiquetas `hreflang` que impliquen otras versiones inexistentes.
- Cada negocio conserva su propio dominio, contenido, canonicals y sitemap. Los slugs se definen editorialmente en español y se validan por app.
- Utilizar `Intl` con `es-AR` para fechas o importes donde correspondan, sin asumir precios o fechas comerciales no verificados. La zona horaria de un proveedor de citas se confirma por negocio de manera independiente: locale no implica disponibilidad, huso ni moneda obligatoria.
- No crear paquetes de internacionalización ni abstracciones de traducción especulativas. Si otro cliente o la expansión real de estas apps requiere más idiomas, abrir nueva decisión: revisar modelo de contenido, URLs, alternates/`hreflang`, canonicals, edición, accesibilidad, pruebas y redirecciones.

## Alternativas consideradas

1. Internacionalización y traducciones desde v1: descartada por alcance y mantenimiento innecesarios.
2. Prefijo `/es/` sin otras lenguas: descartado porque añade complejidad de rutas sin requerimiento de variantes.
3. Idioma global hardcodeado por cada componente: descartado por divergencia, falta de parametrización y errores de SEO.

## Consecuencias y verificaciones

- Menos rutas y fuentes de contenido; el sistema permanece modular sin fingir traducciones.
- Test de integridad del locale de cada app (`es-AR` en v1); HTML y metadatos coherentes, canonicals y sitemap sin prefijo; ningún `hreflang` de lenguas inexistentes.
- Cambiar el conjunto de idiomas admitidos requiere actualizar contratos, diagramas afectados, ADR y pruebas de ambas apps.

## Trazabilidad

[D-09](../09-open-decisions.md) · [Modelo de dominio](../03-domain-model.md) · [Calidad y SEO](../06-quality-operations.md)
