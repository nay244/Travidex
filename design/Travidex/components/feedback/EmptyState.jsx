import React from "react";

/**
 * EmptyState — centered icon + title + message + optional action.
 * Copy should nudge, not apologize ("No finds yet. Tap a pin to start your dex.").
 */
export function EmptyState({ icon = null, title, message, action = null, style }) {
  return (
    <div
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", gap: 12, padding: "40px 28px", maxWidth: 320, margin: "0 auto",
        ...style,
      }}
    >
      {icon && (
        <span style={{
          width: 56, height: 56, borderRadius: "50%", background: "var(--surface-2)",
          boxShadow: "inset 0 0 0 1px var(--border-subtle)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-3)", marginBottom: 4,
        }}>{icon}</span>
      )}
      {title && <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: "var(--text-1)" }}>{title}</h3>}
      {message && <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-3)", lineHeight: 1.45 }}>{message}</p>}
      {action && <div style={{ marginTop: 6 }}>{action}</div>}
    </div>
  );
}
