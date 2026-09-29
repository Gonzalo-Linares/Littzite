# Design system, parametrización y armonía — v0.6

## Principio

**Compartir la gramática visual, no clonar la estética de las dos marcas.** Cada negocio tendrá fuentes, colores, ritmo, composición e imágenes propios, pero usará los mismos componentes accesibles, espacios semánticos, estados interactivos y reglas de responsive.

## Implementado en PR-02

`ThemeConfig` valida seis colores hexadecimales semánticos (`surface`, `text`, `accent`, `accentText`, `border`, `focus`). Cada app demo aporta valores provisionales propios. `BaseLayout` los expone como variables CSS, usa el locale de `SiteConfig` e incluye enlace para saltar al contenido. `Container` y `Link` son compartidos y se usan en ambas homes. El enlace conserva foco visible y un destino interno real. La identidad final, tipografías de marca y secciones comerciales siguen pendientes. No se agregó Tailwind: estas reglas pequeñas no justifican la dependencia todavía; ADR-002 sigue describiendo la opción elegida para v1 cuando haya estilos y contenido reales.

## Implementado en PR-03 (prototipos editoriales)

Se incorpora `packages/sections` porque **dos secciones reales del prototipo** (`LandingHero` y `FeatureGrid`) son consumidas por ambas apps, sin condicionales por identidad comercial. `packages/ui` incorpora `SiteHeader` y `SiteFooter`, también compartidos, y conserva una única hoja de CSS para primitives/tokens. Las secciones tienen variantes explícitas `serene` y `graphic`: estética las usa en una composición serena y tatuajes en una editorial de alto contraste. Toda la ilustración del hero es **CSS original**, sin fuentes, fotos o scripts externos.

Se agrega `feature-grid` a `PageSection`, con tarjetas y copy validados por Zod. Los dos sitios siguen como prototipos `noindex`; sus títulos, paletas, textos y elementos gráficos **no son marcas ni contenido comercial aprobado**. El contenido final, imágenes originales y agenda se agregan en PR separados.

La estructura usa componentes Astro estáticos, puntos de ruptura responsivos, enlace de salto, navegación con etiquetas, estados de foco y `prefers-reduced-motion`. Tailwind y AstroWind siguen fuera de este PR, sin impedir su evaluación futura. Una sección de catálogo, una galería o un CTA de reserva no se implementan sin contenido y destino real.

## Identidad aprobada de VIORA (PR-04 en revisión)

La estética deja de tener un tema meramente ilustrativo y adopta el manual de marca aportado por su titular: marfil, ciruela, rosa, rosa suave y tinta; salvia es opcional. El tema semántico común de seis colores sigue estable y la paleta extendida, la tipografía y la composición específicas se definen en `apps/estetica/src/styles/viora.css`. Se reutilizan `SiteHeader`, `SiteFooter` y `LandingHero` mediante slots de marca, sin enseñar a los paquetes comunes el nombre del negocio. Cuatro líneas editoriales proceden del manual; no se declaran servicios reservables activos sin duración, precios o disponibilidad confirmados. Ver [guía de implementación](16-viora-brand.md) y ADR-010.

## Tokens semánticos

| Nivel | Ejemplos | Responsable |
| --- | --- | --- |
| Base | escala de spacing, radios, tipografía, breakpoints | `packages/ui` |
| Semántico | `--color-surface`, `--color-text`, `--color-accent`, `--color-border`, `--focus-ring` | contrato `ThemeConfig` |
| Marca | valores concretos por app: estética / tatuador | `apps/*/site.config.ts` |
| Variante visual | `editorial`, `split`, `minimal`, `gallery-first` | `packages/sections` |
| Contenido | título, imagen, CTA, testimonios, orden | Content Collections de app |

No usar strings de nombres de clientes para decidir estilos dentro de componentes comunes. Preferir props explícitas (`variant`) y CSS custom properties. No permitir variantes ilimitadas si todavía no existe una necesidad real.

## Catálogo compartido inicial

- `Button`, `Link`, `Container`, `SectionHeading`, `ResponsiveImage`, `Badge`, `Accordion`, `Dialog`, `FormField` si realmente hay formularios propios.
- `Header`, `Footer`, `Hero`, `ServiceGrid`, `ServiceCard`, `ImageGallery`, `FAQSection`, `ContactSection`, `ServiceActions`, `BookingCTA`, `QuoteCTA`, `Testimonials`. Un `ServiceActions` recibe acciones tipadas y no conoce la identidad del negocio.
- Tipos y contratos de sección documentados; `Header` debe consumir el mismo menú tipado y contacto que el `Footer`, sin copiar links.

## Reglas de consistencia

1. Un único componente `Header` y `Footer` por patrón reutilizable, con variantes explícitas si son necesarias; navegación y contacto proceden del `SiteConfig` de la app.
2. Ningún paquete compartido importa imágenes, contenido o configuración de una app.
3. Configurar en datos el orden de secciones cuando la composición sea convencional; usar una página Astro específica cuando el diseño artístico necesite libertad real.
4. Los componentes de servicio no asumen que todos publican precio/duración: campos opcionales tipados. Un mismo servicio puede mostrar varios CTA; reserva y presupuesto consumen un único contrato de `ServiceAction`, con variantes accesibles y semántica propia.
5. Animaciones discretas, desactivables por preferencia de reducción de movimiento.
6. Las galerías usan imágenes con derechos verificados, dimensiones adaptativas, texto alternativo pertinente y carga diferida salvo imagen hero crítica.
7. Añadir Storybook **solo si** la cantidad de componentes/variantes lo justifica; inicialmente, una ruta `__ui` no indexable en entorno de desarrollo basta para revisar variantes visuales.

## Opciones de contenido

**v1:** `SiteConfig` TS + Content Collections (`services`, `pages`, `portfolio`, `testimonials`) y Zod. Un responsable técnico actualiza contenido mediante PR. No introducir un CMS por adelantado.

**Evolución:** si el cliente necesita editar independientemente y con frecuencia, añadir un adaptador de fuente de contenido y evaluar un CMS alojado. No acoplar los componentes al origen del dato.

## Identidad editorial de Juanjo (PR-05, propuesta)

Las capturas aportadas por el propietario orientan una estética gráfica de alto contraste: carbón, marfil y acento coral de **interpretación provisional**, no una nueva marca gráfica aprobada. La cabecera usa wordmark tipográfico de vista previa; el logo circular real se incorporará solamente desde el original autorizado. El hero reutiliza `LandingHero` con un artwork CSS propio en slot de app; las tarjetas mantienen `FeatureGrid`. La grilla de fotografías aún tiene un solo consumidor, por lo que permanece en `apps/tattoo`. Estado vacío sin imágenes inventadas y link al perfil oficial mientras llegan originales. Ver [guía editorial](17-juanjo-web-identity.md).
