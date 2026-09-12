import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Drives step-by-step playback over a `steps` array.
 * Returns the current step object plus transport controls.
 */
export function usePlayer(steps, initialSpeed = 700) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const timerRef = useRef(null);

  // Reset to the start whenever the underlying steps array changes (new algo / new input)
  useEffect(() => {
    setIndex(0);
    setPlaying(false);
  }, [steps]);

  useEffect(() => {
    if (!playing) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [playing, speed, steps.length]);

  const step = steps[Math.min(index, steps.length - 1)];

  const controls = useMemo(() => ({
    play: () => {
      if (steps.length <= 1) return;
      setIndex((i) => (i >= steps.length - 1 ? 0 : i));
      setPlaying(true);
    },
    pause: () => setPlaying(false),
    toggle: () => {
      setPlaying((p) => {
        if (!p && index >= steps.length - 1) setIndex(0);
        return !p;
      });
    },
    next: () => setIndex((i) => Math.min(steps.length - 1, i + 1)),
    prev: () => setIndex((i) => Math.max(0, i - 1)),
    reset: () => { setPlaying(false); setIndex(0); },
    setSpeed,
  }), [steps.length, index]);

  return {
    step,
    index,
    total: steps.length,
    playing,
    speed,
    ...controls,
  };
}
