import { createServer } from "vite";
import { fileURLToPath } from "url";
import path from "path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url))); // project root

let serverPromise = null;

function getServer() {
  if (!serverPromise) {
    serverPromise = createServer({
      root,
      logLevel: "warn",
      server: { middlewareMode: true, hmr: false },
      appType: "custom",
    });
  }
  return serverPromise;
}

/**
 * Loads a module (JS, JSX, or anything Vite can transform) through a real
 * Vite dev server running in SSR middleware mode — the same transform
 * pipeline (import.meta.glob, JSX, CSS-as-no-op) the actual app uses when
 * you run `npm run dev` / `npm run build`. Tests should use this instead of
 * a plain Node `import()` for anything that touches `import.meta.glob`
 * (src/data/algorithms/index.js) or JSX (any component).
 *
 * @param {string} absPath absolute path to the module to load
 */
export async function loadViaVite(absPath) {
  const server = await getServer();
  return server.ssrLoadModule(absPath);
}

/** Call once at the end of a test file to let the process exit cleanly. */
export async function closeViteLoader() {
  if (serverPromise) {
    const server = await serverPromise;
    await server.close();
    serverPromise = null;
  }
}
