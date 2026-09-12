import { clearStage, drawGrid, textEl, box, tag, arrow, svgEl, makeSnap, COLORS } from "../viz.js";

const W = 720, H = 360;
const BOX_W = 130, BOX_H = 46;
const BASE_Y = H - 60;
const CENTER_X = W / 2;

function drawStack(svg, arr, opts = {}) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  svg.appendChild(textEl(CENTER_X, H - 22, "Stack — Last In, First Out", { size: 13, fill: COLORS.inkFaint }));

  arr.forEach((val, i) => {
    const y = BASE_Y - (i + 1) * BOX_H;
    const isTop = i === arr.length - 1;
    const isHighlight = opts.highlight === i;
    const fill = isHighlight ? (opts.highlightColor || COLORS.blueFaint) : "#fff";
    const stroke = isHighlight ? (opts.highlightStroke || COLORS.blue) : COLORS.ink;
    svg.appendChild(box(CENTER_X - BOX_W / 2, y, BOX_W, BOX_H, { fill, stroke, strokeWidth: 2, label: val, fontSize: 17, dataRole: "stack-value" }));
    if (isTop && opts.showTop !== false) {
      svg.appendChild(tag(CENTER_X + BOX_W / 2 + 42, y + BOX_H / 2, "top", COLORS.amber));
      svg.appendChild(arrow(CENTER_X + BOX_W / 2 + 20, y + BOX_H / 2, CENTER_X + BOX_W / 2 + 4, y + BOX_H / 2, { color: COLORS.amber }));
    }
  });

  if (opts.ghost !== undefined) {
    const y = BASE_Y - (arr.length + (opts.ghostAt === "top" ? 1 : 0)) * BOX_H - (opts.ghostFloat || 0);
    svg.appendChild(box(CENTER_X - BOX_W / 2, y, BOX_W, BOX_H, {
      fill: opts.ghostColor === "red" ? COLORS.redFaint : COLORS.tealFaint,
      stroke: opts.ghostColor === "red" ? COLORS.red : COLORS.teal,
      label: opts.ghost, fontSize: 17,
    }));
  }

  svg.appendChild(svgEl("line", {
    x1: CENTER_X - BOX_W / 2 - 14, y1: BASE_Y, x2: CENTER_X + BOX_W / 2 + 14, y2: BASE_Y,
    stroke: COLORS.ink, "stroke-width": 3,
  }));
}

function buildSteps() {
  const stack = [];
  const ops = [
    { type: "push", val: 10 },
    { type: "push", val: 20 },
    { type: "push", val: 5 },
    { type: "peek" },
    { type: "pop" },
    { type: "push", val: 8 },
    { type: "pop" },
    { type: "isEmpty" },
  ];
  const steps = [];
  const snap = makeSnap(steps, () => stack.slice(), (svg, snapshot, extra) => drawStack(svg, snapshot, extra));

  snap("An empty stack. We add and remove from the top only.", { js: 1, py: 1, cpp: 1 }, {});

  for (const op of ops) {
    if (op.type === "push") {
      snap(`push(${op.val}): place ${op.val} on top of the stack.`, { js: 3, py: 3, cpp: 4 },
        { ghost: op.val, ghostAt: "top", ghostColor: "teal" });
      stack.push(op.val);
      snap(`Stack is now [${stack.join(", ")}], top = ${op.val}.`, { js: 3, py: 3, cpp: 4 }, { highlight: stack.length - 1 });
    } else if (op.type === "pop") {
      const top = stack[stack.length - 1];
      snap(`pop(): remove and return the top element (${top}).`, { js: 7, py: 6, cpp: 9 }, { highlight: stack.length - 1, highlightColor: COLORS.redFaint, highlightStroke: COLORS.red });
      stack.pop();
      snap(`Removed ${top}. Stack is now [${stack.join(", ") || "empty"}].`, { js: 7, py: 6, cpp: 9 }, {});
    } else if (op.type === "peek") {
      const top = stack[stack.length - 1];
      snap(`peek(): look at the top element without removing it — it's ${top}.`, { js: 11, py: 9, cpp: 14 }, { highlight: stack.length - 1 });
    } else if (op.type === "isEmpty") {
      snap(`isEmpty(): stack has ${stack.length} item(s), so isEmpty() is ${stack.length === 0}.`, { js: 15, py: 12, cpp: 18 }, {});
    }
  }
  return steps;
}

export default {
  id: "stack",
  title: "Stack (Push / Pop)",
  category: "Stacks & Queues",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["LIFO", "Linear Data Structure"],
  blurb: "A Last-In-First-Out structure: the most recently added item is the first one removed.",
  complexity: "Push/Pop/Peek: O(1) · Space: O(n)",
  defaultInput: [],
  buildSteps,
  notes: {
    intuition:
      "Picture a stack of plates. You always add a new plate to the top, and you always take the top plate off first — you can't reach into the middle. That's exactly a stack data structure: Last In, First Out (LIFO).",
    approach: [
      "push(value): add the new value to the top of the stack.",
      "pop(): remove and return whatever is currently on top.",
      "peek()/top(): look at the top value without removing it.",
      "isEmpty(): check whether there's anything left to pop.",
    ],
    dryRun: "push(10)→[10] · push(20)→[10,20] · push(5)→[10,20,5] · pop()→removes 5, returns 5 → [10,20]",
    pitfalls: [
      "Calling pop() or peek() on an empty stack is a classic bug — always check isEmpty() first, or handle the resulting error/undefined explicitly.",
      "Stacks are the backbone of real systems: function call stacks (recursion), undo/redo history, balanced-parentheses checking, and browser back-button history all use this exact LIFO pattern.",
      "In JavaScript, `array.push()`/`array.pop()` at the end of an array are both O(1) — that's why arrays make a fine stack implementation. Using the front of an array (`shift`/`unshift`) would be O(n) instead.",
    ],
  },
  codes: {
    js: `class Stack {
  constructor() { this.items = []; }

  push(value) {
    this.items.push(value);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}`,
    py: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, value):
        self.items.append(value)

    def pop(self):
        return self.items.pop()

    def peek(self):
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0`,
    cpp: `class Stack {
    vector<int> items;
public:
    void push(int value) {
        items.push_back(value);
    }

    int pop() {
        int top = items.back();
        items.pop_back();
        return top;
    }

    int peek() {
        return items.back();
    }

    bool isEmpty() {
        return items.empty();
    }
};`,
  },
};
