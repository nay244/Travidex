Rounded inset search field with a leading glyph and clear button.

```jsx
<SearchBar value={q} onChange={setQ} onClear={() => setQ("")}
  placeholder="Search sights in Kyoto" icon={<Search size={16} />} />
```

Used for sights, cities, and places across Map, Explore, City Picker, and Community. Sits on `--surface-2`.
