# PR-20 — Production readiness y Cloudflare Pages

**Estado:** la arquitectura de publicación queda definida para Direct Upload. Esto no autoriza el lanzamiento: los dos sitios siguen protegidos por sus release gates, sin indexación productiva ni despliegues automáticos. GitHub Actions permanece desactivado.

## A. Architecture

El monorepo `Gonzalo-Linares/Littzite` es la única fuente de código. Cada app se construye por separado y el artefacto resultante se carga al proyecto Pages de la cuenta que pertenece a ese cliente:

```text
Littzite/
├── apps/estetica → build:estetica → apps/estetica/dist → Cloudflare VIORA
├── apps/tattoo   → build:tattoo   → apps/tattoo/dist   → Cloudflare Juanjo
└── packages/*    → código fuente compartido; no se publica por separado

GitHub Littzite
      │
  build app
      │
     dist
      │
 ┌────┴─────┐
 │          │
CF VIORA   CF Juanjo
```

VIORA usa una cuenta Cloudflare y un Pages project propios. Juanjo Tattoo Studio usa otra cuenta y otro Pages project. Cada artefacto contiene solo la app construida para ese cliente; la otra app y el código fuente no se cargan a su cuenta.

## B. Why client-owned Cloudflare accounts

El modelo recomendado es que cada cliente sea titular de su cuenta Cloudflare y de su proyecto Pages. Esto permite ownership claro, aislamiento de configuración y credenciales, transferencia sencilla y menor blast radius ante un incidente.

La separación de cuentas **no** busca sortear límites comerciales de Cloudflare. Los límites cambian; se verifican antes de escalar y no determinan esta arquitectura.

## C. Source vs hosting ownership

- **GitHub:** Littzite mantiene el repositorio y el código fuente canónico. Los clientes no necesitan acceso al repositorio.
- **Cloudflare:** cada cliente controla su cuenta, su Pages project, sus dominios, sus variables y sus despliegues.
- **Littzite:** desarrolla y, con credenciales separadas autorizadas, carga el artefacto estático de la app correspondiente.

Source ownership y hosting ownership son responsabilidades distintas. La cuenta Cloudflare de un cliente recibe el resultado compilado y no obtiene acceso al monorepo.

## D. Direct Upload

El mecanismo de deployment elegido es Cloudflare Pages Direct Upload de artefactos precompilados. No se usa Pages Git Integration: Cloudflare no permite usar el mismo repositorio GitHub/GitLab en proyectos Pages de cuentas separadas. No autorizar el repositorio en las cuentas de clientes ni duplicarlo para satisfacer esa integración.

Build de VIORA, desde la raíz del monorepo:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm build:estetica
```

El artefacto es `apps/estetica/dist`. Con el ID, token y nombre del proyecto VIORA seleccionados explícitamente para esa sesión:

```sh
CLOUDFLARE_ACCOUNT_ID="$VIORA_ACCOUNT_ID" \
CLOUDFLARE_API_TOKEN="$VIORA_CLOUDFLARE_API_TOKEN" \
npx wrangler pages deploy apps/estetica/dist --project-name="$VIORA_PROJECT_NAME"
```

Build de Juanjo:

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm build:tattoo
```

El artefacto es `apps/tattoo/dist`. Con las credenciales y el nombre del proyecto Juanjo seleccionados explícitamente:

```sh
CLOUDFLARE_ACCOUNT_ID="$JUANJO_ACCOUNT_ID" \
CLOUDFLARE_API_TOKEN="$JUANJO_CLOUDFLARE_API_TOKEN" \
npx wrangler pages deploy apps/tattoo/dist --project-name="$JUANJO_PROJECT_NAME"
```

Los nombres de proyectos, IDs y dominios reales quedan sin definir hasta que los titulares creen sus cuentas. Estos ejemplos usan Wrangler externo: Wrangler no se agrega como dependencia, no se crea un script `deploy` y el lockfile no cambia en este trabajo. Al ejecutar el comando, comprobar visualmente que el ID, token y nombre corresponden al mismo cliente. No depender de una cuenta implícita recordada por un login anterior.

Un proyecto Pages creado como Direct Upload no puede convertirse luego a Git Integration. Esta elección es deliberada; si una arquitectura futura exigiera otra modalidad, se creará un proyecto nuevo y se migrará de forma controlada.

## E. Create client project

Para cada cliente, su titular crea una cuenta Cloudflare y un Pages project mediante **Direct Upload**. Cada proyecto usa solo la cuenta de ese cliente y un nombre elegido por su titular. No configurar conexión a GitHub/GitLab, acceso al repositorio, build command ni credenciales del otro cliente. El primer artifact se carga con el comando de la sección D y publica la URL estable `<project>.pages.dev`.

## F. Preview deployment

El primer deployment sirve como preview de UAT en la URL estable `.pages.dev`, con la publicación protegida:

