// Travidex UI kit — Sight Detail (the dex entry)
const { useState: useStateDetail } = React;

function SightDetail({ s, onBack, onLog, onNavigate }) {
  const [fav, setFav] = useStateDetail(false);
  const [hintOpen, setHintOpen] = useStateDetail(true);

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 47, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 40 }}>
        {/* hero */}
        <div style={{ position: "relative", height: 300 }}>
          <div className="tvx-photo-ph" data-label="reference photo" style={{ position: "absolute", inset: 0, filter: s.found ? "none" : "grayscale(0.7) brightness(0.5)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,15,20,0.5) 0%, transparent 26%, transparent 55%, var(--bg) 100%)" }} />
          {/* top controls */}
          <div style={{ position: "absolute", top: SAFE_TOP, left: 12, right: 12, display: "flex", justifyContent: "space-between" }}>
            <Press scale={0.9} onClick={onBack} style={glassIcon}><Icon name="chevron-left" size={20} color="var(--text-1)" /></Press>
            <div style={{ display: "flex", gap: 8 }}>
              <Press scale={0.9} onClick={() => setFav(!fav)} style={glassIcon}><Icon name="heart" size={18} color={fav ? "var(--danger)" : "var(--text-1)"} /></Press>
              <Press scale={0.9} style={glassIcon}><Icon name="share" size={17} color="var(--text-1)" /></Press>
            </div>
          </div>
          {/* badges */}
          <div style={{ position: "absolute", bottom: 14, left: 16, display: "flex", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 12, letterSpacing: "0.06em", color: "var(--text-1)", background: "var(--surface-overlay)", backdropFilter: "blur(10px)", padding: "5px 9px", borderRadius: 999, boxShadow: "inset 0 0 0 1px var(--border-default)" }}>#{String(s.dexNo).padStart(3, "0")}</span>
            {s.found && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--green)", background: "var(--green-dim)", padding: "5px 10px", borderRadius: 999, boxShadow: "inset 0 0 0 1px var(--green-line)" }}><Check w={9} t={2} /> Found</span>
            )}
          </div>
          <span style={{ position: "absolute", bottom: 18, right: 16, fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-3)" }}>Reference</span>
        </div>

        <div style={{ padding: "0 20px" }}>
          <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 27, letterSpacing: "-0.015em", color: "var(--text-1)", lineHeight: 1.1 }}>{s.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-3)" }}>
            <Icon name="map-pin" size={14} color="var(--text-3)" /> Kyoto, Japan
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 14 }}>
            {s.types.map((t) => <TypeTag key={t} label={t} />)}
          </div>

          {/* stats */}
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <StatTile icon="footprints" value={s.access} label="Access" />
            <StatTile icon="maximize-2" value={s.size} label="Size" />
            <StatTile icon="users" value={s.busy} label="Busyness" />
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <Btn variant="positive" icon="navigation" full onClick={onNavigate}>Navigate</Btn>
            <Btn variant="primary" icon="plus" full onClick={() => onLog(s)}>Log find</Btn>
          </div>

          {/* hint */}
          <Press scale={1} as="div" onClick={() => setHintOpen(!hintOpen)} style={{ marginTop: 18, padding: 14, borderRadius: "var(--radius-lg)", background: "var(--amber-dim)", boxShadow: "inset 0 0 0 1px var(--amber-line)", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="lightbulb" size={16} color="var(--amber)" />
              <span style={{ flex: 1, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--amber)" }}>Find hint</span>
              <Icon name={hintOpen ? "chevron-up" : "chevron-down"} size={16} color="var(--amber)" />
            </div>
            {hintOpen && <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-2)", lineHeight: 1.5, marginTop: 10 }}>{s.hint}</p>}
          </Press>

          {/* about */}
          <h2 style={sectionH}>About</h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--text-2)", lineHeight: 1.6 }}>{s.about}</p>

          {/* your photos */}
          <h2 style={sectionH}>Your photos</h2>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
            {s.found ? (
              <>
                {[0, 1].map((i) => <div key={i} className="tvx-photo-ph" data-label="your photo" style={{ width: 104, height: 104, flex: "none", borderRadius: "var(--radius-md)" }} />)}
                <div style={{ width: 104, height: 104, flex: "none", borderRadius: "var(--radius-md)", border: "1px dashed var(--border-strong)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--text-3)" }}>
                  <Icon name="plus" size={20} color="var(--text-3)" />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em" }}>ADD</span>
                </div>
              </>
            ) : (
              <div style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-3)", padding: "10px 0" }}>Log this find to start your photo collection.</div>
            )}
          </div>

          {/* recent finds */}
          <h2 style={sectionH}>Recent finds <span style={{ color: "var(--green)", fontFamily: "var(--font-mono)", fontSize: 12 }}>+4 this week</span></h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[["Mira", "2h ago"], ["Devon", "1d ago"], ["Aiko", "3d ago"]].map(([u, d]) => (
              <div key={u} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0" }}>
                <span style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--surface-3)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-2)" }}>{u[0]}</span>
                <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-2)" }}><b style={{ color: "var(--text-1)" }}>{u}</b> found this</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-3)" }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const sectionH = { fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 18, color: "var(--text-1)", margin: "26px 0 12px", display: "flex", alignItems: "center", gap: 8 };

Object.assign(window, { SightDetail });
