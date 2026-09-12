import { clearStage, drawGrid, textEl, box, circle, arrow, tag, makeSnap, COLORS } from "../viz.js";

const W = 760, H = 320;
const NODE_W = 90, NODE_H = 56, GAP = 56;

function drawList(svg, arr, opts = {}) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  const y = H / 2 - NODE_H / 2;
  const totalW = arr.length * NODE_W + Math.max(0, arr.length - 1) * GAP + (arr.length ? 90 : 0);
  let startX = Math.max(30, (W - totalW) / 2);

  svg.appendChild(textEl(70, 30, "head", { size: 13, weight: 700, fill: COLORS.amber }));
  if (arr.length) {
    svg.appendChild(arrow(70, 40, startX + NODE_W / 2, y - 12, { color: COLORS.amber, shorten: 2 }));
  }

  arr.forEach((val, i) => {
    const x = startX + i * (NODE_W + GAP);
    const isHighlight = opts.highlight === i;
    const fill = isHighlight ? (opts.highlightColor || COLORS.blueFaint) : "#fff";
    const stroke = isHighlight ? (opts.highlightStroke || COLORS.blue) : COLORS.ink;
    svg.appendChild(box(x, y, NODE_W * 0.62, NODE_H, { fill, stroke, strokeWidth: 2, label: val, fontSize: 16, dataRole: "list-value" }));
    svg.appendChild(box(x + NODE_W * 0.62, y, NODE_W * 0.38, NODE_H, { fill: "#fff", stroke, strokeWidth: 2 }));
    svg.appendChild(circle(x + NODE_W * 0.62 + NODE_W * 0.19, y + NODE_H / 2, 4, { fill: COLORS.ink, stroke: COLORS.ink }));

    if (i < arr.length - 1) {
      svg.appendChild(arrow(x + NODE_W, y + NODE_H / 2, x + NODE_W + GAP, y + NODE_H / 2, { color: COLORS.ink }));
    } else {
      svg.appendChild(textEl(x + NODE_W + 34, y + NODE_H / 2, "NULL", { mono: true, size: 13, fill: COLORS.inkFaint }));
      svg.appendChild(arrow(x + NODE_W, y + NODE_H / 2, x + NODE_W + 24, y + NODE_H / 2, { color: COLORS.inkFaint }));
    }
    if (opts.pointerLabel !== undefined && opts.pointerLabel.index === i) {
      svg.appendChild(tag(x + NODE_W * 0.31, y + NODE_H + 26, opts.pointerLabel.text, COLORS.teal));
    }
  });

  if (arr.length === 0) {
    svg.appendChild(textEl(W / 2, H / 2, "head → NULL (empty list)", { mono: true, size: 15, fill: COLORS.inkFaint }));
  }

  if (opts.ghost !== undefined) {
    const gx = opts.ghostAt === "head" ? startX - GAP - NODE_W : startX + arr.length * (NODE_W + GAP);
    svg.appendChild(box(gx, y, NODE_W * 0.62, NODE_H, {
      fill: opts.ghostColor === "red" ? COLORS.redFaint : COLORS.tealFaint,
      stroke: opts.ghostColor === "red" ? COLORS.red : COLORS.teal,
      label: opts.ghost, fontSize: 16,
    }));
  }
}

function buildSteps() {
  let list = [];
  const steps = [];
  const snap = makeSnap(steps, () => list.slice(), (svg, snapshot, extra) => drawList(svg, snapshot, extra));

  snap("An empty linked list — just head, pointing to NULL.", { js: 1, py: 1, cpp: 1 }, {});

  snap("insertAtHead(10): create a new node holding 10.", { js: 8, py: 6, cpp: 10 }, { ghost: 10, ghostAt: "head", ghostColor: "teal" });
  list = [10, ...list];
  snap("Point its 'next' to the old head, then make it the new head.", { js: 10, py: 8, cpp: 12 }, { highlight: 0 });

  snap("insertAtTail(20): walk to the last node.", { js: 16, py: 13, cpp: 20 }, { pointerLabel: { index: 0, text: "cur" } });
  snap("Create a new node with 20 and link the last node's 'next' to it.", { js: 20, py: 16, cpp: 24 }, { ghost: 20, ghostAt: "tail", ghostColor: "teal" });
  list = [...list, 20];
  snap("List is now 10 → 20 → NULL.", { js: 20, py: 16, cpp: 24 }, { highlight: 1 });

  snap("insertAtTail(30): walk to the last node again.", { js: 16, py: 13, cpp: 20 }, { pointerLabel: { index: 1, text: "cur" } });
  list = [...list, 30];
  snap("List is now 10 → 20 → 30 → NULL.", { js: 20, py: 16, cpp: 24 }, { highlight: 2 });

  snap("delete(20): traverse while tracking the previous node.", { js: 27, py: 21, cpp: 31 }, { pointerLabel: { index: 0, text: "prev" }, highlight: 1, highlightColor: COLORS.redFaint, highlightStroke: COLORS.red });
  snap("Found 20 — reroute the previous node's 'next' to skip over it.", { js: 31, py: 25, cpp: 34 }, { highlight: 1, highlightColor: COLORS.redFaint, highlightStroke: COLORS.red });
  list = list.filter((v) => v !== 20);
  snap("List is now 10 → 30 → NULL. Node 20 is unreachable and gets garbage collected.", { js: 31, py: 25, cpp: 34 }, {});

  return steps;
}

