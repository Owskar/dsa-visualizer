import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "dsa-visualizer-progress-v1";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Tracks which algorithm ids the learner has marked "done", persisted to
 * localStorage — mirrors the checkbox-progress pattern of sheets like
 * Striver's A2Z DSA sheet.
 */
export function useProgress() {
  const [done, setDone] = useState(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      // localStorage unavailable (private browsing, etc.) — fail silently
    }
  }, [done]);

  const toggle = useCallback((id) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const isDone = useCallback((id) => Boolean(done[id]), [done]);

  return { done, toggle, isDone };
}
