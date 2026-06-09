Achievement medallion for the Badges grid.

```jsx
<BadgeChip name="First find" earned icon={<Flag size={20}/>} />
<BadgeChip name="City claimer" criteria="Claim 1 city" progress={{current:0, total:1}} />
<BadgeChip name="Globetrotter" criteria="Explore 5 countries" progress={{current:2, total:5}} />
```

Earned medallions glow amber; locked ones are desaturated and show criteria or a progress bar toward the next milestone.
