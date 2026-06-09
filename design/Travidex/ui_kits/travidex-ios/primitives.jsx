// Travidex UI kit — local primitives (use design tokens via styles.css)
const { useState, useEffect, useRef } = React;

/* ---- Icon: builds a real Lucide SVG imperatively (React owns only the span) ---- */
function pascal(name) {
  return name.split("-").map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}
function Icon({ name, size = 20, color = "currentColor", strokeWidth = 1.75, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const L = window.lucide;
    if (!L || !ref.current) return;
    const node = L[pascal(name)] || (L.icons && (L.icons[pascal(name)] || L.icons[name]));
    ref.current.innerHTML = "";
    if (node && L.createElement) {
      const svg = L.createElement(node);
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
      svg.setAttribute("stroke-width", strokeWidth);
      ref.current.appendChild(svg);
    }
  }, [name, size, strokeWidth]);
  return <span ref={ref} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", color, width: size, height: size, flex: "none", ...style }} />;
}

/* ---- Pressable wrapper: physical squash ---- */
function Press({ as: Tag = "button", scale = 0.97, onClick, children, style, ...rest }) {
  const [p, setP] = useState(false);
  return (
    <Tag
      onClick={onClick}
      onPointerDown={() => setP(true)} onPointerUp={() => setP(false)} onPointerLeave={() => setP(false)}
      style={{ transform: p ? `scale(${scale})` : "scale(1)", transition: "transform var(--dur-fast) var(--ease-out)", WebkitTapHighlightColor: "transparent", ...style }}
      {...rest}
    >{children}</Tag>
  );
}

/* ---- Button ---- */
function Btn({ variant = "primary", size = "md", full, icon, children, onClick, disabled, style }) {
  const pal = {
    primary: { bg: "var(--amber)", fg: "var(--text-on-accent)", sh: "var(--glow-fab)", bd: "transparent" },
    positive: { bg: "var(--green)", fg: "var(--text-on-accent)", sh: "0 6px 20px var(--green-glow)", bd: "transparent" },
    secondary: { bg: "var(--surface-2)", fg: "var(--text-1)", sh: "none", bd: "var(--border-default)" },
    ghost: { bg: "transparent", fg: "var(--text-1)", sh: "none", bd: "transparent" },
  }[variant];
  return (
    <Press onClick={disabled ? undefined : onClick} style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
      height: size === "sm" ? "var(--btn-h-sm)" : "var(--btn-h)", padding: size === "sm" ? "0 16px" : "0 22px",
      width: full ? "100%" : "auto", border: `1px solid ${pal.bd}`, borderRadius: "var(--radius-pill)",
      background: pal.bg, color: pal.fg, fontFamily: "var(--font-sans)", fontWeight: 600,
      fontSize: size === "sm" ? 15 : 16, letterSpacing: "-0.01em", boxShadow: pal.sh,
      opacity: disabled ? 0.4 : 1, cursor: disabled ? "not-allowed" : "pointer", ...style,
    }}>
      {icon && <Icon name={icon} size={size === "sm" ? 16 : 18} />}{children}
    </Press>
  );
}

/* ---- Pin ---- */
function Pin({ state = "unseen", selected, label, onClick, style }) {
  const color = selected ? "var(--amber)" : state === "found" ? "var(--green)" : "var(--locked)";
  const size = selected ? 38 : 30;
  const glow = state === "found" && !selected ? "var(--glow-pin)" : selected ? "0 0 16px var(--amber-glow)" : "var(--shadow-sm)";
  return (
    <Press scale={0.9} onClick={onClick} style={{
      width: size, height: size, borderRadius: "50%", border: "2px solid var(--bg)", background: color,
      boxShadow: glow, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0,
      transition: "all var(--dur-med) var(--ease-spring)", ...style,
    }}>
      {state === "found"
        ? <Check c="var(--text-on-accent)" />
        : <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.5)" }} />}
    </Press>
  );
}
function Check({ c = "var(--green)", w = 11, t = 2.2 }) {
  return <span style={{ width: w, height: w * 0.6, borderLeft: `${t}px solid ${c}`, borderBottom: `${t}px solid ${c}`, transform: "rotate(-45deg)", marginTop: -w * 0.18, borderRadius: 1 }} />;
}

