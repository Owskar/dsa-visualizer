/* ==========================================================================
   viz.js — shared drawing toolkit for all algorithm visualizations.
   Every algorithm module (src/data/algorithms/*.js) uses these helpers to
   draw into an <svg> DOM node directly (imperative DOM, not JSX) — the
   <Stage> React component just hands it a ref in a useEffect.
   ========================================================================== */

const SVG_NS = "http://www.w3.org/2000/svg";

export const COLORS = {
  ink: "#22201b",
  inkFaint: "#8a8578",
  blue: "#2657a6",
  blueFaint: "#dbe6f5",
  teal: "#1d7874",
  tealFaint: "#dcefed",
  red: "#d64550",
  redFaint: "#f9dfe1",
  amber: "#c98a2c",
  amberFaint: "#f5e6cc",
  paper: "#faf7f0",
};

export function svgEl(tag, attrs = {}, children = []) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v !== undefined && v !== null) el.setAttribute(k, v);
  }
  for (const c of children) el.appendChild(c);
  return el;
}

export function textEl(x, y, str, opts = {}) {
  const t = svgEl("text", {
    x, y,
    "text-anchor": opts.anchor || "middle",
    "dominant-baseline": opts.baseline || "middle",
    fill: opts.fill || COLORS.ink,
    "font-family": opts.mono ? "'IBM Plex Mono', monospace" : "'IBM Plex Sans', sans-serif",
    "font-size": opts.size || 14,
    "font-weight": opts.weight || 400,
  });
  t.textContent = str;
  return t;
}

export function clearStage(svg, w, h) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
}

export function drawGrid(svg, w, h, step = 24) {
  const g = svgEl("g", { class: "grid" });
  for (let x = 0; x <= w; x += step) {
    g.appendChild(svgEl("line", { x1: x, y1: 0, x2: x, y2: h, stroke: COLORS.ink, "stroke-opacity": 0.05 }));
  }
  for (let y = 0; y <= h; y += step) {
    g.appendChild(svgEl("line", { x1: 0, y1: y, x2: w, y2: y, stroke: COLORS.ink, "stroke-opacity": 0.05 }));
  }
  svg.appendChild(g);
}

export function box(x, y, w, h, opts = {}) {
  const g = svgEl("g", {});
  g.appendChild(svgEl("rect", {
    x, y, width: w, height: h,
    rx: opts.rx ?? 6,
    fill: opts.fill || "#fff",
    stroke: opts.stroke || COLORS.ink,
    "stroke-width": opts.strokeWidth ?? 1.5,
  }));
  if (opts.label !== undefined) {
    const labelEl = textEl(x + w / 2, y + h / 2, String(opts.label), {
      mono: true, size: opts.fontSize || 16, weight: 600, fill: opts.textColor || COLORS.ink,
    });
    // data-role lets tests (and devtools) find rendered values without depending
    // on pixel position — see test/algorithms.test.mjs
    if (opts.dataRole) labelEl.setAttribute("data-role", opts.dataRole);
    g.appendChild(labelEl);
  }
  return g;
}

export function tag(x, y, str, color = COLORS.blue) {
  const g = svgEl("g", {});
  const w = Math.max(28, str.length * 8 + 12);
  g.appendChild(svgEl("rect", { x: x - w / 2, y: y - 11, width: w, height: 22, rx: 11, fill: color }));
  g.appendChild(textEl(x, y + 1, str, { fill: "#fff", size: 12, weight: 700 }));
  return g;
}

export function arrow(x1, y1, x2, y2, opts = {}) {
  const color = opts.color || COLORS.ink;
  const g = svgEl("g", {});
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const shorten = opts.shorten ?? 0;
  const ex = x2 - Math.cos(angle) * shorten;
  const ey = y2 - Math.sin(angle) * shorten;
  g.appendChild(svgEl("line", {
    x1, y1, x2: ex, y2: ey,
    stroke: color, "stroke-width": opts.width || 2,
    "stroke-dasharray": opts.dashed ? "5,4" : undefined,
  }));
  if (opts.arrowHead !== false) {
    const size = 8;
    const p1x = ex - size * Math.cos(angle - Math.PI / 7);
    const p1y = ey - size * Math.sin(angle - Math.PI / 7);
    const p2x = ex - size * Math.cos(angle + Math.PI / 7);
    const p2y = ey - size * Math.sin(angle + Math.PI / 7);
    g.appendChild(svgEl("polygon", { points: `${ex},${ey} ${p1x},${p1y} ${p2x},${p2y}`, fill: color }));
  }
  return g;
}

