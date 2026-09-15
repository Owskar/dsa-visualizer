import { drawNumberPeel, makeSnap } from "../viz.js";
import { boundedIntConfig } from "../inputConfigHelpers.js";

const W = 720, H = 260;

function buildSteps(input) {
  const original = Math.abs(Math.trunc(input));
  let n = original;
  const steps = [];
  const record = makeSnap(
    steps,
    () => ({ n }),
    (svg, s, extra) => drawNumberPeel(svg, W, H, s.n, extra.rev ?? "", { caption: extra.caption, remainingLabel: "Remaining", extractedLabel: "Reversed so far" })
  );

  record(`Check if ${original} reads the same forwards and backwards, by reversing it and comparing.`, { js: 2, py: 2, cpp: 2 }, { rev: "" });

  let rev = 0;
  while (n > 0) {
    const digit = n % 10;
    rev = rev * 10 + digit;
    n = Math.floor(n / 10);
    record(`Peel off digit ${digit}, building the reversed number: ${rev}.`, { js: 5, py: 4, cpp: 5 }, { rev });
  }

  const isPalindrome = rev === original;
  record(
    `Compare: original = ${original}, reversed = ${rev} — ${isPalindrome ? "they match! It's a palindrome." : "they differ — not a palindrome."}`,
    { js: 8, py: 6, cpp: 8 },
    { rev, caption: `${original} ${isPalindrome ? "IS" : "is NOT"} a palindrome` }
  );
  return steps;
}

export default {
  id: "palindrome-number",
  title: "Palindrome Number",
  category: "Basic Maths",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Math", "Loops"],
  blurb: "Check whether a number reads the same forwards and backwards, by reversing it and comparing to the original.",
  complexity: "Time: O(log₁₀ n) · Space: O(1)",
  defaultInput: 12321,
  sheetNum: 38,
  inputConfig: (algo) => boundedIntConfig(algo, "A whole number", 0, 999999999),
  buildSteps,
  notes: {
    intuition:
      "A palindrome number reads identically forwards and backwards — like 12321. The simplest way to check this: actually reverse the number (using the same digit-peeling technique as Reverse a Number), then just compare the reversed value to the original. If they're equal, it's a palindrome.",
    approach: [
      "Save the original number separately (you'll need it for the final comparison).",
      "Reverse the number using the standard peel-and-rebuild technique: repeatedly take the last digit (% 10) and append it to a running result (result × 10 + digit), then divide by 10 to move to the next digit.",
      "Once the number reaches 0, compare the fully-built reversed result to the original.",
      "If they're equal, it's a palindrome; if not, it isn't.",
    ],
    dryRun: "12321 → reverse: peel 1→rev=1, peel 2→rev=12, peel 3→rev=123, peel 2→rev=1232, peel 1→rev=12321 → 12321 == 12321 → palindrome!",
    pitfalls: [
      "Negative numbers are never palindromes in the usual convention (the minus sign would need to appear on both ends, which is impossible) — handle that as an immediate 'false' rather than reversing a negative number.",
      "This approach reverses the WHOLE number before comparing — a common follow-up optimization only reverses HALF the digits and compares the two halves, stopping early without needing the full reversed value.",
      "Don't confuse this with checking if a number's digits are sorted or repeated — a palindrome check is specifically about forward/backward symmetry.",
    ],
  },
  codes: {
    js: `function isPalindrome(n) {
  if (n < 0) return false;
  const original = n;
  let rev = 0;
  while (n > 0) {
    const digit = n % 10;
    rev = rev * 10 + digit;
    n = Math.floor(n / 10);
  }
  return rev === original;
}`,
    py: `def is_palindrome(n):
    if n < 0:
        return False
    original = n
    rev = 0
    while n > 0:
        digit = n % 10
        rev = rev * 10 + digit
        n //= 10
    return rev == original`,
    cpp: `bool isPalindrome(int n) {
    if (n < 0) return false;
    int original = n;
    long rev = 0;
    while (n > 0) {
        int digit = n % 10;
        rev = rev * 10 + digit;
        n /= 10;
    }
    return rev == original;
}`,
  },
};
