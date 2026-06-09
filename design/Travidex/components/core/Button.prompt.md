Primary tappable action — amber `primary` is the Log/Find action, green `positive` is Navigate/confirm; use `secondary`/`ghost` for everything else.

```jsx
<Button variant="primary" full icon={<Plus size={18} />}>Log find</Button>
<Button variant="positive" icon={<Navigation size={16} />}>Navigate</Button>
<Button variant="secondary" size="sm">Not now</Button>
<Button variant="primary" loading>Submitting</Button>
```

Variants: `primary` (amber, glow), `positive` (green, glow), `secondary` (neutral surface + hairline), `ghost`. Sizes `md` (52px) / `sm` (40px). Props: `full`, `loading`, `disabled`, `icon`, `iconRight`. Squashes to 0.97 + brightens on press; respects reduced-motion.
