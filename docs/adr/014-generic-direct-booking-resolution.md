# ADR-014: resolución genérica de reservas directas y ownership de agenda

**Estado:** aceptada para PR-13 (01/10/2026)

## Contexto

PR-09 estableció en `packages/booking` un registry estático cerrado y la policy fail-closed de Cal.com. `content-schema` ya declara `ServiceAction` y `BookingTarget` y valida su forma y referencias. PR-13 necesita permitir que un caller futuro resuelva una acción `direct-booking` sin duplicar policy ni introducir un caller ficticio en una app.

El campo opcional `Service.durationMinutes` solo aparecía en el esquema, los cuatro valores provisionales de VIORA, tests y documentación. Ningún componente, ruta, script ni lógica compartida lo consumía. La duración real de una cita la configura y administra el event type del proveedor; duplicarla en `Service` crea dos fuentes de verdad.

## Decisión

- `content-schema` conserva la forma declarativa de `Service`, `ServiceAction`, `BookingTarget`, `QuoteTarget` y `SiteContent`, además de sus validaciones genéricas de forma y referencias. No conoce proveedores ni resuelve acciones.
- `booking` conserva la policy de proveedor y expone `resolveDirectBookingAction(action, targets)`. Solo resuelve acciones discriminadas como `direct-booking`; no resuelve quotes ni contactos.
- Un único registry estático cerrado relaciona `providerKey` con el adapter que valida y produce la URL. `validateBookingTargets` y el resolver reutilizan esa misma policy. El registro actual admite únicamente `cal-com`.
- La resolución es síncrona, pura, fail-closed y sin red, backend, SDK, credenciales, estado ni UI. Valida el target antes de devolver su URL conservada sin reescritura.
- La app configura acciones/destinos y la UI presenta el resultado. El proveedor es la fuente operacional de duración, disponibilidad, horarios y citas.
- Eliminar `durationMinutes` del contrato `Service`, de la configuración de VIORA y de fixtures. El campo estricto debe rechazarse. La configuración provisional de 60 minutos por cada uno de los cuatro event types del piloto VIORA permanece documentada como dato del proveedor, pendiente de revisión profesional; no se activa ninguna reserva.

## API y errores

`resolveDirectBookingAction` recibe una acción directa y una lista de targets. Devuelve `ResolvedDirectBookingAction` con `type`, `actionId`, `targetId`, `label`, `eligibilityNote?`, `providerKey` y `href`. Target ausente produce `MissingBookingTargetError` con IDs de acción y target; provider no registrado produce `UnsupportedBookingProviderError`; URL inválida conserva `InvalidBookingTargetError`.

## Consecuencias y límites

Una app o servicio nuevo no requiere modificar `booking` cuando usa un provider existente. Un provider nuevo puede justificar añadir un adapter al registry. VIORA y Juanjo conservan sus configuraciones comerciales inactivas. No se agregan dependencias ni cambia el lockfile. Ver [ADR-013](013-booking-provider-foundation.md) para la fundación y [ADR-012](012-viora-calcom-trial.md) para el piloto.
