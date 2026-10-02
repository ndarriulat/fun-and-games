import { useRef, type PointerEvent } from "react";

const SWIPE_DISTANCE = 60;

/** Horizontal swipe detection: left is Next, right is Back. Mostly vertical drags are left alone so the card can scroll. */
export function useSwipe({ onLeft, onRight }: { onLeft: () => void; onRight?: () => void }) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onPointerDown(event: PointerEvent) {
      start.current = { x: event.clientX, y: event.clientY };
    },
    onPointerCancel() {
      start.current = null;
    },
    onPointerUp(event: PointerEvent) {
      if (!start.current) return;
      const dx = event.clientX - start.current.x;
      const dy = Math.abs(event.clientY - start.current.y);
      start.current = null;
      if (Math.abs(dx) < SWIPE_DISTANCE || dy >= Math.abs(dx) * 0.6) return;
      if (dx < 0) onLeft();
      else onRight?.();
    },
  };
}
