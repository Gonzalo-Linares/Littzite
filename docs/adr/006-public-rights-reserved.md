# ADR-006 — Repositorio público sin licencia de reutilización del código original

**Estado:** aceptada · **Fecha:** 2026-09-29 · **Decisión:** D-08B

## Contexto

Littzite se mantiene público para documentar arquitectura y exhibir trabajo profesional. El titular decidió no otorgar por ahora permisos generales de reutilización del código original del proyecto. El monorepo podría integrar software y materiales de terceros con condiciones diferentes, por ejemplo componentes de AstroWind evaluados bajo ADR-005.

## Decisión

1. Mantener el repositorio público **sin licencia open-source ni otro permiso general de reutilización** para el código original de sus respectivos titulares; explicar esto de manera visible en README y en la política de PI.
2. No crear un archivo `LICENSE` que sugiera por error MIT, GPL u otra autorización general.
3. Identificar y cumplir licencias y avisos de toda dependencia o código/asset de terceros. Un componente MIT puede conservar sus permisos MIT aun cuando el código original circundante tenga derechos reservados. Cada revisión/importación registra procedencia.
4. Exigir autorización suficiente para aceptar contribuciones ajenas sustanciales; mantener explícitos y separados los derechos sobre imágenes, logos, textos de clientes y recursos demo.
5. Una eventual licencia futura, incluida licencia dual/comercial, requiere otra ADR y revisión de titularidad de contribuciones y terceros.

## Alternativas

- **MIT para todo Littzite:** no elegida: concede derechos de reutilización y comercialización que el titular decidió no otorgar.
- **Repositorio privado:** no elegida: impediría mostrar abiertamente el portfolio y la arquitectura.
- **Licencia comercial propia inmediata:** no elegida: no hace falta redactar ahora contratos de distribución para el código original. Evaluar con asesoramiento adecuado si aparece una necesidad real.

## Consecuencias

- GitHub permite visualizar y hacer `fork` conforme a sus Términos; el público no recibe por esa razón permiso general para explotar el código original.
- La política restrictiva **no se extiende** a componentes de terceros que mantengan otras licencias.
- PR externos no deben fusionarse sin revisar titularidad y autorizaciones; la plataforma pública no es por sí sola un acuerdo de cesión de derechos.
- Registrar avisos de material importado en el propio código y/o en `THIRD_PARTY_NOTICES.md` cuando corresponda.
- La licencia de la plataforma y la titularidad de materiales de cada negocio son asuntos distintos.

## Trazabilidad

[D-08B](../09-open-decisions.md) · [Política de PI](../15-ip-license-policy.md) · [ADR-005](005-astrowind-reuse.md) · [Guía de contribución](../12-contributing.md)
