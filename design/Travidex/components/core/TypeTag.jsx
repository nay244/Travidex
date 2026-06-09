import React from "react";

/**
 * TypeTag — a sight's category chip (Historic, Scenic, Icon, Food…).
 * Blue per Travidex semantics (info / classification). Optional leading icon node.
 */
export function TypeTag({ label, icon = null, style }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        height: "var(--chip-h)", padding: "0 10px",
        borderRadius: "var(--radius-pill)",
        background: "var(--blue-dim)",
        boxShadow: "inset 0 0 0 1px var(--blue-line)",
        color: "var(--blue)",
        fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: "13px",
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {icon && <span style={{ display: "inline-flex", opacity: 0.9 }}>{icon}</span>}
      {label}
    </span>
  );
}
