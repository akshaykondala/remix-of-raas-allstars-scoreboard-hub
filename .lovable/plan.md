

## Fix: Easier Drawer Dismissal + Prevent Handle Covering Logos

### Problem 1: Hard to swipe down to dismiss
The vaul drawer library uses a `closeThreshold` prop (default 0.25 -- user must drag 25% of drawer height). We'll lower this significantly and also increase the drag handle's touch target so there's more area to grab.

### Problem 2: Drag handle overlaps logos
The sticky drag handle container sits on top of the scrollable content. The current handle area is ~30px tall (`mt-4` + `my-[14px]` + `h-2`), but header padding is only `pt-[28px]`. Because the handle is `sticky top-0 z-10`, it overlaps the top of the content beneath it.

**Fix**: Increase the handle's touch target height and increase header top padding to guarantee no overlap.

### Changes

**File: `src/components/ui/drawer.tsx`**
1. Pass `closeThreshold={0.15}` to the vaul Root -- user only needs to drag 15% to dismiss (was 25%)
2. Increase the drag handle touch target: taller padding area (e.g., `py-4` instead of `my-[14px]`) for easier grabbing. Total handle container height becomes ~40px.

**File: `src/components/TeamDetail.tsx`**
1. Change header `pt-[28px]` to `pt-[44px]` to ensure the logo clears the sticky drag handle on all devices.

**File: `src/components/CompetitionDetail.tsx`**
1. Same change: header `pt-[28px]` to `pt-[44px]`.

### Technical Detail

| File | Line(s) | Change |
|------|---------|--------|
| `src/components/ui/drawer.tsx` | ~4-7 | Add `closeThreshold={0.15}` to DrawerPrimitive.Root |
| `src/components/ui/drawer.tsx` | ~24-26 | Increase handle touch area: `py-5` padding, wider handle bar |
| `src/components/TeamDetail.tsx` | ~66 | `pt-[28px]` -> `pt-[44px]` |
| `src/components/CompetitionDetail.tsx` | ~247 | `pt-[28px]` -> `pt-[44px]` |

