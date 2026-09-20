/* ==========================================================================
   viz.js — shared drawing toolkit for all algorithm visualizations.
   Every algorithm module (src/data/algorithms/*.js) uses these helpers to
   draw into an <svg> DOM node directly (imperative DOM, not JSX) — the
   <Stage> React component just hands it a ref in a useEffect.

   IMPORTANT — read this before writing a new algorithm module:
   Always build each algorithm's step list with `makeSnap()` below. It
   exists because of a real bug: earlier versions had `draw(svg)` closures
   that read a shared mutable variable (the array/stack/tree/etc.) directly,
   which meant every step ended up showing the algorithm's FINAL state
   (since buildSteps() runs the whole algorithm to completion before ever
   returning). `makeSnap()` forces a snapshot to be taken eagerly, at the
   moment the step is recorded, so this class of bug can't happen again.
   See test/algorithms.test.mjs for the regression tests that guard this.
   ========================================================================== */

const SVG_NS = "http://www.w3.org/2000/svg";

/**
 * Returns a `snap(desc, lines, extra)` function that eagerly clones the
 * current state (via `cloneState()`, called immediately — not lazily) and
 * pushes a step whose `draw(svg)` renders that frozen snapshot.
 *
 * @param {Array} steps       the steps array being built up
 * @param {() => any} cloneState   returns a fresh, independent copy of whatever
 *                             mutable state this algorithm is tracking
 * @param {(svg, snapshot, extra) => void} drawFn   renders one snapshot
 */
export function makeSnap(steps, cloneState, drawFn) {
  return (desc, lines, extra) => {
    const snapshot = cloneState(); // captured NOW — this is the whole point
    steps.push({ desc, lines, draw: (svg) => drawFn(svg, snapshot, extra || {}) });
  };
}

// Fallback palette — used when CSS custom properties can't be resolved
// (e.g. under jsdom in tests, which has no real stylesheet cascade), and as
// the values that ship in src/index.css's :root (light theme).
const FALLBACK_COLORS = {
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
  paperRaised: "#ffffff",
};

function cssVar(name, fallback) {
  if (typeof document === "undefined" || typeof getComputedStyle === "undefined") return fallback;
  try {
    const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return val || fallback;
  } catch {
    return fallback;
  }
}

// COLORS reads live CSS variable values on every access (not once at import
// time), so it automatically follows the light/dark theme toggle — see
// useTheme.js, which just flips a `data-theme` attribute on <html> and lets
// every CSS variable (and therefore every drawing color) update from that.
export const COLORS = {
  get ink() { return cssVar("--ink", FALLBACK_COLORS.ink); },
  get inkFaint() { return cssVar("--ink-faint", FALLBACK_COLORS.inkFaint); },
  get blue() { return cssVar("--blue", FALLBACK_COLORS.blue); },
  get blueFaint() { return cssVar("--blue-faint", FALLBACK_COLORS.blueFaint); },
  get teal() { return cssVar("--teal", FALLBACK_COLORS.teal); },
  get tealFaint() { return cssVar("--teal-faint", FALLBACK_COLORS.tealFaint); },
  get red() { return cssVar("--red", FALLBACK_COLORS.red); },
  get redFaint() { return cssVar("--red-faint", FALLBACK_COLORS.redFaint); },
  get amber() { return cssVar("--amber", FALLBACK_COLORS.amber); },
  get amberFaint() { return cssVar("--amber-faint", FALLBACK_COLORS.amberFaint); },
  get paper() { return cssVar("--paper", FALLBACK_COLORS.paper); },
  // The color every "unhighlighted" box/node/cell should default to — a
  // raised surface sitting on top of the page background. Never use a
  // literal "#fff" for this: it stays bright white in dark mode while
  // everything else goes dark, and the (now light-colored) ink text drawn
  // on top of it becomes nearly unreadable.
  get paperRaised() { return cssVar("--paper-raised", FALLBACK_COLORS.paperRaised); },
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
    fill: opts.fill || COLORS.paperRaised,
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
  const g = svgEl("g", { "data-role": "pointer-tag", "data-x": Math.round(x), "data-y": Math.round(y) });
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
    fill: opts.fill || COLORS.paperRaised,
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
  const placed = opts.placed || new Set();

  arr.forEach((val, i) => {
    const x = startX + i * (barW + gap);
    const barH = (val / maxVal) * maxBarH;
    const y = baseY - barH;
    let fill = COLORS.paperRaised, stroke = COLORS.ink;
    if (opts.foundIndex === i) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (swap.includes(i)) { fill = COLORS.redFaint; stroke = COLORS.red; }
    else if (compare.includes(i)) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    else if (opts.sortedFrom !== undefined && i >= opts.sortedFrom) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (placed.has(i)) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (eliminated.has(i)) { fill = COLORS.paperRaised; stroke = COLORS.inkFaint; }

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
    if (opts.directed) {
      svg.appendChild(arrow(nodes[a].x, nodes[a].y, nodes[b].x, nodes[b].y, { color: COLORS.ink, shorten: 24, width: 1.6 }));
    } else {
      svg.appendChild(svgEl("line", {
        x1: nodes[a].x, y1: nodes[a].y, x2: nodes[b].x, y2: nodes[b].y,
        stroke: COLORS.ink, "stroke-opacity": 0.55, "stroke-width": 2,
      }));
    }
  });

  Object.entries(nodes).forEach(([id, p]) => {
    let fill = COLORS.paperRaised, stroke = COLORS.ink;
    if (id === opts.current) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    else if (visited.has(id)) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (frontier.includes(id)) { fill = COLORS.amberFaint; stroke = COLORS.amber; }
    svg.appendChild(circle(p.x, p.y, 22, { fill, stroke, strokeWidth: 2.5, label: id, fontSize: 16, dataRole: "graph-node" }));
  });

  if (opts.frontierLabel) {
    const label = `${opts.frontierLabel}: [${frontier.join(", ")}]`;
    const el = textEl(w / 2, h - 40, label, { mono: true, size: 14, weight: 700, fill: COLORS.amber });
    el.setAttribute("data-role", "frontier-label");
    svg.appendChild(el);
  }
  if (opts.order && opts.order.length) {
    const el = textEl(w / 2, h - 18, `Visited order: ${opts.order.join(" → ")}`, { mono: true, size: 13, weight: 700, fill: COLORS.teal });
    el.setAttribute("data-role", "order-label");
    svg.appendChild(el);
  }
  if (opts.caption) {
    const el = textEl(w / 2, 22, opts.caption, { mono: true, size: 12, weight: 700, fill: COLORS.blue });
    el.setAttribute("data-role", "caption-label");
    svg.appendChild(el);
  }
}

