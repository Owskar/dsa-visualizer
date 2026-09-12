import React, { useEffect, useRef } from "react";
import "./CodePanel.css";

const LANG_LABELS = { js: "JavaScript", py: "Python", cpp: "C++" };

export default function CodePanel({ algo, lang, setLang, activeLine }) {
  const containerRef = useRef(null);
  const lines = (algo.codes[lang] || "").split("\n");

  useEffect(() => {
    if (!containerRef.current || !activeLine) return;
    const row = containerRef.current.querySelector(`[data-line="${activeLine}"]`);
    if (row && typeof row.scrollIntoView === "function") {
      row.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [activeLine, lang]);

  return (
    <div className="code-panel-inner">
      <div className="lang-tabs">
        {Object.keys(algo.codes).map((l) => (
          <button
            key={l}
            type="button"
            className={"lang-tab" + (l === lang ? " active" : "")}
            onClick={() => setLang(l)}
          >
            {LANG_LABELS[l] || l}
          </button>
        ))}
      </div>
      <pre className="code-block" ref={containerRef}>
        {lines.map((line, i) => (
          <div
            key={i}
            data-line={i + 1}
            className={"code-line" + (activeLine === i + 1 ? " active" : "")}
          >
            <span className="line-num">{i + 1}</span>
            <span className="line-content">{line.length ? line : " "}</span>
          </div>
        ))}
      </pre>
    </div>
  );
}
