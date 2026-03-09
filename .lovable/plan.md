

## Fix Drawer Top Corners — Fully Rounded

The drawer content has `rounded-t-[10px]` but the sticky handle bar div also has `rounded-t-[10px]` with `bg-inherit`. The issue is the outer `DrawerPrimitive.Content` container has `border` which creates a visible square/sharp edge effect at the top corners.

### Change

**`src/components/ui/drawer.tsx`, line 23** — increase the top border radius to make the rounding more pronounced and visually smooth:

- Change `rounded-t-[10px]` to `rounded-t-[20px]` on the `DrawerPrimitive.Content` element
- Also update the handle div on line 24 to match: `rounded-t-[20px]`

This ensures both the container and the sticky handle area share a consistent, visibly rounded top.

