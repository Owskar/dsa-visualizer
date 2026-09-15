import { drawNumberPeel, makeSnap } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 260;

function digitCount(n) {
  return n === 0 ? 1 : String(n).length;
}

function buildSteps(input) {
  const original = Math.abs(Math.trunc(input));
  const power = digitCount(original);
  let n = original;
  const steps = [];
  const record = makeSnap(
    steps,
    () => ({ n }),
    (svg, s, extra) => drawNumberPeel(svg, W, H, s.n, extra.sum ?? 0, { caption: extra.caption, remainingLabel: "Remaining", extractedLabel: "Running sum" })
  );

  record(`${original} has ${power} digit${power === 1 ? "" : "s"}. Check if it equals the sum of each digit raised to the power ${power}.`,
    { js: 2, py: 2, cpp: 2 }, { sum: 0 });

  let sum = 0;
  while (n > 0) {
    const digit = n % 10;
    sum += Math.pow(digit, power);
    n = Math.floor(n / 10);
    record(`Digit ${digit}: add ${digit}^${power} = ${Math.pow(digit, power)} to the running sum. Sum so far: ${sum}.`, { js: 6, py: 5, cpp: 6 }, { sum });
  }

  const isArmstrong = sum === original;
  record(
    `Compare: sum of powers = ${sum}, original = ${original} — ${isArmstrong ? "they match! It's an Armstrong number." : "they differ — not an Armstrong number."}`,
    { js: 9, py: 7, cpp: 9 },
    { sum, caption: `${original} ${isArmstrong ? "IS" : "is NOT"} an Armstrong number` }
  );
  return steps;
}

export default {
  id: "check-armstrong",
  title: "Check if the Number is Armstrong",
  category: "Basic Maths",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Math", "Loops"],
  blurb: "Check whether a number equals the sum of each of its own digits raised to the power of the digit count — like 153 = 1³ + 5³ + 3³.",
  complexity: "Time: O((log₁₀ n)²) — digit count times a power computation per digit · Space: O(1)",
  defaultInput: 153,
  sheetNum: 40,
  inputConfig: (algo) => boundedIntConfig(algo, "A whole number", 0, 999999),
  buildSteps,
  notes: {
    intuition:
      "An Armstrong number is a number that 'reconstructs itself' from its own digits: raise each digit to the power of however many digits the number has, add them all up, and if you get the original number back, it's an Armstrong number. 153 has 3 digits, and 1³ + 5³ + 3³ = 1 + 125 + 27 = 153 — a match.",
    approach: [
      "Count how many digits the number has (call it `power`) — you'll need this exponent for every digit.",
      "Peel digits off the number one at a time (using % 10 and integer division by 10, same as Reverse a Number).",
      "For each digit, raise it to `power` and add the result to a running sum.",
      "Once all digits are processed, compare the running sum to the ORIGINAL number (saved before you started peeling).",
      "If they're equal, it's an Armstrong number.",
    ],
    dryRun: "153: 3 digits → 1³=1, 5³=125, 3³=27 → sum = 1+125+27 = 153 → matches original → Armstrong! (154 would give 1+64+125=190 ≠ 154 → not Armstrong)",
    pitfalls: [
      "The exponent is the DIGIT COUNT, not a fixed number like 3 — a common bug is hardcoding cubing, which only works for 3-digit Armstrong numbers (like 153, 370, 371, 407) and silently gives wrong answers for numbers with a different digit count (like the 4-digit Armstrong number 1634 = 1⁴+6⁴+3⁴+4⁴).",
      "Save the original number before the peeling loop mutates your working copy — you need it for the final comparison.",
      "Armstrong numbers get rare fast as digit count grows — there are only a handful for each digit length, so testing on small known examples (153, 371, 9474) is a good sanity check.",
    ],
  },
  codes: {
    js: `function isArmstrong(n) {
  const original = n;
  const power = String(n).length;
  let sum = 0;
  while (n > 0) {
    const digit = n % 10;
    sum += Math.pow(digit, power);
    n = Math.floor(n / 10);
  }
  return sum === original;
}`,
    py: `def is_armstrong(n):
    original = n
    power = len(str(n))
    total = 0
    while n > 0:
        digit = n % 10
        total += digit ** power
        n //= 10
    return total == original`,
    cpp: `bool isArmstrong(int n) {
    int original = n;
    int power = to_string(n).length();
    int sum = 0;
    while (n > 0) {
        int digit = n % 10;
        sum += pow(digit, power);
        n /= 10;
    }
    return sum == original;
}`,
  },
};
