import { clearStage, drawGrid, textEl, box, circle, arrow, tag, svgEl, makeSnap, COLORS } from "../viz.js";

const W = 760, H = 320;
const NODE_W = 90, NODE_H = 56, GAP = 56;

// Draws nodes in FIXED left-to-right slots (the list's original order), but
// each node's arrow can point either direction — that's how we show the
// list "flipping" its pointers without physically moving any boxes.
function drawReversal(svg, values, opts = {}) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  const y = H / 2 - NODE_H / 2;
  const totalW = values.length * NODE_W + Math.max(0, values.length - 1) * GAP;
  const startX = Math.max(30, (W - totalW) / 2);
  const slotX = (i) => startX + i * (NODE_W + GAP);
  const labelColor = { prev: COLORS.teal, curr: COLORS.blue, next: COLORS.amber };

  values.forEach((val, i) => {
    const x = slotX(i);
    const isHighlight = opts.highlight === i;
    const fill = isHighlight ? COLORS.blueFaint : "#fff";
    const stroke = isHighlight ? COLORS.blue : COLORS.ink;
    svg.appendChild(box(x, y, NODE_W * 0.62, NODE_H, { fill, stroke, strokeWidth: 2, label: val, fontSize: 16, dataRole: "list-value" }));
    svg.appendChild(box(x + NODE_W * 0.62, y, NODE_W * 0.38, NODE_H, { fill: "#fff", stroke, strokeWidth: 2 }));
    svg.appendChild(circle(x + NODE_W * 0.62 + NODE_W * 0.19, y + NODE_H / 2, 4, { fill: COLORS.ink, stroke: COLORS.ink }));

    if (opts.labels && opts.labels[i]) {
      svg.appendChild(tag(x + NODE_W * 0.31, y - 24, opts.labels[i], labelColor[opts.labels[i]] || COLORS.ink));
    }
  });

  // opts.arrows: one entry per node describing its CURRENT `next` pointer
  (opts.arrows || []).forEach(({ from, to }) => {
    const fx = slotX(from) + NODE_W;
    const fy = y + NODE_H / 2;
    if (to === null) {
      svg.appendChild(textEl(fx + 30, fy, "NULL", { mono: true, size: 12, fill: COLORS.inkFaint }));
      svg.appendChild(arrow(fx, fy, fx + 22, fy, { color: COLORS.inkFaint }));
      return;
    }
    if (to === from + 1) {
      svg.appendChild(arrow(fx, fy, slotX(to), fy, { color: COLORS.ink }));
      return;
    }
    // reversed / non-adjacent pointer — draw a curved arc above the row
    const tx = slotX(to) + NODE_W / 2;
    const ty = y - 8;
    const midX = (fx + tx) / 2;
    const arcY = y - 34 - Math.abs(to - from) * 6;
    const path = svgEl("path", {
      d: `M ${fx} ${fy} Q ${midX} ${arcY} ${tx} ${ty}`,
      fill: "none", stroke: COLORS.blue, "stroke-width": 2,
    });
    svg.appendChild(path);
    const angle = Math.atan2(ty - arcY, tx - midX);
    const size = 7;
    const p1x = tx - size * Math.cos(angle - Math.PI / 7);
    const p1y = ty - size * Math.sin(angle - Math.PI / 7);
    const p2x = tx - size * Math.cos(angle + Math.PI / 7);
    const p2y = ty - size * Math.sin(angle + Math.PI / 7);
    svg.appendChild(svgEl("polygon", { points: `${tx},${ty} ${p1x},${p1y} ${p2x},${p2y}`, fill: COLORS.blue }));
  });

  if (opts.headLabel !== undefined) {
    svg.appendChild(textEl(slotX(opts.headLabel) + NODE_W * 0.31, y - 46, "head", { size: 12, weight: 700, fill: COLORS.amber }));
  }
}

function labelsFor(prev, curr, next) {
  const labels = {};
  if (prev !== null) labels[prev] = "prev";
  if (curr !== null && curr !== undefined) labels[curr] = "curr";
  if (next !== null && next !== undefined) labels[next] = "next";
  return labels;
}

function reconstructOrder(values, next, headIdx) {
  const order = [];
  let i = headIdx;
  const guard = new Set();
  while (i !== null && !guard.has(i)) {
    order.push(values[i]);
    guard.add(i);
    i = next[i];
  }
  return order;
}

