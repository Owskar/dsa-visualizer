import { drawBinaryTree, cloneBinaryTree, makeSnap } from "../viz.js";
import { arrayOnlyConfig } from "../inputConfigHelpers.js";

const W = 760, H = 360;

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
  // The tree's nodes are mutated in place by insert() (node.left/node.right
  // get reassigned as later values are inserted), so every step needs its
  // own deep-cloned copy of the tree taken NOW — see makeSnap() in viz.js.
  const snap = makeSnap(steps, () => cloneBinaryTree(root), (svg, snapshot, extra) => drawBinaryTree(svg, W, H, snapshot, extra));

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
  level: "Intermediate",
  difficulty: "Medium",
  tags: ["Recursion", "Tree", "Ordering Invariant"],
  blurb: "Insert values so every left child is smaller and every right child is larger than its parent, then traverse in sorted order.",
  complexity: "Insert/Search (balanced): O(log n), (worst case): O(n)",
  defaultInput: [8, 3, 10, 1, 6, 14, 4, 7],
  sheetNum: 340,
  inputConfig: (algo) => arrayOnlyConfig(algo, "Values to insert, comma-separated"),
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
