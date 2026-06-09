import React, { useState } from "react";

/**
 * SightRow — a dex list row. Tapping the row SELECTS the sight (pin⇄row sync /
 * enabling the Log-find action); the right-side "see more" chevron (`onSeeMore`)
 * opens the entry detail. Found rows show a full-color thumb; unfound rows show a
 * HOLLOW thumb (dim outlined box with a faint landmark glyph).
 */
export function SightRow({ name, dexNo, thumb, found = false, distance, status, types = [], selected = false, onClick, onSeeMore, style }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      role="button" onClick={onClick}
      onPointerDown={() => setPressed(true)} onPointerUp={() => setPressed(false)} onPointerLeave={() => setPressed(false)}
      style={{
        display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
        height: "var(--row-h)", padding: "0 8px 0 12px",
        background: selected ? "var(--surface-3)" : "transparent",
        border: "none", borderRadius: "var(--radius-md)",
        boxShadow: selected ? "inset 0 0 0 1px var(--amber-line)" : "none",
        cursor: "pointer", WebkitTapHighlightColor: "transparent",
        transform: pressed ? "scale(0.99)" : "scale(1)",
        transition: "background var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
        ...style,
      }}
    >
      {/* thumbnail — found = full image, unfound = hollow */}
      {found ? (
        <span style={{
          position: "relative", width: 48, height: 48, flex: "none", borderRadius: "var(--radius-sm)",
          overflow: "hidden", background: "var(--ph-base)",
          backgroundImage: "repeating-linear-gradient(135deg, var(--ph-stripe) 0 2px, transparent 2px 9px)",
          boxShadow: "inset 0 0 0 1px var(--border-subtle)",
        }}>
          {thumb && <img src={thumb} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </span>
      ) : (
        <span style={{
          width: 48, height: 48, flex: "none", borderRadius: "var(--radius-sm)",
          background: "var(--surface-2)", boxShadow: "inset 0 0 0 1.5px var(--border-default)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--locked)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 14H2L8 3z"/></svg>
        </span>
      )}

      {/* text */}
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {dexNo != null && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--text-3)", letterSpacing: "0.04em" }}>
              #{String(dexNo).padStart(3, "0")}
            </span>
          )}
          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15,
            color: found ? "var(--text-1)" : "var(--text-2)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{name}</span>
        </span>
        <span style={{
          display: "flex", alignItems: "center", gap: 8,
          fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", letterSpacing: "0.03em",
        }}>
          {distance && <span>{distance}</span>}
          {distance && (status || types.length > 0) && <span style={{ opacity: 0.4 }}>·</span>}
          {status && <span>{status}</span>}
          {!distance && !status && types.length > 0 && <span style={{ color: "var(--blue)" }}>{types.join(" · ")}</span>}
        </span>
      </span>

      {/* see more → entry detail */}
      <span
        role="button" aria-label="See details"
        onClick={(e) => { e.stopPropagation(); onSeeMore && onSeeMore(); }}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          width: 32, height: 32, flex: "none", borderRadius: "50%",
          background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--border-subtle)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </span>
    </div>
  );
}
