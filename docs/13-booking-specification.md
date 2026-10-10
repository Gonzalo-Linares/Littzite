# Especificación funcional: reservas y presupuestos — v0.4

**Estado:** recorridos comerciales básicos confirmados; VIORA prepara dos targets Cal.com app-locales y consulta previa por canales externos en PR-21. Las URLs productivas, datos legales y aprobaciones siguen fuera del repositorio y bloquean release. D-04 define **WhatsApp directo, inicialmente solo texto**, para presupuestos de tatuajes grandes; VIORA habilita una consulta previa de precio solo si su teléfono E.164 está configurado. Esta especificación **no** autoriza producción con datos ficticios.

## Matriz de recorridos aprobados

| Negocio | Oferta | Acción visible | Resultado esperado | Quién gestiona los datos |
| --- | --- | --- | --- | --- |
| Estética | Tratamiento ofrecido, de duración fija a validar en minutos | `direct-booking` | Agenda de la única profesional; horarios y confirmación por proveedor | Proveedor externo elegido por negocio |
| Tatuador | Trabajo pequeño, según definición comercial aún pendiente | `direct-booking` | Agenda externa para las categorías habilitadas por el artista | Proveedor externo elegido por negocio |
| Tatuador | Trabajo grande, según definición comercial aún pendiente | `quote-request` | Abre WhatsApp; el visitante redacta y envía una consulta de texto, el artista evalúa y cotiza | WhatsApp externo; Littzite no almacena ni confirma mensajes |

Si una página de tatuajes ofrece ambas alternativas, la misma página referencia un servicio con **dos `ServiceAction`**, sin copiar tarjetas ni crear rutas casi duplicadas solo para resolver los CTA. El negocio puede optar por fichas distintas si existe contenido genuino para cada oferta.

## Contratos comunes

- `Service`: identidad del servicio, slug, descripción, medios, precio opcional y acciones ordenadas. La duración operacional la mantiene el proveedor de agenda.
- `ServiceAction`: unión tipada con `direct-booking`, `quote-request`, `contact`; `label` editorial, `targetId` solo cuando corresponda, nota de elegibilidad aprobada si hace falta.
- `BookingTarget`: proveedor identificado mediante configuración por sitio; URL externa HTTPS y fallback validado; embed solo si hay adaptador específico habilitado.
- `QuoteTarget` v1: `channel: 'whatsapp'` y `prefillTemplate?` editorial; obtiene el teléfono E.164 único desde `ContactConfig`. El resolver común produce un enlace `https://wa.me/<dígitos>?text=<texto-codificado>` con `encodeURIComponent`. Nunca duplicar el número en fichas ni incluir datos personales en el texto prellenado. Sin archivos ni almacenamiento propios; CTA real bloqueado hasta verificar D-04B.
- `booking provider adapter`: encapsula únicamente las capacidades documentadas del proveedor elegido. No inventar disponibilidad, precios, cancelaciones o soporte de webhooks.

## Invariantes de negocio

1. VIORA tiene una profesional y dos targets Cal.com: agenda general para limpieza facial y masajes, y agenda exclusiva para depilación definitiva. Cada evento mantiene duración y disponibilidad en Cal.com; Littzite no replica esos datos en `Service`. Los futuros servicios de VIORA que no sean depilación usarán el target general cuando se incorporen al catálogo mediante el PR correspondiente.
2. Los trabajos pequeños del tatuador **pueden** reservarse directamente; la duración, las categorías concretas y el número de artistas son pendientes. No usar reglas automáticas de centímetros/precio no aprobadas.
3. Los trabajos grandes llevan a presupuesto previo; una consulta de presupuesto **no constituye** cita ni pago ni obliga a ofrecer un turno automático tras su aceptación.
4. Una página puede tener 0, 1 o más acciones. Las páginas sin target real de reserva/presupuesto muestran contacto **solo si** el negocio aprobó ese destino.
5. Las señas son **no definidas**; no simular pagos ni afirmar política de reembolso. Si se necesitan, verificar soporte del proveedor, pasarela disponible en Argentina y textos aprobados.
6. El frontend puede medir clics con la política de privacidad apropiada, pero no registra `booking_confirmed` desde mensajes no verificados de terceros.

