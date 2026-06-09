Top navigation bar — centered title, optional back/close control, right action slot.

```jsx
<NavHeader title="Explore" />
<NavHeader title="Fushimi Inari" mode="back" onBack={goBack} right={<HeartButton/>} />
<NavHeader mode="close" onBack={dismiss} transparent right={<ShareButton/>} />
```

Use `transparent` over hero imagery or the map (the leading control gets a glass chip). Pass `right` for share/favorite/menu actions.
