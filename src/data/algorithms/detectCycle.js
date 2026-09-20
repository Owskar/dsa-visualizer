import { clearStage, drawGrid, textEl, box, circle, arrow, tag, svgEl, makeSnap, COLORS } from "../viz.js";

const W = 760, H = 320;
const NODE_W = 90, NODE_H = 56, GAP = 60;

// Fixed demo list: 3 -> 2 -> 0 -> -4 -> (back to index 1, value 2) — a cycle.
const VALUES = [3, 2, 0, -4];
const NEXT = [1, 2, 3, 1]; // index 3's next points back to index 1 (the cycle)

function slotX(i, startX) { return startX + i * (NODE_W + GAP); }

function drawCycleList(svg, opts = {}) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  const y = H / 2 - NODE_H / 2;
  const totalW = VALUES.length * NODE_W + (VALUES.length - 1) * GAP;
  const startX = Math.max(30, (W - totalW) / 2);

  VALUES.forEach((val, i) => {
    const x = slotX(i, startX);
    let fill = COLORS.paperRaised, stroke = COLORS.ink;
    if (opts.meet === i) { fill = COLORS.redFaint; stroke = COLORS.red; }
    svg.appendChild(box(x, y, NODE_W * 0.7, NODE_H, { fill, stroke, strokeWidth: 2, label: val, fontSize: 16, dataRole: "list-value" }));

    const labels = [];
    if (opts.slow === i) labels.push(["slow", COLORS.blue]);
    if (opts.fast === i) labels.push(["fast", COLORS.amber]);
    labels.forEach(([text, color], k) => {
      svg.appendChild(tag(x + NODE_W * 0.35, y - 24 - k * 26, text, color));
    });
  });

  // arrows for each node's `next`
  VALUES.forEach((_, i) => {
    const to = NEXT[i];
    const fx = slotX(i, startX) + NODE_W * 0.7;
    const fy = y + NODE_H / 2;
    if (to === i + 1) {
      svg.appendChild(arrow(fx, fy, slotX(to, startX), fy, { color: COLORS.ink }));
    } else {
      // the back-edge that creates the cycle — draw as an arc below the row
      const tx = slotX(to, startX) + NODE_W * 0.35;
      const ty = y + NODE_H + 8;
      const midX = (fx + tx) / 2;
      const arcY = y + NODE_H + 60;
      svg.appendChild(svgEl("path", { d: `M ${fx} ${fy + 10} Q ${midX} ${arcY} ${tx} ${ty}`, fill: "none", stroke: COLORS.red, "stroke-width": 2 }));
      const angle = Math.atan2(ty - arcY, tx - midX);
      const size = 7;
      const p1x = tx - size * Math.cos(angle - Math.PI / 7), p1y = ty - size * Math.sin(angle - Math.PI / 7);
      const p2x = tx - size * Math.cos(angle + Math.PI / 7), p2y = ty - size * Math.sin(angle + Math.PI / 7);
      svg.appendChild(svgEl("polygon", { points: `${tx},${ty} ${p1x},${p1y} ${p2x},${p2y}`, fill: COLORS.red }));
    }
  });

  if (opts.caption) {
    svg.appendChild(textEl(W / 2, 28, opts.caption, { mono: true, size: 13, weight: 700, fill: COLORS.teal }));
  }
}

function buildSteps() {
  const steps = [];
  const snap = makeSnap(steps, () => ({}), (svg, _snap, extra) => drawCycleList(svg, extra));

  snap("A linked list where the last node points back into the middle, forming a cycle. Two pointers — slow (1 step) and fast (2 steps) — will detect it.",
    { js: 2, py: 2, cpp: 2 }, { slow: 0, fast: 0 });

  let slow = 0, fast = 0;
  let iter = 0;
  while (true) {
    slow = NEXT[slow];
    fast = NEXT[NEXT[fast]];
    iter++;
    snap(`Move slow one step (to value ${VALUES[slow]}) and fast two steps (to value ${VALUES[fast]}).`,
      { js: 6, py: 4, cpp: 6 }, { slow, fast });
    if (slow === fast) {
      snap(`slow and fast are both at value ${VALUES[slow]} — they met, so a cycle exists!`,
        { js: 7, py: 5, cpp: 7 }, { slow, fast, meet: slow });
      break;
    }
    if (iter > VALUES.length + 2) break; // safety guard, shouldn't trigger on this fixed demo
  }

  // Phase 2: find the cycle's starting node
  let p1 = 0, p2 = slow;
  snap("To find WHERE the cycle begins: reset one pointer to the head, keep the other at the meeting point, then move both one step at a time.",
    { js: 12, py: 9, cpp: 13 }, { slow: p1, fast: p2, meet: slow });
  while (p1 !== p2) {
    p1 = NEXT[p1];
    p2 = NEXT[p2];
    snap(`Move both one step: head-pointer now at ${VALUES[p1]}, other pointer now at ${VALUES[p2]}.`,
      { js: 14, py: 11, cpp: 15 }, { slow: p1, fast: p2, meet: slow });
  }
  snap(`They met at value ${VALUES[p1]} — that's the start of the cycle.`, { js: 16, py: 13, cpp: 17 },
    { meet: p1, caption: `Cycle starts at value ${VALUES[p1]}` });

  return steps;
}

