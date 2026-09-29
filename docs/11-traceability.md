# Trazabilidad de requisitos y criterios de aceptación

Este documento vincula requisitos y pruebas previstas; no significa que haya código ni tests implementados.

| ID | Requisito | Diseño propietario | Verificación inicial |
|---|---|---|---|
| R-01 | Dos sitios independientes con una base común | `docs/02-architecture.md`, ADR-001 | Prohibir imports entre apps; compilar ambas |
| R-02 | Identidad visual independiente sin lógica por cliente en paquetes | `docs/05-design-system.md`, ADR-004 | Comprobación de props/tokens y revisión visual |
| R-03 | Servicios y páginas parametrizables, sin datos comerciales hardcodeados | `docs/03-domain-model.md` | Zod + tests de integridad de referencias |
| R-04 | SEO local con URLs y metadatos específicos por negocio | `docs/06-quality-operations.md` | Chequeo de canonical, sitemap, JSON-LD, slugs |
| R-05 | Estética: agenda de una profesional con servicios de duración fija; tatuador: reserva directa pequeña y presupuesto grande, sin agenda propia | `docs/03-domain-model.md`, `docs/04-sequences-flows.md`, `docs/13-booking-specification.md`, ADR-003 | Fixtures de ambos recorridos, tests de referencias y fallback; datos comerciales no inventados |
| R-06 | Seguridad y privacidad por construcción | `docs/10-security-threat-model.md` | Análisis de scripts, URLs y pruebas de configuración cruzada |
| R-07 | Despliegues y cuentas separados | `docs/02-architecture.md` | Config aislada y pruebas de build |
| R-08 | Sin código muerto ni dependencias innecesarias en el scaffold | `AGENTS.md`, ADR-005 | Revisar árbol, bundles, auditoría de componentes importados |
| R-09 | Un cambio transversal valida ambos sitios | `docs/04-sequences-flows.md` | CI ejecuta pruebas y builds de ambas apps ante cambios comunes |
| R-10 | Documentación sincronizada con cambios importantes | `docs/12-contributing.md` | Checklist PR y actualización ADR/diagramas |
| R-11 | Una misma ficha puede exponer dos acciones sin condicionales por cliente | `docs/03-domain-model.md`, ADR-003 | Test de `ServiceAction[]`, tipos Zod, orden y labels de CTA |
| R-12 | Ni señas ni presupuestos con archivos se implementan sin aprobación | `docs/09-open-decisions.md`, `docs/10-security-threat-model.md` | Revisión de flags, terceros, formularios y datos recogidos |

## Gates del PR documental

- README y links relativos correctos, Mermaid cerrado correctamente, ADR con estado y pendientes explícitos.
- No introducir código, credenciales, datos inventados de clientes ni promesas de proveedores no seleccionados.
- Revisión humana y aprobación de decisiones abiertas antes de integrar sistemas reales.
