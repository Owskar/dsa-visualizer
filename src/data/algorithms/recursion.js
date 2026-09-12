import { clearStage, drawGrid, textEl, box, makeSnap, COLORS } from "../viz.js";

const W = 720, H = 380;
const BOX_W = 220, BOX_H = 44;
const BASE_Y = H - 50;
const CENTER_X = W / 2;

function drawCallStack(svg, frames, opts = {}) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  svg.appendChild(textEl(CENTER_X, H - 22, "Call stack — each recursive call waits for the one above it to return", { size: 12, fill: COLORS.inkFaint }));

  frames.forEach((f, i) => {
    const y = BASE_Y - (i + 1) * BOX_H;
    const isTop = i === frames.length - 1 && opts.highlightTop;
    let fill = "#fff", stroke = COLORS.ink;
    if (f.value !== undefined) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (isTop || i === frames.length - 1) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    const label = f.value !== undefined ? `factorial(${f.n}) = ${f.value}` : `factorial(${f.n})`;
    svg.appendChild(box(CENTER_X - BOX_W / 2, y, BOX_W, BOX_H, { fill, stroke, strokeWidth: 2, label, fontSize: 15, dataRole: "frame-label" }));
  });

  if (frames.length === 0) {
    svg.appendChild(textEl(CENTER_X, H / 2 - 20, "Call stack is empty", { mono: true, size: 14, fill: COLORS.inkFaint }));
  }
}

function buildSteps(n) {
  const frames = [];
  const steps = [];
  const snap = makeSnap(steps, () => frames.map((f) => ({ ...f })), (svg, snapshot, extra) => drawCallStack(svg, snapshot, extra));

  let finalResult;

  function factorial(k) {
    frames.push({ n: k, value: undefined });
    snap(`Call factorial(${k}) — a new frame is pushed onto the call stack.`, { js: 1, py: 1, cpp: 1 }, { highlightTop: true });

    let result;
    if (k <= 1) {
      result = 1;
      snap(`Base case reached: factorial(${k}) returns 1 directly, no further recursion needed.`, { js: 2, py: 2, cpp: 2 }, { highlightTop: true });
    } else {
      snap(`Recursive case: factorial(${k}) = ${k} × factorial(${k - 1}). First, go compute factorial(${k - 1}).`,
        { js: 4, py: 4, cpp: 4 }, { highlightTop: true });
      const sub = factorial(k - 1);
      result = k * sub;
      snap(`Back from factorial(${k - 1}) = ${sub}. Now compute ${k} × ${sub} = ${result}.`, { js: 4, py: 4, cpp: 4 }, { highlightTop: true });
    }

    frames[frames.length - 1].value = result;
    snap(`factorial(${k}) returns ${result} — its frame is popped off the stack.`, { js: 4, py: 4, cpp: 4 }, {});
    frames.pop();
    return result;
  }

  snap(`Call factorial(${n}) to begin. Each call will wait on the next, deeper call before it can finish.`, { js: 1, py: 1, cpp: 1 }, {});
  finalResult = factorial(n);
  snap(`All frames have returned. factorial(${n}) = ${finalResult}.`, { js: 4, py: 4, cpp: 4 }, {});
  return steps;
}

export default {
  id: "recursion-factorial",
  title: "Recursion — Factorial",
  category: "Recursion",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Call Stack", "Base Case"],
  blurb: "A function that calls itself with a smaller input until it hits a base case, then the results unwind back up the call stack.",
  complexity: "Time: O(n) · Space: O(n) (call stack)",
  defaultInput: 4,
  buildSteps,
  notes: {
    intuition:
      "Recursion is 'define the answer in terms of a smaller version of itself.' factorial(n) = n × factorial(n-1) — so if you already knew factorial(n-1), the rest is one multiplication. You just need a base case (factorial(1) = 1) so the chain of smaller problems eventually stops instead of going forever.",
    approach: [
      "Identify the base case — the smallest input you can answer directly without recursing (here, n ≤ 1 → return 1).",
      "Identify the recursive case — express the answer for n in terms of a smaller call, here factorial(n-1).",
      "Each call pushes a new frame onto the call stack and waits for its recursive call to return before it can compute its own result.",
      "Once the base case returns, the results 'unwind' back up the stack: each waiting frame multiplies its n by the value it got back, then returns that upward too.",
    ],
    dryRun: "factorial(4) calls factorial(3) calls factorial(2) calls factorial(1)=1 → unwinds: 2×1=2 → 3×2=6 → 4×6=24",
    pitfalls: [
      "Forgetting the base case (or writing it wrong) causes infinite recursion, which eventually crashes with a stack overflow.",
      "Every recursive call consumes stack space — for very large n, an iterative loop uses O(1) space versus recursion's O(n), which matters for deep recursion in languages without tail-call optimization.",
      "It's easy to think all the multiplication happens 'on the way down' — it actually happens on the way back up, after the base case is hit. Tracing the call stack (as shown here) is the best way to see that clearly.",
    ],
  },
  codes: {
    js: `function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}`,
    py: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`,
    cpp: `int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}`,
  },
};
