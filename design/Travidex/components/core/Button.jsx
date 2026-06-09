import React, { useState } from "react";

/**
 * Travidex Button.
 * Variants: primary (amber action — Log find / Find), positive (green — Navigate/confirm),
 * secondary (neutral surface), ghost (transparent). Physical press squash on dark.
 */
export function Button({
  variant = "primary",
  size = "md",
  full = false,
  disabled = false,
  loading = false,
  icon = null,
  iconRight = null,
  children,
  onClick,
  style,
  ...rest
}) {
  const [pressed, setPressed] = useState(false);

  const palette = {
    primary:   { bg: "var(--amber)",  fg: "var(--text-on-accent)", bd: "transparent", glow: "var(--glow-fab)" },
    positive:  { bg: "var(--green)",  fg: "var(--text-on-accent)", bd: "transparent", glow: "0 6px 20px var(--green-glow)" },
    secondary: { bg: "var(--surface-2)", fg: "var(--text-1)", bd: "var(--border-default)", glow: "none" },
    ghost:     { bg: "transparent", fg: "var(--text-1)", bd: "transparent", glow: "none" },
  }[variant] || {};

  const heights = { md: "var(--btn-h)", sm: "var(--btn-h-sm)" };
  const fonts = { md: "var(--fs-body-lg)", sm: "var(--fs-body)" };

  const isDisabled = disabled || loading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px",
        height: heights[size], padding: size === "sm" ? "0 16px" : "0 22px",
        width: full ? "100%" : "auto",
        border: `1px solid ${palette.bd}`,
        borderRadius: "var(--radius-pill)",
        background: palette.bg, color: palette.fg,
        fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: fonts[size],
        letterSpacing: "-0.01em", whiteSpace: "nowrap",
        boxShadow: variant === "primary" || variant === "positive" ? (pressed ? "none" : palette.glow) : "none",
        opacity: isDisabled ? 0.4 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
        transform: pressed && !isDisabled ? "scale(var(--press-scale))" : "scale(1)",
        filter: pressed && (variant === "primary" || variant === "positive") ? "brightness(var(--press-bright))" : "none",
        transition: "transform var(--dur-fast) var(--ease-out), filter var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
        WebkitTapHighlightColor: "transparent",
        ...style,
      }}
      {...rest}
    >
      {loading ? <Spinner fg={palette.fg} /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

function Spinner({ fg }) {
  return (
    <span
      aria-label="loading"
      style={{
        width: 16, height: 16, borderRadius: "50%",
        border: `2px solid ${fg}`, borderTopColor: "transparent",
        display: "inline-block", animation: "tvx-spin 0.7s linear infinite",
      }}
    >
      <style>{`@keyframes tvx-spin{to{transform:rotate(360deg)}}`}</style>
    </span>
  );
}
