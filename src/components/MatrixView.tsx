"use client";

import { useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { AlignResult, Cell, ScoreParams } from "@/lib/align";
import styles from "@/styles/MatrixView.module.css";
import AlignmentView from "./AlignmentView";

interface MatrixViewProps {
  title: string;
  result: AlignResult;
}

interface HoverState {
  i: number;
  j: number;
  x: number;
  y: number;
  align: "left" | "right";
}

export default function MatrixView({ title, result }: MatrixViewProps) {
  const { a, b, matrix, path, params, algorithm, score } = result;
  const [hover, setHover] = useState<HoverState | null>(null);

  const optimalSet = useMemo(
    () => new Set(path.map((s) => `${s.i},${s.j}`)),
    [path],
  );

  const consideredSet = useMemo(() => {
    const s = new Set<string>();
    if (!hover || hover.i === 0 || hover.j === 0) return s;
    const { i, j } = hover;
    s.add(`${i - 1},${j - 1}`);
    s.add(`${i - 1},${j}`);
    s.add(`${i},${j - 1}`);
    return s;
  }, [hover]);

  function handleCellEnter(
    e: MouseEvent<HTMLTableCellElement>,
    i: number,
    j: number,
  ) {
    const r = e.currentTarget.getBoundingClientRect();
    const align: "left" | "right" =
      r.right + 490 > window.innerWidth ? "right" : "left";
    setHover({ i, j, x: align === "left" ? r.right : r.left, y: r.top, align });
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.scoreLabel}>
          Score óptimo: <strong className={styles.scoreValue}>{score}</strong>
        </span>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.gapHeader}>-</th>
              <th className={styles.gapHeader}>-</th>
              {b.split("").map((ch, j) => (
                <th key={j} className={styles.seqHeader}>
                  {ch}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <th
                  className={`${styles.rowHeaderBase} ${i === 0 ? styles.rowHeaderGap : styles.rowHeaderSeq}`}
                >
                  {i === 0 ? "-" : a[i - 1]}
                </th>
                {row.map((cell, j) => {
                  const key = `${i},${j}`;
                  const onOptimal = optimalSet.has(key);
                  const isHovered = hover?.i === i && hover?.j === j;
                  const isConsidered = consideredSet.has(key);
                  const cls = [
                    styles.cellBase,
                    onOptimal ? styles.cellOptimal : "",
                    isHovered
                      ? styles.cellHovered
                      : isConsidered
                        ? styles.cellConsidered
                        : "",
                  ].join(" ");
                  return (
                    <td
                      key={j}
                      className={cls}
                      onMouseEnter={(e) => handleCellEnter(e, i, j)}
                      onMouseLeave={() => setHover(null)}
                    >
                      {cell.sources.length > 0 && (
                        <span className={styles.arrow}>
                          {arrowsFor(cell.sources)}
                        </span>
                      )}
                      {cell.score}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span
            className={`${styles.legendSwatch} ${styles.legendSwatchOptimal}`}
          />{" "}
          traceback óptimo
        </span>
        <span className={styles.legendItem}>
          <span
            className={`${styles.legendSwatch} ${styles.legendSwatchHover}`}
          />{" "}
          celda bajo el mouse
        </span>
        <span className={styles.legendItem}>
          <span
            className={`${styles.legendSwatch} ${styles.legendSwatchConsidered}`}
          />{" "}
          celdas usadas en su cálculo
        </span>
        <span>↖ diagonal · ↑ arriba · ← izquierda (dirección ganadora)</span>
      </div>

      {hover && (
        <CellTooltip
          a={a}
          b={b}
          params={params}
          algorithm={algorithm}
          matrix={matrix}
          i={hover.i}
          j={hover.j}
          x={hover.x}
          y={hover.y}
          align={hover.align}
        />
      )}

      <div>
        <p className={styles.alignmentLabel}>
          Alineamiento óptimo (traceback en rojo)
        </p>
        <AlignmentView alignedA={result.alignedA} alignedB={result.alignedB} />
      </div>
    </div>
  );
}

interface CellTooltipProps {
  a: string;
  b: string;
  params: ScoreParams;
  algorithm: "nw" | "sw";
  matrix: Cell[][];
  i: number;
  j: number;
  x: number;
  y: number;
  align: "left" | "right";
}

function CellTooltip({
  a,
  b,
  params,
  algorithm,
  matrix,
  i,
  j,
  x,
  y,
  align,
}: CellTooltipProps) {
  const cell = matrix[i][j];
  const isEdge = i === 0 || j === 0;

  const style = {
    top: y,
    ...(align === "left"
      ? { left: x + 8 }
      : { right: window.innerWidth - x + 8 }),
  };

  let edgeText = "";
  if (isEdge) {
    if (i === 0 && j === 0) edgeText = "Origen de la matriz.";
    else if (algorithm === "nw")
      edgeText = `Gap acumulado: ${i === 0 ? j : i} × ${params.gap} = ${cell.score}`;
    else
      edgeText =
        "Fila/columna base en 0 (Smith-Waterman siempre arranca de nuevo en 0).";
  }

  const x1 = i > 0 ? a[i - 1] : "";
  const y1 = j > 0 ? b[j - 1] : "";
  const isMatch = x1 === y1;

  return (
    <div style={style} className={styles.tooltipBox}>
      <p className={styles.tooltipTitle}>
        H[{i}][{j}] = {cell.score}
      </p>
      {isEdge ? (
        <p>{edgeText}</p>
      ) : (
        <div className={styles.tooltipGrid}>
          <Quadrant label="Diagonal" active={cell.sources.includes("diag")}>
            {matrix[i - 1][j - 1].score}{" "}
            {fmtSigned(isMatch ? params.match : params.mismatch)} (
            {isMatch ? "match" : "mismatch"} {x1}-{y1}) = {cell.diagVal}
          </Quadrant>
          <Quadrant label="Arriba" active={cell.sources.includes("up")}>
            {matrix[i - 1][j].score} {fmtSigned(params.gap)} (gap) ={" "}
            {cell.upVal}
          </Quadrant>
          <Quadrant label="Izquierda" active={cell.sources.includes("left")}>
            {matrix[i][j - 1].score} {fmtSigned(params.gap)} (gap) ={" "}
            {cell.leftVal}
          </Quadrant>
          <Quadrant label="Resultado" active>
            {algorithm === "sw" && cell.score === 0
              ? "Reinicia en 0"
              : `Máximo = ${cell.score}`}
          </Quadrant>
        </div>
      )}
    </div>
  );
}

function arrowsFor(sources: Cell["sources"]) {
  const symbol = { diag: "↖", up: "↑", left: "←" } as const;
  return sources.map((m) => symbol[m]).join("");
}

function fmtSigned(n: number) {
  return n >= 0 ? `+ ${n}` : `- ${Math.abs(n)}`;
}

function Quadrant({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.quadrant} ${active ? styles.quadrantActive : styles.quadrantInactive}`}
    >
      <p className={styles.quadrantLabel}>{label}</p>
      <p>{children}</p>
    </div>
  );
}
