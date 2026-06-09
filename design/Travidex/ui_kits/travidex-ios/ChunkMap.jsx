// Travidex UI kit — Explore: Country Chunk-Map with country switcher + state drilldown.
//   tier 'cities' → Country › City (Japan, France)
//   tier 'states' → Country › State › City (United States)
const { useState: useStateCM } = React;

const cityClaimed = (c) => c.total > 0 && c.found >= c.total;
function citiesOf(country) {
  return country.tier === "cities" ? country.cities : country.states.flatMap((s) => s.cities);
}
function stateTotals(s) {
  return { found: s.cities.reduce((a, c) => a + c.found, 0), total: s.cities.reduce((a, c) => a + c.total, 0), claimed: s.cities.filter(cityClaimed).length, cities: s.cities.length };
}
function countrySummary(country) {
  const cs = citiesOf(country);
  const found = cs.reduce((a, c) => a + c.found, 0);
  const total = cs.reduce((a, c) => a + c.total, 0);
  if (country.tier === "cities") {
    const claimed = country.cities.filter(cityClaimed).length;
    return { found, total, claimed, units: country.cities.length, unit: "cities" };
  }
  const claimed = country.states.filter((s) => { const t = stateTotals(s); return t.total > 0 && t.found >= t.total; }).length;
  return { found, total, claimed, units: country.states.length, unit: "states" };
}

