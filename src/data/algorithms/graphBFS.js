import { drawGraph } from "../viz.js";

const W = 720, H = 340;
const NODES = { A: { x: 110, y: 170 }, B: { x: 280, y: 80 }, C: { x: 280, y: 260 }, D: { x: 460, y: 60 }, E: { x: 460, y: 180 }, F: { x: 610, y: 220 } };
const ADJ = { A: ["B", "C"], B: ["A", "D", "E"], C: ["A", "F"], D: ["B"], E: ["B", "F"], F: ["C", "E"] };
const EDGES = [["A", "B"], ["A", "C"], ["B", "D"], ["B", "E"], ["C", "F"], ["E", "F"]];

function buildSteps(start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  const steps = [];

  const snap = (desc, lines, extra) => steps.push({
    desc, lines,
    draw(svg) { drawGraph(svg, W, H, NODES, EDGES, extra || {}); },
  });

  snap(`Start BFS at ${start}. Mark it visited and add it to the queue.`, { js: 2, py: 2, cpp: 3 },
    { visited: new Set(visited), frontier: queue.slice(), frontierLabel: "Queue" });

  while (queue.length) {
    const node = queue.shift();
    order.push(node);
    snap(`Dequeue ${node} and visit it.`, { js: 6, py: 5, cpp: 8 },
      { visited: new Set(visited), current: node, frontier: queue.slice(), frontierLabel: "Queue", order: order.slice() });

    for (const neighbor of ADJ[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        snap(`${node} → ${neighbor}: not visited yet — mark it visited and enqueue it.`,
          { js: 10, py: 8, cpp: 12 },
          { visited: new Set(visited), current: node, frontier: queue.slice(), frontierLabel: "Queue", order: order.slice() });
      } else {
        snap(`${node} → ${neighbor}: already visited — skip it.`,
          { js: 9, py: 7, cpp: 11 },
          { visited: new Set(visited), current: node, frontier: queue.slice(), frontierLabel: "Queue", order: order.slice() });
      }
    }
  }
  snap(`Queue is empty — BFS complete. Order: ${order.join(", ")}.`, { js: 13, py: 10, cpp: 16 },
    { visited: new Set(visited), order: order.slice() });
  return steps;
}

export default {
  id: "graph-bfs",
  title: "Graph — Breadth-First Search",
  category: "Graphs",
  level: "Intermediate",
  difficulty: "Medium",
  tags: ["Queue", "Level Order", "Shortest Path (unweighted)"],
  blurb: "Explore a graph level by level using a queue, visiting all neighbors before going deeper.",
  complexity: "Time: O(V + E) · Space: O(V)",
  defaultInput: "A",
  buildSteps,
  notes: {
    intuition:
      "BFS spreads outward in rings, like a drop of ink diffusing in water: first you visit the start node, then everything one step away, then everything two steps away, and so on. A queue is what enforces this 'finish this ring before starting the next' order, since it processes nodes in the same order they were discovered.",
    approach: [
      "Mark the start node visited and add it to a queue.",
      "While the queue isn't empty: dequeue a node, and 'visit' it (record it, print it, etc.).",
      "Look at all of that node's neighbors. For each unvisited one, mark it visited immediately (not when you dequeue it!) and enqueue it.",
      "Repeat until the queue is empty — every reachable node has now been visited.",
    ],
    dryRun: "Graph A-B, A-C, B-D, B-E, C-F, E-F starting at A → visit order: A, B, C, D, E, F (A's neighbors first, then their neighbors)",
    pitfalls: [
      "Marking a node visited when you enqueue it (not when you dequeue it) is essential — otherwise the same node can be added to the queue multiple times through different paths.",
      "BFS finds the shortest path in terms of number of edges on an unweighted graph — but it does NOT account for edge weights; for weighted shortest paths you need Dijkstra's algorithm instead.",
      "On a disconnected graph, BFS from one node only reaches its connected component — you'd need to restart BFS from an unvisited node to cover the rest.",
    ],
  },
  codes: {
    js: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return order;
}`,
    py: `from collections import deque

def bfs(graph, start):
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return order`,
    cpp: `vector<char> bfs(map<char, vector<char>>& graph, char start) {
    set<char> visited = {start};
    queue<char> q;
    q.push(start);
    vector<char> order;

    while (!q.empty()) {
        char node = q.front();
        q.pop();
        order.push_back(node);
        for (char neighbor : graph[node]) {
            if (!visited.count(neighbor)) {
                visited.insert(neighbor);
                q.push(neighbor);
            }
        }
    }
    return order;
}`,
  },
};
