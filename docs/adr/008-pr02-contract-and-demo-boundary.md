# ADR-008 — Contratos de contenido y frontera de demo en PR-02

**Estado:** propuesto para revisión en PR-02 · **Fecha:** 2026-09-29

## Contexto

Los contratos de acciones y targets están aprobados, pero faltan proveedor de reservas, host verificado, número y texto de WhatsApp, dominios y contenido comercial. PR-02 necesita validar el modelo sin publicar datos inventados ni activar una integración.

## Decisión propuesta

- `SiteContent` agrupa contenido de **una** app y valida unicidad y referencias con Zod. `SiteConfig` conserva locale y tema obligatorios; contacto, ubicaciones y canonical productiva pueden faltar en una demo `noindex`.
- `PageSection` implementa solo `intro` y `service-list` hasta que haya contenido real para más variantes. Un servicio puede tener varias `ServiceAction` tipadas y destinos separados. `QuoteTarget` no duplica el número de `ContactConfig`.
- Los targets se validan estructuralmente, pero no se activan en las apps demo. HTTPS y ausencia de credenciales embebidas son requisitos de base; host/proveedor y texto aprobados se verifican antes de publicar. La duración de reserva directa no se impone universalmente porque las reglas de tatuajes pequeños siguen pendientes; el gate productivo de estética deberá exigir duración verificada.
- `packages/ui` recibe el tema tipado y no conoce identidades comerciales. CSS mínimo sirve al scaffold; Tailwind y Content Collections de ADR-002 se integrarán cuando haya estilos/contenido reales que justifiquen su uso.

## Consecuencias

Las pruebas pueden usar fixtures explícitos de URLs y números reservados para test, sin generar enlaces comerciales públicos. El diagrama de dominio continúa como arquitectura objetivo; no equivale a capacidades productivas implementadas. D-01C, D-02A/B y D-04B siguen bloqueando la activación de CTAs. Un cambio al modelo de publicación o al contrato de proveedor exige revisión de esta decisión y de ADR-003.
