# Design system, parametrización y armonía — v0.6

## Principio

**Compartir la gramática visual, no clonar la estética de las dos marcas.** Cada negocio tendrá fuentes, colores, ritmo, composición e imágenes propios, pero usará los mismos componentes accesibles, espacios semánticos, estados interactivos y reglas de responsive.

## Implementado en PR-02

`ThemeConfig` valida seis colores hexadecimales semánticos y mínimos de contraste (cuerpo y texto de acento 4,5:1; foco sobre superficie 3:1) (`surface`, `text`, `accent`, `accentText`, `border`, `focus`). VIORA utiliza su paleta oficial y Juanjo un tema editorial provisional que no reemplaza su logotipo auténtico. `BaseLayout` los expone como variables CSS, usa el locale de `SiteConfig` e incluye enlace para saltar al contenido. `Container` y `Link` son compartidos y se usan en ambas homes. El enlace conserva foco visible y un destino interno real. La identidad VIORA ya está integrada; la identidad gráfica original y las fotografías de Juanjo, junto con los datos comerciales definitivos de ambas apps, siguen pendientes. No se agregó Tailwind: estas reglas pequeñas no justifican la dependencia todavía; ADR-002 sigue describiendo la opción elegida para v1 cuando haya estilos y contenido reales.

## Implementado en PR-03 (prototipos editoriales)

Se incorpora `packages/sections` porque **dos secciones reales del prototipo** (`LandingHero` y `FeatureGrid`) son consumidas por ambas apps, sin condicionales por identidad comercial. `packages/ui` incorpora `SiteHeader` y `SiteFooter`, también compartidos, y conserva una única hoja de CSS para primitives/tokens. Las secciones tienen variantes explícitas `serene` y `graphic`: estética las usa en una composición serena y tatuajes en una editorial de alto contraste. Toda la ilustración del hero es **CSS original**, sin fuentes, fotos o scripts externos.

Se agrega `feature-grid` a `PageSection`, con tarjetas y copy validados por Zod. Los dos sitios siguen como prototipos `noindex`; sus títulos, paletas, textos y elementos gráficos **no son marcas ni contenido comercial aprobado**. El contenido final, imágenes originales y agenda se agregan en PR separados.

La estructura usa componentes Astro estáticos, puntos de ruptura responsivos, enlace de salto, navegación con etiquetas, estados de foco y `prefers-reduced-motion`. Tailwind y AstroWind siguen fuera de este PR, sin impedir su evaluación futura. Una sección de catálogo, una galería o un CTA de reserva no se implementan sin contenido y destino real.

## Identidad aprobada de VIORA (PR-04)

La estética adopta el manual de marca aportado por su titular: marfil, ciruela, rosa, rosa suave y tinta; salvia es opcional. El tema semántico común de seis colores sigue estable; paleta extendida, tipografía y composición viven en `apps/estetica/src/styles/viora.css`. `VioraSiteLayout` local de la app compone los componentes públicos compartidos y centraliza logos, navegación, pie y CSS sin trasladar marca a `packages/ui`. Cuatro líneas editoriales tienen fichas; el piloto prevé 60 minutos provisionales por event type de Cal.com, no como dato de servicio publicado, y no hay acciones ni reservas activas. Ver [guía de implementación](16-viora-brand.md), ADR-010 y ADR-012.

## Interacción y responsive de VIORA (PR-11)

La navegación compartida mantiene enlaces MPA reales y zonas táctiles de al menos 44px. El hero VIORA usa una fotografía editorial local con `srcset`, integrada con una composición marfil/ciruela; los logos oficiales siguen en cabecera y pie. La entrada de texto y fotografía usa CSS con opacidad, desplazamiento corto y escala moderada. Tarjetas con `primary` y `reveal` cruzan entre imágenes completas en hover/foco de puntero fino; su contenido sigue legible y disponible en touch. Las fichas muestran una imagen principal y, si existe `reveal`, una segunda escena debajo. Sin soporte de animaciones de scroll `view()`, las escenas permanecen visibles estáticamente. Con soporte, tarjetas, esencia y escenas usan revelado corto ligado al viewport, con movimiento leve en la fotografía hero y marca de agua; no hay marquee ni JavaScript de animación. `prefers-reduced-motion` deja todas las escenas visibles en estado estático y reduce las transiciones. CSS habilita View Transitions entre documentos del mismo origen de forma progresiva; sin soporte, los enlaces MPA navegan normalmente. `SiteConfig.iconHref` es opcional y acepta solo una ruta local root-relative; VIORA referencia el logo principal autorizado y Juanjo lo omite. La 404 estática usa el layout VIORA, metadata propia, `noindex` y enlaces de regreso; no cambia la identidad de Juanjo.

## Tokens semánticos