## Casos de prueba contractuales planeados

| Caso | Resultado esperado |
| --- | --- |
| Acción `direct-booking` con target aprobado | Resolver la acción y obtener una URL validada sin duplicar lógica visual |
| Estética: event type, duración o disponibilidad aún no verificados | Gate operativo de publicación pendiente; no activar el CTA aunque la acción y la URL resuelvan localmente |
| Tatuador: ficha con dos acciones distintas | Renderizar ambas, en orden, y resolver una al calendario y otra al canal de presupuesto |
| Tatuador: presupuesto sin número comercial real o texto aprobado (D-04B) | No generar enlaces ficticios ni formulario propio; CTA de producción bloqueado |
| Widget no soportado/caído | Enlace HTTPS externo permitido y accesible |
| `targetId` apunta a otro tipo o no existe | Error de integridad de datos en build |
| Cambiar `packages/booking` o `packages/sections` | Gates obligatorios en **ambas** aplicaciones |
| Señas no definidas | Ninguna configuración/copy de cobro creada a partir de una suposición |

## Decisiones que desbloquean integración real

- D-01C: proveedor de calendario de cada negocio y capacidades contratadas.
- D-02A: duración por tratamiento, disponibilidad y ubicación verificadas de estética.
- D-02B: criterios para separar trabajos pequeños/grandes y configuración de agenda del tatuador.
- D-03: señas, cancelaciones, reprogramación y pagos, si corresponden.
- D-04A: **acordada**: WhatsApp directo, inicialmente solo texto; sin formularios, adjuntos ni almacenamiento propios.
- D-04B: **pendiente**: número comercial real, copy y aviso de salida al proveedor, para activar CTA productivo.

Véanse [registro de decisiones](09-open-decisions.md), [modelo de dominio](03-domain-model.md), [diagramas de flujos](04-sequences-flows.md) y [ADR-003](adr/003-booking-adapters.md).

## Flujo detallado D-04: WhatsApp directo

1. La ficha publica la acción `quote-request` únicamente si apunta a un `QuoteTarget` existente y a un número comercial E.164 aprobado de su propia aplicación.
2. El resolvedor compartido construye `wa.me` a partir de `ContactConfig.whatsapp`; puede prellenar solo información pública aprobada, como el nombre del servicio. Valida plantilla, número y host y codifica el texto correctamente.
3. La interfaz indica que la conversación continúa en WhatsApp y ofrece un CTA accesible `Consultar presupuesto por WhatsApp` (copy definitivo sujeto a D-04B).
4. El visitante abre WhatsApp y decide qué texto enviar; el tatuador recibe y responde en esa plataforma. Abrir o pulsar el enlace no demuestra que el mensaje se haya enviado.
5. Littzite no implementa formulario de presupuesto, selector de archivos, almacenamiento de mensajes ni confirmación propia. WhatsApp podría permitir que el visitante adjunte archivos allí: eso queda fuera del alcance del sitio.

**Pruebas previstas:** número en E.164 y perteneciente al negocio; codificación del texto y acentos; plantillas con datos únicamente públicos; bloqueo si falta configuración; enlace funcional en móvil y escritorio; aviso de tercero; analítica de clic sin mensajes ni identificadores privados; ausencia de código de formularios/archivos propios.

## Configuración de agendas VIORA (PR-21)

### Fundación compartida (PR-09)

`packages/booking` es una librería ESM/TypeScript headless que depende solo de `content-schema`. `siteContentSchema` conserva la validación de formas, referencias y unicidad; `booking` agrega el registro cerrado de proveedores y la política de URL por proveedor. Las dos apps validan sus colecciones completas de `bookingTargets` después del parseo, incluso si están vacías: son consumidores del policy gate de configuración, no del flujo de reservas.