function ChunkMap({ countries, onCity }) {
  const [code, setCode] = useStateCM("JP");
  const [stateName, setStateName] = useStateCM(null);
  const [pickerOpen, setPickerOpen] = useStateCM(false);
  const country = countries.find((c) => c.code === code) || countries[0];

  // Determine current level + tiles
  let level, tiles, title, ring, sub, hint;
  if (country.tier === "cities") {
    level = "cities";
    tiles = country.cities;
    const s = countrySummary(country);
    title = country.name; ring = { found: s.claimed, total: s.units };
    sub = <span><span style={{ color: "var(--green)", fontWeight: 700 }}>{s.claimed} of {s.units}</span> cities claimed · {s.found}/{s.total} sights</span>;
    hint = "Find every sight in a city to claim it.";
  } else if (!stateName) {
    level = "states";
    tiles = country.states.map((st) => { const t = stateTotals(st); return { city: st.state, region: st.region, found: t.found, total: t.total, _state: st.state }; });
    const s = countrySummary(country);
    title = country.name; ring = { found: s.claimed, total: s.units };
    sub = <span><span style={{ color: "var(--green)", fontWeight: 700 }}>{s.claimed} of {s.units}</span> states complete · {s.found}/{s.total} sights</span>;
    hint = "Tap a state to explore its cities.";
  } else {
    level = "state-cities";
    const st = country.states.find((s) => s.state === stateName);
    const t = stateTotals(st);
    tiles = st.cities;
    title = stateName; ring = { found: t.claimed, total: t.cities };
    sub = <span><span style={{ color: "var(--green)", fontWeight: 700 }}>{t.claimed} of {t.cities}</span> cities claimed · {t.found}/{t.total} sights</span>;
    hint = "Claim every city to complete the state.";
  }
  const totals = { found: tiles.reduce((a, c) => a + c.found, 0), total: tiles.reduce((a, c) => a + c.total, 0) };

  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: `${SAFE_TOP + 8}px 16px ${TAB_H + 20}px` }}>

        {/* country switcher + list toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Press scale={0.97} onClick={() => setPickerOpen(true)} style={{ display: "inline-flex", alignItems: "center", gap: 9, height: 42, padding: "0 14px", background: "var(--surface-1)", borderRadius: 999, boxShadow: "var(--shadow-sm), inset 0 0 0 1px var(--border-default)", border: "none", cursor: "pointer" }}>
            <span style={{ fontSize: 20 }}>{country.flag}</span>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 16, letterSpacing: "0.02em", color: "var(--text-1)" }}>{country.code}</span>
            <Icon name="chevrons-up-down" size={15} color="var(--text-3)" />
          </Press>
          <span style={{ flex: 1 }} />
          <Press scale={0.94} style={{ ...glassIcon, background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--border-default)" }}>
            <Icon name="list" size={18} color="var(--text-1)" />
          </Press>
        </div>

        {/* breadcrumb / back when inside a state */}
        {level === "state-cities" && (
          <Press scale={0.98} onClick={() => setStateName(null)} style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 12, padding: "6px 12px 6px 8px", background: "var(--surface-2)", borderRadius: 999, border: "none", cursor: "pointer" }}>
            <Icon name="chevron-left" size={15} color="var(--text-2)" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-2)" }}>{country.name} · all states</span>
          </Press>
        )}

        {/* level header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <Ring found={ring.found} total={ring.total} size={62}>
            {level === "state-cities"
              ? <Icon name="map" size={20} color="var(--text-2)" />
              : <span style={{ fontSize: 24 }}>{country.flag}</span>}
          </Ring>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 26, letterSpacing: "-0.015em", color: "var(--text-1)", lineHeight: 1.05 }}>{title}</h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.02em", color: "var(--text-3)", marginTop: 5, lineHeight: 1.4 }}>{sub}</p>
          </div>
        </div>
        <CBar found={totals.found} total={totals.total} showCount={false} height={8} />

        {/* legend */}
        <div style={{ display: "flex", gap: 16, margin: "18px 0 14px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          <Legend c="var(--green)" l={level === "states" ? "Complete" : "Claimed"} />
          <Legend c="var(--amber)" l="In progress" />
          <Legend c="var(--locked)" l="Untouched" />
        </div>

        {/* board */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {tiles.map((c) => (
            <Chunk key={c.city} c={c} onClick={() => c._state ? setStateName(c._state) : onCity(c)} />
          ))}
        </div>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-3)", textAlign: "center", marginTop: 20, lineHeight: 1.5 }}>{hint}</p>
      </div>

      {pickerOpen && (
        <CountryPicker
          countries={countries} code={code}
          onPick={(c) => { setCode(c); setStateName(null); setPickerOpen(false); }}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

function CountryPicker({ countries, code, onPick, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 30, background: "var(--surface-scrim)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--surface-1)", borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-sheet)", borderTop: "1px solid var(--border-default)", padding: "10px 16px 30px", maxHeight: "80%", overflowY: "auto" }}>
        <div style={{ width: 38, height: 5, borderRadius: 999, background: "var(--border-strong)", margin: "0 auto 16px" }} />
        <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 21, letterSpacing: "-0.01em", color: "var(--text-1)", padding: "0 4px 12px" }}>Choose a country</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {countries.map((country) => {
            const s = countrySummary(country);
            const active = country.code === code;
            return (
              <Press key={country.code} scale={0.99} onClick={() => onPick(country.code)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", background: active ? "var(--surface-3)" : "var(--surface-2)", borderRadius: "var(--radius-lg)", boxShadow: active ? "inset 0 0 0 1px var(--green-line)" : "inset 0 0 0 1px var(--border-subtle)", border: "none", cursor: "pointer", textAlign: "left" }}>
                <Ring found={s.claimed} total={s.units} size={46}><span style={{ fontSize: 18 }}>{country.flag}</span></Ring>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>{country.name}</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.03em", textTransform: "uppercase", color: "var(--text-3)", marginTop: 3 }}>{s.claimed}/{s.units} {s.unit} · {s.found}/{s.total} sights</p>
                </div>
                {active
                  ? <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--green)", display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Check c="var(--text-on-accent)" w={9} t={2} /></span>
                  : <Icon name="chevron-right" size={18} color="var(--text-3)" />}
              </Press>
            );
          })}
          <Press scale={0.99} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", background: "var(--surface-2)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", border: "none", cursor: "pointer", marginTop: 2 }}>
            <Icon name="search" size={18} color="var(--text-3)" />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--text-3)" }}>Search 60+ more countries</span>
          </Press>
        </div>
      </div>
    </div>
  );
}

function Legend({ c, l }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-3)" }}><span style={{ width: 9, height: 9, borderRadius: 3, background: c }} />{l}</span>;
}

Object.assign(window, { ChunkMap });
