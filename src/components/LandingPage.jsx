import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { ALGORITHMS, CATEGORY_ORDER, groupedAlgorithms } from "../data/algorithms/index.js";
import ProgressBar from "./ProgressBar.jsx";
import "./LandingPage.css";

export default function LandingPage({ progress }) {
  const { isDone, toggle } = progress;
  const groups = useMemo(() => groupedAlgorithms(), []);
  const totalDone = ALGORITHMS.filter((a) => isDone(a.id)).length;
  const stepNumber = useMemo(() => new Map(CATEGORY_ORDER.map((c, i) => [c, i + 1])), []);

  return (
    <main className="landing">
      <section className="hero">
        <p className="hero-eyebrow">A beginner-to-advanced DSA roadmap, visualized</p>
        <h1>Learn Data Structures &amp; Algorithms — visually.</h1>
        <p className="hero-sub">
          A step-by-step roadmap from your first sort to graphs and dynamic programming —
          structured the way sheets like takeUforward's A2Z course lay out a DSA
          course, but every problem here comes with a running visualization next to
          its real code. Read the intuition and approach like lecture notes, then
          watch the exact same algorithm run in JavaScript, Python, or C++.
        </p>
        <div className="hero-progress">
          <ProgressBar done={totalDone} total={ALGORITHMS.length} label="Overall progress" />
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><strong>{ALGORITHMS.length}</strong><span>problems</span></div>
          <div className="hero-stat"><strong>{groups.size}</strong><span>roadmap steps</span></div>
          <div className="hero-stat"><strong>3</strong><span>languages each</span></div>
        </div>
      </section>

      <section className="sheet">
        {[...groups.entries()].map(([category, algos]) => {
          if (!algos.length) return null;
          const doneCount = algos.filter((a) => isDone(a.id)).length;
          return (
            <div className="topic-section" key={category}>
              <div className="topic-section-head">
                <h2><span className="step-badge">Step {stepNumber.get(category)}</span>{category}</h2>
                <span className="topic-section-count">{doneCount} / {algos.length} done</span>
              </div>
              <ProgressBar done={doneCount} total={algos.length} />

              <div className="sheet-table" role="table">
                <div className="sheet-row sheet-row-head" role="row">
                  <span className="col-check" aria-hidden="true" />
                  <span className="col-title">Problem</span>
                  <span className="col-tags">Pattern / Tags</span>
                  <span className="col-level">Level</span>
                  <span className="col-diff">Difficulty</span>
                  <span className="col-action" aria-hidden="true" />
                </div>

                {algos.map((algo) => {
                  const checked = isDone(algo.id);
                  return (
                    <div className={`sheet-row${checked ? " is-done" : ""}`} role="row" key={algo.id}>
                      <span className="col-check">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggle(algo.id)}
                          aria-label={`Mark ${algo.title} as done`}
                        />
                      </span>
                      <span className="col-title">
                        <Link to={`/algo/${algo.id}`} className="problem-link">{algo.title}</Link>
                        <span className="problem-blurb">{algo.blurb}</span>
                      </span>
                      <span className="col-tags">
                        {algo.tags.map((t) => <span className="pill" key={t}>{t}</span>)}
                      </span>
                      <span className="col-level">
                        <span className={`level level-${algo.level}`}>{algo.level}</span>
                      </span>
                      <span className="col-diff">
                        <span className={`difficulty difficulty-${algo.difficulty}`}>{algo.difficulty}</span>
                      </span>
                      <span className="col-action">
                        <Link to={`/algo/${algo.id}`} className="btn btn-secondary btn-small">Visualize →</Link>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      <footer className="site-footer">
        <p>
          Structured as a learning roadmap, inspired by the step-by-step format of sheets
          like takeUforward's A2Z DSA course. Progress is saved locally in your browser.
        </p>
      </footer>
    </main>
  );
}
