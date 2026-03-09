

## Fix Drawer Handle — Draggable but Clean

### Problem
The drawer handle's touch target (`py-3` = 12px top/bottom) is too small to reliably grab and drag down. Previously it was made larger but looked ugly with too much visible backdrop.

### Solution
Enlarge the **touch target** without enlarging the **visible backdrop**. Use transparent padding to create a generous drag zone while keeping the visual handle area compact.

### Changes

**`src/components/ui/drawer.tsx` (line 24–26)** — Replace the drag handle div:

- Change `py-3` to `pt-5 pb-4` for a bigger touch target (total ~36px)
- Keep the handle bar itself small (`h-1.5 w-[40px]`) for a sleek, modern look
- Add `touch-action: none` on the handle area to prevent scroll interference and ensure drag-down works reliably

The handle bar styling: thinner (`h-1.5` instead of `h-2`), narrower (`w-[40px]` instead of `w-[100px]`), with slightly translucent muted color — this is the standard iOS-style pill indicator that looks native and clean.

```tsx
<div className="sticky top-0 z-10 flex justify-center bg-inherit rounded-t-[10px] pt-5 pb-4" style={{ touchAction: 'none' }}>
  <div className="h-1.5 w-[40px] rounded-full bg-muted/60" />
</div>
```

This gives a large drag zone (~36px) while the visual indicator stays subtle and native-looking.