export default {
  id: "detect-cycle-linked-list",
  title: "Detect Cycle in a Linked List",
  category: "Linked Lists",
  level: "Intermediate",
  difficulty: "Medium",
  tags: ["Two Pointers", "Floyd's Algorithm"],
  blurb: "Use a slow and a fast pointer — if the list has a cycle, they're guaranteed to meet inside it.",
  complexity: "Time: O(n) · Space: O(1)",
  defaultInput: null,
  sheetNum: [161, 162],
  buildSteps,
  notes: {
    intuition:
      "Imagine two runners on a circular track, one twice as fast as the other. If the track is a loop, the faster runner will eventually lap the slower one — they must meet. If the track is a straight line with an end (no loop), the faster runner just reaches the end first and there's no meeting. That's exactly Floyd's cycle detection: a `slow` pointer moves one node at a time, `fast` moves two — if they ever point to the same node, there's a cycle.",
    approach: [
      "Start both `slow` and `fast` at the head.",
      "In a loop: move `slow` forward one node, move `fast` forward two nodes.",
      "If `fast` (or `fast.next`) hits null, there's no cycle — the list ends normally.",
      "If at any point `slow === fast` (the same node), a cycle exists.",
      "Bonus — finding WHERE the cycle starts: reset one pointer to the head, leave the other at the meeting point, then advance both one step at a time. They provably meet again exactly at the cycle's starting node.",
    ],
    dryRun: "3→2→0→-4→(back to 2): slow,fast start at 3 → after 1 round: slow=2, fast=0 → after 2 rounds: slow=0, fast=2 → after 3: slow=-4, fast=-4 → met! Cycle confirmed, and the reset-pointer trick finds it starts at value 2.",
    pitfalls: [
      "Always check for null carefully before advancing `fast` two steps (`fast.next` AND `fast.next.next` both need to exist) — otherwise you get a null-pointer crash on lists that don't have a cycle.",
      "The 'meeting point ⇒ cycle exists' part is intuitive, but the phase-2 trick (reset one pointer to head to find the cycle's START) is the part people memorize without understanding — it's provable with the math of where the pointers are relative to the cycle length, but it's fine to just trust and remember it.",
      "This same 'slow/fast pointer' pattern also finds the middle of a list in one pass (when fast hits the end, slow is at the midpoint) — it's a versatile trick beyond just cycle detection.",
    ],
  },
  codes: {
    js: `function hasCycle(head) {
  let slow = head, fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

function detectCycleStart(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let p1 = head, p2 = slow;
      while (p1 !== p2) { p1 = p1.next; p2 = p2.next; }
      return p1; // the node where the cycle begins
    }
  }
  return null; // no cycle
}`,
    py: `def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

def detect_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            p1, p2 = head, slow
            while p1 != p2:
                p1 = p1.next
                p2 = p2.next
            return p1  # node where the cycle begins
    return None`,
    cpp: `bool hasCycle(Node* head) {
    Node* slow = head; Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) return true;
    }
    return false;
}

Node* detectCycleStart(Node* head) {
    Node* slow = head; Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next->next;
        if (slow == fast) {
            Node* p1 = head; Node* p2 = slow;
            while (p1 != p2) { p1 = p1->next; p2 = p2->next; }
            return p1;
        }
    }
    return nullptr;
}`,
  },
};
