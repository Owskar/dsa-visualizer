import esbuild from "esbuild";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// esbuild plugin: CSS imports are side-effect-only in the browser bundle;
// for this Node-side SSR test we just need them to resolve to nothing.
const stubCss = {
  name: "stub-css",
  setup(build) {
    build.onLoad({ filter: /\.css$/ }, () => ({ contents: "", loader: "js" }));
  },
};

const outfile = path.join(__dirname, ".ssr-bundle.cjs");

await esbuild.build({
  entryPoints: [path.join(__dirname, "ssr-entry.jsx")],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile,
  jsx: "automatic",
  plugins: [stubCss],
  external: ["react", "react-dom", "react-dom/server", "react-router-dom"],
  logLevel: "warning",
});

// require the freshly built bundle — its top-level code performs the
// assertions and sets process.exitCode itself.
require(outfile);

// clean up the temp bundle — it's a build artifact of the test run, not source
process.on("exit", () => {
  try { fs.unlinkSync(outfile); } catch { /* already gone, fine */ }
});
