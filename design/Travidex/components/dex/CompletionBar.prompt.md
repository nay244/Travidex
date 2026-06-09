Horizontal completion progress. Color tells the story: green=claimed (100%), amber=in-progress, dim=untouched.

```jsx
<CompletionBar label="PARIS" found={3} total={40} />
<CompletionBar found={40} total={40} label="KYOTO" />  {/* glows green */}
```

The bar fills with a spring on change — pair with the find-success moment. Use in the Dex sheet header, city/country headers, and Profile.
