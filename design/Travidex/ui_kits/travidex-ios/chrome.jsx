// Travidex UI kit — bottom tab bar chrome
const { useState: useStateChrome } = React;

function TabBar({ active, onChange, onFind, findEnabled = false }) {
  const items = [
    { id: "map", label: "Map", icon: "map" },
    { id: "explore", label: "Explore", icon: "compass" },
    { id: "find", label: "Find", icon: "stamp", center: true },
    { id: "community", label: "Community", icon: "users" },
    { id: "profile", label: "Profile", icon: "user" },
  ];
  return (
    <nav style={{
      position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 40,
      display: "flex", alignItems: "flex-start", justifyContent: "space-around",
      height: 86, paddingTop: 10, paddingBottom: 26,
      background: "var(--surface-overlay)",
      backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))",
      borderTop: "1px solid var(--border-subtle)",
    }}>
      {items.map((t) => t.center ? (
        <Press key={t.id} scale={findEnabled ? 0.92 : 1} onClick={findEnabled ? onFind : undefined} aria-label="Log find" style={{
          position: "relative", top: -18, width: 60, height: 60, flex: "none",
          borderRadius: "50%", border: "3px solid var(--bg)",
          background: findEnabled ? "var(--amber)" : "var(--surface-3)",
          color: findEnabled ? "var(--text-on-accent)" : "var(--text-3)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          boxShadow: findEnabled ? "var(--glow-fab)" : "inset 0 0 0 1px var(--border-default)",
          cursor: findEnabled ? "pointer" : "default",
        }}>
          <Icon name="stamp" size={26} strokeWidth={findEnabled ? 2.2 : 1.9} />
        </Press>
      ) : (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 4,
          background: "none", border: "none", padding: 0, cursor: "pointer",
          color: active === t.id ? "var(--text-1)" : "var(--text-3)",
          transition: "color var(--dur-fast) var(--ease-out)",
        }}>
          <Icon name={t.icon} size={23} strokeWidth={active === t.id ? 2.2 : 1.75} />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 10, fontWeight: active === t.id ? 600 : 500 }}>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

/* Top safe-area inset (clears status bar / dynamic island) */
const SAFE_TOP = 54;
const TAB_H = 86;

Object.assign(window, { TabBar, SAFE_TOP, TAB_H });
