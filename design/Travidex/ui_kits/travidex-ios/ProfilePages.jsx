// Travidex UI kit — full pages opened from the profile rails:
//   BadgesPage (monthly badges by year) · AchievementsPage (+ AchievementDetail)
const { useState: useStatePP } = React;

function toneColors(tone) {
  return {
    green: { fg: "var(--green)", dim: "var(--green-dim)", line: "var(--green-line)" },
    amber: { fg: "var(--amber)", dim: "var(--amber-dim)", line: "var(--amber-line)" },
    blue: { fg: "var(--blue)", dim: "var(--blue-dim)", line: "var(--blue-line)" },
  }[tone] || { fg: "var(--amber)", dim: "var(--amber-dim)", line: "var(--amber-line)" };
}

// Shared collectible medallion. earned → tone fill + icon; locked → lock or hollow icon.
function Medallion({ icon, tone = "amber", size = 72, earned = true, hollow = false, number }) {
  const t = toneColors(tone);
  if (!earned) {
    return (
      <span style={{ position: "relative", width: size, height: size, borderRadius: "50%", flex: "none", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1.5px var(--border-default)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name={hollow ? icon : "lock"} size={size * 0.34} color="var(--locked)" />
      </span>
    );
  }
  return (
    <span style={{ position: "relative", width: size, height: size, borderRadius: "50%", flex: "none", background: `radial-gradient(120% 120% at 50% 25%, ${t.dim}, var(--surface-1))`, boxShadow: `inset 0 0 0 2px ${t.line}, 0 0 16px ${t.dim}`, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <Icon name={icon} size={size * 0.4} color={t.fg} />
      {number != null && (
        <span style={{ position: "absolute", bottom: -2, right: -2, minWidth: 22, height: 22, padding: "0 5px", borderRadius: 999, background: t.fg, color: "var(--text-on-accent)", boxShadow: "0 0 0 2px var(--bg)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11 }}>{number}</span>
      )}
    </span>
  );
}

function PageHeader({ title, onBack }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 5, display: "flex", alignItems: "center", height: 52, padding: `${SAFE_TOP - 8}px 8px 0`, background: "var(--surface-overlay)", backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))", borderBottom: "1px solid var(--border-subtle)", boxSizing: "content-box" }}>
      <Press scale={0.9} onClick={onBack} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Icon name="chevron-left" size={22} color="var(--text-1)" />
      </Press>
      <h1 style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 17, color: "var(--text-1)" }}>{title}</h1>
      <span style={{ width: 40 }} />
    </header>
  );
}

/* ── Monthly badges ── */
function BadgesPage({ years, onBack }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 46, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <PageHeader title="Monthly badges" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px 40px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-3)", lineHeight: 1.45, marginBottom: 6 }}>Complete each month's challenge to earn its badge. A new design drops every month.</p>
        {years.map((y) => {
          const earned = y.months.filter((m) => m.earned).length;
          return (
            <div key={y.year} style={{ marginTop: 22 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
                <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em", color: "var(--text-1)" }}>{y.year} badges</h2>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em", color: "var(--green)" }}>{earned}/12</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px 12px" }}>
                {y.months.map((m) => (
                  <div key={m.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9 }}>
                    <Medallion icon={m.icon} tone={m.tone} earned={m.earned} size={78} />
                    <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 12, color: m.earned ? "var(--text-1)" : "var(--text-3)" }}>{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Achievements grid ── */
function AchievementsPage({ achievements, onBack, onSelect }) {
  const earned = achievements.filter((a) => a.earned).length;
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 46, background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <PageHeader title="Achievements" onBack={onBack} />
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px 40px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 20, letterSpacing: "-0.01em", color: "var(--text-1)" }}>Awards</h2>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.04em", color: "var(--green)" }}>{earned}/{achievements.length} unlocked</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "22px 12px" }}>
          {achievements.map((a) => (
            <Press key={a.id} scale={0.96} onClick={() => onSelect(a)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 9, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <Medallion icon={a.icon} tone={a.tone} earned={a.earned} hollow size={84} number={a.earned ? a.current : undefined} />
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, color: a.earned ? "var(--text-1)" : "var(--text-3)", textAlign: "center", lineHeight: 1.15 }}>{a.name}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.04em", color: "var(--text-3)" }}>{a.earned ? `LVL ${a.level} · ${a.level}/${a.maxLevel}` : "LOCKED"}</span>
            </Press>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Achievement detail (how to unlock) ── */
function AchievementDetail({ a, onClose }) {
  const t = toneColors(a.tone);
  const pct = Math.min(100, Math.round((a.current / a.target) * 100));
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 48, background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", padding: `${SAFE_TOP}px 28px 40px` }}>
      <div style={{ width: "100%" }}>
        <Press scale={0.9} onClick={onClose} style={{ width: 40, height: 40, borderRadius: "50%", border: "none", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginLeft: -8 }}>
          <Icon name="x" size={24} color="var(--text-2)" />
        </Press>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", maxWidth: 320 }}>
        <Medallion icon={a.icon} tone={a.tone} earned={a.earned} hollow size={150} />
        {a.earned && <span style={{ marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: t.fg }}>Level {a.level} of {a.maxLevel}</span>}
        <h1 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, letterSpacing: "-0.015em", color: "var(--text-1)", marginTop: 8 }}>{a.name}</h1>

        {/* progress bar with count in the middle */}
        <div style={{ position: "relative", width: "100%", height: 38, borderRadius: 999, background: "var(--surface-2)", overflow: "hidden", marginTop: 24, boxShadow: "inset 0 0 0 1px var(--border-subtle)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct}%`, background: t.fg, borderRadius: 999 }} />
          <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 14, color: pct > 50 ? "var(--text-on-accent)" : "var(--text-1)" }}>{a.current}/{a.target}</span>
        </div>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--text-2)", textAlign: "center", lineHeight: 1.5, marginTop: 22, textWrap: "balance" }}>
          {a.earned ? `Keep going — ${a.target - a.current} more ${a.unit} to reach level ${a.level + 1}.` : a.howTo}
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { Medallion, BadgesPage, AchievementsPage, AchievementDetail });
