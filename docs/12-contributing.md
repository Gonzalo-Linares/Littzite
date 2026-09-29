# Convenciones de colaboración y PR

## Branches y cambios

- `main` como rama estable. Desarrollar cambios en ramas de alcance pequeño y PR revisables; primer PR exclusivamente documental, sin merge automático.
- Plantilla inicial de PR: objetivo, alcance/no alcance, decisiones afectadas, pruebas realizadas con resultados reales, impactos SEO/UX/seguridad, documentación actualizada y riesgos conocidos.
- Commits descriptivos; preferir squash en PR pequeños una vez definida la preferencia del equipo. No imponer una estrategia compleja de release en dos aplicaciones estáticas.
- Cambiar un contrato común obliga a comprobar ambas apps; los scripts y la CI deben expresarlo explícitamente.

## Gobernanza de arquitectura

- Paquetes compartidos sin código ni datos específicos de un cliente. No usar flags ocultos por nombre comercial o `siteId` para cambiar comportamiento.
- Abstraer solo cuando exista responsabilidad común real. Un componente visual exclusivo puede vivir en `apps/<sitio>` y migrar a `packages/` cuando su reutilización sea demostrable.
- Zod es la fuente de verdad de los tipos inferibles. Evitar interfaces duplicadas que evolucionen separadas.
- Las ADR conservan motivación, alternativas, decisión, consecuencias y estado; no borrar decisiones previas al cambiarlas, crear ADR que las reemplace.
- Codex no deberá afirmar un resultado de tests que no haya ejecutado y deberá pedir definición si un requisito afecta privacidad, pagos o contratos públicos sin respuesta.

## Control de calidad inicial

1. `format`, `lint`, `typecheck`, pruebas del paquete afectado y builds relevantes una vez exista código.
2. Preview manual en móvil/escritorio; navegación, teclado, contraste, estado sin JavaScript y fallback de reserva.
3. Inspección de SEO local y configuración específica de cada app.
4. Confirmación de no incorporar dependencias, imágenes ni scripts de terceros innecesarios.
5. Revisión de cambios en diagramas y ADR cuando cambie la arquitectura real.
