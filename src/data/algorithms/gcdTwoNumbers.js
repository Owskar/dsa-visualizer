import { clearStage, drawGrid, textEl, box, arrow, makeSnap, COLORS } from "../viz.js";
import { twoIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 260;
const BOX_W = 140, BOX_H = 70;

function draw(svg, { a, b, done }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  const y = H / 2 - BOX_H / 2;
  const ax = W / 2 - BOX_W - 40;
  const bx = W / 2 + 40;

  svg.appendChild(box(ax, y, BOX_W, BOX_H, { fill: done ? COLORS.tealFaint : COLORS.blueFaint, stroke: done ? COLORS.teal : COLORS.blue, strokeWidth: 2.5, label: a, fontSize: 22, dataRole: "value-a" }));
  svg.appendChild(textEl(ax + BOX_W / 2, y - 16, "a", { size: 12, fill: COLORS.inkFaint }));

  if (!done) {
    svg.appendChild(box(bx, y, BOX_W, BOX_H, { fill: COLORS.amberFaint, stroke: COLORS.amber, strokeWidth: 2.5, label: b, fontSize: 22, dataRole: "value-b" }));
    svg.appendChild(textEl(bx + BOX_W / 2, y - 16, "b", { size: 12, fill: COLORS.inkFaint }));
    svg.appendChild(arrow(ax + BOX_W + 6, y + BOX_H / 2, bx - 6, y + BOX_H / 2, { color: COLORS.inkFaint, dashed: true }));
  } else {
    svg.appendChild(textEl(W / 2, y + BOX_H + 40, `GCD = ${a}`, { mono: true, size: 16, weight: 700, fill: COLORS.teal }));
  }
}

function buildSteps(a, b) {
  a = Math.abs(Math.trunc(a));
  b = Math.abs(Math.trunc(b));
  const steps = [];
  const record = makeSnap(steps, () => ({ a, b }), (svg, s, extra) => draw(svg, { ...s, ...extra }));

  record(`Find the GCD of ${a} and ${b} using the Euclidean algorithm: gcd(a, b) = gcd(b, a mod b), until b reaches 0.`,
    { js: 2, py: 2, cpp: 2 }, {});

  while (b !== 0) {
    const remainder = a % b;
    record(`gcd(${a}, ${b}) → gcd(${b}, ${a} mod ${b} = ${remainder})`, { js: 4, py: 3, cpp: 4 }, {});
    a = b;
    b = remainder;
  }

  record(`b reached 0 — the GCD is ${a}.`, { js: 5, py: 4, cpp: 5 }, { done: true });
  return steps;
}

export default {
  id: "gcd-two-numbers",
  title: "GCD of Two Numbers",
  category: "Basic Maths",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Math", "Euclidean Algorithm", "Recursion"],
  blurb: "Find the greatest common divisor of two numbers using the Euclidean algorithm — repeatedly replace the pair with (b, a mod b) until b is 0.",
  complexity: "Time: O(log(min(a, b))) · Space: O(1) iterative",
  defaultInput: 56,
  defaultTarget: 98,
  sheetNum: 39,
  inputConfig: (algo) => twoIntConfig(algo, "Two whole numbers — e.g. 56 | 98"),
  buildSteps,
  notes: {
    intuition:
      "The key fact behind the Euclidean algorithm: the GCD of two numbers doesn't change if you replace the larger one with the remainder of dividing it by the smaller one. So gcd(a, b) is exactly the same as gcd(b, a mod b) — and repeating that shrinks the numbers fast until one of them hits 0, at which point the other one IS the answer.",
    approach: [
      "Start with the two numbers a and b.",
      "While b is not 0: compute the remainder of a divided by b, then replace a with b, and b with that remainder.",
      "Once b becomes 0, a holds the greatest common divisor.",
    ],
    dryRun: "gcd(56, 98) → gcd(98, 56) [swaps naturally since 98 mod 56 path] → gcd(56, 42) → gcd(42, 14) → gcd(14, 0) → GCD = 14",
    pitfalls: [
      "The algorithm works correctly even if a < b — the very first iteration naturally swaps their roles, since a mod b when a < b just gives a back, and the pair effectively flips.",
      "This is dramatically faster than the naive 'check every number up to min(a,b)' approach — the Euclidean algorithm runs in O(log(min(a,b))) time, not O(min(a,b)).",
      "A recursive one-liner (`gcd(a,b) = b === 0 ? a : gcd(b, a % b)`) is equivalent to the iterative loop shown here — both are standard, and interviewers may ask for either.",
    ],
  },
  codes: {
    js: `function gcd(a, b) {
  while (b !== 0) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}`,
    py: `def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return a`,
    cpp: `int gcd(int a, int b) {
    while (b != 0) {
        int remainder = a % b;
        a = b;
        b = remainder;
    }
    return a;
}`,
  },
};