| Nivel | Ejemplos | Responsable |
| --- | --- | --- |
| Base | escala de spacing, radios, tipografía, breakpoints | `packages/ui` |
| Semántico | `--color-surface`, `--color-text`, `--color-accent`, `--color-border`, `--focus-ring` | contrato `ThemeConfig` |
| Marca | valores concretos por app: estética / tatuador | `apps/*/site.config.ts` |
| Variante visual | `editorial`, `split`, `minimal`, `gallery-first` | `packages/sections` |
| Contenido implementado | servicios/páginas en `apps/*/src/site.config.ts`, portfolio tipado de Juanjo | cada app; no hay Astro Content Collections todavía |

No usar strings de nombres de clientes para decidir estilos dentro de componentes comunes. Preferir props explícitas (`variant`) y CSS custom properties. No permitir variantes ilimitadas si todavía no existe una necesidad real.

## Componentes existentes y catálogo potencial (no todo está implementado)

- **Implementados:** BaseLayout, SiteHeader, SiteFooter, Container y Link en ui; LandingHero y FeatureGrid en sections. ServiceCatalog y TattooGallery son específicos de sus apps. **Potenciales:** Button, SectionHeading, ResponsiveImage, Badge, Accordion, Dialog y FormField, solo si hay consumidores reales.
- PR-14 incorpora `ActionList` en `ui`: recibe `idPrefix` y acciones presentables (`id`, `label`, `href`, `note?`); compone IDs de nota deterministas y delega cada href al `Link` seguro. El caller garantiza que cada prefijo sea único en el documento. No importa `booking` ni conoce proveedores. VIORA resuelve acciones antes de renderizar; las páginas y secciones que las rodean son locales de VIORA.
- PR-16 evoluciona `ButtonLink` como primitive compartida: `primary`, `secondary` y `quiet`, tamaños `default`/`compact`, `describedBy` y un glyph SVG explícito opcional (`external` o `back`). No agrega iconos automáticamente. `ActionList` sigue delegando el href a `Link` y puede recibir el icono opcional por acción; no conoce Cal.com. Los estados hover, active y focus-visible usan movimiento breve, objetivo táctil mínimo de 44px y respetan `prefers-reduced-motion`; cada app conserva sus colores de marca.
- **Futuros, todavía no compartidos:** ServiceActions, BookingCTA, QuoteCTA, FAQSection, ContactSection y Testimonials; deberán usar contratos tipados sin conocer marcas.
- Tipos y contratos de sección documentados; `Header` debe consumir el mismo menú tipado y contacto que el `Footer`, sin copiar links.

## Reglas de consistencia

1. Un único componente `Header` y `Footer` por patrón reutilizable, con variantes explícitas si son necesarias; navegación y contacto proceden del `SiteConfig` de la app.
2. Ningún paquete compartido importa imágenes, contenido o configuración de una app.
3. Configurar en datos el orden de secciones cuando la composición sea convencional; usar una página Astro específica cuando el diseño artístico necesite libertad real.
4. Los componentes de servicio no asumen que todos publican precio; la duración operacional corresponde al proveedor de agenda. Un mismo servicio puede mostrar varios CTA; reserva y presupuesto consumen un único contrato de `ServiceAction`, con variantes accesibles y semántica propia.
5. Animaciones discretas, desactivables por preferencia de reducción de movimiento.
6. Las galerías usan imágenes con derechos verificados, dimensiones adaptativas, texto alternativo pertinente y carga diferida salvo imagen hero crítica.
7. Añadir Storybook **solo si** la cantidad de componentes/variantes lo justifica; inicialmente, una ruta `__ui` no indexable en entorno de desarrollo basta para revisar variantes visuales.

## Opciones de contenido

**Implementado:** SiteContent TS/Zod por app y un portfolio tipado local para Juanjo; edición técnica mediante PR. Content Collections o CMS son posibilidades futuras si aparecen necesidades reales de edición, no tecnología incorporada en esta revisión.

**Evolución:** si el cliente necesita editar independientemente y con frecuencia, añadir un adaptador de fuente de contenido y evaluar un CMS alojado. No acoplar los componentes al origen del dato.

## Identidad editorial de Juanjo (PR-05)

Las capturas aportadas por el propietario orientan una estética gráfica de alto contraste: carbón, marfil y acento coral de **interpretación provisional**, no una nueva marca gráfica aprobada. La cabecera usa wordmark tipográfico de vista previa; el logo circular real se incorporará solamente desde el original autorizado. El hero reutiliza `LandingHero` con un artwork CSS propio en slot de app; las tarjetas mantienen `FeatureGrid`. La grilla de fotografías aún tiene un solo consumidor, por lo que permanece en `apps/tattoo`. Estado vacío sin imágenes inventadas y link al perfil oficial mientras llegan originales. Ver [guía editorial](17-juanjo-web-identity.md).
