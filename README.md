# DSA Visualizer (React)

The complete takeUforward-style A2Z DSA roadmap — all 474 problems across 18
steps, structured exactly the way that sheet lays out a course, from
"Learn the Basics" through Graphs, Dynamic Programming, and Tries. Every
problem is trackable with a "mark as done" checkbox (saved locally in your
browser), and a growing subset of them (46 so far) have a full interactive
page:

- **Theory notes** — intuition, step-by-step approach, a worked dry run, and common pitfalls, written like lecture notes
- **A step-by-step visual animation** (Play / Pause / Step / Reset / Speed) of the algorithm actually running
- **Real source code** in JavaScript, Python, and C++, with the currently-executing line highlighted in sync with the animation
- **A live JS Playground** — an editable, actually-runnable code editor with real `console.log` output
- An editable input box (where applicable) so you can try your own array / target / string / etc.
- **Light and dark themes** — toggle in the header (☾ / ☀), persisted locally. Every color in the app is a CSS variable, and the SVG visualizations read those same variables live, so switching themes re-colors everything, including whatever algorithm you're currently watching run.

The other ~428 problems are listed as a checklist — exactly matching the
sheet's numbering, sections, and subsections — so the roadmap is complete
and trackable today, and clearly marked which problems don't yet have a
full interactive page (rather than silently missing or faked).

**Adding a new problem is a single-file operation** — see "Adding a new
algorithm" below. There's no registry to edit, no roadmap file to update by
hand: create a file, declare which sheet item it is, and it's live.

## The roadmap (474 problems across 18 steps)

1. Learn the Basics (54) — Things to Know, all 9 ✅ (Input/Output, C++ Basics, If Else, Switch Case, Arrays & Strings intro, For loops, While loops, Pass by Reference/Value, Theory with Examples), Basic Maths (Count Digits ✅, Reverse a Number ✅, Palindrome Number ✅, GCD ✅, Armstrong ✅, Divisors ✅, Prime Check ✅), Basic Recursion (Sum of First N ✅, Factorial ✅, Fibonacci ✅), Basic Hashing (Counting Frequencies ✅, Highest Occurring Element ✅)
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

(✅ = has a full interactive page today — 46 so far. Everything else is
present as a trackable checklist item, exactly numbered and grouped as the
source sheet.)

## Architecture: how a new file becomes a live page

This is the part that makes "add new things daily" actually true. There are
exactly three moving pieces, and adding a problem touches only one of them:

1. **`src/data/algorithms/*.js`** — one file per problem. Each file is fully
   self-contained: its own `id`, `sheetNum` (which of the 474 sheet items it
   is), `inputConfig` (its input box, if any), `notes`, `codes`, and
   `buildSteps`/`draw`. Nothing else references this file by name.
2. **`src/data/algorithms/index.js`** — uses Vite's `import.meta.glob("./*.js", { eager: true })`
   to auto-import every sibling file in that folder and collect their
   default exports into `ALGORITHMS`. This is why there's no registry to
   edit: dropping a new file into the folder IS registering it.
