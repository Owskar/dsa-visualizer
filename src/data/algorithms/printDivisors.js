import { clearStage, drawGrid, textEl, drawCharBoxRow, makeSnap, COLORS } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 280;

function draw(svg, { n, i, found, caption }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  svg.appendChild(textEl(W / 2, 34, `Checking divisors of ${n} — currently trying i = ${i}`, { mono: true, size: 14, weight: 700, fill: COLORS.blue }));
  const sortedFound = found.slice().sort((a, b) => a - b);
  drawCharBoxRow(svg, W / 2, H / 2, sortedFound.map(String), "Divisors found", { dataRole: "divisor-value" });
  if (caption) {
    const el = textEl(W / 2, H - 26, caption, { mono: true, size: 13, weight: 700, fill: COLORS.teal });
    el.setAttribute("data-role", "caption-label");
    svg.appendChild(el);
  }
}

function buildSteps(input) {
  const n = Math.max(1, Math.abs(Math.trunc(input)));
  const steps = [];
  const found = [];
  const record = makeSnap(steps, () => found.slice(), (svg, snapshot, extra) => draw(svg, { n, found: snapshot, ...extra }));

  record(`Find every divisor of ${n} by checking candidates from 1 up to √${n} — each hit gives TWO divisors at once.`, { js: 2, py: 2, cpp: 2 }, { i: 1 });

  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      found.push(i);
      const pair = n / i;
      if (pair !== i) found.push(pair);
      record(`${i} divides ${n} evenly (${n} ÷ ${i} = ${pair}) — so both ${i} and ${pair} are divisors.`, { js: 4, py: 3, cpp: 4 }, { i });
    } else {
      record(`${i} does not divide ${n} evenly — skip it.`, { js: 3, py: 3, cpp: 3 }, { i });
    }
  }

  const sorted = found.slice().sort((a, b) => a - b);
  record(`Done. Divisors of ${n}: ${sorted.join(", ")}.`, { js: 8, py: 6, cpp: 8 }, { i: Math.floor(Math.sqrt(n)), caption: `Divisors: ${sorted.join(", ")}` });
  return steps;
}

export default {
  id: "print-divisors",
  title: "Print all Divisors",
  category: "Basic Maths",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Math", "Optimization"],
  blurb: "List every number that divides n evenly, checking only up to √n by finding divisor pairs.",
  complexity: "Time: O(√n) · Space: O(number of divisors)",
  defaultInput: 36,
  sheetNum: 41,
  inputConfig: (algo) => boundedIntConfig(algo, "A positive whole number", 1, 100000),
  buildSteps,
  notes: {
    intuition:
      "Divisors come in pairs: if i divides n, then n/i is also a divisor (e.g. for 36, if 4 divides it, so does 36/4=9). This means you never need to check candidates beyond √n — every divisor bigger than √n has already been found as the PARTNER of some smaller divisor you checked earlier. That cuts the work from O(n) down to O(√n).",
    approach: [
      "Loop a candidate i from 1 up to √n (inclusive).",
      "If i divides n evenly (n % i === 0), you've found a pair: i itself, and its partner n / i.",
      "Add both to the list of divisors — unless i and n/i are the same number (which happens exactly when n is a perfect square, like 6×6=36), in which case only add it once.",
      "After the loop, the collected list holds every divisor of n.",
    ],
    dryRun: "36: check i=1→36 (pair 1,36), i=2→18 (pair 2,18), i=3→12 (pair 3,12), i=4→9 (pair 4,9), i=5 no, i=6→6 (pair 6,6, same value, add once) → divisors: 1,2,3,4,6,9,12,18,36",
    pitfalls: [
      "The naive approach (checking every candidate from 1 to n) is O(n) — checking only up to √n and taking pairs is the key optimization that makes this efficient for large n.",
      "Don't forget the perfect-square edge case — when i × i === n exactly, i and n/i are the SAME number, and adding it twice would produce a duplicate in the output.",
      "The loop condition `i * i <= n` avoids computing `Math.sqrt(n)` repeatedly (and sidesteps floating-point rounding issues that can occur when comparing `i <= Math.sqrt(n)` directly for perfect squares).",
    ],
  },
  codes: {
    js: `function printDivisors(n) {
  const divisors = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      divisors.push(i);
      if (i !== n / i) divisors.push(n / i);
    }
  }
  return divisors.sort((a, b) => a - b);
}`,
    py: `def print_divisors(n):
    divisors = []
    i = 1
    while i * i <= n:
        if n % i == 0:
            divisors.append(i)
            if i != n // i:
                divisors.append(n // i)
        i += 1
    return sorted(divisors)`,
    cpp: `vector<int> printDivisors(int n) {
    vector<int> divisors;
    for (int i = 1; (long long)i * i <= n; i++) {
        if (n % i == 0) {
            divisors.push_back(i);
            if (i != n / i) divisors.push_back(n / i);
        }
    }
    sort(divisors.begin(), divisors.end());
    return divisors;
}`,
  },
};
