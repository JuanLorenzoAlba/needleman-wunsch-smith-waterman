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

Next.js (App Router) + TypeScript. Todo el cálculo corre en el cliente (`src/lib/align.ts`), sin backend. Estilos en CSS plano, separados por componente en `src/styles/`.
