# Decisiones acordadas, pendientes y criterios de desbloqueo — v0.5

**Regla:** distinguir decisión de producto confirmada, selección de herramienta propuesta e información real pendiente del negocio. Los pendientes no bloquean contratos transversales; sí bloquean la integración y publicación del flujo afectado. Toda alteración de una frontera arquitectónica exige actualizar la ADR y las pruebas previstas.

## Decisiones confirmadas el 29/09/2026

| ID | Estado | Decisión | Impacto |
| --- | --- | --- | --- |
| D-01A | **Acordada** | Estética: una sola profesional con servicios de duración fija. | Modelo de servicios; acciones de reserva directa por tratamiento sin agenda propia. |
| D-01B | **Acordada** | Tatuador: turnos directos para trabajos pequeños; presupuesto previo para trabajos grandes. | Un servicio/página puede tener varias `ServiceAction` tipadas. |
| D-01C-VIORA | **Acordada para piloto** (30/09/2026); UAT técnico acotado en PR-15 | Probar Cal.com Individual Gratis para la única profesional de VIORA. Volumen estimado, no contractual: unos 15 turnos/mes. Para UAT se habilita solo depilación definitiva con la URL de cuenta de prueba `https://cal.com/gonzalo-linares-rfbhnf/prueba`; no es el enlace comercial final. | UAT manual completado. Reemplazar la URL UAT por la URL final de Victoria/VIORA y corregir `Cal Video` en la Location del Event Type a modalidad presencial antes de merge/producción. No habilita otros servicios, embed de agenda ni manejo propio de reservas. |
| D-02A-TRIAL | **Acordada para piloto** (30/09/2026) | Configuración inicial independiente de **60 minutos para cada uno** de los cuatro event types VIORA previstos en Cal.com. | Valores de prueba, no duraciones técnicas definitivas ni publicables hasta la revisión profesional; Victoria debe revisar la duración del Event Type de depilación. Cal.com será la fuente operacional. |
| D-03A | **Pendiente explícito** | No está definido si habrá señas para ninguno de los negocios. | No implementar ni publicitar pagos, política de cobro ni señalización de cita pagada. |
| D-04A | **Acordada** | Tatuajes grandes: presupuestos por WhatsApp directo, inicialmente solo texto, sin formulario ni carga de imágenes propios. | `QuoteTarget` de WhatsApp con número obtenido de `ContactConfig`; sin backend ni base de datos para presupuestos. |
| D-08A | **Acordada** | Repositorio Littzite **público**. | Revisar secretos, assets y licencias antes de commits; lo público no significa open-source. |
| D-08B | **Acordada** | **Sin licencia de reutilización** para el código original de Littzite; conservar derechos de autor, sin archivo `LICENSE` abierto. | Aviso visible en README; política de terceros, assets y contribuciones documentada en [política de PI](15-ip-license-policy.md) y ADR-006. |
| D-09 | **Acordada** | V1 exclusivamente en español de Argentina (`es-AR`) para ambas apps. | `SiteConfig.defaultLocale` validado; sin traducciones, selector idiomático ni rutas `/es/`, ver [ADR-007](adr/007-single-locale-es-ar.md). |
| D-10A | **Acordada para prototipo** | Aplicar el manual de marca VIORA, edición 01 (septiembre de 2026), a la app de estética. | Paleta y voz oficiales, variantes originales del logo, CSS privado de app, cuatro líneas editoriales. Ver [guía VIORA](16-viora-brand.md) y ADR-010. |
| D-10B | **Acordada** | El usuario confirmó permiso para incluir las tres versiones originales del logo VIORA en el repositorio público. | Incorporar únicamente los tres PNG originales preparados en `apps/estetica/public/brand/`, luego ejecutar pruebas locales. No implica autorización para redistribuir fuentes. |
| D-11A | **Acordada** | El usuario confirmó permiso para usar las obras y fotografías del tatuador Juanjo como referencias y en el sitio. | Tomar como referencia el perfil `juanjo.tattoos` y los trabajos mostrados en las capturas; emplear imágenes de calidad aprobada cuando se aporten los archivos originales. |
| D-11C | **Propuesta de PR-05** | Interpretación editorial provisional de Juanjo basada en sus capturas, con paleta carbón/marfil/coral y galería local que permanece vacía hasta recibir originales. | No confundir tipografía decorativa con logo real ni inferir autorización para mostrar retratos de terceros. [Guía Juanjo](17-juanjo-web-identity.md) y ADR-011. |

**No inferir:** que el tatuador trabaja solo, que los trabajos pequeños tienen una duración uniforme, que no existen señas, ni que Cal.com haya sido elegido para tatuajes o aprobado aún para reservas públicas de VIORA. WhatsApp es el canal de consulta, **no** el proveedor de agenda. Los ejemplos de esquemas son ilustrativos hasta validarse contra necesidades reales.

