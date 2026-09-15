import { drawTable, makeSnap } from "../viz.js";

const W = 760, H = 340;
const WEIGHTS = [1, 3, 4, 5];
const VALUES = [1, 4, 5, 7];
const CAPACITY = 7;

function buildSteps() {
  const n = WEIGHTS.length;
  // dp[i][w] = best value using the first i items with capacity w. "" = not yet computed.
  const dp = Array.from({ length: n + 1 }, () => new Array(CAPACITY + 1).fill(""));
  const steps = [];
  const filled = new Set();
  const snap = makeSnap(
    steps,
    () => dp.map((row) => row.slice()),
    (svg, snapshot, extra) => drawTable(svg, W, H, snapshot, {
      rowLabels: ["0 items", ...WEIGHTS.map((w, i) => `+item${i + 1} (wt ${w}, val ${VALUES[i]})`)],
      colLabels: Array.from({ length: CAPACITY + 1 }, (_, c) => c),
      filled: new Set(filled),
      ...extra,
    })
  );

  snap(`Items (weight, value): ${WEIGHTS.map((w, i) => `(${w},${VALUES[i]})`).join(", ")}. Knapsack capacity: ${CAPACITY}. Build the DP table row by row.`,
    { js: 2, py: 2, cpp: 3 }, {});

  for (let w = 0; w <= CAPACITY; w++) {
    dp[0][w] = 0;
    filled.add(`0,${w}`);
  }
  snap("Base case, row 0 (using 0 items): the best value is always 0, no matter the capacity.", { js: 3, py: 3, cpp: 4 }, {});

  for (let i = 1; i <= n; i++) {
    const wt = WEIGHTS[i - 1], val = VALUES[i - 1];
    for (let w = 0; w <= CAPACITY; w++) {
      if (wt > w) {
        dp[i][w] = dp[i - 1][w];
        snap(`Item ${i} (weight ${wt}) doesn't fit in capacity ${w} — carry over dp[${i - 1}][${w}] = ${dp[i][w]}.`,
          { js: 8, py: 6, cpp: 9 }, { current: [i, w], highlight: new Set([`${i - 1},${w}`]) });
      } else {
        const skip = dp[i - 1][w];
        const take = val + dp[i - 1][w - wt];
        dp[i][w] = Math.max(skip, take);
        snap(`Item ${i} (wt ${wt}, val ${val}) at capacity ${w}: skip it (${skip}) vs take it (${val} + dp[${i - 1}][${w - wt}]=${dp[i - 1][w - wt]} = ${take}) → best = ${dp[i][w]}.`,
          { js: 10, py: 8, cpp: 11 }, { current: [i, w], highlight: new Set([`${i - 1},${w}`, `${i - 1},${w - wt}`]) });
      }
      filled.add(`${i},${w}`);
    }
  }

  snap(`Done. The best value achievable with capacity ${CAPACITY} is dp[${n}][${CAPACITY}] = ${dp[n][CAPACITY]}.`,
    { js: 13, py: 10, cpp: 15 }, { current: [n, CAPACITY] });
  return steps;
}

export default {
  id: "knapsack-01",
  title: "0/1 Knapsack",
  category: "Dynamic Programming",
  level: "Advanced",
  difficulty: "Hard",
  tags: ["DP", "2D Table", "Optimization"],
  blurb: "Choose a subset of items (each usable at most once) to maximize value without exceeding a weight capacity — the classic 2D DP table problem.",
  complexity: "Time: O(n × capacity) · Space: O(n × capacity), reducible to O(capacity)",
  defaultInput: null,
  sheetNum: 416,
  buildSteps,
  notes: {
    intuition:
      "For every item, you only ever have two choices: skip it, or take it. The trick is that 'take it' only makes sense if it still fits in whatever capacity is left. Build a table where dp[i][w] means 'the best value achievable using only the first i items, with capacity w' — each cell only depends on cells from the ROW ABOVE it (using one fewer item), so you can fill the whole table in order.",
    approach: [
      "Create a table dp[i][w] for i = 0..n items and w = 0..capacity.",
      "Base case: dp[0][w] = 0 for every w — with zero items available, the best value is always 0.",
      "For each item i and each capacity w: if item i's weight is more than w, it can't fit — dp[i][w] = dp[i-1][w] (carry over, skip it).",
      "Otherwise, take the better of two options: skip item i (dp[i-1][w]), or take item i (its value + dp[i-1][w - its weight]) — whichever is bigger.",
      "The final answer sits in the bottom-right cell: dp[n][capacity].",
    ],
    dryRun: "Items (wt,val): (1,1)(3,4)(4,5)(5,7), capacity=7 → best combo is item2+item3 (weight 3+4=7, value 4+5=9) → dp[4][7] = 9",
    pitfalls: [
      "This is 'unbounded' knapsack's opposite — each item can be used AT MOST ONCE, which is exactly why dp[i][w] always references row i-1 (items already decided), never row i itself.",
      "The 2D table can be space-optimized to a single 1D array of size (capacity+1), updated in place — but only if you iterate the capacity dimension BACKWARDS (right to left) for each item, to avoid using an already-updated value from the same item.",
      "A common mistake is checking `wt > w` incorrectly (off-by-one) — the item fits exactly when its weight is LESS THAN OR EQUAL TO the remaining capacity.",
    ],
  },
  codes: {
    js: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] > w) {
        dp[i][w] = dp[i - 1][w];
      } else {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          values[i - 1] + dp[i - 1][w - weights[i - 1]]
        );
      }
    }
  }
  return dp[n][capacity];
}`,
    py: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] > w:
                dp[i][w] = dp[i - 1][w]
            else:
                dp[i][w] = max(
                    dp[i - 1][w],
                    values[i - 1] + dp[i - 1][w - weights[i - 1]]
                )
    return dp[n][capacity]`,
    cpp: `int knapsack(vector<int>& weights, vector<int>& values, int capacity) {
    int n = weights.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (weights[i - 1] > w) {
                dp[i][w] = dp[i - 1][w];
            } else {
                dp[i][w] = max(dp[i - 1][w],
                    values[i - 1] + dp[i - 1][w - weights[i - 1]]);
            }
        }
    }
    return dp[n][capacity];
}`,
  },
};
