

## Problem: Laggy Competition Detail Drawer Exit Animation

The competition detail drawer (bottom sheet) is slow and laggy when dismissing, especially on mobile.

### Root Causes

1. **`shouldScaleBackground={true}`** in `drawer.tsx` (line 6) — Vaul scales the entire page background during open/close transitions. This triggers expensive compositing on every frame, especially with the app's heavy gradient/blur backgrounds.

2. **300ms `setTimeout` before unmount** in `CompetitionDetail.tsx` (line 133) — After the drawer closes, there's a `setTimeout(onClose, 300)` that keeps the entire heavy component mounted for an extra 300ms while it's invisible, blocking the next interaction.

3. **Heavy blur/glow effects inside the drawer** — Multiple `blur-xl`, `blur-2xl`, `blur-3xl` elements (lines 281, 282+) and gradient overlays remain composited during the exit animation, causing GPU thrashing on mobile.

4. **Inline `<style>` tag re-injected on every render** (lines 290-301) — The `@keyframes` block is injected as a `<style>` element inside the component, causing style recalculation on mount/unmount.

### Plan

#### `src/components/ui/drawer.tsx`
- Set `shouldScaleBackground={false}` — removes the expensive background scaling transform during open/close

#### `src/components/CompetitionDetail.tsx`
- Reduce the `setTimeout(onClose, 300)` to `setTimeout(onClose, 150)` — the Vaul drawer handles its own exit animation; the extra delay just keeps heavy DOM mounted longer
- Move the inline `<style>` keyframes to `src/index.css` so they're defined once globally instead of injected/removed with every drawer open/close

#### `src/index.css`
- Add the `logo-entrance` and `logo-glow-spin` keyframes here (moved from inline)

### Files Changed
- `src/components/ui/drawer.tsx` — disable background scaling
- `src/components/CompetitionDetail.tsx` — reduce close delay, remove inline styles
- `src/index.css` — add keyframes globally

