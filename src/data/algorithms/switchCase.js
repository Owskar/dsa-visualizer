import { clearStage, drawGrid, textEl, box, makeSnap, COLORS } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 320;
const DAYS = { 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday", 7: "Sunday" };

function draw(svg, { n, checking, matched }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  svg.appendChild(box(W / 2 - 55, 20, 110, 46, { fill: COLORS.blueFaint, stroke: COLORS.blue, strokeWidth: 2, label: `day = ${n}`, fontSize: 15, dataRole: "switch-value" }));

  const cases = Object.keys(DAYS).map(Number);
  const boxW = 78, gap = 6;
  const totalW = cases.length * boxW + (cases.length - 1) * gap;
  const startX = (W - totalW) / 2;
  cases.forEach((c, i) => {
    const x = startX + i * (boxW + gap);
    let fill = COLORS.paperRaised, stroke = COLORS.ink;
    if (matched === c) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (checking === c) { fill = COLORS.amberFaint; stroke = COLORS.amber; }
    svg.appendChild(box(x, 110, boxW, 46, { fill, stroke, strokeWidth: 2, label: `case ${c}`, fontSize: 12, dataRole: "case-label" }));
  });

  if (matched) {
    svg.appendChild(textEl(W / 2, 200, `${n} → "${DAYS[matched]}"`, { mono: true, size: 16, weight: 700, fill: COLORS.teal }));
  }
}

function buildSteps(n) {
  const steps = [];
  const record = makeSnap(steps, () => n, (svg, snapshotN, extra) => draw(svg, { n: snapshotN, ...extra }));
  const cases = Object.keys(DAYS).map(Number);

  record(`Convert day number ${n} to its name using a switch statement — it jumps straight to the matching case.`, { js: 2, py: 1, cpp: 2 }, {});

  for (const c of cases) {
    if (c === n) {
      record(`case ${c}: matches! Return "${DAYS[c]}" and break out of the switch.`, { js: 3 + cases.indexOf(c), py: 1, cpp: 3 + cases.indexOf(c) }, { checking: c, matched: c });
      return steps;
    }
    record(`case ${c}: doesn't match ${n} — fall through to the next case.`, { js: 3 + cases.indexOf(c), py: 1, cpp: 3 + cases.indexOf(c) }, { checking: c });
  }

  record(`No case matched — the default branch runs.`, { js: 10, py: 1, cpp: 10 }, { matched: undefined });
  return steps;
}

export default {
  id: "switch-case",
  title: "Switch Case",
  category: "Things to Know",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Fundamentals", "Control Flow"],
  blurb: "Choose one of many branches based on a single value — a switch statement is a cleaner alternative to a long if/else-if chain when comparing one variable against several exact values.",
  complexity: "Time: O(1) to O(n) depending on implementation (often a jump table) · Space: O(1)",
  defaultInput: 3,
  sheetNum: 4,
  inputConfig: (algo) => boundedIntConfig(algo, "Day number 1–7", 1, 7),
  buildSteps,
  notes: {
    intuition:
      "When you're comparing the SAME variable against many different exact values, a switch statement reads more clearly than a long chain of `else if`s — you state the variable once, then list each value you care about as a `case`, with the matching one's code running.",
    approach: [
      "Write `switch (variable)` once, naming the value you're branching on.",
      "List each possible value as `case value:`, followed by the code to run if it matches.",
      "End each case with `break` (in C-family languages) — otherwise execution 'falls through' into the next case, which is rarely what you want.",
      "Add a `default:` case at the end to handle any value that didn't match any listed case.",
    ],
    dryRun: "day = 3: case 1 no, case 2 no, case 3 yes → return \"Wednesday\", break — cases 4-7 and default are never reached",
    pitfalls: [
      "Forgetting `break` after a case is the most common switch-statement bug in C-family languages — without it, execution 'falls through' and runs the NEXT case's code too, unintentionally.",
      "Python didn't have a switch statement at all until `match`/`case` was added in Python 3.10 — before that, an if/elif chain or a dictionary lookup was the idiomatic substitute.",
      "A switch can only compare for exact equality against constant values — it can't express a range check like `n > 10`, which still needs an if/else chain.",
    ],
  },
  codes: {
    js: `function dayName(day) {
  switch (day) {
    case 1: return "Monday";
    case 2: return "Tuesday";
    case 3: return "Wednesday";
    case 4: return "Thursday";
    case 5: return "Friday";
    case 6: return "Saturday";
    case 7: return "Sunday";
    default: return "Invalid day";
  }
}`,
    py: `def day_name(day):
    return {
        1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday",
        5: "Friday", 6: "Saturday", 7: "Sunday",
    }.get(day, "Invalid day")`,
    cpp: `string dayName(int day) {
    switch (day) {
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";
        case 7: return "Sunday";
        default: return "Invalid day";
    }
}`,
  },
};
