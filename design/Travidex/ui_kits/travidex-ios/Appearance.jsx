// Travidex UI kit — Appearance control (Light default · Dark = premium-locked)
const { useState: useStateAppr } = React;

function Appearance({ theme, premium, onPick, onUnlock, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 60, background: "var(--surface-scrim)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface-1)", borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)",
        boxShadow: "var(--shadow-sheet)", borderTop: "1px solid var(--border-default)", padding: "10px 20px 34px",
      }}>
        <div style={{ width: 38, height: 5, borderRadius: 999, background: "var(--border-strong)", margin: "0 auto 18px" }} />
        <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 21, letterSpacing: "-0.01em", color: "var(--text-1)" }}>Appearance</h2>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-3)", marginTop: 6 }}>Light is on by default. Dark mode is a Travidex+ feature.</p>

        <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
          <ThemeCard mode="light" label="Light" active={theme === "light"} onClick={() => onPick("light")} />
          <ThemeCard mode="dark" label="Dark" active={theme === "dark"} locked={!premium} onClick={() => premium ? onPick("dark") : null} />
        </div>

        {!premium && (
          <Press scale={0.98} onClick={onUnlock} style={{ marginTop: 16, width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: "var(--radius-lg)", background: "var(--amber-dim)", boxShadow: "inset 0 0 0 1px var(--amber-line)", border: "none", cursor: "pointer", textAlign: "left" }}>
            <span style={{ width: 40, height: 40, flex: "none", borderRadius: "50%", background: "var(--amber)", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--glow-fab)" }}>
              <Icon name="sparkles" size={20} color="var(--text-on-accent)" />
            </span>
            <span style={{ flex: 1 }}>
              <span style={{ display: "block", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-1)" }}>Unlock dark mode</span>
              <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em", color: "var(--amber)", marginTop: 2 }}>TRAVIDEX+ · PREVIEW IT HERE</span>
            </span>
            <Icon name="chevron-right" size={18} color="var(--amber)" />
          </Press>
        )}
        {premium && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--green)", marginTop: 16, display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="check" size={14} color="var(--green)" /> Travidex+ active — switch freely
          </p>
        )}
      </div>
    </div>
  );
}

function ThemeCard({ mode, label, active, locked, onClick }) {
  // mini preview swatch for each theme using literal palette (so it reads regardless of active theme)
  const pal = mode === "light"
    ? { bg: "#eceef3", card: "#ffffff", line: "rgba(22,30,48,0.12)", green: "#1f9d57", text: "#161a21", sub: "#838b99" }
    : { bg: "#0d0f14", card: "#12151c", line: "rgba(255,255,255,0.10)", green: "#4ade80", text: "#f3f6fb", sub: "#717b8b" };
  return (
    <Press scale={0.97} onClick={onClick} style={{
      flex: 1, position: "relative", padding: 0, borderRadius: "var(--radius-lg)", overflow: "hidden",
      border: "none", cursor: locked ? "default" : "pointer",
      boxShadow: active ? "0 0 0 2px var(--green)" : "inset 0 0 0 1px var(--border-default)",
    }}>
      {/* preview */}
      <div style={{ height: 96, background: pal.bg, padding: 12, position: "relative" }}>
        <div style={{ height: 22, borderRadius: 6, background: pal.card, boxShadow: `inset 0 0 0 1px ${pal.line}`, display: "flex", alignItems: "center", gap: 6, padding: "0 8px" }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: pal.green }} />
          <span style={{ flex: 1, height: 5, borderRadius: 999, background: pal.line }} />
        </div>
        <div style={{ marginTop: 8, height: 5, width: "70%", borderRadius: 999, background: pal.line }} />
        <div style={{ marginTop: 6, height: 5, width: "50%", borderRadius: 999, background: pal.line }} />
        {locked && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(8,10,14,0.42)", backdropFilter: "blur(1px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.16)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="lock" size={16} color="#fff" />
            </span>
          </div>
        )}
      </div>
      {/* label row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "var(--surface-2)" }}>
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>{label}</span>
        {active
          ? <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--green)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Check c="var(--text-on-accent)" w={8} t={2} /></span>
          : locked
            ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", color: "var(--amber)", background: "var(--amber-dim)", padding: "3px 6px", borderRadius: 999, boxShadow: "inset 0 0 0 1px var(--amber-line)" }}>TRAVIDEX+</span>
            : <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid var(--border-strong)" }} />}
      </div>
    </Press>
  );
}

Object.assign(window, { Appearance });
