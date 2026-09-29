# Decisiones acordadas, pendientes y criterios de desbloqueo — v0.5

**Regla:** distinguir decisión de producto confirmada, selección de herramienta propuesta e información real pendiente del negocio. Los pendientes no bloquean contratos transversales; sí bloquean la integración y publicación del flujo afectado. Toda alteración de una frontera arquitectónica exige actualizar la ADR y las pruebas previstas.

## Decisiones confirmadas el 29/09/2026

| ID | Estado | Decisión | Impacto |
| --- | --- | --- | --- |
| D-01A | **Acordada** | Estética: una sola profesional con servicios de duración fija. | Modelo de servicios; acciones de reserva directa por tratamiento sin agenda propia. |
| D-01B | **Acordada** | Tatuador: turnos directos para trabajos pequeños; presupuesto previo para trabajos grandes. | Un servicio/página puede tener varias `ServiceAction` tipadas. |
| D-03A | **Pendiente explícito** | No está definido si habrá señas para ninguno de los negocios. | No implementar ni publicitar pagos, política de cobro ni señalización de cita pagada. |
| D-04A | **Acordada** | Tatuajes grandes: presupuestos por WhatsApp directo, inicialmente solo texto, sin formulario ni carga de imágenes propios. | `QuoteTarget` de WhatsApp con número obtenido de `ContactConfig`; sin backend ni base de datos para presupuestos. |
| D-08A | **Acordada** | Repositorio Littzite **público**. | Revisar secretos, assets y licencias antes de commits; lo público no significa open-source. |
| D-08B | **Acordada** | **Sin licencia de reutilización** para el código original de Littzite; conservar derechos de autor, sin archivo `LICENSE` abierto. | Aviso visible en README; política de terceros, assets y contribuciones documentada en [política de PI](15-ip-license-policy.md) y ADR-006. |
| D-09 | **Acordada** | V1 exclusivamente en español de Argentina (`es-AR`) para ambas apps. | `SiteConfig.defaultLocale` validado; sin traducciones, selector idiomático ni rutas `/es/`, ver [ADR-007](adr/007-single-locale-es-ar.md). |

**No inferir:** que el tatuador trabaja solo, que los trabajos pequeños tienen una duración uniforme, que no existen señas, ni que Calendly/SimplyBook.me se haya elegido. WhatsApp es el canal de consulta, **no** el proveedor de agenda. Los ejemplos de esquemas son ilustrativos hasta validarse contra necesidades reales.

## Decisiones abiertas

| ID | Qué falta | Responsable previsto | Bloquea |
| --- | --- | --- | --- |
| D-01C | Proveedor de calendario por negocio, credenciales, tipos de evento y alcance de sus embeds | Titular de cada negocio + equipo técnico | Integración real; no bloquea contratos de reserva |
| D-02A | Estética: listado, duración en minutos de cada tratamiento, horario, local y reglas de disponibilidad | Profesional de estética | Configuración y publicación de turnos reales |
| D-02B | Tatuador: número de artistas, definición comercial de trabajo pequeño/grande, servicios reservables y reglas de agenda | Tatuador | Clasificación pública, duración de eventos y lanzamiento del CTA |
| D-03 | Señas, pagos en ARS, cancelación, reprogramación y recordatorios, **si se requieren** | Cada negocio | Configuración final del proveedor y textos comerciales |
| D-04B | Número comercial de WhatsApp verificado, mensaje inicial y texto informativo de salida a tercero aprobados | Tatuador + equipo técnico | Publicación del CTA real de presupuesto (el canal y alcance texto-only están acordados en D-04A) |
| D-05 | Nombre comercial, dominio, dirección y ubicación verificable de cada cliente | Cada negocio | Canonical, schema, Search Console y lanzamiento |
| D-06 | Fotografías, derechos, consentimientos y quién editará contenidos | Cada negocio | Publicación de assets finales y proceso editorial |
| D-07 | Hosting y titularidad de dominios y cuentas | Cada negocio + equipo técnico | Despliegue de producción; Cloudflare Pages sigue siendo una propuesta |

## Criterios para cerrar una decisión

1. Respuesta de quien administra el negocio, sin inventar precios, duración, disponibilidad o cobertura.
2. Impacto en modelo de contenido, UX, privacidad, SEO y/o infraestructura registrado.
3. Actualización de ADR cuando cambie arquitectura, proveedor crítico o contrato público.
4. Criterios de aceptación y pruebas enlazadas al ID.
5. Fecha, responsable y evidencia de aprobación registrables en la PR correspondiente.

## Próxima validación comercial

**D-04B:** confirmar número comercial real en formato internacional E.164, texto de apertura aprobado y aviso de salida a WhatsApp. D-01C, D-02A/B y D-03 siguen pendientes; no se debe inferir proveedor de agenda, duración, cantidad de artistas, señas ni política de cancelación.
