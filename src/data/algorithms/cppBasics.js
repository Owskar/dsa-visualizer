import { clearStage, drawGrid, textEl, box, makeSnap, COLORS } from "../viz.js";

const W = 720, H = 300;
const BOX_W = 160, BOX_H = 46, GAP = 14;

function draw(svg, { vars, current }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  const totalH = vars.length * (BOX_H + GAP) - GAP;
  const startY = (H - totalH) / 2;
  vars.forEach((v, i) => {
    const y = startY + i * (BOX_H + GAP);
    const isCurrent = i === current;
    svg.appendChild(box(W / 2 - BOX_W / 2, y, BOX_W, BOX_H, {
      fill: isCurrent ? COLORS.blueFaint : COLORS.tealFaint,
      stroke: isCurrent ? COLORS.blue : COLORS.teal,
      strokeWidth: 2, label: `${v.type} ${v.name} = ${v.value}`, fontSize: 14, dataRole: "variable-decl",
    }));
  });
}

function buildSteps() {
  const steps = [];
  const vars = [];
  const record = makeSnap(steps, () => vars.map((v) => ({ ...v })), (svg, snapshot, extra) => draw(svg, { vars: snapshot, ...extra }));

  record("Every C++ program is built from variables, each with a fixed data type. Declare a few, one at a time.", { js: 1, py: 1, cpp: 5 }, {});

  const declarations = [
    { type: "int", name: "age", value: 21 },
    { type: "float", name: "price", value: "9.99" },
    { type: "char", name: "grade", value: "'A'" },
    { type: "bool", name: "isValid", value: "true" },
    { type: "string", name: "name", value: '"Ada"' },
  ];

  declarations.forEach((decl, i) => {
    vars.push(decl);
    record(`Declare ${decl.type} ${decl.name} = ${decl.value} — this reserves memory of exactly the size a ${decl.type} needs.`,
      { js: 2, py: 2, cpp: 6 + i }, { current: i });
  });

  record("Every variable in C++ has a fixed type decided at declaration — unlike JavaScript or Python, it can't later hold a value of a different type.",
    { js: 3, py: 3, cpp: 12 }, {});
  return steps;
}

export default {
  id: "cpp-basics",
  title: "C++ Basics",
  category: "Things to Know",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Fundamentals", "Syntax"],
  blurb: "Every C++ program is built from typed variables, a main() function, and statements ending in semicolons — the syntax skeleton everything else sits on.",
  complexity: "N/A — this is language syntax, not an algorithm",
  defaultInput: null,
  sheetNum: 2,
  buildSteps,
  notes: {
    intuition:
      "Unlike JavaScript or Python, C++ is statically and strongly typed: every variable's type is fixed the moment it's declared, and the compiler enforces it before your program ever runs. This is a tradeoff — more upfront ceremony, but the compiler catches a whole class of bugs (like adding a number to a string) that dynamically-typed languages would only discover at runtime.",
    approach: [
      "Every C++ program needs a `main()` function — that's where execution starts.",
      "Declare a variable with its type first, then its name, then (optionally) an initial value: `int age = 21;`.",
      "Common built-in types: `int` (whole numbers), `float`/`double` (decimals), `char` (a single character), `bool` (true/false), and `string` (text, via `#include <string>`).",
      "Every statement ends with a semicolon — leaving one off is the single most common beginner syntax error.",
    ],
    dryRun: "int age = 21; → reserves 4 bytes, stores the value 21, and the compiler will reject any later attempt to put text into `age`",
    pitfalls: [
      "Forgetting semicolons is the classic first C++ compiler error — the error message often points at the NEXT line, not the one actually missing the semicolon, which is confusing at first.",
      "`int` division truncates: `7 / 2` gives `3`, not `3.5` — you need at least one operand to be a `float`/`double` to get a decimal result.",
      "Uninitialized variables in C++ can contain garbage memory values (unlike Python/JavaScript, which give clean defaults) — always initialize a variable when you declare it if you plan to read from it before assigning.",
    ],
  },
  codes: {
    js: `// JavaScript is dynamically typed — no type keyword needed
let age = 21;
let price = 9.99;
let grade = 'A';
let isValid = true;
let name = "Ada";`,
    py: `# Python is dynamically typed too — no type keyword needed
age = 21
price = 9.99
grade = 'A'
is_valid = True
name = "Ada"`,
    cpp: `#include <iostream>
#include <string>
using namespace std;

int main() {
    int age = 21;
    float price = 9.99;
    char grade = 'A';
    bool isValid = true;
    string name = "Ada";

    cout << name << " is " << age << " years old." << endl;
    return 0;
}`,
  },
};
