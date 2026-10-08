# Juanjo Tattoo Studio: identidad y experiencia digital

El manual oficial de marca suministrado por el titular es la fuente de verdad. Esta implementación vive en `apps/tattoo`, mantiene `es-AR`, `noindex, nofollow` y no activa booking.

## Manual y recursos

Kit auditado: `C:\Users\gonza\Downloads\Kit-Marca-Juanjo-Tattoo-Studio-Premium\Juanjo-Tattoo-Studio-Premium`.

Los cinco PNG maestros de `logos/` están copiados sin cambios en `apps/tattoo/public/brand/`. Sus roles, proporciones y SHA-256 se declaran en `src/brand.config.ts`: Principal para identidad de estudio, Sello para el estado vacío, Oni en hero, JT en cabecera compacta/favicon y Firma en cabecera/pie. Se preservan color, forma y proporción.

La carpeta `destacadas/` contiene símbolos independientes y portadas listas para perfiles sociales; `redes/`, `tarjetas/` e `indumentaria/` contienen composiciones finales o mockups. Esta web usa los maestros de `logos/` y, para los cuerpos de su guía, las fotos front/back de MuscleMap distribuidas localmente bajo MIT y registradas en `THIRD_PARTY_NOTICES.md`. No presenta composiciones de redes, tarjetas o merch como controles de interfaz, ni las presenta como fotografías de tatuajes.

Paleta oficial: tinta `#0E0E0E`, rojo `#A61E1E`, marfil `#EADCC6`, dorado `#C9A96B` y carbón `#2C2C2C`. Rye se reserva para titulares breves; DejaVu Serif para apoyo editorial; DejaVu Sans para lectura y controles. Las fuentes y sus avisos de licencia se distribuyen localmente. Ver `THIRD_PARTY_NOTICES.md`.

La atribución de Littzite en ambas aplicaciones usa el archivo exacto aprobado por el titular, `horizontal_oscuro_transparente.svg`, copiado sin cambios a `apps/tattoo/public/littzite/horizontal-dark.svg` y `apps/estetica/public/littzite/horizontal-dark.svg`. SHA-256 de los originales y ambas copias: `1F720FDFFFB7F1D53E05054E67A9C292C9D7B52C266D9D0108BED2D36A487E11`.

## Rutas y acciones

`TattooSiteLayout.astro` mantiene una única cabecera/pie y la atribución neutral preexistente de `packages/ui`. La navegación es Inicio, Trabajos, Guía y Contacto, con icono SVG de Instagram y CTA Turnos. El perfil `https://www.instagram.com/juanjo.tattoos/` es el único destino social aprobado. “Sobre Juanjo / Estudio podrá reincorporarse cuando existan bio, fotografías del estudio, especialidades, historia y datos reales aprobados.”

`tattooActions.turnsHref` centraliza el enlace de turnos aprobado por el titular: `https://cal.com/juanjo-pereyra-mkzgce/turnos-tattoos?overlayCalendar=true`. Todos los botones “Sacar turno” lo comparten. `bookingTargets`, `quoteTargets` y servicios permanecen vacíos; no se publican teléfono, WhatsApp, precios, horarios, señas ni políticas de agenda. El enlace está activo y no bloquea el release; continúan tres bloqueos editoriales por assets temporales.

La home se organiza en cinco bloques: hero; trabajos; proceso; teaser de guía; cierre/consulta. El hero acepta `heroMedia.src` y `heroMedia.alt`, ambos opcionales y app-locales. Mientras falta una foto autorizada, usa internamente un recurso temporal y el Oni oficial se mantiene superpuesto. La página conserva una sola tipografía display en todo el H1.

## Fotografías y carrusel

Blockers editoriales, deliberados y no bloqueantes para build: **Hero photography: pending real authorized photo.** **Portfolio: pending original authorized tattoo photography.** El kit aportado no contiene fotografías auténticas autorizadas de tatuajes. `tattooPortfolio` sigue como única fuente de trabajo real y permanece `[]`. `src/preview-portfolio.ts` mantiene separado un conjunto temporal de tres imágenes generadas y `public/preview/aftercare-contact-sheet-preview.webp` aporta cuatro escenas ilustrativas generadas. Estos estados también están registrados en `tattooReleaseState`; no se exponen como copy en la interfaz.

`TattooWorkCarousel.astro` recibe items ya validados por `validatePortfolio()` en `src/portfolio.ts` y se reutiliza en home y `/trabajos/`. La selección temporal comparte el mismo tratamiento visual que los items reales durante la revisión. En modo vacío conserva un estado alternativo sin controles. Con 2 o más elementos renderiza tres copias físicas de la secuencia, mantiene solo la copia central en el árbol accesible y recentra en silencio al llegar a los extremos. Ofrece gesto táctil, scroll horizontal, teclado y flechas laterales, sin autoplay ni movimiento vertical.

