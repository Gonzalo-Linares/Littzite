# VIORA — Implementación del manual de marca en Littzite

**Fuente del diseño:** VIORA, *Manual de marca y sistema para Instagram*, edición 01, septiembre de 2026, 24 páginas, y *VIORA_Kit_de_Marca_Completo.zip* provistos por el usuario. Este documento describe la adaptación **a una web no indexable**; no representa aprobación de precios, disponibilidad, contacto o publicación comercial.

## Identidad visual que se traslada

- Marca y descriptor: **VIORA / Estética integral**. Voz: cálida, profesional y cercana, con voseo rioplatense; propósito y frase de marca `Tu momento, tu bienestar` (pp. 2–3).
- Paleta **exacta** del manual (pp. 11–12): Ciruela `#7B4655`, rosa `#C87D90`, rosa suave `#F0CED3`, marfil `#FAF5F0`, tinta `#39252D`, salvia opcional `#A7AEA0`. Distribución editorial orientativa: 60% marfil, 25% ciruela, 10% rosa suave y 5% acento; contraste mínimo 4.5:1 para texto pequeño.
- El `SiteConfig.theme` usa marfil/tinta/ciruela; los colores decorativos extendidos y la composición viven únicamente en `apps/estetica/src/styles/viora.css`. El tatuador mantiene su sistema visual completamente independiente.
- Fuentes que especifica el manual (p. 13): Nimbus Roman Regular para títulos; DejaVu Sans para cuerpo. Se especifican las familias con fallbacks del sistema para la etapa actual. **No se incluyen ni redistribuyen archivos de fuentes** en el repositorio. La fidelidad tipográfica completa se revisará después de acordar un mecanismo de distribución web compatible con licencias.
- Fotografía (p. 15): futura, real y autorizada, luz natural y tonos cálidos; no se incorporan fotos de stock ni rostros sin consentimiento.

## Logotipos exactos, no recreados

Según pp. 5–10, mantener proporciones, composición y área de protección del arte visible: **1X = 10% del ancho visible**. No utilizar texto reconstruido ni aplicar distorsión o sombras. Mínimos orientativos en pantalla: completo 240 px, nombre 160 px, símbolo 48 px. Los SVG originales del kit son **envoltorios de un raster**, no trazados vectoriales.

El frontend espera estos **archivos originales del kit sin modificar**:

| Archivo en el sitio | Archivo en el kit | Ubicación |
| --- | --- | --- |
| `/brand/viora-horizontal.png` | `VIORA/logos/VIORA_horizontal_color.png` | Cabecera |
| `/brand/viora-principal.png` | `VIORA/logos/VIORA_principal_color.png` | Hero |
| `/brand/viora-palabra.png` | `VIORA/logos/VIORA_palabra_ciruela.png` | Pie |

Colocar los tres bajo `apps/estetica/public/brand/`. Se suministra aparte un ZIP pequeño con esta estructura, sin fuentes, para que el titular lo importe localmente. **No subirlos al repositorio público hasta confirmar que existe permiso para exhibir las variantes reales de la marca allí.** El test de salida exige que los tres estén presentes en `dist/brand/`, para evitar integrar una vista con imágenes rotas.

## Secciones

- Cabecera horizontal con el logo oficial; menú solo a anclas existentes; los rótulos de estado siguen siendo propios de la app.
- Hero con el logo principal oficial sobre rosa suave, titulando «Regalate una pausa.» y la frase del manual.
- Cuatro líneas del manual (p. 4): limpieza facial, depilación definitiva, masajes y reiki, descriptas como recorrido editorial. **No son servicios publicables ni reservables todavía**; validar técnica concreta, habilitaciones que correspondan, duración fija por tratamiento y agenda.
- Sección institucional `esencia` con propósito sin afirmaciones médicas. Pie con el nombre oficial y aclaración de vista previa.

## Seguridad, accesibilidad y límites de publicación

- No aceptar ni inventar horarios, domicilio, tarifas, enlaces de reserva, Instagram ni WhatsApp. D-02A y D-01C siguen abiertos.
- Reiki debe comunicarse como experiencia de bienestar y nunca como tratamiento de enfermedades o sustituto de atención médica (p. 4). No prometer resultados garantizados (p. 3).
- Ambos sitios se mantienen `noindex`. El logo visible se integra mediante slots genéricos de Astro: `ui` y `sections` no importan assets de un cliente ni contienen condicionales por marca.
- Las imágenes del kit no trasladan automáticamente derechos de publicación en un repositorio abierto; verificar su titularidad/permiso conforme a [política de PI](15-ip-license-policy.md). No exponer las fuentes del kit en descargas.

## Cómo verificar localmente

Después de copiar los tres logos: ejecutar desde la raíz `corepack pnpm install --frozen-lockfile`, `corepack pnpm check:boundaries`, `corepack pnpm test:contracts`, `corepack pnpm check`, `corepack pnpm build` y `corepack pnpm test`. Los smoke tests aseguran logos disponibles, ausencia de contaminación a la app de tatuajes, cuatro tarjetas en VIORA y tres en el prototipo del tatuador. La CI está desactivada deliberadamente por el titular y no debe activarse sin su autorización.
