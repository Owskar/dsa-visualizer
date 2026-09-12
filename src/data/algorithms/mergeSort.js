import { drawBars, makeSnap } from "../viz.js";

const W = 720, H = 340;

function buildSteps(input) {
  const arr = input.slice();
  const steps = [];
  const snap = makeSnap(steps, () => arr.slice(), (svg, snapshot, extra) => drawBars(svg, W, H, snapshot, extra));
  let placed = new Set();

  snap("Starting array. Merge sort will split it in half repeatedly, then merge the halves back in order.", { js: 1, py: 1, cpp: 1 }, {});

  function range(a, b) {
    const r = [];
    for (let k = a; k <= b; k++) r.push(k);
    return r;
  }

  function mergeSort(left, right) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    snap(`Split arr[${left}..${right}] into arr[${left}..${mid}] and arr[${mid + 1}..${right}].`,
      { js: 2, py: 2, cpp: 3 }, { compare: range(left, right), placed: new Set(placed) });

    mergeSort(left, mid);
    mergeSort(mid + 1, right);

    // this whole range is about to be actively rewritten by the merge below
    for (let k = left; k <= right; k++) placed.delete(k);

    let i = left, j = mid + 1;
    const temp = [];
    while (i <= mid && j <= right) {
      snap(`Compare arr[${i}] = ${arr[i]} and arr[${j}] = ${arr[j]}.`,
        { js: 10, py: 8, cpp: 12 }, { compare: [i, j], placed: new Set(placed) });
      if (arr[i] <= arr[j]) { temp.push(arr[i]); i++; } else { temp.push(arr[j]); j++; }
    }
    while (i <= mid) { temp.push(arr[i]); i++; }
    while (j <= right) { temp.push(arr[j]); j++; }

    for (let k = 0; k < temp.length; k++) {
      arr[left + k] = temp[k];
      snap(`Write ${temp[k]} into arr[${left + k}].`, { js: 17, py: 14, cpp: 20 },
        { swap: [left + k], placed: new Set(placed) });
    }
    for (let k = left; k <= right; k++) placed.add(k);
    snap(`Merged. arr[${left}..${right}] is now internally sorted: [${arr.slice(left, right + 1).join(", ")}].`,
      { js: 17, py: 14, cpp: 20 }, { placed: new Set(placed) });
  }

  mergeSort(0, arr.length - 1);
  snap(`Array is fully sorted! Array is now [${arr.join(", ")}].`, { js: 1, py: 1, cpp: 1 }, { placed: new Set(placed) });
  return steps;
}

export default {
  id: "merge-sort",
  title: "Merge Sort",
  category: "Sorting",
  level: "Intermediate",
  difficulty: "Medium",
  tags: ["Divide & Conquer", "Recursion", "Stable Sort"],
  blurb: "Split the array in half recursively until each piece has one element, then merge sorted halves back together.",
  complexity: "Time: O(n log n) always · Space: O(n) (temp arrays)",
  defaultInput: [8, 3, 5, 4, 7, 6, 1, 2],
  buildSteps,
  notes: {
    intuition:
      "Merge sort trusts recursion to do the hard work: a single element is trivially 'sorted', so if you can just merge two already-sorted lists into one sorted list, you can sort anything by splitting it down to single elements and merging your way back up. The merge step itself is simple — walk both halves with two pointers, always taking the smaller front element.",
    approach: [
      "If the range has 0 or 1 elements, it's already sorted — that's the base case.",
      "Otherwise, split the range in half at the midpoint.",
      "Recursively sort the left half, then recursively sort the right half.",
      "Merge the two now-sorted halves: compare their front elements, always copying the smaller one out first, until both halves are exhausted.",
      "Copy the merged, sorted result back into the original array's range.",
    ],
    dryRun: "[8,3,5,4,7,6,1,2] → split into [8,3,5,4] and [7,6,1,2] → sort each half → merge [3,4,5,8] and [1,2,6,7] → [1,2,3,4,5,6,7,8]",
    pitfalls: [
      "Merge sort needs O(n) extra space for the temporary arrays used during merging — unlike quick sort or heap sort, it isn't in-place (a true in-place merge exists but is significantly more complex and rarely used).",
      "It's a stable sort — equal elements keep their original relative order, which matters for problems like sorting by one key while preserving order by another.",
      "The O(n log n) time is guaranteed in EVERY case (best, average, worst) — unlike quick sort, which can degrade to O(n²) on unlucky pivots. That predictability is why merge sort is often preferred for large, worst-case-sensitive workloads.",
    ],
  },
  codes: {
    js: `function mergeSort(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;
  const mid = Math.floor((left + right) / 2);

  mergeSort(arr, left, mid);
  mergeSort(arr, mid + 1, right);
  merge(arr, left, mid, right);
}

function merge(arr, left, mid, right) {
  let i = left, j = mid + 1;
  const temp = [];

  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) temp.push(arr[i++]);
    else temp.push(arr[j++]);
  }
  while (i <= mid) temp.push(arr[i++]);
  while (j <= right) temp.push(arr[j++]);

  for (let k = 0; k < temp.length; k++) {
    arr[left + k] = temp[k];
  }
}`,
    py: `def merge_sort(arr, left=0, right=None):
    if right is None:
        right = len(arr) - 1
    if left >= right:
        return
    mid = (left + right) // 2

    merge_sort(arr, left, mid)
    merge_sort(arr, mid + 1, right)
    merge(arr, left, mid, right)

def merge(arr, left, mid, right):
    i, j = left, mid + 1
    temp = []
    while i <= mid and j <= right:
        if arr[i] <= arr[j]:
            temp.append(arr[i]); i += 1
        else:
            temp.append(arr[j]); j += 1
    temp.extend(arr[i:mid + 1])
    temp.extend(arr[j:right + 1])
    for k, val in enumerate(temp):
        arr[left + k] = val`,
    cpp: `void merge(vector<int>& arr, int left, int mid, int right) {
    int i = left, j = mid + 1;
    vector<int> temp;
    while (i <= mid && j <= right) {
        if (arr[i] <= arr[j]) temp.push_back(arr[i++]);
        else temp.push_back(arr[j++]);
    }
    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= right) temp.push_back(arr[j++]);
    for (int k = 0; k < temp.size(); k++) {
        arr[left + k] = temp[k];
    }
}

void mergeSort(vector<int>& arr, int left, int right) {
    if (left >= right) return;
    int mid = (left + right) / 2;
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`,
  },
};
