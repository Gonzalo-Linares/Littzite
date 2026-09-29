# ADR-002 — Astro estático y contenido validado en Git

**Estado:** Acordada para v1, revisar si cambian necesidades de edición · **Fecha:** 2026-09-28

## Contexto
El contenido cambia ocasionalmente y no hay requerimiento confirmado de que cada negocio edite su web sin asistencia técnica.

## Decisión
Astro + TypeScript estricto + Tailwind + Content Collections + Zod. Generación estática de páginas públicas. No incorporar CMS, backend, autenticación ni base de datos al MVP.

## Disparadores para revisión
Edición frecuente por personal no técnico, flujos de publicación, inventario dinámico, contenido privado, integraciones que exijan acciones autenticadas o captación segura de archivos.
