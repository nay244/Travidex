import React, { useRef, useState } from "react";

/**
 * BottomSheet — draggable sheet with three snap points (peek / half / full).
 * Positioned within a relatively-positioned parent (e.g. a phone frame). The header
 * (drag handle + your `header` content) stays fixed; `children` scroll in `full`/`half`.
 *
 * `snap` is controlled; drag the handle to call `onSnap` with the nearest point.
 */
export function BottomSheet({ snap = "half", onSnap, header, children, points = { peek: 88, half: 0.5, full: 0.92 }, style }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(null); // {startY, startTop}
  const order = ["peek", "half", "full"];

  function topFor(point, h) {
    const v = points[point];
    if (v <= 1) return h * (1 - v);       // fraction of height visible
    return h - v;                          // px of peek visible
  }

  const parentH = ref.current?.parentElement?.clientHeight || 720;
  const baseTop = topFor(snap, parentH);
  const top = drag ? Math.max(topFor("full", parentH), drag.curTop) : baseTop;

  function onDown(e) {
    setDrag({ startY: e.clientY, startTop: baseTop, curTop: baseTop });
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }
  function onMove(e) {
    if (!drag) return;
    setDrag((d) => ({ ...d, curTop: d.startTop + (e.clientY - d.startY) }));
  }
  function onUp() {
    if (!drag) return;
    // snap to nearest point
    let nearest = snap, best = Infinity;
    for (const p of order) {
      const dist = Math.abs(topFor(p, parentH) - drag.curTop);
      if (dist < best) { best = dist; nearest = p; }
    }
    setDrag(null);
    if (nearest !== snap) onSnap?.(nearest);
  }

  return (
    <div
      ref={ref}
      style={{
        position: "absolute", left: 0, right: 0, top, bottom: 0,
        background: "var(--surface-1)",
        borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)",
        boxShadow: "var(--shadow-sheet)",
        borderTop: "1px solid var(--border-default)",
        display: "flex", flexDirection: "column",
        transition: drag ? "none" : "top var(--dur-med) var(--ease-sheet)",
        touchAction: "none",
        ...style,
      }}
    >
      <div
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        style={{ flex: "none", padding: "10px 16px 8px", cursor: "grab", touchAction: "none" }}
      >
        <div style={{ width: 38, height: 5, borderRadius: 999, background: "var(--border-strong)", margin: "0 auto 12px" }} />
        {header}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 16px", WebkitOverflowScrolling: "touch" }}>
        {children}
      </div>
    </div>
  );
}
