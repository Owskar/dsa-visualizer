import React, { useEffect, useRef } from "react";
import "./Stage.css";

/**
 * The visualization surface. Deliberately NOT declarative — each algorithm's
 * step.draw(svgNode) function manipulates the real SVG DOM directly (see
 * src/data/viz.js), which is what lets every algorithm module stay
 * framework-agnostic and reuse the exact same drawing helpers.
 */
export default function Stage({ step, theme }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && step && typeof step.draw === "function") {
      step.draw(svgRef.current);
    }
    // `theme` isn't read directly here, but every draw() call reads live CSS
    // variable values (see COLORS in viz.js) — so re-running draw() when the
    // theme flips is what makes the visualization actually follow the toggle
    // instead of staying stuck in whichever theme was active when this step
    // was first drawn.
  }, [step, theme]);

  return (
    <div className="stage-wrap">
      <svg ref={svgRef} className="stage-svg" role="img" aria-label="Algorithm visualization" />
    </div>
  );
}
