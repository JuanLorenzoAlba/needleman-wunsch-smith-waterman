// CellTooltip es el cuadro flotante que aparece cuando pasás el mouse por una celda de la matriz.
import type { Cell, ScoreParams } from "@/interfaces/align.interface";
import { fmtSigned } from "@/helpers/format";
import Quadrant from "../Quadrant";
import styles from "./cellTooltip.module.css";

interface CellTooltipProps {
  a: string;
  b: string;
  params: ScoreParams;
  algorithm: "nw" | "sw";
  matrix: Cell[][];
  i: number; // la celda puntual sobre la que estás parado
  j: number;
  x: number; // posición del mouse, para posicionarse pegado a él
  y: number;
  align: "left" | "right"; // de qué lado abrirse para no salirse de la pantalla
}

export default function CellTooltip({
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
  const isEdge = i === 0 || j === 0; // celda del borde de la matriz: no tiene los 3 candidatos

  const style = {
    top: y,
    ...(align === "left"
      ? { left: x + 8 }
      : { right: window.innerWidth - x + 8 }),
  };

  // si la celda es del borde, muestra un texto distinto explicando por qué
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
        // muestra de dónde salió el puntaje: los 3 candidatos, uno por uno con el cálculo hecho
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
