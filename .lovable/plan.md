

## Plan: Fix Notch Safe Area — Use Proper Pixel Values

### Problem
The current `env(safe-area-inset-top)` approach added too much padding, pushing the logo too far down. The drawer handle backdrop also extends too far past the actual handle, looking odd.

### Research
The iPhone Dynamic Island/notch safe area inset is **59px** on iPhone 14 Pro/15 Pro (Dynamic Island) and **47px** on older notch models (iPhone X–13). The `env(safe-area-inset-top)` CSS variable returns the correct value per device, so the variable itself is correct — the issue is that we're *adding* too much extra padding on top of it.

### Changes

**1. `src/pages/Index.tsx` (line ~400)**
- Current: `paddingTop: 'calc(env(safe-area-inset-top, 0px) + 2.5rem)'` — this adds 40px on top of the ~50px safe area = ~90px total, way too much.
- Fix: Reduce the extra padding to just `0.5rem` (8px), so the logo sits snugly below the notch:
  ```tsx
  style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)' }}
  ```

**2. `src/components/ui/drawer.tsx` (line 24)**
- Current: `py-5` (20px top+bottom padding) plus `paddingTop: 'calc(env(safe-area-inset-top, 0px) + 1.25rem)'` — creates an oversized backdrop above the handle.
- Fix: Remove the `py-5` class, use minimal padding so the handle area is compact:
  ```tsx
  <div className="sticky top-0 z-10 flex justify-center bg-inherit rounded-t-[10px] py-3">
  ```
  Remove the inline `paddingTop` style entirely. The drawer is a bottom sheet — it doesn't reach the notch area unless fully expanded, and even then the safe area inset is excessive for a drag handle. Just use `py-3` (12px top and bottom) for a tight handle area.

### Summary
- Header: reduce extra padding from `2.5rem` to `0.5rem` so logo is close to the notch, not pushed way down
- Drawer: remove safe-area top padding and reduce handle padding from `py-5` to `py-3` for a compact handle area

