import React from "react";

/**
 * NavHeader — top bar with optional back/close, title, and a right action slot.
 * Sits below the status-bar safe area. Use `transparent` over hero imagery/map.
 */
export function NavHeader({ title, onBack, backIcon = null, closeIcon = null, mode = "back", right = null, transparent = false, style }) {
  const leading = mode === "close" ? closeIcon : backIcon;
  return (
    <header
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        height: "var(--navheader-h)", padding: "0 8px",
        background: transparent ? "transparent" : "var(--surface-1)",
        borderBottom: transparent ? "none" : "1px solid var(--border-subtle)",
        ...style,
      }}
    >
      {onBack ? (
        <button type="button" onClick={onBack} aria-label={mode === "close" ? "Close" : "Back"}
          style={iconBtn(transparent)}>
          {leading || <Chevron close={mode === "close"} />}
        </button>
      ) : <span style={{ width: 40 }} />}

      <h1 style={{
        flex: 1, textAlign: "center", margin: 0,
        fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: "17px",
        letterSpacing: "-0.01em", color: "var(--text-1)",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
      }}>{title}</h1>

      <div style={{ minWidth: 40, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </header>
  );
}

function iconBtn(transparent) {
  return {
    width: 40, height: 40, flex: "none", borderRadius: "50%",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    background: transparent ? "var(--surface-overlay)" : "transparent",
    backdropFilter: transparent ? "blur(var(--blur-sm))" : "none",
    border: "none", color: "var(--text-1)", cursor: "pointer",
    WebkitTapHighlightColor: "transparent",
  };
}

function Chevron({ close }) {
  return close ? (
    <span style={{ fontSize: 20, lineHeight: 1 }}>✕</span>
  ) : (
    <span style={{
      width: 11, height: 11, borderLeft: "2px solid currentColor", borderBottom: "2px solid currentColor",
      transform: "rotate(45deg)", marginLeft: 4, borderRadius: 1,
    }} />
  );
}
