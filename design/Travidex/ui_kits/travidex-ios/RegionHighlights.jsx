// Travidex UI kit — Region highlights: capture a shareable recap of a region.
// Composed from the user's own photos across the region's FOUND sights (the same
// photos that live under Sight Detail → "Your photos"). Share in-app (friends
// feed) or off-app (save / system share).
const { useState: useStateRH } = React;

function RegionHighlights({ city, entries, onClose }) {
  const foundEntries = entries.filter((e) => e.found);
  // 2 photos per found sight — mirrors Sight Detail's "Your photos"
  const allPhotos = foundEntries.flatMap((e, i) => [
    { key: `${e.id}a`, sight: e.name, dexNo: e.dexNo },
    { key: `${e.id}b`, sight: e.name, dexNo: e.dexNo },
  ]);
  const [excluded, setExcluded] = useStateRH({});
  const [toast, setToast] = useStateRH(null);
  const [moreOpen, setMoreOpen] = useStateRH(false);
  const selected = allPhotos.filter((p) => !excluded[p.key]);

  function toggle(key) { setExcluded((x) => ({ ...x, [key]: !x[key] })); }
  function ping(msg) { setToast(msg); setTimeout(() => setToast(null), 1800); }

  const monthYear = "JUN 2026";

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 48, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <header style={{ flex: "none", display: "flex", alignItems: "center", height: 52, padding: `${SAFE_TOP - 8}px 8px 0`, background: "var(--surface-overlay)", backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))", borderBottom: "1px solid var(--border-subtle)", boxSizing: "content-box" }}>
        <Press scale={0.9} onClick={onClose} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="x" size={20} color="var(--text-1)" />
        </Press>
        <h1 style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: "var(--text-1)" }}>Region highlights</h1>
        <span style={{ width: 40 }} />
      </header>

      {foundEntries.length === 0 ? (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 40px", gap: 12 }}>
          <span style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="sparkles" size={22} color="var(--text-3)" />
          </span>
          <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: "var(--text-1)" }}>No highlights yet</h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-3)", lineHeight: 1.5 }}>Find a sight in {city.city} and add photos — they'll come together here.</p>
        </div>
      ) : (
        <React.Fragment>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 130px" }}>
            {/* ── the highlight card (4:5, share-ready) ── */}
            <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 5", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "var(--surface-1)", boxShadow: "var(--shadow-lg), inset 0 0 0 1px var(--border-default)" }}>
              {/* photo mosaic */}
              <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridAutoRows: "1fr", gap: 3 }}>
                {selected.slice(0, 9).map((p, i) => (
                  <div key={p.key} className="tvx-photo-ph" data-label={i === 0 || i === 4 ? p.sight.split(" ").slice(0, 2).join(" ").toLowerCase() : ""} style={{ gridColumn: i === 0 ? "span 2" : "auto", gridRow: i === 0 ? "span 2" : "auto" }} />
                ))}
                {selected.length === 0 && (
                  <div style={{ gridColumn: "span 3", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-3)" }}>Select at least one photo</div>
                )}
              </div>
              {/* top + bottom scrims */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,12,16,0.55) 0%, transparent 22%, transparent 64%, rgba(10,12,16,0.78) 100%)", pointerEvents: "none" }} />
              {/* header strip */}
              <div style={{ position: "absolute", top: 14, left: 16, right: 16, display: "flex", alignItems: "center", gap: 9 }}>
                <Flag code={city.code || "JP"} size={22} radius={5} />
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: "#f3f6fb" }}>{city.city}</span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(243,246,251,0.75)" }}>my highlights</span>
              </div>
              {/* footer strip */}
              <div style={{ position: "absolute", bottom: 12, left: 16, right: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <img src="../../assets/travidex-mark.svg" width="22" height="22" alt="" />
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 13, color: "#f3f6fb" }}>Travi<span style={{ color: "var(--green)" }}>dex</span></span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(243,246,251,0.8)" }}>{foundEntries.length}/{entries.length} sights · {monthYear}</span>
              </div>
            </div>

            {/* ── photo selection ── */}
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "20px 2px 10px" }}>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>Your photos</h2>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", letterSpacing: "0.04em" }}>{selected.length} OF {allPhotos.length} SELECTED</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
              {allPhotos.map((p) => {
                const off = excluded[p.key];
                return (
                  <Press key={p.key} scale={0.93} onClick={() => toggle(p.key)} style={{ position: "relative", aspectRatio: "1", borderRadius: "var(--radius-sm)", overflow: "hidden", border: "none", padding: 0, cursor: "pointer", boxShadow: off ? "inset 0 0 0 1px var(--border-default)" : "0 0 0 2px var(--green)", opacity: off ? 0.45 : 1, background: "none" }}>
                    <span className="tvx-photo-ph" data-label="" style={{ position: "absolute", inset: 0 }} />
                    {!off && (
                      <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: "var(--green)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Check c="var(--text-on-accent)" w={7} t={1.8} /></span>
                    )}
                    <span style={{ position: "absolute", left: 4, right: 4, bottom: 3, fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.04em", color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left" }}>#{String(p.dexNo).padStart(3, "0")}</span>
                  </Press>
                );
              })}
            </div>
          </div>

          {/* ── share actions ── */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "12px 20px 30px", background: "linear-gradient(to top, var(--bg) 70%, transparent)", display: "flex", flexDirection: "column", gap: 9 }}>
            {moreOpen && (
              <div style={{ display: "flex", gap: 8 }}>
                {[["download", "Save image"], ["message-circle", "Messages"], ["instagram", "Stories"], ["link", "Copy link"]].map(([ic, label]) => (
                  <Press key={label} scale={0.95} onClick={() => ping(label === "Copy link" ? "Link copied" : `Shared via ${label}`)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "10px 4px", borderRadius: "var(--radius-md)", border: "none", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", cursor: "pointer" }}>
                    <Icon name={ic} size={17} color="var(--text-2)" />
                    <span style={{ fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: 600, color: "var(--text-2)" }}>{label}</span>
                  </Press>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <Btn variant="positive" full icon="users" disabled={selected.length === 0} onClick={() => ping("Shared to your friends feed")}>Share to friends</Btn>
              <Btn variant="secondary" full icon="share" disabled={selected.length === 0} onClick={() => setMoreOpen(!moreOpen)}>Share elsewhere</Btn>
            </div>
          </div>

          {/* toast */}
          {toast && (
            <div style={{ position: "absolute", left: "50%", bottom: 116, transform: "translateX(-50%)", zIndex: 5, display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, background: "var(--surface-4)", boxShadow: "var(--shadow-lg), inset 0 0 0 1px var(--border-default)", whiteSpace: "nowrap" }}>
              <Icon name="check" size={14} color="var(--green)" />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{toast}</span>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}

Object.assign(window, { RegionHighlights });
