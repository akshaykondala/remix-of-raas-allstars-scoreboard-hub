

## Plan: Add Safe Area Inset Support for iPhone Notch

### Problem
The app header (logo) and drawer handles are overlapping with the iPhone notch/Dynamic Island because there's no `safe-area-inset-top` padding applied.

### Changes

**1. `index.html`** — Add `viewport-fit=cover` to the viewport meta tag so the app extends behind the notch and can use `env(safe-area-inset-*)` values:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

**2. `src/index.css`** — Add top safe area padding to `body` or the root element:
```css
body {
  padding-top: env(safe-area-inset-top, 0px);
}
```

**3. `src/pages/Index.tsx`** — The header currently uses `pt-10`. Update it to also account for the safe area inset:
```tsx
<div className="relative pb-8" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2.5rem)' }}>
```
Since the body-level padding would shift everything, the cleaner approach is to **not** add body padding and instead apply the safe area inset directly to the header and the loading screen.

**4. `src/components/LoadingScreen.tsx`** — The loading screen overlay is `fixed inset-0`, which is fine, but the logo positioning should account for the notch so it doesn't sit behind it during the travel animation.

**5. `src/components/ui/drawer.tsx`** — The sticky drag handle at the top of drawers should include safe area top padding so it doesn't sit under the notch when the drawer is fully expanded.

### Recommended Approach
- Add `viewport-fit=cover` to `index.html`
- Apply `env(safe-area-inset-top)` to the main page header (`pt-10` → includes safe area)
- Apply safe area top padding to the drawer content's drag handle area
- The bottom nav already handles `safe-area-inset-bottom` correctly

This is a minimal, targeted fix — 3-4 files, small changes each.

