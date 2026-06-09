// Travidex UI kit — Welcome (onboarding entry), collector's-board hero
function Welcome({ onEnter }) {
  // a believable spread: a few claimed/in-progress, the rest waiting — "your board to fill"
  const board = [
    "u", "p", "u", "c", "u",
    "c", "u", "u", "p", "u",
    "u", "p", "c", "u", "u",
    "u", "u", "c", "u", "p",
  ];
  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        .tvx-apple { background:#000; color:#fff; }
        [data-theme="dark"] .tvx-apple { background:#fff; color:#000; }
      `}</style>

      {/* collector's board hero */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 90% at 50% -10%, var(--wash-1) 0%, var(--wash-2) 70%)" }} />
        <div style={{ position: "absolute", top: SAFE_TOP - 6, left: 0, right: 0, padding: "0 20px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, transform: "rotate(-4deg) scale(1.12)", transformOrigin: "center top", opacity: 0.95 }}>
          {board.map((s, i) => <MiniTile key={i} state={s} />)}
        </div>
        {/* fade board into the page */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, var(--bg) 92%)" }} />
      </div>

      {/* content */}
      <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: `${SAFE_TOP + 24}px 28px 40px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="../../assets/travidex-mark.svg" width="44" height="44" alt="Travidex" />
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, letterSpacing: "-0.02em", color: "var(--text-1)" }}>Travi<span style={{ color: "var(--green)" }}>dex</span></span>
        </div>

        <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 38, letterSpacing: "-0.02em", color: "var(--text-1)", marginTop: 22, lineHeight: 1.05, textWrap: "balance" }}>
          Collect the world, one <span style={{ color: "var(--green)" }}>sight</span> at a time.
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--text-2)", lineHeight: 1.5, marginTop: 16, maxWidth: 320 }}>
          Find real places, log your discoveries, and claim a city when you've found every sight.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 26 }}>
          <Press scale={0.98} onClick={onEnter} className="tvx-apple" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: "var(--radius-pill)", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, cursor: "pointer", border: "none" }}>
            <Icon name="apple" size={18} color="currentColor" /> Sign in with Apple
          </Press>
          <Btn variant="secondary" full onClick={onEnter}>Continue with email</Btn>
          <button onClick={onEnter} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-2)", padding: "10px 0", marginTop: 2 }}>
            Already have an account? <span style={{ color: "var(--green)", fontWeight: 600 }}>Log in</span>
          </button>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, color: "var(--text-3)", textAlign: "center", lineHeight: 1.5, marginTop: 2 }}>
            By continuing you agree to our <span style={{ color: "var(--text-2)" }}>Terms</span> & <span style={{ color: "var(--text-2)" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

function MiniTile({ state }) {
  const accent = state === "c" ? "var(--green)" : state === "p" ? "var(--amber)" : "var(--locked)";
  const fillBg = state === "c" ? "var(--green-dim)" : state === "p" ? "var(--amber-dim)" : "transparent";
  const border = state === "c" ? "var(--green-line)" : state === "p" ? "var(--amber-line)" : "var(--border-default)";
  const pct = state === "c" ? 100 : state === "p" ? 45 : 0;
  return (
    <div style={{ position: "relative", overflow: "hidden", aspectRatio: "1", borderRadius: "var(--radius-sm)", border: `1px solid ${border}`, background: "var(--surface-1)", boxShadow: state === "c" ? "var(--glow-found)" : "var(--shadow-sm)" }}>
      <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${pct}%`, background: fillBg, borderTop: pct > 0 ? `2px solid ${accent}` : "none" }} />
      {state === "c" && (
        <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: "50%", background: accent, boxShadow: "var(--glow-pin)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Check c="var(--text-on-accent)" w={6} t={1.6} />
        </span>
      )}
    </div>
  );
}

Object.assign(window, { Welcome });
