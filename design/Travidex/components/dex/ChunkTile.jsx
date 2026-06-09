import React, { useState } from "react";

/**
 * ChunkTile — a city tile on the country chunk-map (OSRS-Tileman twist).
 * State: claimed (green, full) / progress (amber, partial fill) / untouched (dim).
 * Fill rises from the bottom proportional to completion. Free exploration — always tappable.
 */
export function ChunkTile({ city, region, found = 0, total = 0, onClick, style }) {
  const [pressed, setPressed] = useState(false);
  const pct = total > 0 ? Math.min(100, Math.round((found / total) * 100)) : 0;
  const claimed = pct >= 100;
  const state = claimed ? "claimed" : pct > 0 ? "progress" : "untouched";

  const accent = claimed ? "var(--green)" : pct > 0 ? "var(--amber)" : "var(--locked)";
  const fillBg = claimed ? "var(--green-dim)" : pct > 0 ? "var(--amber-dim)" : "transparent";
  const border = claimed ? "var(--green-line)" : pct > 0 ? "var(--amber-line)" : "var(--border-default)";

  return (
    <button
      type="button" onClick={onClick}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
      style={{
        position: "relative", overflow: "hidden", textAlign: "left",
        aspectRatio: "1 / 1", width: "100%", padding: "12px",
        borderRadius: "var(--radius-md)", border: `1px solid ${border}`,
        background: "var(--surface-1)", cursor: "pointer",
        boxShadow: claimed ? "var(--glow-found)" : "var(--shadow-sm)",
        transform: pressed ? "scale(var(--press-scale))" : "scale(1)",
        transition: "transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-med) var(--ease-out)",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {/* completion fill — rises from the bottom; gradient (no hard line through the label) */}
      <span aria-hidden style={{
        position: "absolute", left: 0, right: 0, bottom: 0, height: `${pct}%`,
        background: claimed ? fillBg : pct > 0 ? `linear-gradient(to top, ${fillBg}, transparent)` : "transparent",
        borderTop: claimed ? "2px solid var(--green)" : "none",
        transition: "height var(--dur-slow) var(--ease-spring)",
      }} />

      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--text-3)",
        }}>{region}</span>
        <Marker state={state} accent={accent} />
      </div>

      <div style={{ position: "relative" }}>
        <div style={{
          fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-1)",
          lineHeight: 1.1,
        }}>{city}</div>
        <div style={{
          fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, marginTop: 4,
          color: claimed ? "var(--green)" : "var(--text-3)",
        }}>{found}<span style={{ color: "var(--text-3)" }}>/{total}</span></div>
      </div>
    </button>
  );
}

function Marker({ state, accent }) {
  if (state === "claimed") {
    return (
      <span style={{
        width: 18, height: 18, borderRadius: "50%", background: accent,
        display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--glow-pin)",
      }}>
        <span style={{ width: 7, height: 4, borderLeft: "2px solid var(--text-on-accent)", borderBottom: "2px solid var(--text-on-accent)", transform: "rotate(-45deg)", marginTop: -1 }} />
      </span>
    );
  }
  return <span style={{ width: 10, height: 10, borderRadius: "50%", background: state === "progress" ? accent : "transparent", border: `2px solid ${state === "progress" ? accent : "var(--locked)"}` }} />;
}
