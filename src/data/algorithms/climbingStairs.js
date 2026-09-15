import { drawBars, makeSnap } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 320;

function buildSteps(n) {
  const dp = new Array(n + 1).fill(0);
  const steps = [];
  const snap = makeSnap(steps, () => dp.slice(), (svg, snapshot, extra) => drawBars(svg, W, H, snapshot, extra));

  snap(`How many distinct ways to climb ${n} stairs, taking 1 or 2 steps at a time? Build a DP table bottom-up.`,
    { js: 2, py: 2, cpp: 2 }, {});

  dp[0] = 1;
  snap("Base case: dp[0] = 1 — there's exactly one way to 'climb' 0 stairs (do nothing).", { js: 3, py: 3, cpp: 3 }, { compare: [0] });

  if (n >= 1) {
    dp[1] = 1;
    snap("Base case: dp[1] = 1 — only one way to climb 1 stair (a single 1-step).", { js: 4, py: 4, cpp: 4 }, { compare: [1] });
  }

  for (let i = 2; i <= n; i++) {
    snap(`To reach step ${i}, your last move was either a 1-step from step ${i - 1}, or a 2-step from step ${i - 2}.`,
      { js: 7, py: 6, cpp: 7 }, { compare: [i - 1, i - 2] });
    dp[i] = dp[i - 1] + dp[i - 2];
    snap(`dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}.`,
      { js: 7, py: 6, cpp: 7 }, { swap: [i], compare: [i - 1, i - 2] });
  }

  snap(`Done. There are ${dp[n]} distinct ways to climb ${n} stairs.`, { js: 9, py: 8, cpp: 9 }, { sortedFrom: 0 });
  return steps;
}

export default {
  id: "climbing-stairs",
  title: "Climbing Stairs",
  category: "Dynamic Programming",
  level: "Intermediate",
  difficulty: "Easy",
  tags: ["DP", "1D Array", "Fibonacci Pattern"],
  blurb: "Count the number of distinct ways to climb n stairs, taking 1 or 2 steps at a time — the simplest possible DP problem.",
  complexity: "Time: O(n) · Space: O(n) (or O(1) if you only keep the last two values)",
  defaultInput: 5,
  sheetNum: 405,
  inputConfig: (algo) => boundedIntConfig(algo, "Number of stairs (e.g. 1–12)", 0, 12),
  buildSteps,
  notes: {
    intuition:
      "Whatever your very LAST move was to reach step i, it was either a single step from step i-1, or a double step from step i-2. So the number of ways to reach step i is simply the number of ways to reach i-1, PLUS the number of ways to reach i-2 — because those are the only two places your last move could have started from. That recurrence is exactly the Fibonacci sequence in disguise.",
    approach: [
      "Set up a DP array where dp[i] will hold the number of distinct ways to reach step i.",
      "Base cases: dp[0] = 1 (one way to 'be' at the start — do nothing) and dp[1] = 1 (only one way to take a single step).",
      "For every step from 2 to n: dp[i] = dp[i-1] + dp[i-2].",
      "The answer is dp[n].",
    ],
    dryRun: "n=5: dp[0]=1, dp[1]=1, dp[2]=1+1=2, dp[3]=2+1=3, dp[4]=3+2=5, dp[5]=5+3=8 → 8 distinct ways",
    pitfalls: [
      "This is a textbook first DP problem specifically because the recurrence is so simple (identical to Fibonacci) — recognizing 'answer at i depends only on answers at i-1 and i-2' is the whole skill that generalizes to much harder DP problems.",
      "You don't actually need the full array — since dp[i] only ever looks at the last two values, you can reduce space from O(n) to O(1) by just keeping two rolling variables. That space-optimization pattern shows up constantly in DP.",
      "A naive recursive solution without memoization re-derives the same subproblems repeatedly (exactly like naive Fibonacci) — see the Fibonacci topic for why that's O(2ⁿ) and how memoization fixes it.",
    ],
  },
  codes: {
    js: `function climbStairs(n) {
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  if (n >= 1) dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}`,
    py: `def climb_stairs(n):
    dp = [0] * (n + 1)
    dp[0] = 1
    if n >= 1:
        dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
    cpp: `int climbStairs(int n) {
    vector<int> dp(n + 1, 0);
    dp[0] = 1;
    if (n >= 1) dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
  },
};
