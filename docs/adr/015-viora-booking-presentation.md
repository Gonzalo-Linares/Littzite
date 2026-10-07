# ADR-015: experiencia visual de turnos de VIORA sin activación comercial

**Estado:** aceptada para la iteración visual de PR-14 (02/10/2026)

## Contexto

La arquitectura multipágina de VIORA ya existe, pero el titular pidió preparar `/reservar/` en PR-14 para revisar la experiencia antes de habilitar una agenda real. La decisión amplía el alcance de presentación acordado anteriormente; no cambia las decisiones de proveedor, duración, privacidad ni disponibilidad. Cal.com sigue en piloto pendiente y la profesional conserva el control de horarios y citas.

## Decisión

- VIORA incorpora `/reservar/` como página estática `noindex` que deriva los servicios de `siteContent.services` y sus imágenes de `serviceVisuals`.
- La página presenta una tarjeta por servicio. Sin acciones resueltas, muestra el estado editorial “Agenda próximamente” y una explicación breve de que se están configurando los horarios; no genera CTA de reserva.
- Para acciones `direct-booking` futuras, la app usa `resolveDirectBookingAction` y presenta el resultado con `ActionList`/`ButtonLink`. El markup no contiene lógica ni identificadores de proveedor.
- La ruta puede existir aunque `actions` y `bookingTargets` sigan vacíos. No implica disponibilidad ni confirmación de turnos.
- La interfaz visual no crea URLs, datos de ubicación, credenciales, embed de agenda, backend ni integración externa.
- Las tarjetas de `/reservar/` contienen cada visual en un media wrapper local con proporción definida; la primitiva compartida `ServiceVisual` conserva su comportamiento para las otras cards.
- El enlace de indicaciones aprobado por el titular vive en configuración local de VIORA y puede mostrarse sin un iframe. El `embedUrl` de Google Maps permanece pendiente de recibir el `src` oficial; el enlace de indicaciones nunca se usa como `iframe src`.

## Consecuencias

Se puede revisar el flujo visual antes de la activación comercial. PR-15 todavía debe aportar las URLs reales verificadas, revisar duraciones y disponibilidad, aprobar privacidad/consentimiento y realizar pruebas de reserva antes de agregar acciones. Para el mapa, las indicaciones están activas con el enlace confirmado; el mapa interactivo requiere el `src` oficial de embed.

La aplicación de VIORA puede incluir un CTA de navegación “Turnos” hacia `/reservar/`; la página declara con claridad el estado de configuración y no ofrece un control de reserva falso.
