# ADR-001 — Monorepo modular, dos apps, dos despliegues

**Estado:** Acordada · **Fecha:** 2026-09-28

## Contexto
Dos webs de diferentes negocios con muchas capacidades compartidas y una necesidad importante de diferenciación visual y comercial.

## Decisión
Monorepo pnpm workspaces con dos apps Astro. Paquetes compartidos para capacidades cohesionadas. Un proyecto de hosting, dominio, analítica, cuenta de reservas y variables de entorno por app.

## Consecuencias
Una mejora transversal se implementa una vez y se prueba en ambas apps. No hay independencia total del repositorio: un error en paquete común puede afectarlas, por lo que CI debe validarlas juntas. No crear un servidor multi-tenant.