3. **`src/data/roadmap.js`** — holds the static 474-item sheet structure
   (section → subsection → item, with the sheet's own numbering) and
   nothing else. At import time, it builds a lookup from every algorithm's
   `sheetNum` and merges `builtId` onto the matching item automatically.
   This file never needs hand-editing when a problem is added — it just
   reads whatever `ALGORITHMS` currently contains.

The landing page renders from `roadmap.js`'s merged output: an item with a
`builtId` links straight to a full interactive page; without one, it shows
a "Not yet built" pill and is still checkable for personal tracking.
`AlgorithmPage`'s prev/next navigation walks `builtIdsInOrder()` — the built
algorithms in roadmap (sheet) order — so browsing forward/backward follows
the sheet's own sequence, not just file-creation order.

Because `import.meta.glob` is a Vite-only build-time macro, it doesn't work
under a plain Node `import()` or a generic bundler like esbuild — only
Vite's own transform understands it. That's why both test files load code
through `test/vite-ssr-loader.mjs` (a thin wrapper around Vite's
`ssrLoadModule`) instead of importing modules directly: the tests exercise
the exact same code path the real `npm run dev` / `npm run build` does.

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

This runs two independent suites, both loaded through
`test/vite-ssr-loader.mjs` (Vite's real SSR pipeline) rather than a plain
Node `import()` or a generic bundler — necessary because
`src/data/algorithms/index.js` uses `import.meta.glob`, a Vite-only
build-time macro that only Vite's own transform understands:

- **`test/algorithms.test.mjs`** — pure data-layer checks (no React): every
  algorithm's `buildSteps()` produces valid steps, every step's `draw()`
  actually executes against a real SVG node (via jsdom), every JS/Python/C++
  line reference is in range, every algorithm has complete notes and a valid
  level/difficulty/sheetNum, custom input parsing works (and correctly
  rejects garbage input), the roadmap's 474-item structure is internally
  consistent (no gaps/duplicates, every `builtId` resolves), and —
  importantly — a **generic regression check** across all built algorithms
  confirms that a step's rendered content genuinely changes across the
  algorithm's run (see "The eager-snapshot bug" below).
- **`test/run-ssr.mjs`** — renders `LandingPage` and every `AlgorithmPage` to
  static HTML via `react-dom/server` and asserts the expected content is
  present: the hero, all 18 roadmap section headers with correct step
  numbers, the first (expanded-by-default) section's items, confirmation
  that a collapsed section's items are correctly absent from the initial
  markup, and on every built algorithm's detail page — notes, code tabs,
  controls, level/difficulty badges, and the playground toggle; plus a
  graceful message for an unknown algorithm id.

## Project structure

```
dsa-react/
├── index.html                    Vite entry HTML
├── vite.config.js
├── package.json
├── src/
│   ├── main.jsx                   React root
│   ├── App.jsx                     Router setup (HashRouter, 2 routes) + theme/progress hooks
│   ├── index.css                    Design tokens (light + dark theme CSS variables) + shared base styles
│   ├── hooks/
│   │   ├── usePlayer.js              Step playback controller (play/pause/step/speed)
│   │   ├── useProgress.js             localStorage-backed "done" tracking (all 474 items)
│   │   └── useTheme.js                 localStorage-backed light/dark theme toggle
│   ├── data/
│   │   ├── viz.js                     Shared SVG drawing toolkit (bars, nodes, arrows, graphs, tables, digit rows) + makeSnap
│   │   ├── inputConfigHelpers.js       Reusable input-box builders each algorithm file calls for itself
│   │   ├── roadmap.js                  Full 474-item sheet structure; merges in builtId from ALGORITHMS' sheetNum
│   │   └── algorithms/
│   │       ├── index.js                Auto-discovery registry: import.meta.glob picks up every file below
│   │       ├── countDigits.js, reverseNumber.js, palindromeNumber.js, gcdTwoNumbers.js
│   │       ├── checkArmstrong.js, printDivisors.js, checkPrime.js, sumOfFirstN.js
│   │       ├── countFrequencies.js, highestOccurring.js
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
│       ├── Header.jsx                  Brand + theme toggle button
│       ├── LandingPage.jsx             Full 474-item roadmap accordion + progress
│       ├── AlgorithmPage.jsx            Notes + Stage + CodePanel + Playground
│       ├── NotesPanel.jsx                Intuition / Approach / Dry run / Pitfalls
│       ├── Stage.jsx                      Imperative SVG canvas, theme-aware (see below)
│       ├── Controls.jsx                    Play/Pause/Step/Reset/Speed
│       ├── CodePanel.jsx                    Tabbed JS/Python/C++ with line highlight
│       ├── Playground.jsx                    Editable + runnable JS editor
│       └── ProgressBar.jsx
└── test/
    ├── vite-ssr-loader.mjs            Loads modules through Vite's real SSR pipeline (handles import.meta.glob + JSX)
    ├── algorithms.test.mjs            Data-layer test (Node + jsdom, loaded via the Vite loader)
    ├── ssr-entry.jsx                    SSR render assertions (source)
    └── run-ssr.mjs                       Loads ssr-entry.jsx via the Vite loader and runs it
```

### Why `Stage` draws imperatively instead of with JSX

Each algorithm's `draw(svgNode)` function manipulates a real SVG DOM node
directly (`document.createElementNS`, `.appendChild`, etc.) using the shared
helpers in `src/data/viz.js`, rather than returning JSX. The `<Stage>`
component just hands it a ref in a `useEffect`:

```jsx
useEffect(() => {
  if (svgRef.current && step) step.draw(svgRef.current);
}, [step, theme]); // also re-runs on theme change — see "Theme" below
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

## Adding a new algorithm — one file, nothing else to touch

1. Copy the closest existing file in `src/data/algorithms/` as a starting point.
2. Find the item's number on the sheet (search the titles pasted into
   `src/data/roadmap.js`, or just search takeUforward's own sheet) and set
   `sheetNum` to it. This one field is the entire "connect it to the roadmap"
   step — no other file needs editing.
3. If it needs a custom-input box, declare `inputConfig: (algo) => ...` right
   in the file, using a helper from `src/data/inputConfigHelpers.js`
   (`arrayOnlyConfig`, `arrayAndNumberConfig`, `stringOnlyConfig`,
   `boundedIntConfig`, `twoIntConfig`) — or write a bespoke one inline (see
   `graphBFS.js` for an example). Omit it entirely for a fixed scripted demo
   with no editable input (see `stack.js`).
4. Write `buildSteps(input, ...)` — run the algorithm for real, and build its
   step list using `makeSnap(steps, cloneState, drawFn)` from `viz.js` (see
   "The eager-snapshot bug" below — this is required, not optional).
   `snap(desc, lines, extra)` then records each step, where `lines` points
   at the 1-indexed line in each `codes` string that's "executing" at that step.
5. Write the real `codes.js` / `codes.py` / `codes.cpp` source strings.
6. Implement the draw function using the shared helpers in `viz.js`
   (`drawBars`, `drawGraph`, `drawBinaryTree`, `drawTable`, `drawNumberPeel`,
   `drawCharBoxRow`, `box`, `circle`, `arrow`, `tag`, etc.), or write a small
   local draw function like `stack.js` / `gcdTwoNumbers.js` do for layouts
   the shared helpers don't cover — tag any rendered value with
   `dataRole: "..."` so the generic regression test can verify it changes
   across steps.
7. Write `notes: { intuition, approach: [...], dryRun, pitfalls: [...] }`.
8. Add `id`, `title`, `category`, `level` (Beginner/Intermediate/Advanced),
   `difficulty` (Easy/Medium/Hard), `tags`, `blurb`, `complexity`,
   `defaultInput` (and `defaultTarget` if the algorithm takes a second
   argument, e.g. a search target), then export it as default.
9. Save the file. That's it — no import to add anywhere, no array to push
   into, no roadmap entry to hand-edit. `import.meta.glob` in
   `src/data/algorithms/index.js` picks up the new file automatically, and
   `roadmap.js` links it to its sheet position via `sheetNum` automatically.
10. Run `npm test` — it will automatically discover and validate the new
    algorithm (steps, line mappings, notes completeness, the eager-snapshot
    regression check, roadmap consistency, SSR rendering) with no test-file
    changes needed, since both suites iterate the auto-discovered `ALGORITHMS`.

## Progress tracking

"Mark as done" checkboxes (on both the landing page and each detail page)
are persisted to `localStorage` under the key `dsa-visualizer-progress-v1` —
no backend, no account. Every one of the 474 sheet items is checkable, not
just the built ones (unbuilt items use a `sheet-<num>` key instead of an
algorithm id). Clearing your browser's site data resets progress.

## Theme

Light and dark themes are toggled from the header (☾ switches to dark, ☀
switches back). `useTheme.js` persists the choice to `localStorage` and
applies it via a `data-theme` attribute on `<html>` — every color in the
app is a CSS variable in `src/index.css`, scoped under `:root` (light) and
`:root[data-theme="dark"]` (dark), so that one attribute re-themes
everything. The SVG visualizations follow along too: `COLORS` in `viz.js`
reads the current CSS variable values live (via `getComputedStyle`) rather
than using fixed hex strings, and `Stage.jsx` re-runs `draw()` whenever the
theme changes — so toggling theme while looking at a running animation
re-colors it immediately, in place.

