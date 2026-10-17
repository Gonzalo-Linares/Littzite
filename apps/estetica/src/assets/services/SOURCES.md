# Procedencia de imágenes editoriales de servicios VIORA

Consulta de páginas y licencia: 2026-09-30. Los JPEG base se descargaron de la CDN de Pexels a 1400 px de ancho. Cada derivado `-small.jpg` se generó localmente desde su base correspondiente a 640 px de ancho con Windows System.Drawing (JPEG calidad 82); no agrega paquetes al proyecto. `ServiceVisual.astro` publica ambas rutas locales en un `srcset` real con sus anchos y `sizes`. Astro conserva dimensiones intrínsecas; la app usa su servicio passthrough porque el procesamiento Sharp requeriría una dependencia adicional. La licencia de Pexels permite uso en sitios web, no requiere atribución y prohíbe sugerir que una persona o marca retratada recomienda el producto o servicio. Se conservan autoría y URL de cada página como referencia. Estas fotos son ilustrativas: no identifican al equipo, el espacio, el equipamiento ni la técnica de VIORA.

| Archivo base / derivado local | Fotógrafo/publicador | Proveedor y origen | Licencia consultada |
| --- | --- | --- | --- |
| `limpieza-facial-primary.jpg` / `limpieza-facial-primary-small.jpg` | Anete Lusina | [Pexels photo 5240806](https://www.pexels.com/photo/woman-cleaning-face-with-mask-in-spa-center-5240806/) | [Pexels License](https://www.pexels.com/license/) |
| `limpieza-facial-reveal.jpg` / `limpieza-facial-reveal-small.jpg` | Tima Miroshnichenko | [Pexels photo 6187298](https://www.pexels.com/photo/person-s-hands-massaging-a-person-s-face-6187298/) | [Pexels License](https://www.pexels.com/license/) |
| `depilacion-definitiva-primary.jpg` / `depilacion-definitiva-primary-small.jpg` | Larysa Stratiichuk | [Pexels photo 35103880](https://www.pexels.com/photo/laser-hair-removal-procedure-in-poland-35103880/) | [Pexels License](https://www.pexels.com/license/) |
| `depilacion-definitiva-reveal.jpg` / `depilacion-definitiva-reveal-small.jpg` | Nico Becker | [Pexels photo 5619448](https://www.pexels.com/photo/master-doing-laser-epilation-procedure-with-apparatus-5619448/) | [Pexels License](https://www.pexels.com/license/) |
| `masajes-primary.jpg` / `masajes-primary-small.jpg` | Tima Miroshnichenko | [Pexels photo 6187852](https://www.pexels.com/photo/person-s-hands-massaging-a-person-s-bare-back-with-fabric-balls-6187852/) | [Pexels License](https://www.pexels.com/license/) |
| `masajes-reveal.jpg` / `masajes-reveal-small.jpg` | Tima Miroshnichenko | [Pexels photo 6187262](https://www.pexels.com/photo/a-masseuse-doing-a-massage-6187262/) | [Pexels License](https://www.pexels.com/license/) |
| `reiki-primary.jpg` / `reiki-primary-small.jpg` | Arina Krasnikova | [Pexels photo 6998275](https://www.pexels.com/photo/woman-lying-on-the-floor-having-therapy-6998275/) | [Pexels License](https://www.pexels.com/license/) |
| `reiki-reveal.jpg` / `reiki-reveal-small.jpg` | Mikhail Nilov | [Pexels photo 6931832](https://www.pexels.com/photo/woman-hand-relaxation-connection-6931832/) | [Pexels License](https://www.pexels.com/license/) |
| `../viora-hero.jpg` / `../viora-hero-small.jpg` | Andrea Piacquadio | [Pexels photo 3855607](https://www.pexels.com/photo/cheerful-young-woman-resting-in-spa-3855607/) | [Pexels License](https://www.pexels.com/license/) |

Pexels attribution is not required by its license; this ledger is voluntary provenance documentation for Littzite's third-party asset policy. The source photos and their generated derivatives must not be reused as endorsements or offered as standalone stock content.

## Material entregado en Downloads — PR #44, 17/10/2026

El titular solicita incorporar los archivos locales a VIORA y autoriza expresamente usar la imagen rotulada como micropigmentación para BB Lips. La imagen no confirma su protocolo ni se presenta el servicio como micropigmentación. No se generaron imágenes ni se hicieron retoques estéticos. Los archivos suministrados no acreditan por sí solos que sean sesiones reales de VIORA: no atribuirles esa procedencia. Victoria imagen.jpeg es el retrato identificado y aprobado por el titular.

Mapeo, hashes, dimensiones y tamaños exactos: docs/25-viora-photo-manifest.json. JPEG calidad 88, variantes de hasta 1400px y 640px, sin ampliar originales, con orientación EXIF aplicada y metadata descartada. Retrato 435×563, JPEG calidad 92, sin ampliación. No hay foto capilar identificada; no se reasigna una foto facial al cuero cabelludo. Los archivos genéricos IMG/WhatsApp/HEIC sin identificación no se incorporaron.

| Fuente en Downloads | Destino / servicio |
| --- | --- |
| Victoria imagen.jpeg | public/images/victoria-linares.jpg — hero y presentación |
| Depilación láser en ambiente spa.png | depilacion-definitiva-approved{,-small}.jpg |
| Masaje relajante con piedras calientes.png | masajes-approved{,-small}.jpg |
| Tratamiento facial de arcilla en spa.png | limpieza-facial-approved{,-small}.jpg |
| Primer plano de ojo con pestañas y ceja perfectas.png | cejas-pestanas-approved{,-small}.jpg |
| Tratamiento facial microneedling relajante.png | microneedling-facial-approved{,-small}.jpg |
| Micropigmentación de labios en clínica estética.png | bb-lips-approved{,-small}.jpg — elección explícita del titular |

Las fotos Pexels anteriores permanecen en disco con sus avisos, fuera del catálogo de servicios principal. La imagen editorial de la página de marca /viora/ mantiene su procedencia Pexels registrada arriba.
