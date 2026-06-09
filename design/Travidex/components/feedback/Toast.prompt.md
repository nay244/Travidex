Transient message with an accent edge bar.

```jsx
<Toast tone="success" icon={<Check size={16}/>}>Added to your dex!</Toast>
<Toast tone="error" action="Retry" onAction={refetch}>Couldn't reach the map.</Toast>
```

Tones map to semantics (success=green, progress=amber, info=blue, error=red). Host controls mount/dismiss timing; render above the tab bar or below the status bar.