1. Mantener `VIORA_PUBLIC_RELEASE=false` o `JUANJO_PUBLIC_RELEASE=false`, según la app. Dejar `*_PUBLIC_SITE_URL` vacío hasta aprobar un hostname público.
2. Ejecutar quality y el build de la app correspondiente con solo sus variables de negocio `VIORA_*` o `JUANJO_*`.
3. Cargar únicamente su carpeta `dist` a su propio Pages project mediante Direct Upload.
4. Abrir la URL estable asignada por Cloudflare y verificar `noindex, nofollow`, ausencia de canonical y JSON-LD productivos, `robots.txt` con `Disallow: /` y sitemap vacío.
5. Completar UAT de enlaces, contenido, legales, Maps, Cal.com cuando aplique, responsive, navegación y páginas 404 antes de aprobar la publicación.

Direct Upload no crea previews automáticos a partir de ramas o PRs; este paso es un deployment manual de prueba con release apagado.

## G. Production activation

Una vez aprobado el UAT y el hostname estable, `https://<project>.pages.dev` puede ser la URL pública inicial. No es obligatorio comprar un dominio propio antes del lanzamiento. Resolver todos los blockers reales de esa app y recibir aprobación explícita de indexación antes de activar el release.

Configurar solo para la app correspondiente, por ejemplo `VIORA_PUBLIC_SITE_URL=https://<viora-project>.pages.dev` o `JUANJO_PUBLIC_SITE_URL=https://<juanjo-project>.pages.dev`. Establecer `*_PUBLIC_RELEASE=true`, volver a construir desde el monorepo y volver a cargar su artifact con Direct Upload. Verificar `index, follow`, canonical por ruta, datos estructurados, `robots.txt` permitido y sitemap correcto. El build debe pasar los guards existentes sin datos ficticios ni bypasses.

Las URLs específicas de deployments de prueba nunca se usan como canonical. Los bloqueos vigentes y sus responsables se describen en [readiness VIORA](19-viora-release-readiness.md) y [la implementación digital de Juanjo](20-juanjo-digital-brand-implementation.md).

## H. Environment variables

La configuración de negocio que consume el build y las credenciales de deployment son cosas distintas:

- VIORA se construye exclusivamente con variables `VIORA_*`.
- Juanjo se construye exclusivamente con variables `JUANJO_*`.
- `CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_API_TOKEN` seleccionan y autentican el deployment; no son variables comerciales ni se incluyen en el HTML.

Las variables de negocio se suministran al proceso que construye la app; en este modelo Direct Upload, Cloudflare recibe `dist` y no ejecuta ese build. Las variables requeridas por los gates de release permanecen enumeradas en `.env.example` y en la documentación de cada app. Mantener sus valores reales fuera del repositorio y no usar variables de la otra marca al construir.

**VIORA:** `VIORA_PUBLIC_RELEASE`, `VIORA_PUBLIC_SITE_URL`, `VIORA_LEGAL_NAME`, `VIORA_LEGAL_CUIT`, `VIORA_LEGAL_EMAIL`, `VIORA_LEGAL_PHONE`, `VIORA_LEGAL_DOMICILE`, `VIORA_BOOKING_URL`, `VIORA_BOOKING_APPROVED`, `VIORA_BOOKING_IN_PERSON_APPROVED`, `VIORA_BOOKING_DURATION_REVIEWED`, `VIORA_TERMS_APPROVED`, `VIORA_WITHDRAWAL_APPROVED` y `VIORA_WITHDRAWAL_PLACEMENT_APPROVED`.

**Juanjo:** `JUANJO_PUBLIC_RELEASE`, `JUANJO_PUBLIC_SITE_URL`, `JUANJO_LEGAL_NAME`, `JUANJO_LEGAL_CUIT`, `JUANJO_LEGAL_EMAIL`, `JUANJO_LEGAL_PHONE`, `JUANJO_LEGAL_DOMICILE`, `JUANJO_BOOKING_APPROVED`, `JUANJO_TERMS_APPROVED`, `JUANJO_WITHDRAWAL_APPROVED` y `JUANJO_WITHDRAWAL_PLACEMENT_APPROVED`.

## I. Credentials/security

Usar API Tokens de mínimo privilegio con permiso **Pages Write**, limitados a la cuenta correspondiente cuando Cloudflare lo permita. No usar Global API Key. Nunca commitear tokens, incluir valores reales en `.env.example` o documentación, ni guardarlos en el repositorio.

La credencial VIORA solo despliega VIORA; la de Juanjo solo despliega Juanjo. Una credencial de hosting nunca debe poder desplegar dos clientes independientes. Un incidente en una cuenta no debe conceder acceso a la otra. La cuenta del cliente recibe solo el artefacto de build, nunca acceso al código fuente.

## J. Custom domain migration

