import { drawBinaryTree, cloneBinaryTree, makeSnap } from "../viz.js";

const W = 760, H = 360;

// Fixed demo tree:
//         1
//        / \
//       2   3
//      / \   \
//     4   5   6
const TREE = {
  value: 1,
  left: { value: 2, left: { value: 4, left: null, right: null }, right: { value: 5, left: null, right: null } },
  right: { value: 3, left: null, right: { value: 6, left: null, right: null } },
};

function buildSteps() {
  const root = TREE;
  const steps = [];
  const snap = makeSnap(steps, () => cloneBinaryTree(root), (svg, snapshot, extra) => drawBinaryTree(svg, W, H, snapshot, extra));

  const visited = new Set();
  const order = [];
  const queue = [root];

  snap("Level order traversal visits a tree level by level, left to right — using a queue, just like graph BFS.",
    { js: 2, py: 2, cpp: 3 }, { order: [] });

  while (queue.length) {
    const node = queue.shift();
    visited.add(node.value);
    order.push(node.value);
    snap(`Dequeue ${node.value} and visit it.`, { js: 6, py: 5, cpp: 8 }, { current: node.value, visited: new Set(visited), order: order.slice() });

    if (node.left) {
      queue.push(node.left);
      snap(`${node.value} has a left child (${node.left.value}) — enqueue it.`, { js: 8, py: 7, cpp: 10 }, { visited: new Set(visited), order: order.slice() });
    }
    if (node.right) {
      queue.push(node.right);
      snap(`${node.value} has a right child (${node.right.value}) — enqueue it.`, { js: 9, py: 8, cpp: 11 }, { visited: new Set(visited), order: order.slice() });
    }
  }

  snap(`Queue is empty — traversal complete. Level order: ${order.join(", ")}.`, { js: 12, py: 10, cpp: 13 }, { visited: new Set(visited), order: order.slice() });
  return steps;
}

export default {
  id: "binary-tree-level-order",
  title: "Binary Tree Level Order Traversal",
  category: "Trees",
  level: "Intermediate",
  difficulty: "Medium",
  tags: ["BFS", "Queue", "Tree"],
  blurb: "Visit every node of a binary tree level by level, left to right — using a queue, the same idea as graph BFS.",
  complexity: "Time: O(n) · Space: O(n) (queue can hold up to a full level, at most ~n/2 nodes)",
  defaultInput: null,
  sheetNum: 303,
  buildSteps,
  notes: {
    intuition:
      "This is graph BFS applied to a tree: a queue naturally processes nodes in 'discovered order', and since a node's children are always discovered right after their parent, a queue guarantees you finish an entire level before moving to the next one. Compare this with the BST's inorder traversal (recursive, goes deep immediately) — level order deliberately goes wide first.",
    approach: [
      "Push the root onto a queue.",
      "While the queue isn't empty: dequeue a node, visit it (record its value), then enqueue its left child (if any) and its right child (if any).",
      "Because children are always enqueued right after their parent, the queue naturally drains in level-by-level order.",
      "Repeat until the queue is empty — every node has been visited, level by level, left to right.",
    ],
    dryRun: "Tree: 1 with children 2,3; 2 has children 4,5; 3 has right child 6 → queue: [1]→[2,3]→[3,4,5]→[4,5,6]→... → order: 1,2,3,4,5,6",
    pitfalls: [
      "This is easy to confuse with DFS-based traversals (preorder/inorder/postorder), which use a STACK (or recursion) and go deep before wide — level order specifically needs a QUEUE.",
      "A common follow-up asks to group the output BY level (e.g. [[1],[2,3],[4,5,6]]) — track how many nodes are in the queue at the start of each level (`queue.length` before the inner loop) to know where each level's boundary is.",
      "Don't forget to check that a child exists (`if (node.left)`) before enqueueing it — enqueueing `null` values will crash when you try to dequeue and read `.value` from them.",
    ],
  },
  codes: {
    js: `function levelOrder(root) {
  const order = [];
  const queue = [root];

  while (queue.length) {
    const node = queue.shift();
    order.push(node.value);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return order;
}`,
    py: `from collections import deque

def level_order(root):
    order = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        order.append(node.value)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return order`,
    cpp: `vector<int> levelOrder(TreeNode* root) {
    vector<int> order;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        order.push_back(node->value);
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    return order;
}`,
  },
};