/* ---- CompletionBar ---- */
function CBar({ found, total, label, height = 8, showCount = true }) {
  const pct = total ? Math.round((found / total) * 100) : 0;
  const claimed = pct >= 100;
  const color = claimed ? "var(--green)" : pct > 0 ? "var(--amber)" : "var(--locked)";
  return (
    <div>
      {(label || showCount) && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7, fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {label && <span style={{ color: "var(--text-2)" }}>{label}</span>}
          {showCount && <span style={{ color: claimed ? "var(--green)" : "var(--text-3)", fontWeight: 700 }}>{found}<span style={{ color: "var(--text-3)" }}> / {total}</span></span>}
        </div>
      )}
      <div style={{ height, borderRadius: 999, background: "var(--surface-2)", overflow: "hidden", boxShadow: "inset 0 0 0 1px var(--border-subtle)" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: color, boxShadow: claimed ? "0 0 10px var(--green-glow)" : "none", transition: "width var(--dur-slow) var(--ease-spring)" }} />
      </div>
    </div>
  );
}

/* ---- Ring ---- */
function Ring({ found, total, size = 60, stroke = 6, children }) {
  const pct = total ? Math.min(100, Math.round((found / total) * 100)) : 0;
  const claimed = pct >= 100;
  const color = claimed ? "var(--green)" : pct > 0 ? "var(--amber)" : "var(--locked)";
  const r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", filter: claimed ? "drop-shadow(0 0 6px var(--green-glow))" : "none" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} style={{ transition: "stroke-dashoffset var(--dur-slow) var(--ease-spring)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {children != null ? children : <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: size * 0.24, color: claimed ? "var(--green)" : "var(--text-1)" }}>{pct}<span style={{ fontSize: "0.6em", color: "var(--text-3)" }}>%</span></span>}
      </div>
    </div>
  );
}

/* ---- TypeTag ---- */
function TypeTag({ label, icon }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 28, padding: "0 10px", borderRadius: 999, background: "var(--blue-dim)", boxShadow: "inset 0 0 0 1px var(--blue-line)", color: "var(--blue)", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13 }}>
      {icon && <Icon name={icon} size={13} />}{label}
    </span>
  );
}

/* ---- StatTile ---- */
function StatTile({ icon, value, label }) {
  return (
    <div style={{ flex: 1, padding: "12px 8px", background: "var(--surface-2)", borderRadius: "var(--radius-md)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <Icon name={icon} size={16} color="var(--text-3)" />
      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 18, color: "var(--text-1)" }}>{value}</span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>{label}</span>
    </div>
  );
}

/* ---- SightRow ----
   Tap the row to SELECT it (enables the Log-find button). The right-side
   "see more" chevron opens the entry detail. Found = full image, unfound = hollow. */
