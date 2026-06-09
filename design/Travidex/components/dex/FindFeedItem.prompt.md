Community finds-feed entry.

```jsx
<FindFeedItem user="Mira" sight="Fushimi Inari" city="Kyoto" date="2H AGO"
  thumb={null} likes={12} comments={3} liked onLike={toggle} onClick={openSight} />
```

Sight name is green (a find). Pass `thumb={null}` for the striped placeholder, a URL for a real photo, or omit `thumb` entirely for a text-only find. Used in Community feed and on Sight Detail's "Recent finds".
