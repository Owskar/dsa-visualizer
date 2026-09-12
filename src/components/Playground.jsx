import React, { useEffect, useState } from "react";
import "./Playground.css";

export default function Playground({ seedCode }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState(seedCode);
  const [output, setOutput] = useState("Output will appear here.");
  const [isError, setIsError] = useState(false);

  // Re-seed the editor whenever the selected algorithm changes
  useEffect(() => {
    setCode(seedCode);
    setOutput("Output will appear here.");
    setIsError(false);
  }, [seedCode]);

  function run() {
    const logs = [];
    const fakeConsole = {
      log: (...args) => logs.push(args.map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ")),
    };
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function("console", code);
      fn(fakeConsole);
      setOutput(logs.length ? logs.join("\n") : "(No console.log output. Add a console.log(...) call to see results here.)");
      setIsError(false);
    } catch (err) {
      setOutput(`Error: ${err.message}`);
      setIsError(true);
    }
  }

  return (
    <div className="playground-container">
      <button
        type="button"
        className="btn btn-secondary playground-toggle"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "▾ Close JS Playground" : "▸ Open JS Playground"}
      </button>

      {open && (
        <div className="playground">
          <p className="muted small">Edit the JavaScript below and run it yourself — this executes for real in your browser.</p>
          <textarea
            className="playground-editor"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="playground-actions">
            <button className="btn btn-primary" type="button" onClick={run}>▶ Run</button>
          </div>
          <pre className={"playground-output" + (isError ? " error" : "")}>{output}</pre>
        </div>
      )}
    </div>
  );
}