## Decisiones abiertas

| ID | Qué falta | Responsable previsto | Bloquea |
| --- | --- | --- | --- |
| D-01C | **VIORA: Cal.com elegido para prueba**, pendiente crear cuenta, verificar cuatro URLs individuales, políticas y modo de integración. **Tatuajes: proveedor sin definir.** | Titular de cada negocio + equipo técnico | Activación de reserva real; no bloquea contenidos informativos |
| D-02A | Estética: **duración provisional de 60 min por tratamiento para prueba**. Falta validación profesional de duración definitiva por servicio/zona, horario, ubicación y reglas de disponibilidad | Profesional de estética | Publicación de turnos reales |
| D-02B | Tatuador: número de artistas, definición comercial de trabajo pequeño/grande, servicios reservables y reglas de agenda | Tatuador | Clasificación pública, duración de eventos y lanzamiento del CTA |
| D-03 | Señas, pagos en ARS, cancelación, reprogramación y recordatorios, **si se requieren** | Cada negocio | Configuración final del proveedor y textos comerciales |
| D-04B | Número comercial de WhatsApp verificado, mensaje inicial y texto informativo de salida a tercero aprobados | Tatuador + equipo técnico | Publicación del CTA real de presupuesto (el canal y alcance texto-only están acordados en D-04A) |
| D-05 | Nombre comercial del tatuador y dominio, dirección y ubicación verificable de ambos; **el nombre VIORA se confirmó mediante su manual** | Cada negocio | Canonical, schema, Search Console y lanzamiento |
| D-06 | Fotografías originales de VIORA, permisos de retratos de terceras personas y responsables de edición; para Juanjo, obtener los originales de calidad publicable y acordar su selección | Cada negocio | Publicación del portfolio final y proceso editorial |
| D-07 | Hosting y titularidad de dominios y cuentas | Cada negocio + equipo técnico | Despliegue de producción; Cloudflare Pages sigue siendo una propuesta |
| D-10C | VIORA: revisar duración y ubicación del Event Type de depilación; cambiar `Cal Video` a `In-person` o ubicación física personalizada, reemplazar link UAT por el final y confirmar los datos comerciales restantes | Profesional de estética | Producción bloqueada hasta corregir la Location en Cal.com y aprobar el link final. UAT manual ya completado |
| D-11B | Selección de archivos originales para el portfolio de Juanjo, resolución apta para web, orden de las piezas y confirmación del tratamiento editorial del logotipo del perfil | Tatuador + equipo técnico | Publicación del portfolio final; no bloquea la exploración visual basada en las capturas |

## Criterios para cerrar una decisión

1. Respuesta de quien administra el negocio, sin inventar precios, duración, disponibilidad o cobertura.
2. Impacto en modelo de contenido, UX, privacidad, SEO y/o infraestructura registrado.
3. Actualización de ADR cuando cambie arquitectura, proveedor crítico o contrato público.
4. Criterios de aceptación y pruebas enlazadas al ID.
5. Fecha, responsable y evidencia de aprobación registrables en la PR correspondiente.

## Próxima validación comercial

**D-04B:** confirmar número comercial real en formato internacional E.164, texto de apertura aprobado y aviso de salida a WhatsApp. D-01C y D-02A están parcialmente resueltos **solo para el piloto VIORA** (Cal.com, una URL de UAT de cuenta de prueba solo para depilación y duración operativa en Cal.com). El UAT manual confirmó reserva sin cuenta, selección de horario, confirmación/email y cancelación/reprogramación. La confirmación mostró `Dónde: Cal Video`: corregir la Location del Event Type a `In-person` o ubicación física personalizada apropiada; este dato lo configura Cal.com y no se debe ocultar en Littzite. La URL final debe reemplazar UAT y Victoria debe revisar la duración antes de producción. La disponibilidad se mantiene en Cal.com mediante un link permanente y Date Overrides puntuales. D-02B y D-03 siguen pendientes. No inferir duración del tatuador, señas ni política de cancelación.
# VIORA — bloqueos de release PR-17

- Identidad legal del prestador, CUIT, email de privacidad/reclamos y domicilio legal si corresponde.
- Datos comerciales que deban informarse antes de contratar: precio y condiciones aplicables; validar con asesoría jurídica. No inventar señas, medios de pago, cancelaciones, reintegros ni duración.
- Reemplazar la URL UAT Cal.com, aprobar Location presencial, revisar duración y repetir UAT focal.
- Confirmar suficiencia jurídica del flujo estático de arrepentimiento por email y completar contacto real.
- URL real de producción (incluido `pages.dev` tras primer deploy) antes de definir `PUBLIC_SITE_URL`.
