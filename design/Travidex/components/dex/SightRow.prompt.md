The dex list row — used in the Map bottom sheet and Region Dex.

```jsx
<SightRow dexNo={17} name="Fushimi Inari Shrine" found distance="1.2 km"
  selected onClick={() => select(s)} onSeeMore={() => openDetail(s)} />
<SightRow dexNo={18} name="Nishiki Market" status="Not found" types={["Food"]}
  onClick={() => select(s)} onSeeMore={() => openDetail(s)} />
```

Found rows show a full-color thumb; **unfound rows are hollow** (dim outlined box + faint landmark glyph). Tapping the **row body selects** the sight (enabling the Log-find stamp); the right-side **"see more" chevron** opens the entry detail. `distance` (location-on) takes priority over `status`. Drive `selected` from pin⇄row sync.
