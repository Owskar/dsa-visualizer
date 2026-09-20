import { clearStage, drawGrid, textEl, box, tag, arrow, makeSnap, COLORS } from "../viz.js";

const W = 720, H = 340;
const BOX_W = 90, BOX_H = 60, GAP = 10;

function drawQueue(svg, arr, opts = {}) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  const totalW = arr.length * BOX_W + Math.max(0, arr.length - 1) * GAP;
  const startX = (W - totalW) / 2;
  const y = H / 2 - BOX_H / 2;

  svg.appendChild(textEl(W / 2, H - 24, "Queue — First In, First Out", { size: 13, fill: COLORS.inkFaint }));

  arr.forEach((val, i) => {
    const x = startX + i * (BOX_W + GAP);
    const isHighlight = opts.highlight === i;
    const fill = isHighlight ? (opts.highlightColor || COLORS.blueFaint) : COLORS.paperRaised;
    const stroke = isHighlight ? (opts.highlightStroke || COLORS.blue) : COLORS.ink;
    svg.appendChild(box(x, y, BOX_W, BOX_H, { fill, stroke, strokeWidth: 2, label: val, fontSize: 17, dataRole: "queue-value" }));
    if (i === 0) svg.appendChild(tag(x + BOX_W / 2, y - 24, "front", COLORS.amber));
    if (i === arr.length - 1) svg.appendChild(tag(x + BOX_W / 2, y + BOX_H + 24, "rear", COLORS.blue));
  });

  if (opts.ghost !== undefined) {
    const x = opts.ghostAt === "front"
      ? startX - BOX_W - GAP
      : startX + arr.length * (BOX_W + GAP);
    svg.appendChild(box(x, y, BOX_W, BOX_H, {
      fill: opts.ghostColor === "red" ? COLORS.redFaint : COLORS.tealFaint,
      stroke: opts.ghostColor === "red" ? COLORS.red : COLORS.teal,
      label: opts.ghost, fontSize: 17,
    }));
    svg.appendChild(arrow(
      opts.ghostAt === "front" ? x + BOX_W + 6 : x - 6, y + BOX_H / 2,
      opts.ghostAt === "front" ? startX - 6 : x - BOX_W - GAP + BOX_W + 6, y + BOX_H / 2,
      { dashed: true, color: COLORS.inkFaint }
    ));
  }
}

function buildSteps() {
  const queue = [];
  const ops = [
    { type: "enqueue", val: "A" },
    { type: "enqueue", val: "B" },
    { type: "enqueue", val: "C" },
    { type: "peek" },
    { type: "dequeue" },
    { type: "enqueue", val: "D" },
    { type: "dequeue" },
  ];
  const steps = [];
  const snap = makeSnap(steps, () => queue.slice(), (svg, snapshot, extra) => drawQueue(svg, snapshot, extra));

  snap("An empty queue. We add at the rear and remove from the front.", { js: 1, py: 1, cpp: 1 }, {});

  for (const op of ops) {
    if (op.type === "enqueue") {
      snap(`enqueue(${op.val}): add ${op.val} to the rear of the queue.`, { js: 3, py: 3, cpp: 4 },
        { ghost: op.val, ghostAt: "rear", ghostColor: "teal" });
      queue.push(op.val);
      snap(`Queue is now [${queue.join(", ")}].`, { js: 3, py: 3, cpp: 4 }, { highlight: queue.length - 1 });
    } else if (op.type === "dequeue") {
      const front = queue[0];
      snap(`dequeue(): remove and return the front element (${front}).`, { js: 7, py: 6, cpp: 9 }, { highlight: 0, highlightColor: COLORS.redFaint, highlightStroke: COLORS.red });
      queue.shift();
      snap(`Removed ${front}. Queue is now [${queue.join(", ") || "empty"}].`, { js: 7, py: 6, cpp: 9 }, {});
    } else if (op.type === "peek") {
      snap(`peek(): the front element is ${queue[0]}, without removing it.`, { js: 11, py: 9, cpp: 14 }, { highlight: 0 });
    }
  }
  return steps;
}

export default {
  id: "queue",
  title: "Queue (Enqueue / Dequeue)",
  category: "Stacks & Queues",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["FIFO", "Linear Data Structure"],
  blurb: "A First-In-First-Out structure: items leave in the same order they arrived.",
  complexity: "Enqueue/Dequeue/Peek: O(1) · Space: O(n)",
  defaultInput: [],
  sheetNum: 224,
  buildSteps,
  notes: {
    intuition:
      "Think of a queue at a ticket counter: whoever joins first gets served first. New people join at the back (rear), and the person at the front leaves once served. That's First-In-First-Out (FIFO) — the opposite ordering from a stack.",
    approach: [
      "enqueue(value): add the new value to the rear of the queue.",
      "dequeue(): remove and return whatever is currently at the front.",
      "peek()/front(): look at the front value without removing it.",
      "isEmpty(): check whether there's anyone left in line.",
    ],
    dryRun: "enqueue(A)→[A] · enqueue(B)→[A,B] · enqueue(C)→[A,B,C] · dequeue()→removes A, returns A → [B,C]",
    pitfalls: [
      "Using a plain JS array with `shift()` for dequeue is O(n) because every remaining element has to shift left — for high-throughput queues, use a proper deque (e.g. `collections.deque` in Python) or a circular buffer.",
      "Queues power real systems: task scheduling, printer job queues, BFS traversal, and request buffering in servers all rely on strict FIFO ordering.",
      "Don't confuse a queue with a priority queue — a plain queue always serves strictly in arrival order, regardless of any 'importance' of the items.",
    ],
  },
  codes: {
    js: `class Queue {
  constructor() { this.items = []; }

  enqueue(value) {
    this.items.push(value);
  }

  dequeue() {
    return this.items.shift();
  }

  peek() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }
}`,
    py: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, value):
        self.items.append(value)

    def dequeue(self):
        return self.items.popleft()

    def peek(self):
        return self.items[0]

    def is_empty(self):
        return len(self.items) == 0`,
    cpp: `class Queue {
    deque<string> items;
public:
    void enqueue(string value) {
        items.push_back(value);
    }

    string dequeue() {
        string front = items.front();
        items.pop_front();
        return front;
    }

    string peek() {
        return items.front();
    }

    bool isEmpty() {
        return items.empty();
    }
};`,
  },
};
