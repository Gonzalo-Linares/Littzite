# PR-17 / PR-21 — Readiness de publicación de VIORA

**Estado:** candidato estático y no indexable por defecto; no es autorización de lanzamiento. **Última revisión:** 7 de octubre de 2026. La revisión jurídica profesional sigue recomendada antes de publicar definitivamente.

## Datos comerciales y legales

La fuente app-local de datos de VIORA es `apps/estetica/src/viora-release.ts`; el enlace de indicaciones y el `src` oficial de Google Maps permanecen en `src/viora-location.ts`. Instagram aprobado: `https://www.instagram.com/vioramasajes.ok/`. Ubicación comercial pública: Rivadavia, San Juan, Argentina. No equivale a domicilio legal.

Los placeholders de nombre de la prestadora, CUIL, email legal/privacidad, teléfono comercial y domicilio legal son deliberados. Todos bloquean el release mientras falten; no completar con datos de ejemplo. El teléfono debe tener formato E.164 y el CUIL debe tener 11 dígitos o formato `XX-XXXXXXXX-X` y pasar la validación de dígito verificador. Los tests usan únicamente identificadores sintéticos; no representan a una persona real. Los datos reales se inyectan por variables de entorno de build y nunca se guardan en el repositorio.

La configuración app-local separa dos agendas de Cal.com: `booking-general` para limpieza facial y masajes, y `booking-depilacion-definitiva` exclusivamente para depilación definitiva. Ambas URLs productivas se reciben mediante `VIORA_BOOKING_GENERAL_URL` y `VIORA_BOOKING_DEPILACION_URL`; no hay valores productivos ni URL de UAT en el código. El sitio no gestiona horarios ni citas.

En `/reservar/`, una persona puede consultar el precio o resolver dudas antes de solicitar turno. WhatsApp se construye únicamente desde `VIORA_LEGAL_PHONE` si el valor cumple E.164; el mensaje se precarga en una pestaña nueva y la persona decide si lo envía. Instagram usa el perfil oficial configurado en la app. No se publica el teléfono si sigue vacío o inválido.

## Derechos de consumidores y revisión normativa

