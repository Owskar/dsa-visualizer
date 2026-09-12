import { JSDOM } from "jsdom";

// Provide a minimal DOM so viz.js's document.createElementNS calls work,
// since these algorithm modules are framework-agnostic and expect a global
// `document` (same as they'd get in a real browser).
const dom = new JSDOM("<!doctype html><html><body></body></html>");
global.document = dom.window.document;

const { ALGORITHMS, ALGO_BY_ID, groupedAlgorithms, defaultStepsFor, CATEGORY_ORDER } =
  await import("../src/data/algorithms/index.js");
const { getInputConfig } = await import("../src/data/inputParsers.js");

let failures = 0;
const fail = (msg) => { console.error(`FAIL  ${msg}`); failures++; };
const ok = (msg) => console.log(`OK    ${msg}`);

console.log(`Registered algorithms: ${ALGORITHMS.length}\n`);

// ---- registry sanity ----
const seenIds = new Set();
for (const algo of ALGORITHMS) {
  if (seenIds.has(algo.id)) fail(`duplicate id ${algo.id}`);
  seenIds.add(algo.id);
  if (!CATEGORY_ORDER.includes(algo.category)) fail(`${algo.id}: category "${algo.category}" not in CATEGORY_ORDER`);
  if (!["Easy", "Medium", "Hard"].includes(algo.difficulty)) fail(`${algo.id}: invalid difficulty "${algo.difficulty}"`);
  if (!Array.isArray(algo.tags) || !algo.tags.length) fail(`${algo.id}: missing tags`);
  if (ALGO_BY_ID[algo.id] !== algo) fail(`${algo.id}: not correctly indexed in ALGO_BY_ID`);
}
ok(`no duplicate ids, all categories/difficulties/tags present`);

// ---- notes completeness ----
for (const algo of ALGORITHMS) {
  const n = algo.notes;
  if (!n) { fail(`${algo.id}: missing notes`); continue; }
  if (!n.intuition || n.intuition.length < 40) fail(`${algo.id}: intuition missing or too short`);
  if (!Array.isArray(n.approach) || n.approach.length < 2) fail(`${algo.id}: approach should have several steps`);
  if (!n.dryRun) fail(`${algo.id}: missing dryRun`);
  if (!Array.isArray(n.pitfalls) || n.pitfalls.length < 1) fail(`${algo.id}: missing pitfalls`);
}
ok(`every algorithm has intuition, approach, dryRun, pitfalls`);

// ---- buildSteps + draw() + line-mapping validity ----
for (const algo of ALGORITHMS) {
  try {
    const steps = defaultStepsFor(algo);
    if (!Array.isArray(steps) || !steps.length) throw new Error("buildSteps produced no steps");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    steps.forEach((step, i) => {
      if (typeof step.draw !== "function") throw new Error(`step ${i} missing draw()`);
      step.draw(svg); // must not throw against a real SVG node
      if (!step.desc) throw new Error(`step ${i} missing desc`);
      for (const lang of Object.keys(algo.codes)) {
        const lineCount = algo.codes[lang].split("\n").length;
        const ref = step.lines[lang];
        if (ref === undefined) throw new Error(`step ${i} missing ${lang} line mapping`);
        if (ref < 1 || ref > lineCount) throw new Error(`step ${i} ${lang} line ${ref} out of range (1-${lineCount})`);
      }
    });
    ok(`${algo.id}: ${steps.length} steps, draw() OK, line refs valid in all languages`);
  } catch (e) {
    fail(`${algo.id}: ${e.message}`);
  }
}

// ---- custom input parsing round-trip ----
const customCases = {
  "bubble-sort": "9,1,5,3",
  "selection-sort": "7,7,2",
  "binary-search": "1,3,5,7,9,11 | 7",
  "linear-search": "4,8,15,16,23,42 | 23",
  "graph-bfs": "C",
  "graph-dfs": "d",
  "bst": "5,2,9,1",
  "recursion-factorial": "5",
};
for (const [id, raw] of Object.entries(customCases)) {
  const algo = ALGO_BY_ID[id];
  const cfg = getInputConfig(algo);
  if (!cfg) { fail(`${id}: expected an input config`); continue; }
  const args = cfg.parse(raw);
  if (!args) { fail(`${id}: valid input "${raw}" was rejected by parse()`); continue; }
  try {
    const steps = algo.buildSteps(...args);
    if (!steps.length) throw new Error("no steps from custom input");
    ok(`${id}: custom input "${raw}" → ${steps.length} steps`);
  } catch (e) {
    fail(`${id}: custom input "${raw}" threw: ${e.message}`);
  }
  // also confirm garbage input is rejected instead of crashing
  const bad = cfg.parse("!!not,valid!!");
  if (bad !== null) fail(`${id}: expected parse() to reject garbage input, got ${JSON.stringify(bad)}`);
}
ok(`garbage input correctly rejected (parse() returns null) for all input-driven algorithms`);

