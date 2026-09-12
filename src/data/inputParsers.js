/**
 * Each entry describes how to turn the free-text input box into the
 * argument list that `algo.buildSteps(...)` expects, plus how to seed
 * the box's default value. Returns `null` from `parse` to signal invalid
 * input, so the caller can fall back to defaults instead of crashing.
 */
export function getInputConfig(algo) {
  switch (algo.id) {
    case "binary-search":
    case "linear-search":
      return {
        label: "Array (sorted for binary search) & target — e.g. 2,4,7,9,12,18,23,29,31 | 23",
        defaultValue: `${algo.defaultInput.join(",")} | ${algo.defaultTarget}`,
        parse(raw) {
          const [arrPart, targetPart] = raw.split("|");
          if (!arrPart || targetPart === undefined) return null;
          const arr = arrPart.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
          const target = Number(targetPart.trim());
          if (!arr.length || Number.isNaN(target)) return null;
          return [arr, target];
        },
      };
    case "bubble-sort":
    case "selection-sort":
      return {
        label: "Array of numbers, comma-separated",
        defaultValue: algo.defaultInput.join(","),
        parse(raw) {
          const arr = raw.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
          if (!arr.length) return null;
          return [arr];
        },
      };
    case "recursion-factorial":
      return {
        label: "n (keep it small, e.g. 1–6)",
        defaultValue: String(algo.defaultInput),
        parse(raw) {
          const n = Math.max(0, Math.min(8, Math.floor(Number(raw))));
          if (Number.isNaN(n)) return null;
          return [n];
        },
      };
    case "graph-bfs":
    case "graph-dfs":
      return {
        label: "Start node (A–F)",
        defaultValue: algo.defaultInput,
        parse(raw) {
          const node = raw.toUpperCase().trim();
          if (!"ABCDEF".includes(node)) return null;
          return [node];
        },
      };
    case "bst":
      return {
        label: "Values to insert, comma-separated",
        defaultValue: algo.defaultInput.join(","),
        parse(raw) {
          const arr = raw.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
          if (!arr.length) return null;
          return [arr];
        },
      };
    default:
      return null; // no editable input for this algorithm (e.g. stack/queue/linked-list scripted demos)
  }
}
