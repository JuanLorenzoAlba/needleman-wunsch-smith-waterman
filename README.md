# Needleman-Wunsch vs Smith-Waterman

Trabajo hecho para la entrega del final de **Bioinformática** (Ingeniería Informática, UNAJ) — profundiza en los algoritmos de alineamiento de secuencias por programación dinámica vistos en la Clase 5 (Needleman-Wunsch y Smith-Waterman), implementándolos en Next.js con una visualización interactiva de la matriz y el traceback.

Funcionalidades:

- Needleman-Wunsch (global) y Smith-Waterman (local) lado a lado, con las mismas secuencias de entrada.
- Matriz de programación dinámica con traceback óptimo resaltado en rojo, y flecha de dirección ganadora en cada celda.
- Hover sobre cada celda: desglosa el cálculo (diagonal, arriba, izquierda y cuál ganó).
- Acordeón con una explicación breve de cómo funciona cada algoritmo.
- Alineamiento final resaltado por color (match / mismatch / gap).
- Control de match, mismatch y gap en vivo.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Stack

Next.js (App Router) + TypeScript. Todo el cálculo corre en el cliente, sin backend. Estilos en CSS plano (variables globales + un `.module.css` por componente).

## Estructura del proyecto

```
src/
  app/          Rutas de Next.js (layout, página principal, estilos globales)
  components/   Componentes de UI, uno por carpeta junto a su estilo
  helpers/      Funciones puras (sin JSX): algoritmos y formateo
  interfaces/   Tipos de TypeScript compartidos
  styles/       Estilos que no son de un componente puntual (la página)
```

- **`app/`** — convención de rutas de Next.js. `layout.tsx` define el `<html>`/`<body>` y los metadatos (título, descripción); `page.tsx` arma la pantalla principal (inputs de secuencias, controles de puntuación, y las dos matrices lado a lado); `globals.css` define las variables globales de color y tipografía que usa el resto de la app.

- **`components/`** — cada componente vive en su propia carpeta con su `.module.css` al lado (así el estilo queda pegado a lo que estiliza, no separado en otro árbol de carpetas):
  - `MatrixView/` — la matriz de programación dinámica de un algoritmo: encabezados, celdas, resaltado del traceback y la leyenda.
  - `CellTooltip/` — el cuadro flotante que aparece al pasar el mouse por una celda, con el desglose del cálculo.
  - `Quadrant/` — cada uno de los 4 recuadros chicos dentro del tooltip (diagonal / arriba / izquierda / resultado).
  - `AlignmentView/` — el alineamiento final coloreado (match / mismatch / gap).
  - `AlgorithmInfo/` — el acordeón con la explicación de cómo funciona cada algoritmo.

- **`helpers/`** — lógica pura, sin interfaz gráfica:
  - `align.ts` — implementación de Needleman-Wunsch y Smith-Waterman (llenado de la matriz y traceback).
  - `format.ts` — funciones chicas de formato (símbolos de flecha, signo de un número).

- **`interfaces/`** — tipos de TypeScript usados por varios archivos a la vez (`align.interface.ts`: la forma de una celda, un paso del traceback, el resultado de un alineamiento, etc.), separados de la lógica para que no se mezclen tipos con implementación.

- **`styles/`** — estilos que no pertenecen a un componente específico, sino a la página en sí (`Home.module.css`).
