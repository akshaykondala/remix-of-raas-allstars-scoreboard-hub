

## Fix: Accidental Week Swiping When Tapping a Competition Card

### Root Cause

The `CompetitionTimeline` component wraps everything (timeline dots AND competition cards) in a single `div` with `onTouchStart`, `onTouchMove`, and `onTouchEnd` handlers. When you tap a competition card on mobile:

1. `touchStart` fires, recording `touchStartX`
2. `touchMove` may not fire at all (it's a tap, not a swipe), so `touchEndX` retains its stale value from a **previous** interaction
3. `touchEnd` fires, computes `diff = touchStartX - touchEndX(stale)`, which can easily exceed the 50px threshold
4. The week index changes while the competition detail page opens

### Fix (in `src/components/CompetitionTimeline.tsx`)

Three changes to the touch handling logic:

1. **Reset `touchEndX` to match `touchStartX` on every new touch** -- so if no move occurs, diff is 0 (a tap)
2. **Track whether a touchMove actually happened** via a `touchMoved` ref -- only process swipe if the user actually dragged their finger
3. **Increase the swipe threshold from 50px to 80px** -- reduces false positives from minor finger wobble during taps

```text
Before (lines 74-90):
  handleTouchStart -> records touchStartX only
  handleTouchMove  -> records touchEndX
  handleTouchEnd   -> computes diff, threshold=50

After:
  handleTouchStart -> records touchStartX, resets touchEndX to same value, sets touchMoved=false
  handleTouchMove  -> records touchEndX, sets touchMoved=true
  handleTouchEnd   -> if !touchMoved, return early (it was a tap); threshold raised to 80
```

### What stays the same

- Initial week selection logic (finds current/nearest upcoming weekend) -- untouched
- Timeline dot clicks, arrow navigation -- untouched
- Mouse drag handling (desktop) -- untouched
- The `activeWeekIndex` state and card rendering -- untouched