export function circle(x, y, r, opts = {}) {
  const g = svgEl("g", {});
  g.appendChild(svgEl("circle", {
    cx: x, cy: y, r,
    fill: opts.fill || "#fff",
    stroke: opts.stroke || COLORS.ink,
    "stroke-width": opts.strokeWidth ?? 2,
  }));
  if (opts.label !== undefined) {
    const labelEl = textEl(x, y, String(opts.label), { mono: true, size: opts.fontSize || 15, weight: 700, fill: opts.textColor || COLORS.ink });
    if (opts.dataRole) labelEl.setAttribute("data-role", opts.dataRole);
    g.appendChild(labelEl);
  }
  return g;
}

export function drawBars(svg, w, h, arr, opts = {}) {
  clearStage(svg, w, h);
  drawGrid(svg, w, h);
  const pad = 40;
  const n = arr.length;
  const gap = 12;
  const barW = Math.min(56, (w - pad * 2 - gap * (n - 1)) / n);
  const maxVal = Math.max(...arr, 1);
  const baseY = h - 50;
  const maxBarH = h - 110;
  const totalW = n * barW + (n - 1) * gap;
  const startX = (w - totalW) / 2;
  const compare = opts.compare || [];
  const swap = opts.swap || [];
  const eliminated = opts.eliminated || new Set();

  arr.forEach((val, i) => {
    const x = startX + i * (barW + gap);
    const barH = (val / maxVal) * maxBarH;
    const y = baseY - barH;
    let fill = "#fff", stroke = COLORS.ink;
    if (opts.foundIndex === i) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (swap.includes(i)) { fill = COLORS.redFaint; stroke = COLORS.red; }
    else if (compare.includes(i)) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    else if (opts.sortedFrom !== undefined && i >= opts.sortedFrom) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (eliminated.has(i)) { fill = "#fff"; stroke = COLORS.inkFaint; }

    const g = box(x, y, barW, barH, { fill, stroke, strokeWidth: 2, rx: 4 });
    svg.appendChild(g);
    const valueLabel = textEl(x + barW / 2, y - 14, String(val), { mono: true, weight: 700, size: 14,
      fill: eliminated.has(i) ? COLORS.inkFaint : COLORS.ink });
    valueLabel.setAttribute("data-role", "bar-value");
    valueLabel.setAttribute("data-index", String(i));
    svg.appendChild(valueLabel);
    const indexLabel = textEl(x + barW / 2, baseY + 16, String(i), { mono: true, size: 11, fill: COLORS.inkFaint });
    indexLabel.setAttribute("data-role", "bar-index");
    svg.appendChild(indexLabel);

    if (opts.pointers && opts.pointers[i] !== undefined) {
      svg.appendChild(tag(x + barW / 2, baseY + 38, opts.pointers[i],
        opts.pointerColors && opts.pointerColors[i] ? opts.pointerColors[i] : COLORS.blue));
    }
  });
}

export function drawGraph(svg, w, h, nodes, edges, opts = {}) {
  clearStage(svg, w, h);
  drawGrid(svg, w, h);
  const visited = opts.visited || new Set();
  const frontier = opts.frontier || [];

  edges.forEach(([a, b]) => {
    svg.appendChild(svgEl("line", {
      x1: nodes[a].x, y1: nodes[a].y, x2: nodes[b].x, y2: nodes[b].y,
      stroke: COLORS.ink, "stroke-opacity": 0.55, "stroke-width": 2,
    }));
  });

  Object.entries(nodes).forEach(([id, p]) => {
    let fill = "#fff", stroke = COLORS.ink;
    if (id === opts.current) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    else if (visited.has(id)) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (frontier.includes(id)) { fill = COLORS.amberFaint; stroke = COLORS.amber; }
    svg.appendChild(circle(p.x, p.y, 22, { fill, stroke, strokeWidth: 2.5, label: id, fontSize: 16, dataRole: "graph-node" }));
  });

  if (opts.frontierLabel) {
    const label = `${opts.frontierLabel}: [${frontier.join(", ")}]`;
    svg.appendChild(textEl(w / 2, h - 40, label, { mono: true, size: 14, weight: 700, fill: COLORS.amber }));
  }
  if (opts.order && opts.order.length) {
    svg.appendChild(textEl(w / 2, h - 18, `Visited order: ${opts.order.join(" → ")}`, { mono: true, size: 13, weight: 700, fill: COLORS.teal }));
  }
}
