import React from "react";
import "./NotesPanel.css";

export default function NotesPanel({ algo }) {
  const { notes } = algo;
  if (!notes) return null;

  return (
    <section className="notes-panel">
      <div className="notes-block">
        <h3>Intuition</h3>
        <p>{notes.intuition}</p>
      </div>

      <div className="notes-grid">
        <div className="notes-block">
          <h3>Approach</h3>
          <ol>
            {notes.approach.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </div>

        <div className="notes-block">
          <h3>Dry run</h3>
          <p className="dry-run">{notes.dryRun}</p>

          <h3 className="pitfalls-heading">Common pitfalls &amp; things to remember</h3>
          <ul>
            {notes.pitfalls.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
