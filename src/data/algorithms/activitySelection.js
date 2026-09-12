import { clearStage, drawGrid, textEl, box, svgEl, makeSnap, COLORS } from "../viz.js";

const W = 720, H = 340;
const ROW_H = 40, SCALE = 56, MARGIN_X = 60, TOP = 30;

// (start, end) pairs — deliberately NOT pre-sorted, to show the sort step matters.
const ACTIVITIES = [
  { id: "A0", start: 1, end: 3 },
  { id: "A1", start: 2, end: 5 },
  { id: "A2", start: 4, end: 6 },
  { id: "A3", start: 6, end: 7 },
  { id: "A4", start: 5, end: 8 },
  { id: "A5", start: 7, end: 9 },
];

function draw(svg, order, opts = {}) {
  clearStage(svg, W, H);
  drawGrid(svg, W, H);

  // time axis
  for (let t = 0; t <= 10; t++) {
    const x = MARGIN_X + t * SCALE;
    svg.appendChild(textEl(x, TOP - 12, String(t), { mono: true, size: 10, fill: COLORS.inkFaint }));
  }

  order.forEach((act, row) => {
    const y = TOP + row * ROW_H;
    const x = MARGIN_X + act.start * SCALE;
    const width = (act.end - act.start) * SCALE;
    let fill = "#fff", stroke = COLORS.ink;
    const status = opts.status && opts.status[act.id];
    if (status === "selected") { fill = COLORS.tealFaint; stroke = COLORS.teal; }
    else if (status === "rejected") { fill = COLORS.redFaint; stroke = COLORS.red; }
    else if (opts.current === act.id) { fill = COLORS.blueFaint; stroke = COLORS.blue; }
    svg.appendChild(box(x, y + 4, width, ROW_H - 12, {
      fill, stroke, strokeWidth: 2, rx: 5, label: `${act.id} (${act.start}-${act.end})`, fontSize: 12, dataRole: "activity-value",
    }));
  });

  if (opts.lastEnd !== undefined) {
    const x = MARGIN_X + opts.lastEnd * SCALE;
    svg.appendChild(svgEl("line", { x1: x, y1: TOP - 20, x2: x, y2: TOP + order.length * ROW_H, stroke: COLORS.amber, "stroke-width": 2, "stroke-dasharray": "4,3" }));
    svg.appendChild(textEl(x, TOP - 26, `last end = ${opts.lastEnd}`, { mono: true, size: 11, weight: 700, fill: COLORS.amber }));
  }
}

function buildSteps() {
  const steps = [];
  const status = {};
  const snap = makeSnap(steps, () => ({ status: { ...status } }), (svg, snapshot, extra) => draw(svg, sorted, { ...snapshot, ...extra }));

  snap(`${ACTIVITIES.length} activities, each with a (start, end) time. Pick the maximum number that don't overlap.`, { js: 2, py: 2, cpp: 3 }, {});

  const sorted = ACTIVITIES.slice().sort((a, b) => a.end - b.end);
  snap(`Greedy insight: always sort by END time first. Sorted order: ${sorted.map((a) => a.id).join(", ")}.`, { js: 3, py: 3, cpp: 4 }, {});

  let lastEnd = -Infinity;
  let count = 0;
  for (const act of sorted) {
    snap(`Consider ${act.id} (${act.start}-${act.end}).`, { js: 6, py: 5, cpp: 7 }, { current: act.id, lastEnd: lastEnd === -Infinity ? undefined : lastEnd });
    if (act.start >= lastEnd) {
      status[act.id] = "selected";
      lastEnd = act.end;
      count++;
      snap(`${act.id} starts at ${act.start}, which is ≥ the last selected activity's end — no overlap. Select it!`,
        { js: 8, py: 6, cpp: 9 }, { current: act.id, lastEnd });
    } else {
      status[act.id] = "rejected";
      snap(`${act.id} starts at ${act.start}, before the last selected activity ends (${lastEnd}) — it overlaps. Skip it.`,
        { js: 10, py: 8, cpp: 11 }, { current: act.id, lastEnd });
    }
  }

  const selected = sorted.filter((a) => status[a.id] === "selected").map((a) => a.id);
  snap(`Done. Selected ${count} activities with no overlaps: ${selected.join(", ")}.`, { js: 12, py: 9, cpp: 13 }, { lastEnd });
  return steps;
}

