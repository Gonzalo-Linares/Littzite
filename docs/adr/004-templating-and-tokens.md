# ADR-004 — UI compartida con identidades y composiciones por app

**Estado:** Acordada · **Fecha:** 2026-09-28

## Contexto
Queremos coherencia de componentes sin convertir las dos webs en versiones de la misma plantilla.

## Decisión
Tokens semánticos y componentes accesibles comunes. Secciones tipadas y variantes deliberadas. Cada app decide el orden de secciones y puede tener composiciones Astro propias para casos artísticos no compartibles. Prohibir lógica basada en nombre del cliente en packages compartidos.

## Consecuencias
Se requiere disciplina para distinguir una variante real de una duplicación. No crear un page builder genérico hasta que exista una necesidad comprobada.
