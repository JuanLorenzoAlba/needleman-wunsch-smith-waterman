import type {
  AlignResult,
  Cell,
  Move,
  PathStep,
  ScoreParams,
} from "@/interfaces/align.interface";

// compara dos caracteres y devuelve el puntaje correspondiente según los parámetros de puntuación
function subScore(x: string, y: string, p: ScoreParams) {
  return x === y ? p.match : p.mismatch;
}

export function needlemanWunsch(
  a: string,
  b: string,
  p: ScoreParams,
): AlignResult {
  const m = a.length; // longitud de la primera cadena
  const n = b.length; // longitud de la segunda cadena
  const matrix: Cell[][] = Array.from({ length: m + 1 }, () =>
    // (m+1) x (n+1)
    Array.from({ length: n + 1 }, () => ({
      score: 0,
      sources: [],
      diagVal: null,
      upVal: null,
      leftVal: null,
    })),
  );

  // Iteracion sobre toda la primea fila (j = 0)
  for (let i = 0; i <= m; i++)
    matrix[i][0] = {
      score: i * p.gap,
      sources: i === 0 ? [] : ["up"],
      diagVal: null,
      upVal: null,
      leftVal: null,
    };

  // Iteracion sobre toda la primea columna (i = 0)
  for (let j = 0; j <= n; j++)
    matrix[0][j] = {
      score: j * p.gap,
      sources: j === 0 ? [] : ["left"],
      diagVal: null,
      upVal: null,
      leftVal: null,
    };

  // Para cada celda en la posición (i, j) el código calcula tres trayectorias convergentes posibles
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const diag = matrix[i - 1][j - 1].score + subScore(a[i - 1], b[j - 1], p);
      const up = matrix[i - 1][j].score + p.gap;
      const left = matrix[i][j - 1].score + p.gap;
      const best = Math.max(diag, up, left); // selecciona el mejor puntaje de las tres trayectorias posibles
      const sources: Move[] = []; // Arreglo para almacenar las trayectorias que llevan al mejor puntaje
      if (diag === best) sources.push("diag");
      if (up === best) sources.push("up");
      if (left === best) sources.push("left");
      matrix[i][j] = {
        score: best,
        sources,
        diagVal: diag,
        upVal: up,
        leftVal: left,
      };
    }
  }

  const end = { i: m, j: n }; // La celda final es la esquina inferior derecha de la matriz
  const path = traceback(matrix, end); // Se realiza el traceback para obtener la ruta de alineamiento desde la celda final hasta la inicial
  const { alignedA, alignedB } = buildAlignment(a, b, path); // Se construye el alineamiento final a partir de la ruta obtenida en el traceback

  return {
    algorithm: "nw",
    a,
    b,
    params: p,
    matrix,
    score: matrix[m][n].score,
    end,
    start: { i: 0, j: 0 },
    path,
    alignedA,
    alignedB,
  };
}

export function smithWaterman(
  a: string,
  b: string,
  p: ScoreParams,
): AlignResult {
  const m = a.length;
  const n = b.length;
  const matrix: Cell[][] = Array.from({ length: m + 1 }, () =>
    // (m+1) x (n+1)
    Array.from({ length: n + 1 }, () => ({
      score: 0,
      sources: [],
      diagVal: null,
      upVal: null,
      leftVal: null,
    })),
  );

  let best = 0;
  let end = { i: 0, j: 0 };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const diag = matrix[i - 1][j - 1].score + subScore(a[i - 1], b[j - 1], p);
      const up = matrix[i - 1][j].score + p.gap;
      const left = matrix[i][j - 1].score + p.gap;
      const rawBest = Math.max(diag, up, left, 0); // clave de Smith-Waterman: nunca baja de 0, así "corta" el alineamiento acá.
      const sources: Move[] = [];
      if (rawBest > 0) {
        // Solo se registran orígenes si el puntaje es positivo (si es 0, no hay de dónde vino).
        if (diag === rawBest) sources.push("diag");
        if (up === rawBest) sources.push("up");
        if (left === rawBest) sources.push("left");
      }
      matrix[i][j] = {
        score: rawBest,
        sources,
        diagVal: diag,
        upVal: up,
        leftVal: left,
      };

      if (rawBest > best) {
        // si encontramos un nuevo mejor puntaje, actualizamos la celda final
        best = rawBest;
        end = { i, j };
      }
    }
  }

  const path = traceback(matrix, end); // Se realiza el traceback para obtener la ruta de alineamiento desde la celda final hasta la inicial
  const start = path.length > 0 ? { i: path[0].i, j: path[0].j } : end; // Si el camino es vacío, el inicio es la celda final (esto puede ocurrir si no hay alineamiento)

  const { alignedA, alignedB } = buildAlignment(a, b, path); // Se construye el alineamiento final a partir de la ruta obtenida en el traceback

  return {
    algorithm: "sw",
    a,
    b,
    params: p,
    matrix,
    score: best,
    end,
    start,
    path,
    alignedA,
    alignedB,
  };
}

function traceback(
  matrix: Cell[][],
  from: { i: number; j: number },
): PathStep[] {
  const backward: { i: number; j: number }[] = []; // arreglo para almacenar los pasos del camino hacia atrás
  let { i, j } = from;
  backward.push({ i, j });
  while (matrix[i][j].sources.length > 0) {
    // mientras haya fuentes, seguimos retrocediendo
    const move = matrix[i][j].sources[0]; // prioridades: diag > up > left
    if (move === "diag") {
      i -= 1;
      j -= 1;
    } else if (move === "up") {
      i -= 1;
    } else {
      j -= 1;
    }
    backward.push({ i, j });
  }
  const forward = backward.reverse(); // invertimos el camino para que vaya desde el inicio hasta el final
  return forward.map((cell, idx) => ({
    ...cell,
    move: idx === 0 ? null : moveBetween(forward[idx - 1], cell), // calculamos el movimiento que nos llevó a esta celda desde la anterior
  }));
}

function moveBetween(
  prev: { i: number; j: number }, // celda anterior
  cur: { i: number; j: number }, // celda actual
): Move {
  if (cur.i === prev.i + 1 && cur.j === prev.j + 1) return "diag"; // si ambos índices aumentan, es un movimiento diagonal
  if (cur.i === prev.i + 1) return "up"; // si solo el índice i aumenta, es un movimiento hacia arriba
  return "left"; // si solo el índice j aumenta, es un movimiento hacia la izquierda
}

function buildAlignment(a: string, b: string, path: PathStep[]) {
  let alignedA = "";
  let alignedB = "";

  // k=1 porque el primer elemento no tiene movimiento asociado
  for (let k = 1; k < path.length; k++) {
    const { move } = path[k];
    const prev = path[k - 1]; // la letra viene de la casilla anterior, no de la actual

    if (move === "diag") {
      // match o mismatch: avanzan las dos
      alignedA += a[prev.i];
      alignedB += b[prev.j];
    } else if (move === "up") {
      // gap en B
      alignedA += a[prev.i];
      alignedB += "-";
    } else if (move === "left") {
      // gap en A
      alignedA += "-";
      alignedB += b[prev.j];
    }
  }

  return { alignedA, alignedB };
}
