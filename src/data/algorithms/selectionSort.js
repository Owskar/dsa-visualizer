import { drawBars, makeSnap } from "../viz.js";

const W = 720, H = 340;

function buildSteps(input) {
  const arr = input.slice();
  const n = arr.length;
  const steps = [];
  const snap = makeSnap(steps, () => arr.slice(), (svg, snapshot, extra) => drawBars(svg, W, H, snapshot, extra));

  snap("Starting array. We'll build the sorted part from the left.", { js: 1, py: 1, cpp: 1 }, {});

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    snap(`Assume arr[${i}] = ${arr[i]} is the smallest in the unsorted part.`,
      { js: 3, py: 3, cpp: 3 }, { sortedFrom: i, pointers: { [i]: "min" } });
    for (let j = i + 1; j < n; j++) {
      snap(`Compare current minimum arr[${minIdx}] = ${arr[minIdx]} with arr[${j}] = ${arr[j]}.`,
        { js: 5, py: 5, cpp: 5 }, { sortedFrom: i, compare: [minIdx, j], pointers: { [minIdx]: "min" } });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        snap(`${arr[j]} is smaller — update the minimum to index ${minIdx}.`,
          { js: 6, py: 6, cpp: 6 }, { sortedFrom: i, pointers: { [minIdx]: "min" } });
      }
    }
    if (minIdx !== i) {
      snap(`Swap arr[${i}] and arr[${minIdx}] to put the smallest value in place.`,
        { js: 8, py: 7, cpp: 8 }, { sortedFrom: i, swap: [i, minIdx] });
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      snap(`Swapped. Array is now [${arr.join(", ")}].`, { js: 8, py: 7, cpp: 8 }, { sortedFrom: i, swap: [i, minIdx] });
    }
    snap(`Index ${i} is now finalized as sorted.`, { js: 8, py: 7, cpp: 8 }, { sortedFrom: i + 1 });
  }
  snap(`Array is fully sorted! Array is now [${arr.join(", ")}].`, { js: 10, py: 8, cpp: 11 }, { sortedFrom: 0 });
  return steps;
}

export default {
  id: "selection-sort",
  title: "Selection Sort",
  category: "Sorting",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Array", "Comparison Sort"],
  blurb: "Repeatedly find the minimum of the unsorted part and move it to the front.",
  complexity: "Time: O(n²) always · Space: O(1)",
  defaultInput: [6, 2, 9, 1, 5, 3],
  buildSteps,
  notes: {
    intuition:
      "Think of sorting a hand of cards by repeatedly picking out the smallest card left in your hand and placing it at the front. You don't move anything until you've scanned the whole unsorted part and found the true minimum — that's what separates this from bubble sort, which swaps eagerly on every comparison.",
    approach: [
      "Treat the array as split into a sorted-so-far part (left) and unsorted part (right).",
      "Scan the entire unsorted part once to find the index of its minimum value.",
      "Swap that minimum into the front of the unsorted part — exactly one swap per pass.",
      "Move the boundary between sorted and unsorted one step right, and repeat until the unsorted part has one element left.",
    ],
    dryRun: "arr = [6,2,9,1,5] → find min(1) at idx 3, swap with idx 0 → [1,2,9,6,5] → find min(2) already at idx 1 → [1,2,9,6,5] → find min(5) at idx 4, swap with idx 2 → [1,2,5,6,9]",
    pitfalls: [
      "It's easy to accidentally swap on every comparison (like bubble sort) instead of only once per pass after finding the true minimum — selection sort does at most n-1 swaps total, which makes it useful when writes are expensive.",
      "Unlike bubble sort, selection sort has no 'early exit' — it always takes O(n²) comparisons even on a sorted array, because it still has to scan for the minimum every pass.",
      "It is not a stable sort by default (equal elements can be reordered) — worth knowing if stability matters for your use case.",
    ],
  },
  codes: {
    js: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
    py: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    cpp: `void selectionSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        swap(arr[i], arr[minIdx]);
    }
}`,
  },
};
