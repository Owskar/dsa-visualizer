import { clearStage, drawGrid, textEl, box, tag, makeSnap, COLORS } from "../viz.js";
import { stringOnlyConfig } from "../inputConfigHelpers.js";

const W = 760, H = 300;
const BOX = 46, GAP = 6;

function drawCharRow(svg, chars, opts = {}) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  const totalW = chars.length * BOX + Math.max(0, chars.length - 1) * GAP;
  const startX = Math.max(20, (W - totalW) / 2);
  const y = H / 2 - BOX / 2 - 10;
  const window = opts.window || new Set();
  const best = opts.best || new Set();
  const dup = opts.dup;

  chars.forEach((ch, i) => {
    const x = startX + i * (BOX + GAP);
    let fill = COLORS.paperRaised, stroke = COLORS.ink;
    if (i === dup) { fill = COLORS.redFaint; stroke = COLORS.red; }
    else if (window.has(i)) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    else if (best.has(i)) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    svg.appendChild(box(x, y, BOX, BOX, { fill, stroke, strokeWidth: 2, label: ch, fontSize: 18, dataRole: "char-value" }));
    svg.appendChild(textEl(x + BOX / 2, y + BOX + 16, String(i), { mono: true, size: 11, fill: COLORS.inkFaint }));
    if (opts.left === i) svg.appendChild(tag(x + BOX / 2, y - 22, "left", COLORS.blue));
    if (opts.right === i) svg.appendChild(tag(x + BOX / 2, y - 22, "right", COLORS.amber));
  });

  if (opts.caption) {
    svg.appendChild(textEl(W / 2, H - 22, opts.caption, { mono: true, size: 13, weight: 700, fill: COLORS.teal }));
  }
}

function buildSteps(str) {
  const chars = str.split("");
  const steps = [];
  const snap = makeSnap(steps, () => chars.slice(), (svg, snapshot, extra) => drawCharRow(svg, snapshot, extra));

  const seen = new Map();
  let left = 0, maxLen = 0, bestStart = 0, bestEnd = -1;

  snap(`Find the longest substring of "${str}" with no repeated characters, using a sliding window.`,
    { js: 2, py: 2, cpp: 2 }, {});

  for (let right = 0; right < chars.length; right++) {
    const c = chars[right];
    snap(`Expand the window to include index ${right} ('${c}').`, { js: 6, py: 4, cpp: 6 },
      { window: windowSet(left, right), left, right });

    if (seen.has(c) && seen.get(c) >= left) {
      const dupIndex = seen.get(c);
      snap(`'${c}' already appears in the window at index ${dupIndex} — shrink the window past it.`,
        { js: 7, py: 5, cpp: 7 }, { window: windowSet(left, right), left, right, dup: dupIndex });
      left = dupIndex + 1;
      snap(`Window's left edge moves to index ${left}.`, { js: 7, py: 5, cpp: 7 }, { window: windowSet(left, right), left, right });
    }
    seen.set(c, right);

    if (right - left + 1 > maxLen) {
      maxLen = right - left + 1;
      bestStart = left; bestEnd = right;
      snap(`New longest window: "${chars.slice(left, right + 1).join("")}" (length ${maxLen}).`,
        { js: 10, py: 7, cpp: 10 }, { window: windowSet(left, right), left, right, best: windowSet(bestStart, bestEnd) });
    }
  }

  snap(`Done. Longest substring without repeats: "${chars.slice(bestStart, bestEnd + 1).join("")}" (length ${maxLen}).`,
    { js: 13, py: 8, cpp: 13 }, { best: windowSet(bestStart, bestEnd), caption: `Answer: "${chars.slice(bestStart, bestEnd + 1).join("")}" (length ${maxLen})` });
  return steps;
}

function windowSet(a, b) {
  const s = new Set();
  for (let k = a; k <= b; k++) s.add(k);
  return s;
}

export default {
  id: "longest-substring",
  title: "Longest Substring Without Repeating Characters",
  category: "Strings",
  level: "Intermediate",
  difficulty: "Medium",
  tags: ["Sliding Window", "Hashmap", "Two Pointers"],
  blurb: "Find the length of the longest run of characters with no repeats, expanding and shrinking a window over the string.",
  complexity: "Time: O(n) · Space: O(min(n, charset size))",
  defaultInput: "abcabcbb",
  sheetNum: 253,
  inputConfig: (algo) => stringOnlyConfig(algo, "String to search (letters/digits work best, no spaces)"),
  buildSteps,
  notes: {
    intuition:
      "A sliding window is a range [left, right] that only ever grows on the right and shrinks from the left — never restarting from scratch. Keep expanding the window by moving `right` forward. The moment you'd include a character that's already inside the current window, that's a violation — so shrink from the left just enough to push the old occurrence of that character out.",
    approach: [
      "Keep a hashmap of each character's most recent index seen.",
      "Move `right` across the string one character at a time, expanding the window.",
      "If the character at `right` was already seen at an index inside the current window (i.e. ≥ left), move `left` to just past that earlier occurrence — this removes the duplicate from the window.",
      "Update the character's last-seen index to the current `right`.",
      "After each step, check if the current window (right - left + 1) is the longest seen so far, and record it if so.",
    ],
    dryRun: "\"abcabcbb\" → window grows a,ab,abc (len 3) → 'a' repeats, left jumps to 1 → bca (len 3) → 'b' repeats, left jumps to 2 → cab (len 3) → ... → answer: length 3 (\"abc\")",
    pitfalls: [
      "The classic bug: when a repeat is found, only move `left` forward — never backward — and only as far as `duplicateIndex + 1`, not to the duplicate's own position (that would still leave the duplicate inside the window).",
      "Checking `seen.get(c) >= left` (not just `seen.has(c)`) matters — a character seen BEFORE the current window started is irrelevant and shouldn't trigger a shrink.",
      "This same sliding-window shape (expand right, shrink left on a violation) solves a whole family of problems — longest substring with at most K distinct characters, minimum window substring, etc. — so it's worth memorizing the pattern, not just this specific problem.",
    ],
  },
  codes: {
    js: `function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let left = 0, maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    if (seen.has(c) && seen.get(c) >= left) {
      left = seen.get(c) + 1;
    }
    seen.set(c, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    py: `def length_of_longest_substring(s):
    seen = {}
    left = 0
    max_len = 0
    for right, c in enumerate(s):
        if c in seen and seen[c] >= left:
            left = seen[c] + 1
        seen[c] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
    cpp: `int lengthOfLongestSubstring(string s) {
    unordered_map<char, int> seen;
    int left = 0, maxLen = 0;
    for (int right = 0; right < s.size(); right++) {
        char c = s[right];
        if (seen.count(c) && seen[c] >= left) {
            left = seen[c] + 1;
        }
        seen[c] = right;
        maxLen = max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
  },
};
