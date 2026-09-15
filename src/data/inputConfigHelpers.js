/**
 * Reusable builders for an algorithm's `inputConfig` — the thing that drives
 * the editable input box on the algorithm detail page. Every algorithm file
 * that needs custom input imports whichever of these fits and calls it with
 * itself, e.g.:
 *
 *   import { arrayOnlyConfig } from "../inputConfigHelpers.js";
 *   export default {
 *     id: "bubble-sort",
 *     ...
 *     inputConfig: (algo) => arrayOnlyConfig(algo),
 *   };
 *
 * `inputConfig` on the algorithm is itself a function of the algorithm
 * object so it can read `defaultInput`/`defaultTarget` without repeating
 * them — see src/data/algorithms/*.js for real examples. Returns `null`
 * from `parse()` to signal invalid input, so the caller can fall back to
 * defaults instead of crashing.
 */

export function arrayOnlyConfig(algo, label) {
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

export function arrayAndNumberConfig(algo, label) {
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

export function stringOnlyConfig(algo, label) {
  return {
    label,
    defaultValue: algo.defaultInput,
    parse(raw) {
      const s = raw.trim();
      return s ? [s] : null;
    },
  };
}

export function boundedIntConfig(algo, label, min, max) {
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

export function twoIntConfig(algo, label) {
  return {
    label,
    defaultValue: `${algo.defaultInput} | ${algo.defaultTarget}`,
    parse(raw) {
      const [aPart, bPart] = raw.split("|");
      if (aPart === undefined || bPart === undefined) return null;
      const a = Math.floor(Number(aPart.trim()));
      const b = Math.floor(Number(bPart.trim()));
      if (Number.isNaN(a) || Number.isNaN(b)) return null;
      return [a, b];
    },
  };
}

/**
 * Resolves an algorithm's input config. Every algorithm self-declares its
 * own `inputConfig` (a function of itself) — this just calls it, or returns
 * null for algorithms with no editable input (fixed scripted demos like
 * stack/queue/detect-cycle-linked-list).
 */
export function getInputConfig(algo) {
  return typeof algo.inputConfig === "function" ? algo.inputConfig(algo) : null;
}
