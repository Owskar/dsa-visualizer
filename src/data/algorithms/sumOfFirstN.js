import { clearStage, drawGrid, textEl, box, makeSnap, COLORS } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 380;
const BOX_W = 160, BOX_H = 40;
const BASE_Y = H - 50;
const CENTER_X = W / 2;

function drawCallStack(svg, frames) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  svg.appendChild(textEl(CENTER_X, H - 22, "Call stack", { size: 12, fill: COLORS.inkFaint }));

  frames.forEach((f, i) => {
    const y = BASE_Y - (i + 1) * BOX_H;
    let fill = COLORS.paperRaised, stroke = COLORS.ink;
    if (f.value !== undefined) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (i === frames.length - 1) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    const label = f.value !== undefined ? `sum(${f.n}) = ${f.value}` : `sum(${f.n})`;
    svg.appendChild(box(CENTER_X - BOX_W / 2, y, BOX_W, BOX_H, { fill, stroke, strokeWidth: 2, label, fontSize: 14, dataRole: "frame-label" }));
  });

  if (frames.length === 0) {
    svg.appendChild(textEl(CENTER_X, H / 2 - 20, "Call stack is empty", { mono: true, size: 14, fill: COLORS.inkFaint }));
  }
}

function buildSteps(n) {
  const frames = [];
  const steps = [];
  const record = makeSnap(steps, () => frames.map((f) => ({ ...f })), (svg, snapshot) => drawCallStack(svg, snapshot));

  function sum(k) {
    frames.push({ n: k, value: undefined });
    record(`Call sum(${k}) — pushed onto the call stack.`, { js: 1, py: 1, cpp: 1 }, {});

    let result;
    if (k <= 0) {
      result = 0;
      record(`Base case: sum(0) = 0.`, { js: 2, py: 2, cpp: 2 }, {});
    } else {
      record(`Recursive case: sum(${k}) = ${k} + sum(${k - 1}). Compute sum(${k - 1}) first.`, { js: 4, py: 4, cpp: 4 }, {});
      const smaller = sum(k - 1);
      result = k + smaller;
      record(`Back from sum(${k - 1}) = ${smaller}. sum(${k}) = ${k} + ${smaller} = ${result}.`, { js: 4, py: 4, cpp: 4 }, {});
    }

    frames[frames.length - 1].value = result;
    record(`sum(${k}) returns ${result} — its frame is popped.`, { js: 4, py: 4, cpp: 4 }, {});
    frames.pop();
    return result;
  }

  record(`Add up every whole number from 1 to ${n} using recursion: sum(n) = n + sum(n-1).`, { js: 1, py: 1, cpp: 1 }, {});
  const total = sum(n);
  record(`Done. The sum of the first ${n} numbers is ${total}.`, { js: 4, py: 4, cpp: 4 }, {});
  return steps;
}

export default {
  id: "sum-of-first-n",
  title: "Sum of First N Numbers",
  category: "Basic Recursion",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Recursion", "Call Stack"],
  blurb: "Add up 1 + 2 + ... + n recursively: the sum of the first n numbers is n plus the sum of the first n-1.",
  complexity: "Time: O(n) · Space: O(n) call stack",
  defaultInput: 5,
  sheetNum: 47,
  inputConfig: (algo) => boundedIntConfig(algo, "n (keep it small, e.g. 1–10)", 0, 12),
  buildSteps,
  notes: {
    intuition:
      "The sum of the first n numbers is just n plus the sum of everything before it — sum(n) = n + sum(n-1). That's the recursive definition directly. The base case is sum(0) = 0 (nothing left to add), which stops the recursion from going forever.",
    approach: [
      "Base case: if n is 0 (or less), return 0 — there's nothing to sum.",
      "Recursive case: return n plus the result of calling sum(n - 1).",
      "Each call waits for its smaller call to finish before it can add its own n and return.",
    ],
    dryRun: "sum(4) = 4 + sum(3) = 4 + (3 + sum(2)) = 4 + 3 + (2 + sum(1)) = 4+3+2+(1+sum(0)) = 4+3+2+1+0 = 10",
    pitfalls: [
      "This can also be computed in O(1) with the direct formula n×(n+1)/2 — the recursive version here is a teaching example for building recursion intuition, not the efficient way to actually compute this in practice.",
      "Forgetting the base case (or getting its condition wrong, e.g. `n == 1` instead of `n <= 0`) is an easy way to cause infinite recursion or an off-by-one error in the final sum.",
      "Each recursive call adds a frame to the call stack — for very large n, this uses O(n) space and can risk a stack overflow, unlike an equivalent iterative loop which uses O(1) space.",
    ],
  },
  codes: {
    js: `function sum(n) {
  if (n <= 0) return 0;
  return n + sum(n - 1);
}`,
    py: `def sum_first_n(n):
    if n <= 0:
        return 0
    return n + sum_first_n(n - 1)`,
    cpp: `int sumFirstN(int n) {
    if (n <= 0) return 0;
    return n + sumFirstN(n - 1);
}`,
  },
};
