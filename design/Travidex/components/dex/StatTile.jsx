import React from "react";

/**
 * StatTile — icon + value + label. Value in mono. Used in stat strips
 * (Sight Detail: Access/Size/Busyness) and Profile stats.
 */
export function StatTile({ icon = null, value, label, tone = "neutral", style }) {
  const valColor = { neutral: "var(--text-1)", found: "var(--green)", info: "var(--blue)", progress: "var(--amber)" }[tone] || "var(--text-1)";
  return (
    <div
      style={{
        flex: 1, minWidth: 0, padding: "12px 10px",
        background: "var(--surface-2)", borderRadius: "var(--radius-md)",
        boxShadow: "inset 0 0 0 1px var(--border-subtle)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 6, textAlign: "center",
        ...style,
      }}
    >
      {icon && <span style={{ color: "var(--text-3)", display: "inline-flex" }}>{icon}</span>}
      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 19, color: valColor, lineHeight: 1 }}>{value}</span>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
        color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%",
      }}>{label}</span>
    </div>
  );
}
