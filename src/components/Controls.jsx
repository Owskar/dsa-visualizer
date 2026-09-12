import React from "react";
import "./Controls.css";

export default function Controls({ player }) {
  const { playing, toggle, next, prev, reset, index, total, speed, setSpeed } = player;
  return (
    <div className="controls">
      <button className="btn btn-ghost" type="button" title="Reset" onClick={reset}>⟲ Reset</button>
      <button className="btn btn-ghost" type="button" title="Previous step" onClick={prev} disabled={index === 0}>◂ Back</button>
      <button className="btn btn-primary" type="button" onClick={toggle}>
        {playing ? "⏸ Pause" : "▶ Play"}
      </button>
      <button className="btn btn-ghost" type="button" title="Next step" onClick={next} disabled={index === total - 1}>Next ▸</button>
      <span className="step-counter">Step {index + 1} / {total}</span>
      <label className="speed-label">
        Speed
        <input
          type="range"
          min="150"
          max="1500"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </label>
    </div>
  );
}
