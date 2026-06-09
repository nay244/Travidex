import React from "react";

/**
 * TabBar — the five-tab bottom navigation with a raised center action button.
 * Tabs: map · compass(Explore) · [Find] · users(Community) · user(Profile).
 * The center button is a STAMP (= "log a find") and is DISABLED until a sight is
 * selected: pass `findEnabled` true to make it amber/active and clickable.
 * Inactive tab = line icon in --text-3; active = filled feel in --text-1.
 *
 * Pass `renderIcon(name, active)` so the host can supply its icon set
 * (e.g. Lucide — the center uses `stamp`). `active` is the id of the current tab.
 */
export function TabBar({ tabs, active, onChange, onFind, findEnabled = false, renderIcon }) {
  const items = tabs || [
    { id: "map", label: "Map", icon: "map" },
    { id: "explore", label: "Explore", icon: "compass" },
    { id: "find", label: "Find", icon: "stamp", center: true },
    { id: "community", label: "Community", icon: "users" },
    { id: "profile", label: "Profile", icon: "user" },
  ];

  return (
    <nav
      style={{
        position: "relative", display: "flex", alignItems: "flex-start",
        justifyContent: "space-around",
        height: "var(--tabbar-h)", paddingTop: "10px",
        paddingBottom: "var(--homeindicator)",
        background: "var(--surface-overlay)",
        backdropFilter: "blur(var(--blur-md))", WebkitBackdropFilter: "blur(var(--blur-md))",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      {items.map((t) =>
        t.center ? (
          <button
            key={t.id}
            type="button"
            aria-label={t.label}
            disabled={!findEnabled}
            onClick={findEnabled ? onFind : undefined}
            style={{
              position: "relative", top: "-18px",
              width: "var(--fab-size)", height: "var(--fab-size)", flex: "none",
              borderRadius: "50%", border: "3px solid var(--bg)",
              background: findEnabled ? "var(--amber)" : "var(--surface-3)",
              color: findEnabled ? "var(--text-on-accent)" : "var(--text-3)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              boxShadow: findEnabled ? "var(--glow-fab)" : "inset 0 0 0 1px var(--border-default)",
              cursor: findEnabled ? "pointer" : "default",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {renderIcon ? renderIcon(t.icon, findEnabled) : <span style={{ width: 20, height: 20, borderRadius: 5, border: "2px solid currentColor" }} />}
          </button>
        ) : (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange?.(t.id)}
            style={{
              flex: 1, display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "4px",
              background: "none", border: "none", padding: 0,
              color: active === t.id ? "var(--text-1)" : "var(--text-3)",
              cursor: "pointer", WebkitTapHighlightColor: "transparent",
              transition: "color var(--dur-fast) var(--ease-out)",
            }}
          >
            <span style={{ display: "inline-flex", height: 24, alignItems: "center" }}>
              {renderIcon ? renderIcon(t.icon, active === t.id) : <Fallback />}
            </span>
            <span style={{
              fontFamily: "var(--font-sans)", fontSize: "10px", fontWeight: active === t.id ? 600 : 500,
              letterSpacing: "0.01em",
            }}>{t.label}</span>
          </button>
        )
      )}
    </nav>
  );
}

function Fallback() {
  return <span style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid currentColor", display: "inline-block" }} />;
}
