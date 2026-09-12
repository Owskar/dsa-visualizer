import { clearStage, drawGrid, textEl, circle, arrow, COLORS } from "../viz.js";

const W = 760, H = 360;
const X_GAP = 64, Y_GAP = 78, TOP = 46;

function layout(root) {
  const pos = new Map();
  let counter = 0;
  (function inorder(node) {
    if (!node) return;
    inorder(node.left);
    pos.set(node, { xi: counter++ });
    inorder(node.right);
  })(root);
  const n = counter;
  const startX = W / 2 - ((n - 1) * X_GAP) / 2;
  (function assignY(node, depth) {
    if (!node) return;
    const p = pos.get(node);
    p.x = startX + p.xi * X_GAP;
    p.y = TOP + depth * Y_GAP;
    assignY(node.left, depth + 1);
    assignY(node.right, depth + 1);
  })(root, 0);
  return pos;
}

function cloneTree(node) {
  if (!node) return null;
  return { value: node.value, left: cloneTree(node.left), right: cloneTree(node.right) };
}

function drawTree(svg, root, opts = {}) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);
  if (!root) {
    svg.appendChild(textEl(W / 2, H / 2, "Empty tree", { mono: true, size: 15, fill: COLORS.inkFaint }));
    return;
  }
  const pos = layout(root);
  const highlightSet = opts.highlight || new Set();
  const visited = opts.visited || new Set();
  const currentValue = opts.current; // compared by value, not object identity — see note in buildSteps

  (function drawEdges(node) {
    if (!node) return;
    const p = pos.get(node);
    [node.left, node.right].forEach((child) => {
      if (child) {
        const cp = pos.get(child);
        svg.appendChild(arrow(p.x, p.y + 20, cp.x, cp.y - 20, { color: COLORS.ink, arrowHead: false }));
      }
    });
    drawEdges(node.left);
    drawEdges(node.right);
  })(root);

  (function drawNodes(node) {
    if (!node) return;
    const p = pos.get(node);
    let fill = "#fff", stroke = COLORS.ink;
    if (node.value === currentValue) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    else if (visited.has(node.value)) { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (highlightSet.has(node.value)) { fill = COLORS.amberFaint; stroke = COLORS.amber; }
    svg.appendChild(circle(p.x, p.y, 20, { fill, stroke, strokeWidth: 2.5, label: node.value, dataRole: "tree-node" }));
    drawNodes(node.left);
    drawNodes(node.right);
  })(root);

  if (opts.order && opts.order.length) {
    svg.appendChild(textEl(W / 2, H - 20, `Visited order: ${opts.order.join(" → ")}`, { mono: true, size: 13, fill: COLORS.teal, weight: 700 }));
  }
}

function insert(root, value, path) {
  if (!root) return { value, left: null, right: null };
  path.push(root.value);
  if (value < root.value) root.left = insert(root.left, value, path);
  else root.right = insert(root.right, value, path);
  return root;
}

function buildSteps(values) {
  let root = null;
  const steps = [];
  const snap = (desc, lines, extra) => {
    // The tree's nodes are mutated in place by insert() (node.left/node.right get
    // reassigned as later values are inserted), so a step recorded early must get
    // its own deep-cloned copy of the tree NOW — otherwise every step would end up
    // rendering the same, fully-built final tree once buildSteps() finishes running.
    const snapshot = cloneTree(root);
    steps.push({ desc, lines, draw: (svg) => drawTree(svg, snapshot, extra || {}) });
  };

  snap("An empty binary search tree.", { js: 1, py: 1, cpp: 1 }, {});

  for (const v of values) {
    const path = [];
    snap(`insert(${v}): start at the root and compare.`, { js: 8, py: 6, cpp: 9 }, { highlight: new Set(path) });
    root = insert(root, v, path);
    snap(`Placed ${v} as a new leaf, following the "smaller goes left, larger goes right" rule.`,
      { js: 8, py: 6, cpp: 9 }, { highlight: new Set([...path, v]) });
  }

  const order = [];
  const visited = new Set();
  (function collect(node) {
    if (!node) return;
    if (node.left) {
      snap(`Inorder traversal: from ${node.value}, go left first.`, { js: 14, py: 11, cpp: 15 }, { current: node.value, visited: new Set(visited), order: order.slice() });
    }
    collect(node.left);
    visited.add(node.value);
    order.push(node.value);
    snap(`Visit ${node.value} (its left subtree is done).`, { js: 15, py: 12, cpp: 16 }, { current: node.value, visited: new Set(visited), order: order.slice() });
    collect(node.right);
  })(root);

  snap(`Inorder traversal visits nodes in sorted order: ${order.join(", ")}.`,
    { js: 15, py: 12, cpp: 16 }, { visited: new Set(visited), order: order.slice() });

  return steps;
}

