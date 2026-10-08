# PR-20 — Production readiness y Cloudflare Pages

**Estado del código:** preparado para builds estáticos independientes; no es una autorización de lanzamiento. Ambos sitios permanecen en preview no indexable por defecto. GitHub Actions continúa desactivado.

## A. Estado del código

- VIORA conserva su gate app-local y cambia la URL canónica a `VIORA_PUBLIC_SITE_URL`.
- Juanjo agrega un gate app-local con canonical por ruta, JSON-LD `LocalBusiness`, `robots.txt` y sitemap. La publicación exige `JUANJO_PUBLIC_RELEASE=true` y validaciones completas.
- BaseLayout compartido ya soporta canonical, robots y JSON-LD; no se amplía la API ni se modifica la presentación visual.
- Los endpoints estáticos de robots y sitemap existen en ambas apps. En preview, `robots.txt` declara `Disallow: /` y el sitemap no contiene páginas.
- `tattooActions.turnsHref` sigue siendo la única fuente del Cal.com aprobado de Juanjo. No hay booking targets para Juanjo.

## B. Datos reales pendientes y gates

### VIORA

El build con release habilitado falla hasta que estén configurados y verificados razón social, CUIT válido, email legal, teléfono E.164, domicilio legal requerido, URL pública HTTPS, URL Cal.com de producción, y todas las aprobaciones de booking presencial, duración, términos, flujo y ubicación del acceso de arrepentimiento. La URL actual `https://cal.com/gonzalo-linares-rfbhnf/prueba` es UAT y bloquea producción. No cambiarla por una dirección inventada. El detalle y responsables están en [docs/19](19-viora-release-readiness.md).

### Juanjo Tattoo Studio

El build productivo permanece bloqueado por los tres assets marcados en `tattooReleaseState`: hero temporal, portfolio temporal y cuidados temporales. Requiere reemplazos originales/autorizados, datos legales configurados y aprobados, URL HTTPS, aprobación expresa de booking, términos y flujo de arrepentimiento. El link aprobado de Cal.com ya está centralizado en `tattooActions`; no se duplica en variables o componentes. La ubicación y el `embedUrl` actual no se alteran. No se agregan dirección, teléfono ni razón social a metadata estructurada sin datos confirmados.

## C. Configuración Cloudflare Pages

Crear dos proyectos Pages conectados al mismo repositorio privado/público `Gonzalo-Linares/Littzite`. Para cada proyecto:

| Ajuste | VIORA | Juanjo Tattoo Studio |
|---|---|---|
| Production branch | `main` | `main` |
| Root directory | `/` (raíz del repositorio) | `/` (raíz del repositorio) |
| Build command | `corepack pnpm install --frozen-lockfile && corepack pnpm build:estetica` | `corepack pnpm install --frozen-lockfile && corepack pnpm build:tattoo` |
| Build output directory | `apps/estetica/dist` | `apps/tattoo/dist` |
| Node.js | `24` (compatible con `engines`) | `24` (compatible con `engines`) |
| pnpm | `12.6.0` | `12.6.0` |

Configurar `NODE_VERSION=24`, `PNPM_VERSION=12.6.0` y `SKIP_DEPENDENCY_INSTALL=1` para que el build command controle la instalación congelada desde la raíz. No configurar nombres de proyecto ni dominios hasta que Cloudflare los asigne. Cada app produce un artefacto autocontenido; no hay copias de código ni dependencia de la otra app.

