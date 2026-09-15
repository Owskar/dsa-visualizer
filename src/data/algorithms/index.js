/**
 * Auto-discovery registry — this is the ENTIRE reason adding a new
 * algorithm only requires creating one file. Every `*.js` file in this
 * folder (except this one) is imported eagerly via Vite's `import.meta.glob`,
 * and its default export is added to the registry automatically. There is
 * nothing to register by hand here — see README.md, "Adding a new problem",
 * for the one-file workflow.
 */
const modules = import.meta.glob("./*.js", { eager: true });

export const ALGORITHMS = Object.entries(modules)
  .filter(([path]) => !path.endsWith("/index.js"))
  .map(([, mod]) => mod.default)
  .filter(Boolean)
  .sort((a, b) => {
    // Stable, predictable order: by the sheet number each algorithm's
    // FIRST entry maps to (sheetNum may be a single number or an array).
    const numOf = (algo) => (Array.isArray(algo.sheetNum) ? algo.sheetNum[0] : algo.sheetNum) ?? Infinity;
    return numOf(a) - numOf(b);
  });

export const ALGO_BY_ID = Object.fromEntries(ALGORITHMS.map((a) => [a.id, a]));

export function defaultStepsFor(algo) {
  if (algo.defaultTarget !== undefined) {
    return algo.buildSteps(algo.defaultInput, algo.defaultTarget);
  }
  return algo.buildSteps(algo.defaultInput);
}
