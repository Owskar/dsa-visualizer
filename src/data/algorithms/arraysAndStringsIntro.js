import { drawBars, clearStage, drawGrid, textEl, drawCharBoxRow, makeSnap, COLORS } from "../viz.js";
import { arrayOnlyConfig } from "../inputConfigHelpers.js";

const W = 720, H = 340;

function draw(svg, { arr, str, arrIndex, strIndex, caption }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  svg.appendChild(textEl(60, 40, "Array", { size: 13, weight: 700, fill: COLORS.inkFaint, anchor: "start" }));
  drawBars(svg, W, 190, arr, arrIndex !== undefined ? { compare: [arrIndex] } : {});
  svg.appendChild(textEl(60, 220, "String", { size: 13, weight: 700, fill: COLORS.inkFaint, anchor: "start" }));
  drawCharBoxRow(svg, W / 2, 250, str.split(""), null, { highlightLast: strIndex !== undefined, dataRole: "string-char" });
  if (caption) {
    const el = textEl(W / 2, H - 20, caption, { mono: true, size: 13, weight: 700, fill: COLORS.teal });
    el.setAttribute("data-role", "caption-label");
    svg.appendChild(el);
  }
}

function buildSteps(arr) {
  const str = "hello";
  const steps = [];
  const record = makeSnap(steps, () => ({}), (svg, _s, extra) => draw(svg, { arr, str, ...extra }));

  record(`An array is a numbered, ordered collection of values — here, [${arr.join(", ")}]. A string is an ordered sequence of characters — here, "${str}". Both support indexing.`,
    { js: 1, py: 1, cpp: 1 }, {});

  record(`Access an array element by index: arr[2] = ${arr[2]}. Indexing starts at 0, so index 2 is the THIRD element.`,
    { js: 3, py: 2, cpp: 3 }, { arrIndex: 2 });

  record(`Access a string character by index: str[1] = '${str[1]}'.`, { js: 4, py: 3, cpp: 4 }, { strIndex: 1 });

  record(`Arrays and strings both have a length: arr.length = ${arr.length}, str.length = ${str.length}.`,
    { js: 5, py: 4, cpp: 5 }, { caption: `arr has ${arr.length} elements, str has ${str.length} characters` });

  return steps;
}

export default {
  id: "arrays-and-strings-intro",
  title: "What are arrays, strings?",
  category: "Things to Know",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Fundamentals", "Array", "String"],
  blurb: "The two most fundamental data structures: an array is a numbered list of values, a string is a sequence of characters — both accessed the same way, by index.",
  complexity: "Time: O(1) to access any element by index · Space: O(n) to store n elements",
  defaultInput: [10, 20, 30, 40, 50],
  sheetNum: 5,
  inputConfig: (algo) => arrayOnlyConfig(algo, "Array of numbers, comma-separated"),
  buildSteps,
  notes: {
    intuition:
      "An array is just a row of labeled boxes sitting next to each other in memory, each holding one value, numbered starting from 0. A string is essentially the same idea, specialized for text — an ordered sequence of characters. Because both are laid out in order with numbered positions, you can jump directly to ANY element instantly, just by its index — you don't have to walk through the earlier ones to get there.",
    approach: [
      "An array holds a fixed-order collection of values, all typically the same type, accessed via `arr[index]`.",
      "Indexing starts at 0 — `arr[0]` is the FIRST element, not the second.",
      "A string is an ordered sequence of characters, and in most languages, individual characters can be accessed the same way: `str[index]`.",
      "Both arrays and strings have a length property/function telling you how many elements or characters they contain.",
    ],
    dryRun: "arr = [10,20,30,40,50]: arr[0]=10, arr[2]=30, arr[4]=50, arr.length=5 — str=\"hello\": str[0]='h', str[4]='o', str.length=5",
    pitfalls: [
      "Off-by-one errors are extremely common with 0-indexing — the LAST valid index of an array is `length - 1`, not `length`. Accessing `arr[arr.length]` is a classic out-of-bounds bug.",
      "In many languages (C++, Java), strings are technically arrays of characters and can be indexed and looped over exactly like arrays. In others (Python), strings are immutable — you can read `str[i]` but can't assign to it directly.",
      "'Array' sometimes means a fixed-size, contiguous block (like C++'s built-in arrays) and sometimes a resizable list (like JavaScript arrays or Python lists, more precisely called dynamic arrays) — know which one your language gives you by default.",
    ],
  },
  codes: {
    js: `const arr = [10, 20, 30, 40, 50];
const str = "hello";

console.log(arr[2]);      // 30
console.log(str[1]);      // "e"
console.log(arr.length, str.length); // 5 5`,
    py: `arr = [10, 20, 30, 40, 50]
s = "hello"

print(arr[2])              # 30
print(s[1])                # 'e'
print(len(arr), len(s))    # 5 5`,
    cpp: `#include <vector>
#include <string>
using namespace std;

int main() {
    vector<int> arr = {10, 20, 30, 40, 50};
    string str = "hello";

    cout << arr[2] << endl;              // 30
    cout << str[1] << endl;              // e
    cout << arr.size() << " " << str.size() << endl; // 5 5
}`,
  },
};
