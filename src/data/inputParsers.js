/**
 * Each entry describes how to turn the free-text input box into the
 * argument list that `algo.buildSteps(...)` expects, plus how to seed
 * the box's default value. Returns `null` from `parse` to signal invalid
 * input, so the caller can fall back to defaults instead of crashing.
 */

// Shared parsers, reused across several algorithm ids below.
function arrayOnlyConfig(algo, label) {
  return {
    label: label || "Array of numbers, comma-separated",
    defaultValue: algo.defaultInput.join(","),
    parse(raw) {
      const arr = raw.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
      if (!arr.length) return null;
      return [arr];
    },
  };
}

function arrayAndNumberConfig(algo, label) {
  return {
    label,
    defaultValue: `${algo.defaultInput.join(",")} | ${algo.defaultTarget}`,
    parse(raw) {
      const [arrPart, numPart] = raw.split("|");
      if (!arrPart || numPart === undefined) return null;
      const arr = arrPart.split(",").map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
      const num = Number(numPart.trim());
      if (!arr.length || Number.isNaN(num)) return null;
      return [arr, num];
    },
  };
}

function stringOnlyConfig(algo, label) {
  return {
    label,
    defaultValue: algo.defaultInput,
    parse(raw) {
      const s = raw.trim();
      return s ? [s] : null;
    },
  };
}

function boundedIntConfig(algo, label, min, max) {
  return {
    label,
    defaultValue: String(algo.defaultInput),
    parse(raw) {
      const n = Math.floor(Number(raw));
      if (Number.isNaN(n)) return null;
      return [Math.max(min, Math.min(max, n))];
    },
  };
}

export function getInputConfig(algo) {
  switch (algo.id) {
    case "binary-search":
    case "linear-search":
      return arrayAndNumberConfig(algo, "Array (sorted for binary search) & target — e.g. 2,4,7,9,12,18,23,29,31 | 23");

    case "two-sum":
      return arrayAndNumberConfig(algo, "Array & target sum — e.g. 2,7,11,15,3 | 9");

    case "kth-largest-heap":
      return arrayAndNumberConfig(algo, "Array & k — e.g. 3,2,1,5,6,4 | 2");

    case "bubble-sort":
    case "selection-sort":
    case "insertion-sort":
    case "merge-sort":
    case "quick-sort":
    case "reverse-linked-list":
      return arrayOnlyConfig(algo);

    case "kadane":
      return arrayOnlyConfig(algo, "Array of numbers (negatives OK), comma-separated");

    case "longest-substring":
      return stringOnlyConfig(algo, "String to search (letters/digits work best, no spaces)");

    case "valid-parentheses":
      return stringOnlyConfig(algo, "A string of ( ) [ ] { } brackets");

    case "recursion-factorial":
      return boundedIntConfig(algo, "n (keep it small, e.g. 1–6)", 0, 8);

    case "fibonacci":
      return boundedIntConfig(algo, "n (keep it small — this grows fast! e.g. 1–7)", 0, 7);

    case "climbing-stairs":
      return boundedIntConfig(algo, "Number of stairs (e.g. 1–12)", 0, 12);

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
      return arrayOnlyConfig(algo, "Values to insert, comma-separated");

    default:
      return null; // no editable input for this algorithm (fixed scripted demo)
  }
}
