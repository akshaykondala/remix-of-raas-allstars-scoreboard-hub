

## Extend Swipe Area Below Competition Cards

The swipe handlers (`onTouchStart`, `onTouchMove`, `onTouchEnd`) currently live on the outermost `div` inside `CompetitionTimeline`, which only covers the timeline dots and the card area. Empty space below the cards is part of `CompetitionsTab`, not the timeline.

### Approach

**`src/components/CompetitionTimeline.tsx`**: Export the swipe navigation via a callback so the parent can also trigger week changes — actually, simpler: make the timeline container fill all remaining vertical space so the touch target extends to the bottom of the screen.

Change the outermost `div` of `CompetitionTimeline` (currently `className="w-full select-none"`) to also include `min-h-[calc(100vh-env(safe-area-inset-top,0px)-6rem)]` (or `flex-1` if the parent uses flex-col). This makes the swipe area extend to the bottom of the viewport, covering the blank space.

**`src/components/CompetitionsTab.tsx`**: Ensure the flex container wrapping the timeline uses `flex-1` and the parent div uses `min-h-screen` or similar so the timeline can grow to fill space.

### Changes

1. **`src/components/CompetitionsTab.tsx`** line 198: Change wrapper to `className="flex flex-col items-center w-full flex-1"` and the outer div (line 170) to include `min-h-screen` and use flex column layout.

2. **`src/components/CompetitionTimeline.tsx`**: Add `flex-1` to the outermost div so it stretches to fill the parent, making the entire blank area below cards swipeable.

