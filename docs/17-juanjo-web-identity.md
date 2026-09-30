# Juanjo Tattoos — Identidad editorial y galería preparada para originales

**Estado:** base editorial PR-05 fusionada; portfolio fotográfico final pendiente de originales. **Referencias:** capturas del perfil `@juanjo.tattoos` y de sus tatuajes facilitadas por el usuario el 29/09/2026. Se confirmó autorización para usar los trabajos y materiales de ambos negocios en Littzite. Los archivos fotográficos originales y el logotipo nativo de Juanjo **todavía no se recibieron**.

## Lectura de las referencias proporcionadas

Las capturas muestran un perfil de Juanjo Tattoos en San Juan, con marca circular ilustrada de fuerte contraste rojo/negro y trabajos variados: trazos ilustrados, pequeñas piezas gráficas y composiciones de mayor tamaño. La dirección visual de este prototipo interpreta esas referencias con un tratamiento editorial de alto contraste, tipografía pesada y un acento coral sobre carbón; **esta paleta tipográfica provisional no pretende sustituir un manual oficial ni reconstruir el logotipo de su perfil**.

El sitio incluye por ahora un *wordmark* puramente tipográfico `JUANJO.`, un hero ilustrado con CSS original y la estructura para un portfolio real. La única salida a trabajos actuales es [el perfil de Instagram proporcionado](https://www.instagram.com/juanjo.tattoos/). La cuenta externa tiene sus propias condiciones y no equivale a una galería local ni a una integración de Instagram.

## Implementado

- `apps/tattoo/src/site.config.ts`: idioma `es-AR`, tokens y narrativa editorial propios de Juanjo, sin datos de contacto falsos.
- `apps/tattoo/src/styles/juanjo.css`: estilos responsive **encapsulados en la app**, sin afectar a VIORA.
- `apps/tattoo/src/pages/index.astro`: composición con `SiteHeader`, `SiteFooter`, `LandingHero` y `FeatureGrid` públicos de los paquetes compartidos. El arte exclusivo del hero utiliza un slot ya existente; no modifica la API de los paquetes.
- `apps/tattoo/src/components/TattooGallery.astro`: grilla editorial de imágenes con `astro:assets` que genera formatos WebP responsive desde importaciones estáticas una vez aportados los originales. Mientras `tattooPortfolio` esté vacío, muestra un estado editorial honesto y enlaza a Instagram, **sin fotografías inventadas ni capturas comprimidas**.
- `apps/tattoo/src/portfolio.ts`: contrato local `TattooPortfolioItem` y guardas para IDs, títulos, texto alternativo y originales de al menos 640 × 640 píxeles. La validación no sustituye una revisión editorial de enfoque, permiso o peso de archivo.
- Se mantienen tres tarjetas de información no clicables. Los trabajos pequeños usarán agenda externa solo después de aprobar D-01C y D-02B; los grandes tendrán WhatsApp directo únicamente en texto una vez cerrado D-04B.

La razón para mantener la galería dentro de la aplicación, en vez de incorporarla prematuramente a los paquetes compartidos, se registra en [ADR-011](adr/011-tattoo-portfolio-local.md).

## Añadir originales sin cambiar la arquitectura

Al recibir los archivos originales autorizados, incorporarlos a `apps/tattoo/src/assets/portfolio/` y realizar importaciones estáticas en `apps/tattoo/src/portfolio.ts`. Ejemplo ilustrativo, **no activado ni incluido**:

```ts
import originalUno from './assets/portfolio/obra-01.jpg';
export const tattooPortfolio = validatePortfolio([
  {
    id: 'obra-01',
    title: 'Título editorial aprobado con Juanjo',
    alt: 'Descripción concreta y accesible del tatuaje fotografiado',
    image: originalUno,
  },
]);
```

No publicar capturas de pantallas de Instagram como fotos finales; solicitar 6–12 originales de calidad web (preferentemente JPG, PNG u otro formato soportado) y un logotipo original exportado a alta resolución o SVG verdaderamente vectorial. Confirmar la selección, consentimiento para mostrar a las personas cuando corresponda, título, descripción alternativa y orden editorial de cada trabajo. Mantener `noindex` hasta aprobar un despliegue comercial.

La imagen principal de la galería se muestra primero y con prioridad de carga adecuada; las posteriores usan lazy loading. La elección definitiva de tamaños, formatos, recortes y presupuesto de peso se ajustará una vez medidas las imágenes auténticas, mediante inspección del build y capturas móviles.

## Lo que NO está implementado

- Logotipo gráfico real, fotografías reales del portfolio, galería de vídeos/reels, métricas de Instagram ni scraping.
- Destinos públicos de agenda o WhatsApp: D-01C, D-02B y D-04B no están cerrados. El teléfono local visible en las capturas del perfil **no se toma automáticamente como número comercial E.164 validado**.
- Clasificación automática de tamaño, duraciones, precios, disponibilidad, señas, pagos, formularios de presupuesto, backend ni CMS.
- SEO productivo, direcciones, reseñas o claims no autorizados.

## Pruebas y decisión sobre CI

CI permanece deliberadamente desactivada por decisión del propietario: **no activarla ni atribuirle éxito**. Verificar localmente, con Node/pnpm fijados en el repositorio:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm check:boundaries
corepack pnpm test:contracts
corepack pnpm check
corepack pnpm build
corepack pnpm test
```

Revisar visualmente al menos 375 px, 768 px y escritorio, además de teclado, enlaces externos, estado vacío y contraste. El paquete de pruebas comprueba que una galería vacía no muestre fotografías ficticias y que ninguna app incorpore por accidente recursos de la otra.

**Revisión requerida antes del merge:** resultados locales reales, captura de escritorio/móvil y confirmación de que la composición provisional sigue alineada con lo que Juanjo quiere mostrar. No es necesario recibir todas las fotos para revisar esta base visual, pero sí para aprobar/publicar el portfolio final.
