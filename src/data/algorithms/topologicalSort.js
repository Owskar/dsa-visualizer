import { drawGraph, makeSnap } from "../viz.js";

const W = 720, H = 340;
// A small dependency graph: A and B have no prerequisites; C needs A; D needs B and C; E needs D.
const NODES = { A: { x: 110, y: 90 }, B: { x: 110, y: 250 }, C: { x: 320, y: 90 }, D: { x: 520, y: 170 }, E: { x: 700, y: 170 } };
const EDGES = [["A", "C"], ["B", "D"], ["C", "D"], ["D", "E"]];
const ADJ = { A: ["C"], B: ["D"], C: ["D"], D: ["E"], E: [] };

function buildSteps() {
  const steps = [];
  const snap = makeSnap(steps, () => ({}), (svg, _s, extra) => drawGraph(svg, W, H, NODES, EDGES, { ...extra, directed: true }));

  const inDegree = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  for (const [a, b] of EDGES) inDegree[b]++;

  snap(`Count each node's in-degree (number of arrows pointing INTO it): ${Object.entries(inDegree).map(([k, v]) => `${k}:${v}`).join(", ")}.`,
    { js: 2, py: 2, cpp: 3 }, { caption: "In-degree: " + Object.entries(inDegree).map(([k, v]) => `${k}=${v}`).join(", ") });

  const queue = Object.keys(inDegree).filter((n) => inDegree[n] === 0);
  snap(`Nodes with in-degree 0 have no prerequisites — they can go first. Start the queue with: [${queue.join(", ")}].`,
    { js: 5, py: 4, cpp: 6 }, { frontier: queue.slice(), frontierLabel: "Queue" });

  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    snap(`Dequeue ${node} and add it to the topological order.`, { js: 9, py: 7, cpp: 10 },
      { current: node, visited: new Set(order), frontier: queue.slice(), frontierLabel: "Queue", order: order.slice() });

    for (const neighbor of ADJ[node]) {
      inDegree[neighbor]--;
      snap(`${node} → ${neighbor}: remove this dependency, so ${neighbor}'s in-degree drops to ${inDegree[neighbor]}.`,
        { js: 11, py: 9, cpp: 12 }, { current: node, visited: new Set(order), frontier: queue.slice(), frontierLabel: "Queue", order: order.slice() });
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
        snap(`${neighbor} now has in-degree 0 — all its prerequisites are done. Enqueue it.`,
          { js: 12, py: 10, cpp: 13 }, { visited: new Set(order), frontier: queue.slice(), frontierLabel: "Queue", order: order.slice() });
      }
    }
  }

  snap(`Queue empty. Topological order: ${order.join(" → ")} — every prerequisite comes before what depends on it.`,
    { js: 15, py: 12, cpp: 16 }, { visited: new Set(order), order: order.slice() });
  return steps;
}

export default {
  id: "topological-sort",
  title: "Topological Sort (Kahn's Algorithm)",
  category: "Graphs",
  level: "Advanced",
  difficulty: "Medium",
  tags: ["BFS", "Directed Graph", "In-Degree"],
  blurb: "Order the nodes of a directed graph so every edge points from earlier to later — the classic 'do prerequisites first' problem.",
  complexity: "Time: O(V + E) · Space: O(V)",
  defaultInput: null,
  sheetNum: 372,
  buildSteps,
  notes: {
    intuition:
      "Think of the graph as a set of course prerequisites: an edge A → B means 'A must be done before B'. A valid order exists only for a DAG (Directed Acyclic Graph — no cycles). Kahn's algorithm repeatedly picks off any node with NO remaining prerequisites (in-degree 0), 'removes' it from the graph, and checks whether that unlocks any new zero-in-degree nodes.",
    approach: [
      "Compute the in-degree (number of incoming edges) for every node.",
      "Put every node with in-degree 0 into a queue — these have no unmet prerequisites.",
      "While the queue isn't empty: dequeue a node, add it to the output order, then for each of its outgoing edges, decrement the target node's in-degree (since this prerequisite is now satisfied).",
      "Any node whose in-degree just dropped to 0 gets enqueued — it's now unlocked.",
      "If every node made it into the output, you have a valid topological order. If some are left out, the graph has a cycle (no valid order exists).",
    ],
    dryRun: "A→C, B→D, C→D, D→E: in-degrees A=0,B=0,C=1,D=2,E=1 → start [A,B] → process A: C→0, enqueue C → process B: D→1 → process C: D→0, enqueue D → process D: E→0, enqueue E → order: A,B,C,D,E",
    pitfalls: [
      "Topological sort only makes sense for a DAG — if the graph has a cycle, some nodes will never reach in-degree 0, and the algorithm finishes with fewer nodes in the output than exist in the graph. Checking `order.length === totalNodes` at the end is how you detect a cycle this way.",
      "There can be multiple valid topological orders for the same graph (e.g. [A,B,C,D,E] and [B,A,C,D,E] are both valid here) — the algorithm just finds A valid one, not necessarily the only one.",
      "This BFS-based version (Kahn's algorithm) is often preferred over the DFS-based version (using post-order + reverse) because it naturally also detects cycles, without needing a separate visited/in-progress coloring scheme.",
    ],
  },
  codes: {
    js: `function topologicalSort(numNodes, edges) {
  const adj = Array.from({ length: numNodes }, () => []);
  const inDegree = new Array(numNodes).fill(0);
  for (const [a, b] of edges) {
    adj[a].push(b);
    inDegree[b]++;
  }

  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    for (const neighbor of adj[node]) {
      if (--inDegree[neighbor] === 0) queue.push(neighbor);
    }
  }
  return order.length === numNodes ? order : []; // empty = cycle detected
}`,
    py: `from collections import deque

def topological_sort(num_nodes, edges):
    adj = [[] for _ in range(num_nodes)]
    in_degree = [0] * num_nodes
    for a, b in edges:
        adj[a].append(b)
        in_degree[b] += 1

    queue = deque(i for i in range(num_nodes) if in_degree[i] == 0)
    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    return order if len(order) == num_nodes else []  # empty = cycle`,
    cpp: `vector<int> topologicalSort(int numNodes, vector<pair<int,int>>& edges) {
    vector<vector<int>> adj(numNodes);
    vector<int> inDegree(numNodes, 0);
    for (auto& [a, b] : edges) {
        adj[a].push_back(b);
        inDegree[b]++;
    }
    queue<int> q;
    for (int i = 0; i < numNodes; i++) if (inDegree[i] == 0) q.push(i);

    vector<int> order;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        order.push_back(node);
        for (int neighbor : adj[node]) {
            if (--inDegree[neighbor] == 0) q.push(neighbor);
        }
    }
    return order.size() == numNodes ? order : vector<int>{}; // empty = cycle
}`,
  },
};
