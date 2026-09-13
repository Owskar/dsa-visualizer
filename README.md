# DSA Visualizer (React)

The complete takeUforward-style A2Z DSA roadmap — all 474 problems across 18
steps, structured exactly the way that sheet lays out a course, from
"Learn the Basics" through Graphs, Dynamic Programming, and Tries. Every
problem is trackable with a "mark as done" checkbox (saved locally in your
browser), and a growing subset of them (27 so far) have a full interactive
page:

- **Theory notes** — intuition, step-by-step approach, a worked dry run, and common pitfalls, written like lecture notes
- **A step-by-step visual animation** (Play / Pause / Step / Reset / Speed) of the algorithm actually running
- **Real source code** in JavaScript, Python, and C++, with the currently-executing line highlighted in sync with the animation
- **A live JS Playground** — an editable, actually-runnable code editor with real `console.log` output
- An editable input box (where applicable) so you can try your own array / target / string / etc.

The other ~447 problems are listed as a checklist — exactly matching the
sheet's numbering, sections, and subsections — so the roadmap is complete
and trackable today, and clearly marked which problems don't yet have a
full interactive page (rather than silently missing or faked).

## The roadmap (474 problems across 18 steps)

1. Learn the Basics (54) — includes Basic Recursion (Factorial ✅, Fibonacci ✅)
2. Sorting Techniques (7) — Selection ✅, Bubble ✅, Insertion ✅, Merge ✅, Recursive Bubble, Recursive Insertion, Quick ✅
3. Arrays (40) — includes Linear Search ✅, Two Sum ✅, Kadane's Algorithm ✅
4. Binary Search (32) — includes Search X in Sorted Array ✅
5. Strings — Basic & Medium (15)
6. Linked List (31) — Introduction ✅, Reverse (Iterative) ✅, Detect a Loop ✅, Find the Starting Point ✅
7. Recursion (25)
8. Bit Manipulation (18)
9. Stack & Queues (30) — Implement Stack ✅, Implement Queue ✅, Balanced Parenthesis ✅
10. Sliding Window & Two Pointer (12) — Longest Substring Without Repeating Characters ✅
11. Heaps (17) — K-th Largest Element in an Array ✅
12. Greedy Algorithms (15) — N Meetings in One Room ✅
13. Binary Trees (38) — Level Order Traversal ✅
14. Binary Search Trees (16) — Insert a Given Node in BST ✅
15. Graphs (53) — Traversal Techniques (BFS) ✅, DFS ✅, Topological Sort / Kahn's Algorithm ✅
16. Dynamic Programming (55) — Climbing Stairs ✅, (0/1 Knapsack, mapped near Subset Sum Equal to Target) ✅
17. Tries (7)
18. Strings — Hard (9)

(✅ = has a full interactive page today. Everything else is present as a
trackable checklist item, exactly numbered and grouped as the source sheet.)

## How the roadmap data works

