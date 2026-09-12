import { drawBinaryTree, makeSnap } from "../viz.js";

const W = 720, H = 340;

function arrayToTree(arr, i = 0) {
  if (i >= arr.length) return null;
  return { value: arr[i], left: arrayToTree(arr, 2 * i + 1), right: arrayToTree(arr, 2 * i + 2) };
}

function siftUp(heap, i, log) {
  while (i > 0) {
    const parent = Math.floor((i - 1) / 2);
    if (heap[parent] <= heap[i]) break;
    log(`${heap[i]} < parent ${heap[parent]} — swap up to keep the min-heap property (smallest always on top).`, [i, parent]);
    [heap[i], heap[parent]] = [heap[parent], heap[i]];
    i = parent;
  }
}

function siftDown(heap, i, log) {
  const n = heap.length;
  while (true) {
    const left = 2 * i + 1, right = 2 * i + 2;
    let smallest = i;
    if (left < n && heap[left] < heap[smallest]) smallest = left;
    if (right < n && heap[right] < heap[smallest]) smallest = right;
    if (smallest === i) break;
    log(`${heap[i]} is bigger than a child (${heap[smallest]}) — swap down to restore the min-heap property.`, [i, smallest]);
    [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
    i = smallest;
  }
}

function buildSteps(input, k) {
  const arr = input.slice();
  const heap = [];
  const steps = [];
  const snap = makeSnap(steps, () => heap.slice(), (svg, snapshot, extra) => drawBinaryTree(svg, W, H, arrayToTree(snapshot), { ...extra, emptyLabel: "Heap is empty" }));

  snap(`Find the ${k}-th largest value in [${arr.join(", ")}] by keeping a MIN-heap of the ${k} largest values seen so far.`,
    { js: 2, py: 2, cpp: 3 }, {});

  const log = (desc, highlightIdx) => snap(desc, { js: 7, py: 6, cpp: 8 }, { highlight: new Set(highlightIdx.map((idx) => heap[idx])) });

  for (const num of arr) {
    if (heap.length < k) {
      heap.push(num);
      snap(`Heap has room (size < ${k}) — push ${num} in.`, { js: 5, py: 4, cpp: 5 }, {});
      siftUp(heap, heap.length - 1, log);
    } else if (num > heap[0]) {
      snap(`Heap is full at size ${k}. ${num} is bigger than the smallest kept value (${heap[0]}) — it replaces the root.`,
        { js: 9, py: 7, cpp: 10 }, { current: heap[0] });
      heap[0] = num;
      siftDown(heap, 0, log);
    } else {
      snap(`Heap is full and ${num} ≤ the smallest kept value (${heap[0]}) — it's not among the top ${k}, skip it.`,
        { js: 9, py: 7, cpp: 10 }, {});
    }
  }

  snap(`Done. The root of the min-heap, ${heap[0]}, is the ${k}-th largest value overall.`, { js: 12, py: 9, cpp: 12 }, { current: heap[0] });
  return steps;
}

export default {
  id: "kth-largest-heap",
  title: "Kth Largest Element (Heap)",
  category: "Heaps",
  level: "Advanced",
  difficulty: "Medium",
  tags: ["Min-Heap", "Priority Queue"],
  blurb: "Find the k-th largest value in an array by maintaining a min-heap of just the k largest values seen so far.",
  complexity: "Time: O(n log k) · Space: O(k)",
  defaultInput: [3, 2, 1, 5, 6, 4],
  defaultTarget: 2,
  buildSteps,
  notes: {
    intuition:
      "You don't need to sort the whole array to find the k-th largest value — you only need to track the k LARGEST values seen so far, and specifically know the smallest one among THOSE (since that's your current answer). A min-heap is perfect for this: its root is always the smallest of whatever it's holding, so you can compare each new number against the root in O(log k) instead of re-scanning everything.",
    approach: [
      "Keep a min-heap that will hold at most k elements — the k largest seen so far.",
      "For each number: if the heap has fewer than k elements, just add it (sift up to restore heap order).",
      "Once the heap has exactly k elements, compare each new number to the heap's root (the smallest of the current top-k). If the new number is bigger, it deserves a spot — replace the root with it and sift down to restore heap order.",
      "If the new number isn't bigger than the root, it's not in the top k — skip it.",
      "After processing every number, the heap's root is exactly the k-th largest value.",
    ],
    dryRun: "[3,2,1,5,6,4], k=2: heap grows to {3,2}(root 2) → 1 skipped (≤2) → 5>2, replace: {3,5}(root 3) → 6>3, replace: {5,6}(root 5) → 4 skipped (≤5) → answer: 5",
    pitfalls: [
      "It's easy to reach for a MAX-heap instead — but a max-heap of the whole array just gives you the largest element repeatedly, not efficiently the k-th. The min-heap-of-size-k trick is specifically what makes this O(n log k) instead of O(n log n) (full sort).",
      "Sifting up (after inserting) and sifting down (after replacing the root) are two DIFFERENT operations — mixing them up breaks the heap property silently, giving a wrong answer without any crash.",
      "For a small, fixed k, most languages' built-in priority queue / heap library (Python's `heapq`, Java's `PriorityQueue`) implements exactly this — you rarely hand-roll sift-up/sift-down in practice, but understanding it matters for the 'why is this O(log k)' question.",
    ],
  },
  codes: {
    js: `function findKthLargest(nums, k) {
  const heap = []; // min-heap, holds the k largest values seen

  const siftUp = (i) => {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (heap[p] <= heap[i]) break;
      [heap[p], heap[i]] = [heap[i], heap[p]];
      i = p;
    }
  };
  const siftDown = (i) => {
    const n = heap.length;
    while (true) {
      let s = i, l = 2 * i + 1, r = 2 * i + 2;
      if (l < n && heap[l] < heap[s]) s = l;
      if (r < n && heap[r] < heap[s]) s = r;
      if (s === i) break;
      [heap[s], heap[i]] = [heap[i], heap[s]];
      i = s;
    }
  };

  for (const num of nums) {
    if (heap.length < k) {
      heap.push(num);
      siftUp(heap.length - 1);
    } else if (num > heap[0]) {
      heap[0] = num;
      siftDown(0);
    }
  }
  return heap[0];
}`,
    py: `import heapq

def find_kth_largest(nums, k):
    heap = []  # Python's heapq is a min-heap
    for num in nums:
        if len(heap) < k:
            heapq.heappush(heap, num)
        elif num > heap[0]:
            heapq.heapreplace(heap, num)
    return heap[0]`,
    cpp: `int findKthLargest(vector<int>& nums, int k) {
    priority_queue<int, vector<int>, greater<int>> minHeap; // min-heap
    for (int num : nums) {
        if (minHeap.size() < k) {
            minHeap.push(num);
        } else if (num > minHeap.top()) {
            minHeap.pop();
            minHeap.push(num);
        }
    }
    return minHeap.top();
}`,
  },
};
