# ADR-005 — Reutilización selectiva de AstroWind

**Estado:** Acordada la evaluación, reutilización exacta pendiente de auditoría · **Fecha:** 2026-09-28

## Contexto
AstroWind es una plantilla Astro/Tailwind con licencia de código MIT y componentes que podrían acelerar el trabajo.

## Decisión
Auditar componentes de interés (Hero, footer, tarjetas, galerías, FAQ, CTA), dependencias, accesibilidad, tamaño y compatibilidad antes de copiar. Conservar atribución y avisos de licencia exigidos, documentando versión/commit, ruta y origen de cada componente incorporado, por ejemplo en `THIRD_PARTY_NOTICES.md` cuando efectivamente se importe. Verificar licencias de imágenes y fuentes **por separado**. D-08B reserva derechos sobre el código original de Littzite, **sin sustituir ni eliminar** los permisos y obligaciones de la licencia de AstroWind u otros terceros; ver [ADR-006](006-public-rights-reserved.md). No introducir componentes de blog, marketing o animación que no usaremos.

## Referencia
https://github.com/arthelokyo/astrowind
