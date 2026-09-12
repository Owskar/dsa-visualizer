import bubbleSort from "./bubbleSort.js";
import selectionSort from "./selectionSort.js";
import linearSearch from "./linearSearch.js";
import binarySearch from "./binarySearch.js";
import stack from "./stack.js";
import queue from "./queue.js";
import linkedList from "./linkedList.js";
import bst from "./bst.js";
import graphBFS from "./graphBFS.js";
import graphDFS from "./graphDFS.js";
import recursion from "./recursion.js";

export const ALGORITHMS = [
  bubbleSort,
  selectionSort,
  linearSearch,
  binarySearch,
  stack,
  queue,
  linkedList,
  bst,
  graphBFS,
  graphDFS,
  recursion,
];

export const ALGO_BY_ID = Object.fromEntries(ALGORITHMS.map((a) => [a.id, a]));

// Category order controls how sections appear on the landing page.
export const CATEGORY_ORDER = [
  "Sorting",
  "Searching",
  "Stacks & Queues",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Recursion",
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
  if (algo.id === "binary-search" || algo.id === "linear-search") {
    return algo.buildSteps(algo.defaultInput, algo.defaultTarget);
  }
  return algo.buildSteps(algo.defaultInput);
}
