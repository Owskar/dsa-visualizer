import React from "react";
import "./ProgressBar.css";

export default function ProgressBar({ done, total, label }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    <div className="progress-bar-wrap">
      {label && (
        <div className="progress-bar-label">
          <span>{label}</span>
          <span className="progress-bar-count">{done} / {total}</span>
        </div>
      )}
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
