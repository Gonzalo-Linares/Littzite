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

La home se organiza en cinco bloques: hero; trabajos; proceso; teaser de guía; cierre/consulta. El hero acepta `heroMedia.src` y `heroMedia.alt`, ambos opcionales y app-locales. Mientras falta una foto autorizada, usa una imagen generada identificada en pantalla y en este documento como preview; no es una obra ni una fotografía de Juanjo. El Oni oficial se mantiene superpuesto en la composición.

## Fotografías y carrusel

Blockers editoriales, deliberados y no bloqueantes para build: **Hero photography: pending real authorized photo.** **Portfolio: pending original authorized tattoo photography.** El kit aportado no contiene fotografías auténticas autorizadas de tatuajes. `tattooPortfolio` sigue como única fuente de trabajo real y permanece `[]`. `src/preview-portfolio.ts` mantiene separado un conjunto temporal de tres imágenes generadas, visible solo en la preview y rotulado en pantalla como referencia generada que no representa trabajos de Juanjo. `public/preview/aftercare-contact-sheet-preview.png` aporta cuatro escenas ilustrativas generadas para tarjetas educativas; tampoco documenta resultados reales de clientes. Reemplazar las imágenes de preview por originales autorizados y revisar textos antes de una publicación pública.

`TattooWorkCarousel.astro` recibe items ya validados por `validatePortfolio()` en `src/portfolio.ts` y se reutiliza en home y `/trabajos/`. Mientras el portfolio real está vacío, ambas rutas muestran la lista temporal separada con una nota visible de preview. En modo vacío conserva un estado alternativo sin controles. Con 1 item no inicia reproducción; con 2 o más ofrece tarjetas, peek móvil, snap/gesto táctil, anterior/siguiente, teclado y pausa/reanudación. El avance es cada siete segundos; se suspende al hover/foco y se detiene después de interacción manual. `prefers-reduced-motion` impide el avance automático inicial. No usa región live para anunciar cada cambio.

El fixture local cubre 0, 1, 2 y 5 items con SVG geométricos de prueba cuya alternativa textual declara que no son tatuajes. También cubre hero con una imagen configurada. Estos fixtures no se importan en la preview real.

## Turnos de prueba, contacto y páginas legales

`tattooActions.turnsHref` apunta temporalmente a `https://cal.com/gonzalo-linares-rfbhnf/prueba`, autorizado por el titular para esta preview. Los CTA de turnos abren esa URL y la identifican como agenda de prueba; no representa disponibilidad o una agenda comercial aprobada. `bookingTargets`, `quoteTargets` y las acciones de servicios siguen vacíos. Instagram queda disponible para conversar consultas y proyectos personalizados. Antes de producción hay que reemplazar o retirar el enlace de prueba tras aprobación comercial y ejecutar pruebas reales.

`/contacto/` presenta Cal.com de prueba, Instagram y una referencia gráfica genérica para San Juan, sin pin ni dirección. La ubicación exacta se confirma al coordinar y no se infieren calle, número ni establecimiento. `/privacidad/`, `/terminos-y-condiciones/` y `/arrepentimiento/` son borradores no indexables que informan los datos legales pendientes; requieren revisión del titular y asesoramiento correspondiente antes de uso comercial.

El footer utiliza las variantes horizontales aprobadas del kit Littzite: versión oscura para Juanjo y clara para VIORA. `SiteAttribution` y los enlaces SVG de Instagram se comparten desde `packages/ui`. Juanjo usa un panel de ubicación ilustrativo sin iframe; VIORA conserva intactos sus componentes de Instagram y mapa oficiales. Los datos, logos y copy de cada marca siguen configurados dentro de cada app. No se inventó URL de Littzite.

## Guía de preparación y cuidados

`/guia/` contiene preparación breve, sensibilidad orientativa, escala, cuidados generales y siete preguntas frecuentes. Sus siluetas frontal/trasera son SVG geométricos originales. El mapa no da puntajes ni pretende evaluar clínicamente: presenta zonas como orientación para conversar, muestra leyenda textual además del color y reconoce variación personal. La base de la clasificación cualitativa es un estudio piloto con entrevistas, no una escala validada: [estudio piloto sobre la experiencia de dolor durante tatuajes](https://www.frontiersin.org/journals/virtual-reality/articles/10.3389/frvir.2021.643938/full).

Los cuidados son generales, sin plazos rígidos, medicamentos, diagnósticos ni tratamientos. Las indicaciones particulares que Juanjo entregue después de la sesión prevalecen. Ante signos importantes de infección, reacción intensa o empeoramiento inesperado, la guía orienta a buscar evaluación médica; no diagnostica. La recomendación de seguir la instrucción del tatuador coincide con la [guía de tatuajes y cuidados de UCLH](https://www.uclh.nhs.uk/patients-and-visitors/patient-information-pages/tattoos-and-cosmetic-procedures).

## Accesibilidad, límites y verificación

El ícono social es SVG inline, tiene nombre accesible y foco visible, sin dependencia. Controles del carrusel superan 44 px, admiten teclado y pausa; el movimiento respeta reducción de movimiento. Mapa y escala tienen títulos/descripciones SVG y texto visible; la lectura no depende del color. La navegación HTML sigue funcionando sin JavaScript. Diseño comprobado en escritorio y anchos 1024, 768, 390 y 320 px; registrar los resultados de esta iteración en el PR.

La atribución de Littzite y las primitives neutrales de Instagram y mapa sí se comparten desde `packages/ui`; las apps mantienen sus datos y componentes de marca locales. No se modifican contratos, schema o booking. No se agregan dependencias ni se modifica `pnpm-lock.yaml`. Las páginas permanecen `noindex, nofollow`; este cambio no habilita publicación indexable.

## Pendientes antes de lanzamiento

- Foto real autorizada para reemplazar el hero temporal y originales de tatuajes con aprobación, título y texto alternativo para el portfolio.
- Definición de proveedor/alcance de turnos directos para piezas pequeñas (D-01C/D-02B).
- Número, texto aprobado y destino de consultas por WhatsApp para presupuesto grande (D-04B); no hay CTA de WhatsApp activo.
- Aprobación de contenido visual y guía de cuidados por Juanjo; verificar recomendaciones locales antes de publicarlas.
- Dominio, revisión/aprobación de privacidad y textos legales, agenda comercial definitiva y autorización de indexación.

GitHub Actions siguen desactivadas. El prototipo no es un release productivo.
