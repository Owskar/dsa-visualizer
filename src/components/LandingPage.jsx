import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ALGORITHMS, ALGO_BY_ID } from "../data/algorithms/index.js";
import { ROADMAP, TOTAL_ITEMS } from "../data/roadmap.js";
import ProgressBar from "./ProgressBar.jsx";
import "./LandingPage.css";

// Unbuilt items are tracked under their own "sheet-<num>" key so a learner
// can check off problems they've solved elsewhere, even before this site
// has a full interactive page for them. Built items keep using the
// algorithm's own id, so progress stays in sync with its detail page.
function progressKey(item) {
  return item.builtId || `sheet-${item.num}`;
}

export default function LandingPage({ progress }) {
  const { isDone, toggle } = progress;
  const [expanded, setExpanded] = useState(() => new Set([ROADMAP[0]?.id]));
  const [onlyBuilt, setOnlyBuilt] = useState(false);

  const totalDone = useMemo(() => {
    let count = 0;
    for (const sec of ROADMAP) {
      for (const sub of sec.subsections) {
        for (const item of sub.items) {
          if (isDone(progressKey(item))) count++;
        }
      }
    }
    return count;
  }, [isDone]);

  const builtDone = ALGORITHMS.filter((a) => isDone(a.id)).length;

  function toggleSection(id) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main className="landing">
      <section className="hero">
        <p className="hero-eyebrow">The full A2Z DSA roadmap, visualized</p>
        <h1>Learn Data Structures &amp; Algorithms — visually.</h1>
        <p className="hero-sub">
          The complete {TOTAL_ITEMS}-problem roadmap, structured the way
          sheets like takeUforward's A2Z DSA course lay out a course — 18
          steps from your first "Hello World" to graphs, tries, and dynamic
          programming. {ALGORITHMS.length} problems so far have a full
          interactive page: read the intuition and approach like lecture
          notes, then watch the exact same algorithm run in JavaScript,
          Python, or C++. The rest are listed as a checklist you can track
          here while more get built out.
        </p>
        <div className="hero-progress">
          <ProgressBar done={totalDone} total={TOTAL_ITEMS} label="Overall progress (all problems)" />
        </div>
        <div className="hero-stats">
          <div className="hero-stat"><strong>{TOTAL_ITEMS}</strong><span>total problems</span></div>
          <div className="hero-stat"><strong>{ALGORITHMS.length}</strong><span>fully interactive</span></div>
          <div className="hero-stat"><strong>{ROADMAP.length}</strong><span>roadmap steps</span></div>
        </div>
        <label className="filter-toggle">
          <input type="checkbox" checked={onlyBuilt} onChange={(e) => setOnlyBuilt(e.target.checked)} />
          Show only problems with a full interactive page ({ALGORITHMS.length})
        </label>
      </section>

      <section className="sheet">
        {ROADMAP.map((sec, secIndex) => {
          const allItems = sec.subsections.flatMap((s) => s.items);
          const doneCount = allItems.filter((it) => isDone(progressKey(it))).length;
          const builtCount = allItems.filter((it) => it.builtId).length;
          if (onlyBuilt && builtCount === 0) return null;
          const isOpen = expanded.has(sec.id);

          return (
            <div className="topic-section" key={sec.id}>
              <button type="button" className="topic-section-head" onClick={() => toggleSection(sec.id)}>
                <span className="topic-section-title">
                  <span className={"chevron" + (isOpen ? " open" : "")}>▸</span>
                  <span className="step-badge">Step {secIndex + 1}</span>
                  <h2>{sec.name}</h2>
                </span>
                <span className="topic-section-count">
                  {builtCount > 0 && <span className="built-count">{builtCount} interactive</span>}
                  {doneCount} / {allItems.length} done
                </span>
              </button>

              {isOpen && (
                <>
                  <ProgressBar done={doneCount} total={allItems.length} />
                  {sec.subsections.map((sub, subIndex) => {
                    const visibleItems = onlyBuilt ? sub.items.filter((it) => it.builtId) : sub.items;
                    if (!visibleItems.length) return null;
                    return (
                      <div className="subsection" key={subIndex}>
                        {sub.name && <h3 className="subsection-title">{sub.name}</h3>}
                        <div className="sheet-table" role="table">
                          {visibleItems.map((item) => {
                            const key = progressKey(item);
                            const checked = isDone(key);
                            const algo = item.builtId ? ALGO_BY_ID[item.builtId] : null;
                            return (
                              <div className={`sheet-row${checked ? " is-done" : ""}${!algo ? " not-built" : ""}`} role="row" key={item.num}>
                                <span className="col-check">
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => toggle(key)}
                                    aria-label={`Mark "${item.title}" as done`}
                                  />
                                </span>
                                <span className="col-num">{item.num}</span>
                                <span className="col-title">
                                  {algo ? (
                                    <Link to={`/algo/${algo.id}`} className="problem-link">{algo.title}</Link>
                                  ) : (
                                    <span className="problem-text">{item.title}</span>
                                  )}
                                  {algo && <span className="problem-blurb">{algo.blurb}</span>}
                                </span>
                                <span className="col-tags">
                                  {algo ? algo.tags.map((t) => <span className="pill" key={t}>{t}</span>) : null}
                                </span>
                                <span className="col-level">
                                  {algo ? <span className={`level level-${algo.level}`}>{algo.level}</span> : null}
                                </span>
                                <span className="col-diff">
                                  {algo
                                    ? <span className={`difficulty difficulty-${algo.difficulty}`}>{algo.difficulty}</span>
                                    : <span className="not-built-pill">Not yet built</span>}
                                </span>
                                <span className="col-action">
                                  {algo && <Link to={`/algo/${algo.id}`} className="btn btn-secondary btn-small">Visualize →</Link>}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
      </section>

      <footer className="site-footer">
        <p>
          Structured as a complete learning roadmap, inspired by the step-by-step
          format of sheets like takeUforward's A2Z DSA course. Progress is saved
          locally in your browser — nothing is sent anywhere.
        </p>
      </footer>
    </main>
  );
}
