"use client";

// page.tsx (la pantalla principal) es el que junta todo.
import { useMemo, useState } from "react";
import { needlemanWunsch, smithWaterman } from "@/helpers/align";
import type { ScoreParams } from "@/interfaces/align.interface";
import MatrixView from "@/components/MatrixView";
import AlgorithmInfo from "@/components/AlgorithmInfo";
import styles from "@/styles/Home.module.css";

const DEFAULT_A = "GATTACA";
const DEFAULT_B = "GCATGCA";

export default function Home() {
  // lo que el usuario escribe: las dos secuencias y los tres valores de puntuación
  const [seqA, setSeqA] = useState(DEFAULT_A);
  const [seqB, setSeqB] = useState(DEFAULT_B);

  const [match, setMatch] = useState(1);
  const [mismatch, setMismatch] = useState(-1);
  const [gap, setGap] = useState(-2);

  const a = seqA.toUpperCase().replace(/[^A-Z]/g, "");
  const b = seqB.toUpperCase().replace(/[^A-Z]/g, "");
  const params: ScoreParams = useMemo(
    () => ({ match, mismatch, gap }),
    [match, mismatch, gap],
  );

  // cada vez que algo de eso cambia, se recalculan los dos resultados
  const nwResult = useMemo(
    () => (a && b ? needlemanWunsch(a, b, params) : null),
    [a, b, params],
  );
  const swResult = useMemo(
    () => (a && b ? smithWaterman(a, b, params) : null),
    [a, b, params],
  );

  return (
    <div className={styles.root}>
      {/* encabezado */}
      <header className={styles.header}>
        <h1 className={styles.title}>Needleman-Wunsch vs Smith-Waterman</h1>
        <p className={styles.subtitle}>
          Alineamiento global (NW) vs local (SW), lado a lado. Matriz de
          programación dinámica, traceback y explicación paso a paso.
        </p>
      </header>

      {/* acordeón de explicación */}
      <AlgorithmInfo />

      {/* controles: secuencias y parámetros de puntuación */}
      <section className={styles.controls}>
        <label className={styles.label}>
          Secuencia A
          <input
            className={styles.input}
            value={seqA}
            onChange={(e) => setSeqA(e.target.value)}
            spellCheck={false}
          />
        </label>
        <label className={styles.label}>
          Secuencia B
          <input
            className={styles.input}
            value={seqB}
            onChange={(e) => setSeqB(e.target.value)}
            spellCheck={false}
          />
        </label>
        <label className={styles.label}>
          Match
          <input
            type="number"
            className={styles.numberInput}
            value={match}
            onChange={(e) => setMatch(Number(e.target.value))}
          />
        </label>
        <label className={styles.label}>
          Mismatch
          <input
            type="number"
            className={styles.numberInput}
            value={mismatch}
            onChange={(e) => setMismatch(Number(e.target.value))}
          />
        </label>
        <label className={styles.label}>
          Gap
          <input
            type="number"
            className={styles.numberInput}
            value={gap}
            onChange={(e) => setGap(Number(e.target.value))}
          />
        </label>
      </section>

      {/* las dos matrices lado a lado, una por algoritmo */}
      {!a || !b ? (
        <p className={styles.emptyState}>
          Ingresá ambas secuencias para calcular los alineamientos.
        </p>
      ) : (
        <section className={styles.resultsGrid}>
          {nwResult && (
            <MatrixView title="Needleman-Wunsch (global)" result={nwResult} />
          )}
          {swResult && (
            <MatrixView title="Smith-Waterman (local)" result={swResult} />
          )}
        </section>
      )}

      <footer className={styles.footer}>
        Hecho con Next.js. Creado para la entrega del final de Bioinformática
        (UNAJ).
      </footer>
    </div>
  );
}
