// Travidex UI kit — Profile Art: unlockable banner designs for the profile screen.
// Each art is a token-driven layer (themes automatically) used as the avatar
// banner background and as a swatch in the picker. Unlocks are tied to progress.

// unlock: (p) => boolean, where p = { sights, cities, countries, photos }
const PROFILE_ART = [
  {
    id: "trailhead", name: "Trailhead", free: true,
    unlock: () => true, criteria: "Starter design",
    progress: null,
  },
  {
    id: "chunkboard", name: "Tileman", criteria: "Claim 1 city",
    unlock: (p) => p.cities >= 1, progress: (p) => ({ current: p.cities, total: 1 }),
  },
  {
    id: "aurora", name: "Aurora", criteria: "Claim 2 cities",
    unlock: (p) => p.cities >= 2, progress: (p) => ({ current: p.cities, total: 2 }),
  },
  {
    id: "passport", name: "Passport", criteria: "Explore 3 countries",
    unlock: (p) => p.countries >= 3, progress: (p) => ({ current: p.countries, total: 3 }),
  },
  {
    id: "topographic", name: "Topographic", criteria: "Claim 3 cities",
    unlock: (p) => p.cities >= 3, progress: (p) => ({ current: p.cities, total: 3 }),
  },
  {
    id: "summit", name: "Summit", criteria: "Find 100 sights",
    unlock: (p) => p.sights >= 100, progress: (p) => ({ current: p.sights, total: 100 }),
  },
];

function artById(id) { return PROFILE_ART.find((a) => a.id === id) || PROFILE_ART[0]; }
function artUnlocked(art, p) { return art.free || art.unlock(p); }

// ArtLayer — fills its (relatively positioned) container. Pure CSS/SVG + tokens.
function ArtLayer({ id, style }) {
  const common = { position: "absolute", inset: 0, overflow: "hidden", ...style };
  switch (id) {
    case "chunkboard":
      return (
        <div style={{ ...common, background: "var(--surface-3)" }}>
          <div style={{ position: "absolute", inset: -2, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr", gap: 4, padding: 6 }}>
            {Array.from({ length: 21 }).map((_, i) => {
              const c = [3, 9, 10, 16].includes(i) ? "var(--green)" : [5, 12].includes(i) ? "var(--amber)" : null;
              return <div key={i} style={{ borderRadius: 4, background: c ? (c === "var(--green)" ? "var(--green-dim)" : "var(--amber-dim)") : "var(--surface-1)", boxShadow: c ? `inset 0 -3px 0 ${c}` : "inset 0 0 0 1px var(--border-subtle)" }} />;
            })}
          </div>
        </div>
      );
    case "aurora":
      return (
        <div style={{ ...common, background: "linear-gradient(120deg, var(--surface-2), var(--surface-3))" }}>
          <div style={{ position: "absolute", width: "90%", height: "160%", left: "-10%", top: "-60%", background: "radial-gradient(ellipse at center, var(--green-glow), transparent 60%)" }} />
          <div style={{ position: "absolute", width: "70%", height: "140%", right: "-15%", top: "-40%", background: "radial-gradient(ellipse at center, var(--amber-glow), transparent 60%)" }} />
        </div>
      );
    case "passport":
      return (
        <div style={{ ...common, background: "var(--surface-2)" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, var(--blue-line) 1.5px, transparent 1.6px)", backgroundSize: "26px 26px", opacity: 0.5 }} />
          <div style={{ position: "absolute", inset: 10, border: "2px dashed var(--blue-line)", borderRadius: "var(--radius-md)" }} />
        </div>
      );
    case "topographic":
      return (
        <div style={{ ...common, background: "var(--surface-2)" }}>
          <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <ellipse key={i} cx="62%" cy="40%" rx={`${18 + i * 14}%`} ry={`${30 + i * 22}%`} fill="none" stroke="var(--green-line)" strokeWidth="1.5" opacity={0.55 - i * 0.06} />
            ))}
          </svg>
        </div>
      );
    case "summit":
      return (
        <div style={{ ...common, background: "linear-gradient(160deg, var(--amber-dim), var(--surface-2) 70%)" }}>
          <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 50" style={{ position: "absolute", inset: 0 }}>
            <path d="M0 50 L20 20 L34 34 L52 8 L70 30 L84 18 L100 40 L100 50 Z" fill="var(--amber-line)" opacity="0.6" />
            <path d="M0 50 L26 30 L44 40 L64 18 L82 36 L100 24 L100 50 Z" fill="var(--amber)" opacity="0.35" />
          </svg>
        </div>
      );
    case "trailhead":
    default:
      return (
        <div style={{ ...common, background: "radial-gradient(120% 90% at 75% 10%, var(--map-land-2), var(--map-land))" }}>
          <svg width="100%" height="100%" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, opacity: 0.8 }}>
            <g stroke="var(--map-road)" strokeWidth="2" fill="none">
              <path d="M-10 60 L160 40 L300 90 L460 60" />
              <path d="M40 -10 L90 80 L60 180" />
              <path d="M260 -10 L230 70 L320 180" />
            </g>
            <g stroke="var(--map-road-hi)" strokeWidth="2.5" fill="none"><path d="M90 80 L230 70 L320 180" /></g>
          </svg>
          <span style={{ position: "absolute", left: "20%", top: "44%", width: 10, height: 10, borderRadius: "50%", background: "var(--green)", boxShadow: "var(--glow-pin)" }} />
          <span style={{ position: "absolute", left: "60%", top: "30%", width: 8, height: 8, borderRadius: "50%", background: "var(--locked)" }} />
        </div>
      );
  }
}

Object.assign(window, { PROFILE_ART, artById, artUnlocked, ArtLayer });
