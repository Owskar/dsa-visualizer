import { clearStage, drawGrid, textEl, box, arrow, makeSnap, COLORS } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 300;

function draw(svg, { n, checking, result }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);

  svg.appendChild(box(W / 2 - 60, 30, 120, 50, { fill: COLORS.blueFaint, stroke: COLORS.blue, strokeWidth: 2, label: `n = ${n}`, fontSize: 16, dataRole: "value-n" }));

  const branches = [
    { label: "n > 0 ?", cond: "positive", x: 90 },
    { label: "n < 0 ?", cond: "negative", x: W / 2 - 60 },
    { label: "else", cond: "zero", x: W - 210 },
  ];

  branches.forEach((b) => {
    const isChecking = checking === b.cond;
    const isResult = result === b.cond;
    const fill = isResult ? COLORS.tealFaint : isChecking ? COLORS.amberFaint : COLORS.paperRaised;
    const stroke = isResult ? COLORS.teal : isChecking ? COLORS.amber : COLORS.ink;
    svg.appendChild(box(b.x, 130, 120, 50, { fill, stroke, strokeWidth: 2, label: b.label, fontSize: 14, dataRole: "branch-check" }));
    svg.appendChild(arrow(W / 2, 80, b.x + 60, 130 - 6, { color: COLORS.inkFaint, dashed: true }));
  });

  if (result) {
    const labels = { positive: "n is positive", negative: "n is negative", zero: "n is zero" };
    svg.appendChild(textEl(W / 2, 220, labels[result], { mono: true, size: 16, weight: 700, fill: COLORS.teal }));
  }
}

function buildSteps(n) {
  const steps = [];
  const record = makeSnap(steps, () => n, (svg, snapshotN, extra) => draw(svg, { n: snapshotN, ...extra }));

  record(`Decide what to print for n = ${n} using an if / else if / else chain.`, { js: 1, py: 1, cpp: 1 }, {});
  record(`Check the first condition: is n > 0?`, { js: 2, py: 2, cpp: 3 }, { checking: "positive" });

  if (n > 0) {
    record(`n > 0 is true — take this branch and stop checking further conditions.`, { js: 3, py: 3, cpp: 4 }, { result: "positive" });
    return steps;
  }

  record(`n > 0 is false — move to the next check: is n < 0?`, { js: 4, py: 4, cpp: 5 }, { checking: "negative" });

  if (n < 0) {
    record(`n < 0 is true — take this branch.`, { js: 5, py: 5, cpp: 6 }, { result: "negative" });
    return steps;
  }

  record(`n < 0 is also false — none of the conditions matched, so fall through to the else branch.`, { js: 6, py: 6, cpp: 7 }, { checking: "zero" });
  record(`else: n must be exactly 0.`, { js: 7, py: 7, cpp: 8 }, { result: "zero" });
  return steps;
}

export default {
  id: "if-else",
  title: "If Else",
  category: "Things to Know",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Fundamentals", "Control Flow"],
  blurb: "Branch your program's behavior based on a condition — if/else if/else checks conditions in order and runs only the first branch that matches.",
  complexity: "Time: O(1) per condition checked · Space: O(1)",
  defaultInput: 7,
  sheetNum: 3,
  inputConfig: (algo) => boundedIntConfig(algo, "Any whole number (try negative, zero, or positive)", -1000, 1000),
  buildSteps,
  notes: {
    intuition:
      "An if/else chain checks conditions IN ORDER, top to bottom, and runs the code under the FIRST one that's true — then skips all the rest, even if a later condition would also be true. The final `else` (with no condition) is a catch-all: it only runs if every single condition above it was false.",
    approach: [
      "Write the first condition after `if` — if it evaluates to true, that branch runs and every other branch is skipped entirely.",
      "If the first condition is false, move to the next `else if` and check its condition.",
      "Repeat for as many `else if` branches as needed.",
      "If none of the conditions matched, the final plain `else` branch runs (if one exists) as the default case.",
    ],
    dryRun: "n = -3: is n>0? false → is n<0? true → run the negative branch, skip the else entirely",
    pitfalls: [
      "Order matters — conditions are checked top to bottom, and only the FIRST true one runs. Putting a broad, catch-all condition before a more specific one can accidentally make the specific one unreachable.",
      "An `else` is optional — if you leave it off and none of the `if`/`else if` conditions match, nothing happens at all, which is sometimes exactly what you want and sometimes a silent bug.",
      "Don't confuse `=` (assignment) with `==` (comparison) inside a condition — `if (x = 5)` in some languages assigns 5 to x and then evaluates as true, which is a classic hard-to-spot bug in C-family languages.",
    ],
  },
  codes: {
    js: `function classify(n) {
  if (n > 0) {
    return "positive";
  } else if (n < 0) {
    return "negative";
  } else {
    return "zero";
  }
}`,
    py: `def classify(n):
    if n > 0:
        return "positive"
    elif n < 0:
        return "negative"
    else:
        return "zero"`,
    cpp: `string classify(int n) {
    if (n > 0) {
        return "positive";
    } else if (n < 0) {
        return "negative";
    } else {
        return "zero";
    }
}`,
  },
};
