Map marker for a sight. Green+glow = found, dim = unseen, amber+enlarged = selected (sync with the focused dex row).

```jsx
<SightPin state="found" onClick={focusRow} />
<SightPin state="unseen" dexNo={17} />
<SightPin state="found" selected />
<SightPin cluster={8} />   {/* zoom-out cluster bubble */}
```

Drive `selected` from pin⇄row focus sync on the Map screen. `cluster` (>1) replaces the pin with a count bubble.
