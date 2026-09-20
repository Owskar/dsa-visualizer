import { clearStage, drawGrid, textEl, box, makeSnap, COLORS } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 760, H = 400;
const BOX_W = 130, BOX_H = 40;
const BASE_Y = H - 50;
const CENTER_X = W / 2;

function drawCallStack(svg, frames, opts = {}) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  svg.appendChild(textEl(CENTER_X, H - 22, "Call stack — only the currently-active chain of calls is shown", { size: 12, fill: COLORS.inkFaint }));

  frames.forEach((f, i) => {
    const y = BASE_Y - (i + 1) * BOX_H;
    let fill = COLORS.paperRaised, stroke = COLORS.ink;
    if (f.value !== undefined) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (i === frames.length - 1) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    const label = f.value !== undefined ? `fib(${f.n}) = ${f.value}` : `fib(${f.n})`;
    svg.appendChild(box(CENTER_X - BOX_W / 2, y, BOX_W, BOX_H, { fill, stroke, strokeWidth: 2, label, fontSize: 14, dataRole: "frame-label" }));
  });

  if (opts.callCount !== undefined) {
    svg.appendChild(textEl(CENTER_X, 26, `Total fib() calls so far: ${opts.callCount}`, { mono: true, size: 13, weight: 700, fill: COLORS.amber }));
  }
  if (frames.length === 0 && opts.finalValue === undefined) {
    svg.appendChild(textEl(CENTER_X, H / 2 - 30, "Call stack is empty", { mono: true, size: 14, fill: COLORS.inkFaint }));
  }
}

function buildSteps(n) {
  const frames = [];
  const steps = [];
  const snap = makeSnap(steps, () => frames.map((f) => ({ ...f })), (svg, snapshot, extra) => drawCallStack(svg, snapshot, extra));
  let callCount = 0;

  function fib(k) {
    callCount++;
    frames.push({ n: k, value: undefined });
    snap(`Call fib(${k}) — pushed onto the call stack. (Call #${callCount} overall.)`, { js: 2, py: 2, cpp: 2 }, { callCount });

    let result;
    if (k <= 1) {
      result = k;
      snap(`Base case: fib(${k}) = ${k} directly.`, { js: 3, py: 3, cpp: 3 }, { callCount });
    } else {
      snap(`Recursive case: fib(${k}) = fib(${k - 1}) + fib(${k - 2}). Compute fib(${k - 1}) first.`, { js: 5, py: 4, cpp: 5 }, { callCount });
      const a = fib(k - 1);
      snap(`Back from fib(${k - 1}) = ${a}. Now compute fib(${k - 2}).`, { js: 5, py: 4, cpp: 5 }, { callCount });
      const b = fib(k - 2);
      result = a + b;
      snap(`Back from fib(${k - 2}) = ${b}. fib(${k}) = ${a} + ${b} = ${result}.`, { js: 5, py: 4, cpp: 5 }, { callCount });
    }

    frames[frames.length - 1].value = result;
    snap(`fib(${k}) returns ${result} — its frame is popped.`, { js: 5, py: 4, cpp: 5 }, { callCount });
    frames.pop();
    return result;
  }

  snap(`Call fib(${n}). Watch how many times the SAME smaller subproblems get recomputed — that's the case for memoization.`, { js: 1, py: 1, cpp: 1 }, { callCount });
  const answer = fib(n);
  snap(`Done. fib(${n}) = ${answer}, using ${callCount} total calls (naive recursion recomputes overlapping subproblems many times).`,
    { js: 1, py: 1, cpp: 1 }, { callCount, finalValue: answer });
  return steps;
}

export default {
  id: "fibonacci",
  title: "Fibonacci Number (Recursion)",
  category: "Recursion",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Call Stack", "Overlapping Subproblems", "Memoization"],
  blurb: "Each Fibonacci number is the sum of the two before it — naive recursion works, but recomputes the same subproblems over and over.",
  complexity: "Naive recursion — Time: O(2ⁿ) · Space: O(n) call stack. With memoization — Time: O(n) · Space: O(n)",
  defaultInput: 5,
  sheetNum: 51,
  inputConfig: (algo) => boundedIntConfig(algo, "n (keep it small — this grows fast! e.g. 1–7)", 0, 7),
  buildSteps,
  notes: {
    intuition:
      "The Fibonacci sequence is defined by itself: fib(n) = fib(n-1) + fib(n-2). That definition translates directly into recursive code. The catch: fib(n-1) and fib(n-2) each independently need fib(n-3), fib(n-4)... — the SAME smaller values get computed again and again down different branches. Watching the call count explode as n grows is the clearest way to see why this matters.",
    approach: [
      "Base case: fib(0) = 0 and fib(1) = 1 — return directly, no further recursion.",
      "Recursive case: fib(n) = fib(n-1) + fib(n-2) — make both recursive calls and add their results.",
      "Notice that fib(n-1)'s own recursion will eventually call fib(n-2) again independently — that's the overlapping-subproblems issue.",
      "The fix (memoization): cache each fib(k) result the first time it's computed, and return the cached value instantly on any later request for the same k — this turns O(2ⁿ) into O(n).",
    ],
    dryRun: "fib(5) = fib(4)+fib(3); fib(4) = fib(3)+fib(2) ... fib(3) gets computed TWICE independently (once inside fib(4), once inside fib(5)'s own fib(3)) — and it only gets worse for larger n.",
    pitfalls: [
      "This naive version is O(2ⁿ) — genuinely exponential. fib(30) already takes over a million calls; fib(40) would take way too long to be practical.",
      "The fix isn't a different algorithm, just remembering answers you've already computed (memoization with a hashmap or array), or building the sequence bottom-up iteratively (tabulation) — both bring it down to O(n).",
      "This exact 'naive recursion has overlapping subproblems → memoize it' story is the on-ramp to essentially all of dynamic programming — Fibonacci is the simplest possible example of the pattern.",
    ],
  },
  codes: {
    js: `function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// With memoization:
function fibMemo(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}`,
    py: `def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# With memoization:
def fib_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]`,
    cpp: `int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// With memoization:
int fibMemo(int n, vector<int>& memo) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];
    return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}`,
  },
};
