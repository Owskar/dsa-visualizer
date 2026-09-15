import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dsa-visualizer-theme-v1";

function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // localStorage unavailable — fall through to system preference
  }
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

/**
 * Tracks light/dark theme, persisted to localStorage, and applies it via a
 * `data-theme` attribute on <html> — every color in the app is a CSS
 * variable (see src/index.css), so this one attribute is all it takes to
 * re-theme everything.
 */
export function useTheme() {
  const [theme, setTheme] = useState(loadTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // fine — theme just won't persist across sessions
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}