function buildSteps(values) {
  const n = values.length;
  const steps = [];
  // next[i] = index this node's pointer currently targets, or null for NULL
  let next = values.map((_, i) => (i + 1 < n ? i + 1 : null));
  let headIdx = 0;

  const record = makeSnap(
    steps,
    () => ({ next: next.slice(), headIdx }),
    (svg, snap, extra) => drawReversal(svg, values, { ...extra, arrows: snap.next.map((to, from) => ({ from, to })), headLabel: snap.headIdx })
  );

  record("A singly linked list. We'll reverse every 'next' pointer so the list points the other way.", { js: 1, py: 1, cpp: 1 }, {});

  let prev = null, curr = headIdx;
  while (curr !== null) {
    const nxt = next[curr];
    record(`At node ${values[curr]}: save its current next (${nxt === null ? "NULL" : values[nxt]}) before we overwrite it.`,
      { js: 4, py: 3, cpp: 5 }, { highlight: curr, labels: labelsFor(prev, curr, nxt) });

    next[curr] = prev;
    record(`Point node ${values[curr]}'s next backward, to ${prev === null ? "NULL" : values[prev]}.`,
      { js: 5, py: 4, cpp: 6 }, { highlight: curr, labels: labelsFor(prev, curr, nxt) });

    prev = curr;
    curr = nxt;
    headIdx = prev;
    record(`Advance: prev = ${values[prev]}, curr = ${curr === null ? "NULL" : values[curr]}.`,
      { js: 8, py: 6, cpp: 9 }, { highlight: curr === null ? undefined : curr, labels: labelsFor(prev, curr, curr === null ? null : next[curr]), headLabel: headIdx });
  }

  record(`Done — prev is now the new head. The list reads: ${reconstructOrder(values, next, headIdx).join(" → ")} → NULL.`,
    { js: 10, py: 7, cpp: 11 }, { headLabel: headIdx });
  return steps;
}

export default {
  id: "reverse-linked-list",
  title: "Reverse a Linked List",
  category: "Linked Lists",
  level: "Beginner",
  difficulty: "Easy",
  tags: ["Pointers", "Iterative"],
  blurb: "Flip every node's `next` pointer so the list points the other way — done in a single pass with three pointers.",
  complexity: "Time: O(n) · Space: O(1) iterative (O(n) if done recursively, due to call stack)",
  defaultInput: [10, 20, 30, 40],
  buildSteps,
  notes: {
    intuition:
      "You can't just 'read the list backward' — each node only knows about the node AFTER it, never before. So reversing means physically rewriting every node's `next` pointer to point at the node that used to come before it. Three pointers do the job: `prev` (already-reversed part), `curr` (node being flipped right now), and a saved `next` (so you don't lose the rest of the list once you overwrite `curr`'s pointer).",
    approach: [
      "Start with `prev = null` and `curr = head`.",
      "Before changing anything, save `curr.next` into a temporary variable — otherwise you'd lose access to the rest of the list.",
      "Point `curr.next` backward, at `prev`.",
      "Move both pointers forward one step: `prev = curr`, then `curr = ` the saved next.",
      "Repeat until `curr` is null — at that point `prev` is the new head of the reversed list.",
    ],
    dryRun: "10→20→30→40→NULL: flip 10 (NULL←10) → flip 20 (10←20) → flip 30 (20←30) → flip 40 (30←40) → new list: 40→30→20→10→NULL",
    pitfalls: [
      "The single most common bug: overwriting `curr.next` before saving it, which permanently disconnects the rest of the list — always save `next` first.",
      "Forgetting to update `head` to the new head (the old tail) after the loop — the caller needs the new starting point.",
      "A recursive version is elegant but uses O(n) call-stack space, unlike the iterative version's O(1) — know both, since interviewers often ask for the iterative one specifically for that reason.",
    ],
  },
  codes: {
    js: `function reverseList(head) {
  let prev = null;
  let curr = head;

  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev; // new head
}`,
    py: `def reverse_list(head):
    prev = None
    curr = head
    while curr is not None:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev  # new head`,
    cpp: `Node* reverseList(Node* head) {
    Node* prev = nullptr;
    Node* curr = head;
    while (curr != nullptr) {
        Node* next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    return prev; // new head
}`,
  },
};
