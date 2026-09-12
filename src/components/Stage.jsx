import React, { useEffect, useRef } from "react";
import "./Stage.css";

/**
 * The visualization surface. Deliberately NOT declarative — each algorithm's
 * step.draw(svgNode) function manipulates the real SVG DOM directly (see
 * src/data/viz.js), which is what lets every algorithm module stay
 * framework-agnostic and reuse the exact same drawing helpers.
 */
export default function Stage({ step }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current && step && typeof step.draw === "function") {
      step.draw(svgRef.current);
    }
  }, [step]);

  return (
    <div className="stage-wrap">
      <svg ref={svgRef} className="stage-svg" role="img" aria-label="Algorithm visualization" />
    </div>
  );
}