/**
 * Generic binary tree renderer — works for a BST, a heap, or a plain binary
 * tree, since it makes no assumption about ordering. Nodes are plain
 * `{ value, left, right }` objects. Highlighting compares by VALUE, not
 * object identity, so callers can freely deep-clone snapshots (see
 * `cloneBinaryTree` below) without breaking `opts.current`/`opts.visited`.
 *
 * opts: { highlight: Set<value>, visited: Set<value>, current: value,
 *         order: [values], emptyLabel: string }
 */
export function layoutBinaryTree(root, { xGap = 64, yGap = 78, top = 46, width = 760 } = {}) {
  const pos = new Map();
  let counter = 0;
  (function inorder(node) {
    if (!node) return;
    inorder(node.left);
    pos.set(node, { xi: counter++ });
    inorder(node.right);
  })(root);
  const n = counter;
  const startX = width / 2 - ((n - 1) * xGap) / 2;
  (function assignY(node, depth) {
    if (!node) return;
    const p = pos.get(node);
    p.x = startX + p.xi * xGap;
    p.y = top + depth * yGap;
    assignY(node.left, depth + 1);
    assignY(node.right, depth + 1);
  })(root, 0);
  return pos;
}

export function cloneBinaryTree(node) {
  if (!node) return null;
  return { value: node.value, left: cloneBinaryTree(node.left), right: cloneBinaryTree(node.right) };
}

export function drawBinaryTree(svg, w, h, root, opts = {}) {
  clearStage(svg, w, h);
  drawGrid(svg, w, h);
  if (!root) {
    svg.appendChild(textEl(w / 2, h / 2, opts.emptyLabel || "Empty tree", { mono: true, size: 15, fill: COLORS.inkFaint }));
    return;
  }
  const pos = layoutBinaryTree(root, { width: w });
  const highlightSet = opts.highlight || new Set();
  const visited = opts.visited || new Set();
  const currentValue = opts.current;

  (function drawEdges(node) {
    if (!node) return;
    const p = pos.get(node);
    [node.left, node.right].forEach((child) => {
      if (child) {
        const cp = pos.get(child);
        svg.appendChild(arrow(p.x, p.y + 20, cp.x, cp.y - 20, { color: COLORS.ink, arrowHead: false }));
      }
    });
    drawEdges(node.left);
    drawEdges(node.right);
  })(root);

  (function drawNodes(node) {
    if (!node) return;
    const p = pos.get(node);
    let fill = COLORS.paperRaised, stroke = COLORS.ink;
    if (node.value === currentValue) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    else if (visited.has(node.value)) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (highlightSet.has(node.value)) { fill = COLORS.amberFaint; stroke = COLORS.amber; }
    svg.appendChild(circle(p.x, p.y, 20, { fill, stroke, strokeWidth: 2.5, label: node.value, dataRole: "tree-node" }));
    drawNodes(node.left);
    drawNodes(node.right);
  })(root);

  if (opts.order && opts.order.length) {
    const el = textEl(w / 2, h - 20, `Visited order: ${opts.order.join(" → ")}`, { mono: true, size: 13, fill: COLORS.teal, weight: 700 });
    el.setAttribute("data-role", "order-label");
    svg.appendChild(el);
  }
}

/**
 * Renders a 2D grid of labeled cells — used by DP problems (Knapsack, LCS,
 * etc.) to show the DP table filling in. `matrix` is a 2D array of values
 * (numbers or ""); `rowLabels`/`colLabels` are optional axis headers.
 * opts: { current: [r,c], filled: Set<"r,c">, highlight: Set<"r,c"> }
 */
