import React from "react";

/**
 * Toast — transient message. tone: success (green) / progress (amber) / info / error.
 * Render fixed near the top or above the tab bar; control visibility from the host.
 */
export function Toast({ tone = "info", icon = null, children, action, onAction, style }) {
  const accent = {
    success: "var(--green)", progress: "var(--amber)", info: "var(--blue)", error: "var(--danger)",
  }[tone] || "var(--blue)";

  return (
    <div
      role="status"
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 14px", maxWidth: 360,
        background: "var(--surface-4)", borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-lg), inset 0 0 0 1px var(--border-default)",
        ...style,
      }}
    >
      <span style={{ width: 3, alignSelf: "stretch", borderRadius: 999, background: accent, flex: "none" }} />
      {icon && <span style={{ color: accent, display: "inline-flex" }}>{icon}</span>}
      <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-1)", lineHeight: 1.35 }}>{children}</span>
      {action && (
        <button type="button" onClick={onAction}
          style={{ background: "none", border: "none", color: accent, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, cursor: "pointer", flex: "none" }}>
          {action}
        </button>
      )}
    </div>
  );
}
