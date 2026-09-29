# Littzite — arquitectura fundacional

**Estado:** v0.4, arquitectura documental en revisión. **Fecha:** 2026-09-28/29.  
**Producto:** plataforma de creación de sitios comerciales modulares; primeros casos: estética integral y estudio de tatuajes en San Juan, Argentina.  
**Propósito:** captación orgánica local, diferenciación visual, contacto y reservas/solicitudes mediante proveedores externos.

> Este paquete contiene diseño y decisiones documentadas, **no** código implementado ni aprobación automática de todos los puntos. Las actualizaciones documentales se revisan en PR antes de integrarse en `main`.

## Acuerdos de alcance

- Un monorepo con **dos apps Astro independientes** y **paquetes compartidos**; TypeScript estricto y configuración tipada; despliegue, dominio, contenido y credenciales separados.
- Modificar una capacidad común una sola vez, consumirla desde ambos sitios y validarla en ambas apps; evitar hardcodear identidad comercial dentro de los paquetes.
- Cada app tiene identidad y páginas propias. No crear una megatemplate con condicionales por cliente, ni un SaaS multi-tenant en v1.
- Contenido inicial gestionado como archivos versionados en Git; sin CMS, backend ni base de datos propios para la primera versión, salvo un requisito aprobado que lo justifique.
- Reservas desacopladas detrás de acciones tipadas por servicio: **estética con una profesional y tratamientos de duración fija**; **tatuajes pequeños con reserva directa y grandes mediante solicitud de presupuesto**. El proveedor de agenda por negocio y las señas siguen pendientes; **D-04 aprobada**: presupuestos de tatuajes grandes por WhatsApp, inicialmente solo texto, sin formulario ni subida de imágenes propios. No desarrollar agenda propia.
- Reutilización selectiva de AstroWind solo luego de auditar código, versión y licencias independientes de sus recursos.
- **D-08B acordada:** repositorio público, **sin licencia de reutilización para el código original de Littzite**. Cada dependencia, fragmento de plantilla o asset de terceros conserva su licencia o autorización específica; ver [política de propiedad intelectual](docs/15-ip-license-policy.md) y [ADR-006](docs/adr/006-public-rights-reserved.md).

## Índice

1. [Visión, alcance y requisitos](docs/01-vision-scope.md)
2. [Arquitectura lógica, contenedores y despliegues](docs/02-architecture.md)
3. [Dominio, clases y ERE conceptual](docs/03-domain-model.md)
4. [Secuencias y flujos](docs/04-sequences-flows.md)
5. [Sistema de diseño y parametrización](docs/05-design-system.md)
6. [Calidad, SEO, seguridad y operación](docs/06-quality-operations.md)
7. [Roadmap y Definition of Done](docs/07-implementation-roadmap.md)
8. [Referencias técnicas](docs/08-references.md)
9. [Registro de decisiones acordadas y pendientes](docs/09-open-decisions.md)
10. [Modelo de amenazas y límites de confianza](docs/10-security-threat-model.md)
11. [Trazabilidad y criterios de aceptación](docs/11-traceability.md)
12. [Contribución y estrategia de PR](docs/12-contributing.md)
13. [Especificación funcional del módulo de reservas](docs/13-booking-specification.md)
14. [Cómo visualizar los diagramas](docs/14-diagram-guide.md)
15. [Política de propiedad intelectual, terceros y contribuciones](docs/15-ip-license-policy.md)
16. [Registros de decisión arquitectónica — ADR](docs/adr/)
17. [Instrucciones para agentes de código](AGENTS.md)

## Condiciones de uso del repositorio

**Littzite es público y no concede una licencia de reutilización de su código original.** Se reserva el derecho de autor conforme a la normativa aplicable, sin perjuicio de los permisos y límites derivados de los Términos de GitHub y la legislación vigente. Los componentes de terceros (incluido cualquier código de AstroWind efectivamente incorporado en el futuro) conservan **sus propias licencias y avisos**. No asumir que el contenido, las marcas, las fotografías o los diseños de clientes están autorizados para reutilización. Ver [política detallada](docs/15-ip-license-policy.md).

## Estados de decisión

- **Acordada**: decidida explícitamente en la conversación; cambiarla exige ADR y revisión.
- **Propuesta**: planteada técnicamente, pendiente de ratificación, prueba o validación de costes.
- **Pendiente**: no seleccionar proveedor, política comercial, flujo o integración sin información del negocio.

**Orden de trabajo:** revisar la documentación y las decisiones aún bloqueantes → PR de scaffold mínimo → contratos Zod → primeras secciones compartidas → estética → tatuador. Los flujos confirmados se pueden modelar ya; no implementar un proveedor ni cobros hasta validarlos. No agregar código productivo en el PR documental.
