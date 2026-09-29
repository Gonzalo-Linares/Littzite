# Plan de implementación y Definition of Done — v0.5

## Fase 0 — Documentación y decisiones

- Aprobar objetivo, dos recorridos comerciales y exclusiones explícitas de v1.
- Aprobar ADR-001 y ADR-004; revisar ADR-002, ADR-003 y ADR-005 y decidir los puntos abiertos necesarios antes de integrar reservas reales.
- Registrar las respuestas ya confirmadas: estética con una profesional y tratamientos de duración fija; tatuajes pequeños de reserva directa y grandes por presupuesto. Confirmar D-04 (WhatsApp directo para presupuestos grandes, inicialmente solo texto). Mantener pendientes duraciones específicas, alcance del tatuador, proveedor de agenda, señas, número comercial real y editores.
- D-08B aprobada: repositorio público sin licencia de reutilización para el código original. Adoptar la [política de terceros](15-ip-license-policy.md) y ADR-006; no generar automáticamente un `LICENSE` open-source.
- Auditar AstroWind selectivamente: licencia MIT del código en la revisión concreta, avisos obligatorios, recursos licenciados por separado, compatibilidad Astro/Tailwind, accesibilidad y dependencias. Documentar qué se copia, desde dónde y bajo qué autorización.
- D-09 aprobada: ambos sitios iniciales usan solo `es-AR`, sin traducciones ni prefijos de idioma; consultar ADR-007.
- Elegir proveedor de reservas **por negocio**, según pruebas de uso reales.

**Salida:** PR documental sin código de producto; decisiones acordadas separadas de propuestas y pendientes con responsable.

## Fase 1 — Scaffold, contratos y catálogo visual

- Monorepo pnpm, Astro/TypeScript estricto, Tailwind, lockfile y dos apps mínimas.
- `content-schema`: Zod `SiteConfig`, `Service`, `ServiceAction[]`, `BookingTarget`, `QuoteTarget`, `PageSection` y `SeoMetadata`; integridad de referencias cruzadas.
- `ui`: tokens, buttons, layout, accesibilidad y responsive.
- `seo`: canonical, metadatos, JSON-LD, sitemap y checks de integridad; consumo de `SiteConfig.defaultLocale` para idioma de página y metadatos, sin i18n de múltiples idiomas.
- `booking`: resolver acciones y validar enlaces/fallback. Implementar embed específico **solo después** de elegir el proveedor real de cada negocio.
- CI: formato, lint, typecheck y compilación de ambas apps.

**Salida:** dos sitios de prueba diferentes compartiendo componentes y pasando CI.

## Fase 2 — Estética (primer caso real)

- Recopilar contenido original, identidad y fotografías autorizadas.
- Implementar home + fichas de tratamiento + contacto + páginas legales.
- Confirmar duración real por tratamiento y probar proveedor real desde móvil con fallback y las políticas efectivamente contratadas; señas o reprogramación solo si se aprueban.
- SEO local, Search Console y Perfil de Empresa; medir CTA sin confundir clic con cita.

**Salida:** sitio productivo con contenido y reserva reales.

## Fase 3 — Tatuador (validación de reutilización)

- Identidad editorial distinta y galería protagonista.
- Mostrar CTA separados para trabajos pequeños (reserva) y grandes (presupuesto). Implementar el CTA de presupuesto por WhatsApp solo tras verificar el número comercial, aprobar el mensaje inicial y el aviso de tercero; no agregar formulario ni subida de archivos propios. No asumir consulta intermedia obligatoria.
- Confirmar ausencia de hacks por `siteId` en paquetes compartidos.
- Ajustar contratos solo mediante ADR si aparecen necesidades verdaderamente nuevas.

**Salida:** segundo sitio productivo sin copiar y pegar infraestructura ni reglas.

## Fase 4 — Operación y portfolio

- Capturas y casos de estudio, documentación de decisiones y medición honesta de resultados.
- Automatización de actualizaciones de contenido y revisión de enlaces.
- Evaluación retrospectiva antes de sumar CMS, pagos, tercer cliente o multi-tenant.

## Definition of Done de cada PR

1. Alcance acotado y criterios comprobables.
2. Sin imports entre apps; sin secrets; sin URLs/telefonía/identidad global hardcodeados en paquetes compartidos.
3. Validación, types y tests relevantes; ambas apps pasan cuando cambia un paquete compartido.
4. Componentes con estados vacíos, errores, responsive y teclado verificados.
5. Cambios en rutas, SEO o contratos acompañados por pruebas y docs/ADR.
6. Preview revisada antes de merge; despliegue y rollback independientes comprobables.
7. Toda adición de código, tipografías, imágenes o plantillas de terceros tiene procedencia, licencia, autoría y permisos auditados; los avisos de copyright exigibles se conservan. Contribuciones externas sujetas a autorización antes del merge.
