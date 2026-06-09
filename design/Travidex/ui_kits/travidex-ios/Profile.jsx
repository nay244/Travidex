// Travidex UI kit — Profile (art-as-background · stats · world · badge & achievement rails)
function Profile({ achievements, badgeYears, sightsFound, citiesClaimed, countries = 3, theme, premium, artId, onOpenAppearance, onOpenArt, onOpenBadges, onOpenAchievements }) {
  const art = artById(artId);

  // 4 most-recent earned monthly badges (years desc, months desc)
  const recentBadges = [];
  for (const y of badgeYears) {
    for (let i = y.months.length - 1; i >= 0; i--) {
      const m = y.months[i];
      if (m.earned) recentBadges.push({ icon: m.icon, tone: m.tone, label: m.month.slice(0, 3), earned: true });
    }
  }
  const badgeSlots = fillSlots(recentBadges, 4);
  const achEarned = achievements.filter((a) => a.earned).map((a) => ({ icon: a.icon, tone: a.tone, label: a.name.split(" ")[0], earned: true, number: a.level }));
  const achSlots = fillSlots(achEarned, 4);

  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg)", overflow: "hidden" }}>
      {/* full-screen profile background art */}
      <ArtLayer id={artId} style={{ inset: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: "var(--art-veil)" }} />

      {/* settings */}
      <Press scale={0.9} onClick={onOpenAppearance} style={{ position: "absolute", top: SAFE_TOP - 4, right: 16, zIndex: 3, width: 40, height: 40, borderRadius: "50%", border: "none", background: "var(--surface-overlay)", backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))", display: "inline-flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-sm)", cursor: "pointer" }}>
        <Icon name="settings" size={18} color="var(--text-1)" />
      </Press>

      {/* scrolling content */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, overflowY: "auto", padding: `${SAFE_TOP + 18}px 20px ${TAB_H + 20}px` }}>
        {/* identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ width: 80, height: 80, flex: "none", borderRadius: "50%", background: "var(--surface-3)", boxShadow: "0 0 0 4px var(--bg)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 28, color: "var(--text-2)" }}>JP</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 23, letterSpacing: "-0.01em", color: "var(--text-1)" }}>Jordan Pace</h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.03em", color: "var(--text-2)", marginTop: 3 }}>@jetpacker · SINCE 2026</p>
          </div>
        </div>

        {/* Sights / Cities / Countries */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 18 }}>
          <StatTile icon="map-pin" value={sightsFound} label="Sights" />
          <StatTile icon="flag" value={citiesClaimed} label="Cities" />
          <StatTile icon="globe" value={countries} label="Countries" />
        </div>

        {/* World progress */}
        <div style={{ marginTop: 12, padding: 16, background: "var(--surface-1)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", display: "flex", alignItems: "center", gap: 16 }}>
          <Ring found={62} total={400} size={60} />
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, color: "var(--text-1)" }}>World completion</p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.02em", color: "var(--text-3)", marginTop: 4 }}>
              <span style={{ color: "var(--green)", fontWeight: 700 }}>62</span> / 400 sights · {countries} countries started
            </p>
          </div>
        </div>

        {/* Badges rail */}
        <Rail title="Badges" items={badgeSlots} onOpen={onOpenBadges} />
        {/* Achievements rail */}
        <Rail title="Achievements" items={achSlots} onOpen={onOpenAchievements} />

        {/* Customize */}
        <RailHead title="Customize" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Press scale={0.99} onClick={onOpenAppearance} style={rowStyle}>
            <Icon name={theme === "dark" ? "moon" : "sun"} size={18} color="var(--text-2)" />
            <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-1)" }}>Appearance</span>
            {!premium && <span style={tagStyle}>TRAVIDEX+</span>}
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-3)" }}>{theme}</span>
            <Icon name="chevron-right" size={16} color="var(--text-3)" />
          </Press>
          <Press scale={0.99} onClick={onOpenArt} style={rowStyle}>
            <span style={{ position: "relative", width: 30, height: 30, borderRadius: 8, overflow: "hidden", flex: "none", boxShadow: "inset 0 0 0 1px var(--border-default)" }}><ArtLayer id={artId} /></span>
            <span style={{ flex: 1, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: "var(--text-1)" }}>Profile art</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-3)" }}>{art.name}</span>
            <Icon name="chevron-right" size={16} color="var(--text-3)" />
          </Press>
        </div>
      </div>
    </div>
  );
}

function fillSlots(items, n) {
  const out = items.slice(0, n);
  while (out.length < n) out.push({ earned: false });
  return out;
}

function RailHead({ title, onOpen }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "24px 0 12px" }}>
      <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 18, color: "var(--text-1)" }}>{title}</h2>
      {onOpen && (
        <Press scale={0.88} onClick={onOpen} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <Icon name="chevron-right" size={17} color="var(--text-2)" />
        </Press>
      )}
    </div>
  );
}

function Rail({ title, items, onOpen }) {
  return (
    <div>
      <RailHead title={title} onOpen={onOpen} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
        {items.map((it, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
            <Medallion icon={it.icon} tone={it.tone} earned={it.earned} size={58} number={it.number} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.04em", textTransform: "uppercase", color: it.earned ? "var(--text-2)" : "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>{it.earned ? it.label : "Locked"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const rowStyle = { width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: "var(--surface-1)", borderRadius: "var(--radius-lg)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", border: "none", cursor: "pointer", textAlign: "left" };
const tagStyle = { fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", color: "var(--amber)", background: "var(--amber-dim)", padding: "3px 7px", borderRadius: 999, boxShadow: "inset 0 0 0 1px var(--amber-line)" };

Object.assign(window, { Profile });
