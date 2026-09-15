import { drawBars, clearStage, drawGrid, textEl, box, makeSnap, COLORS } from "../viz.js";
import { arrayOnlyConfig } from "../inputConfigHelpers.js";

const W = 720, H = 340;

function draw(svg, { arr, i, freq, best }) {
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
    const isBest = best !== undefined && Number(val) === best;
    svg.appendChild(box(x, H - 80, boxW, boxH, {
      fill: isBest ? COLORS.amberFaint : COLORS.tealFaint,
      stroke: isBest ? COLORS.amber : COLORS.teal,
      strokeWidth: 2, label: `${val}:${count}`, fontSize: 13, dataRole: "freq-entry",
    }));
  });
}

function buildSteps(input) {
  const arr = input.slice();
  const steps = [];
  const freq = {};
  const record = makeSnap(steps, () => ({ ...freq }), (svg, snapshot, extra) => draw(svg, { arr, freq: snapshot, ...extra }));

  record(`Find the most frequently occurring value in [${arr.join(", ")}] — first count everything, then find the max count.`, { js: 2, py: 2, cpp: 2 }, {});

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    freq[val] = (freq[val] || 0) + 1;
    record(`arr[${i}] = ${val}: increment its count to ${freq[val]}.`, { js: 4, py: 3, cpp: 4 }, { i });
  }

  let bestVal, bestCount = -1;
  for (const [val, count] of Object.entries(freq)) {
    if (count > bestCount) {
      bestCount = count;
      bestVal = Number(val);
      record(`${val} occurs ${count} time(s) — the new highest so far.`, { js: 8, py: 6, cpp: 8 }, { best: bestVal });
    } else {
      record(`${val} occurs ${count} time(s) — not higher than the current best (${bestCount}).`, { js: 8, py: 6, cpp: 8 }, { best: bestVal });
    }
  }

  record(`Done. ${bestVal} occurs the most, ${bestCount} time(s).`, { js: 11, py: 8, cpp: 11 }, { best: bestVal });
  return steps;
}

export default {
  id: "highest-occurring-element",
  title: "Highest Occurring Element in an Array",
  category: "Basic Hashing",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Hashmap", "Array"],
  blurb: "Find the value that appears most often in an array: count every value's frequency, then scan for the maximum count.",
  complexity: "Time: O(n) · Space: O(distinct values)",
  defaultInput: [4, 2, 4, 1, 2, 4, 3],
  sheetNum: 54,
  inputConfig: (algo) => arrayOnlyConfig(algo, "Array of numbers, comma-separated"),
  buildSteps,
  notes: {
    intuition:
      "This builds directly on Counting Frequencies: once you know how many times every value appears, finding the most frequent one is just a matter of scanning those counts for the biggest one — no need to re-examine the original array at all.",
    approach: [
      "First pass: build a frequency map exactly as in Counting Frequencies (value → count).",
      "Second pass: walk through the frequency map's entries, tracking the value with the highest count seen so far.",
      "Whenever you find a count higher than your current best, update both the best value and its count.",
      "After scanning every entry, the tracked value is the most frequently occurring one.",
    ],
    dryRun: "[4,2,4,1,2,4,3] → frequencies: {4:3, 2:2, 1:1, 3:1} → scan: 4(3) is best so far → 2(2) not higher → 1(1) not higher → 3(1) not higher → answer: 4",
    pitfalls: [
      "This is two separate O(n) passes (build the map, then scan it) — still O(n) overall, not O(n²), since the second pass is over the map's distinct entries, not the original array again.",
      "If there's a tie for highest frequency, this approach returns whichever value the map happens to iterate to first — if the problem requires a specific tie-breaking rule (e.g. smallest value, or first-to-appear), that needs explicit handling.",
      "Don't confuse 'highest occurring VALUE' with 'highest VALUE' — the array [1,1,1,9] has 9 as its largest number, but 1 as its most frequent one.",
    ],
  },
  codes: {
    js: `function highestOccurring(arr) {
  const freq = {};
  for (const val of arr) {
    freq[val] = (freq[val] || 0) + 1;
  }

  let bestVal, bestCount = -1;
  for (const [val, count] of Object.entries(freq)) {
    if (count > bestCount) {
      bestCount = count;
      bestVal = Number(val);
    }
  }
  return bestVal;
}`,
    py: `def highest_occurring(arr):
    freq = {}
    for val in arr:
        freq[val] = freq.get(val, 0) + 1

    best_val, best_count = None, -1
    for val, count in freq.items():
        if count > best_count:
            best_count = count
            best_val = val
    return best_val`,
    cpp: `int highestOccurring(vector<int>& arr) {
    unordered_map<int, int> freq;
    for (int val : arr) freq[val]++;

    int bestVal = arr[0], bestCount = -1;
    for (auto& [val, count] : freq) {
        if (count > bestCount) {
            bestCount = count;
            bestVal = val;
        }
    }
    return bestVal;
}`,
  },
};
