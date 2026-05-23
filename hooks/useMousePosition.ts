"use client";

/**
 * useMousePosition
 * ──────────────────────────────────────────────────────────────
 * Tracks the mouse position and returns:
 *   { x, y }          — raw pixel coordinates
 *   { nx, ny }        — normalised -1 → 1 (relative to viewport centre)
 *
 * Usage:
 *   const { x, y, nx, ny } = useMousePosition();
 */

import { useEffect, useState } from "react";

interface MousePosition {
  x: number;
  y: number;
  nx: number; // -1 (left) → 1 (right)
  ny: number; // -1 (top)  → 1 (bottom)
}

export function useMousePosition(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({
    x: 0,
    y: 0,
    nx: 0,
    ny: 0,
  });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX,
        y: e.clientY,
        nx: (e.clientX / window.innerWidth) * 2 - 1,
        ny: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return pos;
}
