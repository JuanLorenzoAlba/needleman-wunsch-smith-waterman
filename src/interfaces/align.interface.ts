export type Move = "diag" | "up" | "left";

export interface ScoreParams {
  match: number;
  mismatch: number;
  gap: number;
}

export interface Cell {
  score: number;
  sources: Move[]; // directions that achieve `score` (ties kept for explanation)
  diagVal: number | null;
  upVal: number | null;
  leftVal: number | null;
}

export interface PathStep {
  i: number;
  j: number;
  move: Move | null; // move taken to ARRIVE at (i,j), null for the path's start cell
}

export interface AlignResult {
  algorithm: "nw" | "sw";
  a: string;
  b: string;
  params: ScoreParams;
  matrix: Cell[][]; // (m+1) x (n+1)
  score: number;
  end: { i: number; j: number };
  start: { i: number; j: number };
  path: PathStep[]; // ordered start -> end (forward, left to right)
  alignedA: string;
  alignedB: string;
}
