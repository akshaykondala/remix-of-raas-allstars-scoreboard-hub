

## Fix Drawer Swipe-to-Dismiss (Take 2)

### Why the Previous Fix Didn't Work

The `onScroll` handler fires **after** the scroll settles, but vaul reads `scrollTop` during the **touch event sequence** (`touchstart`/`touchmove`). So by the time our `onScroll` snaps `scrollTop` to 0, vaul has already decided "this container is scrolled, don't allow drag-to-dismiss."

Additionally, Safari's momentum scrolling can leave `scrollTop` at values up to ~3px, not just sub-pixel values. The threshold of `< 1` was too tight.

### New Approach

1. **Add a `touchstart` listener** that snaps `scrollTop` to 0 if it's below a small threshold (e.g., 3px). This runs *before* vaul processes the touch, so vaul will see `scrollTop === 0` and allow drag-to-dismiss.
2. **Keep the `onScroll` handler** with a wider threshold as a secondary safety net.

### Changes

**`src/components/TeamDetail.tsx`** and **`src/components/CompetitionDetail.tsx`**

Replace the current scroll-snap logic:

```tsx
const scrollRef = useRef<HTMLDivElement>(null);

const handleScroll = () => {
  const el = scrollRef.current;
  if (el && el.scrollTop > 0 && el.scrollTop < 1) {
    el.scrollTop = 0;
  }
};
```

With:

```tsx
const scrollRef = useRef<HTMLDivElement>(null);

// Snap near-zero scrollTop to exactly 0 so vaul allows drag-to-dismiss
const snapScrollTop = () => {
  const el = scrollRef.current;
  if (el && el.scrollTop > 0 && el.scrollTop < 3) {
    el.scrollTop = 0;
  }
};

// Run before vaul processes touch events
const handleTouchStart = () => {
  snapScrollTop();
};

const handleScroll = () => {
  snapScrollTop();
};
```

And on the scrollable div, add the `onTouchStart` handler:

```tsx
<div
  ref={scrollRef}
  onScroll={handleScroll}
  onTouchStart={handleTouchStart}
  className="overflow-y-auto flex-1 scrollbar-hide"
>
```

### Files to Modify
- `src/components/TeamDetail.tsx`
- `src/components/CompetitionDetail.tsx`

