# DSA Visualizer

**Learn Data Structures & Algorithms by watching them run.**

This is a free, self-contained learning tool built around a simple idea:
reading about an algorithm only gets you so far — actually *watching* it
run, one step at a time, next to the real code that produces it, is what
makes it click. It's structured as a complete beginner-to-advanced roadmap
(474 problems across 18 steps), the same shape as popular DSA prep sheets
like takeUforward's A2Z course, so if you've used one of those before, this
will feel immediately familiar.

If you're new to DSA, or prepping for coding interviews, or just want a
clearer mental picture of how these algorithms actually work — this is for
you.

---

## Getting started (for learners)

**Option 1 — just open it.** If a live version of this project is deployed
(check the repository's "About" section on GitHub for a link), you can use
it directly in your browser — no install needed.

**Option 2 — run it on your own computer.** You'll need
[Node.js](https://nodejs.org) (18 or newer) installed. Then, from this
project's folder:

```bash
npm install
npm run dev
```

Open the address it prints (usually `http://localhost:5173`) in your
browser. That's it — you're in.

### How to use it

1. **Start on the home page.** It's organized as 18 numbered "Steps," from
   "Learn the Basics" up to Graphs and Dynamic Programming — the same order
   most people learn DSA in. Click a step to expand it and see its problems.
2. **Pick a problem.** Problems with a colored tag and a "Visualize →"
   button already have a full interactive page. Everything else is listed
   too (so you can see the whole roadmap and check things off as you learn
   them elsewhere), just marked "Not yet built" for now — more are being
   added over time.
3. **On a problem's page**, you'll find, top to bottom:
   - **Notes** — the intuition behind the algorithm in plain language, a
     step-by-step approach, a worked example, and common mistakes people
     make. Read this first if the topic is new to you.
   - **The visualization** — press ▶ Play, or click through step by step
     with the ◂ Back / Next ▸ buttons. Each step has a plain-English caption
     explaining exactly what's happening and why. Slow the animation down
     with the speed slider if you want to study a tricky moment.
   - **The code**, in JavaScript, Python, and C++ (switch languages with the
     tabs) — the line currently running is highlighted in sync with the
     animation, so you can see exactly which line of code produced the
     change you just watched happen.
   - **A live code playground** at the bottom — a real, editable code editor
     where you can tweak the JavaScript yourself and run it, right there in
     the page.
4. **Try your own input.** Many problems have an input box — type in your
   own array, string, or number and click Apply to see the algorithm run on
   *your* data instead of the example.
5. **Track your progress.** Every problem has a checkbox. Checking it off
   is saved in your browser (nothing is sent anywhere, no account needed),
   so you can track your way through the whole roadmap over time.
6. **Switch themes.** The ☾ / ☀ button in the top-right toggles between a
   light "paper" theme and a dark theme — pick whichever's easier on your
   eyes.

### The 18-step roadmap

Here's the path, start to finish. You don't have to go in order, but if
you're new to DSA, this is the order most people learn it in:

| Step | Topic | Step | Topic |
|---|---|---|---|
| 1 | Learn the Basics | 10 | Sliding Window & Two Pointer |
| 2 | Sorting Techniques | 11 | Heaps |
| 3 | Arrays | 12 | Greedy Algorithms |
| 4 | Binary Search | 13 | Binary Trees |
| 5 | Strings — Basic & Medium | 14 | Binary Search Trees |
| 6 | Linked List | 15 | Graphs |
| 7 | Recursion | 16 | Dynamic Programming |
| 8 | Bit Manipulation | 17 | Tries |
| 9 | Stack & Queues | 18 | Strings — Hard |

474 problems in total, spread across those 18 steps — exactly matching the
structure of well-known DSA prep sheets. Open the home page to see the full
list with checkboxes, difficulty tags, and links to whichever problems
already have a full interactive walkthrough.

### Is everything finished?

Not yet, and that's meant to be visible, not hidden. Out of 474 total
problems on the roadmap, a growing number have a complete interactive page
today — check the home page's progress bar for the current count. The rest
are listed honestly as "Not yet built" rather than being left out
entirely, so the roadmap itself is always complete even while the
interactive content is still being filled in.

---

## For contributors

The rest of this README is for people who want to run this project's test
suite, understand how it's built, or add a new problem to it. If you're
here purely to learn DSA, you don't need any of this — the section above
is all you need.

### Architecture: how a new file becomes a live page

Adding a problem is a **single-file operation** by design. There are
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

### Project structure

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
│   │       ├── inputOutput.js, cppBasics.js, ifElse.js, switchCase.js, arraysAndStringsIntro.js
│   │       ├── forLoops.js, whileLoops.js, passByReferenceValue.js, basicsTheoryExamples.js
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
- A **generic** check applies to every built algorithm automatically: it
  renders every step and confirms the rendered content (values, colors, and
  pointer positions — all via `data-role` attributes in `viz.js`) isn't
  byte-identical across every step. This one requires no per-algorithm code,
  so it automatically covers any new algorithm you add.

### Colors: always use `COLORS`, never a literal hex/`"#fff"`

Every color drawn on the SVG canvas — box fills, strokes, text — must come
from the `COLORS` object in `viz.js`, never a hardcoded string like `"#fff"`
or `"#22201b"`. `COLORS` reads the current CSS variable values live (via
`getComputedStyle`), so it automatically follows the light/dark theme
toggle. A literal `"#fff"` used as a box's default fill is exactly the bug
that once made dark mode look broken: the box stayed bright white while
everything around it went dark, and the (now light-colored) text drawn on
top of it became nearly unreadable. Use `COLORS.paperRaised` for any
"unhighlighted, default state" box or node fill — it's the correct raised
surface color in both themes.

### Adding a new algorithm — one file, nothing else to touch

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
   "The eager-snapshot bug" above — this is required, not optional).
   `snap(desc, lines, extra)` then records each step, where `lines` points
   at the 1-indexed line in each `codes` string that's "executing" at that step.
5. Write the real `codes.js` / `codes.py` / `codes.cpp` source strings.
6. Implement the draw function using the shared helpers in `viz.js`
   (`drawBars`, `drawGraph`, `drawBinaryTree`, `drawTable`, `drawNumberPeel`,
   `drawCharBoxRow`, `box`, `circle`, `arrow`, `tag`, etc.), or write a small
   local draw function like `stack.js` / `gcdTwoNumbers.js` do for layouts
   the shared helpers don't cover — always use `COLORS.*` (see above, never
   a literal hex), and tag any rendered value with `dataRole: "..."` so the
   generic regression test can verify it changes across steps.
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

