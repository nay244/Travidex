// Travidex UI kit — Region dex: a Pokédex-style list of every sight in a city/region.
// Found entries show a full image; unfound are hollow. Big faded dex number per row.
const { useState: useStateRD } = React;

const TYPE_META = {
  Historic: { icon: "landmark", tone: "amber" },
  Scenic:   { icon: "mountain", tone: "green" },
  Nature:   { icon: "trees",    tone: "green" },
  Food:     { icon: "utensils", tone: "amber" },
  Icon:     { icon: "star",     tone: "blue" },
  Coastal:  { icon: "waves",    tone: "blue" },
  Modern:   { icon: "building-2", tone: "blue" },
  Sacred:   { icon: "church",   tone: "amber" },
};
function toneOf(t) { return ({ green: "var(--green)", amber: "var(--amber)", blue: "var(--blue)" })[t] || "var(--amber)"; }
function dimOf(t) { return ({ green: "var(--green-dim)", amber: "var(--amber-dim)", blue: "var(--blue-dim)" })[t] || "var(--amber-dim)"; }

function RegionDex({ city, entries, onBack, onSight }) {
  const [q, setQ] = useStateRD("");
  const [favs, setFavs] = useStateRD({});
  const [hlOpen, setHlOpen] = useStateRD(false);
  const list = entries.filter((e) => e.name.toLowerCase().includes(q.toLowerCase()));
  const found = entries.filter((e) => e.found).length;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 46, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* header */}
      <header style={{ flex: "none", padding: `${SAFE_TOP - 6}px 12px 12px`, background: "var(--surface-overlay)", backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))", borderBottom: "1px solid var(--border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Press scale={0.9} onClick={onBack} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="chevron-left" size={22} color="var(--text-1)" />
          </Press>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 21, letterSpacing: "-0.01em", color: "var(--text-1)" }}>{city.city}</h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-3)" }}>{city.region} · <span style={{ color: found >= entries.length ? "var(--green)" : "var(--text-2)" }}>{found}/{entries.length} found</span></p>
          </div>
        </div>
        {/* search + sort/filter */}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, height: 42, padding: "0 12px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", boxShadow: "inset 0 0 0 1px var(--border-subtle)" }}>
            <Icon name="search" size={16} color="var(--text-3)" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${city.city}`} style={{ flex: 1, minWidth: 0, background: "none", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: 15 }} />
          </div>
          <span style={iconBtn}><Icon name="arrow-up-down" size={17} color="var(--text-2)" /></span>
          <span style={iconBtn}><Icon name="sliders-horizontal" size={17} color="var(--text-2)" /></span>
          <Press scale={0.92} onClick={() => setHlOpen(true)} aria-label="Region highlights" style={{ ...iconBtn, border: "none", background: "var(--amber-dim)", boxShadow: "inset 0 0 0 1px var(--amber-line)" }}>
            <Icon name="sparkles" size={17} color="var(--amber)" />
          </Press>
        </div>
      </header>

      {/* list */}
      <div style={{ flex: 1, overflowY: "auto", padding: `12px 16px ${TAB_H + 20}px`, display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map((e) => {
          const meta = TYPE_META[e.types[0]] || TYPE_META.Historic;
          const tone = toneOf(meta.tone);
          const fav = favs[e.id];
          return (
            <Press as="div" key={e.id} scale={0.99} onClick={() => onSight(e)} role="button" style={{
              position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 14,
              minHeight: 74, padding: "12px 14px", borderRadius: "var(--radius-lg)", cursor: "pointer",
              background: e.found ? `linear-gradient(100deg, ${dimOf(meta.tone)}, var(--surface-1) 70%)` : "var(--surface-1)",
              boxShadow: e.found ? `inset 0 0 0 1px ${tone}33` : "inset 0 0 0 1px var(--border-subtle)",
            }}>
              {/* favorite — top right of the entry */}
              <span role="button" aria-label="Favorite" onClick={(ev) => { ev.stopPropagation(); setFavs((f) => ({ ...f, [e.id]: !f[e.id] })); }} onPointerDown={(ev) => ev.stopPropagation()}
                style={{ position: "absolute", top: 10, right: 12, zIndex: 2, width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="heart" size={17} color={fav ? "var(--danger)" : "var(--text-3)"} />
              </span>
              {/* dex number — small, bottom-right */}
              <span style={{ position: "absolute", right: 16, bottom: 12, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 19, letterSpacing: "0.02em", textAlign: "right", color: "var(--text-3)", opacity: e.found ? 0.9 : 0.55, pointerEvents: "none" }}>#{String(e.dexNo).padStart(3, "0")}</span>

              {/* thumbnail */}
              {e.found ? (
                <span style={{ width: 52, height: 52, flex: "none", borderRadius: "var(--radius-md)", background: "var(--ph-base)", backgroundImage: "repeating-linear-gradient(135deg,var(--ph-stripe) 0 2px,transparent 2px 9px)", boxShadow: `inset 0 0 0 1px ${tone}55` }} />
              ) : (
                <span style={{ width: 52, height: 52, flex: "none", borderRadius: "var(--radius-md)", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1.5px var(--border-default)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="mountain" size={20} color="var(--locked)" />
                </span>
              )}

              {/* name + types */}
              <span style={{ position: "relative", flex: 1, minWidth: 0, paddingRight: 58 }}>
                <span style={{ display: "block", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em", color: e.found ? "var(--text-1)" : "var(--text-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.name}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
                  {e.types.map((t) => {
                    const m = TYPE_META[t] || TYPE_META.Historic;
                    return (
                      <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, height: 20, padding: "0 7px", borderRadius: 999, background: dimOf(m.tone), boxShadow: `inset 0 0 0 1px ${toneOf(m.tone)}40`, color: toneOf(m.tone), fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 11 }}>
                        <Icon name={m.icon} size={11} color={toneOf(m.tone)} /> {t}
                      </span>
                    );
                  })}
                </span>
              </span>
            </Press>
          );
        })}
        {list.length === 0 && (
          <p style={{ textAlign: "center", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-3)", padding: "30px 0" }}>No sights match “{q}”.</p>
        )}
      </div>

      {hlOpen && <RegionHighlights city={city} entries={entries} onClose={() => setHlOpen(false)} />}
    </div>
  );
}

const iconBtn = { width: 42, height: 42, flex: "none", borderRadius: "var(--radius-md)", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" };

Object.assign(window, { RegionDex });
