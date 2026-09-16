import { clearStage, drawGrid, textEl, box, arrow, makeSnap, COLORS } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 340;

function draw(svg, { original, copyVal, mode, phase, caption }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  const origX = 100, copyX = W - 220;
  const y = 60;

  svg.appendChild(textEl(origX + 60, y - 24, "Caller's variable", { size: 12, fill: COLORS.inkFaint }));
  svg.appendChild(box(origX, y, 120, 60, { fill: phase === "after" && mode === "reference" ? COLORS.tealFaint : COLORS.blueFaint, stroke: phase === "after" && mode === "reference" ? COLORS.teal : COLORS.blue, strokeWidth: 2.5, label: original, fontSize: 22, dataRole: "original-value" }));

  if (phase !== "before") {
    if (mode === "value") {
      svg.appendChild(arrow(origX + 60, y + 60, copyX + 60, y + 5, { color: COLORS.inkFaint, dashed: true }));
      svg.appendChild(textEl(copyX + 60, y - 24, "Function's local copy", { size: 12, fill: COLORS.inkFaint }));
      svg.appendChild(box(copyX, y, 120, 60, { fill: COLORS.amberFaint, stroke: COLORS.amber, strokeWidth: 2.5, label: copyVal, fontSize: 22, dataRole: "copy-value" }));
    } else {
      svg.appendChild(textEl((origX + copyX) / 2 + 60, y + 100, "same memory — no copy!", { size: 12, fill: COLORS.teal, weight: 700 }));
      svg.appendChild(arrow(origX + 130, y + 30, origX + 200, y + 30, { color: COLORS.teal }));
      svg.appendChild(textEl(origX + 230, y + 30, "function operates directly on this box", { size: 12, fill: COLORS.teal, anchor: "start" }));
    }
  }

  if (caption) {
    const el = textEl(W / 2, H - 30, caption, { mono: true, size: 14, weight: 700, fill: COLORS.teal });
    el.setAttribute("data-role", "caption-label");
    svg.appendChild(el);
  }
}

function buildSteps(start) {
  const steps = [];

  function scenario(mode) {
    let original = start;
    const record = makeSnap(steps, () => ({ original }), (svg, s, extra) => draw(svg, { ...s, mode, ...extra }));

    record(
      mode === "value"
        ? `Call by VALUE: pass ${original} into a function that adds 10. The function gets its own COPY.`
        : `Call by REFERENCE: pass ${original} into a function that adds 10. The function gets direct access to the SAME variable.`,
      { js: mode === "value" ? 2 : 11, py: mode === "value" ? 2 : 11, cpp: mode === "value" ? 2 : 8 },
      { phase: "before" }
    );

    if (mode === "value") {
      const copyVal = original + 10;
      record(`Inside the function, the local copy becomes ${copyVal} — but the caller's original variable is untouched.`,
        { js: 3, py: 3, cpp: 3 }, { phase: "after", copyVal });
      record(`Function returns. Back in the caller: original is still ${original} — call by value can't modify the caller's variable.`,
        { js: 8, py: 8, cpp: 15 }, { phase: "after", copyVal, caption: `Caller's variable: still ${original}` });
    } else {
      record(`Inside the function, modifying the parameter modifies the SAME memory the caller's variable lives in.`,
        { js: 12, py: 12, cpp: 9 }, { phase: "after" });
      original = original + 10;
      record(`Function returns. Back in the caller: the original variable has CHANGED to ${original} — call by reference can modify it.`,
        { js: 16, py: 16, cpp: 18 }, { phase: "after", caption: `Caller's variable: now ${original}` });
    }
  }

  scenario("value");
  scenario("reference");
  return steps;
}

export default {
  id: "pass-by-reference-value",
  title: "Functions — Pass by Reference and Value",
  category: "Things to Know",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Fundamentals", "Functions", "Memory"],
  blurb: "When you pass a variable into a function, does the function get its own copy, or direct access to the original? The answer changes whether the caller's variable can be modified.",
  complexity: "N/A — this is a language semantics concept, not an algorithm",
  defaultInput: 5,
  sheetNum: 8,
  inputConfig: (algo) => boundedIntConfig(algo, "A starting number", -100, 100),
  buildSteps,
  notes: {
    intuition:
      "When you call a function with an argument, the language has to decide: does the function get a brand-new COPY of the value to play with (call by value), or does it get direct access to the exact same variable the caller has (call by reference)? This matters because it determines whether changes made INSIDE the function are visible to the caller AFTER the function returns.",
    approach: [
      "Call by value: the function receives a copy of the argument. Any changes it makes are local to that copy — the caller's original variable is completely unaffected.",
      "Call by reference: the function receives a reference (an alias) to the caller's actual variable. Changes made inside the function are changes to the SAME memory the caller sees — so the caller's variable changes too.",
      "In C++, you choose explicitly: `void f(int x)` is by value, `void f(int& x)` is by reference (the `&` is what makes the difference).",
      "In JavaScript and Python, primitives (numbers, strings, booleans) always behave like call-by-value, while objects/arrays (lists/dicts) are passed as references to the same underlying object — a hybrid model worth understanding explicitly.",
    ],
    dryRun: "value: x=5 → f(x) copies to local=5, local+=10=15, x is STILL 5 after f returns — reference: x=5 → f(x) aliases x, x+=10 directly, x IS 15 after f returns",
    pitfalls: [
      "In JavaScript/Python, passing an ARRAY or OBJECT into a function and mutating it in place (e.g. `arr.push(x)`, not `arr = arr.concat(x)`) DOES affect the caller's array — because the reference to the same underlying array was passed, even though the language has no explicit '&' syntax like C++.",
      "This is exactly why some functions are written to return a NEW array/object instead of mutating the input in place — it avoids surprising the caller with side effects they didn't expect.",
      "C++ has a third option worth knowing: passing a pointer (`void f(int* x)`) — similar in spirit to a reference, but requires explicit dereferencing (`*x`) and can be null, which a reference cannot.",
    ],
  },
  codes: {
    js: `// JS primitives behave like call-by-value:
function addTenByValue(x) {
  x = x + 10;   // only changes the local copy
  return x;
}
let original = 5;
addTenByValue(original);
console.log(original); // still 5

// Objects/arrays are passed by reference to the same object:
function addTenByReference(obj) {
  obj.value = obj.value + 10; // mutates the SAME object
}
let boxed = { value: 5 };
addTenByReference(boxed);
console.log(boxed.value); // now 15`,
    py: `# Python numbers behave like call-by-value:
def add_ten_by_value(x):
    x = x + 10       # only rebinds the local name
    return x

original = 5
add_ten_by_value(original)
print(original)  # still 5

# Mutable objects (lists, dicts) are passed by reference:
def add_ten_by_reference(boxed):
    boxed["value"] += 10  # mutates the SAME dict

boxed = {"value": 5}
add_ten_by_reference(boxed)
print(boxed["value"])  # now 15`,
    cpp: `// Call by value — function gets its own copy
int addTenByValue(int x) {
    x = x + 10;
    return x;
}

// Call by reference — function gets the SAME variable (note the &)
void addTenByReference(int& x) {
    x = x + 10;
}

int main() {
    int original = 5;
    addTenByValue(original);
    cout << original << endl;      // still 5

    addTenByReference(original);
    cout << original << endl;      // now 15
}`,
  },
};