export default {
  id: "activity-selection",
  title: "Activity Selection Problem",
  category: "Greedy",
  level: "Advanced",
  difficulty: "Medium",
  tags: ["Greedy", "Interval Scheduling", "Sorting"],
  blurb: "Given a set of activities with start/end times, select the maximum number that don't overlap — by always picking whichever finishes earliest.",
  complexity: "Time: O(n log n) (dominated by the sort) · Space: O(1) extra",
  defaultInput: null,
  buildSteps,
  notes: {
    intuition:
      "The greedy insight: if you must choose one activity to go first, always prefer the one that FINISHES earliest — it leaves the most room for everything else afterward. Once you sort every activity by end time, a single pass works: keep a running 'last selected activity's end time', and greedily accept the next activity whenever it starts at or after that.",
    approach: [
      "Sort all activities by their END time, ascending — this is the key step that makes the rest greedy and correct.",
      "Track `lastEnd`, the end time of the most recently selected activity (initialize to -∞, or just take the first sorted activity automatically).",
      "Walk through the sorted list: if an activity's start time is ≥ `lastEnd`, it doesn't overlap with what's already selected — select it, and update `lastEnd` to its end time.",
      "If it starts before `lastEnd`, it overlaps with an already-selected activity — skip it.",
      "The count (and list) of selected activities at the end is a maximum-size non-overlapping set.",
    ],
    dryRun: "(1,3)(2,5)(4,6)(6,7)(5,8)(7,9) sorted by end: (1,3)(2,5)(4,6)(6,7)(5,8)(7,9) → select (1,3), skip (2,5) [starts<3], select (4,6), select (6,7), skip (5,8) [starts<7], select (7,9) → 4 selected",
    pitfalls: [
      "Sorting by START time instead of END time is a very common mistake — it does NOT produce the optimal answer in general. Sorting by end time is what makes the greedy choice provably correct here.",
      "Whether touching endpoints count as a conflict depends on the exact problem statement — using `start >= lastEnd` (as here) allows an activity to start exactly when another ends; some problem variants require `start > lastEnd` instead.",
      "This greedy approach maximizes the NUMBER of activities selected — it says nothing about maximizing total duration or value. A different (harder, DP-based) problem — 'weighted interval scheduling' — handles the case where activities have different values and you want to maximize total value instead.",
    ],
  },
  codes: {
    js: `function activitySelection(activities) {
  // activities: [{ start, end }, ...]
  const sorted = [...activities].sort((a, b) => a.end - b.end);
  const selected = [];
  let lastEnd = -Infinity;

  for (const act of sorted) {
    if (act.start >= lastEnd) {
      selected.push(act);
      lastEnd = act.end;
    }
  }
  return selected;
}`,
    py: `def activity_selection(activities):
    sorted_acts = sorted(activities, key=lambda a: a["end"])
    selected = []
    last_end = float("-inf")

    for act in sorted_acts:
        if act["start"] >= last_end:
            selected.append(act)
            last_end = act["end"]
    return selected`,
    cpp: `struct Activity { int start, end; };

vector<Activity> activitySelection(vector<Activity> activities) {
    sort(activities.begin(), activities.end(),
         [](const Activity& a, const Activity& b) { return a.end < b.end; });

    vector<Activity> selected;
    int lastEnd = INT_MIN;
    for (const auto& act : activities) {
        if (act.start >= lastEnd) {
            selected.push_back(act);
            lastEnd = act.end;
        }
    }
    return selected;
}`,
  },
};
