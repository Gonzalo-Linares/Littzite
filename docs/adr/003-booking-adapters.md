# ADR-003 — Acciones comerciales tipadas y adaptadores externos de reservas

**Estado:** **Aceptada** para desacoplamiento, estética de una profesional y doble recorrido del tatuador. **Pendiente** proveedor, canal de presupuesto, señas y reglas comerciales. **Fecha de actualización:** 2026-09-29.

## Contexto

Se confirmó una sola profesional en estética con tratamientos de duración fija; en el tatuador, trabajos pequeños con reserva directa y grandes sujetos a presupuesto previo. Un único `bookingMode` por servicio era insuficiente para mostrar ambos CTA en una misma ficha. Las agendas externas y los canales de presupuesto tienen reglas y capacidades diferentes, y no deben filtrarse dentro de los componentes de marketing.

## Decisión

- Cada `Service` puede declarar `ServiceAction[]`, una unión discriminada: `direct-booking`, `quote-request`, `contact`. Cada acción tiene ID y CTA propios; los destinos se resuelven mediante referencias validadas (`BookingTarget`, `QuoteTarget`).
- El adaptador de agenda transforma un `BookingTarget` confirmado en una experiencia soportada: enlace HTTPS obligatorio y embed **solo si** el proveedor seleccionado lo permite. No imponer una API universal que oculte diferencias de capacidades.
- `quote-request` nunca equivale a reserva confirmada. El canal se selecciona y valida bajo D-04. No crear backend de archivos o formularios hasta tener requisitos y aprobación de privacidad.
- La disponibilidad, confirmación, cancelación y, si corresponde, el cobro pertenecen al proveedor externo, no al frontend de Littzite.
- Una sola implementación compartida de CTA/resolución permite recorridos distintos por datos y composición sin `if(siteId)`.

## Consecuencias

- No hay calendario, citas ni pagos almacenados en v1. Las métricas de clics no prueban citas.
- Para la estética, exigir duración real validada por tratamiento antes de activar reservas públicas.
- Para el tatuador, no inventar tamaño máximo, duración, número de artistas, formulario ni canal de presupuesto.
- La elección de Calendly, SimplyBook.me u otro proveedor requiere comparar casos reales y documentar configuración y fallback antes de agregar el adaptador específico. No implementar preventivamente todos.
- La política de señas, reprogramación y cancelación sigue en D-03; su ausencia de definición **no significa que sea gratuita o que no exista**.

## Alternativas consideradas

1. Duplicar rutas y componentes entre apps: descartado por divergencia y mantenimiento.
2. `bookingMode` único por `Service`: reemplazado porque una ficha del tatuador puede ofrecer dos acciones diferentes.
3. Agenda propia o SaaS multi-tenant: fuera de alcance v1 por complejidad, seguridad y operaciones injustificadas.
4. Adaptador genérico con todos los proveedores por adelantado: descartado; se implementa un adaptador real solo tras confirmar proveedor.

## Validación prevista

- Test de una página de tatuajes con dos acciones independientes sin duplicar `Service` ni usar `siteId`.
- Tests Zod e integridad: `targetId` existente y del tipo correcto, URL HTTPS, lista permitida de hosts y fallback.
- Una reserva de estética con duración positiva validada, destino externo correcto y fallback cuando no carga embed.
- El intento de habilitar seña, flujo de archivos o confirmación propia exige requisitos aprobados, revisión de seguridad y ADR nueva si modifica el alcance.
