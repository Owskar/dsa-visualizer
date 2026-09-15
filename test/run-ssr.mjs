import { fileURLToPath } from "url";
import path from "path";
import { loadViaVite, closeViteLoader } from "./vite-ssr-loader.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// Loaded through Vite's real SSR pipeline (not esbuild) — this is what makes
// it possible at all: ssr-entry.jsx transitively imports LandingPage.jsx,
// which imports src/data/algorithms/index.js, which uses import.meta.glob —
// a Vite-only build-time macro. Only Vite's own transform understands it, so
// the test has to go through Vite rather than a generic bundler.
try {
  await loadViaVite(path.join(root, "test/ssr-entry.jsx"));
} finally {
  await closeViteLoader();
}
