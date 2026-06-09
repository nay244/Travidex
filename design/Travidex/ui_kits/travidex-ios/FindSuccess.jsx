// Travidex UI kit — Find Success (the reward moment): stamp + confetti + badge unlock
const { useState: useStateFS, useEffect: useEffectFS } = React;

function FindSuccess({ s, foundCount, total, onView, onDone, badge, already = false }) {
  const [go, setGo] = useStateFS(false);
  useEffectFS(() => { const t = setTimeout(() => setGo(true), 60); return () => clearTimeout(t); }, []);

  // confetti specks — only for a genuine new find (not for already-logged)
  const specks = already ? [] : Array.from({ length: 18 }, (_, i) => {
    const colors = ["var(--green)", "var(--amber)", "var(--blue)", "var(--green-bright)"];
    return { left: 8 + Math.random() * 84, top: 8 + Math.random() * 30, delay: Math.random() * 0.3, dur: 1.0 + Math.random() * 0.7, color: colors[i % 4], size: 5 + Math.random() * 5, rot: Math.random() * 360 };
  });

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 48, background: "radial-gradient(120% 80% at 50% 0%, var(--wash-1) 0%, var(--wash-2) 60%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", overflow: "hidden" }}>
      <style>{`
        @keyframes tvx-fall { from { transform: translateY(-12px) rotate(0); opacity: 1; } to { transform: translateY(240px) rotate(300deg); opacity: 0; } }
        @keyframes tvx-pop { from { transform: scale(0.4); } 60% { transform: scale(1.1); } to { transform: scale(1); } }
        .tvx-speck { opacity: 0.85; }
        @media (prefers-reduced-motion: no-preference) {
          .tvx-speck { animation: tvx-fall var(--spd) var(--ease-out) var(--dl) forwards; }
          .tvx-stamp { animation: tvx-pop var(--dur-celebrate) var(--ease-spring); }
        }
      `}</style>
      {/* confetti — scattered, base-visible */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {specks.map((c, i) => (
          <span key={i} className="tvx-speck" style={{ position: "absolute", top: `${c.top}%`, left: `${c.left}%`, width: c.size, height: c.size, background: c.color, borderRadius: i % 2 ? "50%" : 2, transform: `rotate(${c.rot}deg)`, "--spd": `${c.dur}s`, "--dl": `${c.delay}s` }} />
        ))}
      </div>

      {/* stamp — visible at rest; pop is an enhancement */}
      <div className="tvx-stamp">
        <div style={{ width: 116, height: 116, borderRadius: "50%", background: "var(--green-dim)", boxShadow: "inset 0 0 0 2px var(--green-line), 0 0 40px var(--green-glow)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 78, height: 78, borderRadius: "50%", background: "var(--green)", boxShadow: "var(--glow-pin)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check c="var(--text-on-accent)" w={34} t={5} />
          </div>
        </div>
      </div>

      <div style={{ width: "100%", textAlign: "center", marginTop: 28 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--green)" }}>{already ? "Already in your dex" : "Added to your dex"}</p>
        <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 26, letterSpacing: "-0.015em", color: "var(--text-1)", marginTop: 10, lineHeight: 1.12, textWrap: "balance" }}>{s ? s.name : "New find"}</h1>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)", marginTop: 8 }}>#{s ? String(s.dexNo).padStart(3, "0") : "000"} · Kyoto</p>
        {already && <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--text-2)", marginTop: 16, maxWidth: 300, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>You’ve already logged this find. Your dex entry is saved.</p>}
      </div>

      {!already && (
        <React.Fragment>
          {/* completion progress */}
          <div style={{ width: "100%", maxWidth: 320, marginTop: 26, padding: "16px 16px", background: "var(--surface-1)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--border-subtle)" }}>
            <CBar found={foundCount} total={total} label="Kyoto" />
          </div>

          {/* badge unlock */}
          {badge && (
            <div style={{ width: "100%", maxWidth: 320, marginTop: 12, padding: "14px 16px", background: "var(--amber-dim)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--amber-line)", display: "flex", alignItems: "center", gap: 14, animation: "tvx-pop 0.5s var(--ease-spring) 0.4s both" }}>
              <span style={{ width: 46, height: 46, borderRadius: "50%", background: "var(--amber)", boxShadow: "0 0 18px var(--amber-glow)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--text-on-accent)" }}><Icon name={badge.icon} size={22} color="var(--text-on-accent)" /></span>
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--amber)" }}>Badge unlocked</p>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, color: "var(--text-1)", marginTop: 3 }}>{badge.name}</p>
              </div>
            </div>
          )}
        </React.Fragment>
      )}

      <div style={{ width: "100%", maxWidth: 320, display: "flex", gap: 10, marginTop: 24 }}>
        <Btn variant="secondary" full onClick={onDone}>{already ? "Map" : "Done"}</Btn>
        <Btn variant="positive" full onClick={onView}>View entry</Btn>
      </div>
    </div>
  );
}

Object.assign(window, { FindSuccess });
