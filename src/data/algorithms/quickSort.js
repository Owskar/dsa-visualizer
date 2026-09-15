import { drawBars, makeSnap } from "../viz.js";
import { arrayOnlyConfig } from "../inputConfigHelpers.js";

const W = 720, H = 340;

function buildSteps(input) {
  const arr = input.slice();
  const steps = [];
  const snap = makeSnap(steps, () => arr.slice(), (svg, snapshot, extra) => drawBars(svg, W, H, snapshot, extra));
  const placed = new Set();

  snap("Starting array. Quick sort picks a pivot and partitions the array around it.", { js: 1, py: 1, cpp: 1 }, {});

  function swapArr(i, j) { [arr[i], arr[j]] = [arr[j], arr[i]]; }

  function partition(low, high) {
    const pivot = arr[high];
    snap(`Choose arr[${high}] = ${pivot} as the pivot.`, { js: 8, py: 9, cpp: 2 },
      { pointers: { [high]: "pivot" }, placed: new Set(placed) });
    let i = low - 1;
    for (let j = low; j < high; j++) {
      snap(`Compare arr[${j}] = ${arr[j]} with pivot ${pivot}.`, { js: 11, py: 12, cpp: 4 },
        { compare: [j, high], pointers: { [high]: "pivot" }, placed: new Set(placed) });
      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          swapArr(i, j);
          snap(`${arr[i]} < pivot — swap it into position ${i} (the boundary of "smaller than pivot").`,
            { js: 13, py: 14, cpp: 6 }, { swap: [i, j], pointers: { [high]: "pivot" }, placed: new Set(placed) });
        }
      }
    }
    swapArr(i + 1, high);
    snap(`Place the pivot at index ${i + 1} — everything left of it is smaller, everything right is bigger.`,
      { js: 16, py: 16, cpp: 9 }, { swap: [i + 1, high], placed: new Set(placed) });
    return i + 1;
  }

  function quickSort(low, high) {
    if (low >= high) {
      if (low === high) placed.add(low);
      return;
    }
    snap(`Partition arr[${low}..${high}] around a pivot.`, { js: 3, py: 5, cpp: 14 },
      { compare: Array.from({ length: high - low + 1 }, (_, k) => low + k), placed: new Set(placed) });
    const p = partition(low, high);
    placed.add(p);
    snap(`Pivot ${arr[p]} is now in its final sorted position (index ${p}).`, { js: 3, py: 5, cpp: 14 }, { placed: new Set(placed) });
    quickSort(low, p - 1);
    quickSort(p + 1, high);
  }

  quickSort(0, arr.length - 1);
  snap(`Array is fully sorted! Array is now [${arr.join(", ")}].`, { js: 1, py: 1, cpp: 1 }, { placed: new Set(placed) });
  return steps;
}

export default {
  id: "quick-sort",
  title: "Quick Sort",
  category: "Sorting",
  level: "Intermediate",
  difficulty: "Medium",
  tags: ["Divide & Conquer", "Recursion", "In-Place"],
  blurb: "Pick a pivot, partition the array so smaller elements go left and larger go right, then recursively sort each side.",
  complexity: "Time: O(n log n) average, O(n²) worst case · Space: O(log n) (recursion stack)",
  defaultInput: [7, 2, 8, 5, 1, 9, 3],
  sheetNum: 61,
  inputConfig: (algo) => arrayOnlyConfig(algo),
  buildSteps,
  notes: {
    intuition:
      "Pick any element as a 'pivot' and rearrange the array so everything smaller ends up to its left and everything bigger ends up to its right — that single rearrangement (called partitioning) puts the pivot in its FINAL correct position immediately. Then just recursively do the same thing to the left and right chunks.",
    approach: [
      "Pick a pivot — this version always picks the last element of the current range.",
      "Partition: walk through the range, and every time you find an element smaller than the pivot, swap it into the 'smaller than pivot' zone that's growing from the left.",
      "After the walk, swap the pivot into place right after that zone — it's now exactly where it belongs in the fully sorted array.",
      "Recursively quick-sort the sub-range left of the pivot, and the sub-range right of the pivot.",
    ],
    dryRun: "[7,2,8,5,1,9,3], pivot=3 → partition → [2,1,3,5,7,9,8] (3 in final spot) → recurse on [2,1] and [5,7,9,8] separately",
    pitfalls: [
      "Unlike merge sort, quick sort's O(n log n) average case can degrade to O(n²) on adversarial input — e.g. an already-sorted array with 'always pick the last element' pivoting hits worst case. Randomized or median-of-three pivot selection avoids this in practice.",
      "Quick sort is NOT stable by default — equal elements can be reordered during partitioning.",
      "It sorts in-place (O(log n) extra space for recursion, vs merge sort's O(n) temp arrays), which is often why it's preferred in practice despite the worst-case risk.",
    ],
  },
  codes: {
    js: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low >= high) return;
  const p = partition(arr, low, high);
  quickSort(arr, low, p - 1);
  quickSort(arr, p + 1, high);
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
    py: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low >= high:
        return
    p = partition(arr, low, high)
    quick_sort(arr, low, p - 1)
    quick_sort(arr, p + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`,
    cpp: `int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low >= high) return;
    int p = partition(arr, low, high);
    quickSort(arr, low, p - 1);
    quickSort(arr, p + 1, high);
}`,
  },
};
