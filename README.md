# Needleman-Wunsch vs Smith-Waterman

App en Next.js para visualizar y comparar los dos algoritmos clásicos de alineamiento de secuencias.

Inspirada en [bioboot.github.io/bimm143_W20](https://bioboot.github.io/bimm143_W20/class-material/nw/), con agregados propios:

- Needleman-Wunsch (global) y Smith-Waterman (local) lado a lado, mismos datos de entrada.
- Matriz de programación dinámica con traceback óptimo resaltado en rojo.
- Hover sobre cada celda: muestra cómo se calculó (diagonal, arriba, izquierda y cuál ganó).
- Modo "camino manual": click en celdas para armar tu propio traceback y comparar su score contra el óptimo.
- Alineamiento final resaltado por color (match / mismatch / gap).
- Explicación automática paso a paso del traceback.
- Control de match, mismatch y gap en vivo.

## Desarrollo

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. Todo el cálculo corre en el cliente (`src/lib/align.ts`), sin backend.
