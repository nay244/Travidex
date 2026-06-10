// Travidex UI kit — Map location switcher.
// Opened from the Map location pill. Two views:
//   • cities    — current country header (tap to change country) + searchable city list
//   • countries — pick a different country (reuses the flag assets)
// Picking a city jumps the Map there; picking a country re-scopes the city list.
const { useState: useStateLP } = React;

function lpCities(country) {
  if (country.tier === "cities") return country.cities;
  return country.states.flatMap((s) => s.cities);
}
function lpSummary(country) {
  const cs = lpCities(country);
  const found = cs.reduce((a, c) => a + c.found, 0);
  const total = cs.reduce((a, c) => a + c.total, 0);
  const claimed = cs.filter((c) => c.total > 0 && c.found >= c.total).length;
  return { found, total, claimed, units: cs.length };
}

function LocationPicker({ countries, location, onPick, onClose }) {
  const [view, setView] = useStateLP("cities");
  const [browse, setBrowse] = useStateLP(location.code);
  const [q, setQ] = useStateLP("");
  const country = countries.find((c) => c.code === browse) || countries[0];

  const cities = lpCities(country).filter((c) =>
    !q || c.city.toLowerCase().includes(q.toLowerCase()) || (c.region || "").toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 30, background: "var(--surface-scrim)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface-1)", borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-sheet)", borderTop: "1px solid var(--border-default)", padding: "10px 16px 30px", maxHeight: "86%", display: "flex", flexDirection: "column" }}>
        <div style={{ width: 38, height: 5, borderRadius: 999, background: "var(--border-strong)", margin: "0 auto 16px", flex: "none" }} />

        {view === "countries" ? (
          <React.Fragment>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Press scale={0.9} onClick={() => setView("cities")} style={{ width: 34, height: 34, marginLeft: -6, borderRadius: "50%", border: "none", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <Icon name="chevron-left" size={22} color="var(--text-1)" />
              </Press>
              <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 21, letterSpacing: "-0.01em", color: "var(--text-1)" }}>Choose a country</h2>
            </div>
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
              {countries.map((c) => {
                const s = lpSummary(c);
                const active = c.code === browse;
                return (
                  <Press key={c.code} scale={0.99} onClick={() => { setBrowse(c.code); setQ(""); setView("cities"); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: active ? "var(--surface-3)" : "var(--surface-2)", borderRadius: "var(--radius-lg)", boxShadow: active ? "inset 0 0 0 1px var(--green-line)" : "inset 0 0 0 1px var(--border-subtle)", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <Flag code={c.code} size={34} radius={6} style={{ boxShadow: "inset 0 0 0 1px var(--border-subtle)" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>{c.name}</p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--text-3)", marginTop: 3 }}>{s.claimed}/{s.units} {c.tier === "states" ? "states" : "cities"} · {s.found}/{s.total} sights</p>
                    </div>
                    <Icon name="chevron-right" size={18} color="var(--text-3)" />
                  </Press>
                );
              })}
              <Press scale={0.99} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", background: "var(--surface-2)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", border: "none", cursor: "pointer", marginTop: 2 }}>
                <Icon name="search" size={18} color="var(--text-3)" />
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--text-3)" }}>Search 60+ more countries</span>
              </Press>
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* current country — tap to change */}
            <Press scale={0.99} onClick={() => setView("countries")} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "var(--surface-2)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", border: "none", cursor: "pointer", textAlign: "left", flex: "none" }}>
              <Flag code={country.code} size={32} radius={6} style={{ boxShadow: "inset 0 0 0 1px var(--border-subtle)" }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>Country</p>
                <p style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em", color: "var(--text-1)", marginTop: 1 }}>{country.name}</p>
              </div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 30, padding: "0 12px", borderRadius: 999, background: "var(--surface-3)", boxShadow: "inset 0 0 0 1px var(--border-default)" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: "var(--text-1)" }}>Change</span>
                <Icon name="chevrons-up-down" size={14} color="var(--text-3)" />
              </span>
            </Press>

            {/* city search */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, height: 46, padding: "0 14px", margin: "12px 0 6px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", flex: "none" }}>
              <Icon name="search" size={16} color="var(--text-3)" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search cities in ${country.name}`} style={{ flex: 1, minWidth: 0, background: "none", border: "none", outline: "none", color: "var(--text-1)", fontFamily: "var(--font-sans)", fontSize: 15 }} />
            </div>

            <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", margin: "10px 4px 8px", flex: "none" }}>Cities in {country.name}</p>
            <div style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
              {cities.map((c) => {
                const claimed = c.total > 0 && c.found >= c.total;
                const current = country.code === location.code && c.city === location.city;
                return (
                  <Press key={c.city} scale={0.99} onClick={() => onPick(country.code, c.city)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 10px", background: current ? "var(--surface-3)" : "transparent", borderRadius: "var(--radius-md)", boxShadow: current ? "inset 0 0 0 1px var(--green-line)" : "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                    <Icon name="map-pin" size={16} color={claimed ? "var(--green)" : "var(--text-3)"} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-1)" }}>{c.city}</p>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--text-3)", marginTop: 2 }}>{c.region}</p>
                    </div>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: claimed ? "var(--green)" : "var(--text-3)" }}>{c.found}<span style={{ color: "var(--text-3)" }}>/{c.total}</span></span>
                    {current
                      ? <span style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--green)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Check c="var(--text-on-accent)" w={8} t={2} /></span>
                      : <Icon name="chevron-right" size={16} color="var(--text-3)" />}
                  </Press>
                );
              })}
              {cities.length === 0 && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-3)", textAlign: "center", padding: "20px 0" }}>No cities match "{q}".</p>
              )}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LocationPicker });
