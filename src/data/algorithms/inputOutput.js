import { clearStage, drawGrid, textEl, box, arrow, makeSnap, COLORS } from "../viz.js";
import { twoIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 280;

function draw(svg, { stage, a, b, sum }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  const y = H / 2 - 30;
  const inX = 60, varX = W / 2 - 45, outX = W - 150;

  const inActive = stage === "input";
  const procActive = stage === "process";
  const outActive = stage === "output";

  svg.appendChild(box(inX, y, 110, 60, { fill: inActive ? COLORS.blueFaint : "#fff", stroke: inActive ? COLORS.blue : COLORS.ink, strokeWidth: 2, label: a !== undefined && b !== undefined ? `${a}, ${b}` : "stdin", fontSize: 15, dataRole: "io-input" }));
  svg.appendChild(textEl(inX + 55, y - 16, "Input", { size: 12, fill: COLORS.inkFaint }));

  svg.appendChild(arrow(inX + 110, y + 30, varX - 6, y + 30, { color: COLORS.inkFaint }));

  svg.appendChild(box(varX, y, 90, 60, { fill: procActive ? COLORS.amberFaint : "#fff", stroke: procActive ? COLORS.amber : COLORS.ink, strokeWidth: 2, label: sum !== undefined ? `sum=${sum}` : "a, b", fontSize: 14, dataRole: "io-process" }));
  svg.appendChild(textEl(varX + 45, y - 16, "Process", { size: 12, fill: COLORS.inkFaint }));

  svg.appendChild(arrow(varX + 90, y + 30, outX - 6, y + 30, { color: COLORS.inkFaint }));

  svg.appendChild(box(outX, y, 110, 60, { fill: outActive ? COLORS.tealFaint : "#fff", stroke: outActive ? COLORS.teal : COLORS.ink, strokeWidth: 2, label: sum !== undefined && outActive ? String(sum) : "stdout", fontSize: 15, dataRole: "io-output" }));
  svg.appendChild(textEl(outX + 55, y - 16, "Output", { size: 12, fill: COLORS.inkFaint }));
}

function buildSteps(a, b) {
  const steps = [];
  const record = makeSnap(steps, () => ({}), (svg, _s, extra) => draw(svg, { a, b, ...extra }));

  record(`A program reads input, does something with it, and produces output. Here: read two numbers and print their sum.`,
    { js: 1, py: 1, cpp: 2 }, { stage: "input" });
  record(`Read ${a} and ${b} from input (cin in C++, input() in Python, prompt/argv in JS) into variables.`,
    { js: 2, py: 2, cpp: 4 }, { stage: "input" });
  const sum = a + b;
  record(`Process: compute sum = ${a} + ${b} = ${sum}.`, { js: 3, py: 3, cpp: 5 }, { stage: "process", sum });
  record(`Write the result to output (console.log in JS, print() in Python, cout in C++): ${sum}.`,
    { js: 4, py: 4, cpp: 6 }, { stage: "output", sum });
  return steps;
}

export default {
  id: "input-output",
  title: "Input Output",
  category: "Things to Know",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Fundamentals", "I/O"],
  blurb: "Every program follows the same shape: read input, process it, produce output. Learn the three-stage pipeline that underlies all of programming.",
  complexity: "Time: O(1) for reading/writing a fixed amount of data · Space: O(1)",
  defaultInput: 5,
  defaultTarget: 7,
  sheetNum: 1,
  inputConfig: (algo) => twoIntConfig(algo, "Two whole numbers to add — e.g. 5 | 7"),
  buildSteps,
  notes: {
    intuition:
      "Nearly every program you'll ever write follows the same three-stage shape: get some data IN (from a keyboard, a file, a network request, or hardcoded test input), DO something with it, and send some data OUT (print it, save it, return it). Learning to read input and produce output correctly in your language of choice is the very first skill, because every other topic builds on top of it.",
    approach: [
      "Declare variables to hold whatever you're going to read in.",
      "Use your language's input mechanism to read values into those variables — `cin >>` in C++, `input()` in Python, reading from `process.argv` or a form field in JavaScript.",
      "Do whatever processing the program needs (here, just adding two numbers).",
      "Use your language's output mechanism to print or return the result — `cout <<` in C++, `print()` in Python, `console.log()` in JavaScript.",
    ],
    dryRun: "Input: 5, 7 → read into a=5, b=7 → process: sum = 5+7 = 12 → output: 12",
    pitfalls: [
      "Input read as text often needs explicit conversion to a number before you can do arithmetic on it — a very common beginner bug is trying to add two strings and getting concatenation (\"5\"+\"7\" = \"57\") instead of addition.",
      "Different languages have very different default I/O idioms (buffered vs unbuffered, needing explicit type parsing or not) — always check what your specific language expects.",
      "Get comfortable with input/output FIRST — it's not exciting, but every single algorithm you learn after this needs to read its input and print its answer somehow.",
    ],
  },
  codes: {
    js: `// Reading two numbers and printing their sum
const a = 5;
const b = 7;
const sum = a + b;
console.log(sum);`,
    py: `# Reading two numbers and printing their sum
a = 5
b = 7
total = a + b
print(total)`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    int a = 5, b = 7;
    int sum = a + b;
    cout << sum << endl;
    return 0;
}`,
  },
};
