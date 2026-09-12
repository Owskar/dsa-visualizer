import { drawBars } from "../viz.js";

const W = 720, H = 340;

function buildSteps(input, target) {
  const arr = input.slice();
  const steps = [];

  const snap = (desc, lines, extra) => steps.push({
    desc, lines,
    draw(svg) { drawBars(svg, W, H, arr, extra || {}); },
  });

  snap(`Searching for ${target}, checking each element left to right.`, { js: 1, py: 1, cpp: 1 }, {});

  for (let i = 0; i < arr.length; i++) {
    snap(`Check index ${i}: is arr[${i}] = ${arr[i]} equal to ${target}?`,
      { js: 3, py: 3, cpp: 3 }, { compare: [i] });
    if (arr[i] === target) {
      snap(`Match found at index ${i}!`, { js: 4, py: 4, cpp: 4 }, { foundIndex: i });
      return steps;
    }
  }
  snap(`Reached the end without a match. ${target} is not in the array.`, { js: 8, py: 6, cpp: 8 }, {
    eliminated: new Set(arr.map((_, i) => i)),
  });
  return steps;
}

export default {
  id: "linear-search",
  title: "Linear Search",
  category: "Searching",
  difficulty: "Easy",
  tags: ["Array", "Brute Force"],
  blurb: "Check every element one by one until the target is found (works on unsorted data too).",
  complexity: "Time: O(n) · Space: O(1)",
  defaultInput: [14, 3, 27, 8, 19, 6, 11],
  defaultTarget: 19,
  buildSteps,
  notes: {
    intuition:
      "This is the most natural way to search: start at the beginning and check every item until you either find what you're looking for or run out of items. It doesn't need the array to be sorted, which is its one real advantage over binary search.",
    approach: [
      "Walk through the array from index 0 to n-1.",
      "At each index, compare the element to the target.",
      "If it matches, return that index immediately — no need to keep looking.",
      "If you reach the end without a match, the target isn't in the array — return -1 (or 'not found').",
    ],
    dryRun: "arr = [14,3,27,8,19,6,11], target = 19 → check 14✗, 3✗, 27✗, 8✗, 19✓ → found at index 4",
    pitfalls: [
      "Don't reach for linear search on large sorted datasets where binary search (O(log n)) would be far faster — linear search's only edge is that the data can be unsorted.",
      "Forgetting to return/break as soon as a match is found means you'd keep scanning unnecessarily.",
      "For repeated lookups on the same static data, consider sorting once + binary search, or a hash set for O(1) average lookups instead.",
    ],
  },
  codes: {
    js: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }
  return -1;
}`,
    py: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`,
    cpp: `int linearSearch(vector<int>& arr, int target) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}`,
  },
};
