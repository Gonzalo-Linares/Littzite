# Especificación funcional: reservas y presupuestos — v0.3

**Estado:** recorridos comerciales básicos confirmados el 29/09/2026; integraciones reales, reglas de disponibilidad, pagos y canales aún pendientes. Esta especificación **no** autoriza producción con contenido ficticio.

## Matriz de recorridos aprobados

| Negocio | Oferta | Acción visible | Resultado esperado | Quién gestiona los datos |
| --- | --- | --- | --- | --- |
| Estética | Tratamiento ofrecido, de duración fija a validar en minutos | `direct-booking` | Agenda de la única profesional; horarios y confirmación por proveedor | Proveedor externo elegido por negocio |
| Tatuador | Trabajo pequeño, según definición comercial aún pendiente | `direct-booking` | Agenda externa para las categorías habilitadas por el artista | Proveedor externo elegido por negocio |
| Tatuador | Trabajo grande, según definición comercial aún pendiente | `quote-request` | Canal de consulta; el artista revisa y comunica un presupuesto | Canal externo aprobado por el artista |

Si una página de tatuajes ofrece ambas alternativas, la misma página referencia un servicio con **dos `ServiceAction`**, sin copiar tarjetas ni crear rutas casi duplicadas solo para resolver los CTA. El negocio puede optar por fichas distintas si existe contenido genuino para cada oferta.

## Contratos comunes

- `Service`: identidad del servicio, slug, descripción, medios, duración/precio opcionales y acciones ordenadas.
- `ServiceAction`: unión tipada con `direct-booking`, `quote-request`, `contact`; `label` editorial, `targetId` solo cuando corresponda, nota de elegibilidad aprobada si hace falta.
- `BookingTarget`: proveedor identificado mediante configuración por sitio; URL externa HTTPS y fallback validado; embed solo si hay adaptador específico habilitado.
- `QuoteTarget`: canal y URL aprobados, sin archivos ni almacenamiento propios. Antes de elegir canal, **no publicar** el CTA funcional.
- `booking provider adapter`: encapsula únicamente las capacidades documentadas del proveedor elegido. No inventar disponibilidad, precios, cancelaciones o soporte de webhooks.

## Invariantes de negocio

1. La estética ofrece una **única** agenda profesional mientras D-02A no indique lo contrario. La duración por tratamiento es obligatoria **para publicar un servicio con reserva directa**, no necesariamente para una página informativa de servicio.
2. Los trabajos pequeños del tatuador **pueden** reservarse directamente; la duración, las categorías concretas y el número de artistas son pendientes. No usar reglas automáticas de centímetros/precio no aprobadas.
3. Los trabajos grandes llevan a presupuesto previo; una consulta de presupuesto **no constituye** cita ni pago ni obliga a ofrecer un turno automático tras su aceptación.
4. Una página puede tener 0, 1 o más acciones. Las páginas sin target real de reserva/presupuesto muestran contacto **solo si** el negocio aprobó ese destino.
5. Las señas son **no definidas**; no simular pagos ni afirmar política de reembolso. Si se necesitan, verificar soporte del proveedor, pasarela disponible en Argentina y textos aprobados.
6. El frontend puede medir clics con la política de privacidad apropiada, pero no registra `booking_confirmed` desde mensajes no verificados de terceros.

## Casos de prueba contractuales planeados

| Caso | Resultado esperado |
| --- | --- |
| Estética: tratamiento con `durationMinutes > 0`, target externo aprobado | Resolver acción de reserva y URL válida sin duplicar lógica visual |
| Estética: servicio publicable con duración ausente | Fallo de validación antes de compilar el sitio público o acción de reserva no habilitada |
| Tatuador: ficha con dos acciones distintas | Renderizar ambas, en orden, y resolver una al calendario y otra al canal de presupuesto |
| Tatuador: acción de presupuesto sin D-04 aprobado | No generar un enlace o formulario ficticio; la publicación del CTA queda bloqueada |
| Widget no soportado/caído | Enlace HTTPS externo permitido y accesible |
| `targetId` apunta a otro tipo o no existe | Error de integridad de datos en build |
| Cambiar `packages/booking` o `packages/sections` | Gates obligatorios en **ambas** aplicaciones |
| Señas no definidas | Ninguna configuración/copy de cobro creada a partir de una suposición |

## Decisiones que desbloquean integración real

- D-01C: proveedor de calendario de cada negocio y capacidades contratadas.
- D-02A: duración por tratamiento, disponibilidad y ubicación verificadas de estética.
- D-02B: criterios para separar trabajos pequeños/grandes y configuración de agenda del tatuador.
- D-03: señas, cancelaciones, reprogramación y pagos, si corresponden.
- D-04: canal, datos y permisos para presupuestos del tatuador.

Véanse [registro de decisiones](09-open-decisions.md), [modelo de dominio](03-domain-model.md), [diagramas de flujos](04-sequences-flows.md) y [ADR-003](adr/003-booking-adapters.md).
