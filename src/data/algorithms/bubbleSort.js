import { drawBars, makeSnap } from "../viz.js";

const W = 720, H = 340;

function buildSteps(input) {
  const arr = input.slice();
  const n = arr.length;
  const steps = [];
  const snap = makeSnap(steps, () => arr.slice(), (svg, snapshot, extra) => drawBars(svg, W, H, snapshot, extra));

  snap("Starting array. Nothing is sorted yet.", { js: 1, py: 1, cpp: 1 }, {});

  for (let i = 0; i < n - 1; i++) {
    snap(`Pass ${i + 1}: sweep through the unsorted part looking for adjacent pairs that are out of order.`,
      { js: 3, py: 3, cpp: 3 }, { sortedFrom: n - i });
    for (let j = 0; j < n - i - 1; j++) {
      snap(`Compare arr[${j}] = ${arr[j]} with arr[${j + 1}] = ${arr[j + 1]}.`,
        { js: 5, py: 5, cpp: 5 }, { compare: [j, j + 1], sortedFrom: n - i });
      if (arr[j] > arr[j + 1]) {
        snap(`${arr[j]} > ${arr[j + 1]}, so they're in the wrong order — swap them.`,
          { js: 6, py: 6, cpp: 6 }, { swap: [j, j + 1], sortedFrom: n - i });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        snap(`Swapped. Array is now [${arr.join(", ")}].`,
          { js: 6, py: 6, cpp: 6 }, { swap: [j, j + 1], sortedFrom: n - i });
      } else {
        snap(`${arr[j]} ≤ ${arr[j + 1]}, already in order — no swap needed.`,
          { js: 5, py: 5, cpp: 5 }, { compare: [j, j + 1], sortedFrom: n - i });
      }
    }
    snap(`End of pass ${i + 1}: the largest remaining value has "bubbled" to its correct spot.`,
      { js: 8, py: 6, cpp: 9 }, { sortedFrom: n - i - 1 });
  }
  snap("Array is fully sorted!", { js: 10, py: 7, cpp: 10 }, { sortedFrom: 0 });
  return steps;
}

export default {
  id: "bubble-sort",
  title: "Bubble Sort",
  category: "Sorting",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Array", "Comparison Sort"],
  blurb: "Repeatedly swap neighboring elements that are out of order, so the largest values 'bubble' to the end.",
  complexity: "Time: O(n²) average/worst, O(n) best · Space: O(1)",
  defaultInput: [5, 3, 8, 4, 2, 7],
  buildSteps,
  notes: {
    intuition:
      "Imagine the array as a row of people by height. You keep comparing two neighbors at a time — if the left one is taller, they swap places. After one full sweep left to right, the tallest person has 'bubbled up' to the very end. Repeat the sweep, ignoring the part that's already settled, until nobody needs to swap anymore.",
    approach: [
      "Do a pass over the array from index 0 to n-2, comparing each element with its neighbor.",
      "If arr[j] > arr[j+1], swap them so the larger value moves right.",
      "After each full pass, the largest unsorted element is guaranteed to be in its final position — shrink the range you check by one from the right.",
      "Repeat for n-1 passes, or stop early if a whole pass makes zero swaps (the array is already sorted).",
    ],
    dryRun: "arr = [5,3,8,4,2] → pass 1: [3,5,4,2,8] → pass 2: [3,4,2,5,8] → pass 3: [3,2,4,5,8] → pass 4: [2,3,4,5,8]",
    pitfalls: [
      "Forgetting to shrink the inner loop's range (`n - i - 1`) wastes comparisons on already-sorted elements.",
      "Without an early-exit flag, bubble sort always runs the full O(n²) passes even on an already-sorted array — add a `swapped` flag for an easy optimization.",
      "It's rarely used in production (O(n²) is slow for large inputs) but it's the clearest way to build intuition for 'compare and swap' sorting.",
    ],
  },
  codes: {
    js: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,
    py: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    cpp: `void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
            }
        }
    }
}`,
  },
};