### Progress tracking

"Mark as done" checkboxes (on both the landing page and each detail page)
are persisted to `localStorage` under the key `dsa-visualizer-progress-v1` —
no backend, no account. Every one of the 474 sheet items is checkable, not
just the built ones (unbuilt items use a `sheet-<num>` key instead of an
algorithm id). Clearing your browser's site data resets progress.

### Theme

Light and dark themes are toggled from the header (☾ switches to dark, ☀
switches back). `useTheme.js` persists the choice to `localStorage` and
applies it via a `data-theme` attribute on `<html>` — every color in the
app is a CSS variable in `src/index.css`, scoped under `:root` (light) and
`:root[data-theme="dark"]` (dark), so that one attribute re-themes
everything. The SVG visualizations follow along too, via the `COLORS`
object described above, and `Stage.jsx` re-runs `draw()` whenever the theme
changes — so toggling theme while looking at a running animation re-colors
it immediately, in place.

### Mobile

The layout is responsive down to small phone widths (~360px): the header,
landing page roadmap, and algorithm detail page all reflow via CSS media
queries, form inputs use a 16px minimum font size to avoid iOS Safari's
auto-zoom-on-focus, and the SVG visualization stage scrolls horizontally on
very narrow screens instead of shrinking its text to illegibility (the same
approach the code panel already uses for long lines).

Two real overflow bugs were found and fixed by actually rendering the app
at a phone viewport (390×844) with a headless browser and checking
`document.documentElement.scrollWidth` against `clientWidth` on every page,
in both themes — worth knowing about if you add new CSS:

- **CSS Grid/Flex items need explicit `min-width: 0`.** `.pane` is a grid
  item inside `.workbench`; without `min-width: 0`, a grid item refuses to
  shrink below its content's intrinsic width. The stage SVG's mobile
  `min-width: 480px` (see `Stage.css`) was silently forcing the entire page
  wider than the viewport instead of scrolling internally within
  `.stage-wrap`'s `overflow-x: auto`. This is a general CSS Grid/Flexbox
  gotcha, not specific to this bug — any element you nest inside `.pane` or
  `.workbench` that has its own intrinsic minimum width needs the same
  scrolling-container treatment, or it needs `min-width: 0` on the item
  wrapping it.
- **Never use `white-space: nowrap` on text sourced from data without a
  width limit.** `.complexity-tag` renders each algorithm's `complexity`
  string, and some of those strings are much longer than others (compare
  `"Time: O(n) · Space: O(1)"` to 0/1 Knapsack's multi-clause description).
  `nowrap` with no `max-width` meant the badge itself simply became as wide
  as its longest possible content and blew out the layout on every
  algorithm with a long complexity string — invisible until you actually
  test a page with long content, not just the first one you happen to try.

Every algorithm page and the landing page, in both themes, were checked
this way before shipping. It's not wired into the automated `npm test`
suite (it needs a real headless browser, which the rest of the test suite
deliberately avoids depending on — see "Running the tests" above) — treat
it as a manual pre-release check: launch a headless Chromium at a phone
viewport, visit every route in both themes, and assert
`document.documentElement.scrollWidth <= clientWidth` on each.
