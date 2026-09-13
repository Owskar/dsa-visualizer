import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../src/components/LandingPage.jsx";
import AlgorithmPage from "../src/components/AlgorithmPage.jsx";
import { ALGORITHMS } from "../src/data/algorithms/index.js";
import { ROADMAP, TOTAL_ITEMS, flatItems } from "../src/data/roadmap.js";

// react-router-dom's <Link> uses useLayoutEffect internally, which is a no-op
// (and console.error-warns) under renderToStaticMarkup. That's expected and
// harmless for this SSR smoke test — silence it so real failures stand out.
const realConsoleError = console.error;
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("useLayoutEffect does nothing")) return;
  realConsoleError(...args);
};

let failures = 0;
const fail = (msg) => { console.error(`FAIL  ${msg}`); failures++; };
const ok = (msg) => console.log(`OK    ${msg}`);

// Fake progress object — same shape useProgress() returns, no localStorage needed.
const fakeProgress = { isDone: () => false, toggle: () => {}, done: {} };

function renderAt(path, id) {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/" element={<LandingPage progress={fakeProgress} />} />
        <Route path="/algo/:id" element={<AlgorithmPage progress={fakeProgress} />} />
      </Routes>
    </MemoryRouter>
  );
}

// React HTML-escapes apostrophes/quotes in text nodes (' -> &#x27;, etc).
// Normalize both sides before substring-matching so that's not a false failure.
function normalize(s) {
  return s.replace(/&#x27;|&#39;|'/g, "").replace(/&amp;/g, "&");
}

// ---- Landing page (default state: only the first roadmap section is expanded) ----
try {
  const html = renderAt("/");
  const normHtml = normalize(html);
  if (!normHtml.includes("Learn Data Structures")) throw new Error("hero heading missing");
  if (!normHtml.includes(String(TOTAL_ITEMS))) throw new Error(`total item count (${TOTAL_ITEMS}) not shown`);

  // Every section header (all 18) must always render, regardless of expand state.
  ROADMAP.forEach((sec, i) => {
    if (!normHtml.includes(normalize(sec.name))) throw new Error(`section heading "${sec.name}" missing`);
    if (!normHtml.includes(`Step ${i + 1}`)) throw new Error(`"Step ${i + 1}" badge missing for "${sec.name}"`);
  });

  // The first section is expanded by default — its items should be in the markup.
  const firstSectionItems = ROADMAP[0].subsections.flatMap((s) => s.items);
  for (const item of firstSectionItems) {
    if (!normHtml.includes(normalize(item.title))) throw new Error(`item "${item.title}" (in the default-open first section) not rendered`);
  }

  // A section further down (collapsed by default) should NOT have its rows in
  // the initial markup — confirms the accordion is actually collapsing, not
  // just visually hiding everything via CSS while dumping 474 rows into the DOM.
  const laterSectionItem = ROADMAP[ROADMAP.length - 1].subsections[0].items[0];
  if (normHtml.includes(normalize(laterSectionItem.title))) {
    throw new Error(`"${laterSectionItem.title}" (in a collapsed section) unexpectedly rendered — accordion isn't collapsing`);
  }

  if (!html.includes("Overall progress")) throw new Error("progress bar missing");
  ok(`LandingPage renders hero, all ${ROADMAP.length} section headers with correct step numbers, first section's items, and correctly withholds collapsed sections`);
} catch (e) {
  fail(`LandingPage: ${e.message}`);
}

// ---- Roadmap data integrity ----
try {
  const flat = flatItems();
  if (flat.length !== TOTAL_ITEMS) throw new Error(`flatItems() returned ${flat.length}, expected ${TOTAL_ITEMS}`);
  const nums = flat.map((i) => i.num).sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) throw new Error(`sheet numbering gap/duplicate at position ${i}: expected ${i + 1}, got ${nums[i]}`);
  }
  const builtInRoadmap = new Set(flat.filter((i) => i.builtId).map((i) => i.builtId));
  for (const algo of ALGORITHMS) {
    if (!builtInRoadmap.has(algo.id)) throw new Error(`built algorithm "${algo.id}" has no corresponding roadmap entry`);
  }
  ok(`Roadmap data is internally consistent: ${TOTAL_ITEMS} items numbered 1-${TOTAL_ITEMS} with no gaps, all ${ALGORITHMS.length} built algorithms are referenced`);
} catch (e) {
  fail(`Roadmap data integrity: ${e.message}`);
}

// ---- Every algorithm detail page ----
for (const algo of ALGORITHMS) {
  try {
    const html = renderAt(`/algo/${algo.id}`, algo.id);
    const normHtml = normalize(html);
    if (!normHtml.includes(normalize(algo.title))) throw new Error("title missing");
    if (!html.includes("Intuition")) throw new Error("Notes: Intuition heading missing");
    if (!html.includes("Approach")) throw new Error("Notes: Approach heading missing");
    if (!html.includes("Dry run")) throw new Error("Notes: Dry run heading missing");
    if (!html.includes("Common pitfalls")) throw new Error("Notes: pitfalls heading missing");
    if (!normalize(html).includes(normalize(algo.notes.intuition.slice(0, 20)))) throw new Error("intuition text not rendered");
    if (!html.includes("JavaScript") || !html.includes("Python") || !html.includes("C++")) throw new Error("language tabs missing");
    if (!normHtml.includes(normalize(algo.codes.js.split("\n")[0].slice(0, 15)))) throw new Error("JS code not rendered");
    if (!html.includes("Step 1")) throw new Error("step counter missing");
    if (!html.includes("Open JS Playground")) throw new Error("playground toggle missing");
    if (!html.includes(`difficulty-${algo.difficulty}`)) throw new Error("difficulty badge missing");
    if (!html.includes(`level-${algo.level}`)) throw new Error("level badge missing");
    if (!html.includes("Mark as done")) throw new Error("progress checkbox missing");
    ok(`AlgorithmPage /algo/${algo.id}: notes + code + controls + playground all render`);
  } catch (e) {
    fail(`AlgorithmPage /algo/${algo.id}: ${e.message}`);
  }
}

// ---- unknown id doesn't crash ----
try {
  const html = renderAt("/algo/does-not-exist");
  if (!normalize(html).includes(normalize("Couldn't find"))) throw new Error("expected not-found message");
  ok("Unknown algorithm id renders a graceful not-found message instead of crashing");
} catch (e) {
  fail(`Unknown id handling: ${e.message}`);
}

console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL SSR CHECKS PASSED");
process.exitCode = failures ? 1 : 0;
