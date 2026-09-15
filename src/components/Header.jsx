import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark">§</span>
        <div>
          <h1>DSA Visualizer</h1>
          <p>Read the theory. Watch it run. Read the code.</p>
        </div>
      </Link>
      <div className="header-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
        <a className="brand-link" href="https://github.com/Owskar" target="_blank" rel="noopener noreferrer">
          by Owskar ↗
        </a>
      </div>
    </header>
  );
}
