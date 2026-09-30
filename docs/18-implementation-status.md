# Estado de implementación de Littzite — 30/09/2026

Esta matriz diferencia código implementado, decisiones explícitas para pruebas y capacidades futuras. Los diagramas de arquitectura y dominio contienen objetivos conceptuales y no reemplazan esta comprobación del árbol.

| Dominio | Código implementado | Piloto aprobado / pendiente |
| --- | --- | --- |
| Aplicaciones | Dos sitios Astro estáticos, locales `es-AR`, `noindex`; paquetes `content-schema`, `ui`, `sections` y `booking` | Hosting, dominios y SEO productivo pendientes |
| VIORA | Identidad y tres logos oficiales; cuatro servicios, catálogo y rutas de detalle; layout local y CSS autónomo | Cuatro defaults independientes de 60 min para prueba Cal.com. Sin cuenta, enlaces ni reservas reales todavía |
| Juanjo | Wordmark provisional, secciones compartidas y galería tipada en estado vacío | Espera fotografías y logo original, número y texto WhatsApp, proveedor para piezas pequeñas |
| Contratos y reservas | Zod y referencias en `content-schema`; `booking` aplica el policy gate fail-closed para destinos `cal-com`. Configs de ambas apps invocan la validación | No hay resolución de acciones, destinos configurados, backend, API, secretos ni SDK externo; solo está admitido `cal-com` |
| Calidad | Tests de contratos/fronteras/portfolio/enlaces, Astro check, builds, smokes y comprobación de enlaces internos posterior al build | GitHub Actions desactivado por decisión del propietario. Lint/format, E2E/axe, Lighthouse y reservas reales requieren trabajos posteriores |
| Publicación | Páginas no indexables y precauciones ante terceros | Legal, privacidad, canonical, metadescripciones, OG, sitemap, JSON-LD y tests móviles reales aún pendientes |

Los diagramas de [arquitectura](02-architecture.md) y [dominio](03-domain-model.md) distinguen el objetivo conceptual. Las decisiones comerciales figuran en [el registro](09-open-decisions.md). Los hallazgos y tareas de calidad están en [AUDIT-01 #17](https://github.com/Gonzalo-Linares/Littzite/issues/17).
