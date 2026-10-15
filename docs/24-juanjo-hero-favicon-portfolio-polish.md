# Juanjo: hero, favicon Oni y portfolio curado

Base main: `b30aa155765ffbc7ac2688cc747ef703746abb33`.
Rama: `feat/juanjo-hero-favicon-portfolio-polish`.
El PR #43 sigue abierto: esta rama parte de main y no depende de él. Reincorpora las 12 fotos reales ya seleccionadas allí porque todavía no existen en main. No se agregan nuevas fotografías al set anterior, no se modifica ni cierra el PR #43.

## Assets aprobados

Fuentes entregadas explícitamente por el usuario en Downloads:
- Máscara oni roja entre humo y tinta.png: 1942×809, 2459241 bytes, SHA-256 `71b6149777e3461344ba0a5d287b4ead8baf3e2ed21309f45de356229dceaf35`.
- Ícono minimalista de máscara oni roja.png: 1254×1254, 1452384 bytes, SHA-256 `c2e6b883ada48470ac900b65c23d825bca0a1113d77ef090ceab4ce35341b8aa`.

Sin generación, reinterpretación ni retoques. El hero conserva la composición panorámica y resolución: WebP calidad 94, 403362 bytes, SHA-256 `a730af5799061d3b736171ccd28e9d08083806df0b2568d5ddd3a66d895d9b5a`. Fuente PNG permanece en Downloads.

Imagen absoluta decorativa con dimensiones explícitas, object-fit cover, posición desktop centrada y móvil 75% center. Copy/CTAs alineados a izquierda. Gradiente horizontal oscurece selectivamente la zona de texto; en móvil gradiente vertical más fuerte abajo para preservar el rostro arriba. Botón secundario con superficie ink. Entrada de imagen 750 ms y contenido sutil; reduced-motion, fallback visible y congelamiento de reveals completados.

Favicon generado por reducción proporcional del PNG aprobado dentro de canvas ink con 6% de safe area total. PNG 16/32/64, apple-touch-icon 180 y /favicon.ico con 16/32/64. iconHref canónico apunta al 64; layout agrega sizes y apple-touch-icon. SVG JT manual eliminado; no vuelve a usarse JT como favicon. PNG 64: 7360 bytes, SHA-256 `b95beec70abe7720f2a6c3adad892f1e1cb32cf3c10603edd94f3ece3f823ca2`.
Se añade únicamente un slot genérico head a BaseLayout para que la app aporte sus links sin introducir identidad en shared. VIORA no aporta ese slot y conserva su head actual.

## Portfolio y encuadres

Contrato app-local: preview opcional con focalPoint {x,y}, fit cover/contain y orientation portrait/landscape/square. Rangos 0–100 y enums validados. Los 12 registros reales tienen metadata explícita; fixtures anteriores conservan fallback central. Se usa el mismo registro en carrusel y grilla, sin duplicar fotos ni fuentes.
Las piezas largas usan contain para evitar cortar sus extremos; fotos de hombro/cuello tienen foco elevado; la pieza horizontal ocupa dos columnas y proporción 3/2 en desktop. En móvil vuelve a una columna sin producir overflow. La galería usa encabezado editorial más claro y bordes contenidos, sin zoom hover que recorte tatuajes.
Lightbox conserva la imagen original completa, sin aplicar tratamiento de miniatura, navegación circular, Escape, foco y scroll lock existentes. No se modificó su lógica.

| Trabajo | Fuente original (Downloads/imagenes juanjo) | Dimensiones | Bytes WebP | Featured |
| --- | --- | --- | ---: | --- |
| 01 | IMG-20261015-WA0022.jpg.jpeg | 1200×1600 | 331664 | Sí |
| 02 | IMG-20261015-WA0025.jpg.jpeg | 1125×2000 | 173038 | Sí |
| 03 | IMG-20261015-WA0026.jpg.jpeg | 1125×2000 | 129388 | Sí |
| 04 | IMG-20261015-WA0060(1).jpg.jpeg | 1200×1600 | 262296 | Sí |
| 05 | IMG-20261015-WA0057.jpg.jpeg | 1125×2000 | 415326 | Sí |
| 06 | IMG-20261015-WA0052.jpg.jpeg | 1125×2000 | 407010 | Sí |
| 07 | IMG-20261015-WA0027.jpg.jpeg | 900×1600 | 206582 | No |
| 08 | IMG-20261015-WA0042.jpg.jpeg | 1464×1599 | 445872 | No |
| 09 | IMG-20261015-WA0049.jpg.jpeg | 1125×2000 | 136962 | No |
| 10 | IMG-20261015-WA0056.jpg.jpeg | 1125×2000 | 309376 | No |
| 11 | IMG-20261015-WA0058.jpg.jpeg | 2000×1500 | 442868 | No |
| 12 | IMG-20261015-WA0061.jpg.jpeg | 1125×2000 | 330468 | No |

Los originales seleccionados suman 23308046 bytes; las 12 versiones WebP 3590850 bytes. Exif normalizado/eliminado, máximo 2000 px sin ampliar, calidad 90 sin filtros/AI. No se crean recortes destructivos ni versiones editadas del tatuaje; el lightbox mantiene todo el encuadre.

## Contacto y alcance

WhatsApp confirmado directamente en este chat: +54 9 2645 01-9502 → https://wa.me/5492645019502. Única fuente tattooActions.whatsAppHref; Instagram deriva del enlace existente. Rail app-local de dos acciones con nombres accesibles, enlaces externos seguros y targets de 44 px. Desktop lateral derecho; móvil abajo a derecha con safe area y espacio de footer reservado para no tapar sus enlaces. No envía mensajes automáticamente.

Sin cambios en booking/Cal.com, Maps, legales, deployment o Cloudflare. tattooReleaseState y release-readiness.ts permanecen idénticos a main, incluidos sus blockers temporales conservadores. No se habilita public release. Sin dependencias nuevas y pnpm-lock.yaml intacto.

## Validación

Install frozen, format, lint, boundaries, contratos, Astro check, build, HTML, test y quality ejecutados localmente. Resultado y SHA final en el Draft PR. Se agregan fixtures para límites de focalPoint, metadata usada por ambos consumidores, imagen completa del lightbox, hashes y tamaños de favicon y destinos de contacto aprobados. Se actualizan expectativas del portfolio real y hero decorativo.

Por instrucción expresa del usuario no se hizo QA con navegador, Playwright ni recorridos visuales automatizados. Sólo se inspeccionaron los dos archivos originales con visor de imágenes y se ejecutaron los checks del repo. No se afirma validación visual responsive ni prueba manual de gestos/focus de esta ronda; accesibilidad/lightbox se conservan y cubren por tests.
GitHub Actions sigue desactivado; no se declara CI verde. Draft contra main, sin Ready, merge ni deploy.
