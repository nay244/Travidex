import React from "react";

const TONES = {
  found:    { fg: "var(--green)", bg: "var(--green-dim)", line: "var(--green-line)" },
  progress: { fg: "var(--amber)", bg: "var(--amber-dim)", line: "var(--amber-line)" },
  info:     { fg: "var(--blue)",  bg: "var(--blue-dim)",  line: "var(--blue-line)" },
  neutral:  { fg: "var(--text-2)", bg: "var(--surface-2)", line: "var(--border-default)" },
  danger:   { fg: "var(--danger)", bg: "var(--danger-dim)", line: "rgba(255,107,107,0.4)" },
};

/**
 * Badge — small status/label pill. Use for submission status (Pending=progress,
 * Approved=found, Rejected=danger), found markers, "Community" flags, etc.
 */
export function Badge({ tone = "neutral", label, dot = false, icon = null, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: "5px",
        height: "22px", padding: "0 8px",
        borderRadius: "var(--radius-pill)",
        background: t.bg, color: t.fg,
        boxShadow: `inset 0 0 0 1px ${t.line}`,
        fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "10px",
        letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap",
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.fg }} />}
      {icon}
      {label}
    </span>
  );
}

/** CountBadge — numeric notification badge (e.g. tab bar, feed). */
export function CountBadge({ count, max = 99, style }) {
  const text = count > max ? `${max}+` : String(count);
  return (
    <span
      style={{
        minWidth: 18, height: 18, padding: "0 5px", borderRadius: "var(--radius-pill)",
        background: "var(--amber)", color: "var(--text-on-accent)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "10px",
        boxShadow: "0 0 0 2px var(--bg)", ...style,
      }}
    >
      {text}
    </span>
  );
}
