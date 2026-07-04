import type { Cell } from "@/interfaces/align.interface";

export function arrowsFor(sources: Cell["sources"]) {
  const symbol = { diag: "↖", up: "↑", left: "←" } as const;
  return sources.map((m) => symbol[m]).join("");
}

export function fmtSigned(n: number) {
  return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
}
