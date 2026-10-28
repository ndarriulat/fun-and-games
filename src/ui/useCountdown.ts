// Halloween 2026: remove in ticket 03, with everything marked "Halloween 2026".
import { useEffect, useRef } from "react";

/**
 * Runs a game's turn timer while `running`. The time left lives in the game's own (saved) state:
 * this reports it about every quarter second through `onTick`, calls `onEnd` at zero, and calls
 * `onHidden` if the phone locks or the tab is hidden, so the game can pause instead of losing time.
 */
export function useCountdown({
  running,
  timeLeftMs,
  onTick,
  onEnd,
  onHidden,
}: {
  running: boolean;
  timeLeftMs: number;
  onTick: (timeLeftMs: number) => void;
  onEnd: () => void;
  onHidden: () => void;
}) {
  const latest = useRef({ timeLeftMs, onTick, onEnd, onHidden });
  useEffect(() => {
    latest.current = { timeLeftMs, onTick, onEnd, onHidden };
  });

  useEffect(() => {
    if (!running) return;
    const startedAt = Date.now();
    const startLeft = latest.current.timeLeftMs;
    const interval = setInterval(() => {
      const left = Math.max(0, startLeft - (Date.now() - startedAt));
      if (left === 0) {
        clearInterval(interval);
        latest.current.onEnd();
      } else {
        latest.current.onTick(left);
      }
    }, 250);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") latest.current.onHidden();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [running]);
}
