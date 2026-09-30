# ADR-013: Fundacion headless para proveedores de reservas

**Estado:** aceptada para PR-09 (30/09/2026)

## Contexto

Las dos aplicaciones tienen recorridos aprobados de reserva directa, pero solo VIORA eligio proveedor para un piloto futuro. La cuenta y las URLs de Cal.com siguen pendientes; no se debe habilitar UI ni inventar destinos. `content-schema` ya valida la forma del target, HTTPS, credenciales y referencias, pero no debe asumir politicas particulares de proveedores.

## Decision

- Crear `packages/booking`, ESM/TypeScript puro, con unica dependencia `@littzite/content-schema` y export publico de raiz.
- `content-schema` conserva forma, IDs, referencias, HTTPS y unicidad de `SiteContent`; `booking` es propietario del registro cerrado de proveedores, politica de URL especifica y resolucion de acciones `direct-booking`.
- El unico proveedor inicialmente soportado es `cal-com`. Aceptar solo origen exacto `https://cal.com`, sin userinfo y con ruta no raiz. Preservar query y fragmento. No imponer una forma de usuario/evento.
- Rechazar proveedores desconocidos. Ambas apps validan todas sus listas de targets luego del parseo del esquema, incluidas listas vacias, para que futuros targets no soportados fallen durante la compilacion.
- La resolucion es local y pura: no red, DOM, Astro, SDK, estado mutable, disponibilidad ni confirmacion. Devuelve los datos de accion y el fallback externo validado.
- Las aplicaciones pueden consumir `booking`; este solo depende de `content-schema`, nunca de `ui`, `sections` o apps.

## Consecuencias

VIORA mantiene cuatro servicios con duraciones iniciales independientes de 60 minutos, `actions: []` y `bookingTargets: []`. Ningun HTML ofrece reservas ni publica una URL de Cal.com. Juanjo sigue sin proveedor ni destinos. Activar una agenda requiere cuenta y URLs reales aprobadas, duraciones/reglas comerciales verificadas y un cambio separado de alcance. Embed, API keys, webhooks, backend, almacenamiento y pagos no forman parte de esta decision.

## Alternativas descartadas

- Poner URLs y reglas de host en `content-schema`: mezcla el contrato general con politica de proveedor.
- Integrar el SDK o API de Cal.com: no se necesita red para validar/resolver fallback, y la cuenta no esta lista.
- Crear UI compartida o especifica: no hay destinos aprobados ni requisito de activacion.
- Permitir cualquier URL HTTPS: no falla cerrado ante proveedor desconocido y no comprueba el host de Cal.com.
