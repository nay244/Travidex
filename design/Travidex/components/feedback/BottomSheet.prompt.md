The signature Map surface — a draggable sheet with three snap points (peek / half / full).

```jsx
const [snap, setSnap] = useState("half");
<BottomSheet
  snap={snap} onSnap={setSnap}
  header={<CompletionBar label="KYOTO" found={3} total={40} />}
>
  {sights.map(s => <SightRow key={s.id} {...s} />)}
</BottomSheet>
```

Must sit inside a `position: relative` parent (the phone frame / map). Peek shows the completion header; half shows the list; full nearly covers the map. Drag the handle to snap.
