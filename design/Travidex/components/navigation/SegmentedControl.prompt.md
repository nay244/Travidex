iOS-style segmented control with a spring-sliding thumb.

```jsx
<SegmentedControl
  options={[{value:"dist",label:"Distance"},{value:"dex",label:"Dex #"},{value:"found",label:"Found"}]}
  value={sort} onChange={setSort}
/>
<SegmentedControl options={["Walking","Driving"]} value={mode} onChange={setMode} />
```

For sort menus, Walking|Driving, feed filters (Friends/Global/Nearby), and Community tabs. Keep to 2–4 options.
