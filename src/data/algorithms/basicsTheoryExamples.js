import { clearStage, drawGrid, textEl, box, makeSnap, COLORS } from "../viz.js";

const W = 720, H = 340;
const LINES = [
  "let sum = 0;",
  "for (let i = 1; i <= 5; i++) {",
  "  if (i % 2 === 0) {",
  "    sum += i;",
  "  }",
  "}",
  "console.log(sum);",
];

function draw(svg, { activeLine, vars, output }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);

  const lineH = 24;
  const codeStartY = 30;
  LINES.forEach((line, i) => {
    const isActive = i === activeLine;
    if (isActive) {
      svg.appendChild(box(30, codeStartY + i * lineH - 15, W - 300, lineH, { fill: COLORS.amberFaint, stroke: COLORS.amber, strokeWidth: 1.5, rx: 3 }));
    }
    const t = textEl(40, codeStartY + i * lineH, line, { mono: true, size: 13, anchor: "start", fill: isActive ? COLORS.ink : COLORS.inkFaint, weight: isActive ? 700 : 400 });
    t.setAttribute("data-role", "trace-line");
    t.setAttribute("data-index", String(i));
    svg.appendChild(t);
  });

  svg.appendChild(textEl(W - 130, 30, "Variables", { size: 12, weight: 700, fill: COLORS.inkFaint }));
  Object.entries(vars).forEach(([name, val], k) => {
    svg.appendChild(box(W - 200, 50 + k * 50, 140, 36, { fill: COLORS.blueFaint, stroke: COLORS.blue, strokeWidth: 2, label: `${name} = ${val}`, fontSize: 13, dataRole: "trace-var" }));
  });

  if (output !== undefined) {
    svg.appendChild(textEl(W / 2, H - 24, `Output: ${output}`, { mono: true, size: 15, weight: 700, fill: COLORS.teal }));
  }
}

function buildSteps() {
  const steps = [];
  const record = makeSnap(steps, () => ({}), (svg, _s, extra) => draw(svg, extra));

  record("Combine everything so far — variables, a for loop, and an if condition — into one small program: sum the even numbers from 1 to 5.",
    { js: 1, py: 1, cpp: 4 }, { activeLine: 0, vars: {} });

  let sum = 0;
  record("Declare sum = 0.", { js: 1, py: 1, cpp: 4 }, { activeLine: 0, vars: { sum } });

  for (let i = 1; i <= 5; i++) {
    record(`For loop: i = ${i}. Check the loop condition (i <= 5) — true, so continue.`, { js: 2, py: 2, cpp: 5 }, { activeLine: 1, vars: { sum, i } });
    const isEven = i % 2 === 0;
    record(`if (i % 2 === 0): is ${i} even? ${isEven ? "Yes" : "No"}.`, { js: 3, py: 3, cpp: 6 }, { activeLine: 2, vars: { sum, i } });
    if (isEven) {
      sum += i;
      record(`${i} is even — add it to sum. sum is now ${sum}.`, { js: 4, py: 4, cpp: 7 }, { activeLine: 3, vars: { sum, i } });
    }
  }

  record(`Loop condition (i <= 5) is now false — exit the loop. Print the final sum.`, { js: 7, py: 5, cpp: 11 }, { activeLine: 6, vars: { sum }, output: sum });
  return steps;
}

export default {
  id: "basics-theory-with-examples",
  title: "Theory with examples",
  category: "Things to Know",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Fundamentals", "Recap"],
  blurb: "Put variables, loops, and conditions together into one traced mini-program — the same building blocks that every algorithm from here on is made of.",
  complexity: "Time: O(n) for a single loop over n elements · Space: O(1)",
  defaultInput: null,
  sheetNum: 9,
  buildSteps,
  notes: {
    intuition:
      "Every algorithm you'll learn from here on — sorting, searching, graph traversal, dynamic programming — is built from exactly the same small set of ingredients you've just seen individually: variables to hold state, loops to repeat work, and conditions to make decisions. This example traces a tiny program line by line, showing exactly how those pieces combine: a loop provides repetition, a condition inside it filters which iterations do extra work, and a variable accumulates a running result across iterations.",
    approach: [
      "Start with a variable to hold the running result (`sum = 0`) — this is the pattern behind almost every 'compute something over a collection' problem.",
      "Use a for loop to visit each candidate value in turn (here, 1 through 5).",
      "Inside the loop, use an if condition to decide whether THIS iteration should affect the result (here, only even numbers).",
      "After the loop finishes, the accumulated variable holds the final answer — print or return it.",
    ],
    dryRun: "i=1 odd skip, i=2 even sum=2, i=3 odd skip, i=4 even sum=6, i=5 odd skip → loop ends → output: 6",
    pitfalls: [
      "This exact shape — accumulator variable + loop + conditional filter — reappears constantly: counting elements matching a rule, summing a subset, building a filtered list. Recognizing it is more valuable than memorizing this specific example.",
      "The order matters: the accumulator must be declared BEFORE the loop (so it persists across iterations) and the condition must be INSIDE the loop (so it's re-evaluated fresh for every value).",
      "As problems grow more complex, the 'condition inside a loop' pattern generalizes into things like sliding windows (Longest Substring), and the 'accumulate across iterations' pattern generalizes directly into dynamic programming (Climbing Stairs, Kadane's Algorithm) — this simple example is the seed of both.",
    ],
  },
  codes: {
    js: `let sum = 0;
for (let i = 1; i <= 5; i++) {
  if (i % 2 === 0) {
    sum += i;
  }
}
console.log(sum); // 6`,
    py: `total = 0
for i in range(1, 6):
    if i % 2 == 0:
        total += i
print(total)  # 6`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    int sum = 0;
    for (int i = 1; i <= 5; i++) {
        if (i % 2 == 0) {
            sum += i;
        }
    }
    cout << sum << endl; // 6
}`,
  },
};
