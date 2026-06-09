// Travidex UI kit — Profile Art picker (unlock designs as you explore)
function ProfileArt({ selected, progress, onPick, onClose }) {
  const unlockedCount = PROFILE_ART.filter((a) => artUnlocked(a, progress)).length;
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 60, background: "var(--surface-scrim)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "var(--surface-1)", borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)",
        boxShadow: "var(--shadow-sheet)", borderTop: "1px solid var(--border-default)", padding: "10px 20px 34px", maxHeight: "84%", overflowY: "auto",
      }}>
        <div style={{ width: 38, height: 5, borderRadius: 999, background: "var(--border-strong)", margin: "0 auto 18px" }} />
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 21, letterSpacing: "-0.01em", color: "var(--text-1)" }}>Profile art</h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em", color: "var(--green)" }}>{unlockedCount}/{PROFILE_ART.length} UNLOCKED</span>
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-3)", marginTop: 6 }}>Unlock new banners as you find sights, claim cities, and explore countries.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
          {PROFILE_ART.map((art) => {
            const unlocked = artUnlocked(art, progress);
            const active = selected === art.id;
            const prog = art.progress ? art.progress(progress) : null;
            return (
              <Press key={art.id} scale={unlocked ? 0.97 : 1} onClick={() => unlocked ? onPick(art.id) : null} style={{
                position: "relative", padding: 0, borderRadius: "var(--radius-lg)", overflow: "hidden", border: "none",
                cursor: unlocked ? "pointer" : "default", textAlign: "left",
                boxShadow: active ? "0 0 0 2px var(--green)" : "inset 0 0 0 1px var(--border-default)",
              }}>
                {/* preview */}
                <div style={{ position: "relative", height: 74 }}>
                  <ArtLayer id={art.id} />
                  {!unlocked && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(8,10,14,0.5)", backdropFilter: "blur(1.5px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.18)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="lock" size={15} color="#fff" />
                      </span>
                    </div>
                  )}
                  {active && (
                    <span style={{ position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: "50%", background: "var(--green)", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--glow-pin)" }}>
                      <Check c="var(--text-on-accent)" w={9} t={2} />
                    </span>
                  )}
                </div>
                {/* label */}
                <div style={{ padding: "10px 12px", background: "var(--surface-2)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: unlocked ? "var(--text-1)" : "var(--text-3)" }}>{art.name}</span>
                    {art.free && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em", color: "var(--text-3)" }}>FREE</span>}
                  </div>
                  {!unlocked && (
                    <div style={{ marginTop: 7 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.02em", color: "var(--amber)", display: "flex", alignItems: "center", gap: 5 }}>
                        <Icon name="lock" size={10} color="var(--amber)" /> {art.criteria}
                      </span>
                      {prog && (
                        <div style={{ marginTop: 6, height: 4, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden" }}>
                          <div style={{ width: `${Math.min(100, (prog.current / prog.total) * 100)}%`, height: "100%", background: "var(--amber)", borderRadius: 999 }} />
                        </div>
                      )}
                    </div>
                  )}
                  {unlocked && !art.free && <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.06em", color: "var(--green)" }}>UNLOCKED</span>}
                </div>
              </Press>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProfileArt });
