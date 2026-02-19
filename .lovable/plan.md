

## Fix Drawer Swipe-to-Dismiss After Scrolling

### Problem
When you open a Team or Competition drawer and scroll down, then scroll back up, you can only close the drawer by dragging the sticky handle at the top. Before scrolling, you can drag down from anywhere to dismiss. This inconsistency happens because Safari's momentum scrolling leaves `scrollTop` at a tiny fractional pixel value (like 0.3px) instead of exactly 0, and vaul requires `scrollTop === 0` to allow content-area drag-to-dismiss.

### Solution
Add a small scroll-snap helper to the scrollable container in both detail components. On each scroll event, if `scrollTop` is less than 1px, snap it to exactly 0. This ensures vaul always recognizes the container as "at the top" and allows the full drag-to-dismiss gesture.

### Changes

**`src/components/TeamDetail.tsx`**
- Add a `useRef` for the scrollable div
- Attach an `onScroll` handler that snaps `scrollTop` to 0 when it's below 1px
- Apply the ref to the `<div className="overflow-y-auto flex-1 scrollbar-hide">` element

**`src/components/CompetitionDetail.tsx`**
- Same change: add `useRef`, `onScroll` handler, and apply to the scrollable div

### Technical Detail

```tsx
const scrollRef = useRef<HTMLDivElement>(null);

const handleScroll = () => {
  const el = scrollRef.current;
  if (el && el.scrollTop > 0 && el.scrollTop < 1) {
    el.scrollTop = 0;
  }
};

// On the scrollable div:
<div ref={scrollRef} onScroll={handleScroll} className="overflow-y-auto flex-1 scrollbar-hide">
```

### Files to modify
- `src/components/TeamDetail.tsx`
- `src/components/CompetitionDetail.tsx`

