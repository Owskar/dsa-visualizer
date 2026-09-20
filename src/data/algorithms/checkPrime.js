import { clearStage, drawGrid, textEl, box, makeSnap, COLORS } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 260;

function draw(svg, { n, i, status, caption }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  svg.appendChild(textEl(W / 2, 40, `Is ${n} prime?`, { size: 18, weight: 700, fill: COLORS.ink }));

  const fill = status === "divides" ? COLORS.redFaint : status === "checking" ? COLORS.blueFaint : COLORS.paperRaised;
  const stroke = status === "divides" ? COLORS.red : status === "checking" ? COLORS.blue : COLORS.ink;
  svg.appendChild(box(W / 2 - 45, H / 2 - 20, 90, 60, { fill, stroke, strokeWidth: 2.5, label: `i = ${i}`, fontSize: 18, dataRole: "candidate-i" }));

  if (caption) {
    const el = textEl(W / 2, H - 26, caption, { mono: true, size: 14, weight: 700, fill: COLORS.teal });
    el.setAttribute("data-role", "caption-label");
    svg.appendChild(el);
  }
}

function buildSteps(input) {
  const n = Math.max(0, Math.abs(Math.trunc(input)));
  const steps = [];
  const record = makeSnap(steps, () => ({}), (svg, _s, extra) => draw(svg, { n, ...extra }));

  if (n < 2) {
    record(`${n} is less than 2 — by definition, it's not prime.`, { js: 2, py: 2, cpp: 2 }, { i: n, caption: `${n} is NOT prime` });
    return steps;
  }

  record(`Check if ${n} is prime by testing possible divisors from 2 up to √${n}.`, { js: 3, py: 3, cpp: 3 }, { i: 2 });

  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) {
      record(`${i} divides ${n} evenly — ${n} has a divisor other than 1 and itself, so it's NOT prime.`, { js: 5, py: 4, cpp: 5 }, { i, status: "divides", caption: `${n} is NOT prime (divisible by ${i})` });
      return steps;
    }
    record(`${i} does not divide ${n} — keep checking.`, { js: 4, py: 3, cpp: 4 }, { i, status: "checking" });
  }

  record(`No divisor found up to √${n} — ${n} is prime!`, { js: 6, py: 6, cpp: 7 }, { i: Math.floor(Math.sqrt(n)), caption: `${n} IS prime` });
  return steps;
}

export default {
  id: "check-prime",
  title: "Check for Prime Number",
  category: "Basic Maths",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Math", "Optimization"],
  blurb: "Check whether a number is prime by testing for divisors only up to its square root.",
  complexity: "Time: O(√n) · Space: O(1)",
  defaultInput: 29,
  sheetNum: 42,
  inputConfig: (algo) => boundedIntConfig(algo, "A whole number", 0, 1000000),
  buildSteps,
  notes: {
    intuition:
      "A number is prime if its only divisors are 1 and itself. You don't need to check EVERY number up to n — if n has a divisor bigger than √n, it must also have a matching divisor SMALLER than √n (since divisors pair up, like in Print all Divisors). So if no divisor turns up by the time you reach √n, none exists at all, and n is prime.",
    approach: [
      "Numbers less than 2 are not prime by definition — handle that immediately.",
      "Check every candidate divisor i from 2 up to √n.",
      "If any i divides n evenly, n is NOT prime — stop immediately and report that.",
      "If you reach past √n without finding any divisor, n IS prime.",
    ],
    dryRun: "29: check i=2 (no), i=3 (no), i=4 (no) — 4×4=16≤29 but 5×5=25≤29, 6×6=36>29 so loop stops after i=5 (no) → no divisor found → 29 is prime",
    pitfalls: [
      "Checking all the way up to n (instead of just √n) still gives the correct answer, but is wastefully slow for large n — the √n bound is the key optimization.",
      "Don't forget that 0 and 1 are NOT prime, and negative numbers aren't prime either — these edge cases are easy to overlook.",
      "2 is the only even prime number — some implementations special-case even numbers (check divisibility by 2 first, then only test odd candidates) to roughly halve the work, though it's not required for correctness.",
    ],
  },
  codes: {
    js: `function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}`,
    py: `def is_prime(n):
    if n < 2:
        return False
    i = 2
    while i * i <= n:
        if n % i == 0:
            return False
        i += 1
    return True`,
    cpp: `bool isPrime(int n) {
    if (n < 2) return false;
    for (int i = 2; (long long)i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}`,
  },
};