El fixture local cubre 0, 1, 2 y 5 items con SVG geométricos de prueba cuya alternativa textual declara que no son tatuajes. También cubre hero con una imagen configurada. Estos fixtures no se importan en la preview real.

## Turnos de prueba, contacto y páginas legales

`tattooActions.turnsHref` apunta al enlace de turnos aprobado por el titular: `https://cal.com/juanjo-pereyra-mkzgce/turnos-tattoos?overlayCalendar=true`. Todos los CTAs de turnos comparten esa fuente. `bookingTargets`, `quoteTargets` y las acciones de servicios siguen vacíos. La agenda no es un target de reserva interno; continúan tres bloqueos editoriales por assets temporales. Instagram queda disponible para consultas y proyectos personalizados.

`/contacto/` presenta primero el mapa oficial de Google Maps, luego el botón de indicaciones (`https://maps.app.goo.gl/SrLiJA1dutozzdKn7`) y debajo dos opciones balanceadas para turnos y consultas. `tattooLocation.embedUrl` contiene el `src` extraído de “Compartir → Insertar un mapa”; no se infiere una dirección textual. Las páginas legales son específicas de la app y requieren revisión del titular y asesoramiento correspondiente antes de uso comercial.

El footer de Juanjo muestra el wordmark oficial, la atribución central de Littzite y los enlaces de navegación y legales. La atribución de ambas apps usa el asset suministrado `horizontal_oscuro_transparente.svg`, copiado sin cambios como `horizontal-dark.svg`. `SiteAttribution`, el enlace SVG de Instagram y el panel neutral de Google Maps se comparten desde `packages/ui`; cada app conserva sus URLs, copy y ubicación locales. El panel acepta únicamente HTTPS de `www.google.com/maps/embed` con parámetro `pb` y renderiza el iframe con carga diferida, pantalla completa y política de referencia recomendada.

## Guía de preparación y cuidados

`/guia/` contiene preparación breve, sensibilidad orientativa, escala, cuidados generales y siete preguntas frecuentes. La sensibilidad usa fotos anatómicas front/back de MuscleMap y overlays SVG anclados al mismo `viewBox`; las zonas y colores son cualitativos, no clínicos ni predictivos. La comparación de tamaño usa una figura SVG principal con la misma foto y motivo en tres posiciones, con escalas relativas 1:2:4 para 5, 10 y 20 cm. La fuente, revisión y licencia MIT de las dos imágenes vendorizadas constan en `THIRD_PARTY_NOTICES.md`.

Los cuidados son generales, sin plazos rígidos, medicamentos, diagnósticos ni tratamientos. Las indicaciones particulares que Juanjo entregue después de la sesión prevalecen. Ante signos importantes de infección, reacción intensa o empeoramiento inesperado, la guía orienta a buscar evaluación médica; no diagnostica. La recomendación de seguir la instrucción del tatuador coincide con la [guía de tatuajes y cuidados de UCLH](https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/tattoos-and-cosmetic-procedures).

## Accesibilidad, límites y verificación

El ícono social es SVG inline compartido, tiene nombre accesible y foco visible, sin dependencia. El destino del header tiene un área táctil mínima de 44 px. Los controles manuales del carrusel admiten teclado y los gestos nativos; el movimiento respeta reducción de movimiento. Mapa y escala tienen títulos/descripciones SVG y texto visible; la lectura no depende del color. La navegación HTML sigue funcionando sin JavaScript.

La atribución de Littzite y las primitives neutrales de Instagram y mapa sí se comparten desde `packages/ui`; las apps mantienen sus datos y componentes de marca locales. No se modifican contratos, schema o booking. No se agregan dependencias ni se modifica `pnpm-lock.yaml`. Las páginas permanecen `noindex, nofollow`; este cambio no habilita publicación indexable.

## Pendientes antes de lanzamiento

- Foto real autorizada para reemplazar el hero temporal, las tres imágenes de trabajos y las cuatro escenas de cuidados.
- Revisión por Juanjo de disponibilidad y condiciones comunicadas en la agenda externa antes de publicar.
- Número, texto aprobado y destino de consultas por WhatsApp para presupuesto grande (D-04B); no hay CTA de WhatsApp activo.
- Aprobación de contenido visual y guía de cuidados por Juanjo; verificar recomendaciones locales antes de publicarlas.
- Dominio, revisión/aprobación de privacidad y textos legales, y autorización de indexación.

`pnpm --filter @littzite/tattoo check:release` es el guard explícito previo al release. Debe fallar mientras las tres banderas de assets editoriales temporales estén activas; hoy se esperan tres bloqueos.

GitHub Actions siguen desactivadas. El prototipo no es un release productivo.