export function drawTable(svg, w, h, matrix, opts = {}) {
  clearStage(svg, w, h);
  const rows = matrix.length;
  const cols = matrix[0] ? matrix[0].length : 0;
  const hasRowLabels = Boolean(opts.rowLabels);
  const hasColLabels = Boolean(opts.colLabels);
  const labelW = hasRowLabels ? 44 : 0;
  const labelH = hasColLabels ? 30 : 0;
  const cellW = Math.min(52, (w - 20 - labelW) / cols);
  const cellH = Math.min(40, (h - 20 - labelH) / rows);
  const startX = (w - (cols * cellW + labelW)) / 2 + labelW;
  const startY = (h - (rows * cellH + labelH)) / 2 + labelH;
  const filled = opts.filled || new Set();
  const highlight = opts.highlight || new Set();
  const current = opts.current;

  if (hasColLabels) {
    opts.colLabels.forEach((label, c) => {
      svg.appendChild(textEl(startX + c * cellW + cellW / 2, startY - labelH / 2, String(label), { mono: true, size: 11, fill: COLORS.inkFaint }));
    });
  }
  if (hasRowLabels) {
    opts.rowLabels.forEach((label, r) => {
      svg.appendChild(textEl(startX - labelW / 2, startY + r * cellH + cellH / 2, String(label), { mono: true, size: 11, fill: COLORS.inkFaint }));
    });
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      const x = startX + c * cellW;
      const y = startY + r * cellH;
      let fill = COLORS.paperRaised, stroke = COLORS.ink;
      if (current && current[0] === r && current[1] === c) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
      else if (highlight.has(key)) { fill = COLORS.amberFaint; stroke = COLORS.amber; }
      else if (filled.has(key)) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
      const val = matrix[r][c];
      const cell = box(x, y, cellW, cellH, { fill, stroke, strokeWidth: 1.5, rx: 2 });
      svg.appendChild(cell);
      if (val !== "" && val !== undefined && val !== null) {
        const label = textEl(x + cellW / 2, y + cellH / 2, String(val), { mono: true, size: 13, weight: 700 });
        label.setAttribute("data-role", "table-cell");
        label.setAttribute("data-cell", key);
        svg.appendChild(label);
      }
    }
  }
}

/**
 * A single labeled row of character/digit boxes — used for "peel a digit off
 * a number", "walk a string", etc. Shared by several Basics problems
 * (Reverse a Number, Palindrome Number, Count Digits, Armstrong Number).
 * opts: { highlightLast, dataRole, boxColor }
 */
export function drawCharBoxRow(svg, centerX, y, chars, label, opts = {}) {
  const BOX = 38, GAP = 5;
  const totalW = chars.length * BOX + Math.max(0, chars.length - 1) * GAP;
  const startX = centerX - totalW / 2;
  if (label) {
    svg.appendChild(textEl(startX - 14, y + BOX / 2, label, { anchor: "end", size: 12, fill: COLORS.inkFaint }));
  }
  chars.forEach((ch, i) => {
    const x = startX + i * (BOX + GAP);
    const isLast = opts.highlightLast && i === chars.length - 1;
    const fill = isLast ? (opts.boxColor === "red" ? COLORS.redFaint : COLORS.blueFaint) : COLORS.paperRaised;
    const stroke = isLast ? (opts.boxColor === "red" ? COLORS.red : COLORS.blue) : COLORS.ink;
    svg.appendChild(box(x, y, BOX, BOX, { fill, stroke, strokeWidth: 2, label: ch, fontSize: 16, dataRole: opts.dataRole }));
  });
  if (chars.length === 0) {
    svg.appendChild(textEl(centerX, y + BOX / 2, "(empty)", { mono: true, size: 13, fill: COLORS.inkFaint }));
  }
}

/**
 * Two-row "peel a digit off the end" visualization: a number shrinking on
 * top as digits are extracted into a result building up below. Shared by
 * Reverse a Number, Count Digits, Palindrome Number, Armstrong Number.
 * opts: { remainingLabel, extractedLabel, caption }
 */
export function drawNumberPeel(svg, w, h, remaining, extracted, opts = {}) {
  clearStage(svg, w, h);
  drawGrid(svg, w, h);
  const centerX = w / 2;
  drawCharBoxRow(svg, centerX, h / 2 - 50, String(remaining).split(""), opts.remainingLabel || "Remaining", {
    highlightLast: true, boxColor: "red", dataRole: "remaining-digit",
  });
  drawCharBoxRow(svg, centerX, h / 2 + 20, String(extracted).split(""), opts.extractedLabel || "Built so far", {
    highlightLast: true, boxColor: "blue", dataRole: "extracted-digit",
  });
  if (opts.caption) {
    const el = textEl(centerX, h - 20, opts.caption, { mono: true, size: 13, weight: 700, fill: COLORS.teal });
    el.setAttribute("data-role", "caption-label");
    svg.appendChild(el);
  }
}
