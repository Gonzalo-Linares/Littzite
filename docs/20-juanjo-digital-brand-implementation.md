# Juanjo Tattoo Studio: identidad y experiencia digital

El manual oficial de marca suministrado por el titular es la fuente de verdad. Esta implementación vive en `apps/tattoo`, mantiene `es-AR` y `noindex, nofollow` por defecto; el modelo productivo y sus gates se detallan en [PR-20 deployment readiness](21-production-deployment.md). La agenda externa no equivale a una aprobación de release.

## Manual y recursos

Kit auditado: `C:\Users\gonza\Downloads\Kit-Marca-Juanjo-Tattoo-Studio-Premium\Juanjo-Tattoo-Studio-Premium`.

Los cinco PNG maestros de `logos/` están copiados sin cambios en `apps/tattoo/public/brand/`. Sus roles, proporciones y SHA-256 se declaran en `src/brand.config.ts`: Principal para identidad de estudio, Sello para el estado vacío, Oni en hero, JT en cabecera compacta/favicon y Firma en cabecera/pie. Se preservan color, forma y proporción.

La carpeta `destacadas/` contiene símbolos independientes y portadas listas para perfiles sociales; `redes/`, `tarjetas/` e `indumentaria/` contienen composiciones finales o mockups. Esta web usa los maestros de `logos/`. No presenta composiciones de redes, tarjetas o merch como controles de interfaz, ni las presenta como fotografías de tatuajes.

Paleta oficial: tinta `#0E0E0E`, rojo `#A61E1E`, marfil `#EADCC6`, dorado `#C9A96B` y carbón `#2C2C2C`. Rye se reserva para titulares breves; DejaVu Serif para apoyo editorial; DejaVu Sans para lectura y controles. Las fuentes y sus avisos de licencia se distribuyen localmente. Ver `THIRD_PARTY_NOTICES.md`.

La atribución de Littzite en ambas aplicaciones usa el archivo exacto aprobado por el titular, `horizontal_oscuro_transparente.svg`, copiado sin cambios a `apps/tattoo/public/littzite/horizontal-dark.svg` y `apps/estetica/public/littzite/horizontal-dark.svg`. SHA-256 de los originales y ambas copias: `1F720FDFFFB7F1D53E05054E67A9C292C9D7B52C266D9D0108BED2D36A487E11`.

## Rutas y acciones

`TattooSiteLayout.astro` mantiene una única cabecera/pie y la atribución neutral preexistente de `packages/ui`. La navegación es Inicio, Trabajos, Guía y Contacto, con icono SVG de Instagram y CTA Turnos. El perfil `https://www.instagram.com/juanjo.tattoos/` es el único destino social aprobado. “Sobre Juanjo / Estudio podrá reincorporarse cuando existan bio, fotografías del estudio, especialidades, historia y datos reales aprobados.”

`tattooActions.turnsHref` centraliza el enlace de turnos aprobado por el titular: `https://cal.com/juanjo-pereyra-mkzgce/turnos-tattoos?overlayCalendar=true`. Todos los botones “Sacar turno” lo comparten. `bookingTargets`, `quoteTargets` y servicios permanecen vacíos; no se publican teléfono, WhatsApp, precios, horarios, señas ni políticas de agenda. El enlace está activo y no bloquea el release; continúan tres bloqueos editoriales por assets temporales.

La home se organiza en cinco bloques: hero; trabajos; proceso; teaser de guía; cierre/consulta. El hero acepta `heroMedia.src` y `heroMedia.alt`, ambos opcionales y app-locales. Mientras falta una foto autorizada, usa internamente un recurso temporal y el Oni oficial se mantiene superpuesto. La página conserva una sola tipografía display en todo el H1.

## Fotografías y carrusel

Blockers editoriales, deliberados y no bloqueantes para build: **Hero photography: pending real authorized photo.** **Portfolio: pending original authorized tattoo photography.** El kit aportado no contiene fotografías auténticas autorizadas de tatuajes. `tattooPortfolio` es la única colección canónica y contiene tres imágenes temporales; cada item define `featured`, y `featuredTattooWorks` se deriva con un filtro sin duplicar objetos. Estas imágenes siguen bloqueando release mediante `tattooReleaseState`; no se exponen como copy temporal en la interfaz. `public/preview/aftercare-contact-sheet-preview.webp` aporta cuatro escenas ilustrativas temporales de cuidados.

`TattooWorkCarousel.astro` recibe `featuredTattooWorks` en home y en `/trabajos/`; el carrusel presenta solo el subconjunto destacado. La segunda sección de `/trabajos/` muestra `tattooPortfolio` completo en una grilla de tres columnas en desktop, dos en tablet y una en mobile, con imágenes accesibles y lazy loading. Un `<dialog>` nativo app-local permite ampliar la foto, cerrar, recorrer circularmente, usar Escape/flechas, devolver el foco y bloquear/restaurar el scroll. No se añadió una dependencia.

Con 2 o más elementos el carrusel renderiza tres copias físicas de la secuencia, mantiene solo la copia central en el árbol accesible y recentra en silencio al llegar a los extremos. Ofrece gesto táctil, scroll horizontal, teclado y flechas laterales, sin autoplay ni movimiento vertical. Los estados de 0, 1, 2 y 5 elementos permanecen cubiertos por fixtures de prueba.

El fixture local cubre 0, 1, 2 y 5 items con SVG geométricos de prueba cuya alternativa textual declara que no son tatuajes. También cubre hero con una imagen configurada. Estos fixtures no se importan en la preview real.

