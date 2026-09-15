import { clearStage, drawGrid, textEl, drawCharBoxRow, makeSnap, COLORS } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 260;

function draw(svg, { remaining, count }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  drawCharBoxRow(svg, W / 2, H / 2 - 20, String(remaining).split(""), "Remaining", {
    highlightLast: true, boxColor: "red", dataRole: "remaining-digit",
  });
  const el = textEl(W / 2, H / 2 + 60, `Digits counted so far: ${count}`, { mono: true, size: 15, weight: 700, fill: COLORS.teal });
  el.setAttribute("data-role", "caption-label");
  svg.appendChild(el);
}

function buildSteps(input) {
  let n = Math.abs(Math.trunc(input));
  const steps = [];
  const record = makeSnap(steps, () => ({ remaining: n }), (svg, s, extra) => draw(svg, { remaining: s.remaining, count: extra.count }));

  let count = 0;
  record(`Count the digits of ${n} by repeatedly dividing by 10 and counting each division, until nothing is left.`, { js: 1, py: 1, cpp: 1 }, { count });

  if (n === 0) {
    count = 1;
    record("0 itself counts as having one digit.", { js: 3, py: 3, cpp: 3 }, { count });
  }

  while (n > 0) {
    const digit = n % 10;
    n = Math.floor(n / 10);
    count++;
    record(`Peel off the last digit (${digit}). ${count} digit${count === 1 ? "" : "s"} counted so far.`, { js: 5, py: 4, cpp: 5 }, { count });
  }

  record(`Done — this number has ${count} digit${count === 1 ? "" : "s"}.`, { js: 8, py: 6, cpp: 8 }, { count });
  return steps;
}

export default {
  id: "count-digits",
  title: "Count all Digits of a Number",
  category: "Basic Maths",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Math", "Loops"],
  blurb: "Count how many digits a number has by repeatedly stripping off the last digit until nothing remains.",
  complexity: "Time: O(log₁₀ n) · Space: O(1)",
  defaultInput: 12345,
  sheetNum: 36,
  inputConfig: (algo) => boundedIntConfig(algo, "A whole number", 0, 999999999),
  buildSteps,
  notes: {
    intuition:
      "Every time you divide a number by 10 (integer division, dropping the remainder), you knock off its last digit. Do that repeatedly and count how many times it takes to reach 0 — that count IS the number of digits, since each division removes exactly one digit.",
    approach: [
      "Handle 0 as a special case: it has exactly one digit.",
      "Otherwise, initialize a counter to 0.",
      "While the number is greater than 0: increment the counter, and replace the number with itself divided by 10 (integer division).",
      "Once the number reaches 0, the counter holds the digit count.",
    ],
    dryRun: "12345 → /10→1234 (1) → /10→123 (2) → /10→12 (3) → /10→1 (4) → /10→0 (5) → 5 digits",
    pitfalls: [
      "Don't forget the n=0 edge case — the while loop never executes for 0 (since 0 is not > 0), so without a special case it would incorrectly report 0 digits instead of 1.",
      "For negative numbers, take the absolute value first — digit count shouldn't depend on the sign.",
      "This is O(log₁₀ n) time, not O(n) — the number of divisions needed grows with the number of digits, not the number's magnitude.",
    ],
  },
  codes: {
    js: `function countDigits(n) {
  if (n === 0) return 1;
  n = Math.abs(n);
  let count = 0;
  while (n > 0) {
    n = Math.floor(n / 10);
    count++;
  }
  return count;
}`,
    py: `def count_digits(n):
    if n == 0:
        return 1
    n = abs(n)
    count = 0
    while n > 0:
        n //= 10
        count += 1
    return count`,
    cpp: `int countDigits(int n) {
    if (n == 0) return 1;
    n = abs(n);
    int count = 0;
    while (n > 0) {
        n /= 10;
        count++;
    }
    return count;
}`,
  },
};
