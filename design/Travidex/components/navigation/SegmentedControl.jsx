import React from "react";

/**
 * SegmentedControl — iOS-style pill switch with a sliding thumb.
 * Used for sort (Distance/Dex #/Found), Walking|Driving, feed filters, Community tabs.
 */
export function SegmentedControl({ options, value, onChange, style }) {
  const idx = Math.max(0, options.findIndex((o) => (o.value ?? o) === value));
  const n = options.length;
  return (
    <div
      style={{
        position: "relative", display: "flex", padding: "3px",
        background: "var(--surface-2)", borderRadius: "var(--radius-pill)",
        boxShadow: "inset 0 0 0 1px var(--border-subtle)",
        ...style,
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute", top: 3, bottom: 3, left: 3,
          width: `calc((100% - 6px) / ${n})`,
          transform: `translateX(${idx * 100}%)`,
          background: "var(--surface-4)", borderRadius: "var(--radius-pill)",
          boxShadow: "var(--shadow-sm), var(--sheen)",
          transition: "transform var(--dur-med) var(--ease-spring)",
        }}
      />
      {options.map((o) => {
        const v = o.value ?? o;
        const label = o.label ?? o;
        const on = v === value;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange?.(v)}
            style={{
              position: "relative", zIndex: 1, flex: 1, height: 34,
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "var(--font-sans)", fontWeight: on ? 600 : 500, fontSize: "14px",
              color: on ? "var(--text-1)" : "var(--text-3)",
              transition: "color var(--dur-fast) var(--ease-out)",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
