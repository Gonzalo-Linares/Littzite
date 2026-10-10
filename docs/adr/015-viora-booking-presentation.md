# ADR-015: experiencia visual de turnos de VIORA sin activación comercial

**Estado:** aceptada; PR-21 actualiza routing comercial y consulta previa de precio

## Contexto

La arquitectura multipágina de VIORA ya existe, pero el titular pidió preparar `/reservar/` en PR-14 para revisar la experiencia antes de habilitar una agenda real. La decisión amplía el alcance de presentación acordado anteriormente; no cambia las decisiones de proveedor, duración, privacidad ni disponibilidad. Cal.com sigue en piloto pendiente y la profesional conserva el control de horarios y citas.

## Decisión

- VIORA incorpora `/reservar/` como página estática `noindex` que deriva los servicios de `siteContent.services` y sus imágenes de `serviceVisuals`.
- La página presenta una tarjeta por servicio. Los servicios con acción resuelta muestran “Solicitar turno”; los que continúan sin acción muestran “Agenda próximamente”.
- Para acciones `direct-booking` futuras, la app usa `resolveDirectBookingAction` y presenta el resultado con `ActionList`/`ButtonLink`. El markup no contiene lógica ni identificadores de proveedor.
- La ruta puede existir aunque `actions` y `bookingTargets` sigan vacíos. No implica disponibilidad ni confirmación de turnos.
- La interfaz visual no crea URLs, datos de ubicación, credenciales, embed de agenda, backend ni integración externa.
- Las tarjetas de `/reservar/` contienen cada visual en un media wrapper local con proporción definida; la primitiva compartida `ServiceVisual` conserva su comportamiento para las otras cards.
- El enlace de indicaciones aprobado por el titular vive en configuración local de VIORA. El `embedUrl` usa el `src` copiado desde el diálogo oficial “Insertar un mapa” de Google Maps; el enlace de indicaciones nunca se usa como `iframe src`.
- PR-21 configura `booking-general` para limpieza facial y masajes y `booking-depilacion-definitiva` solo para depilación definitiva, mediante el resolver y `ActionList` existentes. Las URLs productivas vienen del environment; Reiki permanece sin acción para el siguiente PR de catálogo.
- El UAT manual previo confirmó selección de horario, confirmación/email y cancelación/reprogramación, pero la confirmación mostró `Dónde: Cal Video`, una Location configurada en Cal.com. Antes de producción, Victoria debe verificar la ubicación presencial y duración de los Event Types; Littzite no oculta ni modifica los valores del proveedor.
- `/reservar/` permite consultar precio previamente por WhatsApp con un teléfono E.164 configurado, o por el Instagram oficial. WhatsApp solo abre una conversación con texto precargado en una nueva pestaña; la persona decide si lo envía. No se agregan precios, pagos ni señas.

## Consecuencias

Las dos URLs, datos personales/productivos y aprobaciones se mantienen fuera de Git. El guard de release las exige solo cuando se activa explícitamente `VIORA_PUBLIC_RELEASE`; el flag sigue `false` por defecto. La ubicación de VIORA se comparte mediante un `directionsHref` aprobado y un iframe cuyo `src` procede del diálogo oficial “Insertar un mapa” de Google Maps; nunca se deriva el iframe del short link.

La aplicación de VIORA puede incluir un CTA de navegación “Turnos” hacia `/reservar/`; la página declara con claridad el estado de configuración y no ofrece un control de reserva falso.
