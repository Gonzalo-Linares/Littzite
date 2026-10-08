# Juanjo Tattoo Studio: identidad y experiencia digital

El manual oficial de marca suministrado por el titular es la fuente de verdad. Esta implementación vive en `apps/tattoo`, mantiene `es-AR`, `noindex, nofollow` y no activa booking.

## Manual y recursos

Kit auditado: `C:\Users\gonza\Downloads\Kit-Marca-Juanjo-Tattoo-Studio-Premium\Juanjo-Tattoo-Studio-Premium`.

Los cinco PNG maestros de `logos/` están copiados sin cambios en `apps/tattoo/public/brand/`. Sus roles, proporciones y SHA-256 se declaran en `src/brand.config.ts`: Principal para identidad de estudio, Sello para el estado vacío, Oni en hero, JT en cabecera compacta/favicon y Firma en cabecera/pie. Se preservan color, forma y proporción.

La carpeta `destacadas/` contiene símbolos independientes y portadas listas para perfiles sociales; `redes/`, `tarjetas/` e `indumentaria/` contienen composiciones finales o mockups. Esta web usa los maestros de `logos/`, además de formas geométricas CSS/SVG originales para sus guías. No presenta composiciones de redes, tarjetas o merch como controles de interfaz, ni las presenta como fotografías de tatuajes.

Paleta oficial: tinta `#0E0E0E`, rojo `#A61E1E`, marfil `#EADCC6`, dorado `#C9A96B` y carbón `#2C2C2C`. Rye se reserva para titulares breves; DejaVu Serif para apoyo editorial; DejaVu Sans para lectura y controles. Las fuentes y sus avisos de licencia se distribuyen localmente. Ver `THIRD_PARTY_NOTICES.md`.

## Rutas y acciones

`TattooSiteLayout.astro` mantiene una única cabecera/pie y la atribución neutral preexistente de `packages/ui`. La navegación es Inicio, Trabajos, Guía, Estudio y Contacto, con icono SVG de Instagram y CTA Turnos. El perfil `https://www.instagram.com/juanjo.tattoos/` es el único destino social aprobado.

`tattooActions` centraliza `turnsHref` (`/contacto/#turnos`) y los dos usos del perfil de Instagram. No se encontró/verificó un deep link de DM estable; consultar abre el perfil. “Sacar turno” inicia la coordinación por Instagram, no una reserva automática. `bookingTargets`, `quoteTargets` y servicios permanecen vacíos; no se publican teléfono, WhatsApp, precios, horarios, señas ni políticas de agenda.

La home se organiza en seis bloques: hero; trabajos; antes de la tinta; cómo trabajamos; teaser de guía; cierre/consulta. El hero acepta `heroMedia.src` y `heroMedia.alt`, ambos opcionales y app-locales. La config actual no tiene fotografía. En su ausencia se presenta un marco carbón con líneas y círculos originales, y el Oni oficial superpuesto en la esquina superior derecha. Una foto local aprobada se renderiza con su texto alternativo sin rehacer la composición.

## Fotografías y carrusel

Blockers editoriales, deliberados y no bloqueantes para build: **Hero photography: pending real authorized photo.** **Portfolio: pending original authorized tattoo photography.** El kit aportado no contiene fotografías auténticas autorizadas de tatuajes. `tattooPortfolio` sigue como única fuente de trabajo real y permanece `[]`. No se descargó stock, no se usaron capturas de Instagram y no se generaron ni inventaron tatuajes.

`TattooWorkCarousel.astro` recibe los items ya validados por `validatePortfolio()` en `src/portfolio.ts`, y se reutiliza en home y `/trabajos/`. Con 0 items muestra Firma/Sello y un estado visual honesto sin controles; con 1 item no inicia reproducción; con 2 o más ofrece tres piezas visibles aproximadamente en escritorio, una con peek en móvil, snap/gesto táctil, anterior/siguiente, teclado y pausa/reanudación. El avance es cada siete segundos; se suspende al hover/foco y se detiene después de interacción manual. `prefers-reduced-motion` impide el avance automático inicial. No usa región live para anunciar cada cambio.

El fixture local cubre 0, 1, 2 y 5 piezas con SVG geométricos de prueba cuya alternativa textual declara que no son tatuajes. También cubre hero con una imagen configurada. Estos fixtures no se importan en producción.

## Guía de preparación y cuidados

`/guia/` contiene preparación breve, sensibilidad orientativa, escala, cuidados generales y siete preguntas frecuentes. Sus siluetas frontal/trasera son SVG geométricos originales. El mapa no da puntajes ni pretende evaluar clínicamente: presenta zonas como orientación para conversar, muestra leyenda textual además del color y reconoce variación personal. La base de la clasificación cualitativa es un estudio piloto con entrevistas, no una escala validada: [estudio piloto sobre la experiencia de dolor durante tatuajes](https://www.frontiersin.org/journals/virtual-reality/articles/10.3389/frvir.2021.643938/full).

Los cuidados son generales, sin plazos rígidos, medicamentos, diagnósticos ni tratamientos. Las indicaciones particulares que Juanjo entregue después de la sesión prevalecen. Ante signos importantes de infección, reacción intensa o empeoramiento inesperado, la guía orienta a buscar evaluación médica; no diagnostica. La recomendación de seguir la instrucción del tatuador coincide con la [guía de tatuajes y cuidados de UCLH](https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/tattoos-and-cosmetic-procedures).

## Accesibilidad, límites y verificación

El ícono social es SVG inline, tiene nombre accesible y foco visible, sin dependencia. Controles del carrusel superan 44 px, admiten teclado y pausa; el movimiento respeta reducción de movimiento. Mapa y escala tienen títulos/descripciones SVG y texto visible; la lectura no depende del color. La navegación HTML sigue funcionando sin JavaScript. Diseño comprobado en escritorio y anchos 1024, 768, 390 y 320 px; registrar los resultados de esta iteración en el PR.

No se modifican `packages/*`, contratos, schema, booking o la app VIORA. No se agregan dependencias ni se modifica `pnpm-lock.yaml`. Las páginas permanecen `noindex, nofollow`; este cambio no habilita publicación indexable.

## Pendientes antes de lanzamiento

- Foto real autorizada para el hero y originales de tatuajes con aprobación, título y texto alternativo para el portfolio.
- Definición de proveedor/alcance de turnos directos para piezas pequeñas (D-01C/D-02B).
- Número, texto aprobado y destino de consultas por WhatsApp para presupuesto grande (D-04B); no hay CTA de WhatsApp activo.
- Aprobación de contenido visual y guía de cuidados por Juanjo; verificar recomendaciones locales antes de publicarlas.
- Dominio, privacidad, legal y autorización de indexación.

GitHub Actions siguen desactivadas. El prototipo no es un release productivo.