El único proveedor admitido es `cal-com`: URL HTTPS con origen exacto `https://cal.com`, sin credenciales y con ruta distinta de `/`. Se aceptan query y fragmento; no se impone un patrón de usuario/evento ni se reescribe la URL. Proveedores desconocidos fallan con diagnóstico de `targetId` y `providerKey`. PR-13 agrega `resolveDirectBookingAction`, una primitiva genérica, pura y síncrona. La librería no contiene SDK, secretos, API, interfaz, modal, iframe ni estado mutable.

Juanjo consume la misma validación general de destinos, pero no configura proveedor ni target. La regla de agenda directa para trabajos pequeños sigue sin activarse hasta aprobar proveedor y URLs reales. Véase [ADR-013](adr/013-booking-provider-foundation.md).

El titular eligió **Cal.com Individual Gratis** para los turnos de una profesional de VIORA. Las URLs generales y de depilación se inyectan con `VIORA_BOOKING_GENERAL_URL` y `VIORA_BOOKING_DEPILACION_URL`; no se guardan datos reales ni rutas temporales en el repositorio. El guard productivo exige ambas URLs válidas y aprobaciones explícitas. La duración operacional pertenece a cada event type del proveedor, no a `Service`; la profesional debe revisar la ubicación presencial y las duraciones antes de habilitar clientes reales.

La profesional es titular de la cuenta y gestiona sus tipos de evento, disponibilidad efectiva, calendario de conflictos y mensajes; Cal.com es la fuente de verdad de citas. No almacenar datos de clientes ni credenciales de proveedor en Littzite. PR-21 modela `booking-general` para limpieza facial y masajes, y `booking-depilacion-definitiva` exclusivamente para depilación definitiva; las tres acciones usan el label “Solicitar turno”. Reiki conserva `actions: []` hasta el PR de catálogo. Las URLs que aparecen en preview son placeholders explícitos y nunca satisfacen el guard de producción.

La agenda general y la de depilación son links permanentes diferentes. La disponibilidad semanal puede permanecer cerrada y los días puntuales de máquina se agregan en Cal.com como Date Overrides; no se crean links mensuales ni se codifican fechas en Littzite. Cal.com conserva la fuente de verdad de disponibilidad. Victoria debe revisar ubicación y duración de ambos grupos de eventos antes de producción; Littzite no agrega ni duplica `durationMinutes`.

### UAT manual realizado y bloqueo de configuración

El titular confirmó la prueba manual de UAT: el visitante pudo reservar sin crear cuenta Cal.com, seleccionar un horario, completar la reserva, recibir confirmación/email y cancelar o reprogramar.

**Hallazgo bloqueante para producción:** la confirmación mostró `Dónde: Cal Video`. Es el valor de `Location` del Event Type configurado en Cal.com, no un defecto de Littzite. Antes de producción, Victoria debe cambiar el Event Type de depilación definitiva a `In-person` o a un texto de ubicación física personalizada apropiado. No ocultar ni reemplazar ese campo desde el frontend, y no agregar una ubicación al schema de Littzite sin confirmación comercial.

La validación manual previa encontró `Dónde: Cal Video` en la configuración de prueba. Antes de producción, la profesional debe comprobar que los Event Types de ambas agendas usan una ubicación presencial adecuada y duraciones revisadas. Ese valor lo configura Cal.com y no se debe ocultar en Littzite.

Obtener del titular de la cuenta solo las dos URLs públicas HTTPS aprobadas y verificar su host, asignación, ubicación, duración y disponibilidad. El guard reutiliza la policy del paquete `booking` para exigir HTTPS, origen exacto `https://cal.com`, path no raíz y ausencia de credenciales; además bloquea rutas temporales. Ni un clic ni callbacks visuales constituyen confirmación verificable de la cita. No hay embed de agenda ni integración propia.

Cal.com Individual informa actualmente 1 usuario con eventos, calendarios y reservas ilimitados: [página oficial de precios](https://cal.com/es/pricing). Soporta inline/popup: [documentación oficial de embed](https://cal.com/embed). Esto no implica que sus políticas, servicios y distribución móvil se mantengan invariables; verificar de nuevo al lanzar.
