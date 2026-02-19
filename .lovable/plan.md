

## Fix Mobile UI Inconsistencies

Two visual/interaction bugs to address:

### 1. Scroll Trapping on Mobile Safari

When you scroll to the bottom of a tab's content, you get "stuck" and can't naturally bounce back or switch context. This is caused by `overscroll-behavior: none` in the body CSS combined with the nested scroll containers.

**Fix in `src/index.css`:** Remove the `overscroll-behavior: none` line from the body styles. This restores Safari's natural rubber-band scrolling so you never feel trapped at the edges. This same fix carries over to the Capacitor native app since it uses a WebView with the same behavior.

### 2. Dim Gray Box Behind Top 3 Podium

A faint gray rectangle appears behind the top 3 teams section when scrolling. This comes from two decorative gradient `div` elements using `absolute inset-0` with blurred backgrounds.

**Fix in `src/pages/Index.tsx`:** Remove the two decorative gradient divs in the "Top 3 Flowing Podium" section (the ones with `bg-gradient-to-r from-slate-800/5...` and `bg-gradient-to-b from-transparent via-slate-700/8...`).

### Files to modify

- **`src/index.css`** -- remove `overscroll-behavior: none` from body
- **`src/pages/Index.tsx`** -- remove the two gradient background divs in the podium section

