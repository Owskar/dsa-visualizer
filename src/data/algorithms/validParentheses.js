import { clearStage, drawGrid, textEl, box, tag, svgEl, arrow, makeSnap, COLORS } from "../viz.js";
import { stringOnlyConfig } from "../inputConfigHelpers.js";

const W = 760, H = 340;
const BOX = 44, GAP = 6;
const STACK_BOX_W = 60, STACK_BOX_H = 40;

function draw(svg, { chars, i, stackVals, status }) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);

  // input string row along the top
  const totalW = chars.length * BOX + Math.max(0, chars.length - 1) * GAP;
  const startX = Math.max(20, (W - totalW) / 2);
  const rowY = 50;
  chars.forEach((ch, idx) => {
    const x = startX + idx * (BOX + GAP);
    let fill = COLORS.paperRaised, stroke = COLORS.ink;
    if (idx === i) { fill = status === "bad" ? COLORS.redFaint : COLORS.blueFaint; stroke = status === "bad" ? COLORS.red : COLORS.blue; }
    else if (idx < i) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    svg.appendChild(box(x, rowY, BOX, BOX, { fill, stroke, strokeWidth: 2, label: ch, fontSize: 18, dataRole: "char-value" }));
  });

  // stack, growing upward, drawn lower on the stage
  const baseY = H - 40;
  const stackX = W / 2;
  stackVals.forEach((val, k) => {
    const y = baseY - (k + 1) * STACK_BOX_H;
    svg.appendChild(box(stackX - STACK_BOX_W / 2, y, STACK_BOX_W, STACK_BOX_H, { fill: COLORS.paperRaised, stroke: COLORS.ink, strokeWidth: 2, label: val, fontSize: 16, dataRole: "stack-value" }));
  });
  svg.appendChild(svgEl("line", { x1: stackX - STACK_BOX_W / 2 - 10, y1: baseY, x2: stackX + STACK_BOX_W / 2 + 10, y2: baseY, stroke: COLORS.ink, "stroke-width": 3 }));
  svg.appendChild(textEl(stackX, baseY + 18, "Stack", { size: 12, fill: COLORS.inkFaint }));
  if (stackVals.length) svg.appendChild(tag(stackX + STACK_BOX_W / 2 + 30, baseY - stackVals.length * STACK_BOX_H + STACK_BOX_H / 2, "top", COLORS.amber));
}

const PAIRS = { ")": "(", "]": "[", "}": "{" };
const OPENERS = new Set(["(", "[", "{"]);

function buildSteps(str) {
  const chars = str.split("");
  const steps = [];
  const stack = [];
  const snap = makeSnap(steps, () => ({ chars: chars.slice(), stackVals: stack.slice() }),
    (svg, snapshot, extra) => draw(svg, { ...snapshot, ...extra }));

  snap(`Check if "${str}" has correctly matched and nested brackets, using a stack.`, { js: 2, py: 2, cpp: 2 }, { i: -1 });

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (OPENERS.has(c)) {
      stack.push(c);
      snap(`'${c}' is an opening bracket — push it onto the stack.`, { js: 5, py: 4, cpp: 6 }, { i });
    } else {
      const top = stack[stack.length - 1];
      if (stack.length === 0 || top !== PAIRS[c]) {
        snap(`'${c}' needs a matching '${PAIRS[c]}' on top of the stack, but ${stack.length === 0 ? "the stack is empty" : `top is '${top}'`} — invalid!`,
          { js: 8, py: 6, cpp: 9 }, { i, status: "bad" });
        return steps;
      }
      stack.pop();
      snap(`'${c}' correctly closes '${top}' — pop it off the stack.`, { js: 9, py: 7, cpp: 10 }, { i });
    }
  }

  if (stack.length === 0) {
    snap(`Reached the end and the stack is empty — every bracket was matched. "${str}" is valid!`, { js: 12, py: 9, cpp: 13 }, { i: chars.length });
  } else {
    snap(`Reached the end but the stack still has [${stack.join(", ")}] left unmatched — invalid.`, { js: 12, py: 9, cpp: 13 }, { i: chars.length, status: "bad" });
  }
  return steps;
}

export default {
  id: "valid-parentheses",
  title: "Valid Parentheses",
  category: "Stacks & Queues",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Stack", "String"],
  blurb: "Check whether every bracket in a string is properly opened, closed, and nested — a textbook use of a stack.",
  complexity: "Time: O(n) · Space: O(n)",
  defaultInput: "{[()()]}",
  sheetNum: 229,
  inputConfig: (algo) => stringOnlyConfig(algo, "A string of ( ) [ ] { } brackets"),
  buildSteps,
  notes: {
    intuition:
      "Brackets need to close in the exact REVERSE order they were opened — the most recently opened bracket must be the next one closed. 'Most recent first' is exactly what a stack gives you for free: push every opening bracket, and when you hit a closing bracket, it must match whatever's currently on top of the stack.",
    approach: [
      "Walk through the string one character at a time.",
      "If it's an opening bracket ( ( [ { ), push it onto the stack.",
      "If it's a closing bracket, check the top of the stack: it must be the matching opening bracket. If the stack is empty, or the top doesn't match, the string is invalid immediately.",
      "If it matches, pop the stack and continue.",
      "After processing every character, the string is valid only if the stack ended up completely empty — a leftover unclosed bracket means invalid too.",
    ],
    dryRun: "\"{[()()]}\": push {, push [, push (, close ) pops (, push (, close ) pops (, close ] pops [, close } pops { → stack empty → valid",
    pitfalls: [
      "Don't forget the final check — a string like \"(()\" never hits an invalid MISMATCH while scanning, but ends with the stack non-empty (an unclosed bracket), which is still invalid.",
      "Checking `stack.length === 0` before peeking at the top is essential — popping or reading the top of an empty stack is a bug (or a crash, depending on the language).",
      "A hashmap from closing-bracket → matching-opening-bracket (as used here) is cleaner than a chain of if/else comparing each bracket type individually.",
    ],
  },
  codes: {
    js: `function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];

  for (const c of s) {
    if (c === "(" || c === "[" || c === "{") {
      stack.push(c);
    } else {
      if (stack.length === 0 || stack.pop() !== pairs[c]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
    py: `def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for c in s:
        if c in "([{":
            stack.append(c)
        else:
            if not stack or stack.pop() != pairs[c]:
                return False
    return len(stack) == 0`,
    cpp: `bool isValid(string s) {
    unordered_map<char, char> pairs = {{')', '('}, {']', '['}, {'}', '{'}};
    stack<char> st;
    for (char c : s) {
        if (c == '(' || c == '[' || c == '{') {
            st.push(c);
        } else {
            if (st.empty() || st.top() != pairs[c]) return false;
            st.pop();
        }
    }
    return st.empty();
}`,
  },
};
