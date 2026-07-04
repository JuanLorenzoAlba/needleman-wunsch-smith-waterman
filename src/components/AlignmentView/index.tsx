import styles from "./alignmentView.module.css";

interface AlignmentViewProps {
  alignedA: string;
  alignedB: string;
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
            className={`${styles.cell} ${kindColor[c.kind]}`}
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
