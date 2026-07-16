// AlignmentView muestra el resultado final: las dos secuencias ya alineadas, una debajo de la otra.
import styles from "./alignmentView.module.css";

interface AlignmentViewProps {
  alignedA: string; // secuencia A ya armada (con guiones donde hay un espacio vacío)
  alignedB: string; // secuencia B ya armada
}

const kindColor = {
  match: styles.kindMatch,
  mismatch: styles.kindMismatch,
  gap: styles.kindGap,
};

export default function AlignmentView({
  alignedA,
  alignedB,
}: AlignmentViewProps) {
  if (!alignedA)
    return <p className={styles.empty}>Sin alineamiento todavía.</p>;

  // compara letra por letra: coinciden, no coinciden, o hay un espacio vacío
  const cells = alignedA.split("").map((ca, idx) => {
    const cb = alignedB[idx];
    const kind =
      ca === "-" || cb === "-" ? "gap" : ca === cb ? "match" : "mismatch";
    return { ca, cb, kind: kind as keyof typeof kindColor };
  });

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {cells.map((c, idx) => (
          <span
            key={`a-${idx}`}
            className={`${styles.cell} ${kindColor[c.kind]}`} // pinta de un color según coincidan o no
          >
            {c.ca}
          </span>
        ))}
      </div>
      <div className={styles.row}>
        {cells.map((c, idx) => (
          <span
            key={`b-${idx}`}
            className={`${styles.cell} ${kindColor[c.kind]}`}
          >
            {c.cb}
          </span>
        ))}
      </div>
      {/* referencia de qué significa cada color */}
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${kindColor.match}`} /> match
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${kindColor.mismatch}`} /> mismatch
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${kindColor.gap}`} /> gap
        </span>
      </div>
    </div>
  );
}
