import styles from "./algorithmInfo.module.css";

const ITEMS = [
  {
    title: "Needleman-Wunsch (1970) — alineamiento global",
    body: `Construye una matriz de programación dinámica de (m+1)×(n+1) celdas. La primera fila y columna se inicializan con múltiplos del gap, porque representan alinear una secuencia contra puros gaps. Cada celda toma el máximo entre venir de la diagonal (sumando match o mismatch), de arriba o de la izquierda (sumando el gap). El traceback arranca en la esquina inferior derecha y llega hasta el origen (0,0), por lo que alinea las dos secuencias completas de punta a punta. El algoritmo da la solución óptima, aunque puede existir más de un alineamiento distinto con el mismo puntaje máximo. No conviene usarlo si sólo interesa una región de similitud dentro de secuencias más largas o de longitudes muy distintas, porque penaliza los gaps fuera de esa zona.`,
  },
  {
    title: "Smith-Waterman (1981) — alineamiento local",
    body: `Usa la misma recurrencia que Needleman-Wunsch, pero con un piso en 0: si las tres opciones (diagonal, arriba, izquierda) dan negativo, la celda directamente vale 0, cortando ahí cualquier alineamiento que veía peor que empezar de nuevo. El traceback no arranca en una esquina de la matriz sino en la celda con el puntaje más alto de toda la tabla, y retrocede hasta llegar a la primera celda en 0. Así, la puntuación se computa sólo dentro del alineamiento encontrado, sin penalizar lo que queda afuera. Se usa cuando las secuencias tienen longitudes muy distintas o sólo se sospecha homología en un fragmento — por ejemplo, para detectar un dominio proteico conservado entre una proteína humana y otra vegetal, aunque el resto de la secuencia sea distinto.`,
  },
];

export default function AlgorithmInfo() {
  return (
    <section className={styles.container}>
      {ITEMS.map((item) => (
        <details key={item.title} className={styles.item}>
          <summary className={styles.summary}>{item.title}</summary>
          <p className={styles.body}>{item.body}</p>
        </details>
      ))}
    </section>
  );
}
