// Quadrant es el recuadrito chico que se repite 4 veces dentro del tooltip (Diagonal / Arriba / Izquierda / Resultado).
import type { ReactNode } from "react";
import styles from "./quadrant.module.css";

interface QuadrantProps {
  label: string;
  active: boolean; // si le dicen que esa fue la opción ganadora, se pinta de otro color para que se note
  children: ReactNode;
}

// no calcula nada — solo recibe un título y un texto, y los muestra
export default function Quadrant({ label, active, children }: QuadrantProps) {
  return (
    <div
      className={`${styles.quadrant} ${active ? styles.quadrantActive : styles.quadrantInactive}`} // acá se pinta distinto si ganó
    >
      <p className={styles.quadrantLabel}>{label}</p>
      <p>{children}</p>
    </div>
  );
}
