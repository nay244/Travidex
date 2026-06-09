import React from "react";

/**
 * SearchBar — rounded inset field with a leading search glyph and optional clear.
 * Used for sights, cities, places. Pass `icon` (search glyph) from the host icon set.
 */
export function SearchBar({ value = "", onChange, placeholder = "Search", icon = null, onClear, style }) {
  return (
    <div
      style={{
        display: "flex", alignItems: "center", gap: "8px",
        height: "var(--input-h)", padding: "0 14px",
        background: "var(--surface-2)", borderRadius: "var(--radius-md)",
        boxShadow: "inset 0 0 0 1px var(--border-subtle)",
        ...style,
      }}
    >
      <span style={{ display: "inline-flex", color: "var(--text-3)", flex: "none" }}>
        {icon || <MagFallback />}
      </span>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{
          flex: 1, minWidth: 0, background: "none", border: "none", outline: "none",
          color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: "16px",
        }}
      />
      {value && (
        <button type="button" onClick={onClear} aria-label="Clear"
          style={{
            width: 22, height: 22, flex: "none", borderRadius: "50%", border: "none",
            background: "var(--surface-4)", color: "var(--text-2)", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 12,
          }}>✕</button>
      )}
    </div>
  );
}

function MagFallback() {
  return (
    <span style={{ position: "relative", width: 16, height: 16, display: "inline-block" }}>
      <span style={{ position: "absolute", width: 11, height: 11, borderRadius: "50%", border: "2px solid currentColor" }} />
      <span style={{ position: "absolute", right: 0, bottom: 0, width: 6, height: 2, background: "currentColor", transform: "rotate(45deg)", transformOrigin: "right" }} />
    </span>
  );
}
