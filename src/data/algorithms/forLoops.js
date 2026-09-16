import { drawBars, makeSnap } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 300;

function buildSteps(n) {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  const steps = [];
  const record = makeSnap(steps, () => arr.slice(), (svg, snapshot, extra) => drawBars(svg, W, H, snapshot, extra));

  record(`A for loop repeats a block of code a known number of times, using a counter. Sum the numbers 1 to ${n}.`,
    { js: 1, py: 1, cpp: 1 }, {});

  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += arr[i];
    record(`i = ${i}: add arr[${i}] = ${arr[i]} to the running sum. Sum so far: ${sum}.`, { js: 2, py: 2, cpp: 2 }, { compare: [i] });
  }

  record(`Loop condition (i < ${n}) is now false — the loop ends. Final sum: ${sum}.`, { js: 4, py: 4, cpp: 4 }, { sortedFrom: 0 });
  return steps;
}

export default {
  id: "for-loops",
  title: "For loops",
  category: "Things to Know",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Fundamentals", "Control Flow", "Iteration"],
  blurb: "Repeat a block of code a known number of times, using a counter that's initialized, checked, and updated automatically by the loop itself.",
  complexity: "Time: O(n) for n iterations · Space: O(1) beyond whatever the loop body uses",
  defaultInput: 5,
  sheetNum: 6,
  inputConfig: (algo) => boundedIntConfig(algo, "How many numbers to sum (n)", 1, 12),
  buildSteps,
  notes: {
    intuition:
      "A for loop packages up the three things almost every counted repetition needs — a starting point, a stopping condition, and a way to move forward each time — into one line. It's the natural choice whenever you know (or can compute) in advance roughly how many times you need to repeat something, like 'do this once for every element in an array.'",
    approach: [
      "The loop has three parts, all on one line: initialization (`let i = 0`, run once at the very start), a condition (`i < n`, checked before EVERY iteration), and an update (`i++`, run after every iteration's body).",
      "As long as the condition is true, the loop body runs, then the update happens, then the condition is checked again.",
      "The moment the condition becomes false, the loop stops immediately — the body doesn't run one more time.",
    ],
    dryRun: "sum 1 to 5: i=0 sum=1, i=1 sum=3, i=2 sum=6, i=3 sum=10, i=4 sum=15, i=5 condition false, stop → sum=15",
    pitfalls: [
      "Off-by-one errors are the single most common for-loop bug — using `<=` instead of `<` (or vice versa) shifts the loop by exactly one iteration, which can silently read one element past the end of an array.",
      "Modifying the loop counter inside the loop body (on top of the automatic update) is usually a mistake — it makes the loop's behavior very hard to predict and is a common source of infinite loops or skipped iterations.",
      "For iterating over EVERY element of a collection without needing the index itself, many languages offer a simpler for-each / range-based for loop (`for (const x of arr)` in JS, `for x in arr:` in Python) that avoids off-by-one risk entirely.",
    ],
  },
  codes: {
    js: `function sumFirstN(n) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += i + 1;
  }
  return sum;
}`,
    py: `def sum_first_n(n):
    total = 0
    for i in range(n):
        total += i + 1
    return total`,
    cpp: `int sumFirstN(int n) {
    int sum = 0;
    for (int i = 0; i < n; i++) {
        sum += i + 1;
    }
    return sum;
}`,
  },
};
