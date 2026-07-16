"use client";

// MatrixView es el componente que dibuja la matriz de alineamiento como una tabla interactiva en pantalla.
import { useMemo, useState, type MouseEvent } from "react";
import type { AlignResult } from "@/interfaces/align.interface";
import { arrowsFor } from "@/helpers/format";
import styles from "./matrixView.module.css";
import AlignmentView from "../AlignmentView";
import CellTooltip from "../CellTooltip";

interface MatrixViewProps {
  title: string;
  result: AlignResult; // el resultado del algoritmo: matriz, secuencias, camino óptimo, score
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

  // las celdas del camino óptimo (traceback), para resaltarlas con color
  const optimalSet = useMemo(
    () => new Set(path.map((s) => `${s.i},${s.j}`)),
    [path],
  );

  // las celdas vecinas que se usaron para calcular la celda bajo el mouse
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

      {/* la matriz, renderizada como tabla HTML */}
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
                  const onOptimal = optimalSet.has(key); // se resalta con color el camino óptimo
                  const isHovered = hover?.i === i && hover?.j === j;
                  const isConsidered = consideredSet.has(key); // celda vecina usada en el cálculo
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
                      onMouseEnter={(e) => handleCellEnter(e, i, j)} // al pasar el mouse, resalta vecinas y abre el tooltip
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

      {/* tooltip con el detalle de la cuenta de la celda hovereada */}
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

      {/* al pie: el resultado final, las dos secuencias ya alineadas */}
      <div>
        <p className={styles.alignmentLabel}>
          Alineamiento óptimo (traceback en rojo)
        </p>
        <AlignmentView alignedA={result.alignedA} alignedB={result.alignedB} />
      </div>
    </div>
  );
}
