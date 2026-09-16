import { clearStage, drawGrid, textEl, box, makeSnap, COLORS } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 260;

function draw(svg, { n, done }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  svg.appendChild(box(W / 2 - 60, H / 2 - 35, 120, 70, {
    fill: done ? COLORS.tealFaint : COLORS.blueFaint,
    stroke: done ? COLORS.teal : COLORS.blue,
    strokeWidth: 2.5, label: n, fontSize: 28, dataRole: "countdown-n",
  }));
  svg.appendChild(textEl(W / 2, H / 2 - 55, done ? "Liftoff!" : "n", { size: 13, weight: 700, fill: done ? COLORS.teal : COLORS.inkFaint }));
}

function buildSteps(start) {
  let n = start;
  const steps = [];
  const record = makeSnap(steps, () => n, (svg, snapshotN, extra) => draw(svg, { n: snapshotN, ...extra }));

  record(`A while loop repeats a block of code AS LONG AS a condition stays true — checked before every iteration. Count down from ${start} to liftoff.`,
    { js: 1, py: 1, cpp: 1 }, {});

  while (n > 0) {
    record(`Condition (n > 0) is true: n = ${n}. Print it, then decrement.`, { js: 3, py: 2, cpp: 3 }, {});
    n--;
  }

  record(`Condition (n > 0) is now false (n = ${n}) — the loop stops. Liftoff!`, { js: 2, py: 1, cpp: 2 }, { done: true });
  return steps;
}

export default {
  id: "while-loops",
  title: "While loops",
  category: "Things to Know",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Fundamentals", "Control Flow", "Iteration"],
  blurb: "Repeat a block of code for as long as a condition stays true — used when you don't know in advance exactly how many iterations you'll need.",
  complexity: "Time: depends on how many iterations the condition allows · Space: O(1) beyond the loop body",
  defaultInput: 5,
  sheetNum: 7,
  inputConfig: (algo) => boundedIntConfig(algo, "Countdown starting number", 1, 15),
  buildSteps,
  notes: {
    intuition:
      "A while loop is the more general cousin of a for loop: instead of a fixed count baked into the loop's syntax, it just keeps checking one condition before every iteration, and stops the moment that condition becomes false. It's the right tool when you can't predict in advance exactly how many times you'll need to repeat — like 'keep dividing by 10 until the number reaches 0' (Count Digits, Reverse a Number) or 'keep reading input until the user types quit'.",
    approach: [
      "Write the condition once, after `while`.",
      "Before EVERY iteration (including the very first), the condition is checked — if it's false, the loop never runs at all.",
      "If the condition is true, the loop body runs, and then the condition is checked again.",
      "Somewhere inside the loop body, something needs to change that will eventually make the condition false — otherwise the loop never ends.",
    ],
    dryRun: "countdown from 3: n=3 (true, print, n=2) → n=2 (true, print, n=1) → n=1 (true, print, n=0) → n=0 (false, stop) → Liftoff!",
    pitfalls: [
      "The most common while-loop bug is forgetting to update whatever the condition depends on inside the loop body — that creates an infinite loop that never terminates.",
      "A `while` loop checks its condition BEFORE the first iteration, so if the condition starts false, the body never runs even once — a `do...while` loop (available in some languages) checks AFTER, guaranteeing at least one run.",
      "Many of the digit-manipulation problems in Basic Maths (Count Digits, Reverse a Number, Check Prime) use exactly this pattern — 'while some condition holds, peel off a piece and shrink the problem' — recognizing that shape is a core skill.",
    ],
  },
  codes: {
    js: `function countdown(n) {
  const result = [];
  while (n > 0) {
    result.push(n);
    n--;
  }
  return result;
}`,
    py: `def countdown(n):
    result = []
    while n > 0:
        result.append(n)
        n -= 1
    return result`,
    cpp: `vector<int> countdown(int n) {
    vector<int> result;
    while (n > 0) {
        result.push_back(n);
        n--;
    }
    return result;
}`,
  },
};
