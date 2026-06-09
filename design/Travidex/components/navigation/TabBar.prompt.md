The five-tab bottom navigation with the raised center **stamp** action (Log find). Glass-blurred so the map shows through. The stamp is **disabled (grey) until a sight is selected** (`findEnabled` false), then amber/active.

```jsx
<TabBar
  active={tab}
  onChange={setTab}
  findEnabled={!!selectedSight}        // amber/active only once a sight is selected
  onFind={() => logFind(selectedSight)}
  renderIcon={(name, active) => <i data-lucide={name} className={active ? "on" : ""} />}
/>
```

Defaults to Map · Explore · Find(stamp) · Community · Profile. Inactive icons are line/`--text-3`; active fills to `--text-1`. Supply `renderIcon` to inject your icon set (Lucide names: map, compass, stamp, users, user).
