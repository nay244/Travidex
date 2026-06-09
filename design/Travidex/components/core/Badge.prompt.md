Small uppercase status pill, and a numeric count badge.

```jsx
<Badge tone="progress" label="Pending" dot />
<Badge tone="found" label="Approved" />
<Badge tone="danger" label="Rejected" />
<Badge tone="info" label="Community" />
<CountBadge count={3} />
```

`Badge` tones map to semantics (found/progress/info/neutral/danger). Use for community submission status, "Community" source flags, and found markers. `CountBadge` is the amber notification dot.
