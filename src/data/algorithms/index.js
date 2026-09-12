// Sorting
import bubbleSort from "./bubbleSort.js";
import selectionSort from "./selectionSort.js";
import insertionSort from "./insertionSort.js";
import mergeSort from "./mergeSort.js";
import quickSort from "./quickSort.js";
// Searching
import linearSearch from "./linearSearch.js";
import binarySearch from "./binarySearch.js";
// Arrays
import twoSum from "./twoSum.js";
import kadane from "./kadane.js";
// Strings
import longestSubstring from "./longestSubstring.js";
// Stacks & Queues
import stack from "./stack.js";
import queue from "./queue.js";
import validParentheses from "./validParentheses.js";
// Linked Lists
import linkedList from "./linkedList.js";
import reverseLinkedList from "./reverseLinkedList.js";
import detectCycle from "./detectCycle.js";
// Recursion
import recursion from "./recursion.js";
import fibonacci from "./fibonacci.js";
// Trees
import bst from "./bst.js";
import binaryTreeLevelOrder from "./binaryTreeLevelOrder.js";
// Heaps
import kthLargestHeap from "./kthLargestHeap.js";
// Graphs
import graphBFS from "./graphBFS.js";
import graphDFS from "./graphDFS.js";
import topologicalSort from "./topologicalSort.js";
// Greedy
import activitySelection from "./activitySelection.js";
// Dynamic Programming
import climbingStairs from "./climbingStairs.js";
import knapsack from "./knapsack.js";

export const ALGORITHMS = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  linearSearch,
  binarySearch,
  twoSum,
  kadane,
  longestSubstring,
  stack,
  queue,
  validParentheses,
  linkedList,
  reverseLinkedList,
  detectCycle,
  recursion,
  fibonacci,
  bst,
  binaryTreeLevelOrder,
  kthLargestHeap,
  graphBFS,
  graphDFS,
  topologicalSort,
  activitySelection,
  climbingStairs,
  knapsack,
];

export const ALGO_BY_ID = Object.fromEntries(ALGORITHMS.map((a) => [a.id, a]));

// Roadmap order — mirrors a beginner-to-advanced DSA sheet progression
// (Sorting → Searching → Arrays → Strings → Stacks/Queues → Linked Lists →
// Recursion → Trees → Heaps → Graphs → Greedy → Dynamic Programming),
// broadly following the structure of well-known DSA roadmaps like
// takeUforward's A2Z sheet.
export const CATEGORY_ORDER = [
  "Sorting",
  "Searching",
  "Arrays",
  "Strings",
  "Stacks & Queues",
  "Linked Lists",
  "Recursion",
  "Trees",
  "Heaps",
  "Graphs",
  "Greedy",
  "Dynamic Programming",
];

export function groupedAlgorithms() {
  const map = new Map(CATEGORY_ORDER.map((c) => [c, []]));
  for (const algo of ALGORITHMS) {
    if (!map.has(algo.category)) map.set(algo.category, []);
    map.get(algo.category).push(algo);
  }
  return map;
}

export function defaultStepsFor(algo) {
  if (algo.defaultTarget !== undefined) {
    return algo.buildSteps(algo.defaultInput, algo.defaultTarget);
  }
  return algo.buildSteps(algo.defaultInput);
}
