import React from "react";

/**
 * Travidex Avatar — user photo or initials. Optional accent ring (e.g. own profile).
 */
export function Avatar({ src, name = "", size = 40, ring = false, ringColor = "var(--green)", style }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      style={{
        width: size, height: size, flex: "none", borderRadius: "50%",
        background: "var(--surface-3)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden", position: "relative",
        boxShadow: ring ? `0 0 0 2px var(--bg), 0 0 0 4px ${ringColor}` : "inset 0 0 0 1px var(--border-default)",
        ...style,
      }}
    >
      {src ? (
        <img src={src} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{
          fontFamily: "var(--font-sans)", fontWeight: 600,
          fontSize: Math.max(11, size * 0.36), color: "var(--text-2)", letterSpacing: "-0.01em",
        }}>{initials || "•"}</span>
      )}
    </div>
  );
}
