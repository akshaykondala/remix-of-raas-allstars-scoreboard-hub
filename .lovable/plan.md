

## Fix Drawer Dismissal on Mobile

### Problem

The team and competition detail views use a Vaul `Drawer` component that takes up 98vh. When users scroll down within the drawer content, Vaul cannot distinguish between "scroll up" and "drag to dismiss," so it blocks the dismiss gesture. Users get trapped with no obvious way to close the view.

### Solution

Add a visible close/back button to the top of both drawers. This gives users a reliable tap target to dismiss regardless of scroll position.

### Changes

**1. `src/components/TeamDetail.tsx`**
- Add a sticky close button (X icon) positioned at the top-right of the drawer, inside the scrollable area but visually fixed
- Use an `X` or `ChevronDown` icon from lucide-react
- Wire it to the existing `handleOpenChange(false)` logic

**2. `src/components/CompetitionDetail.tsx`**
- Same treatment: add a sticky close button at the top-right of the drawer content
- Wire to the existing close handler

### Technical detail

In both files, add a button just inside the `DrawerContent`, before the scrollable div:

```tsx
<button
  onClick={() => handleOpenChange(false)}
  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white"
>
  <X className="h-5 w-5" />
</button>
```

Position it with `absolute` relative to the `DrawerContent` (which is already `fixed`), so it stays visible at all times. This is a minimal, non-breaking change that solves the usability problem without altering the drawer scroll mechanics.

### Files to modify

- `src/components/TeamDetail.tsx` -- add close button
- `src/components/CompetitionDetail.tsx` -- add close button

