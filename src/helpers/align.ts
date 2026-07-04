import type {
  AlignResult,
  Cell,
  Move,
  PathStep,
  ScoreParams,
} from "@/interfaces/align.interface";

function subScore(x: string, y: string, p: ScoreParams) {
  return x === y ? p.match : p.mismatch;
}

export function needlemanWunsch(
  a: string,
  b: string,
  p: ScoreParams,
): AlignResult {
  const m = a.length;
  const n = b.length;
  const matrix: Cell[][] = Array.from({ length: m + 1 }, () =>
    Array.from({ length: n + 1 }, () => ({
      score: 0,
      sources: [],
      diagVal: null,
      upVal: null,
      leftVal: null,
    })),
  );

  for (let i = 0; i <= m; i++)
    matrix[i][0] = {
      score: i * p.gap,
      sources: i === 0 ? [] : ["up"],
      diagVal: null,
      upVal: null,
      leftVal: null,
    };
  for (let j = 0; j <= n; j++)
    matrix[0][j] = {
      score: j * p.gap,
      sources: j === 0 ? [] : ["left"],
      diagVal: null,
      upVal: null,
      leftVal: null,
    };

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const diag = matrix[i - 1][j - 1].score + subScore(a[i - 1], b[j - 1], p);
      const up = matrix[i - 1][j].score + p.gap;
      const left = matrix[i][j - 1].score + p.gap;
      const best = Math.max(diag, up, left);
      const sources: Move[] = [];
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

  const end = { i: m, j: n };
  const path = traceback(matrix, end);
  const { alignedA, alignedB } = buildAlignment(a, b, path);

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
      const rawBest = Math.max(diag, up, left, 0);
      const sources: Move[] = [];
      if (rawBest > 0) {
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
        best = rawBest;
        end = { i, j };
      }
    }
  }

  const path = traceback(matrix, end);
  const start = path.length > 0 ? { i: path[0].i, j: path[0].j } : end;

  const { alignedA, alignedB } = buildAlignment(a, b, path);

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

// Walks backward from `from` following each cell's canonical predecessor (sources[0])
// until a cell with no source is reached (the (0,0) origin for NW, or a zero cell for SW).
// Returns positions in forward order (start -> end) with `move` = how each cell was reached.
function traceback(
  matrix: Cell[][],
  from: { i: number; j: number },
): PathStep[] {
  const backward: { i: number; j: number }[] = [];
  let { i, j } = from;
  backward.push({ i, j });
  while (matrix[i][j].sources.length > 0) {
    const move = matrix[i][j].sources[0]; // canonical: diag > up > left
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
  const forward = backward.reverse();
  return forward.map((cell, idx) => ({
    ...cell,
    move: idx === 0 ? null : moveBetween(forward[idx - 1], cell),
  }));
}

function moveBetween(
  prev: { i: number; j: number },
  cur: { i: number; j: number },
): Move {
  if (cur.i === prev.i + 1 && cur.j === prev.j + 1) return "diag";
  if (cur.i === prev.i + 1) return "up";
  return "left";
}

function buildAlignment(a: string, b: string, path: PathStep[]) {
  let alignedA = "";
  let alignedB = "";
  for (let k = 1; k < path.length; k++) {
    const { move } = path[k];
    const prev = path[k - 1];
    if (move === "diag") {
      alignedA += a[prev.i];
      alignedB += b[prev.j];
    } else if (move === "up") {
      alignedA += a[prev.i];
      alignedB += "-";
    } else if (move === "left") {
      alignedA += "-";
      alignedB += b[prev.j];
    }
  }
  return { alignedA, alignedB };
}
