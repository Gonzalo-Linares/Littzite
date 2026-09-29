# Flujos y secuencias — v0.4

Las siguientes secuencias describen **flujos confirmados y contratos previstos**, no integraciones ya implementadas. El proveedor de reservas y las cuentas por negocio todavía no están elegidos. El canal de presupuestos de tatuajes grandes **sí** fue elegido: WhatsApp directo, inicialmente solo texto, sin formulario ni archivos propios.

## Estética: reserva de un tratamiento de duración fija

```mermaid
sequenceDiagram
  actor U as Visitante
  participant W as Web estática: estética
  participant R as Resolver de acciones
  participant B as Adaptador de agenda
  participant P as Proveedor externo por definir
  U->>W: Consulta tratamiento
  W-->>U: Ficha, duración confirmada y CTA
  U->>W: Pulsa Reservar
  W->>R: resolve(service.actions)
  R->>B: BookingTarget validado
  alt Embed soportado y habilitado
    B-->>W: Configuración de embed
    W->>P: Carga widget bajo demanda
    U->>P: Selecciona horario y confirma
    P-->>U: Resultado administrado por proveedor
  else Sin embed o fallo
    B-->>W: Enlace HTTPS alternativo
    W-->>U: Abrir agenda externa
  end
```

**Invariante:** una sola profesional en la estética; el proveedor conserva toda la disponibilidad y los registros de citas. La duración real de cada tratamiento debe validarse antes de publicarlo. No suponer automáticamente ausencia de señas ni reglas de cancelación.

## Tatuador: misma ficha con dos recorridos

```mermaid
flowchart TD
  A[Visitante abre página de tatuajes] --> B{Qué necesita}
  B -->|Trabajo pequeño| C[Ver condiciones del turno directo]
  C --> D[Acción tipada direct-booking]
  D --> E[Agenda externa del tatuador]
  E --> F[Confirmación en el proveedor]
  B -->|Trabajo grande| G[Ver trabajos y criterios del presupuesto]
  G --> H[Acción tipada quote-request]
  H --> I[WhatsApp: mensaje de texto]
  I --> J[Artista evalúa y cotiza]
  J --> K{¿Acepta el cliente?}
  K -->|Sí| L[Negocio acuerda siguientes pasos]
  K -->|No| M[Fin sin reserva]
```

**No asumimos:** umbral en centímetros, si los trabajos pequeños tienen siempre duración fija, cuántos tatuadores trabajan, qué datos/archivos recibe el presupuesto, ni si existe seña. La reserva directa se restringe a la oferta que el artista apruebe. La solicitud de presupuesto **no crea una cita**.

## Secuencia: presupuesto de trabajo grande

```mermaid
sequenceDiagram
  actor U as Cliente
  participant W as Web tatuador
  participant A as Resolver ServiceAction
  participant Q as WhatsApp externo
  participant T as Tatuador
  U->>W: Selecciona trabajo grande
  W->>A: Resuelve quote-request
  A-->>W: QuoteTarget WhatsApp y teléfono comercial validados
  W-->>U: CTA: abrir WhatsApp + aviso de tercero
  U->>Q: Redacta y envía su consulta de texto
  Q->>T: Entrega solicitud según proveedor
  T-->>U: Revisa y comunica presupuesto
  opt Si acepta y hay disponibilidad
    T-->>U: Indica pasos y enlace de agenda si corresponde
  end
```

El canal está definido por D-04 como WhatsApp de texto. Si el teléfono comercial o el texto editorial no están validados, **no se publica un enlace ficticio ni un formulario propio**. No existe subida de imágenes desde Littzite ni se registra el contenido de los mensajes. El envío efectivo no puede deducirse del clic.

## Fallo del widget y retorno seguro

```mermaid
flowchart TD
  A[Usuario elige reserva directa] --> B{BookingTarget configurado}
  B -->|No| C[CTA no publicable; error de build o contacto explícito aprobado]
  B -->|Sí| D{Embed permitido por adaptador}
  D -->|No| E[Enlace externo validado]
  D -->|Sí| F[Cargar widget bajo demanda]
  F --> G{Carga correcta}
  G -->|Sí| H[Proceso en proveedor]
  G -->|No| E
```

El evento visual del widget es **solo telemetría no autoritativa**, no prueba de cita ni de pago. Si después se requieren métricas de citas confirmadas, deberá evaluarse un webhook autenticado, deduplicación, retención mínima y una ADR nueva.

## Secuencia: editar y publicar contenido

```mermaid
sequenceDiagram
  actor E as Responsable
  participant GH as GitHub / PR
  participant CI as CI
  participant Z as Zod + integridad
  participant B as Astro build
  participant H as Hosting por sitio
  E->>GH: Edita contenido o configuración
  GH->>CI: Abre PR
  CI->>Z: Valida secciones, targets, slugs y URLs
  Z-->>CI: OK o error
  CI->>CI: Typecheck, lint y tests
  CI->>B: Build apps afectadas
  B-->>CI: HTML y assets aislados
  CI-->>GH: Checks y vista previa
  E->>GH: Revisa y mergea
  GH->>H: Publica solo app afectada
```

## Secuencia: un cambio transversal comprueba ambos sitios

```mermaid
sequenceDiagram
  actor D as Desarrollador
  participant PR as Pull request
  participant CI as CI
  participant A as App estética
  participant T as App tatuador
  D->>PR: Cambia paquete compartido
  PR->>CI: Ejecuta gates transversales
  CI->>A: Typecheck, tests, build
  CI->>T: Typecheck, tests, build
  A-->>CI: Resultado A
  T-->>CI: Resultado B
  alt Ambos pasan
    CI-->>PR: Habilitar revisión para merge
  else Alguno falla
    CI-->>PR: Bloquear merge
  end
```
