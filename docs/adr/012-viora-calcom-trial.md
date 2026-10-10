# ADR-012 — Piloto de Cal.com para VIORA sin activación prematura

**Estado:** selección de Cal.com vigente; el routing operativo se actualiza en PR-21 · **Fecha:** 2026-09-30

## Contexto

VIORA tiene una única profesional, cuatro servicios informativos y un volumen estimado de unos 15 turnos al mes. Los cuatro servicios están modelados como `Service` con fichas estáticas `noindex`. No hay cuenta real, enlaces de evento ni disponibilidad verificados todavía.

## Decisiones explícitas

- Elegir **Cal.com Individual Gratis** para un piloto, solo para VIORA. La profesional controla su cuenta y sus calendarios; Littzite no aloja una agenda ni almacena datos personales de reservas. Esta selección **no aplica automáticamente a Juanjo**.
- Usar una duración inicial de **60 minutos por servicio** como valor editable e independiente en `apps/estetica/src/site.config.ts`. Es una configuración **provisional para pruebas**, no una duración técnica validada: la profesional debe aprobarla por tratamiento y considerar zonas diferentes de depilación.
- La configuración operativa app-local se actualiza en PR-21: `booking-general` se asigna a limpieza facial y masajes; `booking-depilacion-definitiva` solo a depilación definitiva. Las dos URLs se cargan por environment y no se hardcodean ni se commitean.
- Evaluar inicialmente enlaces directos accesibles con fallback HTTPS. Un embed inline o modal opcional requerirá prueba en móvil, carga diferida y revisión de privacidad/terceros. No hace falta API privada, webhooks, backend, DB ni credenciales en la app estática.
- Mantener `noindex` hasta aprobar contenido comercial, ubicación, confirmación de disponibilidad y resto de requisitos de despliegue.

## Pasos de validación externa

1. La profesional abre una cuenta individual propia, conecta el calendario con el que administra conflictos y configura el huso horario `America/Argentina/San_Juan` (si la ubicación profesional se confirma).
2. Crea cuatro tipos de evento (limpieza facial, depilación definitiva, masajes, reiki), con 60 minutos iniciales, ajustables por separado. Opcionalmente ocultos durante las pruebas para que no se listen públicamente.
3. Comprueba en el panel disponibilidad, límites de aviso, cancelación y reprogramación (sin prometer al cliente políticas no aprobadas), correos de notificación y prevención de doble reserva entre tipos de evento.
4. Configura y facilita las dos URLs públicas aprobadas para los targets general y de depilación. No compartir contraseñas, tokens ni claves API.
5. Verificar cada flujo, confirmación efectiva en Cal.com y recepción de notificaciones; confirmar compatibilidad móvil y aviso de tercero antes de publicar.

## Estado operativo actualizado (PR-21)

El código incluye los dos targets y resuelve sus acciones con el paquete `booking`. La ausencia de URLs, datos legales, o aprobaciones mantiene el release bloqueado únicamente cuando `VIORA_PUBLIC_RELEASE=true`; los defaults de preview son placeholders y no son enlaces productivos. La consulta de precio puede salir por WhatsApp si el teléfono E.164 fue configurado o por el Instagram oficial. Reiki permanece sin reserva hasta el siguiente PR de catálogo. La reserva sigue en Cal.com; Littzite no implementa disponibilidad ni confirma citas.

La prueba manual anterior observó `Dónde: Cal Video`. La profesional todavía debe confirmar Location presencial, duración y configuración de las agendas antes del release.

Fuentes del proveedor: [plan Individual](https://cal.com/es/pricing) y [opciones de embed](https://cal.com/embed). Revalidar costos y capacidades antes del lanzamiento.

[Decisiones](../09-open-decisions.md) · [Especificación de reservas](../13-booking-specification.md) · [Issue de piloto](https://github.com/Gonzalo-Linares/Littzite/issues/15)
