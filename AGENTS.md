# Littzite — reglas de trabajo para Codex y otros asistentes

Leer `README.md`, `docs/01-vision-scope.md`, `docs/02-architecture.md`, `docs/09-open-decisions.md`, `docs/13-booking-specification.md` y ADR relevantes antes de proponer cualquier implementación. La documentación v0.4 describe acuerdos, propuestas y decisiones pendientes; **no** asumir que lo pendiente fue aprobado.

## Invariantes

1. Monorepo con apps independientes. `apps/*` solo consume contratos públicos de `packages/*`. Sin imports cruzados entre apps ni dependencias de packages a apps.
2. Sin hardcode comercial en packages compartidos: nombre, ubicación, teléfonos, logos, calendario, perfil social, copy, SEO y colores se cargan desde la configuración/colecciones de cada app.
3. Sin `if siteId === ...` ni `switch` por cliente en la lógica compartida; las diferencias se expresan mediante datos tipados, variantes justificadas o componentes específicos de app.
4. Contratos validados con Zod y TypeScript estricto; sin `any` salvo justificación localizada y testeada. Una sola fuente de verdad para el mismo dato.
5. Astro con salida estática por defecto. No CMS, API propia, DB, autenticación ni motor de reservas sin ADR y requisito real; no instalar librerías especulativas.
6. El proveedor externo es fuente de verdad de horarios y citas. El widget tiene fallback a enlace validado. No tomar eventos de navegador como prueba de pago o turno confirmado. La estética tiene una profesional y duraciones fijas; el tatuador requiere reserva directa para trabajos pequeños y presupuesto previo para grandes. No asumir tamaño máximo, duración ni señas sin validación. D-04: presupuesto de tatuaje grande por WhatsApp (solo texto en v1); sin formulario ni cargas de archivos propias. El número real todavía debe verificarse.
7. Cada aplicación tiene dominio, canonical, sitemap, medios, analítica, deployment, credenciales y perfiles comerciales propios. Ninguna clave secreta en HTML/JS público.
8. SEO local útil, contenido real, accesibilidad, velocidad móvil, privacidad y licencias de activos como requisitos de diseño.
9. AstroWind solo como fuente selectiva luego de auditoría de código, dependencias y licencias, conservando atribución exigida.
10. Un servicio puede presentar varias `ServiceAction` tipadas (reserva directa, presupuesto, contacto) sin copiar fichas ni crear condicionales por app. `ServiceAction`, `BookingTarget` y `QuoteTarget` son conceptos distintos; los targets externos nunca están incrustados en componentes genéricos.

## Antes de cada PR

- Describir objetivo, alcance y no alcance. Identificar contratos modificados y decisiones abiertas relacionadas.
- Si falta información relevante de proveedor de reservas, reglas comerciales, señas, número real y texto aprobado para WhatsApp, privacidad, dominios o edición de contenido: **detener únicamente el flujo afectado y preguntar**. La arquitectura transversal aprobada puede continuar. No rellenar con supuestos silenciosos.
- Testear el comportamiento modificado; si cambia `packages/*`, revisar y ejecutar gates de ambas apps.
- No duplicar funciones existentes ni copiar componentes enteros para cambios cosméticos. Verificar que las abstracciones no crean dependencias circulares.
- Actualizar diagramas/ADR/guías si cambian responsabilidades. Informar comandos y resultados reales, sin atribuirse checks no ejecutados.

## Orden previsto

PR-00: documentación y aprobación; PR-01: scaffold mínimo pnpm + Astro + TypeScript + CI; PR-02: contratos Zod y sistema de diseño; PR posteriores: SEO/booking adapters y sitios reales. No mezclar arquitectura y diseño visual definitivo en el primer PR.
