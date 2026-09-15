import { drawNumberPeel, makeSnap } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 260;

function buildSteps(input) {
  let n = Math.abs(Math.trunc(input));
  const steps = [];
  const record = makeSnap(
    steps,
    () => ({ n, rev: undefined }),
    (svg, s, extra) => drawNumberPeel(svg, W, H, s.n, extra.rev ?? "", { caption: extra.caption })
  );

  record(`Reverse the digits of ${n} by peeling off its last digit each time and building the answer from the other end.`,
    { js: 2, py: 2, cpp: 2 }, { rev: "" });

  let rev = 0;
  while (n > 0) {
    const digit = n % 10;
    rev = rev * 10 + digit;
    n = Math.floor(n / 10);
    record(`Take digit ${digit} off the end, and append it to the reversed result: ${rev}.`, { js: 5, py: 4, cpp: 5 }, { rev });
  }

  record(`Done — the reversed number is ${rev}.`, { js: 8, py: 6, cpp: 8 }, { rev, caption: `Reversed: ${rev}` });
  return steps;
}

export default {
  id: "reverse-number",
  title: "Reverse a Number",
  category: "Basic Maths",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Math", "Loops"],
  blurb: "Build the reverse of a number digit by digit, by repeatedly peeling off its last digit and appending it to a running result.",
  complexity: "Time: O(log₁₀ n) · Space: O(1)",
  defaultInput: 1234,
  sheetNum: 37,
  inputConfig: (algo) => boundedIntConfig(algo, "A whole number", 0, 999999999),
  buildSteps,
  notes: {
    intuition:
      "The last digit of the original number should become the FIRST digit of the reversed number. Each time you peel off a digit (using % 10), shifting the running result left by one place (× 10) and adding the new digit puts it in exactly the right spot — building the reversed number one digit at a time, from the outside in.",
    approach: [
      "Initialize the result to 0.",
      "While the number is greater than 0: extract its last digit (number % 10).",
      "Update the result: result = result × 10 + digit — this shifts everything already in `result` one place left and appends the new digit at the end.",
      "Divide the number by 10 (integer division) to drop the digit you just used.",
      "Repeat until the number reaches 0 — `result` now holds the fully reversed number.",
    ],
    dryRun: "1234 → digit 4, rev=0×10+4=4, n=123 → digit 3, rev=4×10+3=43, n=12 → digit 2, rev=43×10+2=432, n=1 → digit 1, rev=432×10+1=4321",
    pitfalls: [
      "Reversing a number can overflow fixed-width integer types (like a 32-bit int in C++/Java) if the original number is close to the maximum representable value — real interview answers often need an overflow check.",
      "This is a completely different technique from reversing a STRING (which just swaps characters from both ends) — reversing a NUMBER works through repeated division/modulo since there's no direct indexing into digits.",
      "Leading zeros disappear naturally: reversing 1200 gives 21, not 0021 — since 0021 isn't a valid representation of a number, this is usually the expected behavior.",
    ],
  },
  codes: {
    js: `function reverseNumber(n) {
  n = Math.abs(n);
  let rev = 0;
  while (n > 0) {
    const digit = n % 10;
    rev = rev * 10 + digit;
    n = Math.floor(n / 10);
  }
  return rev;
}`,
    py: `def reverse_number(n):
    n = abs(n)
    rev = 0
    while n > 0:
        digit = n % 10
        rev = rev * 10 + digit
        n //= 10
    return rev`,
    cpp: `int reverseNumber(int n) {
    n = abs(n);
    long rev = 0;
    while (n > 0) {
        int digit = n % 10;
        rev = rev * 10 + digit;
        n /= 10;
    }
    return (int)rev;
}`,
  },
};
