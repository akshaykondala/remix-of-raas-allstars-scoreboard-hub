

## Fix: Laggy Competition Detail Drawer Exit

### Root Cause

Comparing CompetitionDetail (laggy) vs TeamDetail (smooth), the key differences are:

1. **Animated blur glow ring** (lines 261-272): A conic-gradient element with `filter: blur(12px)` and `logo-glow-spin` animation stays in the DOM during exit. Animating transforms on a blurred element is extremely GPU-intensive.
2. **Instagram iframe** (lines 454-461): An embedded iframe is unmounted during the exit animation, causing a heavy layout recalc mid-transition.
3. **No GPU compositing hints**: The drawer content lacks `will-change` or `contain` properties, so the browser doesn't isolate it for efficient compositing during the slide-out.

TeamDetail has none of these — just a simple static `blur-xl` div and no iframe.

### Plan

#### `src/components/CompetitionDetail.tsx`

1. **Hide the glow ring on close**: Track the `open` state and conditionally render the animated glow ring (lines 261-272) only when `open` is true. When the drawer starts closing, the expensive blur+animation element is immediately removed from the DOM before the exit transition runs.

2. **Hide the iframe on close**: Similarly, only render the Instagram iframe when `open` is true. This prevents an iframe teardown from happening mid-animation.

3. **Add `will-change: transform`** to the scrollable content container (line 253) to promote it to its own compositing layer, enabling smoother GPU-accelerated exit animation.

#### Files Changed
- `src/components/CompetitionDetail.tsx` — conditional render of glow ring and iframe based on open state; add will-change hint