// stack / queue / linked-list have no editable input by design — confirm that's intentional, not a bug
for (const id of ["stack", "queue", "linked-list"]) {
  const cfg = getInputConfig(ALGO_BY_ID[id]);
  if (cfg !== null) fail(`${id}: expected no input config (scripted demo), got one`);
}
ok(`stack/queue/linked-list correctly have no editable input (scripted demos)`);

// ---- grouping used by the landing page ----
const groups = groupedAlgorithms();
const totalGrouped = [...groups.values()].reduce((sum, arr) => sum + arr.length, 0);
if (totalGrouped !== ALGORITHMS.length) fail(`groupedAlgorithms() lost algorithms: ${totalGrouped} !== ${ALGORITHMS.length}`);
else ok(`groupedAlgorithms() accounts for all ${ALGORITHMS.length} algorithms across ${groups.size} categories`);

// ---- regression test: each step's rendered visuals must reflect THAT
// step's state, not the algorithm's final state after buildSteps() returns.
//
// This guards against a real bug that shipped once: several algorithms
// captured their mutable state (arr/stack/queue/list/frames/tree) inside a
// closure that read the OUTER variable lazily at draw()-time instead of
// snapshotting it at snap()-call-time. Since buildSteps() runs the whole
// algorithm synchronously before returning, every step ended up rendering
// the same final state — e.g. step 1 said "nothing is sorted yet" while the
// bars shown were already fully sorted. Calling draw() and merely checking
// "did it throw" (as the checks above do) does NOT catch this class of bug,
// because it throws for none of them. These checks inspect actual rendered
// values via the data-role attributes in src/data/viz.js.
function textsByRole(svg, role) {
  return [...svg.querySelectorAll(`[data-role="${role}"]`)].map((el) => el.textContent);
}

function barValuesInOrder(svg) {
  const els = [...svg.querySelectorAll('[data-role="bar-value"]')];
  els.sort((a, b) => Number(a.getAttribute("data-index")) - Number(b.getAttribute("data-index")));
  return els.map((el) => Number(el.textContent));
}

const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

// --- Bubble Sort / Selection Sort: step 0 must show the ORIGINAL unsorted
// order; the final step must show it fully sorted. Under the bug, step 0
// would already show the sorted array. ---
for (const id of ["bubble-sort", "selection-sort"]) {
  const algo = ALGO_BY_ID[id];
  const steps = defaultStepsFor(algo);
  steps[0].draw(svg);
  const first = barValuesInOrder(svg);
  steps[steps.length - 1].draw(svg);
  const last = barValuesInOrder(svg);
  const expectedSorted = algo.defaultInput.slice().sort((a, b) => a - b);
  if (JSON.stringify(first) !== JSON.stringify(algo.defaultInput)) {
    fail(`${id}: step 0 shows [${first}], expected original order [${algo.defaultInput}]`);
  } else if (JSON.stringify(last) !== JSON.stringify(expectedSorted)) {
    fail(`${id}: final step shows [${last}], expected sorted [${expectedSorted}]`);
  } else {
    ok(`${id}: step 0 shows original order, final step shows sorted order (not identical!)`);
  }
  // Cross-check EVERY step that states its array contents in the description
  // against what's actually rendered for that exact step.
  let checkedAny = false;
  for (const [i, step] of steps.entries()) {
    const m = step.desc.match(/(?:Array is now|now) \[([^\]]+)\]/);
    if (!m) continue;
    checkedAny = true;
    const expected = m[1].split(",").map((s) => Number(s.trim()));
    step.draw(svg);
    const rendered = barValuesInOrder(svg);
    if (JSON.stringify(rendered) !== JSON.stringify(expected)) {
      fail(`${id} step ${i}: desc says "${step.desc}" but rendered [${rendered}]`);
    }
  }
  if (checkedAny) ok(`${id}: every step whose description states array contents matches what's rendered`);
}