Se revisaron fuentes oficiales argentinas: [Ley 24.240 actualizada](https://www.argentina.gob.ar/normativa/nacional/ley-24240-638/actualizacion), [Código Civil y Comercial, arts. 1100 y 1105–1116](https://www.argentina.gob.ar/normativa/nacional/ley-26994-235975/actualizacion), [Disposición 954/2025](https://www.argentina.gob.ar/normativa/nacional/disposici%C3%B3n-954-2025-417152) y [Disposición 3/2026](https://www.boletinoficial.gob.ar/detalleAviso/primera/338248/20260206?busqueda=1). Se verificaron además las reglas de información en contratación electrónica y la distinción entre cancelar/reprogramar turnos y revocar una contratación. Por decisión explícita del product owner, el acceso `BOTÓN DE ARREPENTIMIENTO` permanece únicamente como link de texto en el footer. `VIORA_WITHDRAWAL_PLACEMENT_APPROVED` registra esa aprobación operativa; no es una certificación jurídica ni afirma que la ubicación cumpla por sí sola todos los requisitos aplicables. La revisión del funcionamiento del flujo y del email sigue siendo un bloqueo separado. La ruta explica el derecho y evita login/registro.

La ruta ofrece un enlace `mailto:` solamente cuando el email legal real reemplace el placeholder. Su suficiencia operativa para la modalidad comercial efectiva debe confirmarse en revisión jurídica antes del release; el guard `legal.withdrawal-workflow-review` permanece pendiente. No hay servicio recurrente confirmado, por lo que no se publica “Botón de baja”.

No se fijan precios, formas de pago, señas, multas, no-show, reintegros, política de menores, duración ni garantía de resultados. Los términos informan que estos elementos no están confirmados. `commercial.terms-approval` bloquea el release hasta confirmar las condiciones de contratación que correspondan, incluidos precio e información previa suficiente.

## Privacidad y servicios externos

Fuentes de datos personales revisadas: [Ley 25.326 actualizada](https://www.argentina.gob.ar/normativa/nacional/ley-25326-64790/actualizacion), [Decreto 1558/2001 actualizado](https://www.argentina.gob.ar/normativa/nacional/decreto-1558-2001-70368/actualizacion), [derechos AAIP](https://www.argentina.gob.ar/aaip/datospersonales/derechos) y [obligaciones AAIP](https://www.argentina.gob.ar/aaip/datospersonales/responsables/obligaciones). La AAIP informa diez días corridos para acceso y cinco días hábiles para rectificación, actualización o supresión. La política explica esos derechos e identifica a la AAIP como autoridad de control.

Auditoría de flujos visibles y documentos oficiales consultados: [Cal.com Privacy](https://cal.com/privacy), [Google Privacy para servicios integrados y Maps embebido](https://policies.google.com/privacy/embedded), [Cloudflare Privacy](https://www.cloudflare.com/privacypolicy/) y [política de Instagram](https://privacycenter.instagram.com/policy/). Cal.com recibe datos que la persona complete al reservar; Google Maps puede recibir solicitudes técnicas cuando el iframe diferido se carga; Instagram es un enlace sin embed. Cloudflare sirve el sitio y puede tratar datos técnicos de entrega/seguridad. La política no atribuye roles jurídicos uniformes, ubicación de servidores ni plazos no verificados. No se encontró código propio de cookies, analytics, formularios o scripts de terceros. Por eso no se agrega banner genérico; el mapa conserva `loading="lazy"` y su carga se informa.

El sitio no pide datos médicos. En Cal.com deben evitarse preguntas de salud o datos sensibles; recolectarlos requiere evaluación legal y de seguridad separada. Los términos y la privacidad no prometen resultados terapéuticos ni presentan estética como medicina.

## Release guard y SEO

`VIORA_PUBLIC_RELEASE` debe ser exactamente `true` para intentar la publicación indexable; `NODE_ENV` no activa el release. Mientras sea falso, las páginas incorporan `noindex, nofollow`, no emiten canonical ni JSON-LD, `robots.txt` bloquea el rastreo y el sitemap queda vacío. Un mapa de preview puede tener URLs técnicas externas, pero no se publican en sitemap/canonical.

Al activarse, el guard falla el build si quedan placeholders en nombre de la prestadora, CUIL, email legal/privacidad, teléfono o domicilio legal; si email, CUIL (incluido su dígito verificador) o teléfono E.164 no son válidos; si `VIORA_PUBLIC_SITE_URL` falta, no es HTTPS o no es un origen; si cualquiera de las dos URLs de Cal.com falta, no cumple la policy compartida o identifica una ruta temporal; o si no están afirmadas la aprobación humana de ambas agendas, ubicación presencial, duración, términos comerciales y revisión del flujo de arrepentimiento. `VIORA_WITHDRAWAL_PLACEMENT_APPROVED` representa la decisión operativa footer-only del product owner y no equivale a una certificación jurídica. Solo entonces aparecen canonical absoluto, `robots` index/follow, sitemap con rutas estáticas existentes y JSON-LD `BeautySalon` con datos aprobados. No se emiten teléfono, coordenadas, reseñas o imágenes en JSON-LD mientras sean desconocidos. No se emite un tipo médico.

No hay una imagen social aprobada con relación y composición adecuadas; los logotipos existentes no se reutilizaron como tarjeta de red social. Open Graph y Twitter emiten título, descripción, URL canónica si aplica y tarjeta `summary` sin imagen. Una imagen social propia requiere selección/autorización posterior.

## Cloudflare Pages

- Repositorio: `Gonzalo-Linares/Littzite`.
- Directorio raíz del proyecto Pages: raíz del monorepo (`/`).
- Rama de producción: `main`; no crear workflows ni asumir resultados de dashboard.
- Build command: `corepack pnpm install --frozen-lockfile && corepack pnpm --filter @littzite/estetica build`.
- Output: `apps/estetica/dist`.
- Runtime local del repo: Node.js 24 y pnpm 12.6.0 mediante Corepack. En Pages fijar `NODE_VERSION=24` y `PNPM_VERSION=12.6.0`. Si se usa el comando explícito de instalación anterior, fijar también `SKIP_DEPENDENCY_INSTALL=1` para evitar una segunda instalación automática. No se agregó Wrangler ni adapter porque Astro produce HTML estático.
- Variables: previews y producción mantienen `VIORA_PUBLIC_RELEASE=false` y `VIORA_PUBLIC_SITE_URL` vacío hasta conocer la URL real. Después del primer deploy se registra el `*.pages.dev` real y se configura como `VIORA_PUBLIC_SITE_URL`; solo activar release tras resolver cada blocker y aprobarlo expresamente. No se inventa el nombre de proyecto ni dominio.
  - Al llegar ese momento, el responsable completa `VIORA_LEGAL_NAME`, `VIORA_LEGAL_CUIL`, `VIORA_LEGAL_EMAIL`, `VIORA_LEGAL_PHONE`, `VIORA_LEGAL_DOMICILE`, `VIORA_BOOKING_GENERAL_URL`, `VIORA_BOOKING_DEPILACION_URL`, `VIORA_BOOKING_APPROVED`, `VIORA_BOOKING_IN_PERSON_APPROVED`, `VIORA_BOOKING_DURATION_REVIEWED`, `VIORA_TERMS_APPROVED`, `VIORA_WITHDRAWAL_APPROVED` y `VIORA_WITHDRAWAL_PLACEMENT_APPROVED`. Los datos de identidad/domicilio y las dos URLs son blockers. Los flags requieren aprobación humana y el build solo comprueba que estén afirmados explícitamente. `.env.example` conserva datos vacíos y flags `false`.
- Headers estáticos: `public/_headers` contiene CSP y políticas de navegador. La CSP limita scripts a self y frames a `www.google.com`; `style-src 'unsafe-inline'` es necesario por los style attributes generados por el tema y los puntos focales de imágenes. No se habilita `unsafe-eval` ni scripts de terceros. Confirmar en preview que Cloudflare aplica estos headers y que Google Maps carga.
- Al conectar dominio propio: asociarlo al proyecto existente, verificar DNS/TLS, reemplazar `VIORA_PUBLIC_SITE_URL` por el origin real, reconstruir y comprobar canonical, OG URL, sitemap y robots. No publicar con URL de preview como canonical.
- Search Console: después de dominio aprobado, verificar propiedad por método permitido, enviar sitemap y observar cobertura; este PR no crea propiedad ni transmite métricas.
- Fuentes operativas consultadas: [configuración Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/build-configuration/), [build image y versiones Node/pnpm](https://developers.cloudflare.com/pages/configuration/build-image/), [guía Astro estática](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/) y [Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start).
- Rollback: volver a desplegar el último artefacto validado o revertir el commit de contenido; ante un error de datos/legales, volver a `VIORA_PUBLIC_RELEASE=false` y reconstruir. Un cambio de env requiere nuevo build.

## QA y pendientes

No se ejecutó un deploy, Lighthouse, auditoría axe ni QA visual en dispositivos reales. Los tests locales cubren markup estático, enlaces, rutas legales, metadata de preview, noindex, robots, sitemap, headers, aislamiento de Juanjo, mapa y matriz de release guard. La checklist manual previa a release es: 320/375/390 px, tablet 768 px, escritorio; navegación por teclado y foco; lectura de textos y contraste; carga de mapa/canales; verificación de cada reserva y derechos; Lighthouse móvil y desktop; revisión de headers en Cloudflare Preview.

Bloqueos de negocio: nombre de la prestadora, CUIL, email legal/privacidad, teléfono, domicilio legal si corresponde, las dos URLs de Cal.com, aprobación humana de ambas agendas, Location presencial en vez de `Cal Video`, revisión de duración, términos de contratación y validación legal/operativa del flujo de arrepentimiento. `VIORA_PUBLIC_RELEASE=false` sigue siendo el valor por defecto; el PR-21 prepara la configuración y no publica el sitio.
