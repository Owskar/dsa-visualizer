# DSA Visualizer (React)

A visual, notes-first way to learn Data Structures & Algorithms. A Striver
A2Z-sheet-style landing page lists every problem grouped by topic with
difficulty tags and a "mark as done" progress tracker (saved locally in your
browser). Selecting a problem opens a detail page with:

- **Theory notes** — intuition, step-by-step approach, a worked dry run, and common pitfalls, written like lecture notes
- **A step-by-step visual animation** (Play / Pause / Step / Reset / Speed) of the algorithm actually running
- **Real source code** in JavaScript, Python, and C++, with the currently-executing line highlighted in sync with the animation
- **A live JS Playground** — an editable, actually-runnable code editor with real `console.log` output
- An editable input box so you can try your own array / target / start node / etc.

## What's included

**Sorting** — Bubble Sort, Selection Sort
**Searching** — Linear Search, Binary Search
**Stacks & Queues** — Stack (push/pop/peek), Queue (enqueue/dequeue/peek)
**Linked Lists** — Singly Linked List (insert at head/tail, delete)
**Trees** — Binary Search Tree (insert + inorder traversal)
**Graphs** — Breadth-First Search, Depth-First Search
**Recursion** — Factorial (call stack visualization)

## Running it

Requires [Node.js](https://nodejs.org) 18+ and npm.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

### Production build

```bash
npm run build      # outputs static files to dist/
npm run preview    # serves dist/ locally to sanity-check the build
```

`dist/` is a fully static site (HTML/CSS/JS) — deploy it to any static host
(Netlify, Vercel, GitHub Pages, S3, nginx, etc.). It uses hash-based routing
(`#/algo/bubble-sort`), so it works from any subdirectory or `file://` context
without needing server-side URL rewrite rules — though note that browsers
block ES module `<script>` tags from `file://` directly, so serve `dist/`
through any static file server (`npm run preview`, `npx serve dist`,
`python3 -m http.server` from inside `dist/`, etc.) rather than double-clicking
`dist/index.html`.

### Running the tests

```bash
npm test
```

This runs two independent suites:

- **`test/algorithms.test.mjs`** — pure data-layer checks (no React): every
  algorithm's `buildSteps()` produces valid steps, every step's `draw()`
  actually executes against a real SVG node (via jsdom), every JS/Python/C++
  line reference is in range, every algorithm has complete notes, and custom
  input parsing works (and correctly rejects garbage input).
- **`test/run-ssr.mjs`** — renders `LandingPage` and every `AlgorithmPage` to
  static HTML via `react-dom/server` (bundled on the fly with esbuild) and
  asserts the expected content is present: all 11 problems and 7 categories
  on the landing page; notes, code tabs, controls, and the playground toggle
  on every detail page; a graceful message for an unknown algorithm id.

## Project structure

```
dsa-react/
├── index.html                    Vite entry HTML
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx                   React root
│   ├── App.jsx                     Router setup (HashRouter, 2 routes)
│   ├── index.css                    Design tokens + shared base styles
│   ├── hooks/
│   │   ├── usePlayer.js              Step playback controller (play/pause/step/speed)
│   │   └── useProgress.js             localStorage-backed "done" tracking
│   ├── data/
│   │   ├── viz.js                     Shared SVG drawing toolkit (bars, nodes, arrows, graphs)
│   │   ├── inputParsers.js             Per-algorithm custom-input parsing config
│   │   └── algorithms/
│   │       ├── index.js                Registry: ALGORITHMS, ALGO_BY_ID, groupedAlgorithms()
│   │       ├── bubbleSort.js
│   │       ├── selectionSort.js
│   │       ├── linearSearch.js
│   │       ├── binarySearch.js
│   │       ├── stack.js
│   │       ├── queue.js
│   │       ├── linkedList.js
│   │       ├── bst.js
│   │       ├── graphBFS.js
│   │       ├── graphDFS.js
│   │       └── recursion.js
│   └── components/
│       ├── Header.jsx
│       ├── LandingPage.jsx             Striver-sheet-style topic list + progress
│       ├── AlgorithmPage.jsx            Notes + Stage + CodePanel + Playground
│       ├── NotesPanel.jsx                Intuition / Approach / Dry run / Pitfalls
│       ├── Stage.jsx                      Imperative SVG canvas (see below)
│       ├── Controls.jsx                    Play/Pause/Step/Reset/Speed
│       ├── CodePanel.jsx                    Tabbed JS/Python/C++ with line highlight
│       ├── Playground.jsx                    Editable + runnable JS editor
│       └── ProgressBar.jsx
└── test/
    ├── algorithms.test.mjs            Data-layer test (Node + jsdom, no React)
    ├── ssr-entry.jsx                    SSR render assertions (source)
    └── run-ssr.mjs                       Bundles ssr-entry.jsx with esbuild and runs it
```

### Why `Stage` draws imperatively instead of with JSX

Each algorithm's `draw(svgNode)` function manipulates a real SVG DOM node
directly (`document.createElementNS`, `.appendChild`, etc.) using the shared
helpers in `src/data/viz.js`, rather than returning JSX. The `<Stage>`
component just hands it a ref in a `useEffect`:

```jsx
useEffect(() => {
  if (svgRef.current && step) step.draw(svgRef.current);
}, [step]);
```

This keeps every algorithm module **framework-agnostic** — the exact same
`viz.js` + algorithm files could be dropped into a plain HTML/JS page with no
React at all. It's also why `test/algorithms.test.mjs` can test every
algorithm's visualization logic in plain Node (via jsdom) without needing to
render any React component.

## Adding a new algorithm

1. Copy the closest existing file in `src/data/algorithms/`.
2. Write `buildSteps(input, ...)` — run the algorithm for real, and after each
   meaningful state change, push a step: `{ desc, lines: {js, py, cpp}, draw(svg) }`.
   `lines` points at the 1-indexed line in each `codes` string that's
   "executing" at that step.
3. Write the real `codes.js` / `codes.py` / `codes.cpp` source strings.
4. Implement `draw(svg)` using the shared helpers in `viz.js`
   (`drawBars`, `drawGraph`, `box`, `circle`, `arrow`, `tag`, etc.), or write
   a small local draw function like `stack.js` / `linkedList.js` do for
   layouts the shared helpers don't cover.
5. Write `notes: { intuition, approach: [...], dryRun, pitfalls: [...] }`.
6. Add `id`, `title`, `category`, `difficulty`, `tags`, `blurb`, `complexity`,
   `defaultInput` (and `defaultTarget` if relevant), then export it as default.
7. Register it in `src/data/algorithms/index.js` (import + add to `ALGORITHMS`).
8. If it needs a custom-input box, add a case in `src/data/inputParsers.js`.
9. Run `npm test` — it will automatically pick up and validate the new
   algorithm (steps, line mappings, notes completeness, SSR rendering) with
   no test-file changes needed, since both suites iterate `ALGORITHMS`.

## Progress tracking

"Mark as done" checkboxes (on both the landing page and each detail page)
are persisted to `localStorage` under the key `dsa-visualizer-progress-v1` —
no backend, no account. Clearing your browser's site data resets progress.
