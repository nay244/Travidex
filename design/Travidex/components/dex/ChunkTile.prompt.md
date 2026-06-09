A city tile for the country chunk-map (OSRS-Tileman twist). Fill rises from the bottom with completion.

```jsx
<ChunkTile city="Kyoto" region="Kansai" found={40} total={40} onClick={openCity} />
<ChunkTile city="Osaka" region="Kansai" found={12} total={30} />
<ChunkTile city="Kobe" region="Kansai" found={0} total={18} />
```

Claimed (green, check marker) at 100%, in-progress (amber) partial, untouched (dim ring). Lay out in a responsive grid as the country board. Free exploration — every tile is always tappable.