function SightRow({ s, selected, onClick, onSeeMore }) {
  return (
    <Press as="div" scale={0.99} onClick={onClick} role="button" style={{
      display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
      height: 64, padding: "0 8px 0 10px", background: selected ? "var(--surface-3)" : "transparent",
      border: "none", borderRadius: "var(--radius-md)", boxShadow: selected ? "inset 0 0 0 1px var(--amber-line)" : "none", cursor: "pointer",
    }}>
      {/* thumbnail: found = full image, unfound = hollow */}
      {s.found ? (
        <span style={{ width: 46, height: 46, flex: "none", borderRadius: "var(--radius-sm)", background: "var(--ph-base)", backgroundImage: "repeating-linear-gradient(135deg,var(--ph-stripe) 0 2px,transparent 2px 9px)", boxShadow: "inset 0 0 0 1px var(--border-subtle)" }} />
      ) : (
        <span style={{ width: 46, height: 46, flex: "none", borderRadius: "var(--radius-sm)", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1.5px var(--border-default)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="mountain" size={18} color="var(--locked)" />
        </span>
      )}
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "var(--text-3)" }}>#{String(s.dexNo).padStart(3, "0")}</span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: s.found ? "var(--text-1)" : "var(--text-2)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.name}</span>
        </span>
        <span style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", marginTop: 3 }}>{s.distance}{s.found ? " · Found" : " · Not found"}</span>
      </span>
      {/* see-more → entry detail */}
      <span role="button" aria-label="See details"
        onClick={(e) => { e.stopPropagation(); onSeeMore && onSeeMore(); }}
        onPointerDown={(e) => e.stopPropagation()}
        style={{ width: 32, height: 32, flex: "none", borderRadius: "50%", background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--border-subtle)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <Icon name="chevron-right" size={17} color="var(--text-2)" />
      </span>
    </Press>
  );
}

/* ---- ChunkTile ---- */
function Chunk({ c, onClick }) {
  const pct = c.total ? Math.min(100, Math.round((c.found / c.total) * 100)) : 0;
  const claimed = pct >= 100;
  const accent = claimed ? "var(--green)" : pct > 0 ? "var(--amber)" : "var(--locked)";
  const fillBg = claimed ? "var(--green-dim)" : pct > 0 ? "var(--amber-dim)" : "transparent";
  const border = claimed ? "var(--green-line)" : pct > 0 ? "var(--amber-line)" : "var(--border-default)";
  return (
    <Press onClick={onClick} style={{
      position: "relative", overflow: "hidden", textAlign: "left", aspectRatio: "1", width: "100%",
      padding: 12, borderRadius: "var(--radius-md)", border: `1px solid ${border}`, background: "var(--surface-1)",
      boxShadow: claimed ? "var(--glow-found)" : "var(--shadow-sm)", display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <span style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${pct}%`, background: claimed ? fillBg : `linear-gradient(to top, ${fillBg}, transparent)`, borderTop: claimed ? "2px solid var(--green)" : "none", transition: "height var(--dur-slow) var(--ease-spring)" }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)" }}>{c.region}</span>
        {claimed
          ? <span style={{ width: 18, height: 18, borderRadius: "50%", background: accent, boxShadow: "var(--glow-pin)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}><Check c="var(--text-on-accent)" w={7} t={2} /></span>
          : <span style={{ width: 10, height: 10, borderRadius: "50%", background: pct > 0 ? accent : "transparent", border: `2px solid ${pct > 0 ? accent : "var(--locked)"}` }} />}
      </div>
      <div style={{ position: "relative" }}>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, color: claimed ? "var(--text-1)" : "var(--text-2)" }}>{c.city}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, marginTop: 3, color: claimed ? "var(--green)" : "var(--text-3)" }}>{c.found}<span style={{ color: "var(--text-3)" }}>/{c.total}</span></div>
      </div>
    </Press>
  );
}

/* ---- Seg control ---- */
function Seg({ options, value, onChange }) {
  const idx = Math.max(0, options.findIndex((o) => (o.value ?? o) === value));
  return (
    <div style={{ position: "relative", display: "flex", padding: 3, background: "var(--surface-2)", borderRadius: 999, boxShadow: "inset 0 0 0 1px var(--border-subtle)" }}>
      <span style={{ position: "absolute", top: 3, bottom: 3, left: 3, width: `calc((100% - 6px) / ${options.length})`, transform: `translateX(${idx * 100}%)`, background: "var(--surface-4)", borderRadius: 999, boxShadow: "var(--shadow-sm),var(--sheen)", transition: "transform var(--dur-med) var(--ease-spring)" }} />
      {options.map((o) => {
        const v = o.value ?? o, l = o.label ?? o, on = v === value;
        return <button key={v} onClick={() => onChange(v)} style={{ position: "relative", zIndex: 1, flex: 1, height: 34, background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontWeight: on ? 600 : 500, fontSize: 14, color: on ? "var(--text-1)" : "var(--text-3)" }}>{l}</button>;
      })}
    </div>
  );
}

/* ---- Stylized map background (theme-aware via tokens) ---- */
function MapBg({ children, style }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(120% 80% at 70% 10%, var(--map-land-2) 0%, var(--map-land) 70%)", ...style }}>
      {/* water */}
      <div style={{ position: "absolute", width: "70%", height: "55%", left: "-15%", bottom: "-10%", background: "radial-gradient(ellipse at center, var(--map-water), transparent 70%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", width: "50%", height: "40%", right: "-10%", top: "8%", background: "radial-gradient(ellipse at center, var(--map-green), transparent 70%)", borderRadius: "50%" }} />
      {/* roads */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.7 }} preserveAspectRatio="none">
        <g stroke="var(--map-road)" strokeWidth="2" fill="none">
          <path d="M-20 120 L320 90 L520 200" />
          <path d="M40 -20 L120 200 L90 500" />
          <path d="M300 -10 L260 220 L360 480" />
          <path d="M-10 320 L260 300 L500 360" />
          <path d="M-10 430 L500 410" />
        </g>
        <g stroke="var(--map-road-hi)" strokeWidth="3" fill="none">
          <path d="M120 200 L260 220 L360 480" />
        </g>
      </svg>
      {children}
    </div>
  );
}

Object.assign(window, { Icon, Press, Btn, Pin, Check, CBar, Ring, TypeTag, StatTile, SightRow, Chunk, Seg, MapBg });