Cloudflare Pages permite proyectos distintos sobre un mismo repositorio y comandos/rutas de salida diferentes. Los proyectos pueden construir ante cambios en todo el monorepo; watch paths es una optimización posterior opcional, no requisito de corrección. Revisar la configuración vigente de [builds](https://developers.cloudflare.com/pages/configuration/build-configuration/), [monorepos](https://developers.cloudflare.com/pages/configuration/monorepos/) y [build image](https://developers.cloudflare.com/pages/configuration/build-image/).

## D. Variables de entorno

Usar `.env.example` como catálogo no secreto. No copiar valores personales al repositorio. Configurar las variables por separado para cada Pages project, en Production y Preview environments.

**VIORA:** `VIORA_PUBLIC_RELEASE`, `VIORA_PUBLIC_SITE_URL`, `VIORA_LEGAL_NAME`, `VIORA_LEGAL_CUIT`, `VIORA_LEGAL_EMAIL`, `VIORA_LEGAL_PHONE`, `VIORA_LEGAL_DOMICILE`, `VIORA_BOOKING_URL`, `VIORA_BOOKING_APPROVED`, `VIORA_BOOKING_IN_PERSON_APPROVED`, `VIORA_BOOKING_DURATION_REVIEWED`, `VIORA_TERMS_APPROVED`, `VIORA_WITHDRAWAL_APPROVED` y `VIORA_WITHDRAWAL_PLACEMENT_APPROVED`.

**Juanjo:** `JUANJO_PUBLIC_RELEASE`, `JUANJO_PUBLIC_SITE_URL`, `JUANJO_LEGAL_NAME`, `JUANJO_LEGAL_CUIT`, `JUANJO_LEGAL_EMAIL`, `JUANJO_LEGAL_PHONE`, `JUANJO_LEGAL_DOMICILE`, `JUANJO_BOOKING_APPROVED`, `JUANJO_TERMS_APPROVED` y `JUANJO_WITHDRAWAL_APPROVED`.

En preview mantener ambas flags `*_PUBLIC_RELEASE=false` o ausentes y las URLs públicas vacías. Para la primera publicación no indexable, dejar release apagado también en Production. Luego del primer deployment, usar la URL realmente asignada por Pages sólo como base técnica de preview; la URL pública definitiva debe quedar verificada por el titular antes de activar canonical/indexación. No permitir que una preview branch herede un `*_PUBLIC_RELEASE=true` de producción.

## E. Preview deployment

1. Conectar primero los dos proyectos con la configuración anterior y release apagado.
2. Mantener el root directory en la raíz y no colocar `PUBLIC_SITE_URL` genérico.
3. Abrir las URLs de preview que Cloudflare asigne; no escribirlas como dominios permanentes en el repo.
4. Confirmar en HTML `noindex, nofollow`, ausencia de canonical y JSON-LD, `robots.txt` con bloqueo y sitemap vacío.
5. Confirmar que no existen páginas vacías o errores de build. Las vistas aprobadas deben mantener el mismo diseño.

## F. Production deployment e indexación

`main` es el production branch de cada proyecto. Antes de crear dominios propios, resolver datos/revisiones pendientes, poner las variables del proyecto, ejecutar los gates localmente y revisar cada dominio/certificado/DNS real. Configurar cada `*_PUBLIC_SITE_URL` como origin HTTPS limpio (sin path, query o fragmento). La activación requiere aprobación explícita y un build de release satisfactorio. El build falla cerrado si falta un dato o autorización. No activar release para probar una URL de producción.

Con release aprobado, páginas indexables reciben canonical por ruta, `index, follow`, JSON-LD y sitemap solo de rutas declaradas. Las rutas especiales de error permanecen noindex y el 404 queda fuera del sitemap. El tipo de esquema de Juanjo es `LocalBusiness`, el cual se limita a nombre público, URL e Instagram verificado; no deduce dirección desde Maps. Ver [Schema.org LocalBusiness](https://schema.org/LocalBusiness).

## G. Smoke/UAT post-deploy

Completar con URLs reales en una revisión de navegador, desktop y mobile. Confirmar enlaces externos, headers y dominio; revisar noindex, canonical, robots, sitemap y 404. Probar mapa y reserva en una sesión sin cuenta cuando aplique. Comparar visualmente con la UI aprobada.

### VIORA

- Home, `/servicios/`, cada ficha `/servicios/[slug]/`, `/viora/`, `/contacto/` y `/reservar/`.
- Depilación: destino de Cal.com productivo, ubicación presencial, duración y flujo de confirmación aprobados.
- Instagram, Google Maps, privacidad, términos, arrepentimiento y 404.
- Desktop/mobile, overflow, canonical por ruta, robots, sitemap y headers.

### Juanjo

- Home, `/trabajos/`, carrusel, galería completa y lightbox; `/guia/`, FAQ y `/contacto/`.
- Cal.com aprobado, Instagram, Google Maps, privacidad, términos, arrepentimiento y 404.
- Desktop/mobile, canonical por ruta, robots, sitemap y headers.

## H. Lighthouse y revisión final

Después del deployment, revisar Performance, Accessibility, Best Practices y SEO en Lighthouse para mobile y desktop. No se define un score arbitrario como condición de salida. Investigar y corregir problemas reales sin rediseñar la UI aprobada. También revisar navegación por teclado, foco, contraste, carga de mapa y contenido legal.

## I. Rollback

Cloudflare Pages permite volver al último deployment correcto desde el dashboard. Ante problemas de indexación o datos, primero apagar `*_PUBLIC_RELEASE` y reconstruir; un cambio de variable requiere un nuevo build. Para revertir código, revertir el commit en una rama/PR posterior y desplegar el commit estable. Verificar otra vez robots, canonical y acceso a las páginas.

## Checklist de activación

- [ ] Dominio y titularidad confirmados por cada negocio.
- [ ] Datos legales/productivos y textos revisados por sus responsables.
- [ ] UAT de booking completado con configuración productiva.
- [ ] Para Juanjo: reemplazo y permiso de todos los assets temporales.
- [ ] `*_PUBLIC_SITE_URL` es el origin HTTPS real de ese sitio.
- [ ] Build de release pasa sin desactivar guards ni usar datos ficticios.
- [ ] Smoke UAT, desktop/mobile, metadata, robots, sitemap y Lighthouse revisados.
- [ ] Aprobación explícita de indexación registrada antes de cambiar `*_PUBLIC_RELEASE=true`.

## Portfolio de Juanjo: flujo para agregar fotos

La colección canónica reside en `apps/tattoo/src/portfolio-data.ts`; la resolución estática de imágenes vive en `apps/tattoo/src/portfolio.ts`. Para incorporar una obra original autorizada: guardar el archivo aprobado en `apps/tattoo/src/assets/` con nombre editorial estable; agregar una sola clave de imagen al mapa `portfolioImages`; sumar un registro con `id` único slug-safe, `title`, `alt` descriptivo de al menos 12 caracteres, `imageKey` y booleano `featured`; ejecutar tests/build. El carrusel deriva automáticamente los registros destacados desde `tattooPortfolio`; la grilla muestra la colección completa. No mantener una segunda lista ni duplicar imágenes. No CMS, backend, DB, Sanity o servicio obligatorio de imágenes en este alcance.