// --- Stack / Queue: same idea, checking "X is now [...]" phrasing. ---
for (const [id, phrase] of [["stack", "Stack is now"], ["queue", "Queue is now"]]) {
  const algo = ALGO_BY_ID[id];
  const role = id === "stack" ? "stack-value" : "queue-value";
  const steps = defaultStepsFor(algo);
  steps[0].draw(svg);
  if (textsByRole(svg, role).length !== 0) fail(`${id}: step 0 (empty) should render 0 boxes`);
  let checkedAny = false;
  for (const [i, step] of steps.entries()) {
    const m = step.desc.match(new RegExp(`${phrase} \\[([^\\]]*)\\]`));
    if (!m) continue;
    checkedAny = true;
    const expected = m[1].trim() ? m[1].split(",").map((s) => s.trim()) : [];
    step.draw(svg);
    const rendered = textsByRole(svg, role);
    if (JSON.stringify(rendered) !== JSON.stringify(expected)) {
      fail(`${id} step ${i}: desc says "${step.desc}" but rendered [${rendered}]`);
    }
  }
  if (checkedAny) ok(`${id}: every step whose description states its contents matches what's rendered`);
}

// --- Linked List: desc phrasing is "List is now 10 → 20 → NULL." ---
{
  const algo = ALGO_BY_ID["linked-list"];
  const steps = defaultStepsFor(algo);
  steps[0].draw(svg);
  if (textsByRole(svg, "list-value").length !== 0) fail("linked-list: step 0 (empty) should render 0 nodes");
  let checkedAny = false;
  for (const [i, step] of steps.entries()) {
    const m = step.desc.match(/List is now (.+?)\.(?:\s|$)/);
    if (!m) continue;
    checkedAny = true;
    const expected = m[1].split("→").map((s) => s.trim()).filter((s) => s !== "NULL");
    step.draw(svg);
    const rendered = textsByRole(svg, "list-value");
    if (JSON.stringify(rendered) !== JSON.stringify(expected)) {
      fail(`linked-list step ${i}: desc says "${step.desc}" but rendered [${rendered}]`);
    }
  }
  if (checkedAny) ok("linked-list: every step whose description states its contents matches what's rendered");
}

// --- Recursion: frame count must grow on the way down and shrink on the
// way back up — under the bug it would be stuck at 0 (fully unwound) for
// every single step. ---
{
  const algo = ALGO_BY_ID["recursion-factorial"];
  const n = algo.defaultInput;
  const steps = defaultStepsFor(algo);
  steps[0].draw(svg);
  if (textsByRole(svg, "frame-label").length !== 0) fail("recursion-factorial: step 0 should show an empty call stack");
  const baseCaseStepIdx = steps.findIndex((s) => s.desc.includes("Base case reached"));
  if (baseCaseStepIdx === -1) {
    fail("recursion-factorial: no 'Base case reached' step found");
  } else {
    steps[baseCaseStepIdx].draw(svg);
    const count = textsByRole(svg, "frame-label").length;
    if (count !== n) fail(`recursion-factorial: at the base case, expected ${n} stacked frames, rendered ${count}`);
    else ok(`recursion-factorial: call stack correctly shows ${n} frames deep at the base case (not 0)`);
  }
  steps[steps.length - 1].draw(svg);
  if (textsByRole(svg, "frame-label").length !== 0) fail("recursion-factorial: final step should show an empty call stack again");
}

// --- BST: node count must grow one at a time as each value is inserted —
// under the bug, the very first "Placed X as a new leaf" step would already
// show the complete final tree. ---
{
  const algo = ALGO_BY_ID["bst"];
  const values = algo.defaultInput;
  const steps = defaultStepsFor(algo);
  steps[0].draw(svg);
  if (textsByRole(svg, "tree-node").length !== 0) fail("bst: step 0 (empty tree) should render 0 nodes");

  const placedSteps = steps.filter((s) => s.desc.startsWith("Placed "));
  if (placedSteps.length !== values.length) {
    fail(`bst: expected ${values.length} "Placed" steps, found ${placedSteps.length}`);
  } else {
    let allGood = true;
    placedSteps.forEach((step, i) => {
      step.draw(svg);
      const count = textsByRole(svg, "tree-node").length;
      if (count !== i + 1) {
        fail(`bst: after inserting value #${i + 1}, expected ${i + 1} tree nodes rendered, got ${count}`);
        allGood = false;
      }
    });
    if (allGood) ok(`bst: node count grows one at a time across all ${values.length} insertions (not all-at-once)`);
  }
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL DATA-LAYER CHECKS PASSED");
process.exitCode = failures ? 1 : 0;