export default {
  id: "bst",
  title: "Binary Search Tree",
  category: "Trees",
  difficulty: "Medium",
  tags: ["Recursion", "Tree", "Ordering Invariant"],
  blurb: "Insert values so every left child is smaller and every right child is larger than its parent, then traverse in sorted order.",
  complexity: "Insert/Search (balanced): O(log n), (worst case): O(n)",
  defaultInput: [8, 3, 10, 1, 6, 14, 4, 7],
  buildSteps,
  notes: {
    intuition:
      "A BST keeps one simple invariant at every node: everything in its left subtree is smaller, everything in its right subtree is larger. That single rule is what makes search fast (like binary search, you throw away half the tree at each step) and what makes an inorder traversal magically visit values in sorted order.",
    approach: [
      "To insert a value: start at the root, compare with the current node's value.",
      "If the new value is smaller, recurse into the left child; if larger, recurse into the right child.",
      "When you reach a null spot, that's where the new node goes.",
      "To read values back in sorted order, do an inorder traversal: recurse left, visit the node, recurse right.",
    ],
    dryRun: "insert 8,3,10,1,6,14,4,7 → tree rooted at 8, left subtree {3,1,6,4,7}, right subtree {10,14} → inorder = 1,3,4,6,7,8,10,14 (sorted!)",
    pitfalls: [
      "A BST built from already-sorted input degenerates into a straight line (essentially a linked list), making every operation O(n) instead of O(log n) — this is why self-balancing trees (AVL, Red-Black) exist.",
      "Deletion is trickier than insertion: deleting a node with two children requires finding its inorder successor (smallest value in the right subtree) to replace it, then removing that successor node.",
      "Don't confuse a BST with a generic binary tree — a binary tree has no ordering rule at all, so you can't binary-search it.",
    ],
  },
  codes: {
    js: `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

function insert(root, value) {
  if (!root) return new TreeNode(value);
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else {
    root.right = insert(root.right, value);
  }
  return root;
}

function inorder(node, result = []) {
  if (!node) return result;
  inorder(node.left, result);
  result.push(node.value);
  inorder(node.right, result);
  return result;
}`,
    py: `class TreeNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def insert(root, value):
    if root is None:
        return TreeNode(value)
    if value < root.value:
        root.left = insert(root.left, value)
    else:
        root.right = insert(root.right, value)
    return root

def inorder(node, result):
    if node is None:
        return result
    inorder(node.left, result)
    result.append(node.value)
    inorder(node.right, result)
    return result`,
    cpp: `struct TreeNode {
    int value;
    TreeNode *left, *right;
    TreeNode(int v) : value(v), left(nullptr), right(nullptr) {}
};

TreeNode* insert(TreeNode* root, int value) {
    if (!root) return new TreeNode(value);
    if (value < root->value) {
        root->left = insert(root->left, value);
    } else {
        root->right = insert(root->right, value);
    }
    return root;
}

void inorder(TreeNode* node, vector<int>& result) {
    if (!node) return;
    inorder(node->left, result);
    result.push_back(node->value);
    inorder(node->right, result);
}`,
  },
};
