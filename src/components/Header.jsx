import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <span className="brand-mark">§</span>
        <div>
          <h1>DSA Visualizer</h1>
          <p>Read the theory. Watch it run. Read the code.</p>
        </div>
      </Link>
      <a className="brand-link" href="https://github.com/Owskar" target="_blank" rel="noopener noreferrer">
        by Owskar ↗
      </a>
    </header>
  );
}