`src/data/roadmap.js` is a generated data file holding the full 474-item
structure (section → subsection → item, each with the sheet's own number).
Each item optionally has a `builtId` pointing at an entry in
`src/data/algorithms/`'s `ALGO_BY_ID` — when present, the landing page links
that row straight to a full interactive page; when absent, the row shows a
"Not yet built" pill and is still checkable for personal tracking. This
keeps two concerns cleanly separate: `roadmap.js` is the single source of
truth for the complete sheet's structure and display order, while
`src/data/algorithms/` remains the source of truth for actually-built
content (notes, code, visualization). `AlgorithmPage`'s prev/next
navigation walks `builtIdsInOrder()` — the built algorithms in roadmap
(sheet) order — so browsing forward/backward follows the sheet's own
sequence, not just registration order.

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
  line reference is in range, every algorithm has complete notes and a valid
  level/difficulty, custom input parsing works (and correctly rejects
  garbage input), and — importantly — a **generic regression check** across
  all 27 algorithms confirms that a step's rendered content genuinely
  changes across the algorithm's run (see "The eager-snapshot bug" below).
- **`test/run-ssr.mjs`** — renders `LandingPage` and every `AlgorithmPage` to
  static HTML via `react-dom/server` (bundled on the fly with esbuild) and
  asserts the expected content is present: all 27 problems and 12 roadmap
  steps on the landing page; notes, code tabs, controls, level/difficulty
  badges, and the playground toggle on every detail page; a graceful message
  for an unknown algorithm id.

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
│   │       ├── index.js                Registry: ALGORITHMS, ALGO_BY_ID, CATEGORY_ORDER, groupedAlgorithms()
│   │       ├── bubbleSort.js, selectionSort.js, insertionSort.js, mergeSort.js, quickSort.js
│   │       ├── linearSearch.js, binarySearch.js
│   │       ├── twoSum.js, kadane.js
│   │       ├── longestSubstring.js
│   │       ├── stack.js, queue.js, validParentheses.js
│   │       ├── linkedList.js, reverseLinkedList.js, detectCycle.js
│   │       ├── recursion.js, fibonacci.js
│   │       ├── bst.js, binaryTreeLevelOrder.js
│   │       ├── kthLargestHeap.js
│   │       ├── graphBFS.js, graphDFS.js, topologicalSort.js
│   │       ├── activitySelection.js
│   │       └── climbingStairs.js, knapsack.js
│   └── components/
│       ├── Header.jsx
│       ├── LandingPage.jsx             Roadmap-style topic list + progress (step numbering, level + difficulty badges)
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

### The eager-snapshot bug (and why `makeSnap` exists)

An earlier version of this app had a real bug: several algorithms built
their steps like this —

```js
const snap = (desc, lines, extra) => steps.push({
  desc, lines,
  draw(svg) { drawBars(svg, W, H, arr.slice(), extra || {}); }, // BUG
});
```

`arr.slice()` was called **inside** `draw()`, so it only ran whenever the
animation actually rendered that step — not when the step was recorded. But
`buildSteps()` runs the entire algorithm to completion synchronously before
ever returning the `steps` array. So by the time any step's `draw()` ran,
`arr` had already been mutated all the way to its final state. Every single
step ended up rendering the algorithm's FINAL state — e.g. step 1 said
"nothing is sorted yet" while the bars shown were already fully sorted.

The fix — and the reason `makeSnap()` exists in `viz.js` — is to force the
snapshot to happen eagerly, at the moment `snap()` is called:

```js
export function makeSnap(steps, cloneState, drawFn) {
  return (desc, lines, extra) => {
    const snapshot = cloneState(); // captured NOW, not lazily inside draw()
    steps.push({ desc, lines, draw: (svg) => drawFn(svg, snapshot, extra || {}) });
  };
}
```

Every algorithm module in this codebase uses `makeSnap()` for exactly this
reason. If you add a new algorithm, use it too — it's the difference between
a correct animation and a silently-wrong one that never throws an error.

Two regression tests in `test/algorithms.test.mjs` guard against this class
of bug recurring:
- Specific checks (for the algorithms most likely to be re-broken) cross-check
  a step's own description text (e.g. `"Array is now [3, 5, 8]"`) against
  what's actually rendered for that exact step.
- A **generic** check applies to all 27 algorithms automatically: it renders
  every step and confirms the rendered content (values, colors, and pointer
  positions — all via `data-role` attributes in `viz.js`) isn't byte-identical
  across every step. This one requires no per-algorithm code, so it
  automatically covers any new algorithm you add.

## Adding a new algorithm

1. Copy the closest existing file in `src/data/algorithms/`.
2. Write `buildSteps(input, ...)` — run the algorithm for real, and build its
   step list using `makeSnap(steps, cloneState, drawFn)` from `viz.js` (see
   "The eager-snapshot bug" above — this is required, not optional).
   `snap(desc, lines, extra)` then records each step, where `lines` points
   at the 1-indexed line in each `codes` string that's "executing" at that step.
3. Write the real `codes.js` / `codes.py` / `codes.cpp` source strings.
4. Implement the draw function using the shared helpers in `viz.js`
   (`drawBars`, `drawGraph`, `drawBinaryTree`, `drawTable`, `box`, `circle`,
   `arrow`, `tag`, etc.), or write a small local draw function like
   `stack.js` / `activitySelection.js` do for layouts the shared helpers
   don't cover — tag any rendered value with `dataRole: "..."` so the
   generic regression test can verify it changes across steps.
5. Write `notes: { intuition, approach: [...], dryRun, pitfalls: [...] }`.
6. Add `id`, `title`, `category`, `level` (Beginner/Intermediate/Advanced),
   `difficulty` (Easy/Medium/Hard), `tags`, `blurb`, `complexity`,
   `defaultInput` (and `defaultTarget` if the algorithm takes a second
   argument, e.g. a search target), then export it as default.
7. Register it in `src/data/algorithms/index.js` (import + add to `ALGORITHMS`
   + make sure its `category` is in `CATEGORY_ORDER`, or add it there).
8. If it needs a custom-input box, add a case in `src/data/inputParsers.js`
   (reuse `arrayOnlyConfig` / `arrayAndNumberConfig` / `stringOnlyConfig` /
   `boundedIntConfig` where they fit).
9. Find the corresponding item number in `src/data/roadmap.js` (search for
   its title) and set that item's `builtId` to your new algorithm's `id` —
   this is what makes it show up as a linked, interactive row on the landing
   page instead of a "Not yet built" checklist entry.
10. Run `npm test` — it will automatically pick up and validate the new
   algorithm (steps, line mappings, notes completeness, the eager-snapshot
   regression check, SSR rendering) with no test-file changes needed, since
   both suites iterate `ALGORITHMS`.

## Progress tracking

"Mark as done" checkboxes (on both the landing page and each detail page)
are persisted to `localStorage` under the key `dsa-visualizer-progress-v1` —
no backend, no account. Clearing your browser's site data resets progress.