## Turnos de prueba, contacto y páginas legales

`tattooActions.turnsHref` apunta al enlace de turnos aprobado por el titular: `https://cal.com/juanjo-pereyra-mkzgce/turnos-tattoos?overlayCalendar=true`. Todos los CTAs de turnos comparten esa fuente. `bookingTargets`, `quoteTargets` y las acciones de servicios siguen vacíos. La agenda no es un target de reserva interno; continúan tres bloqueos editoriales por assets temporales. Instagram queda disponible para consultas y proyectos personalizados.

`/contacto/` presenta primero el mapa oficial de Google Maps, luego el botón de indicaciones (`https://maps.app.goo.gl/SrLiJA1dutozzdKn7`) y debajo dos opciones balanceadas para turnos y consultas. `tattooLocation.embedUrl` contiene el `src` extraído de “Compartir → Insertar un mapa”; no se infiere una dirección textual. Las páginas legales son específicas de la app y requieren revisión del titular y asesoramiento correspondiente antes de uso comercial.

El footer de Juanjo muestra el wordmark oficial, la atribución central de Littzite y los enlaces de navegación y legales. La atribución de ambas apps usa el asset suministrado `horizontal_oscuro_transparente.svg`, copiado sin cambios como `horizontal-dark.svg`. `SiteAttribution`, el enlace SVG de Instagram y el panel neutral de Google Maps se comparten desde `packages/ui`; cada app conserva sus URLs, copy y ubicación locales. El panel acepta únicamente HTTPS de `www.google.com/maps/embed` con parámetro `pb` y renderiza el iframe con carga diferida, pantalla completa y política de referencia recomendada.

## Guía de preparación y cuidados

`/guia/` conserva preparación breve, cuidados generales y siete preguntas frecuentes. Se eliminaron las infografías de sensibilidad y tamaño junto con sus imágenes corporales y estilos; podrán reconsiderarse cuando existan recursos gráficos adecuados y aprobados. La guía no amplía sus recomendaciones sanitarias.

Los cuidados son generales, sin plazos rígidos, medicamentos, diagnósticos ni tratamientos. Las indicaciones particulares que Juanjo entregue después de la sesión prevalecen. Ante signos importantes de infección, reacción intensa o empeoramiento inesperado, la guía orienta a buscar evaluación médica; no diagnostica. La recomendación de seguir la instrucción del tatuador coincide con la [guía de tatuajes y cuidados de UCLH](https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/tattoos-and-cosmetic-procedures).

## Accesibilidad, límites y verificación

El ícono social es SVG inline compartido, tiene nombre accesible y foco visible, sin dependencia. El destino del header tiene un área táctil mínima de 44 px. Los controles manuales del carrusel admiten teclado y los gestos nativos; el movimiento respeta reducción de movimiento. El lightbox usa semántica nativa de diálogo, gestión de foco y controles accesibles. La navegación HTML sigue funcionando sin JavaScript.

La atribución de Littzite y las primitives neutrales de Instagram y mapa sí se comparten desde `packages/ui`; las apps mantienen sus datos y componentes de marca locales. No se modifican contratos, schema o booking. No se agregan dependencias ni se modifica `pnpm-lock.yaml`. Las páginas permanecen `noindex, nofollow`; este cambio no habilita publicación indexable.

## Pendientes antes de lanzamiento

- Foto real autorizada para reemplazar el hero temporal, las tres imágenes de trabajos y las cuatro escenas de cuidados.
- Revisión por Juanjo de disponibilidad y condiciones comunicadas en la agenda externa antes de publicar.
- Número, texto aprobado y destino de consultas por WhatsApp para presupuesto grande (D-04B); no hay CTA de WhatsApp activo.
- Aprobación de contenido visual y guía de cuidados por Juanjo; verificar recomendaciones locales antes de publicarlas.
- Dominio, revisión/aprobación de privacidad y textos legales, y autorización de indexación.

`pnpm --filter @littzite/tattoo check:release` es el guard explícito previo al release. Falla mientras los tres assets editoriales temporales o cualquier requisito legal/productivo sigan pendientes; el número de bloqueos reportados refleja el estado actual de la configuración.

GitHub Actions siguen desactivadas. El prototipo no es un release productivo.

## Preparación de publicación

`release-readiness.ts` es la autoridad local de `JUANJO_PUBLIC_RELEASE`, URL de producción y `tattooLegal`, que consumen tanto el gate como las páginas de términos, privacidad y arrepentimiento. Preview muestra placeholders explícitos solo en esas páginas no indexables. Un release habilitado valida origen HTTPS, CUIT, email, teléfono, Cal.com, aprobaciones y `JUANJO_WITHDRAWAL_PLACEMENT_APPROVED`; este último exige revisión responsable de la ubicación del acceso de arrepentimiento en el footer. La bandera de publicación sigue apagada. Los tres bloqueos de assets permanecen activos mientras hero, portfolio y cuidados usen imágenes temporales; resolverlos requiere reemplazar por originales autorizados.

El `LocalBusiness` productivo incluye solamente nombre público, URL e Instagram. No agrega domicilio, teléfono ni razón social al JSON-LD. `robots.txt` bloquea previews y el sitemap de preview está vacío; las rutas candidatas del sitemap productivo excluyen 404. La configuración exacta de los dos proyectos Cloudflare y el checklist de UAT están en `docs/21-production-deployment.md`.
