import React from "react";

/**
 * CompletionRing — circular progress. Green at 100% (claimed), amber partial, dim at 0.
 * Center shows percentage by default, or custom `children` (e.g. a flag/count).
 */
export function CompletionRing({ found = 0, total = 0, size = 64, stroke = 6, children, style }) {
  const pct = total > 0 ? Math.min(100, Math.round((found / total) * 100)) : 0;
  const claimed = pct >= 100;
  const color = claimed ? "var(--green)" : pct > 0 ? "var(--amber)" : "var(--locked)";
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);

  return (
    <div style={{ position: "relative", width: size, height: size, ...style }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: claimed ? "drop-shadow(0 0 6px var(--green-glow))" : "none" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset var(--dur-slow) var(--ease-spring), stroke var(--dur-med) var(--ease-out)" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {children != null ? children : (
          <span style={{
            fontFamily: "var(--font-mono)", fontWeight: 700,
            fontSize: Math.max(11, size * 0.22), color: claimed ? "var(--green)" : "var(--text-1)",
          }}>{pct}<span style={{ fontSize: "0.6em", color: "var(--text-3)" }}>%</span></span>
        )}
      </div>
    </div>
  );
}
