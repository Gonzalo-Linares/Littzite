# Estado de implementación de Littzite — 30/09/2026

Esta matriz diferencia código implementado, decisiones explícitas para pruebas y capacidades futuras. Los diagramas de arquitectura y dominio contienen objetivos conceptuales y no reemplazan esta comprobación del árbol.

| Dominio | Código implementado | Piloto aprobado / pendiente |
| --- | --- | --- |
| Aplicaciones | Dos sitios Astro estáticos, locales `es-AR`, `noindex`; cuatro paquetes: `content-schema`, `ui`, `sections` y `booking` | Hosting, dominios y SEO de lanzamiento pendientes |
| VIORA | Identidad y tres logos oficiales; home hub, `/servicios/`, cuatro fichas, `/viora/`, `/contacto/`, `/reservar/`; layout local, CTAs compartidos, visual storytelling y mapa Google opcional por embed. El enlace de indicaciones a Google Maps está confirmado y activo; el embed interactivo sigue opcional | Dirección textual, redes, horarios, embed Google Maps y cuatro URLs de agenda reales pendientes. Sin reservas reales todavía; `/reservar/` muestra disponibilidad en preparación |
| Juanjo | Wordmark provisional, secciones compartidas y galería tipada en estado vacío | Espera fotografías y logo original, número y texto WhatsApp, proveedor para piezas pequeñas |
| Contratos y reservas | Zod y referencias en `content-schema`; `booking` aplica una policy `cal-com` compartida por validación y resolución directa; `ui` presenta acciones neutrales validadas | Ninguna configuración real invoca el resolver; sin destinos configurados, backend, API externa, secretos ni SDK; solo está admitido `cal-com` |
| Calidad | Baseline local: ESLint, Prettier, tests de contratos/fronteras/portfolio/enlaces, Astro check, builds, html-validate del HTML compilado y smokes/enlaces internos posteriores al build; `pnpm quality` ejecuta los gates en orden | GitHub Actions continúa desactivado por decisión del propietario. E2E/axe, Lighthouse y reservas reales siguen pendientes |
| Metadata preview | `Page.seo` tipado (`title`, `description`), render común en `BaseLayout`, homes de ambas apps y metadata derivada en las cuatro fichas VIORA; `noindex, nofollow` | Canonical, sitemap, `robots.txt` productivo, JSON-LD, Open Graph, dominios, Search Console y SEO de lanzamiento |
| UI configurable | `SiteConfig.iconHref` opcional y local; VIORA usa un logo oficial existente; Juanjo no configura icono. Motion CSS progresivo con reduced motion y navegación MPA | Identidad/logo final de Juanjo; optimización de iconos para publicación |
| Publicación | Páginas no indexables y precauciones ante terceros | Legal, privacidad, despliegue y tests móviles reales aún pendientes |

Los diagramas de [arquitectura](02-architecture.md) y [dominio](03-domain-model.md) distinguen el objetivo conceptual. Las decisiones comerciales figuran en [el registro](09-open-decisions.md). Los hallazgos y tareas de calidad están en [AUDIT-01 #17](https://github.com/Gonzalo-Linares/Littzite/issues/17).
