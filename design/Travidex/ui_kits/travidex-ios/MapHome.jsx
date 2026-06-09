// Travidex UI kit — Map Home (map + 3-snap dex bottom sheet)
const { useState: useStateMap, useRef: useRefMap } = React;

function MapHome({ sights, selected, onSelect, onSight, onCity }) {
  const [snap, setSnap] = useStateMap("half"); // peek | half | full
  const found = sights.filter((s) => s.found).length;

  // snap -> sheet top (px from top of 874 frame). smaller top = taller sheet.
  const FRAME = 874;
  const tops = { peek: FRAME - 150, half: FRAME * 0.46, full: SAFE_TOP + 8 };
  const dragRef = useRefMap(null);
  const [dragTop, setDragTop] = useStateMap(null);
  const top = dragTop != null ? dragTop : tops[snap];

  function down(e) { dragRef.current = { y: e.clientY, top: tops[snap] }; e.currentTarget.setPointerCapture?.(e.pointerId); }
  function move(e) { if (dragRef.current) setDragTop(Math.max(tops.full, dragRef.current.top + (e.clientY - dragRef.current.y))); }
  function up() {
    if (!dragRef.current) return;
    const cur = dragTop ?? tops[snap];
    let best = "half", d = Infinity;
    for (const k of ["peek", "half", "full"]) { const dist = Math.abs(tops[k] - cur); if (dist < d) { d = dist; best = k; } }
    dragRef.current = null; setDragTop(null); setSnap(best);
  }

  const sorted = [...sights].sort((a, b) => a.dexNo - b.dexNo);

  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--bg)" }}>
      <MapBg>
        {sights.map((s) => (
          <div key={s.id} style={{ position: "absolute", left: `${s.x}%`, top: `${s.y * 0.62}%`, transform: "translate(-50%,-50%)" }}>
            <Pin state={s.found ? "found" : "unseen"} selected={selected?.id === s.id}
              onClick={() => { onSelect(s); setSnap("half"); }} />
          </div>
        ))}
      </MapBg>

      {/* top overlay */}
      <div style={{ position: "absolute", top: SAFE_TOP + 4, left: 12, right: 12, zIndex: 20, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, height: 46, padding: "0 14px", background: "var(--surface-overlay)", backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md), inset 0 0 0 1px var(--border-subtle)" }}>
            <Icon name="search" size={16} color="var(--text-3)" />
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--text-3)" }}>Search sights</span>
          </div>
          <Press scale={0.94} style={glassIcon}><Icon name="sliders-horizontal" size={18} color="var(--text-1)" /></Press>
        </div>
        <Press scale={0.96} onClick={onCity} style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 7, height: 38, padding: "0 14px", background: "var(--surface-overlay)", backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))", borderRadius: 999, boxShadow: "var(--shadow-md), inset 0 0 0 1px var(--border-subtle)", cursor: "pointer" }}>
          <Icon name="map-pin" size={15} color="var(--green)" />
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, color: "var(--text-1)" }}>Kyoto</span>
          <Icon name="chevron-down" size={14} color="var(--text-3)" />
        </Press>
      </div>

      {/* recenter */}
      <Press scale={0.9} style={{ ...glassIcon, position: "absolute", right: 12, zIndex: 20, top: top - 56, transition: dragTop != null ? "none" : "top var(--dur-med) var(--ease-sheet)" }}>
        <Icon name="locate-fixed" size={18} color="var(--green)" />
      </Press>

      {/* dex sheet */}
      <div style={{ position: "absolute", left: 0, right: 0, top, bottom: 0, zIndex: 25,
        background: "var(--surface-1)", borderTopLeftRadius: "var(--radius-2xl)", borderTopRightRadius: "var(--radius-2xl)",
        boxShadow: "var(--shadow-sheet)", borderTop: "1px solid var(--border-default)",
        display: "flex", flexDirection: "column", transition: dragTop != null ? "none" : "top var(--dur-med) var(--ease-sheet)", touchAction: "none" }}>
        <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          style={{ flex: "none", padding: "10px 16px 12px", cursor: "grab", touchAction: "none" }}>
          <div style={{ width: 38, height: 5, borderRadius: 999, background: "var(--border-strong)", margin: "0 auto 14px" }} />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 22, letterSpacing: "-0.01em", color: "var(--text-1)" }}>Kyoto</h2>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--amber)", letterSpacing: "0.04em" }}>{found}<span style={{ color: "var(--text-3)" }}> / {sights.length} found</span></span>
          </div>
          <CBar found={found} total={sights.length} showCount={false} height={7} />
        </div>
        {selected && (
          <div style={{ flex: "none", margin: "0 12px 8px", padding: "10px 12px", borderRadius: "var(--radius-md)", background: "var(--amber-dim)", boxShadow: "inset 0 0 0 1px var(--amber-line)", display: "flex", alignItems: "center", gap: 9 }}>
            <Icon name="stamp" size={16} color="var(--amber)" />
            <span style={{ flex: 1, minWidth: 0, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Selected <b>{selected.name}</b></span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.08em", color: "var(--amber)", whiteSpace: "nowrap" }}>TAP TO LOG ↓</span>
          </div>
        )}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 100px" }}>
          {sorted.map((s) => (
            <SightRow key={s.id} s={s} selected={selected?.id === s.id} onClick={() => onSelect(s)} onSeeMore={() => onSight(s)} />
          ))}
        </div>
      </div>
    </div>
  );
}

const glassIcon = {
  width: 46, height: 46, flex: "none", borderRadius: "var(--radius-md)",
  background: "var(--surface-overlay)", backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  boxShadow: "var(--shadow-md), inset 0 0 0 1px var(--border-subtle)", cursor: "pointer", border: "none",
};

Object.assign(window, { MapHome });
