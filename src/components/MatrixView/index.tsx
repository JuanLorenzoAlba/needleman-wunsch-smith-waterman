"use client";

import { useMemo, useState, type MouseEvent } from "react";
import type { AlignResult } from "@/interfaces/align.interface";
import { arrowsFor } from "@/helpers/format";
import styles from "./matrixView.module.css";
import AlignmentView from "../AlignmentView";
import CellTooltip from "../CellTooltip";

interface MatrixViewProps {
  title: string;
  result: AlignResult; // resultado completo del algoritmo: matriz, camino, score, secuencias
}

interface HoverState {
  i: number;
  j: number;
  x: number;
  y: number;
  align: "left" | "right"; // lado en el que se abre el tooltip para no salirse de pantalla
}

export default function MatrixView({ title, result }: MatrixViewProps) {
  const { a, b, matrix, path, params, algorithm, score } = result;
  const [hover, setHover] = useState<HoverState | null>(null);

  // convierte el path en un Set para saber rápido si una celda está en el traceback
  const optimalSet = useMemo(
    () => new Set(path.map((s) => `${s.i},${s.j}`)),
    [path],
  );

  // las tres celdas vecinas de la celda bajo el mouse (las que se usaron para calcularla)
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
    // decide si el tooltip se abre a la derecha o a la izquierda según el espacio disponible
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

                  // combina las clases según el estado de la celda
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
                      {/* flecha que indica de dónde vino el máximo */}
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

      {/* leyenda de colores */}
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

      {/* tooltip: aparece solo cuando hay una celda bajo el mouse */}
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

      {/* alineamiento final debajo de la matriz */}
      <div>
        <p className={styles.alignmentLabel}>
          Alineamiento óptimo (traceback en rojo)
        </p>
        <AlignmentView alignedA={result.alignedA} alignedB={result.alignedB} />
      </div>
    </div>
  );
}
