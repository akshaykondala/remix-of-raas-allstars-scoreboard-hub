

## Fix: Drawer Handle Behind Notch

### Problem
The drawer is a bottom sheet with `mt-24` controlling its maximum height. When fully expanded, the top of the drawer (and the drag handle) slides behind the notch/Dynamic Island.

### Solution
On line 23 of `src/components/ui/drawer.tsx`, the `DrawerPrimitive.Content` has `mt-24` as the top margin. This needs to also account for the safe area inset so the drawer never extends into the notch area.

**Change:** Replace the static `mt-24` class with an inline style that combines both values:

```tsx
<DrawerPrimitive.Content 
  ref={ref} 
  className={cn("fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col rounded-t-[10px] border bg-background", className)} 
  style={{ marginTop: 'calc(env(safe-area-inset-top, 0px) + 6rem)' }}
  {...props}
>
```

This ensures the drawer stops just below the notch on notched devices, while keeping the same `6rem` (96px) gap on non-notched devices. One line change, one file.

