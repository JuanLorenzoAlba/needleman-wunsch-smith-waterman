export type Move = "diag" | "up" | "left";

export interface ScoreParams {
  match: number;
  mismatch: number;
  gap: number;
}

export interface Cell {
  score: number;
  sources: Move[];
  diagVal: number | null;
  upVal: number | null;
  leftVal: number | null;
}

export interface PathStep {
  i: number;
  j: number;
  move: Move | null;
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
  path: PathStep[];
  alignedA: string;
  alignedB: string;
}
