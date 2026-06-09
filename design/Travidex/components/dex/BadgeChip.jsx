import React from "react";

/**
 * BadgeChip — an achievement medallion. earned = gold/colored + glow,
 * locked = dim with criteria text and optional progress toward next.
 */
export function BadgeChip({ name, icon = null, earned = false, criteria, progress, style }) {
  const showProgress = !earned && progress && progress.total > 0;
  const pct = showProgress ? Math.min(100, Math.round((progress.current / progress.total) * 100)) : 0;

  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8, textAlign: "center",
        padding: "16px 10px", borderRadius: "var(--radius-lg)",
        background: "var(--surface-1)",
        boxShadow: earned ? "inset 0 0 0 1px var(--amber-line)" : "inset 0 0 0 1px var(--border-subtle)",
        ...style,
      }}
    >
      <span style={{
        width: 52, height: 52, borderRadius: "50%",
        background: earned ? "var(--amber-dim)" : "var(--surface-2)",
        boxShadow: earned ? "inset 0 0 0 1.5px var(--amber-line), 0 0 16px var(--amber-glow)" : "inset 0 0 0 1.5px var(--border-default)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: earned ? "var(--amber)" : "var(--locked)",
        filter: earned ? "none" : "grayscale(1)",
      }}>{icon || <Star />}</span>

      <span style={{
        fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13,
        color: earned ? "var(--text-1)" : "var(--text-3)", lineHeight: 1.15,
      }}>{name}</span>

      {showProgress ? (
        <span style={{ width: "100%" }}>
          <span style={{ display: "block", height: 4, borderRadius: 999, background: "var(--surface-2)", overflow: "hidden" }}>
            <span style={{ display: "block", width: `${pct}%`, height: "100%", background: "var(--amber)", borderRadius: 999 }} />
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", marginTop: 5, display: "block" }}>
            {progress.current}/{progress.total}
          </span>
        </span>
      ) : (
        criteria && (
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", lineHeight: 1.3 }}>{criteria}</span>
        )
      )}
    </div>
  );
}

function Star() {
  return <span style={{ width: 20, height: 20, borderRadius: 5, background: "currentColor", transform: "rotate(45deg)", opacity: 0.8 }} />;
}
