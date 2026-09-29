# Visión, límites y requisitos — v0.4

## Objetivo de negocio

Dos webs en San Juan, Argentina: una estética integral y un estudio de tatuajes. Su objetivo principal es captar búsquedas locales y convertir visitas en contactos, solicitudes de presupuesto o reservas. No es una suite de gestión de negocios ni un SaaS multi-tenant en la versión inicial.

## Capacidades v1 compartidas

- Home, catálogo, página individual de servicio/estilo cuando exista contenido original suficiente, acerca del negocio, galería, preguntas frecuentes, contacto, ubicación y páginas legales.
- Navegación accesible y consistente entre rutas; CTA por contexto (turno, consulta, presupuesto).
- Imágenes responsive y optimizadas; testimonios publicados solo con consentimiento.
- SEO técnico: HTML de contenido generado en build, metadatos únicos, canonical, sitemap, Open Graph y `LocalBusiness` veraz.
- Analítica mínima: visita desde buscador, clic en CTA y evento de reserva reportado por proveedor cuando exista y cuando el seguimiento esté habilitado conforme a privacidad.
- Configuración por negocio: marca, tokens, locales, horarios, servicios, CTA, perfiles sociales, mapas, proveedor de agenda, páginas, menú y footer.
- Contenido y configuración con validación estática en el build y chequeos de unicidad de slugs.

## Diferencias por negocio

**Estética (flujo confirmado):** una sola profesional; catálogo de tratamientos de duración fija. Cada duración concreta, horarios y proveedor externo requieren validación de la profesional. Precio público y posibilidad de seña no están confirmados.

**Tatuador (flujo confirmado):** la misma página o ficha puede presentar dos acciones independientes: reservar directamente un trabajo pequeño y solicitar presupuesto para uno grande. Portafolio por estilo/trabajo. El canal de presupuesto de trabajos grandes se confirmó como **WhatsApp directo, inicialmente solo texto**. El umbral entre pequeño y grande, los tiempos de agenda, el número comercial verificado y la necesidad de señas NO están confirmados.

## Fuera de alcance v1

- Panel de administración propio, roles, autenticación, CRM, historial de pacientes/clientes, agenda propia, procesamiento propio de pagos, multi-tenant compartido y motor visual de páginas.
- Gestión de fotografías privadas o información sensible sobre salud. Las referencias para presupuesto requieren un proceso de privacidad específico si se decide recibir archivos.
- Garantías de ranking en Google o resultados económicos no controlables.

## Requisitos no funcionales iniciales

| Área | Criterio propuesto |
| --- | --- |
| Mantenibilidad | No hay lógica duplicada de contacto, SEO, CTA y reserva en dos apps. |
| Robustez | Un fallo/ausencia del widget externo no bloquea la web: se muestra enlace alternativo. |
| Seguridad | Sin secretos en frontend; validación de esquemas; sin formularios propios sin mitigación de spam. |
| Accesibilidad | Teclado, foco visible, contraste AA donde aplica, `prefers-reduced-motion`, alternativas de texto. |
| Rendimiento | Objetivos CWV en móviles: LCP <=2,5 s, INP <=200 ms, CLS <=0,1; medir con datos reales. |
| SEO | Páginas de servicio únicas; canonical y sitemap correctos por dominio; datos estructurados verificables. |
| Operación | Build, pruebas y despliegue aislados por aplicación. |
| Privacidad | Trazabilidad del consentimiento cuando corresponda, recopilación mínima, proveedores documentados. |

## Preguntas de negocio pendientes (no bloquean los documentos)

- Estética: una profesional y duraciones fijas confirmadas; faltan duración concreta por tratamiento, horarios y local. Tatuador: cantidad de artistas y reglas concretas por tipo de trabajo por confirmar.
- ¿Necesitan señas, pagos en ARS, reprogramación y recordatorios? ¿Qué calendario utilizan hoy?
- ¿Quién actualiza contenido y con qué frecuencia? ¿Qué fotografías tienen permiso de publicar?
- WhatsApp fue elegido como canal de presupuestos para trabajos grandes, inicialmente solo texto. Falta verificar el número comercial, aprobar el texto de apertura y el aviso de salida a un tercero. No crear formulario, subida de fotos ni almacenamiento propio.
- ¿Ambos negocios tendrán su propio dominio, cuentas de agenda y accesos administrativos? (recomendado).
