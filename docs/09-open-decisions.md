# Decisiones acordadas, pendientes y criterios de desbloqueo — v0.5

**Regla:** distinguir decisión de producto confirmada, selección de herramienta propuesta e información real pendiente del negocio. Los pendientes no bloquean contratos transversales; sí bloquean la integración y publicación del flujo afectado. Toda alteración de una frontera arquitectónica exige actualizar la ADR y las pruebas previstas.

## Decisiones confirmadas el 29/09/2026

| ID | Estado | Decisión | Impacto |
| --- | --- | --- | --- |
| D-01A | **Acordada** | Estética: una sola profesional con servicios de duración fija. | Modelo de servicios; acciones de reserva directa por tratamiento sin agenda propia. |
| D-01B | **Acordada** | Tatuador: turnos directos para trabajos pequeños; presupuesto previo para trabajos grandes. | Un servicio/página puede tener varias `ServiceAction` tipadas. |
| D-01C-VIORA | **Cal.com elegido** para la única profesional de VIORA; preparación app-local de dos agendas en PR-21 | Agenda general para limpieza facial y masajes; agenda separada y exclusiva para depilación definitiva. El titular de la cuenta controla eventos, disponibilidad y citas. | Las URLs productivas y la aprobación de ambas agendas se configuran por environment, nunca en Git. La configuración de targets no activa `VIORA_PUBLIC_RELEASE` ni autoriza deployment. La Location presencial y las duraciones deben quedar verificadas en Cal.com. |
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
| D-01C | **VIORA: Cal.com elegido**; faltan las dos URLs productivas, revisión de ambas agendas y sus aprobaciones humanas. **Tatuajes: proveedor sin definir.** | Titular de cada negocio + equipo técnico | Activación de reserva real; no bloquea contenidos informativos |
| D-02A | Estética: **duración provisional de 60 min por tratamiento para prueba**. Falta validación profesional de duración definitiva por servicio/zona, horario, ubicación y reglas de disponibilidad | Profesional de estética | Publicación de turnos reales |
| D-02B | Tatuador: número de artistas, definición comercial de trabajo pequeño/grande, servicios reservables y reglas de agenda | Tatuador | Clasificación pública, duración de eventos y lanzamiento del CTA |
| D-03 | Señas, pagos en ARS, cancelación, reprogramación y recordatorios, **si se requieren** | Cada negocio | Configuración final del proveedor y textos comerciales |
| D-04B | **Juanjo:** número comercial de WhatsApp verificado y aviso de salida aprobado. **VIORA:** copy de consulta previa aprobado; el CTA aparece únicamente cuando `VIORA_LEGAL_PHONE` tenga un E.164 válido. | Titular de cada negocio + equipo técnico | Activar cada CTA solo en la aplicación cuyo dato esté confirmado |
| D-05 | Nombre comercial del tatuador y dominio, dirección y ubicación verificable de ambos; **el nombre VIORA se confirmó mediante su manual** | Cada negocio | Canonical, schema, Search Console y lanzamiento |
| D-06 | Fotografías originales de VIORA, permisos de retratos de terceras personas y responsables de edición; para Juanjo, obtener los originales de calidad publicable y acordar su selección | Cada negocio | Publicación del portfolio final y proceso editorial |
| D-07 | Hosting y titularidad de dominios y cuentas | Cada negocio + equipo técnico | Despliegue de producción; Cloudflare Pages sigue siendo una propuesta |
| D-10C | VIORA: configurar y revisar las dos URLs de agenda; corregir `Cal Video` a `In-person` o ubicación física personalizada y revisar duración y datos comerciales restantes | Profesional de estética | Producción bloqueada hasta validar la configuración de Cal.com y los datos de release |
| D-11B | Selección de archivos originales para el portfolio de Juanjo, resolución apta para web, orden de las piezas y confirmación del tratamiento editorial del logotipo del perfil | Tatuador + equipo técnico | Publicación del portfolio final; no bloquea la exploración visual basada en las capturas |

## Criterios para cerrar una decisión

1. Respuesta de quien administra el negocio, sin inventar precios, duración, disponibilidad o cobertura.
2. Impacto en modelo de contenido, UX, privacidad, SEO y/o infraestructura registrado.
3. Actualización de ADR cuando cambie arquitectura, proveedor crítico o contrato público.
4. Criterios de aceptación y pruebas enlazadas al ID.
5. Fecha, responsable y evidencia de aprobación registrables en la PR correspondiente.

## Próxima validación comercial

**D-04B:** Juanjo aún requiere número comercial y aviso de salida aprobados. Para VIORA, el product owner aprobó el copy de consulta previa; el número permanece fuera del repositorio y se configurará por environment, y el enlace solo se genera con E.164 válido. D-01C y D-02A mantienen pendientes las dos URLs de Cal.com, la revisión de la Location presencial y la duración operativa. Cal.com es fuente de verdad para disponibilidad y citas. D-02B y D-03 siguen pendientes; no inferir duración del tatuador, señas ni políticas de cancelación.
# VIORA — bloqueos de release PR-17

- Identidad legal del prestador como persona física (CUIL), email de privacidad/reclamos y domicilio legal si corresponde.
- Datos comerciales que deban informarse antes de contratar: precio y condiciones aplicables; validar con asesoría jurídica. No inventar señas, medios de pago, cancelaciones, reintegros ni duración.
- Configurar las dos URLs Cal.com, aprobar ambas agendas, Location presencial y duración; completar revisión focal antes de publicar.
- Confirmar suficiencia jurídica del flujo estático de arrepentimiento por email y completar contacto real.
- URL real de producción (incluido `pages.dev` tras primer deploy) antes de definir `VIORA_PUBLIC_SITE_URL` y `JUANJO_PUBLIC_SITE_URL` por separado.
