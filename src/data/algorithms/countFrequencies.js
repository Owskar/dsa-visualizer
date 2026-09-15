import { drawBars, clearStage, drawGrid, textEl, box, makeSnap, COLORS } from "../viz.js";
import { arrayOnlyConfig } from "../inputConfigHelpers.js";

const W = 720, H = 340;

function draw(svg, { arr, i, freq }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  drawBars(svg, W, H - 120, arr, i !== undefined ? { compare: [i] } : {});

  const entries = Object.entries(freq).sort((a, b) => Number(a[0]) - Number(b[0]));
  const boxW = 70, boxH = 40, gap = 8;
  const totalW = entries.length * boxW + Math.max(0, entries.length - 1) * gap;
  const startX = Math.max(20, (W - totalW) / 2);
  svg.appendChild(textEl(W / 2, H - 96, "Frequency map (value : count)", { size: 12, fill: COLORS.inkFaint }));
  entries.forEach(([val, count], k) => {
    const x = startX + k * (boxW + gap);
    svg.appendChild(box(x, H - 80, boxW, boxH, { fill: COLORS.tealFaint, stroke: COLORS.teal, strokeWidth: 2, label: `${val}:${count}`, fontSize: 13, dataRole: "freq-entry" }));
  });
}

function buildSteps(input) {
  const arr = input.slice();
  const steps = [];
  const freq = {};
  const record = makeSnap(steps, () => ({ ...freq }), (svg, snapshot, extra) => draw(svg, { arr, freq: snapshot, ...extra }));

  record(`Count how many times each value appears in [${arr.join(", ")}], using a hashmap.`, { js: 2, py: 2, cpp: 2 }, {});

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    freq[val] = (freq[val] || 0) + 1;
    record(`arr[${i}] = ${val}: increment its count to ${freq[val]}.`, { js: 4, py: 3, cpp: 4 }, { i });
  }

  record(`Done. Every value's frequency has been counted.`, { js: 6, py: 4, cpp: 6 }, {});
  return steps;
}

export default {
  id: "count-frequencies",
  title: "Counting Frequencies of Array Elements",
  category: "Basic Hashing",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Hashmap", "Array"],
  blurb: "Count how many times each value appears in an array, in a single pass, using a hashmap.",
  complexity: "Time: O(n) · Space: O(distinct values)",
  defaultInput: [1, 2, 2, 3, 3, 3, 1],
  sheetNum: 53,
  inputConfig: (algo) => arrayOnlyConfig(algo, "Array of numbers, comma-separated"),
  buildSteps,
  notes: {
    intuition:
      "A hashmap lets you look up and update a count for any value in O(1) time, so counting frequencies is just: walk the array once, and for each value, bump its counter in the map by one (starting from 0 if it's the first time you've seen it).",
    approach: [
      "Create an empty hashmap (value → count).",
      "Walk through the array once, left to right.",
      "For each element, increment its count in the map (if it's not there yet, treat its current count as 0 before incrementing).",
      "After the full pass, the map holds the frequency of every distinct value.",
    ],
    dryRun: "[1,2,2,3,3,3,1] → 1:1 → 2:1 → 2:2 → 3:1 → 3:2 → 3:3 → 1:2 → final: {1:2, 2:2, 3:3}",
    pitfalls: [
      "This is the foundational pattern behind a huge number of problems (majority element, first non-repeating character, anagram checks, etc.) — recognizing 'I need to count occurrences of something' as a signal to reach for a hashmap is a core skill.",
      "For a small, known range of values (like lowercase letters, or small positive integers with a known bound), a plain array can replace the hashmap for slightly better constant-factor performance — but the hashmap version works for ANY value type.",
      "Be careful with key types — in JavaScript, object keys are always converted to strings, so counting frequencies of numbers vs their string forms usually doesn't matter, but it's worth being aware of.",
    ],
  },
  codes: {
    js: `function countFrequencies(arr) {
  const freq = {};
  for (const val of arr) {
    freq[val] = (freq[val] || 0) + 1;
  }
  return freq;
}`,
    py: `def count_frequencies(arr):
    freq = {}
    for val in arr:
        freq[val] = freq.get(val, 0) + 1
    return freq`,
    cpp: `unordered_map<int, int> countFrequencies(vector<int>& arr) {
    unordered_map<int, int> freq;
    for (int val : arr) {
        freq[val]++;
    }
    return freq;
}`,
  },
};
