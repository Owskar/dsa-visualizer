import { drawBars, makeSnap } from "../viz.js";

const W = 720, H = 340;

function buildSteps(input) {
  const arr = input.slice();
  const n = arr.length;
  const steps = [];
  const snap = makeSnap(steps, () => arr.slice(), (svg, snapshot, extra) => drawBars(svg, W, H, snapshot, extra));

  snap("Starting array. The first element counts as a sorted list of size 1.", { js: 1, py: 1, cpp: 1 }, { sortedFrom: 1 });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    snap(`Take arr[${i}] = ${key} as the "key" and compare it backward into the sorted part.`,
      { js: 3, py: 2, cpp: 4 }, { sortedFrom: i, compare: [i] });

    while (j >= 0 && arr[j] > key) {
      snap(`arr[${j}] = ${arr[j]} > ${key}, so shift it one position right to make room.`,
        { js: 6, py: 5, cpp: 7 }, { sortedFrom: i, compare: [j, j + 1] });
      arr[j + 1] = arr[j];
      j--;
      snap(`Shifted. Array is now [${arr.join(", ")}].`, { js: 6, py: 5, cpp: 7 }, { sortedFrom: i, compare: [j + 1] });
    }
    arr[j + 1] = key;
    snap(`No more shifts needed — place ${key} at index ${j + 1}. Array is now [${arr.join(", ")}].`,
      { js: 8, py: 6, cpp: 9 }, { sortedFrom: i + 1 });
  }
  snap(`Array is fully sorted! Array is now [${arr.join(", ")}].`, { js: 10, py: 8, cpp: 11 }, { sortedFrom: 0 });
  return steps;
}

export default {
  id: "insertion-sort",
  title: "Insertion Sort",
  category: "Sorting",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Array", "Comparison Sort"],
  blurb: "Build up a sorted section one element at a time, inserting each new element into its correct place — like sorting a hand of playing cards.",
  complexity: "Time: O(n²) average/worst, O(n) best (nearly sorted) · Space: O(1)",
  defaultInput: [9, 5, 1, 4, 3],
  buildSteps,
  notes: {
    intuition:
      "This is exactly how most people sort a hand of playing cards: you pick up cards one at a time, and slide each new card backward into its correct spot among the cards you're already holding sorted. The 'sorted part' grows by one card each time; everything to its right hasn't been looked at yet.",
    approach: [
      "Treat the first element as a sorted section of size 1.",
      "For each next element (the 'key'), compare it backward against the sorted section.",
      "Shift every element in the sorted section that's bigger than the key one position to the right.",
      "Once you find an element ≤ the key (or reach the start), drop the key into that empty slot.",
      "Repeat until every element has been inserted — the sorted section now spans the whole array.",
    ],
    dryRun: "arr = [9,5,1,4,3] → insert 5: [5,9,1,4,3] → insert 1: [1,5,9,4,3] → insert 4: [1,4,5,9,3] → insert 3: [1,3,4,5,9]",
    pitfalls: [
      "Unlike bubble/selection sort, insertion sort is genuinely fast (O(n)) on data that's already nearly sorted — it's often used as the base case for hybrid sorts like Timsort for that reason.",
      "It's a stable sort (equal elements keep their relative order), which selection sort is not — worth remembering if a problem depends on stability.",
      "Off-by-one mistakes in the shifting loop are common — the key must be saved in a variable BEFORE the shifting starts, or it gets overwritten.",
    ],
  },
  codes: {
    js: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    py: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`,
    cpp: `void insertionSort(vector<int>& arr) {
    for (int i = 1; i < arr.size(); i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
  },
};
