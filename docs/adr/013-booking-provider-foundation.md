# ADR-013: Fundacion headless para politicas de proveedores de reservas

**Estado:** aceptada para PR-09 (30/09/2026)

## Contexto

Las aplicaciones tienen recorridos comerciales aprobados de reserva directa, pero no tienen acciones direct-booking ni targets autenticos configurados. VIORA eligio Cal.com para un piloto futuro; su cuenta y URLs siguen pendientes. Juanjo no tiene proveedor ni destinos. ADR-012 sigue vigente: solo tras recibir URLs reales y aprobacion profesional se configuraran targets/actions y se implementara la resolucion del flujo correspondiente.

## Decision

- Crear `packages/booking`, ESM/TypeScript headless, con unica dependencia workspace `@littzite/content-schema` y export publico de raiz.
- `content-schema` conserva forma, IDs, referencias, unicidad y validacion HTTPS general. `booking` posee el registro cerrado de proveedores y las politicas de URL especificas.
- Soportar inicialmente solo `cal-com`: origen efectivo exacto `https://cal.com`, HTTPS, sin userinfo y con ruta distinta de `/`. Permitir query y fragmento, conservar la URL sin reescribirla y no exigir un patron de usuario/evento.
- Rechazar proveedores no soportados con diagnostico que incluya `targetId` y `providerKey`.
- Integrar `validateBookingTargets` en las dos apps despues del parseo de `siteContentSchema`, para validar la lista completa incluso cuando esta vacia. Son dos consumidores reales del policy gate de configuracion, no del flujo de reservas.
- El checker expresa una allowlist por unidad: `packages/booking` puede depender de `packages/content-schema` y de ningun otro package workspace; la regla general sigue bloqueando dependencias de packages hacia apps.
- PR-09 implementa el registro/politica de proveedores, validacion fail-closed e integracion del gate en ambas apps. No implementa resolucion de `ServiceAction`.

## Consecuencias y limites

VIORA mantiene cuatro servicios con defaults independientes de 60 minutos, `actions: []` y `bookingTargets: []`. No se publica URL ni CTA comercial. Juanjo sigue sin proveedor ni targets. El paquete no contiene UI, resolucion de acciones, red, Astro, DOM, SDK, secretos ni estado mutable. No crea agenda, disponibilidad ni confirmaciones.

Targets/actions reales y la resolucion del flujo se implementaran solo cuando existan URLs autenticas y aprobacion profesional, segun ADR-012. Embed, API keys, webhooks, backend, almacenamiento y pagos quedan fuera de esta decision.

## Alternativas descartadas

- Poner hosts y reglas de proveedores en `content-schema`: mezcla el contrato general con una politica especifica.
- Resolver acciones sin caller real ni target autentico: crea codigo ejecutable especulativo antes de que exista un flujo configurado.
- Integrar SDK o API de Cal.com: no se necesita red para validar el destino y la cuenta no esta lista.
- Permitir cualquier URL HTTPS: no falla cerrado para hosts ajenos al proveedor aprobado.
