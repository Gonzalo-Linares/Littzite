# Guía para visualizar y mantener los diagramas — v0.3

Littzite mantiene los diagramas en **Mermaid**, como bloques de código Mermaid en archivos Markdown. GitHub puede renderizarlos directamente en las páginas del repositorio una vez realizado el commit. No son imágenes rasterizadas ni diagramas de una base de datos ya implementada: expresan acuerdos y propuestas versionados.

## Dónde está cada modelo

| Documento | Diagramas |
| --- | --- |
| [Arquitectura](02-architecture.md) | Contexto tipo C4 nivel 1, contenedores tipo C4 nivel 2, flujo de contenido y topología de despliegue |
| [Dominio](03-domain-model.md) | Clases conceptuales y ERE del **contenido**, no esquema SQL |
| [Flujos](04-sequences-flows.md) | Secuencias de reservas de estética, presupuesto de tatuajes, publicación y cambios compartidos; decisiones y fallback de agenda |
| [Amenazas](10-security-threat-model.md) | Fronteras de confianza entre navegador, hosting y proveedores |

## Visualización

1. **En GitHub:** abrir el documento `.md` en la rama publicada; el bloque Mermaid se renderiza como diagrama.
2. **En VS Code:** abrir el `.md` y usar `Ctrl+Shift+V` (vista previa) o `Ctrl+K`, seguido de `V` (vista previa lateral). Si la versión del editor no soporta Mermaid de forma nativa, utilizar una extensión de previsualización Markdown/Mermaid de confianza.
3. **Mermaid Live Editor:** pegar únicamente el contenido de un bloque `mermaid` en <https://mermaid.live/> para visualizar, exportar SVG o investigar errores sintácticos. Evitar pegar allí secretos o información privada.

## Reglas de mantenimiento

- El diagrama y su texto tienen que reflejar **las mismas decisiones** y sus estados (aceptada/propuesta/pendiente).
- No marcar tablas, APIs ni integraciones como implementadas hasta que existan y estén verificadas en código.
- Un PR que modifique contratos, responsabilidades o recorridos actualiza diagrama, ADR, criterios de prueba y registro de decisiones relevante.
- Las imágenes exportadas, si se generan para presentaciones, son derivadas; la **fuente de verdad** sigue siendo Mermaid en el repositorio.
