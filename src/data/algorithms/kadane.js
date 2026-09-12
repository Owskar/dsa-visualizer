import { drawBars, makeSnap } from "../viz.js";

const W = 720, H = 340;

function buildSteps(input) {
  const arr = input.slice();
  const steps = [];
  const snap = makeSnap(steps, () => arr.slice(), (svg, snapshot, extra) => drawBars(svg, W, H, snapshot, extra));

  let currentSum = arr[0];
  let maxSum = arr[0];
  let start = 0, bestStart = 0, bestEnd = 0;

  snap(`Start with currentSum = maxSum = arr[0] = ${arr[0]}.`, { js: 2, py: 2, cpp: 2 }, { compare: [0], pointers: { 0: "i" } });

  for (let i = 1; i < arr.length; i++) {
    const extendOrRestart = currentSum + arr[i] >= arr[i];
    if (extendOrRestart) {
      currentSum = currentSum + arr[i];
      snap(`currentSum (${currentSum - arr[i]}) + arr[${i}] (${arr[i]}) = ${currentSum} — keep extending the running subarray.`,
        { js: 5, py: 4, cpp: 5 }, { compare: [i], eliminated: new Set(Array.from({ length: start }, (_, k) => k)) });
    } else {
      currentSum = arr[i];
      start = i;
      snap(`Adding arr[${i}] would make things worse than starting fresh — restart the running subarray at index ${i} with sum ${currentSum}.`,
        { js: 5, py: 4, cpp: 5 }, { swap: [i] });
    }

    if (currentSum > maxSum) {
      maxSum = currentSum;
      bestStart = start; bestEnd = i;
      snap(`New best! maxSum updated to ${maxSum} (subarray from index ${bestStart} to ${bestEnd}).`,
        { js: 8, py: 6, cpp: 8 }, { compare: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k) });
    }
  }

  snap(`Done. Maximum subarray sum is ${maxSum}, from arr[${bestStart}..${bestEnd}] = [${arr.slice(bestStart, bestEnd + 1).join(", ")}].`,
    { js: 10, py: 7, cpp: 9 }, { compare: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k) });
  return steps;
}

export default {
  id: "kadane",
  title: "Kadane's Algorithm — Maximum Subarray Sum",
  category: "Arrays",
  level: "Intermediate",
  difficulty: "Medium",
  tags: ["Dynamic Programming", "Array", "Greedy"],
  blurb: "Find the contiguous subarray with the largest sum, in a single pass, by deciding at each step whether to extend the current run or start fresh.",
  complexity: "Time: O(n) · Space: O(1)",
  defaultInput: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
  buildSteps,
  notes: {
    intuition:
      "At every position, you're really only asking one question: 'is it better to keep extending the subarray I'm currently building, or is my current running sum actually dragging things down, so I should just start fresh from here?' If the running sum ever goes negative, it can only hurt any future subarray that includes it — so throw it away and restart.",
    approach: [
      "Track two values: `currentSum` (the best sum of a subarray ending exactly at the current position) and `maxSum` (the best seen anywhere so far).",
      "For each element, decide: either extend the current subarray by adding this element, or abandon it and start a brand new subarray at this element — whichever gives a bigger `currentSum`.",
      "After updating `currentSum`, check if it beats `maxSum`, and update `maxSum` if so.",
      "By the end, `maxSum` holds the answer.",
    ],
    dryRun: "[-2,1,-3,4,-1,2,1,-5,4] → running sums: -2,1,-2,4,3,5,6,1,5 → maxSum peaks at 6 (subarray [4,-1,2,1])",
    pitfalls: [
      "A common mistake is resetting currentSum to 0 instead of to arr[i] when starting fresh — if all numbers are negative, the correct answer is the single largest (least negative) number, not 0.",
      "This is technically dynamic programming in disguise: currentSum at index i only depends on currentSum at index i-1, which is why it runs in O(1) space instead of needing a full DP array.",
      "The 'extend vs restart' decision (`currentSum + arr[i] >= arr[i]`) is equivalent to just checking `currentSum >= 0` before adding — both are commonly seen; make sure whichever form you use matches your mental model.",
    ],
  },
  codes: {
    js: `function maxSubArray(arr) {
  let currentSum = arr[0];
  let maxSum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    currentSum = Math.max(arr[i], currentSum + arr[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    py: `def max_sub_array(arr):
    current_sum = arr[0]
    max_sum = arr[0]
    for i in range(1, len(arr)):
        current_sum = max(arr[i], current_sum + arr[i])
        max_sum = max(max_sum, current_sum)
    return max_sum`,
    cpp: `int maxSubArray(vector<int>& arr) {
    int currentSum = arr[0];
    int maxSum = arr[0];
    for (int i = 1; i < arr.size(); i++) {
        currentSum = max(arr[i], currentSum + arr[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}`,
  },
};
