"use client";

import { useMemo, useState } from "react";
import { needlemanWunsch, smithWaterman, ScoreParams } from "@/lib/align";
import MatrixView from "@/components/MatrixView";
import styles from "@/styles/Home.module.css";

const DEFAULT_A = "GATTACA";
const DEFAULT_B = "GCATGCA";

export default function Home() {
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
      <header className={styles.header}>
        <h1 className={styles.title}>Needleman-Wunsch vs Smith-Waterman</h1>
        <p className={styles.subtitle}>
          Alineamiento global (NW) vs local (SW), lado a lado. Matriz de
          programación dinámica, traceback y explicación paso a paso.
        </p>
      </header>

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
        Hecho con Next.js. Basado en la idea de{" "}
        <a
          className={styles.footerLink}
          href="https://bioboot.github.io/bimm143_W20/class-material/nw/"
          target="_blank"
          rel="noreferrer"
        >
          bioboot.github.io/bimm143_W20
        </a>
        .
      </footer>
    </div>
  );
}
