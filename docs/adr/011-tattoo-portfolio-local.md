# ADR-011 — Galería de Juanjo propiedad de la aplicación

**Estado:** propuesta para revisión de PR-05 · **Fecha:** 2026-09-29

## Contexto

Las apps ya comparten layout, cabecera, hero y tarjetas. Juanjo necesita una galería de tatuajes basada en imágenes **auténticas**. Aún no recibimos originales, pero sí capturas que permiten trabajar su dirección editorial y autorización para utilizar las obras. Llevar una galería no consumida por VIORA a `packages/sections` agregaría una abstracción que todavía no tiene dos consumidores.

## Decisión

1. Mantener la galería y su stylesheet únicamente en `apps/tattoo`. Reutilizar los componentes existentes de `ui` y `sections` mediante sus APIs públicas y el slot de arte, sin modificar sus contratos.
2. Mantener un contrato tipado local `TattooPortfolioItem` con `ImageMetadata` de Astro, validación de ID único, texto alternativo descriptivo y resolución mínima. `astro:assets` optimizará desde importaciones estáticas cuando existan originales aprobados.
3. Con `tattooPortfolio=[]`, renderizar un estado vacío explícito y un enlace de salida al Instagram oficial facilitado por el usuario, sin material de ejemplo que pueda confundirse con obras reales.
4. Interpretar el perfil por una tipografía y acento de uso **provisional**; no presentar una versión reconstruida de la marca gráfica como logotipo autorizado.
5. Mantener la web `noindex` y los recorridos de reserva/WhatsApp como información hasta resolver sus datos comerciales. Sin integrar API de Instagram, scraping ni imágenes sin procedencia.

## Alternativas descartadas

- Extraer una galería compartida desde el primer cliente: no hay un segundo consumidor real.
- Copiar imágenes de capturas de pantalla al repositorio: pierde calidad e impide un tratamiento editorial serio.
- Crear fotografías o falsos tatuajes con generación de imágenes: no representan trabajo auténtico del artista.
- Activar el teléfono o un sistema de reserva inferidos de las capturas: D-04B y D-01C requieren aprobación específica.

## Consecuencias

Un PR futuro podrá poblar el array local con originales y evolucionar la grilla sin reescribir la estructura. Si VIORA desarrolla un portfolio con las mismas necesidades, comparar entonces ambas implementaciones y extraer una sección compartida si hay una interfaz común comprobada. Se deben ejecutar los tests de ambas apps si se cambia un paquete; la CI sigue desactivada por decisión del titular.

[Guía de Juanjo](../17-juanjo-web-identity.md) · [Decisiones abiertas](../09-open-decisions.md) · [Política de PI](../15-ip-license-policy.md)