Cuando un cliente tenga un dominio propio, asociarlo a su proyecto Pages y a su propia cuenta. Actualizar solo el `*_PUBLIC_SITE_URL` de esa app con el origin HTTPS aprobado, reconstruir esa app y desplegar de nuevo su `dist`. Verificar canonical, robots, sitemap y redirects; opcionalmente redirigir el hostname `.pages.dev` al dominio propio. No se hardcodea ningún dominio mientras no haya sido confirmado.

## K. UAT

Completar revisión de navegador en desktop y mobile antes de activar indexación. Registrar las URLs reales de UAT en el handoff, sin incorporarlas como URL canónica.

**VIORA:** home, `/servicios/`, cada ficha, `/viora/`, `/contacto/` y `/reservar/`; Cal.com presencial, duración y confirmación aprobadas; Instagram, Google Maps, términos, privacidad, arrepentimiento, robots, sitemap y 404.

**Juanjo:** home, `/trabajos/`, carrusel, galería, lightbox, `/guia/` y `/contacto/`; Cal.com e Instagram; Google Maps, términos, privacidad, arrepentimiento, robots, sitemap y 404. Mantener bloqueados los assets temporales hasta su reemplazo y autorización.

Revisar enlaces externos, teclado/foco, headers, responsive, overflow, metadata y Lighthouse. No declarar revisión de navegador, Lighthouse o release si no se ejecutaron.

## L. Rollback

Ante una regresión, dejar `*_PUBLIC_RELEASE=false`, reconstruir la app afectada y cargar ese artifact para volver a noindex. Para revertir una versión, recuperar el commit o artifact aprobado, ejecutar de nuevo sus gates/build y hacer Direct Upload al Pages project correcto. Confirmar robots, canonical, sitemap y páginas públicas después del rollback. No modificar el otro proyecto.

## M. Future automation

Los despliegues no son automáticos. Un merge a `main` **no** implica un deployment. GitHub Actions permanece deliberadamente desactivado; cada publicación requiere acción explícita: actualizar checkout, ejecutar quality, construir una app, confirmar cuenta/proyecto/credencial y cargar su artifact.

Si se aprueba automatización futura, debe separar permisos y secretos por cliente, fijar deliberadamente la versión de Wrangler y requerir selección explícita de app, cuenta y proyecto. Ese trabajo no forma parte de este cambio. No crear `pnpm deploy` ni otro comando que pueda publicar la app o cuenta equivocada.

## N. Future client onboarding

Repetir el mismo modelo para cada cliente: `apps/<business>` → build específico → `dist` → cuenta Cloudflare propia → Pages project propio. No crear otro repositorio, duplicar apps/packages, ni cargar otras apps al cliente. Revisar límites y condiciones vigentes antes de escalar.

Cloudflare Pages Free documenta actualmente hasta **100 Pages projects por cuenta**, **500 builds al mes**, **20.000 archivos por sitio** y **25 MiB por asset**. Son límites sujetos a cambios; verificar la [documentación oficial de límites](https://developers.cloudflare.com/pages/platform/limits/) antes de planificar escala. El máximo de cinco proyectos por repositorio que figura en la documentación de monorepos aplica a proyectos Pages conectados por Git Integration, que Littzite no utiliza. Estos números no son el motivo para aislar cuentas por cliente.

## Rollout checklist

- [ ] Cuenta y titular Cloudflare correctos para el cliente.
- [ ] Pages project creado como Direct Upload, sin conexión a GitHub/GitLab.
- [ ] ID, token Pages Write y nombre de proyecto pertenecen al mismo cliente.
- [ ] Artifact construido con las variables de esa app y nada de la otra.
- [ ] UAT completado con release desactivado.
- [ ] Aprobaciones de contenido, datos legales, booking y assets completos.
- [ ] Hostname público aprobado; `*_PUBLIC_SITE_URL` configurado para esa app.
- [ ] Gates pasan con `*_PUBLIC_RELEASE=true` y se desplegó el nuevo artifact.
- [ ] Canonical, robots, sitemap, datos estructurados, redirects y 404 verificados.

## Portfolio de Juanjo: flujo para agregar fotos

La colección canónica reside en `apps/tattoo/src/portfolio-data.ts`; la resolución estática de imágenes vive en `apps/tattoo/src/portfolio.ts`. Para incorporar una obra original autorizada: guardar el archivo aprobado en `apps/tattoo/src/assets/` con nombre editorial estable; agregar una sola clave de imagen al mapa `portfolioImages`; sumar un registro con `id` único slug-safe, `title`, `alt` descriptivo de al menos 12 caracteres, `imageKey` y booleano `featured`; ejecutar tests/build. El carrusel deriva automáticamente los registros destacados desde `tattooPortfolio`; la grilla muestra la colección completa. No mantener una segunda lista ni duplicar imágenes. No CMS, backend, DB, Sanity o servicio obligatorio de imágenes en este alcance.
