import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../src/components/LandingPage.jsx";
import AlgorithmPage from "../src/components/AlgorithmPage.jsx";
import { ALGORITHMS, CATEGORY_ORDER } from "../src/data/algorithms/index.js";

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

// ---- Landing page ----
try {
  const html = renderAt("/");
  const normHtml = normalize(html);
  if (!normHtml.includes("Learn Data Structures")) throw new Error("hero heading missing");
  for (const algo of ALGORITHMS) {
    if (!normHtml.includes(normalize(algo.title))) throw new Error(`"${algo.title}" not listed on landing page`);
  }
  for (const cat of CATEGORY_ORDER) {
    if (!normHtml.includes(normalize(cat))) throw new Error(`category heading "${cat}" missing`);
  }
  if (!html.includes("Overall progress")) throw new Error("progress bar missing");
  if (!normHtml.includes("Step 1")) throw new Error("roadmap step numbering missing");
  if (!normHtml.includes(`Step ${CATEGORY_ORDER.length}`)) throw new Error("roadmap step numbering incomplete");
  ok(`LandingPage renders hero, all ${ALGORITHMS.length} problems, all ${CATEGORY_ORDER.length} category headings, and progress bar`);
} catch (e) {
  fail(`LandingPage: ${e.message}`);
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
