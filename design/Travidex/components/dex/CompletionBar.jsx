import React from "react";

/**
 * CompletionBar — horizontal progress for found/total. Color shifts with progress:
 * 100% = green (claimed), partial = amber (in-progress), 0% = dim. Optional mono label.
 */
export function CompletionBar({ found = 0, total = 0, label, showCount = true, height = 8, style }) {
  const pct = total > 0 ? Math.round((found / total) * 100) : 0;
  const claimed = pct >= 100;
  const color = claimed ? "var(--green)" : pct > 0 ? "var(--amber)" : "var(--locked)";
  const glow = claimed ? "0 0 10px var(--green-glow)" : "none";

  return (
    <div style={{ ...style }}>
      {(label || showCount) && (
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "baseline",
          marginBottom: 7, fontFamily: "var(--font-mono)", fontSize: 11,
          letterSpacing: "0.08em", textTransform: "uppercase",
        }}>
          {label && <span style={{ color: "var(--text-2)" }}>{label}</span>}
          {showCount && (
            <span style={{ color: claimed ? "var(--green)" : "var(--text-3)", fontWeight: 700 }}>
              {found}<span style={{ color: "var(--text-3)" }}> / {total}</span>
            </span>
          )}
        </div>
      )}
      <div style={{
        height, borderRadius: "var(--radius-pill)", background: "var(--surface-2)",
        overflow: "hidden", boxShadow: "inset 0 0 0 1px var(--border-subtle)",
      }}>
        <div style={{
          width: `${pct}%`, height: "100%", borderRadius: "var(--radius-pill)",
          background: color, boxShadow: glow,
          transition: "width var(--dur-slow) var(--ease-spring), background var(--dur-med) var(--ease-out)",
        }} />
      </div>
    </div>
  );
}
