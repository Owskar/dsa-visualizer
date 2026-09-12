import { drawBars } from "../viz.js";

const W = 720, H = 340;

function buildSteps(input, target) {
  const arr = input.slice().sort((a, b) => a - b);
  const steps = [];
  let low = 0, high = arr.length - 1;

  const snap = (desc, lines, extra) => steps.push({
    desc, lines,
    draw(svg) { drawBars(svg, W, H, arr, extra || {}); },
  });

  snap(`Searching for ${target} in a sorted array. low = 0, high = ${high}.`,
    { js: 2, py: 2, cpp: 2 }, { pointers: { [low]: "low", [high]: "high" } });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const eliminated = new Set();
    for (let k = 0; k < low; k++) eliminated.add(k);
    for (let k = high + 1; k < arr.length; k++) eliminated.add(k);

    const pointers = { [low]: "low", [high]: "high", [mid]: "mid" };
    snap(`mid = Math.floor((${low} + ${high}) / 2) = ${mid}. arr[${mid}] = ${arr[mid]}.`,
      { js: 5, py: 4, cpp: 5 }, { pointers, eliminated, compare: [mid] });

    if (arr[mid] === target) {
      snap(`arr[${mid}] = ${target} — found it!`, { js: 7, py: 6, cpp: 7 }, { foundIndex: mid, eliminated });
      return steps;
    } else if (arr[mid] < target) {
      snap(`${arr[mid]} < ${target}, so the target must be in the right half. low = ${mid + 1}.`,
        { js: 9, py: 8, cpp: 9 }, { pointers, eliminated, compare: [mid] });
      low = mid + 1;
    } else {
      snap(`${arr[mid]} > ${target}, so the target must be in the left half. high = ${mid - 1}.`,
        { js: 11, py: 10, cpp: 11 }, { pointers, eliminated, compare: [mid] });
      high = mid - 1;
    }
  }
  const eliminated = new Set(arr.map((_, i) => i));
  snap(`low (${low}) > high (${high}) — the search space is empty. ${target} is not in the array.`,
    { js: 14, py: 12, cpp: 14 }, { eliminated });
  return steps;
}

export default {
  id: "binary-search",
  title: "Binary Search",
  category: "Searching",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Array", "Divide & Conquer"],
  blurb: "On a sorted array, repeatedly halve the search range by comparing the middle element to the target.",
  complexity: "Time: O(log n) · Space: O(1)",
  defaultInput: [2, 4, 7, 9, 12, 18, 23, 29, 31],
  defaultTarget: 23,
  buildSteps,
  notes: {
    intuition:
      "This is the 'guess a number' game strategy: if the array is sorted, you never need to check every element — just look at the middle. If it's too small, the answer must be to the right; if too big, to the left. Each guess throws away half of what's left, which is why it's so much faster than linear search.",
    approach: [
      "Maintain two pointers, low and high, spanning the current search range (starts as the whole array).",
      "Compute mid = (low + high) / 2 and compare arr[mid] to the target.",
      "If they're equal, you've found it — return mid.",
      "If arr[mid] is smaller than the target, the target must be to the right — move low to mid + 1.",
      "If arr[mid] is larger, the target must be to the left — move high to mid - 1.",
      "Repeat until low > high (target not found) or you find a match.",
    ],
    dryRun: "arr = [2,4,7,9,12,18,23,29,31], target = 23 → low=0,high=8,mid=4(12)<23→low=5 → mid=6(23)=23 → found at index 6",
    pitfalls: [
      "The array MUST be sorted first — binary search on unsorted data silently gives wrong answers, it doesn't error out.",
      "A classic bug: writing `mid = (low + high) / 2` in languages with fixed-width integers can overflow for very large arrays; `low + (high - low) / 2` avoids it (less of a concern in JS/Python, but a real interview gotcha in C++/Java).",
      "Off-by-one errors are common — double check whether you need `low <= high` or `low < high` depending on whether you're finding an exact match or a boundary (like 'first element ≥ target').",
    ],
  },
  codes: {
    js: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return -1;
}`,
    py: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,
    cpp: `int binarySearch(vector<int>& arr, int target) {
    int low = 0, high = arr.size() - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) {
            return mid;
        } else if (arr[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    return -1;
}`,
  },
};
