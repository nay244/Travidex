import React from "react";

/**
 * SightPin — a map marker. found = bright green + glow, unseen = dim,
 * selected = amber + enlarged. Optional dex number inside. `cluster` shows a count bubble.
 */
export function SightPin({ state = "unseen", dexNo, selected = false, cluster = 0, onClick, style }) {
  if (cluster > 1) {
    return (
      <button type="button" onClick={onClick} aria-label={`${cluster} sights`}
        style={{
          width: 38, height: 38, borderRadius: "50%", border: "2px solid var(--bg)",
          background: "var(--surface-3)", color: "var(--text-1)", cursor: "pointer",
          fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13,
          boxShadow: "var(--shadow-md)", ...style,
        }}>{cluster}</button>
    );
  }

  const color = selected ? "var(--amber)" : state === "found" ? "var(--green)" : "var(--locked)";
  const size = selected ? 40 : 32;
  const glow = state === "found" && !selected ? "var(--glow-pin)" : selected ? "0 0 16px var(--amber-glow)" : "var(--shadow-sm)";

  return (
    <button
      type="button" onClick={onClick}
      aria-label={state === "found" ? "Found sight" : "Unseen sight"}
      style={{
        position: "relative", width: size, height: size, flex: "none",
        borderRadius: "50%", border: "2px solid var(--bg)",
        background: color, cursor: "pointer", padding: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        boxShadow: glow,
        transform: selected ? "scale(1)" : "scale(1)",
        transition: "all var(--dur-med) var(--ease-spring)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
    >
      {state === "found" && !dexNo && <Check />}
      {dexNo != null && (
        <span style={{
          fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11,
          color: "var(--text-on-accent)",
        }}>{dexNo}</span>
      )}
      {state !== "found" && dexNo == null && (
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.45)" }} />
      )}
    </button>
  );
}

function Check() {
  return (
    <span style={{
      width: 12, height: 7, borderLeft: "2.5px solid var(--text-on-accent)",
      borderBottom: "2.5px solid var(--text-on-accent)", transform: "rotate(-45deg)",
      marginTop: -2, borderRadius: 1,
    }} />
  );
}
