import type { ReactNode } from "react";
import styles from "./quadrant.module.css";

interface QuadrantProps {
  label: string;
  active: boolean;
  children: ReactNode;
}

export default function Quadrant({ label, active, children }: QuadrantProps) {
  return (
    <div
      className={`${styles.quadrant} ${active ? styles.quadrantActive : styles.quadrantInactive}`}
    >
      <p className={styles.quadrantLabel}>{label}</p>
      <p>{children}</p>
    </div>
  );
}
