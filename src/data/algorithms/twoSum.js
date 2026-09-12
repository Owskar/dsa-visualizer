import { drawBars, makeSnap } from "../viz.js";

const W = 720, H = 340;

function buildSteps(input, target) {
  const arr = input.slice();
  const steps = [];
  const snap = makeSnap(steps, () => arr.slice(), (svg, snapshot, extra) => drawBars(svg, W, H, snapshot, extra));
  const seen = new Map(); // value -> index

  snap(`Find two numbers that add up to ${target}, using a hashmap to remember what we've seen.`, { js: 1, py: 1, cpp: 1 }, {});

  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    snap(`At index ${i} (value ${arr[i]}): we need a partner equal to ${target} - ${arr[i]} = ${complement}.`,
      { js: 3, py: 2, cpp: 4 }, { compare: [i] });

    if (seen.has(complement)) {
      const j = seen.get(complement);
      snap(`${complement} is already in the map (seen at index ${j})! Found the pair: indices [${j}, ${i}].`,
        { js: 4, py: 3, cpp: 5 }, { foundIndex: i, swap: [j] });
      return steps;
    }
    seen.set(arr[i], i);
    snap(`${complement} isn't in the map yet. Remember arr[${i}] = ${arr[i]} for later.`,
      { js: 7, py: 5, cpp: 8 }, { compare: [i], eliminated: new Set(Array.from(seen.values()).filter((idx) => idx !== i)) });
  }
  snap("No two numbers add up to the target.", { js: 9, py: 6, cpp: 10 }, {});
  return steps;
}

export default {
  id: "two-sum",
  title: "Two Sum",
  category: "Arrays",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Hashmap", "Array"],
  blurb: "Given an array and a target, find the two numbers that add up to it — in one pass, using a hashmap instead of nested loops.",
  complexity: "Time: O(n) · Space: O(n)",
  defaultInput: [2, 7, 11, 15, 3],
  defaultTarget: 9,
  buildSteps,
  notes: {
    intuition:
      "The brute-force way checks every pair of numbers — O(n²). The key insight: for each number, you already know exactly what its 'partner' needs to be (target minus the current number). So instead of searching ahead for that partner, just remember every number you've already seen in a hashmap, and check the map first. If the partner you need is already in there, you're done.",
    approach: [
      "Create an empty hashmap that will store value → index.",
      "For each number in the array, compute its needed complement: target - current number.",
      "Check the hashmap: if the complement is already a key, you've found your pair — return the stored index and the current index.",
      "Otherwise, add the current number and its index to the hashmap, and move to the next number.",
    ],
    dryRun: "arr=[2,7,11,15], target=9 → at 2: need 7 (not seen, remember 2) → at 7: need 2 (seen at index 0!) → answer: [0,1]",
    pitfalls: [
      "The brute-force nested-loop solution is O(n²) — the hashmap approach gets this down to O(n) time at the cost of O(n) extra space, a classic time-space tradeoff.",
      "Check the hashmap for the complement BEFORE inserting the current number — otherwise a number could incorrectly pair with itself (e.g. target=6, current number=3 would wrongly 'find' itself if inserted first).",
      "If the problem guarantees exactly one solution, returning immediately on the first match is correct — but if duplicates or multiple valid pairs are possible, re-read the problem statement about which pair to return.",
    ],
  },
  codes: {
    js: `function twoSum(arr, target) {
  const seen = new Map();

  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(arr[i], i);
  }
  return [];
}`,
    py: `def two_sum(arr, target):
    seen = {}
    for i, num in enumerate(arr):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
    cpp: `vector<int> twoSum(vector<int>& arr, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < arr.size(); i++) {
        int complement = target - arr[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[arr[i]] = i;
    }
    return {};
}`,
  },
};
