# Littzite — reglas de trabajo para Codex y otros asistentes

Leer `README.md`, `docs/01-vision-scope.md`, `docs/02-architecture.md`, `docs/09-open-decisions.md`, `docs/13-booking-specification.md`, `docs/15-ip-license-policy.md` y ADR relevantes antes de proponer cualquier implementación. La documentación v0.5 describe acuerdos, propuestas y decisiones pendientes; **no** asumir que lo pendiente fue aprobado.

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
11. D-08B: el repositorio es público, pero el código original de Littzite **no tiene licencia de reutilización**. No crear `LICENSE` con MIT, GPL, Apache, Creative Commons ni otra licencia sin decisión nueva. Identificar el código y assets de terceros, conservar sus avisos, registrar origen, versión, rutas y obligaciones antes de copiarlos. No asumir que una imagen, fuente, marca o contribución externa pasa a ser propiedad de Littzite.
12. D-09: el contenido inicial de ambas apps es exclusivamente español de Argentina (`es-AR`); `SiteConfig.defaultLocale` se valida en el esquema común y se consume en SEO, `<html lang>` y formato regional. Sin rutas `/es/`, selector de idiomas, catálogos de traducción ni `hreflang` para un único idioma. No hardcodear `lang` o formatos contradictorios en múltiples componentes; cualquier expansión requiere ADR.

## Antes de cada PR

- Describir objetivo, alcance y no alcance. Identificar contratos modificados y decisiones abiertas relacionadas.
- Si falta información relevante de proveedor de reservas, reglas comerciales, señas, número real y texto aprobado para WhatsApp, privacidad, dominios o edición de contenido: **detener únicamente el flujo afectado y preguntar**. La arquitectura transversal aprobada puede continuar. No rellenar con supuestos silenciosos.
- Testear el comportamiento modificado; si cambia `packages/*`, revisar y ejecutar gates de ambas apps.
- No duplicar funciones existentes ni copiar componentes enteros para cambios cosméticos. Verificar que las abstracciones no crean dependencias circulares.
- Actualizar diagramas/ADR/guías si cambian responsabilidades. Informar comandos y resultados reales, sin atribuirse checks no ejecutados.
- Si se incorpora código de AstroWind u otro tercero, verificar la licencia efectiva del commit importado, archivar los avisos requeridos en `THIRD_PARTY_NOTICES.md` cuando corresponda y evitar recursos gráficos no autorizados. No aceptar contribuciones externas sin permiso escrito suficiente para el uso previsto.

## Orden previsto

PR-00: documentación y aprobación; PR-01: scaffold mínimo pnpm + Astro + TypeScript + CI; PR-02: contratos Zod y sistema de diseño; PR posteriores: SEO/booking adapters y sitios reales. No mezclar arquitectura y diseño visual definitivo en el primer PR.

## Scaffold PR-01

El grafo implementado inicialmente es `apps/{estetica,tattoo} -> packages/{content-schema,ui}` y `packages/ui -> packages/content-schema`. `content-schema` solo valida `SiteConfig.defaultLocale` y `ui` contiene un layout mínimo compartido. Los paquetes `sections`, `seo` y `booking` del diagrama conceptual aún no existen; crearlos cuando tengan interfaces consumidas. Ejecutar `pnpm check`, `pnpm build` y `pnpm test` para verificar ambas apps; los comandos por app están en cada `package.json`.