export default {
  id: "linked-list",
  title: "Singly Linked List",
  category: "Linked Lists",
  level: "Beginner",
  difficulty: "Medium",
  tags: ["Pointers", "Dynamic Structure"],
  blurb: "A chain of nodes where each node points to the next — insertion and deletion don't require shifting elements.",
  complexity: "Insert at head: O(1) · Insert at tail / Delete: O(n) · Space: O(n)",
  defaultInput: [],
  buildSteps,
  notes: {
    intuition:
      "Instead of storing elements in one contiguous block of memory (like an array), a linked list scatters nodes anywhere in memory and connects them with pointers. Each node only knows about the next one. That's why inserting or deleting in the middle doesn't require shifting every other element — you just re-point a couple of arrows.",
    approach: [
      "Each Node stores a value and a pointer (`next`) to the following node (or null if it's the last one).",
      "The list itself just keeps a reference to the `head` — the first node.",
      "Insert at head: point the new node's `next` at the old head, then make the new node the head. O(1).",
      "Insert at tail: walk from head until you hit the last node (`next === null`), then attach the new node there. O(n) unless you also keep a `tail` pointer.",
      "Delete a value: walk the list keeping a `prev` pointer one step behind `cur`; when `cur` matches, re-point `prev.next` to `cur.next`, skipping the deleted node.",
    ],
    dryRun: "insertAtHead(10) → 10→NULL · insertAtTail(20) → 10→20→NULL · insertAtTail(30) → 10→20→30→NULL · delete(20) → 10→30→NULL",
    pitfalls: [
      "Forgetting to handle the empty-list case (`head === null`) before inserting/deleting is the most common linked-list bug.",
      "When deleting the head itself, you don't have a `prev` node — handle it as a special case (`head = head.next`) before the general traversal loop.",
      "Unlike arrays, linked lists have no O(1) random access — to get the 5th element you must walk from the head, one `next` at a time.",
      "Losing a reference to a node before re-pointing (e.g. overwriting `cur.next` before saving it) orphans the rest of the list — always save what you need before mutating pointers.",
    ],
  },
  codes: {
    js: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() { this.head = null; }

  insertAtHead(value) {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
  }

  insertAtTail(value) {
    const node = new Node(value);
    if (!this.head) { this.head = node; return; }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = node;
  }

  delete(value) {
    if (!this.head) return;
    if (this.head.value === value) { this.head = this.head.next; return; }
    let prev = this.head, cur = this.head.next;
    while (cur) {
      if (cur.value === value) { prev.next = cur.next; return; }
      prev = cur; cur = cur.next;
    }
  }
}`,
    py: `class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, value):
        node = Node(value)
        node.next = self.head
        self.head = node

    def insert_at_tail(self, value):
        node = Node(value)
        if not self.head:
            self.head = node
            return
        cur = self.head
        while cur.next:
            cur = cur.next
        cur.next = node

    def delete(self, value):
        if not self.head:
            return
        if self.head.value == value:
            self.head = self.head.next
            return
        prev, cur = self.head, self.head.next
        while cur:
            if cur.value == value:
                prev.next = cur.next
                return
            prev, cur = cur, cur.next`,
    cpp: `struct Node {
    int value;
    Node* next;
    Node(int v) : value(v), next(nullptr) {}
};

class LinkedList {
    Node* head = nullptr;
public:
    void insertAtHead(int value) {
        Node* node = new Node(value);
        node->next = head;
        head = node;
    }

    void insertAtTail(int value) {
        Node* node = new Node(value);
        if (!head) { head = node; return; }
        Node* cur = head;
        while (cur->next) cur = cur->next;
        cur->next = node;
    }

    void remove(int value) {
        if (!head) return;
        if (head->value == value) { head = head->next; return; }
        Node* prev = head;
        Node* cur = head->next;
        while (cur) {
            if (cur->value == value) { prev->next = cur->next; return; }
            prev = cur; cur = cur->next;
        }
    }
};`,
  },
};
