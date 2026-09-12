import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ALGO_BY_ID, ALGORITHMS, defaultStepsFor } from "../data/algorithms/index.js";
import { getInputConfig } from "../data/inputParsers.js";
import { usePlayer } from "../hooks/usePlayer.js";
import NotesPanel from "./NotesPanel.jsx";
import Stage from "./Stage.jsx";
import Controls from "./Controls.jsx";
import CodePanel from "./CodePanel.jsx";
import Playground from "./Playground.jsx";
import "./AlgorithmPage.css";

const EMPTY_STEP = { desc: "", lines: {}, draw: () => {} };

export default function AlgorithmPage({ progress }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const algo = ALGO_BY_ID[id] || null;

  // All hooks are called unconditionally, on every render, regardless of
  // whether `algo` resolved — the "not found" case is only handled in JSX.
  const inputConfig = useMemo(() => (algo ? getInputConfig(algo) : null), [algo]);
  const [inputValue, setInputValue] = useState(() => (inputConfig ? inputConfig.defaultValue : ""));
  const [steps, setSteps] = useState(() => (algo ? defaultStepsFor(algo) : [EMPTY_STEP]));
  const [lang, setLang] = useState("js");

  const player = usePlayer(steps);

  // Re-seed local state whenever the route's :id changes to a different algorithm
  useEffect(() => {
    if (!algo) return;
    const cfg = getInputConfig(algo);
    setInputValue(cfg ? cfg.defaultValue : "");
    setSteps(defaultStepsFor(algo));
    setLang("js");
  }, [algo]);

  if (!algo) {
    return (
      <main className="algo-page">
        <p>Couldn't find that algorithm. <Link to="/">Back to the list</Link>.</p>
      </main>
    );
  }

  const idx = ALGORITHMS.findIndex((a) => a.id === algo.id);
  const prevAlgo = ALGORITHMS[idx - 1];
  const nextAlgo = ALGORITHMS[idx + 1];

  function applyInput() {
    if (!inputConfig) return;
    const args = inputConfig.parse(inputValue);
    if (!args) {
      window.alert("Couldn't read that input — reverting to the default example.");
      setInputValue(inputConfig.defaultValue);
      setSteps(defaultStepsFor(algo));
      return;
    }
    setSteps(algo.buildSteps(...args));
  }

  return (
    <main className="algo-page">
      <div className="algo-breadcrumb">
        <Link to="/">← All topics</Link>
      </div>

      <header className="algo-header">
        <div>
          <div className="algo-header-top">
            <span className="pill">{algo.category}</span>
            <span className={`difficulty difficulty-${algo.difficulty}`}>{algo.difficulty}</span>
          </div>
          <h1>{algo.title}</h1>
          <p className="algo-blurb">{algo.blurb}</p>
        </div>
        <div className="algo-header-actions">
          <span className="complexity-tag">{algo.complexity}</span>
          <label className="mark-done">
            <input
              type="checkbox"
              checked={progress.isDone(algo.id)}
              onChange={() => progress.toggle(algo.id)}
            />
            Mark as done
          </label>
        </div>
      </header>

      <NotesPanel algo={algo} />

      {inputConfig && (
        <div className="input-row">
          <label htmlFor="inputField">{inputConfig.label}</label>
          <div className="input-row-controls">
            <input
              id="inputField"
              type="text"
              spellCheck={false}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyInput()}
            />
            <button type="button" className="btn btn-secondary" onClick={applyInput}>Apply</button>
          </div>
        </div>
      )}

      <div className="workbench">
        <section className="pane stage-pane">
          <Stage step={player.step} />
          <p className="step-desc">{player.step ? player.step.desc : ""}</p>
          <Controls player={player} />
        </section>

        <section className="pane code-pane">
          <CodePanel
            algo={algo}
            lang={lang}
            setLang={setLang}
            activeLine={player.step ? player.step.lines[lang] : null}
          />
          <Playground seedCode={algo.codes.js + "\n\n// Try calling it and logging the result:\n"} />
        </section>
      </div>

      <nav className="algo-pagination">
        {prevAlgo ? (
          <button type="button" className="btn btn-ghost" onClick={() => navigate(`/algo/${prevAlgo.id}`)}>← {prevAlgo.title}</button>
        ) : <span />}
        {nextAlgo ? (
          <button type="button" className="btn btn-ghost" onClick={() => navigate(`/algo/${nextAlgo.id}`)}>{nextAlgo.title} →</button>
        ) : <span />}
      </nav>
    </main>
  );
}
