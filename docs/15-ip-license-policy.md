# Política de propiedad intelectual y materiales de terceros — D-08B

**Estado:** acordada el 29/09/2026. Alcance: repositorio público Littzite y componentes originales de los que sus respectivos autores sean titulares. Este documento registra la decisión del proyecto y no constituye una licencia de reutilización ni asesoramiento jurídico.

## Regla principal

- Littzite se publica en GitHub como repositorio visible para portfolio, revisión y colaboración bajo la política del proyecto.
- **No se concede una licencia general para copiar, modificar, redistribuir o comercializar el código original de Littzite.** No incluir un archivo `LICENSE` open-source por defecto. El aviso en el README debe ser visible antes de descargar código.
- La visibilidad pública no impide los derechos y permisos derivados de los Términos de GitHub, incluidas funciones de visualización y `fork`, ni las excepciones legales aplicables. Los derechos de terceros no se transfieren automáticamente al propietario del repositorio.
- En el futuro, una licencia comercial, abierta o dual requerirá nueva decisión expresa y comprobación previa de la titularidad de cada contribución.

## Código y dependencias de terceros

1. **Dependencias instaladas**: revisar su licencia efectiva antes de adoptar; respetar obligaciones aplicables de distribución, avisos y condiciones comerciales.
2. **Código de plantillas copiado o modificado**: auditar componente por componente (origen, repositorio, commit/versión, licencia concreta, copyright y avisos). Conservar los textos de licencia y copyright cuando así se exija.
3. **AstroWind**: la evaluación selectiva permanece autorizada (ADR-005); **no hay código importado todavía**. Que su código esté bajo MIT no convierte al repositorio completo en MIT ni elimina los permisos que la MIT concede respecto de las porciones incorporadas. Verificar la versión/commit efectivo antes de copiar.
4. Crear `THIRD_PARTY_NOTICES.md` cuando se importe material sujeto a atribución, con archivo/ruta, fuente, versión, autor, licencia y localización de avisos. Conservar los avisos dentro del código si la licencia o el contexto lo exige.
5. Evitar copiar bloques de código o assets cuya procedencia o licencia no se pueda validar. **No presentar código ajeno como propiedad exclusiva de Littzite.**

## Fotos, diseños, tipografías, marcas y contenido de clientes

- El material de los clientes mantiene su titularidad correspondiente. Verificar por escrito permisos de uso para cada sitio; **la autorización de publicación de un sitio no se interpreta automáticamente como permiso para reutilizarlo en otro o exhibirlo en el portfolio**.
- No copiar imágenes de demos de plantillas sin licencia aplicable a esos recursos: la licencia del código y la de los assets pueden ser distintas.
- Documentar crédito, procedencia, autorización y posibilidad de retirada del material cuando corresponda.
- No publicar datos personales ni material que el cliente no haya aprobado para un repositorio público.

## Contribuciones y colaboración

- No interpretar que una persona que abre una PR transfiere automáticamente al proyecto los derechos exclusivos sobre su aportación. Antes de aceptar aportes externos sustanciales, verificar titularidad y obtener permiso escrito o acuerdo de contribución apropiado para el uso y modelo comercial previstos.
- Un análisis jurídico puntual puede ser necesario al contratar colaboradores, reutilizar materiales o distribuir una edición comercial. Si la autorización no está clara, no fusionar el aporte.
- Todo PR que introduzca material externo debe indicar origen, titular, versión, licencia y los avisos necesarios. Revisar también el lockfile y los assets compilados cuando se distribuyan.

## Verificaciones antes de publicar

- [ ] README indica claramente que el repositorio público no concede licencia de reutilización del código original.
- [ ] No hay un `LICENSE` global que contradiga D-08B.
- [ ] Los materiales de terceros tienen procedencia identificada y avisos retenidos conforme a sus licencias.
- [ ] No se mezclan fotografías, marcas, contenido privado o credenciales de clientes sin autorización.
- [ ] Las contribuciones externas se aceptan solo con permisos suficientes; no confundir un fork permitido por GitHub con cesión de derechos.

## Referencias

- [GitHub — licencias para repositorios](https://docs.github.com/es/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
- [Choose a License — No License](https://choosealicense.com/no-permission/)
- [GitHub — Términos del servicio](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service)
- [ADR-005: evaluación selectiva de AstroWind](adr/005-astrowind-reuse.md)
- [ADR-006: repositorio público con derechos reservados](adr/006-public-rights-reserved.md)
