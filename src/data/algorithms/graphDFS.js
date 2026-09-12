import { drawGraph } from "../viz.js";

const W = 720, H = 340;
const NODES = { A: { x: 110, y: 170 }, B: { x: 280, y: 80 }, C: { x: 280, y: 260 }, D: { x: 460, y: 60 }, E: { x: 460, y: 180 }, F: { x: 610, y: 220 } };
const ADJ = { A: ["B", "C"], B: ["A", "D", "E"], C: ["A", "F"], D: ["B"], E: ["B", "F"], F: ["C", "E"] };
const EDGES = [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["E", "F"]];

function buildSteps(start) {
  const visited = new Set();
  const order = [];
  const steps = [];

  const snap = (desc, lines, extra) => steps.push({
    desc, lines,
    draw(svg) { drawGraph(svg, W, H, NODES, EDGES, extra || {}); },
  });

  const callStack = [];

  function dfs(node) {
    visited.add(node);
    order.push(node);
    callStack.push(node);
    snap(`Visit ${node} (push onto the call stack) and mark it visited.`, { js: 2, py: 2, cpp: 3 },
      { visited: new Set(visited), current: node, frontier: callStack.slice(), frontierLabel: "Call stack", order: order.slice() });

    for (const neighbor of ADJ[node]) {
      if (!visited.has(neighbor)) {
        snap(`${node} → ${neighbor}: not visited — recurse into it before checking ${node}'s other neighbors.`,
          { js: 6, py: 5, cpp: 7 },
          { visited: new Set(visited), current: node, frontier: callStack.slice(), frontierLabel: "Call stack", order: order.slice() });
        dfs(neighbor);
      } else {
        snap(`${node} → ${neighbor}: already visited — skip it.`, { js: 5, py: 4, cpp: 6 },
          { visited: new Set(visited), current: node, frontier: callStack.slice(), frontierLabel: "Call stack", order: order.slice() });
      }
    }
    callStack.pop();
    snap(`All neighbors of ${node} are handled — pop it off the call stack (backtrack).`, { js: 9, py: 7, cpp: 10 },
      { visited: new Set(visited), frontier: callStack.slice(), frontierLabel: "Call stack", order: order.slice() });
  }

  snap(`Start DFS at ${start}.`, { js: 1, py: 1, cpp: 2 }, { frontierLabel: "Call stack" });
  dfs(start);
  snap(`Call stack is empty — DFS complete. Order: ${order.join(", ")}.`, { js: 11, py: 8, cpp: 10 },
    { visited: new Set(visited), order: order.slice() });
  return steps;
}

export default {
  id: "graph-dfs",
  title: "Graph — Depth-First Search",
  category: "Graphs",
  difficulty: "Medium",
  tags: ["Recursion", "Stack", "Backtracking"],
  blurb: "Explore as far as possible down one path before backtracking, using recursion (or an explicit stack).",
  complexity: "Time: O(V + E) · Space: O(V)",
  defaultInput: "A",
  buildSteps,
  notes: {
    intuition:
      "DFS is what you'd do exploring a maze by always taking the first unexplored path you see, going as deep as possible, and only turning back (backtracking) once you hit a dead end. Recursion handles the 'remember where to backtrack to' bookkeeping for you automatically via the call stack.",
    approach: [
      "Mark the current node visited and record it.",
      "For each neighbor of the current node: if it hasn't been visited, recurse into it immediately (go deep before going wide).",
      "Once all neighbors of a node have been explored (or were already visited), that call returns — this is the 'backtrack' step.",
      "Start the recursion from your chosen start node; when it fully returns, every reachable node has been visited.",
    ],
    dryRun: "Graph A-B, A-C, B-D, B-E, C-F, E-F starting at A → visit order: A, B, D, E, F, C (dives all the way down B's branch before backtracking to C)",
    pitfalls: [
      "Deep recursion on a very large graph can hit a stack overflow — an iterative version using an explicit stack avoids that risk.",
      "DFS visit order depends on the order neighbors are stored/iterated — different adjacency list orderings give different (but equally valid) DFS traversals.",
      "Unlike BFS, DFS does NOT guarantee the shortest path in an unweighted graph — it just guarantees you'll visit every reachable node eventually.",
      "Forgetting to mark a node visited before recursing into it can cause infinite loops on graphs with cycles.",
    ],
  },
  codes: {
    js: `function dfs(graph, node, visited = new Set(), order = []) {
  visited.add(node);
  order.push(node);

  for (const neighbor of graph[node]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited, order);
    }
  }
  return order;
}`,
    py: `def dfs(graph, node, visited=None, order=None):
    if visited is None:
        visited, order = set(), []
    visited.add(node)
    order.append(node)
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited, order)
    return order`,
    cpp: `void dfs(map<char, vector<char>>& graph, char node,
         set<char>& visited, vector<char>& order) {
    visited.insert(node);
    order.push_back(node);
    for (char neighbor : graph[node]) {
        if (!visited.count(neighbor)) {
            dfs(graph, neighbor, visited, order);
        }
    }
}`,
  },
};
